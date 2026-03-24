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
- **Interception réseau :** Blocage ciblé de la régie publicitaire locale de la RTBF (`rmb.be`), des serveurs de publicité tiers (`smartadserver.com`, `googletagservices.com`) et des endpoints d'ad-breaks.
- **Manipulation DOM :** Masquage des bannières `.imu` et `.leaderboard`.
- **Technique de "Skip" :** Détection récursive des indicateurs de publicité sur les éléments parents de la balise `<video>` (ex: `.vjs-ad-playing`, `.ima-ad-container`) et analyse des sources vidéo (`googlevideo.com/.../oad`). Application de l'accélération x16 et du saut à la fin de la vidéo publicitaire.

## 2. Décisions techniques
- **Architecture :** Dossier `src/` contenant :
  - `manifest.json` : Définition des permissions et scripts.
  - `rules/rules.json` : Règles DNR pour le blocage réseau préemptif.
  - `scripts/` : Un script par plateforme pour maximiser la clarté et la maintenance.
- **Fast-Forward :** Préféré au blocage pur sur YouTube/Auvio pour éviter de casser le flux vidéo et contourner les détections d'adblockers agressifs.
- **Indicateur de Statut :** Ajout d'un point de couleur en haut à droite (Vert : actif, Rouge : publicité en cours de blocage) pour donner un feedback visuel à l'utilisateur, particulièrement utile en mode réduit.

## 3. Actions pas à pas
- [x] Initialisation de `WhatIDone.md`.
- [x] Configuration du `manifest.json` (MV3).
- [x] Implémentation des règles DNR de base.
- [x] Développement de `youtube.js` avec MutationObserver et indicateur de statut.
- [x] Développement de `twitch.js` avec overlay personnalisé et indicateur de statut.
- [x] Développement de `auvio.js` (V1).
- [x] **Correctif RTBF Auvio :** Identification de nouvelles régies (`rmb.be`) et renforcement de la détection par analyse des conteneurs parents et des URLs de source vidéo.
- [x] Finalisation de la documentation et du protocole de test.

## 4. Protocoles de test manuel
### YouTube
1. Naviguer sur `youtube.com`.
2. Vérifier la présence d'un point **vert** en haut à droite.
3. Lancer une vidéo.
4. Si une pub se lance :
   - Le point devient **rouge**.
   - Le son se coupe et l'image défile très vite.
   - Le bouton "Skip ad" est cliqué automatiquement.

### Twitch
1. Aller sur un stream `twitch.tv`.
2. Vérifier le point **vert**.
3. Lors d'une pub :
   - Le point devient **rouge**.
   - L'overlay noir "Publicité bloquée" apparaît.

### RTBF Auvio
1. Se connecter sur `auvio.rtbf.be`.
2. Vérifier le point **vert**.
3. Lors d'une pub (pré-roll ou mid-roll) :
   - Le point devient **rouge**.
   - La pub est accélérée ou passée.
   - Les bannières publicitaires disparaisent.
