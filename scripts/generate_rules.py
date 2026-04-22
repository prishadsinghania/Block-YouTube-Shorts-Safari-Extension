#!/usr/bin/env python3
"""Generate blocking rules for the Safari extension."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUTPUT_PATH = ROOT / "config" / "block_rules.json"


def build_rules() -> dict:
    """Create rules consumed by extension logic."""
    return {
        "version": 1,
        "sites": {
            "youtube": {
                "hosts": ["www.youtube.com"],
                "block_path_prefixes": ["/shorts/"],
                "hide_css_selectors": [
                    "a[href^='/shorts/']",
                    "ytd-reel-item-renderer",
                    "ytd-reel-shelf-renderer",
                    "ytd-rich-shelf-renderer[is-shorts]",
                ],
            },
            "tiktok": {
                "hosts": ["www.tiktok.com", "m.tiktok.com"],
                "block_strategy": "overlay",
                "overlay_message": "TikTok is blocked by Short-Form Video Blocker.",
            },
            "instagram": {
                "hosts": ["www.instagram.com"],
                "block_path_prefixes": ["/reels/", "/reel/"],
                "block_strategy": "redirect_and_hide",
                "overlay_message": "Instagram Reels is blocked by Short-Form Video Blocker.",
            },
            "facebook": {
                "hosts": ["www.facebook.com", "m.facebook.com"],
                "block_path_prefixes": ["/reel/", "/watch/"],
                "block_strategy": "redirect_and_hide",
                "overlay_message": "Facebook Reels/Watch is blocked by Short-Form Video Blocker.",
            },
            "snapchat": {
                "hosts": ["www.snapchat.com"],
                "block_path_prefixes": ["/spotlight"],
                "block_strategy": "redirect",
                "overlay_message": "Snapchat Spotlight is blocked by Short-Form Video Blocker.",
            },
            "pinterest": {
                "hosts": ["www.pinterest.com"],
                "block_path_prefixes": ["/ideas/"],
                "block_strategy": "redirect",
                "overlay_message": "Pinterest Ideas is blocked by Short-Form Video Blocker.",
            },
        },
    }


def main() -> None:
    rules = build_rules()
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(rules, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote rules to: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
