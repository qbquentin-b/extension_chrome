/**
 * YouTube AdBlocker Content Script
 * Optimized with MutationObserver for SPA support and modern skip button selectors.
 */

(function() {
    function skipAds() {
        const video = document.querySelector('video');
        // YouTube often adds these classes to the player container when an ad is playing
        const adShowing = document.querySelector('.ad-showing, .ad-interrupting, .ytp-ad-player-overlay');

        if (adShowing && video) {
            // Mute and fast-forward
            if (!video.muted) video.muted = true;
            video.playbackRate = 16;

            // Try to skip immediately by seeking to the end if possible
            if (isFinite(video.duration) && video.duration > 0) {
                video.currentTime = video.duration - 0.1;
            }
        }

        // Click skip buttons
        const skipButtons = [
            '.ytp-ad-skip-button',
            '.ytp-ad-skip-button-modern',
            '.ytp-skip-ad-button',
            'button[aria-label^="Skip ad"]',
            '.ytp-ad-skip-button-container',
            '.ytp-ad-skip-button-slot'
        ];

        for (const selector of skipButtons) {
            const button = document.querySelector(selector);
            if (button && button.offsetParent !== null) {
                button.click();
            }
        }

        // Hide overlay ads
        const overlays = [
            '.ytp-ad-overlay-container',
            '.ytp-ad-image-overlay',
            '.ytp-ad-text-overlay',
            '#player-ads'
        ];

        for (const selector of overlays) {
            const overlay = document.querySelector(selector);
            if (overlay) {
                overlay.style.setProperty('display', 'none', 'important');
            }
        }
    }

    function init() {
        if (!document.body) {
            setTimeout(init, 100);
            return;
        }

        // Use MutationObserver for robust detection in YouTube's SPA environment
        const observer = new MutationObserver((mutations) => {
            skipAds();
        });

        // Start observing
        const targetNode = document.body;
        const config = { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] };

        observer.observe(targetNode, config);

        // Initial run
        skipAds();

        // Safety interval
        setInterval(skipAds, 1000);
    }

    init();
})();
