# TODO : Initialisation des valeurs par défaut pour Sveltia CMS

> **⚠️ À SUPPRIMER APRES INITIALISATION** : Ce fichier doit être supprimé une fois que toutes les valeurs par défaut ont été remplacées et validées.

---

## Contexte

Ce fichier fait partie de la **template de base** pour les projets utilisant **Sveltia CMS + Astro + Cloudflare Workers**, avec **Tailwind CSS**, **Vue JS** et **GSAP** intégrés par défaut. 
Il contient les **valeurs par défaut génériques** qui **doivent être remplacées** lors de la création d'un nouveau projet à partir de cette template.

---

## Valeurs par défaut à initialiser

Le fichier `public/admin/config.yml` contient des placeholders qui doivent être remplacés avant le premier déploiement ou utilisation du projet.

> **Note** : Seules les valeurs du dépôt (`repo`) doivent être modifiées pour un nouveau projet. Toutes les autres valeurs de configuration (hors collections) doivent rester les mêmes.

| Variable | Valeur par défaut | Description | Exemple de valeur finale |
|----------|-------------------|-------------|--------------------------|
| `repo` | `LoicBabolat/git-cms-template` | Nom du dépôt Git hébergeant le contenu (format : `ORGANISATION/NOM_DU_DEPOT`). | `LoicBabolat/mon-projet-cms` |

Le backend est `github` avec authentification par **personal access token**
(`auth_methods: [token]`) : à la première connexion à `/admin/`, utiliser le
bouton "Sign In with Token" et coller un token GitHub (les scopes requis sont
présélectionnés via le lien proposé par la boîte de dialogue). Aucune OAuth App
n'est nécessaire.

### Autres valeurs par défaut du template

| Fichier | Valeur par défaut | Description |
|---------|-------------------|-------------|
| `wrangler.jsonc` | `"name": "git-cms-template"` | Nom du worker Cloudflare. À renommer pour chaque projet (sinon risque de collision avec le worker du template). |
| `package.json` | `"name": "git-cms-template"` | Nom du package npm. À renommer pour chaque projet. |
| `src/content/posts/` | `hello-world.md`, `minimal-post.md` | Posts d'exemple du template : `hello-world` couvre tous les widgets, `minimal-post` montre les valeurs par défaut du schema. **À conserver pendant le développement** comme référence pour créer d'autres pages ; supprimables une fois le contenu réel en place. |
| `src/content/authors/` | `loic-babolat.md` | Auteur d'exemple (cible du widget relation), référencé par `hello-world.md`. À conserver avec les posts d'exemple. |
| `public/media/` | `sample-cover.svg` | Image d'exemple référencée par le post `hello-world.md`. À conserver avec les posts d'exemple. |
| `src/styles/global.css` | `@import "tailwindcss";` | Point d'entrée Tailwind CSS v4 (plugin `@tailwindcss/vite` dans `astro.config.mjs`). **À conserver** : c'est lui qui active Tailwind sur tout le site. Personnaliser le thème ici (directives `@theme`, etc.) si besoin. |
| `src/components/Vue/Count.vue` | Compteur réactif | Composant Vue 3 de démonstration (intégration `@astrojs/vue`). Sert de référence pour les props/models (`defineModel`) et l'hydratation (`client:load`). Supprimable une fois les vrais composants en place. |
| `src/pages/index.astro` | Blocs `.box` + script GSAP | Démonstration GSAP (tween + timeline sur trois blocs colorés en classes Tailwind). À remplacer par le contenu réel de la page d'accueil ; conserver le pattern `<script>` important `gsap` comme référence. |

Optionnel : ajouter `site_url` (URL publique du site) dans `public/admin/config.yml`
pour activer les liens de prévisualisation dans Sveltia CMS.

---

## Checklist d'initialisation

### 1. Remplacer les valeurs par défaut dans `public/admin/config.yml`
- [ ] Ouvrir `public/admin/config.yml` et remplacer `LoicBabolat/git-cms-template` par le nom du dépôt Git réel (ex: `LoicBabolat/mon-projet`).
- [ ] Optionnel : ajouter `site_url` avec l'URL publique du site.

### 2. Renommer le projet
- [ ] Remplacer `"name": "git-cms-template"` par le nom du worker dans `wrangler.jsonc`.
- [ ] Remplacer `"name": "git-cms-template"` par le nom du projet dans `package.json`.

### 3. Contenu d'exemple
- [ ] **Conserver** les posts d'exemple (`hello-world.md`, `minimal-post.md`), l'auteur (`loic-babolat.md`) et l'image (`sample-cover.svg`) pendant le développement : ils servent de référence complète pour créer d'autres pages et vérifier le rendu de chaque widget.
- [ ] Optionnel, une fois le contenu réel en place : supprimer les exemples.

### 4. Code de démonstration (Tailwind / Vue / GSAP)
- [ ] Remplacer les blocs de démonstration `.box` et le script GSAP de `src/pages/index.astro` par le contenu réel de la page d'accueil.
- [ ] Remplacer ou supprimer `src/components/Vue/Count.vue` une fois les vrais composants en place.
- [ ] **Conserver** `src/styles/global.css` (import Tailwind) et les entrées `@tailwindcss/vite` / `@astrojs/vue` / `gsap` dans `astro.config.mjs` et `package.json` : elles font partie de la stack de base du template.

### 5. Valider la configuration
- [ ] Exécuter `pnpm install` pour s'assurer que toutes les dépendances sont installées.
- [ ] Lancer `pnpm run dev` ou `wrangler dev` et vérifier que :
  - La page `/admin/` charge correctement.
  - La connexion via "Sign In with Token" fonctionne avec un token GitHub valide.
  - Aucune erreur n'apparaît dans la console du navigateur.
  - La configuration est bien prise en compte (vérifier dans les logs ou l'interface de Sveltia CMS).
- [ ] Exécuter `pnpm build` : le build doit passer sans erreur de validation Zod.
- [ ] Vérifier que la stack front par défaut fonctionne :
  - Les classes Tailwind s'appliquent (les blocs `.box` de l'index sont colorés).
  - Le composant Vue `Count` s'hydrate (les boutons +/- modifient le compteur).
  - L'animation GSAP de l'index se joue au chargement.

### 6. Nettoyer
- [ ] **Supprimer ce fichier `TODO.md`** une fois que toutes les valeurs ont été remplacées et validées.
- [ ] Supprimer la section « Initialisation des valeurs par défaut » de `PLAN.md` (marquée « à supprimer après initialisation »).

---

## Notes supplémentaires

- **Pourquoi ces valeurs par défaut ?** : Elles permettent de démarrer rapidement avec une configuration fonctionnelle, tout en forçant l'utilisateur à les personnaliser pour son projet.
- **Où trouver `public/admin/config.yml` ?** : Ce fichier est à la racine du projet, dans le dossier `public/admin/`.
- **Que faire si une valeur est mal configurée ?** : Sveltia CMS affichera une erreur dans l'interface d'administration ou dans la console du navigateur.

---

## Références
- [Documentation officielle de Sveltia CMS](https://sveltiacms.app/) — voir notamment [l'authentification GitHub par access token](https://sveltiacms.app/en/docs/backends/github#access-token)
- [Schema de configuration Sveltia CMS](https://unpkg.com/@sveltia/cms/schema/sveltia-cms.json)
