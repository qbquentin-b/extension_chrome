/**
 * Twitch AdBlocker Content Script
 * Mutes stream and shows a "Pub bloquée" overlay during ads.
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
        statusDot.style.backgroundColor = '#28a745'; // Green
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

    function handleAds() {
        // Hide display ads wrappers
        const displayAdWrappers = document.querySelectorAll('.stream-display-ad__wrapper, .ad-banner');
        displayAdWrappers.forEach(wrapper => {
            wrapper.style.setProperty('display', 'none', 'important');
        });

        // Detect commercial break in progress to mute
        const player = document.querySelector('video');
        const commercialOverlay = findByText('.video-player__overlay', 'Commercial')
                                || findByText('.video-player__overlay', 'Publicité');

        const adIndicator = document.querySelector('[data-a-target="player-ad-overlay"]');

        const isAdActive = !!(commercialOverlay || adIndicator);
        updateStatus(isAdActive);

        if (isAdActive && player) {
            if (!player.muted) player.muted = true;
            showBlockedOverlay();
        } else {
            removeBlockedOverlay();
        }
    }

    function showBlockedOverlay() {
        let overlay = document.getElementById('custom-adblock-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'custom-adblock-overlay';
            overlay.style.position = 'absolute';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'black';
            overlay.style.color = 'white';
            overlay.style.display = 'flex';
            overlay.style.justifyContent = 'center';
            overlay.style.alignItems = 'center';
            overlay.style.fontSize = '24px';
            overlay.style.zIndex = '9999';
            overlay.textContent = 'Publicité bloquée - Le flux reprendra bientôt...';

            const playerContainer = document.querySelector('.video-player__container');
            if (playerContainer) {
                playerContainer.appendChild(overlay);
            }
        }
    }

    function removeBlockedOverlay() {
        const overlay = document.getElementById('custom-adblock-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    function findByText(selector, text) {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
            if (el.textContent.includes(text)) return el;
        }
        return null;
    }

    function init() {
        if (!document.body) {
            setTimeout(init, 100);
            return;
        }

        createStatusDot();

        // Use MutationObserver for Twitch's dynamic content
        const observer = new MutationObserver(handleAds);
        const targetNode = document.body;
        observer.observe(targetNode, { childList: true, subtree: true });

        // Interval as backup
        setInterval(handleAds, 1000);
        handleAds();
    }

    init();
})();
