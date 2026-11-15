# Karate Nuggets Digital Library

A responsive static website for the Karate Nuggets poster collection. Built with HTML, CSS and vanilla JavaScript; designed for GitHub Pages.

## Categories
The website uses exactly five categories:
- All Nuggets (collection view, not a content category)
- Masters
- Quick Reference
- Insights
- Back to Basics

## Features
- Featured poster carousel
- Complete responsive poster grid
- Category filtering and tag filtering
- Search across titles, descriptions, categories and tags
- Sorting: featured, newest, oldest and title A–Z
- Full-size poster viewer with previous/next navigation
- Individual poster downloads
- Mobile navigation

## Add a Nugget
1. Add the poster image under `assets/nuggets/<category-folder>/`.
2. Add an object to `data/nuggets.json`.
3. Use one of the four content categories: `Masters`, `Quick Reference`, `Insights`, `Back to Basics`.
4. Set `thumbnail` and `download` to the poster's relative path.
5. Set `featured` to `true` if it should appear in the featured carousel.

Example:
```json
{
  "id": "KN-002",
  "title": "Seiken",
  "subtitle": "The straight punch",
  "category": "Quick Reference",
  "tags": ["Terminology", "Kihon", "Punches"],
  "description": "A quick reference card about Seiken.",
  "thumbnail": "assets/nuggets/quick-reference/seiken.png",
  "download": "assets/nuggets/quick-reference/seiken.png",
  "featured": false,
  "dateAdded": "2026-11-15"
}
```

## Run locally
Because the site loads JSON using `fetch`, run it through a local static server rather than opening `index.html` directly. For example:
```bash
python -m http.server 8000
```
Then open `http://localhost:8000`.

## Publish with GitHub Pages
1. Create a public GitHub repository named `karate-nuggets`.
2. Upload the contents of this project (the files inside this folder, not the enclosing folder).
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then Save.
6. Wait for the deployment and open the Pages URL shown in Settings → Pages.

## Important
- GitHub Pages is static hosting. No database or server is required.
- The sample Ryo Kiyuna poster is included only if the earlier generated poster was available when this package was built.
- Only publish images and content that the dojo has permission to share.
