/**
 * YouTube AdBlocker Content Script
 * Optimized with MutationObserver for SPA support and modern skip button selectors.
 */

(function() {
    let statusDot = null;

    function createStatusDot() {
        if (statusDot) return;
        statusDot = document.createElement('div');
        statusDot.id = 'adblock-status-dot';
        statusDot.style.position = 'fixed';
        statusDot.style.top = '10px';
        statusDot.style.right = '10px';
        statusDot.style.width = '12px';
        statusDot.style.height = '12px';
        statusDot.style.borderRadius = '50%';
        statusDot.style.zIndex = '10000';
        statusDot.style.border = '2px solid white';
        statusDot.style.boxShadow = '0 0 5px rgba(0,0,0,0.5)';
        statusDot.style.backgroundColor = '#28a745'; // Green by default
        statusDot.title = 'AdBlocker Actif';
        document.body.appendChild(statusDot);
    }

    function updateStatus(isAd) {
        if (!statusDot) createStatusDot();
        if (isAd) {
            statusDot.style.backgroundColor = '#dc3545'; // Red
            statusDot.title = 'Publicité détectée et bloquée';
        } else {
            statusDot.style.backgroundColor = '#28a745'; // Green
            statusDot.title = 'AdBlocker Actif';
        }
    }

    function skipAds() {
        const video = document.querySelector('video');
        const adShowing = document.querySelector('.ad-showing, .ad-interrupting, .ytp-ad-player-overlay');

        updateStatus(!!adShowing);

        if (adShowing && video) {
            if (!video.muted) video.muted = true;
            video.playbackRate = 16;

            if (isFinite(video.duration) && video.duration > 0) {
                video.currentTime = video.duration - 0.1;
            }
        }

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

        createStatusDot();

        const observer = new MutationObserver((mutations) => {
            skipAds();
        });

        const targetNode = document.body;
        const config = { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] };
        observer.observe(targetNode, config);

        skipAds();
        setInterval(skipAds, 1000);
    }

    init();
})();
