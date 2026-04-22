(() => {
  const HALT_MESSAGE = "Get back to work. No more doomscrolling.❤️";
  const YT_SHORTS_PATH_PREFIX = "/shorts/";
  const YT_HIDE_STYLE_ID = "yt-shorts-blocker-style";
  const TIKTOK_BLOCK_OVERLAY_ID = "tiktok-block-overlay";
  const TIKTOK_HIDE_STYLE_ID = "tiktok-block-style";
  const INSTAGRAM_REELS_PREFIX = "/reels/";
  const INSTAGRAM_REEL_PREFIX = "/reel/";
  const INSTAGRAM_HIDE_STYLE_ID = "instagram-reels-block-style";
  const INSTAGRAM_BLOCK_OVERLAY_ID = "instagram-block-overlay";
  const FACEBOOK_REELS_PREFIX = "/reel/";
  const FACEBOOK_REELS_PLURAL_PREFIX = "/reels/";
  const FACEBOOK_WATCH_PREFIX = "/watch";
  const FACEBOOK_HIDE_STYLE_ID = "facebook-reels-block-style";
  const FACEBOOK_BLOCK_OVERLAY_ID = "facebook-block-overlay";
  const SNAPCHAT_SPOTLIGHT_PREFIX = "/spotlight";
  const SNAPCHAT_BLOCK_OVERLAY_ID = "snapchat-block-overlay";
  const PINTEREST_IDEAS_PREFIX = "/ideas/";
  const PINTEREST_BLOCK_OVERLAY_ID = "pinterest-block-overlay";
  const GOOGLE_HIDE_STYLE_ID = "google-short-video-block-style";

  function isYouTubeHost() {
    return window.location.hostname === "www.youtube.com";
  }

  function isTikTokHost() {
    return (
      window.location.hostname === "www.tiktok.com" ||
      window.location.hostname === "m.tiktok.com"
    );
  }

  function isInstagramHost() {
    return window.location.hostname === "www.instagram.com";
  }

  function isGoogleHost() {
    return window.location.hostname === "www.google.com";
  }

  function isFacebookHost() {
    return (
      window.location.hostname === "www.facebook.com" ||
      window.location.hostname === "m.facebook.com"
    );
  }

  function isSnapchatHost() {
    return window.location.hostname === "www.snapchat.com";
  }

  function isPinterestHost() {
    return window.location.hostname === "www.pinterest.com";
  }

  function redirectIfYouTubeShortsPath() {
    if (window.location.pathname.startsWith(YT_SHORTS_PATH_PREFIX)) {
      haltAndRedirect("https://www.youtube.com/");
    }
  }

  function injectYouTubeHideStyles() {
    if (document.getElementById(YT_HIDE_STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = YT_HIDE_STYLE_ID;
    style.textContent = `
      ytd-rich-section-renderer,
      ytd-reel-shelf-renderer,
      ytd-rich-shelf-renderer[is-shorts],
      ytd-reel-item-renderer {
        display: none !important;
      }

      /* Hide Shorts navigation links */
      a[href^="/shorts/"],
      a[title="Shorts"],
      ytd-guide-entry-renderer a[href="/shorts"] {
        display: none !important;
      }
    `;

    document.documentElement.appendChild(style);
  }

  function removeVisibleYouTubeShortsCards() {
    const selectors = [
      "a[href^='/shorts/']",
      "ytd-reel-item-renderer",
      "ytd-reel-shelf-renderer",
      "ytd-rich-shelf-renderer[is-shorts]"
    ];

    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((node) => {
        const rootCard =
          node.closest("ytd-rich-item-renderer") ||
          node.closest("ytd-grid-video-renderer") ||
          node;
        if (rootCard && rootCard.style) {
          rootCard.style.display = "none";
        }
      });
    });
  }

  function injectTikTokStyles() {
    if (document.getElementById(TIKTOK_HIDE_STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = TIKTOK_HIDE_STYLE_ID;
    style.textContent = `
      main,
      article,
      [data-e2e="recommend-list-item-container"],
      [data-e2e="video-player"],
      [class*="DivVideoContainer"],
      [class*="DivItemContainer"],
      [class*="DivMainContainer"] {
        visibility: hidden !important;
      }
    `;
    document.documentElement.appendChild(style);
  }

  function injectTikTokBlockOverlay() {
    if (document.getElementById(TIKTOK_BLOCK_OVERLAY_ID)) return;
    injectFullScreenOverlay(TIKTOK_BLOCK_OVERLAY_ID, HALT_MESSAGE);
  }

  function isInstagramReelsPath() {
    return (
      window.location.pathname.startsWith(INSTAGRAM_REELS_PREFIX) ||
      window.location.pathname.startsWith(INSTAGRAM_REEL_PREFIX)
    );
  }

  function redirectIfInstagramReelsPath() {
    if (isInstagramReelsPath()) {
      haltAndRedirect("https://www.instagram.com/");
    }
  }

  function injectInstagramStyles() {
    if (document.getElementById(INSTAGRAM_HIDE_STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = INSTAGRAM_HIDE_STYLE_ID;
    style.textContent = `
      a[href^="/reels/"],
      a[href^="/reel/"],
      [role="link"][href^="/reels/"],
      [role="link"][href^="/reel/"],
      [aria-label*="Reels"],
      [aria-label="Reels"] {
        display: none !important;
      }
    `;
    document.documentElement.appendChild(style);
  }

  function injectInstagramBlockOverlay() {
    if (!isInstagramReelsPath()) return;
    if (document.getElementById(INSTAGRAM_BLOCK_OVERLAY_ID)) return;
    injectFullScreenOverlay(INSTAGRAM_BLOCK_OVERLAY_ID, HALT_MESSAGE);
  }

  function removeVisibleInstagramReelsCards() {
    const selectors = [
      "a[href*='/reel/']",
      "a[href*='/reels/']",
      "[role='link'][href*='/reel/']",
      "[role='link'][href*='/reels/']"
    ];

    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((node) => {
        const reelCard =
          node.closest("article") ||
          node.closest("div[role='presentation']") ||
          node.closest("div[role='button']") ||
          node;
        if (reelCard && reelCard.style) {
          reelCard.style.display = "none";
        }
      });
    });
  }

  function isFacebookReelsPath() {
    return (
      window.location.pathname.startsWith(FACEBOOK_REELS_PREFIX) ||
      window.location.pathname.startsWith(FACEBOOK_REELS_PLURAL_PREFIX)
    );
  }

  function isFacebookWatchPath() {
    return window.location.pathname.startsWith(FACEBOOK_WATCH_PREFIX);
  }

  function isBlockedFacebookWatchUrl() {
    const href = window.location.href.toLowerCase();
    return (
      href.includes("facebook.com/watch") &&
      (href.includes("?v=") || href.includes("&v=") || isFacebookWatchPath())
    );
  }

  function redirectIfFacebookReelsPath() {
    if (isFacebookReelsPath() || isBlockedFacebookWatchUrl()) {
      haltAndRedirect("https://www.facebook.com/");
    }
  }

  function injectFacebookStyles() {
    if (document.getElementById(FACEBOOK_HIDE_STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = FACEBOOK_HIDE_STYLE_ID;
    style.textContent = `
      a[href*="/reel/"],
      a[href*="/reels/"],
      a[href*="/watch/"],
      a[aria-label*="reel" i],
      a[aria-label*="short video" i],
      [aria-label*="Reels"],
      [aria-label*="Watch"],
      [aria-label*="Videos"],
      div[aria-label*="Reels"],
      div[aria-label*="Watch"],
      div[role="feed"] a[href*="/reel/"],
      div[role="feed"] a[href*="/reels/"] {
        display: none !important;
      }
    `;
    document.documentElement.appendChild(style);
  }

  function injectFacebookBlockOverlay() {
    if (!isFacebookReelsPath() && !isFacebookWatchPath()) return;
    if (document.getElementById(FACEBOOK_BLOCK_OVERLAY_ID)) return;
    injectFullScreenOverlay(FACEBOOK_BLOCK_OVERLAY_ID, HALT_MESSAGE);
  }

  function removeVisibleFacebookReelCards() {
    const selectors = [
      "a[href*='/reel/']",
      "a[href*='/reels/']",
      "a[href*='/watch/']",
      "[role='link'][href*='/reel/']",
      "[role='link'][href*='/reels/']",
      "[role='link'][href*='/watch/']"
    ];

    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((node) => {
        const card =
          node.closest("div[role='article']") ||
          node.closest("div[role='feed'] > div") ||
          node.closest("div[role='presentation']") ||
          node;
        if (card && card.style) {
          card.style.display = "none";
        }
      });
    });

    document.querySelectorAll("video").forEach((video) => {
      const container =
        video.closest("div[role='article']") ||
        video.closest("div[role='feed'] > div") ||
        video.closest("div[data-pagelet]") ||
        video.parentElement;
      if (!container) return;

      const hasReelLink = container.querySelector(
        "a[href*='/reel/'], a[href*='/reels/'], a[href*='/watch/']"
      );
      if (hasReelLink && container.style) {
        container.style.display = "none";
      }
    });
  }

  function injectGoogleHideStyles() {
    if (document.getElementById(GOOGLE_HIDE_STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = GOOGLE_HIDE_STYLE_ID;
    style.textContent = `
      a[href*="udm=39"],
      a[aria-label*="Short videos"],
      a[aria-label*="short videos"] {
        display: none !important;
      }
    `;
    document.documentElement.appendChild(style);
  }

  function redirectIfGoogleShortVideoMode() {
    const url = new URL(window.location.href);
    const isShortMode =
      url.searchParams.get("udm") === "39" ||
      url.searchParams.get("uds") === "shortvideos";
    if (!isShortMode) return;

    url.searchParams.delete("udm");
    url.searchParams.delete("uds");
    window.location.replace(url.toString());
  }

  function injectFullScreenOverlay(id, message) {
    if (document.getElementById(id)) return;
    const overlay = document.createElement("div");
    overlay.id = id;
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.zIndex = "2147483647";
    overlay.style.background = "#111";
    overlay.style.color = "#fff";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.fontFamily = "system-ui, -apple-system, sans-serif";
    overlay.style.fontSize = "18px";
    overlay.style.textAlign = "center";
    overlay.style.padding = "24px";
    overlay.textContent = message;
    document.documentElement.appendChild(overlay);
  }

  function haltAndRedirect(targetUrl) {
    injectFullScreenOverlay("short-form-blocker-halt-overlay", HALT_MESSAGE);
    setTimeout(() => {
      window.location.replace(targetUrl);
    }, 900);
  }

  function isBlockedShortVideoHref(href) {
    if (!href) return false;
    const lowered = href.toLowerCase();
    return (
      lowered.includes("youtube.com/shorts/") ||
      lowered.includes("tiktok.com/") ||
      lowered.includes("instagram.com/reel/") ||
      lowered.includes("instagram.com/reels/") ||
      lowered.includes("facebook.com/reel/") ||
      lowered.includes("facebook.com/watch/") ||
      lowered.includes("snapchat.com/spotlight") ||
      lowered.includes("pinterest.com/ideas/")
    );
  }

  function removeGoogleShortVideoResults() {
    document.querySelectorAll("a[href]").forEach((link) => {
      const href = link.getAttribute("href") || "";
      if (!isBlockedShortVideoHref(href)) return;

      const card =
        link.closest("g-inner-card") ||
        link.closest("div[data-hveid]") ||
        link.closest("div[role='listitem']") ||
        link.closest("div.MjjYud") ||
        link;
      if (card && card.style) {
        card.style.display = "none";
      }
    });

    document.querySelectorAll("span, div, h2, h3").forEach((node) => {
      const label = (node.textContent || "").trim().toLowerCase();
      if (label !== "short videos" && label !== "shorts") return;

      const section =
        node.closest("g-section-with-header") ||
        node.closest("div[data-hveid]") ||
        node.closest("div[role='heading']") ||
        node.parentElement;
      if (section && section.style) {
        section.style.display = "none";
      }
    });

    // Remove likely short-form carousel cards even if source domain varies.
    document.querySelectorAll("g-scrolling-carousel, g-inner-card, .PWSfhb").forEach((node) => {
      const parentSection = node.closest("g-section-with-header") || node.parentElement;
      if (parentSection && parentSection.style) {
        parentSection.style.display = "none";
      }
    });

    // Remove open Google short-video playback panels.
    document.querySelectorAll("iframe[src], video, a[href], h1, h2, h3, span, div").forEach((node) => {
      const text = (node.textContent || "").toLowerCase();
      const href = node.getAttribute && node.getAttribute("href");
      const src = node.getAttribute && node.getAttribute("src");
      const isShortSignal =
        text.includes("#shorts") ||
        text === "short videos" ||
        text === "shorts" ||
        (href && isBlockedShortVideoHref(href)) ||
        (src && isBlockedShortVideoHref(src));
      if (!isShortSignal) return;

      const playbackContainer =
        node.closest("[role='dialog']") ||
        node.closest("c-wiz") ||
        node.closest("g-scrolling-carousel") ||
        node.closest("div[data-hveid]") ||
        node.closest("div[aria-live]") ||
        node.parentElement;
      if (playbackContainer && playbackContainer.style) {
        playbackContainer.style.display = "none";
      }
    });
  }

  function applyYouTubeBlocking() {
    redirectIfYouTubeShortsPath();
    injectYouTubeHideStyles();
    removeVisibleYouTubeShortsCards();
  }

  function applyTikTokBlocking() {
    injectTikTokStyles();
    injectTikTokBlockOverlay();
  }

  function applyInstagramBlocking() {
    injectInstagramStyles();
    removeVisibleInstagramReelsCards();
    redirectIfInstagramReelsPath();
    injectInstagramBlockOverlay();
  }

  function applyGoogleBlocking() {
    redirectIfGoogleShortVideoMode();
    injectGoogleHideStyles();
    removeGoogleShortVideoResults();
  }

  function applyFacebookBlocking() {
    injectFacebookStyles();
    removeVisibleFacebookReelCards();
    redirectIfFacebookReelsPath();
    injectFacebookBlockOverlay();
  }

  function applySnapchatBlocking() {
    if (window.location.pathname.startsWith(SNAPCHAT_SPOTLIGHT_PREFIX)) {
      haltAndRedirect("https://www.snapchat.com/");
    }
    if (window.location.pathname.startsWith(SNAPCHAT_SPOTLIGHT_PREFIX)) {
      injectFullScreenOverlay(
        SNAPCHAT_BLOCK_OVERLAY_ID,
        HALT_MESSAGE
      );
    }
  }

  function applyPinterestBlocking() {
    if (window.location.pathname.startsWith(PINTEREST_IDEAS_PREFIX)) {
      haltAndRedirect("https://www.pinterest.com/");
    }
    if (window.location.pathname.startsWith(PINTEREST_IDEAS_PREFIX)) {
      injectFullScreenOverlay(
        PINTEREST_BLOCK_OVERLAY_ID,
        HALT_MESSAGE
      );
    }
  }

  function applyBlockingRules() {
    if (isYouTubeHost()) {
      applyYouTubeBlocking();
      return;
    }
    if (isTikTokHost()) {
      applyTikTokBlocking();
      return;
    }
    if (isInstagramHost()) {
      applyInstagramBlocking();
      return;
    }
    if (isFacebookHost()) {
      applyFacebookBlocking();
      return;
    }
    if (isSnapchatHost()) {
      applySnapchatBlocking();
      return;
    }
    if (isPinterestHost()) {
      applyPinterestBlocking();
      return;
    }
    if (isGoogleHost()) {
      applyGoogleBlocking();
    }
  }

  function enforceBlockedRouteNow() {
    if (isFacebookHost() && (isFacebookReelsPath() || isBlockedFacebookWatchUrl())) {
      haltAndRedirect("https://www.facebook.com/");
      return true;
    }
    return false;
  }

  function installUrlChangeGuards() {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    function onUrlMayChange() {
      if (enforceBlockedRouteNow()) return;
      applyBlockingRules();
    }

    history.pushState = function patchedPushState(...args) {
      const result = originalPushState.apply(this, args);
      onUrlMayChange();
      return result;
    };

    history.replaceState = function patchedReplaceState(...args) {
      const result = originalReplaceState.apply(this, args);
      onUrlMayChange();
      return result;
    };

    window.addEventListener("popstate", onUrlMayChange);
    window.addEventListener("hashchange", onUrlMayChange);
  }

  installUrlChangeGuards();
  enforceBlockedRouteNow();
  applyBlockingRules();

  const observer = new MutationObserver(() => {
    applyBlockingRules();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  // Facebook can swap routes/content without typical navigation events.
  setInterval(() => {
    enforceBlockedRouteNow();
  }, 500);
})();
