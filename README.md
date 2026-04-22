# Short-Form Video Blocker

Safari extension to reduce short-form doomscrolling across web platforms.

## What it blocks

- YouTube Shorts
- TikTok web
- Instagram Reels
- Facebook Reels/ Watch TV page
- Snapchat Spotlight
- Pinterest Ideas
- Google `Short videos` modules and short-video viewers

When blocked, pages show a halt message:
`Get back to work. No more doomscrolling.❤️`

## Tech stack

- `extension/` - Safari Web Extension code (JavaScript)
- `scripts/generate_rules.py` - Python config generator
- `config/block_rules.json` - generated rules/config

## Important limitation

This blocks web content in Safari. It does not control native mobile apps directly (for example, the YouTube app or Instagram app UI on your iPhone).

## Setup (macOS)

Prerequisites:
- Safari
- Xcode
- Python 3

One-time Xcode CLI setup:

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -runFirstLaunch
```

## Run locally

From repo root:

```bash
python3 scripts/generate_rules.py
```

Generate the Xcode wrapper:

```bash
xcrun safari-web-extension-converter extension --project-location . --app-name "Short-Form Video Blocker" --bundle-identifier "com.example.shortformblocker"
```

Open project:

```bash
open "Short-Form Video Blocker/Short-Form Video Blocker.xcodeproj"
```

In Xcode:
1. Select `My Mac` target.
2. Set signing team for both app and extension targets.
3. Build/run (`Cmd + R`).
4. When prompted; enter your device login password.

In Safari:
1. Open Settings -> Extensions.
2. Enable `Short-Form Video Blocker Extension`.
3. Allow access to supported websites.