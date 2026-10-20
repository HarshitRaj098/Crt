# CRT TV — Analog Browser

A retro CRT-inspired web app with scanlines, phosphor glow, flicker/glitch effects, browser mode, YouTube mode, and a static channel.

## Run it
No build step or API key required.

1. Download or clone this repository.
2. Open `index.html` in a modern browser.

For best results, serve the folder locally (for example with VS Code Live Server or `python -m http.server 8000`) and open `http://localhost:8000`.

## Features
- CRT television casing and controls
- Browser mode with address/search input
- YouTube mode: direct video URLs, `youtu.be` links, and search terms
- Static/no-signal channel
- Always-on glitch effect with flicker, RGB-style color distortion, jitter, and intermittent scan tears
- External-open fallback for sites that block iframe embedding
- Responsive layout and reduced-motion support

## Limitations
This is a frontend-only prototype. Many websites block iframe embedding through their security headers. The app provides an **OPEN EXTERNALLY** fallback for those sites. YouTube search is performed through the public website; no YouTube Data API key is used.

## Deploy
Can be hosted as a static site using GitHub Pages, Netlify, or Vercel.
