# Video Recording Guide for Portfolio

## Equipment Needed
- Your mobile device with the app installed (Expo Go)
- Screen recording capability (iOS: built-in, Android: built-in or third-party app)
- Optional: Voiceover recording capability

## Video Structure (3-5 minutes)

### Introduction (15 seconds)
- Show splash screen: "Universal Translator App"
- Brief text overlay: "AI-Powered Translation for 108+ Languages"

### Feature Demo 1: Text Translation (45 seconds)
**What to show:**
1. Navigate to Text Translation tab
2. Select English → Spanish
3. Type: "Hello, how are you today?"
4. Tap "Translate" button
5. Show result: "Hola, ¿cómo estás hoy?"
6. Tap language swap button
7. Translate back to English
8. Show a few more examples (French, Chinese, Arabic)

**Voiceover script:**
"The app translates text between 108 spoken languages in real-time using OpenAI's GPT-4o-mini. The interface is clean and intuitive with instant results."

### Feature Demo 2: Text to Sign Language (45 seconds)
**What to show:**
1. Navigate to "Text→Sign" tab
2. Select ASL (American Sign Language)
3. Type: "Hello friend"
4. Tap "Convert to Sign Language"
5. Show the detailed step-by-step signing instructions
6. Try another example with BSL (British Sign Language)

**Voiceover script:**
"The app provides detailed instructions for signing any text in 8 different sign languages, making content accessible to deaf and hard-of-hearing communities worldwide."

### Feature Demo 3: Translation History (30 seconds)
**What to show:**
1. Navigate to History tab
2. Show list of past translations
3. Pull down to refresh
4. Scroll through entries showing timestamps

**Voiceover script:**
"All translations are automatically saved with timestamps, making it easy to reference past conversations."

### Feature Demo 4: Voice Translation Limitation (30 seconds)
**What to show:**
1. Navigate to Voice tab
2. Tap the record button
3. Show the error message about API key
4. Display the limitation notice on screen

**Voiceover script:**
"The voice translation feature structure is complete but requires an OpenAI API key, as it uses Whisper and TTS APIs which aren't included in the Emergent LLM key. This is clearly documented for transparency."

### Feature Demo 5: Sign Language to Text (20 seconds)
**What to show:**
1. Navigate to "Sign→Text" tab
2. Show the camera/gallery options
3. Mention it's ready but needs testing with actual sign language images

**Voiceover script:**
"The sign language to text feature uses GPT-4 Vision to interpret sign language gestures from photos or camera, expanding accessibility even further."

### Technology Overview (30 seconds)
**What to show:**
- Quick scroll through the codebase (optional)
- Show README or documentation
- Display technology stack on screen:
  * Frontend: Expo React Native
  * Backend: FastAPI + MongoDB
  * AI: OpenAI GPT-4o-mini, GPT-4 Vision
  * Time to build: ~6 hours

**Voiceover script:**
"Built entirely using Emergent AI in approximately 6 hours, this full-stack mobile app demonstrates how AI-assisted development can dramatically accelerate time-to-market while maintaining professional quality."

### Closing (15 seconds)
**What to show:**
- Return to home screen
- Show QR code for Expo Go (if available)
- Text overlay with GitHub link

**Voiceover script:**
"The complete source code is available on GitHub. This project showcases how localization expertise combined with AI tools can rapidly build globally-ready applications."

## Recording Tips

### For iOS:
1. Settings → Control Center → Add "Screen Recording"
2. Swipe down from top-right → Tap record button
3. Wait for 3-second countdown
4. Navigate through app features
5. Stop recording from control center

### For Android:
1. Swipe down notification panel twice
2. Tap "Screen Record" quick setting
3. Start recording
4. Navigate through app features
5. Stop from notification

## Post-Production (Optional)

### Recommended Edits:
1. **Add text overlays** for feature names as you demo them
2. **Speed up** any slow parts (2x speed)
3. **Add background music** (subtle, professional)
4. **Include captions** for accessibility
5. **Add your logo/watermark** in corner
6. **Export at 1080p** for quality

### Free Tools:
- **DaVinci Resolve** (Desktop, free, powerful)
- **iMovie** (Mac/iOS, free, simple)
- **Clipchamp** (Web-based, free tier)
- **CapCut** (Mobile/Desktop, free, popular)

## Alternative: Screen Capture with Loom/Zoom

If you want to add voiceover more easily:
1. Use **Loom** or **Zoom** to record your screen
2. Share your mobile screen via mirroring software:
   - iOS: QuickTime Player (Mac)
   - Android: scrcpy or Vysor
3. Record while narrating
4. Edit and export

## Video Hosting

Upload to:
- **YouTube** (unlisted or public)
- **Vimeo** (professional look)
- **GitHub README** (direct video embed)

Then embed in your portfolio HTML:

```html
<div class="video-container">
    <iframe 
        width="100%" 
        height="500px" 
        src="YOUR_VIDEO_URL" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
    </iframe>
</div>
```

## Screenshots to Capture

In addition to video, capture these screenshots for the portfolio:

1. **Text Translation** - Showing English to Spanish translation
2. **Sign Language** - Showing ASL instructions
3. **History View** - Showing translation history list
4. **Voice Error** - Showing the limitation message
5. **Language Picker** - Showing the 108+ languages
6. **Mobile Overview** - All 5 tabs visible at bottom

## Final Checklist

- [ ] Video recorded (3-5 minutes)
- [ ] Voiceover added (optional but recommended)
- [ ] Text overlays for features
- [ ] Limitation clearly shown
- [ ] Clean audio (no background noise)
- [ ] Professional export (1080p, MP4)
- [ ] Uploaded to hosting platform
- [ ] Embedded in portfolio.html
- [ ] Screenshots captured and added
- [ ] Tested on desktop and mobile browsers

Good luck with your portfolio video!
