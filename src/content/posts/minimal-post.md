---
title: Minimal Post
description: Post minimal — les champs optionnels absents prennent les valeurs par defaut du schema.
publish_date: 2026-09-18
category: design
---

Ce post n'utilise que les champs requis (`title`, `publish_date`) plus la
categorie. Tous les autres champs sont omis : le schema Zod du template
leur applique des valeurs par defaut, exactement comme Sveltia CMS le
ferait pour une nouvelle entree.
