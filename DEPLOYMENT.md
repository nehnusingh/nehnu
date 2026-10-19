# Publish this portfolio with GitHub Pages

Repository: https://github.com/nehnusingh/nehnu

Expected website URL after a successful deployment: https://nehnusingh.github.io/nehnu/

## One-time setup

1. Open the repository on GitHub. For free GitHub Pages hosting on GitHub Free, use a public repository.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, select **GitHub Actions** as the Source.
4. Open **Actions → Deploy portfolio to GitHub Pages**.
5. Click **Run workflow**, select `main`, and run it. If the first automatic run failed before Pages was enabled, run the workflow again now.
6. Wait for both `build` and `deploy` to finish successfully. Open the URL shown in the deployment job or Settings → Pages.

The workflow installs locked dependencies with `npm ci`, builds the React app into static HTML and assets, runs SEO/contact checks, and deploys only `dist/`. It runs again whenever a commit is pushed to `main`.

## Configuration

The committed `.env` contains only public configuration:

```dotenv
SITE_URL=https://nehnusingh.github.io/nehnu/
```

This URL generates the canonical tag, sharing URLs, sitemap, and structured data. Relative asset paths already support the `/nehnu/` project path. If you later add a custom domain in Settings → Pages, update `SITE_URL` to match and push the change. Keep passwords and API secrets out of the tracked `.env`; this static contact form needs neither.

## Contact form activation

Once the site is live, submit a test inquiry. Open the FormSubmit activation email in `nehnusingh81@gmail.com` and confirm it (check Spam too). Submit a fresh inquiry after confirmation to verify delivery.

## Verify the live site

- Open the homepage and check that styling loads.
- Hover/click the project and Raw Footage videos.
- Check https://nehnusingh.github.io/nehnu/sitemap.xml and https://nehnusingh.github.io/nehnu/robots.txt.
- Submit the sitemap URL in Google Search Console after verifying site ownership. On GitHub Pages project hosting, `robots.txt` in `/nehnu/` is not the domain-root robots file; submit the sitemap directly or add its reference to the root site's robots.txt if you control that site.

## Publish later changes

```sh
git add .
git commit -m "Update portfolio"
git push origin main
```

Check the Actions tab for deployment results. For local preview, run `npm install` once, then `npm run dev`.

## Troubleshooting

- **Pages configuration or 404 error:** Check Settings → Pages → Source = GitHub Actions, then rerun the workflow.
- **Permission error:** Check that repository/organization policies allow GitHub Actions and Pages. The deployment job declares `pages: write` and `id-token: write`.
- **Blank or broken styling:** Open the published `/nehnu/` URL and deploy the workflow's `dist/` artifact, rather than raw source files.
- **No contact email:** Complete FormSubmit's activation and check Spam. A successful request alone does not prove inbox delivery.

References: [GitHub Pages publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [FormSubmit help](https://formsubmit.co/help).
