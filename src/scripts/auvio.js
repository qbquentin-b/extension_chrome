/**
 * RTBF Auvio AdBlocker Content Script
 * Optimized for Red Bee Media Player and common ad patterns.
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
        // Hide standard banner containers
        const bannerSelectors = [
            '.imu', '.leaderboard', '.pub-container', '.ads-container',
            '[id*="google_ads"]', '[class*="ad-container"]', '.ad-unit'
        ];
        bannerSelectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                el.style.setProperty('display', 'none', 'important');
            });
        });

        // Auvio specific: detect ad state in video elements
        const videos = document.querySelectorAll('video');
        let anyAdDetected = false;

        videos.forEach(v => {
            // Check for ad indicators in parents
            let parent = v.parentElement;
            let isThisVideoAnAd = false;
            while (parent && parent !== document.body) {
                if (parent.classList.contains('vjs-ad-playing') ||
                    parent.classList.contains('ima-ad-container') ||
                    parent.classList.contains('video-ad-container') ||
                    parent.getAttribute('data-ad-playing') === 'true') {
                    isThisVideoAnAd = true;
                    break;
                }
                parent = parent.parentElement;
            }

            // Check src for common ad strings if not already detected
            if (!isThisVideoAnAd && v.src) {
                if (v.src.includes('googlevideo.com/videoplayback') && v.src.includes('oad')) {
                   isThisVideoAnAd = true;
                }
            }

            if (isThisVideoAnAd) {
                anyAdDetected = true;
                if (!v.muted) v.muted = true;
                v.playbackRate = 16;
                if (isFinite(v.duration) && v.duration > 0) {
                    v.currentTime = v.duration - 0.1;
                }
            }
        });

        updateStatus(anyAdDetected);
    }

    function init() {
        if (!document.body) {
            setTimeout(init, 100);
            return;
        }

        createStatusDot();

        const observer = new MutationObserver(handleAds);
        const targetNode = document.body;
        observer.observe(targetNode, { childList: true, subtree: true, attributes: true });

        handleAds();
        setInterval(handleAds, 1000);
    }

    init();
})();
