# Grow the Tree 🌳

An interactive game and guided workshop for learning **Opportunity Solution Trees** and **continuous discovery** (Teresa Torres, [producttalk.org](https://www.producttalk.org)), with **Marty Cagan's four big risks** and **opportunity assessment** ([svpg.com](https://www.svpg.com)).

## Two ways to use it

### 🎮 Practice with a scenario
Pick one of three scenarios:
- **Forkful**: a consumer recipe app
- **Shiftly**: B2B scheduling software for restaurant managers
- **Lingo Lane**: a language-learning subscription app

Then build a tree over 9 levels:
1. **Outcome**: choose a product outcome, not an output or a business outcome
2. **Opportunities**: sort interview notes into opportunities, solutions in disguise and company needs
3. **Structure**: put opportunities under moments from the experience map
4. **Assess**: compare sibling opportunities and pick a target
5. **Solutions**: pick three solutions to compare and contrast
6. **Four big risks**: sort assumptions into value, usability, feasibility and business viability
7. **Assumption mapping**: find the leap of faith
8. **Choosing a test**: match each test to the risk it addresses
9. **Testing**: design a fast, honest test with success criteria set in advance

### 🌱 Build it yourself
A guided workshop for your own product, in 11 steps:
1. Context and product trio
2. Outcome: guided questions take you from a business outcome to a product outcome, and flag drafts that look like outputs
3. Weekly customer interviews: cadence, recruiting, a story-based opener, and a downloadable recurring calendar invite (.ics)
4. Experience map: the moments that become your top-level branches
5. Opportunities: flags solutions in disguise and company-centric wording
6. Assess before you solve: score opportunities on sizing, market, company and customer factors, then choose a target
7. Marty Cagan's opportunity assessment: 10 questions and a go / not yet / no-go decision
8. Solutions: at least three for the target
9. Assumptions grouped by the four big risks, with coverage checks per solution
10. Assumption tests, ranked by importance × lack of evidence, with test ideas for each risk and success criteria set up front
11. Summary: download as Markdown, save or load a JSON backup, print

Workshop progress is saved in the browser (`localStorage`). Nothing is sent anywhere.

## Host on GitHub Pages

1. Create a new repository on GitHub (for example `ostree`).
2. Upload every file in this folder (`index.html`, `styles.css`, `content.js`, `app.js`, `workshop.js`, `README.md`, `.nojekyll`) to the root of the repository, or push them:
   ```bash
   git init
   git add .
   git commit -m "Grow the Tree game"
   git branch -M main
   git remote add origin https://github.com/<your-username>/ostree.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages**, set **Source** to *Deploy from a branch*, choose `main` and `/ (root)`, then click **Save**.
4. After a minute or so, the game is live at `https://<your-username>.github.io/ostree/`.

There's no build step. You can also just double-click `index.html` to play locally.

## Customize

| File | What's in it |
|---|---|
| `content.js` | All scenario text (`SCENARIOS`) and the level definitions (`buildLevels`). Copy a scenario object to add your own. |
| `app.js` | Home screen, game engine, tree rendering |
| `workshop.js` | The Build-it-yourself workshop |
| `styles.css` | Colors (light and dark), layout |

---

*An independent project made out of curiosity, for learning purposes. It isn't affiliated with or endorsed by Teresa Torres, Product Talk, Marty Cagan / SVPG. Opportunity Solution Trees and Continuous Discovery Habits are by Teresa Torres / Product Talk; the four big risks and the opportunity assessment are by Marty Cagan / SVPG.*
