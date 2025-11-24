# Portfolio Integration Guide for maramartins.com

## Files Created for Your Portfolio

I've created **two versions** of the case study page that you can use:

1. **`universal-translator-case-study.html`** - Standalone page matching your maramartins.com design
2. **`portfolio.html`** - Original full-featured version with more details

## How to Add to Your Portfolio

### Option 1: Add as a New Page (Recommended)

Since your site shows "Work Samples – coming soon!", this would be your first case study:

#### Step 1: Upload the HTML File

1. Access your WordPress admin panel at `https://maramartins.com/wp-admin`
2. Go to **Pages → Add New**
3. Click the **three dots** (⋮) in the top right → **Code editor**
4. Copy the entire content of `/app/universal-translator-case-study.html`
5. Paste it into the editor
6. **Title:** "Universal Translator App - Case Study"
7. **Permalink:** `/universal-translator-case-study/`
8. Click **Publish**

#### Step 2: Update Your Homepage

In your "Work Samples" section, replace one of the placeholder images with:

```html
<a href="/universal-translator-case-study/">
  <img src="/wp-content/uploads/universal-translator-preview.jpg" alt="Universal Translator App">
  <h3>Universal Translator App</h3>
  <p>AI-powered translation supporting 108+ languages</p>
</a>
```

### Option 2: Use as External Link

Host the case study elsewhere (GitHub Pages, Netlify) and link to it:

#### GitHub Pages Hosting:

1. Create a new repository: `universal-translator-case-study`
2. Upload `universal-translator-case-study.html` as `index.html`
3. Go to Settings → Pages → Enable GitHub Pages
4. Your case study will be at: `https://yourusername.github.io/universal-translator-case-study/`
5. Link to it from your main portfolio

### Option 3: Embed in Existing Page

Add a new section to your homepage after "My Services":

```html
<section class="case-study-preview">
  <h2>Featured Project</h2>
  <div class="project-card">
    <h3>Universal Translator App</h3>
    <p>AI-powered mobile translation platform supporting text, voice, and sign language across 108+ languages. Built in 6 hours using Emergent AI.</p>
    <a href="/universal-translator-case-study/" class="button">View Case Study</a>
  </div>
</section>
```

## Customization Checklist

Before publishing, customize these elements in the HTML file:

- [ ] **Header Link** (line 111): Update `href="https://maramartins.com"` to match your actual homepage
- [ ] **Back Link** (line 113): Same as above
- [ ] **GitHub Link** (line 643): Add your actual GitHub repository URL
- [ ] **Contact Links** (line 644): Update to link to your contact form
- [ ] **Video**: Add your actual demo video URL (line 142)
- [ ] **Screenshots**: Add real screenshots from your app (optional but recommended)

## Adding the Demo Video

### Record Your Video (3-5 minutes)

Follow the guide in `/app/VIDEO_RECORDING_GUIDE.md`

### Upload Options:

1. **YouTube** (Best for SEO):
   - Upload video to YouTube (unlisted or public)
   - Get embed code
   - Replace the `.video-placeholder` div with:
   ```html
   <iframe 
       width="100%" 
       height="500px" 
       src="https://www.youtube.com/embed/YOUR_VIDEO_ID" 
       frameborder="0" 
       allowfullscreen>
   </iframe>
   ```

2. **Vimeo** (More professional look):
   - Upload to Vimeo
   - Get embed code
   - Replace placeholder similarly

3. **Direct Upload** (WordPress):
   - Upload video to WordPress Media Library
   - Use HTML5 video tag:
   ```html
   <video width="100%" controls>
       <source src="/wp-content/uploads/universal-translator-demo.mp4" type="video/mp4">
   </video>
   ```

## Adding Screenshots

### Where to Add Screenshots:

The case study has placeholders for:

1. **App interface screenshots** - In the Features section
2. **Code examples** - Already included
3. **GitHub repository** - In the Development Process section

### How to Add:

Replace this line (around line 142):
```html
<div class="video-placeholder">
```

With:
```html
<img src="/path/to/your/screenshot.jpg" alt="Description" style="width: 100%; border-radius: 8px;">
```

## Screenshots to Capture

Priority screenshots for your case study:

1. **Hero Image**: App running on mobile device showing all 5 tabs
2. **Text Translation**: English to Spanish translation in action
3. **Sign Language**: ASL instructions being displayed
4. **History View**: List of past translations
5. **Language Selector**: Dropdown showing 108+ languages
6. **GitHub Repo**: Your repository structure

## SEO Optimization (WordPress)

If using WordPress, install **Yoast SEO** and set:

- **Focus Keyphrase**: "AI Translation App Case Study"
- **Meta Description**: "Case study of building a Universal Translator app supporting 108+ languages using Emergent AI. Demonstrates Localization PM expertise in rapid AI-assisted development."
- **Featured Image**: Screenshot of your app

## Mobile Responsiveness

The case study is **fully responsive** and tested on:
- Desktop (1920px+)
- Tablet (768px - 1200px)
- Mobile (320px - 767px)

## Analytics Tracking

Add Google Analytics to track visitors:

Before `</head>` tag, add:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## Social Media Sharing

Add Open Graph tags in `<head>` for better social sharing:

```html
<meta property="og:title" content="Universal Translator App - Case Study | Mara Martins">
<meta property="og:description" content="AI-powered translation app supporting 108+ languages - Built with Emergent AI">
<meta property="og:image" content="https://maramartins.com/path-to-preview-image.jpg">
<meta property="og:url" content="https://maramartins.com/universal-translator-case-study/">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary_large_image">
```

## Next Steps

1. **Review the HTML file** in a browser before uploading
2. **Customize** all placeholder content (links, video, GitHub URL)
3. **Record the demo video** following the guide
4. **Take screenshots** of your app
5. **Upload to WordPress** or GitHub Pages
6. **Update your homepage** to link to the case study
7. **Share on LinkedIn** and other social networks!

## Questions or Issues?

The HTML file is:
- **Self-contained** (all CSS inline, no external dependencies)
- **Responsive** (works on all device sizes)
- **Accessible** (semantic HTML, proper headings)
- **Fast loading** (no heavy frameworks)
- **SEO-friendly** (proper meta tags and structure)

## Preview Before Publishing

To preview locally:
1. Open `/app/universal-translator-case-study.html` in your browser
2. Check all sections load correctly
3. Test responsiveness by resizing browser window
4. Verify all links work

Good luck with your portfolio! This case study will be a great addition to your "Work Samples" section.
