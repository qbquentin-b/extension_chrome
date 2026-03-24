# 🎯 Mission : Création d'une extension Chrome "AdBlocker" sur mesure

Salut Jules ! 

Ton objectif pour cette mission est de développer une extension Google Chrome capable de bloquer efficacement les publicités sur une liste spécifique de plateformes de streaming et de vidéos.

## 📌 Plateformes ciblées
L'extension doit être fonctionnelle sur les sites suivants :
* **YouTube**
* **Twitch**
* **RTBF Auvio**

## 🛠️ Contraintes techniques & Recherche
**Attention :** Bloquer des publicités sur ces plateformes complexes (surtout vidéo) ne se résume pas à faire du CSS (ex: `display: none` sur des div). 

Tu vas devoir te renseigner sur les méthodes modernes et robustes. Voici tes axes de recherche :
* Le fonctionnement des API d'extensions Chrome (notamment **Manifest V3**).
* L'interception de requêtes réseau (ex: `declarativeNetRequest` API).
* L'injection de scripts (Content Scripts) pour interagir avec les lecteurs vidéo de YouTube, Twitch et Auvio et "skipper" ou bloquer les flux publicitaires.

## 🧪 Méthodologie de Test
Tu dois mettre en place et définir une méthodologie pour tester ton extension en conditions réelles :
* Comment charger l'extension en mode développeur sur ton navigateur.
* Comment t'assurer que tu déclenches bien des publicités sur ces sites pour vérifier que ton code fonctionne (ex: navigation en navigation privée, vidéos spécifiques, etc.).
* Comment vérifier que le lecteur vidéo ne plante pas après le blocage d'une pub.

## 📝 Documentation exigée : `WhatIDone.md`
C'est le point le plus important. Tu dois documenter l'intégralité de ton processus dans un fichier nommé **`WhatIDone.md`**.

Ce fichier doit contenir :
1.  **Tes recherches :** Les liens des documentations lues, les tutoriels consultés, les forums (StackOverflow, Reddit) qui t'ont aidé.
2.  **Tes décisions techniques :** Pourquoi as-tu choisi telle méthode (ex: API réseau vs Content Script) pour tel site.
3.  **Tes actions pas à pas :** L'historique de ce que tu as codé, les bugs rencontrés, et comment tu les as résolus.
4.  **Tes protocoles de test :** Comment tu as validé que le blocage fonctionnait pour chaque site.

Bon courage pour le développement, commence par bien te documenter avant de coder !
