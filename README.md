# git-cms-template

Template de base pour sites de contenu : **Astro + Sveltia CMS + Cloudflare Workers**, avec **Tailwind CSS**, **Vue JS** et **GSAP** integres par defaut.

Ce template fournit une configuration prete a l'emploi pour creer des sites statiques avec gestion de contenu via Sveltia CMS, deployes sur Cloudflare Workers. Il couvre l'integralite des widgets Sveltia CMS et offre une structure claire pour le contenu, les medias et l'administration. Le front-end est equipe de Tailwind CSS pour le style, de Vue JS pour les composants interactifs et de GSAP pour les animations.

## Stack

| Composant | Version | Notes |
|-----------|---------|-------|
| [Astro](https://docs.astro.build) | ^7.3.3 | output `static`, adapter `@astrojs/cloudflare` ^14.3.2 |
| [Sveltia CMS](https://sveltiacms.app) | ^0.214.1 | package npm `@sveltia/cms` (pas le script CDN) |
| [Tailwind CSS](https://tailwindcss.com) | ^4.3.3 | via le plugin Vite `@tailwindcss/vite` ^4.3.3, import dans `src/styles/global.css` |
| [Vue JS](https://vuejs.org) | ^3.5.43 | integration `@astrojs/vue` ^7.0.3, composants dans `src/components/` |
| [GSAP](https://gsap.com) | ^3.15.0 | animations, importe dans les `<script>` des pages |
| [Wrangler](https://developers.cloudflare.com/workers/wrangler/) | ^4.136.0 | CLI Cloudflare Workers |
| [Node.js](https://nodejs.org) | >= 22.12.0 | |
| [pnpm](https://pnpm.io) | ^9.12.0 | seul package manager autorise |

## Structure du projet

```
.
├── public/
│   ├── admin/
│   │   └── config.yml          # Configuration Sveltia CMS (backend, collections, widgets)
│   └── media/                  # Fichiers telecharges via le CMS (servis sous /media/)
├── src/
│   ├── content.config.ts       # Content Collections : schemas Zod (authors, posts)
│   ├── components/
│   │   └── Vue/
│   │       └── Count.vue       # Composant Vue de demonstration (hydratation client)
│   ├── styles/
│   │   └── global.css          # Import Tailwind CSS (point d'entree du style global)
│   ├── content/
│   │   ├── authors/            # Entrees auteurs (cible du widget relation)
│   │   │   └── loic-babolat.md
│   │   └── posts/              # Entrees posts (front matter YAML + body markdown)
│   │       ├── hello-world.md  # Exemple complet : tous les widgets Sveltia
│   │       └── minimal-post.md # Exemple minimal : champs requis seulement
│   ├── layouts/
│   │   └── Layout.astro        # Layout principal
│   └── pages/
│       ├── index.astro         # Liste des posts
│       ├── posts/
│       │   └── [slug].astro    # Detail d'un post
│       └── admin/
│           └── index.astro     # Page Sveltia CMS (standalone, import npm)
├── wrangler.jsonc              # Configuration Cloudflare Workers
├── package.json
├── AGENTS.md                   # Instructions pour les agents
├── PLAN.md                     # Detail de la creation du template
└── TODO.md                     # Checklist d'initialisation (a supprimer apres usage)
```

## Commandes

Toutes les commandes sont executees depuis la racine du projet.

| Commande | Action |
|----------|--------|
| `pnpm install` | Installe les dependances |
| `pnpm dev` | Serveur Astro local (localhost:4321), sans runtime Workers |
| `pnpm build` | Build de production vers `dist/` |
| `pnpm preview` | Preview du build localement (sans runtime Workers) |
| `pnpm wrangler-preview` | Build + `wrangler dev` (runtime Workers local, localhost:8787) |
| `pnpm cf-typegen` | Regenerer `worker-configuration.d.ts` |

### Mode background (recommande pour le developpement)

```bash
pnpm exec astro dev --background
```

Gestion du serveur background :
- `astro dev stop` — arreter le serveur
- `astro dev status` — afficher le statut
- `astro dev logs` — afficher les logs

## Initialisation d'un nouveau projet

> **Important** : Avant toute utilisation, suivre la checklist dans [`TODO.md`](TODO.md) pour initialiser les valeurs par defaut.

### Etapes obligatoires

1. **Renommer le projet** :
   - Dans `wrangler.jsonc` : remplacer `"name": "git-cms-template"` par le nom de votre worker Cloudflare
   - Dans `package.json` : remplacer `"name": "git-cms-template"` par le nom de votre projet

2. **Configurer Sveltia CMS** (`public/admin/config.yml`) :
   - Remplacer `USER/REPO_NAME` par votre depot Git (ex: `LoicBabolat/mon-projet`)
   - Verifier que la branche specifiee dans `branch` existe dans votre depot
   - Adapter `skip_ci` selon vos besoins (recommande: `true`)
   - Confirmer que `preview_context` correspond a votre hebergeur (ex: `cloudflare`)
   - Optionnel : ajouter `site_url` avec l'URL publique de votre site

3. **Tester la configuration** :
   ```bash
   pnpm install
   pnpm wrangler-preview
   ```
   - Verifier que `/admin/` charge correctement
   - Tester la connexion via "Sign In with Token" avec un [personal access token GitHub](https://github.com/settings/tokens) (scopes: `repo`, `read:org`)
   - Verifier qu'aucune erreur n'apparait dans la console du navigateur

4. **Supprimer `TODO.md`** une fois toutes les valeurs initialisees et validees.

## Conventions

### Front-end (Tailwind / Vue / GSAP)

- **Tailwind CSS** : active via le plugin `@tailwindcss/vite` dans `astro.config.mjs` et l'import `@import "tailwindcss";` dans `src/styles/global.css`. Les classes utilitaires sont disponibles partout ; personnaliser le theme dans `global.css` (directives `@theme`, etc.).
- **Vue JS** : les composants `.vue` vivent dans `src/components/` et sont integres via `@astrojs/vue`. Dans une page Astro, les importer puis les hydrater avec une directive client (ex: `<Count client:load initialCount={0} />`).
- **GSAP** : importe directement dans les `<script>` des pages ou composants (ex: `import { gsap } from "gsap";`). Aucune configuration globale n'est necessaire.
- Le template inclut du **code de demonstration** (blocs `.box` et timeline GSAP dans `src/pages/index.astro`, composant `Count.vue`) : a remplacer par votre contenu reel, en gardant ces patterns comme reference.

### Contenu
- Le contenu vit dans `src/content/` au format **front matter YAML + markdown**
- Le schema Zod dans `src/content.config.ts` doit **toujours rester aligne** avec les champs definis dans `public/admin/config.yml`
- Les medias telecharges via le CMS sont stockes dans `public/media/` et servis sous `/media/`

### Collections
- **`authors`** : Collection cible pour le widget `relation` dans les posts
- **`posts`** : Collection exhaustive couvrant **tous les widgets Sveltia CMS** :
  - `string`, `text`, `number`, `boolean`, `select`, `color`, `datetime`
  - `richtext` (alias `markdown`), `image`, `file`, `list`, `object`
  - `keyvalue`, `relation`, `code`, `map`, `compute`, `uuid`, `hidden`
- Ne pas reduire la collection `posts` sans validation prealable

### Drafts
- Les entrees avec `draft: true` sont filtrees des pages publiques (index et detail) mais restent visibles et editables dans le CMS

### Backend CMS
- Backend : **GitHub** avec authentification par **personal access token**
- Methode : `auth_methods: [token]` — bouton "Sign In with Token" dans l'interface
- Aucun OAuth App necessaire

## Pieges connus

| Probleme | Solution |
|----------|----------|
| Warning Vite >500 kB | Normal : c'est le bundle Sveltia CMS (~1.9 MB). Ne pas essayer de le "corriger". |
| `nodejs_compat` manquant | Le flag est deja present dans `wrangler.jsonc`. Ne pas le retirer. |
| `astro preview` ne fonctionne pas avec Workers | Utiliser `pnpm wrangler-preview` pour tester avec le runtime Workers. |
| Config wrangler "redirigee" | Comportement normal : `@astrojs/cloudflare` genere `dist/client/wrangler.json` utilise par wrangler. |
| Champ `body` introuvable dans le schema | Le widget `richtext` nomme `body` est ecrit sous le front matter (pas dans la YAML). Astro l'expose via `entry.body`. |

## Documentation

- **Astro** : [docs.astro.build](https://docs.astro.build)
  - [Content Collections](https://docs.astro.build/en/guides/content-collections/)
  - [Routing](https://docs.astro.build/en/guides/routing/)
- **Sveltia CMS** : [sveltiacms.app](https://sveltiacms.app)
  - [Schema de configuration](https://unpkg.com/@sveltia/cms/schema/sveltia-cms.json)
  - [Backend GitHub](https://sveltiacms.app/en/docs/backends/github)
- **Cloudflare Workers** : [developers.cloudflare.com/workers](https://developers.cloudflare.com/workers/)
  - [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- **Tailwind CSS** : [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Vue JS** : [vuejs.org/guide](https://vuejs.org/guide/introduction.html)
  - [Integration Astro Vue](https://docs.astro.build/en/guides/integrations-guide/vue/)
- **GSAP** : [gsap.com/docs](https://gsap.com/docs/v3/)

## Contenu d'exemple

Le template inclut du contenu d'exemple pour reference :

| Fichier | Description |
|---------|-------------|
| `src/content/posts/hello-world.md` | Post complet demontrant **tous les widgets Sveltia** |
| `src/content/posts/minimal-post.md` | Post minimal avec uniquement les champs requis |
| `src/content/authors/loic-babolat.md` | Auteur d'exemple (cible du widget relation) |
| `public/media/sample-cover.svg` | Image d'exemple referencee par `hello-world.md` |
| `src/components/Vue/Count.vue` | Composant Vue de demonstration (compteur reactif, `defineModel`, hydratation `client:load`) |
| `src/pages/index.astro` (blocs `.box` + script GSAP) | Demonstration GSAP (tween + timeline) avec classes Tailwind |

> **Recommandation** : Conserver ces exemples pendant le developpement comme reference pour creer vos propres pages. Ils peuvent etre supprimes une fois votre contenu reel en place.

## Licence

Ce template est fournis tel quel, sans garantie. Vous etes libre de l'utiliser, le modifier et le redistribuer selon vos besoins.
