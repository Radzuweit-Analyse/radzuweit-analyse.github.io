## 🧞 Commands
All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Deploying to GitHub Pages
This project contains a GitHub Actions workflow that builds and publishes the site to GitHub Pages whenever you push to `main`.

1. Push the repository to GitHub.
2. In your repository settings, enable **Pages** and select **GitHub Actions** as the source.
3. Update the `site` value in [`astro.config.mjs`](astro.config.mjs) so it matches your GitHub Pages URL (`https://<username>.github.io` or `https://<username>.github.io/<repo>`).
4. Commit and push your changes. The workflow will build the site and deploy it automatically.
