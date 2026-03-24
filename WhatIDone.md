# WhatIDone.md - AdBlocker Extension Development Log

## 1. Recherches
### Manifest V3 et APIs Chrome Extensions
- Utilisation de l'API `declarativeNetRequest` (DNR) pour le blocage réseau au lieu de `webRequest`. DNR permet de définir des listes de règles statiques que le navigateur gère efficacement.
- Utilisation des `content_scripts` pour manipuler le DOM des pages cibles (YouTube, Twitch, Auvio).
- Utilisation d'un `MutationObserver` pour une détection d'ajouts dynamiques sans impact sur les performances, crucial pour les SPA (YouTube, Twitch).

### Stratégies par plateforme
#### YouTube
- **Interception réseau :** Blocage des domaines `doubleclick.net`, `googleads.g.doubleclick.net`, `googlesyndication.com`.
- **Manipulation DOM :** Détection de l'état d'ad-playing via `.ad-showing`, `.ad-interrupting`, `.ytp-ad-player-overlay`.
- **Technique de "Skip" :** Accélération (`playbackRate = 16`) et coupure du son (`muted = true`). Clic automatique sur les nouveaux boutons `.ytp-ad-skip-button-modern`.

#### Twitch
- **Interception réseau :** Blocage de `amazon-adsystem.com`.
- **Manipulation DOM :** Masquage de `.stream-display-ad__wrapper`.
- **Expérience Utilisateur :** Affichage d'un overlay personnalisé ("Publicité bloquée") pendant les segments SSAI (Server-Side Ad Insertion) où la vidéo principale est remplacée par la publicité. Le flux vidéo est coupé en termes de son, l'utilisateur est informé.

#### RTBF Auvio
- **Interception réseau :** Blocage ciblé de l'API publicitaire interne et des tags VAST.
- **Manipulation DOM :** Masquage des bannières `.imu` et `.leaderboard`.
- **Technique de "Skip" :** Détection des conteneurs IMA SDK (`.ima-ad-container`) et application de la technique d'accélération et de skip au temps de fin de la vidéo publicitaire.

## 2. Décisions techniques
- **Architecture :** Dossier `src/` contenant :
  - `manifest.json` : Définition des permissions et scripts.
  - `rules/rules.json` : Règles DNR pour le blocage réseau préemptif.
  - `scripts/` : Un script par plateforme pour maximiser la clarté et la maintenance.
- **Fast-Forward :** Préféré au blocage pur sur YouTube/Auvio pour éviter de casser le flux vidéo et contourner les détections d'adblockers agressifs.

## 3. Actions pas à pas
- [x] Initialisation de `WhatIDone.md`.
- [x] Configuration du `manifest.json` (MV3).
- [x] Implémentation des règles DNR.
- [x] Développement de `youtube.js` avec MutationObserver.
- [x] Développement de `twitch.js` avec overlay personnalisé.
- [x] Développement de `auvio.js` pour cibler le Red Bee Player.
- [x] Finalisation de la documentation et du protocole de test.

## 4. Protocoles de test manuel
### YouTube
1. Naviguer sur `youtube.com`.
2. Lancer une vidéo connue pour avoir des publicités.
3. Vérifier :
   - Si une pub se lance, le son se coupe et l'image défile très vite.
   - Le bouton "Skip ad" est cliqué automatiquement dès que possible.
   - Les bannières d'overlay disparaissent.

### Twitch
1. Aller sur un stream `twitch.tv`.
2. Attendre une coupure publicitaire.
3. Vérifier :
   - L'overlay noir "Publicité bloquée" apparaît.
   - Le son est coupé.
   - Le flux normal reprend après la pub sans intervention manuelle.

### RTBF Auvio
1. Se connecter sur `auvio.rtbf.be`.
2. Lancer un replay ou un live.
3. Vérifier :
   - Les bannières latérales sont masquées.
   - Les pubs pré-roll sont accélérées ou passées.
   - Pas de plantage du lecteur vidéo Red Bee Media.
