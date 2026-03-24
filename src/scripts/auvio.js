/**
 * RTBF Auvio AdBlocker Content Script
 * Targets ads in the Red Bee Media player used by Auvio.
 */

(function() {
    function handleAds() {
        // Hide banner ads (identified in EasyList FR)
        const banners = document.querySelectorAll('.imu, .leaderboard, .pub-container, .ads-container');
        banners.forEach(banner => {
            banner.style.setProperty('display', 'none', 'important');
        });

        // Detect video ads in Auvio
        // Look for common IMA SDK or Red Bee Media ad-playing indicators
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

        // Generic detection: if a video is playing in an overlay above the main content
        const adVideos = document.querySelectorAll('.vjs-ad-playing video, .ima-ad-container video, .video-ad-container video');

        if (isAdPlaying || adVideos.length > 0) {
            adVideos.forEach(v => {
                if (!v.muted) v.muted = true;
                v.playbackRate = 16;
                if (isFinite(v.duration) && v.duration > 0) {
                    v.currentTime = v.duration - 0.1;
                }
            });

            // If the main player is tagged as playing an ad
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

        // Use MutationObserver to watch for player state changes
        const observer = new MutationObserver(handleAds);
        const targetNode = document.body;
        observer.observe(targetNode, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });

        // Initial and periodic check
        handleAds();
        setInterval(handleAds, 1000);
    }

    init();
})();
