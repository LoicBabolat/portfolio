# AGENTS.md — git-cms-template

Template de base pour sites de contenu : **Astro + Sveltia CMS + Cloudflare Workers**.
Tout agent travaillant dans ce depot doit suivre ce fichier. Le detail de la creation
du template est dans [`PLAN.md`](PLAN.md) — le lire avant de demarrer un travail.

## Stack

| Composant | Version | Notes |
|-----------|---------|-------|
| Astro | ^7.3.3 | output `static`, adapter `@astrojs/cloudflare` ^14.3.2 |
| Sveltia CMS | ^0.214.1 | package npm `@sveltia/cms` (pas le script CDN) |
| Wrangler | ^4.135.0 | worker `git-cms-template` |
| Node | >= 22.12.0 | |
| pnpm | | seul package manager autorise (pas npm/yarn) |

## Commandes

```bash
pnpm install            # dependances
pnpm dev                # serveur Astro (localhost:4321), sans runtime Workers
pnpm build              # build de production vers dist/
pnpm wrangler-preview   # build + wrangler dev (runtime Workers local, localhost:8787)
pnpm deploy             # build + wrangler deploy
pnpm cf-typegen         # regenere worker-configuration.d.ts
```

En dev, preferer le mode background :

```
astro dev --background
```

Gestion du serveur background : `astro dev stop`, `astro dev status`, `astro dev logs`.

## Structure

```
public/
  admin/config.yml      # config Sveltia CMS (backend, collections, widgets)
  media/                # fichiers telecharges via le CMS (servis sous /media/)
src/
  content.config.ts     # Content Collections : schemas Zod (authors, posts)
  content/
    authors/            # entrees auteurs (cible du widget relation)
    posts/              # entrees posts (front matter YAML + body markdown)
  layouts/Layout.astro
  pages/
    index.astro         # liste des posts
    posts/[slug].astro  # detail d'un post
    admin/index.astro   # page Sveltia CMS (standalone, import npm)
wrangler.jsonc          # config Workers (ASSETS, nodejs_compat, observability)
```

## Conventions

- Le contenu vit dans `src/content/` (front matter YAML + markdown).
  Le schema Zod de `src/content.config.ts` doit rester aligne avec les
  champs definis dans `public/admin/config.yml` : tout champ ajoute au CMS
  doit etre ajoute au schema Zod (et reciproquement).
- Les medias telecharges via le CMS vont dans `public/media/` et sont
  servis sous `/media/`.
- La collection `posts` est volontairement exhaustive : elle couvre tous les
  widgets Sveltia (string, text, number, boolean, select, color, datetime,
  richtext, image, file, list, object, keyvalue, relation, code, map,
  compute, uuid, hidden). Ne pas la reduire sans demander.
- Backend CMS : GitHub avec authentification par personal access token
  (`auth_methods: [token]`, bouton "Sign In with Token"). Les valeurs
  `USER/REPO_NAME` et la branche sont des placeholders a initialiser —
  voir [`TODO.md`](TODO.md).

## Initialisation d'un nouveau projet

A la creation d'un projet depuis cette template, **initialiser les valeurs
par defaut de Sveltia CMS** en suivant [`TODO.md`](TODO.md) (remplacer
`USER/REPO_NAME`, la branche, `skip_ci`, `preview_context` dans
`public/admin/config.yml`), puis **supprimer TODO.md**.

## Skills disponibles

- `sveltia-cms` (`.agents/skills/sveltia-cms/`) : reference complete des
  options de config. **Toujours consulter `references/fields*.md` avant de
  modifier `config.yml`** — ne pas inventer d'options.
- Globaux : `cloudflare`, `wrangler`, `workers-best-practices`, `web-perf`.

## MCP disponibles

- `cloudflare-docs` et `astro-docs` (config projet `.vibe/config.toml`).
- `mistralai`, `context7` (herites de la config globale).

## Pieges connus

- **Sveltia via npm, pas CDN** : `src/pages/admin/index.astro` importe
  `@sveltia/cms` et appelle `CMS.init()` sans argument (charge
  `/admin/config.yml` automatiquement). Ne pas ajouter de `<link>` CSS ni
  de `type="module"` manuel — Vite gere le bundle.
- **Warning Vite >500 kB** : normal, c'est le bundle Sveltia CMS (~1.9 MB).
  Ne pas essayer de le "corriger".
- **`nodejs_compat` requis** : flag necessaire dans `wrangler.jsonc`
  (deja present). Ne pas le retirer.
- **Config wrangler redirigee** : au `wrangler dev`/`deploy`, l'adapter
  genere `dist/client/wrangler.json` et wrangler l'utilise a la place de
  `wrangler.jsonc` pour les assets. C'est le comportement attendu
  d'`@astrojs/cloudflare` — ne pas "fixer" `assets.directory` manuellement.
- **`astro preview`** ne simule pas le runtime Workers ; utiliser
  `pnpm wrangler-preview` pour tester avec les bindings Workers.
- **Champ `body`** : le widget richtext nomme `body` est ecrit sous le
  front matter (pas dans la YAML) ; Astro l'expose via `entry.body`,
  il n'apparait pas dans le schema Zod.
- **Drafts** : les entrees avec `draft: true` sont filtrees des pages
  (index et getStaticPaths), mais restent visibles dans le CMS.

## Documentation

- Astro : https://docs.astro.build — voir notamment
  [content collections](https://docs.astro.build/en/guides/content-collections/)
  et [routing](https://docs.astro.build/en/guides/routing/).
- Sveltia CMS : https://sveltiacms.app (et le skill local `sveltia-cms`).
- Cloudflare Workers : https://developers.cloudflare.com/workers/
