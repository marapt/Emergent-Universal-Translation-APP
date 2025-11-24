# Voice Translation Feature Limitation

## Current Status

The **Voice Translation** feature requires OpenAI's Whisper API (for speech-to-text) and TTS API (for text-to-speech), which are **NOT supported** by the Emergent LLM Key.

### What Works with Emergent LLM Key:
✅ Text Translation (GPT-4o-mini)
✅ Sign Language Interpretation (GPT-4 Vision)  
✅ Text to Sign Language descriptions (GPT-4o-mini)
✅ Translation History

### What Doesn't Work:
❌ Voice Translation (Whisper + TTS APIs not supported)

## Solutions

### Option 1: Provide Your Own OpenAI API Key (Recommended)
To enable voice translation, you can provide your own OpenAI API key:

1. Get an API key from: https://platform.openai.com/account/api-keys
2. Add it to `/app/backend/.env`:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```
3. The backend will automatically use it for Whisper and TTS

**Cost**: OpenAI Whisper and TTS are very affordable:
- Whisper: $0.006 per minute of audio
- TTS: $0.015 per 1,000 characters

### Option 2: Use Expo's Built-in Speech (Free, Limited)
The app can use Expo's free built-in speech synthesis:
- ✅ Free and works offline
- ❌ Limited voice quality
- ❌ No speech-to-text (only text-to-speech)
- ❌ Limited language support

### Option 3: Use Alternative Services
- Google Cloud Speech-to-Text + Text-to-Speech
- Azure Speech Services
- Both require their own API keys

## Current Implementation

The app is currently configured to use OpenAI's APIs, which require either:
1. Your own OpenAI API key, OR
2. A service that supports Whisper/TTS through the Emergent integration

The **Emergent LLM Key only supports text generation models**, not audio processing.

## Recommendation

For the best experience with voice translation:
1. Obtain an OpenAI API key (costs ~$5-10/month for moderate use)
2. Add it to the backend environment
3. Restart the backend service

The other features (text translation, sign language) work perfectly with the Emergent LLM Key!
