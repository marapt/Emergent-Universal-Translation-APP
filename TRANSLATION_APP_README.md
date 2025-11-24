# Universal Translation App

A comprehensive AI-powered mobile translation application that supports text, voice, and sign language translation across all languages.

## Features

### 1. **Text Translation**
- Translate text between 100+ languages
- Real-time translation using OpenAI GPT models
- Simple and intuitive interface
- Language swap functionality
- Translation history

### 2. **Voice Translation**
- Record audio in any language
- AI transcription using OpenAI Whisper
- Automatic translation
- Text-to-speech output in target language
- Play translated audio

### 3. **Sign Language to Text**
- Capture sign language gestures via camera or photo
- AI-powered interpretation using GPT-4 Vision
- Supports multiple sign languages (ASL, BSL, ISL, etc.)
- Real-time analysis

### 4. **Text to Sign Language**
- Convert text to sign language instructions
- Step-by-step signing guide
- Supports 8 major sign languages:
  - ASL (American Sign Language)
  - BSL (British Sign Language)
  - ISL (Indian Sign Language)
  - JSL (Japanese Sign Language)
  - LSF (French Sign Language)
  - Auslan (Australian Sign Language)
  - DGS (German Sign Language)
  - CSL (Chinese Sign Language)

### 5. **Translation History**
- View all past translations
- Timestamp tracking
- Pull to refresh

## Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **MongoDB**: Database for storing translation history
- **OpenAI APIs**:
  - GPT-4o-mini for text translation
  - Whisper for speech-to-text
  - TTS-1 for text-to-speech
  - GPT-4o Vision for sign language interpretation
- **Emergent LLM Key**: Universal API key for all OpenAI services

### Frontend
- **Expo**: React Native framework for mobile development
- **React Navigation**: Tab-based navigation
- **Expo Camera**: Camera access for sign language capture
- **Expo Audio**: Voice recording and playback
- **Axios**: HTTP client for API calls

## Supported Languages

### Spoken Languages (100+)
Afrikaans, Albanian, Amharic, Arabic, Armenian, Azerbaijani, Basque, Belarusian, Bengali, Bosnian, Bulgarian, Catalan, Cebuano, Chinese, Corsican, Croatian, Czech, Danish, Dutch, English, Esperanto, Estonian, Finnish, French, Frisian, Galician, Georgian, German, Greek, Gujarati, Haitian Creole, Hausa, Hawaiian, Hebrew, Hindi, Hmong, Hungarian, Icelandic, Igbo, Indonesian, Irish, Italian, Japanese, Javanese, Kannada, Kazakh, Khmer, Kinyarwanda, Korean, Kurdish, Kyrgyz, Lao, Latin, Latvian, Lithuanian, Luxembourgish, Macedonian, Malagasy, Malay, Malayalam, Maltese, Maori, Marathi, Mongolian, Myanmar, Nepali, Norwegian, Nyanja, Odia, Pashto, Persian, Polish, Portuguese, Punjabi, Romanian, Russian, Samoan, Scots Gaelic, Serbian, Sesotho, Shona, Sindhi, Sinhala, Slovak, Slovenian, Somali, Spanish, Sundanese, Swahili, Swedish, Tagalog, Tajik, Tamil, Tatar, Telugu, Thai, Turkish, Turkmen, Ukrainian, Urdu, Uyghur, Uzbek, Vietnamese, Welsh, Xhosa, Yiddish, Yoruba, Zulu

### Sign Languages (8)
- American Sign Language (ASL)
- British Sign Language (BSL)
- Indian Sign Language (ISL)
- Japanese Sign Language (JSL)
- French Sign Language (LSF)
- Australian Sign Language (Auslan)
- German Sign Language (DGS)
- Chinese Sign Language (CSL)

## API Endpoints

### Translation
- `POST /api/translate` - Translate text between languages
- `POST /api/voice-translate` - Transcribe, translate, and synthesize speech
- `POST /api/sign-to-text` - Interpret sign language from image
- `POST /api/text-to-sign` - Convert text to sign language instructions

### Utility
- `GET /api/history` - Get translation history
- `GET /api/supported-languages` - Get all supported languages

## Current Status

### Working Features
✅ Text translation (OpenAI GPT)
✅ Voice translation (OpenAI Whisper + TTS)
✅ Sign language interpretation (GPT-4 Vision)
✅ Text to sign language descriptions
✅ Translation history
✅ 100+ language support
✅ 8 sign languages support
✅ Mobile-optimized UI
✅ Tab-based navigation

### Placeholder Features (Requires API Keys)
⏳ Google Cloud Translation API
⏳ Google Cloud Speech-to-Text
⏳ Azure Translator
⏳ Azure Speech Services

## Permissions Required

- **Camera**: For capturing sign language gestures
- **Microphone**: For voice recording
- **Photo Library**: For selecting sign language images

## Accessibility Features

- Large, touch-friendly buttons (minimum 44x44 points)
- Clear visual feedback
- Simple navigation
- High contrast colors
- Screen reader compatible
- Keyboard handling for text input
- Safe area support for notched devices

## Future Enhancements

1. Add Google Cloud Translation API integration
2. Add Azure Translator integration
3. Real-time video sign language translation
4. Offline translation mode
5. Conversation mode (back-and-forth translation)
6. Saved phrases and favorites
7. Multi-service comparison
8. Cost tracking per service
9. Sign language video demonstrations
10. Voice accent selection

## Notes

- The app uses the Emergent LLM Key for OpenAI services (included)
- To add Google/Azure services, provide API keys in backend/.env
- All translations are saved to MongoDB for history tracking
- Audio files are temporarily stored and cleaned up automatically
- Sign language interpretation is AI-powered and may not be 100% accurate

## Support

For issues or questions about the app, please check the backend logs or frontend console for error messages.
