# Grow the Tree 🌳

An interactive browser game for learning **Opportunity Solution Trees** and **continuous discovery**, inspired by Teresa Torres's work at [producttalk.org](https://www.producttalk.org).

You play the PM of a fictional recipe app and build a tree in 8 short levels:

1. **Outcome**: choose a product outcome, not an output or a business outcome
2. **Opportunities**: sort interview notes into opportunities, solutions in disguise and company needs
3. **Structure**: put opportunities under moments from the experience map
4. **Target**: compare sibling opportunities and pick one
5. **Solutions**: pick three solutions for the target opportunity (compare and contrast)
6. **Assumptions**: sort assumptions as desirability, viability, feasibility, usability or ethical
7. **Assumption mapping**: find the leap-of-faith assumption
8. **Testing**: choose a fast, honest assumption test

The tree grows beside you as you play.

## Host on GitHub Pages

1. Create a new repository on GitHub (for example `ostree`).
2. Upload `index.html`, `README.md` and `.nojekyll` to the root of the repository, or push them:
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

There are no build steps or dependencies: it's a single static HTML file. You can also open `index.html` directly in a browser.

## Customize

All game content lives in the `LEVELS` array near the top of the `<script>` in `index.html`. Edit the text, options and explanations to fit your own product scenario.

---

*An unofficial, fan-made learning tool. "Opportunity Solution Tree" and "Continuous Discovery Habits" are concepts by Teresa Torres / Product Talk.*
