# Plan : Template Astro + Sveltia CMS + Cloudflare

Ce plan est lié au projet `git_based_template` et doit etre suivi par tout agent travaillant dans ce depot.
Il decrit la creation d'un template de base reutilisable pour des sites de contenu.

> **Note** : Pour l'initialisation des valeurs par défaut de Sveltia CMS, voir le fichier **[`TODO.md`](TODO.md)**. Ce fichier doit être utilisé lors de la création d'un projet à partir de cette template.

## Stack

- **Frontend** : Astro JS
- **CMS** : Sveltia CMS (package npm `@sveltia/cms`, pas le script CDN)
- **Hebergement** : Cloudflare Workers
- **Package manager** : pnpm
- **Nom du worker Cloudflare** : `git-cms-template`

## Decisions prises

- Skill sveltia-cms : projet uniquement (`.agents/skills/`)
- MCP Cloudflare Docs + Astro Docs : config du projet (`.vibe/config.toml`)
- pnpm comme package manager (pas npm/yarn)
- Backend Sveltia CMS : `github` avec **access token** (pas d'OAuth),
  `auth_methods: [token]` — bouton "Sign In with Token"

## Avancement

| # | Etape | Statut |
|---|-------|--------|
| 1 | Recuperer le skill sveltia-cms + ajouter les MCP Cloudflare/Astro | Fait |
| 2 | Scaffolder le projet via `pnpm create cloudflare@latest` (template Astro + Workers) | Fait |
| 3 | Installer Sveltia CMS via package npm (`@sveltia/cms`) | Fait |
| 4 | Configurer Sveltia CMS : `src/pages/admin/index.astro` + `public/admin/config.yml` | Fait |
| 5 | Creer une collection Astro qui couvre tous les types de champs Sveltia | Fait |
| 6 | Configurer Astro Content Collections pour consommer le contenu Sveltia | Fait |
| 7 | Configurer le deploiement Cloudflare (wrangler.jsonc, bindings) | Fait |
| 8 | Ecrire l'AGENTS.md du template (guideline de demarrage) | Fait |
| 9 | Tester : build local, `wrangler dev`, `/admin/` se charge, contenu valide | Fait (test CMS via navigateur a faire manuellement) |

## Detail des etapes completes

### Etape 1 — Skill + MCP (Fait)

- **1a.** Skill `sveltia-cms` copie dans `.agents/skills/sveltia-cms/` (18 fichiers).
  Source : `marieange/astro_test/.agents/skills/sveltia-cms/`.
- **1b.** Dossier projet ajoute a `~/.vibe/trusted_folders.toml` (backup `.bak` cree).
- **1c.** `.vibe/config.toml` cree avec 2 MCP :
  - `cloudflare-docs` : `https://docs.mcp.cloudflare.com/mcp` (public, pas d'auth)
  - `astro-docs` : `https://mcp.docs.astro.build/mcp` (public, pas d'auth)
  - Les MCP globaux (`mistralai`, `context7`) sont herites depuis `~/.vibe/config.toml`.

### Etape 2 — Scaffold via create-cloudflare (Fait)

Commande utilisee :
```bash
pnpm create cloudflare@latest git-based-template-scaffold \
  --framework astro --platform workers --lang ts \
  --no-deploy --no-git --no-agents \
  -- --template basics --skip-houston
```

Resultat :
- Astro `^7.3.3`, `@astrojs/cloudflare` `^14.3.2`, Wrangler `^4.135.0`
- Fichiers deplaces du dossier temporaire vers `git_based_template/`
- Corrections appliquees :
  - Worker renomme `git-based-template-scaffold` -> `git-cms-template` (wrangler.jsonc + package.json)
  - Flag `nodejs_compat` ajoute a `wrangler.jsonc`
- `pnpm run build` valide (2 pages generees)

### Etape 3 — Sveltia CMS via package npm (Fait)

```bash
pnpm add @sveltia/cms   # version 0.214.1
```

Approche npm (vs CDN) :
- `src/pages/admin/index.astro` : page Astro standalone (pas de layout, pas de CSS).
  Vite bundle l'import `@sveltia/cms` en un seul fichier JS (~1.9 MB).
  ```astro
  ---
  // Standalone admin page for Sveltia CMS.
  // No layout, no CSS — the CMS bundles its own styles.
  ---

  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="robots" content="noindex" />
      <title>Sveltia CMS</title>
    </head>
    <body>
      <script>
        import CMS from '@sveltia/cms';
        CMS.init();
      </script>
    </body>
  </html>
  ```
- `public/admin/config.yml` : config avec backend `test-repo` (pour test sans OAuth).
  Le `config.yml` est copie tel quel dans le build output (`dist/client/admin/config.yml`).
- `CMS.init()` sans argument charge automatiquement `config.yml` depuis `/admin/`.

Notes importantes :
- Sveltia CMS n'est pas un ES module distribue via CDN ici — c'est un import npm bundlé par Vite.
- Ne pas ajouter `<link rel="stylesheet">` (pas de CSS separe).
- Ne pas ajouter `type="module"` manuellement au script tag (Vite le gere).
- Le warning Vite >500 kB est normal (bundle Sveltia CMS).

## Initialisation des valeurs par défaut (À faire avant toute utilisation)

> **⚠️ À SUPPRIMER APRES INITIALISATION** : Cette section doit être supprimée une fois que toutes les valeurs par défaut ont été remplacées et validées.

### Valeurs par défaut à initialiser pour Sveltia CMS

Le fichier `public/admin/config.yml` contient des **valeurs par défaut génériques** qui **doivent être remplacées** avant le premier déploiement ou utilisation du projet. Voici la liste des variables à initialiser :

| Variable | Valeur par défaut | Description | Exemple de valeur finale |
|----------|-------------------|-------------|--------------------------|
| `repo` | `USER/REPO_NAME` | Nom du dépôt Git hébergeant le contenu. | `LoicBabolat/mon-projet-cms` |
| `branch` | `cms` | Branche Git dédiée au contenu (doit exister). | `main` ou `cms` |
| `skip_ci` | `true` | Désactive les builds CI automatiques pour les commits de contenu. | `true` ou `false` |
| `preview_context` | `cloudflare` | Contexte de prévisualisation pour les PR. | `cloudflare` ou `netlify` |

---

#### Checklist d'initialisation
- [ ] Remplacer `USER/REPO_NAME` dans `public/admin/config.yml` par le nom du dépôt Git réel.
- [ ] Vérifier que la branche `branch` (ex: `cms`) existe dans le dépôt.
- [ ] Adapter `skip_ci` si nécessaire (ex: `false` pour activer les builds CI).
- [ ] Confirmer que `preview_context` correspond à l'hébergeur utilisé.
- [ ] Tester localement avec `wrangler dev` et vérifier que `/admin/` charge la configuration.
- [ ] **Supprimer cette section** du `PLAN.md` une fois l'initialisation terminée.

---

## Detail des etapes completes

### Etape 4 — Config Sveltia (Fait)

- `public/admin/config.yml` : config avec la ligne de schema pour validation.
- Backend : `github` + `auth_methods: [token]` (access token, pas d'OAuth).
  Valeurs `USER/REPO_NAME` et `branch: cms` a initialiser (voir TODO.md).
- `media_folder: /public/media`, `public_folder: /media` (dossier public/
  servi a la racine par Astro).
- Chargement de `/admin/` valide via `wrangler dev` (page + bundle + config.yml OK).

### Etape 5 — Collection exhaustive Sveltia (Fait)

Deux collections dans `public/admin/config.yml` :
- `authors` (folder `src/content/authors`) : cible du widget relation.
- `posts` (folder `src/content/posts`) : couvre les 19 widgets Sveltia :
  string, text, number, boolean, select, color, datetime, richtext,
  image, file, list (x2 : sous-champ unique et sous-champs multiples),
  object, keyvalue, relation, code, map, compute, uuid, hidden.
- Options verifiees contre `references/fields.md`, `fields-structural.md`,
  `fields-other.md` du skill `.agents/skills/sveltia-cms/`.
- Syntaxe YAML validee (python yaml) + structure verifiee par script.

### Etape 6 — Astro Content Collections (Fait)

- `src/content.config.ts` : schemas Zod `authors` et `posts` alignes sur les
  champs Sveltia (glob loader, valeurs par defaut pour les champs optionnels).
- Pages : `src/pages/index.astro` (liste), `src/pages/posts/[slug].astro` (detail).
- Contenu d'exemple : `src/content/posts/hello-world.md` (kitchen sink),
  `src/content/posts/minimal-post.md` (champs requis seulement),
  `src/content/authors/loic-babolat.md`, `public/media/sample-cover.svg`.
- Drafts filtres des pages mais visibles dans le CMS.

### Etape 7 — Config Cloudflare (Fait)

- `wrangler.jsonc` : worker `git-cms-template`, binding ASSETS,
  `nodejs_compat`, observability — tel que scaffold par create-cloudflare.
- Decouverte : au `wrangler dev`/`deploy`, l'adapter `@astrojs/cloudflare`
  genere `dist/client/wrangler.json` et wrangler l'utilise (config
  "redirigee"). Comportement attendu, ne pas "fixer".
- Script npm ajoute : `wrangler-preview` (`astro build && wrangler dev`).

### Etape 8 — AGENTS.md du template (Fait)

`AGENTS.md` ecrit : stack et versions, commandes pnpm, structure,
conventions (alignement config.yml <-> schema Zod, collection exhaustive),
skills et MCP disponibles, pieges connus, liens doc.

### Etape 9 — Tests (Fait)

- `pnpm build` : OK, 4 pages generees (/, /posts/hello-world/,
  /posts/minimal-post/, /admin/).
- `wrangler dev` : OK, toutes les routes 200 (/, /admin/, /admin/config.yml,
  /media/sample-cover.svg, /posts/hello-world/).
- Bundle Sveltia servi : ~1.97 MB (warning Vite >500 kB normal).
- Reste a faire manuellement (necessite navigateur + token GitHub) :
  connexion via "Sign In with Token", creation d'un post via l'UI Sveltia,
  rebuild et verification de l'affichage.
