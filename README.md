Testing Postman Orbit

## Harry Potter x Octocat Matcher

This repository now contains a small static web page that:

- uses the no-key Harry Potter character API at `https://hp-api.onrender.com/api/characters`
- uses the no-key Octodex API exposed by the `jonico/octodex-rest-api` project
- shows five curated Harry Potter ↔ Octocat matches based on shared characteristics

### Files

- `index.html` – page structure
- `styles.css` – page styling
- `app.js` – API fetching, fallback handling, and curated matching logic

### Run locally

From the repository root, start any static server. For example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

### Notes

- The page tries live public endpoints first.
- If a public endpoint is unavailable, the page falls back to a small curated data set so the five matches still render.
- The Octodex match characteristics are curated in the app because the Octodex response provides titles, images, and authors rather than rich personality metadata.
