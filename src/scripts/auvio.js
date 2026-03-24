/**
 * RTBF Auvio AdBlocker Content Script
 * Targets ads in the Red Bee Media player used by Auvio.
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
        const banners = document.querySelectorAll('.imu, .leaderboard, .pub-container, .ads-container');
        banners.forEach(banner => {
            banner.style.setProperty('display', 'none', 'important');
        });

        const player = document.querySelector('video');
        const adPlayingClasses = [
            '.vjs-ad-playing',
            '.ad-active',
            '.ima-ad-container',
            '.video-ad-container',
            '.redbee-player-ad-playing'
        ];

        let isAdPlaying = false;
        for (const selector of adPlayingClasses) {
            if (document.querySelector(selector)) {
                isAdPlaying = true;
                break;
            }
        }

        const adVideos = document.querySelectorAll('.vjs-ad-playing video, .ima-ad-container video, .video-ad-container video');
        const isAdActive = (isAdPlaying || adVideos.length > 0);

        updateStatus(isAdActive);

        if (isAdActive) {
            adVideos.forEach(v => {
                if (!v.muted) v.muted = true;
                v.playbackRate = 16;
                if (isFinite(v.duration) && v.duration > 0) {
                    v.currentTime = v.duration - 0.1;
                }
            });

            if (isAdPlaying && player) {
                if (!player.muted) player.muted = true;
                player.playbackRate = 16;
                if (isFinite(player.duration) && player.duration > 0) {
                    player.currentTime = player.duration - 0.1;
                }
            }
        }
    }

    function init() {
        if (!document.body) {
            setTimeout(init, 100);
            return;
        }

        createStatusDot();

        const observer = new MutationObserver(handleAds);
        const targetNode = document.body;
        observer.observe(targetNode, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });

        handleAds();
        setInterval(handleAds, 1000);
    }

    init();
})();
