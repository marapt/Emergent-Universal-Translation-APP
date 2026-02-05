from fastapi import FastAPI, APIRouter, HTTPException, File, UploadFile
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime
import base64
import io
from PIL import Image
import asyncio

# Import emergentintegrations for LLM
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Get Emergent LLM Key
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

# Get OpenAI API Key for Vision and Audio features
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

class TranslationRequest(BaseModel):
    text: str
    source_language: str
    target_language: str
    service: str = "openai"  # openai, google, azure

class TranslationResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    original_text: str
    translated_text: str
    source_language: str
    target_language: str
    service: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class VoiceTranslationRequest(BaseModel):
    audio_base64: str
    source_language: str
    target_language: str
    service: str = "openai"
    user_api_key: Optional[str] = None  # User's own OpenAI API key

class VoiceTranslationResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    transcribed_text: str
    translated_text: str
    audio_base64: Optional[str] = None
    source_language: str
    target_language: str
    service: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class SignLanguageRequest(BaseModel):
    image_base64: str
    target_language: str = "en"
    service: str = "openai"

class SignLanguageResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    interpreted_text: str
    target_language: str
    service: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class TextToSignRequest(BaseModel):
    text: str
    sign_language: str = "ASL"  # ASL, BSL, ISL, etc.
    service: str = "openai"

class TextToSignResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    text: str
    sign_description: str
    sign_language: str
    service: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class HistoryItem(BaseModel):
    id: str
    type: str  # translation, voice, sign_to_text, text_to_sign
    data: Dict[str, Any]
    timestamp: datetime

# ==================== HELPER FUNCTIONS ====================

async def translate_with_openai(text: str, source_lang: str, target_lang: str) -> str:
    """Translate text using OpenAI GPT"""
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"translate_{uuid.uuid4()}",
            system_message=f"You are a professional translator. Translate the given text from {source_lang} to {target_lang}. Only provide the translation, no explanations."
        ).with_model("openai", "gpt-4o-mini")
        
        user_message = UserMessage(text=text)
        response = await chat.send_message(user_message)
        return response
    except Exception as e:
        logger.error(f"OpenAI translation error: {e}")
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")

async def transcribe_audio_openai(audio_base64: str, language: str) -> str:
    """Transcribe audio using OpenAI Whisper"""
    try:
        # For Whisper API, we need to use the OpenAI client directly with user's API key
        from openai import AsyncOpenAI
        client = AsyncOpenAI(api_key=OPENAI_API_KEY)
        
        # Decode base64 audio
        audio_bytes = base64.b64decode(audio_base64)
        
        # Create a file-like object
        audio_file = io.BytesIO(audio_bytes)
        audio_file.name = "audio.m4a"
        
        # Transcribe
        transcription = await client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            language=language if language != "auto" else None
        )
        
        return transcription.text
    except Exception as e:
        logger.error(f"Whisper transcription error: {e}")
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

async def text_to_speech_openai(text: str, language: str) -> str:
    """Convert text to speech using OpenAI TTS"""
    try:
        from openai import AsyncOpenAI
        client = AsyncOpenAI(api_key=OPENAI_API_KEY)
        
        # Determine voice based on language
        voices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]
        voice = "nova"  # Default voice
        
        response = await client.audio.speech.create(
            model="tts-1",
            voice=voice,
            input=text
        )
        
        # Get audio bytes and convert to base64
        audio_bytes = response.content
        audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
        
        return audio_base64
    except Exception as e:
        logger.error(f"TTS error: {e}")
        raise HTTPException(status_code=500, detail=f"Text-to-speech failed: {str(e)}")

async def interpret_sign_language(image_base64: str, target_lang: str) -> str:
    """Interpret sign language from image using GPT-4 Vision"""
    try:
        from openai import AsyncOpenAI
        client = AsyncOpenAI(api_key=OPENAI_API_KEY)
        
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": f"You are an expert in sign language interpretation. Analyze the image and describe what sign language gestures you see, then provide the meaning in {target_lang}. Be specific and accurate."
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "What sign language gesture is being shown in this image? Provide the interpretation."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_base64}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=500
        )
        
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"Sign language interpretation error: {e}")
        raise HTTPException(status_code=500, detail=f"Sign language interpretation failed: {str(e)}")

async def generate_sign_description(text: str, sign_language: str) -> str:
    """Generate sign language description for text"""
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"sign_{uuid.uuid4()}",
            system_message=f"You are an expert in {sign_language} (Sign Language). Describe step-by-step how to sign the given text in {sign_language}, including hand shapes, movements, and facial expressions."
        ).with_model("openai", "gpt-4o-mini")
        
        user_message = UserMessage(text=f"How do I sign: '{text}'")
        response = await chat.send_message(user_message)
        return response
    except Exception as e:
        logger.error(f"Sign description error: {e}")
        raise HTTPException(status_code=500, detail=f"Sign description failed: {str(e)}")

# ==================== ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "Translation API", "status": "active"}

@api_router.get("/portfolio")
async def serve_portfolio():
    """Serve the portfolio case study page"""
    from fastapi.responses import FileResponse
    return FileResponse("/app/universal-translator-case-study.html")

@api_router.get("/portfolio-original")
async def serve_portfolio_original():
    """Serve the original portfolio page"""
    from fastapi.responses import FileResponse
    return FileResponse("/app/portfolio.html")

@api_router.post("/translate", response_model=TranslationResponse)
async def translate_text(request: TranslationRequest):
    """Translate text between languages"""
    logger.info(f"Translation request: {request.source_language} -> {request.target_language}")
    
    try:
        if request.service == "openai":
            translated = await translate_with_openai(
                request.text,
                request.source_language,
                request.target_language
            )
        elif request.service == "google":
            # Placeholder for Google Translate
            raise HTTPException(status_code=501, detail="Google Translate requires API key")
        elif request.service == "azure":
            # Placeholder for Azure Translator
            raise HTTPException(status_code=501, detail="Azure Translator requires API key")
        else:
            raise HTTPException(status_code=400, detail="Invalid service")
        
        response = TranslationResponse(
            original_text=request.text,
            translated_text=translated,
            source_language=request.source_language,
            target_language=request.target_language,
            service=request.service
        )
        
        # Save to database
        await db.translations.insert_one(response.dict())
        
        return response
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Translation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/voice-translate", response_model=VoiceTranslationResponse)
async def voice_translate(request: VoiceTranslationRequest):
    """Transcribe audio, translate, and convert back to speech"""
    logger.info(f"Voice translation: {request.source_language} -> {request.target_language}")
    
    try:
        if request.service == "openai":
            # Step 1: Transcribe audio
            transcribed = await transcribe_audio_openai(
                request.audio_base64,
                request.source_language
            )
            
            # Step 2: Translate text
            translated = await translate_with_openai(
                transcribed,
                request.source_language,
                request.target_language
            )
            
            # Step 3: Convert to speech
            audio_base64 = await text_to_speech_openai(
                translated,
                request.target_language
            )
            
            response = VoiceTranslationResponse(
                transcribed_text=transcribed,
                translated_text=translated,
                audio_base64=audio_base64,
                source_language=request.source_language,
                target_language=request.target_language,
                service=request.service
            )
        else:
            raise HTTPException(status_code=501, detail=f"{request.service} not implemented")
        
        # Save to database
        await db.voice_translations.insert_one(response.dict())
        
        return response
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Voice translation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/sign-to-text", response_model=SignLanguageResponse)
async def sign_to_text(request: SignLanguageRequest):
    """Interpret sign language from image to text"""
    logger.info(f"Sign language interpretation to {request.target_language}")
    
    try:
        if request.service == "openai":
            interpreted = await interpret_sign_language(
                request.image_base64,
                request.target_language
            )
            
            response = SignLanguageResponse(
                interpreted_text=interpreted,
                target_language=request.target_language,
                service=request.service
            )
        else:
            raise HTTPException(status_code=501, detail=f"{request.service} not implemented")
        
        # Save to database
        await db.sign_interpretations.insert_one(response.dict())
        
        return response
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Sign interpretation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/text-to-sign", response_model=TextToSignResponse)
async def text_to_sign(request: TextToSignRequest):
    """Convert text to sign language description"""
    logger.info(f"Text to {request.sign_language} conversion")
    
    try:
        if request.service == "openai":
            description = await generate_sign_description(
                request.text,
                request.sign_language
            )
            
            response = TextToSignResponse(
                text=request.text,
                sign_description=description,
                sign_language=request.sign_language,
                service=request.service
            )
        else:
            raise HTTPException(status_code=501, detail=f"{request.service} not implemented")
        
        # Save to database
        await db.text_to_sign.insert_one(response.dict())
        
        return response
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Text to sign error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/history")
async def get_history(limit: int = 50):
    """Get translation history"""
    try:
        translations = await db.translations.find().sort("timestamp", -1).limit(limit).to_list(limit)
        # Convert MongoDB ObjectId to string for JSON serialization
        for translation in translations:
            if '_id' in translation:
                translation['_id'] = str(translation['_id'])
        return {"history": translations, "count": len(translations)}
    except Exception as e:
        logger.error(f"History fetch error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/supported-languages")
async def get_supported_languages():
    """Get list of supported languages"""
    # Common languages supported by most services
    languages = {
        "af": "Afrikaans", "sq": "Albanian", "am": "Amharic", "ar": "Arabic",
        "hy": "Armenian", "az": "Azerbaijani", "eu": "Basque", "be": "Belarusian",
        "bn": "Bengali", "bs": "Bosnian", "bg": "Bulgarian", "ca": "Catalan",
        "ceb": "Cebuano", "zh": "Chinese", "co": "Corsican", "hr": "Croatian",
        "cs": "Czech", "da": "Danish", "nl": "Dutch", "en": "English",
        "eo": "Esperanto", "et": "Estonian", "fi": "Finnish", "fr": "French",
        "fy": "Frisian", "gl": "Galician", "ka": "Georgian", "de": "German",
        "el": "Greek", "gu": "Gujarati", "ht": "Haitian Creole", "ha": "Hausa",
        "haw": "Hawaiian", "he": "Hebrew", "hi": "Hindi", "hmn": "Hmong",
        "hu": "Hungarian", "is": "Icelandic", "ig": "Igbo", "id": "Indonesian",
        "ga": "Irish", "it": "Italian", "ja": "Japanese", "jv": "Javanese",
        "kn": "Kannada", "kk": "Kazakh", "km": "Khmer", "rw": "Kinyarwanda",
        "ko": "Korean", "ku": "Kurdish", "ky": "Kyrgyz", "lo": "Lao",
        "la": "Latin", "lv": "Latvian", "lt": "Lithuanian", "lb": "Luxembourgish",
        "mk": "Macedonian", "mg": "Malagasy", "ms": "Malay", "ml": "Malayalam",
        "mt": "Maltese", "mi": "Maori", "mr": "Marathi", "mn": "Mongolian",
        "my": "Myanmar", "ne": "Nepali", "no": "Norwegian", "ny": "Nyanja",
        "or": "Odia", "ps": "Pashto", "fa": "Persian", "pl": "Polish",
        "pt": "Portuguese", "pa": "Punjabi", "ro": "Romanian", "ru": "Russian",
        "sm": "Samoan", "gd": "Scots Gaelic", "sr": "Serbian", "st": "Sesotho",
        "sn": "Shona", "sd": "Sindhi", "si": "Sinhala", "sk": "Slovak",
        "sl": "Slovenian", "so": "Somali", "es": "Spanish", "su": "Sundanese",
        "sw": "Swahili", "sv": "Swedish", "tl": "Tagalog", "tg": "Tajik",
        "ta": "Tamil", "tt": "Tatar", "te": "Telugu", "th": "Thai",
        "tr": "Turkish", "tk": "Turkmen", "uk": "Ukrainian", "ur": "Urdu",
        "ug": "Uyghur", "uz": "Uzbek", "vi": "Vietnamese", "cy": "Welsh",
        "xh": "Xhosa", "yi": "Yiddish", "yo": "Yoruba", "zu": "Zulu"
    }
    
    sign_languages = {
        "ASL": "American Sign Language",
        "BSL": "British Sign Language",
        "ISL": "Indian Sign Language",
        "JSL": "Japanese Sign Language",
        "LSF": "French Sign Language",
        "Auslan": "Australian Sign Language",
        "DGS": "German Sign Language",
        "CSL": "Chinese Sign Language"
    }
    
    return {
        "spoken_languages": languages,
        "sign_languages": sign_languages
    }

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db():
    """Create database indexes on startup"""
    try:
        # Create index on timestamp field for translations collection (for history queries)
        await db.translations.create_index([("timestamp", -1)])
        logger.info("Database indexes created successfully")
    except Exception as e:
        logger.warning(f"Index creation warning (may already exist): {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
