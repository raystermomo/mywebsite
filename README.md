# raystermomo

A small, bilingual personal website. Plain HTML and CSS; no browser JavaScript, framework, or dependencies. About, Research, Projects, Background, and Skills & interests each have their own page. The language switch opens the matching page in the other language.

Website: <https://rayta0320.github.io/raystermomo.github.io/>

## Edit the content

1. Open `content.json`.
2. Edit the English (`en`) and Japanese (`ja`) text next to each other.
3. Run `npm run build` with Node.js installed. No `npm install` is needed.
4. Commit `content.json` and all regenerated HTML files together.

To add a project, copy an object in `projects` and update its title, URL, tools, and both descriptions. Reorder objects to reorder the page. Other sections work the same way. Use plain text; the build escapes HTML automatically and reports missing translations.

| Content | Location in `content.json` |
| --- | --- |
| Name, mascot, introduction, contact links | `profile` |
| Navigation and section headings | `labels` |
| Research | `research` |
| Projects | `projects` |
| Recent experience | `background` |
| Achievements under Background | `achievements` |
| Expandable activities and education | `earlier` |
| Skills, languages, personal interests | `about` |

## Edit the design

- `style.css`: colors, typography, spacing, and mobile layout.
- `scripts/build.mjs`: the shared HTML template for both languages.
- `scripts/pages.mjs`: page names and URL mapping, shared by the builder and preview server.
- `Images/`: existing mascot and project assets. Project screenshots are retained for future use.

The generated HTML files are overwritten on build. Edit the shared template or content instead.

## Preview locally

Run `npm run dev` from this directory and open <http://localhost:5173>. No dependency installation is needed. All pages build on startup and rebuild when you save `content.json` or the shared template. Refresh your browser to see edits. CSS and image edits are served directly. Restart the server if you add a new page to `scripts/pages.mjs`.

Visit `ja.html` to check the Japanese page. Stop the server with Ctrl+C. If the port is busy, use `npm run dev -- --port 5174`.

## GitHub Pages

Keep serving the repository root as before. The generated HTML is committed, so GitHub Pages does not need to run a build. All links use relative paths to work under the repository's Pages URL.

| Page | English | Japanese |
| --- | --- | --- |
| About | `index.html` | `ja.html` |
| Research | `research.html` | `research-ja.html` |
| Projects | `projects.html` | `projects-ja.html` |
| Background | `background.html` | `background-ja.html` |
| Skills & interests | `skills.html` | `skills-ja.html` |
