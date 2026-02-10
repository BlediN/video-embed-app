# video-embed-app
Embedding videos in a page

## Features

- **4 Live Video Channels**: Displays 4 different video streams simultaneously in a grid layout
- **Auto-play**: All videos start playing automatically
- **Smart Muting**: Only one video is unmuted at a time (first video by default)
- **Mute/Unmute Next**: Cycle through videos to change which one is unmuted
- **Refresh Videos**: Reload all video streams in place
- **Responsive Design**: Adapts to different screen sizes

## Usage

Simply open `index.html` in a web browser:

```bash
# Using Python's built-in server
python3 -m http.server 8000

# Or using Node.js http-server
npx http-server

# Or just open directly
open index.html  # macOS
xdg-open index.html  # Linux
start index.html  # Windows
```

Then navigate to `http://localhost:8000` in your browser.

## Controls

- **Mute/Unmute Next**: Click this button to cycle through the videos. The currently unmuted video will be muted, and the next video in sequence will be unmuted.
- **Refresh Videos**: Click this button to reload all video streams in their current positions.

## Customization

To change the video sources, edit the `index.html` file and replace the YouTube video IDs in the iframe `src` attributes. The format is:

```
https://www.youtube.com/embed/{VIDEO_ID}?autoplay=1&mute={0|1}&controls=1&enablejsapi=1
```

For other video platforms (Twitch, Vimeo, etc.), replace the entire iframe `src` with the appropriate embed URL.
