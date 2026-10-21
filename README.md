# Cross-Words

A crossword game of encouraging KJV Bible verses. Each level hides a verse; solving the crossword reveals its words. Guess the verse early for bonus points.

## Put it on GitHub Pages
1. Create a new repository (for example `cross-words`) and upload every file in this folder, keeping the `icons` folder.
2. In the repo, go to Settings, then Pages. Under "Build and deployment", choose "Deploy from a branch", pick `main` and `/ (root)`, and save.
3. After a minute the game is live at `https://<your-username>.github.io/cross-words/`.
4. On her phone, open that link. On iPhone: Share, then Add to Home Screen. On Android: tap Install when prompted, or use the browser menu.

## Updating
- Whenever you change any file, open `sw.js` and bump `VERSION` (for example `crosswords-v2`) so installed copies pick up the change.
- To add verses, append `["Book 1:2", "Verse text."]` lines to the END of `verses.js` so existing level numbers don't shift.
- To add or improve clues, edit the `CLUES` list at the top of `engine.js` (format `WORD|Clue`). Words without a clue get a fill-in-the-blank clue from the verse.

## Files
- `index.html`, `style.css`, `app.js` — the game
- `engine.js` — crossword generator, clue bank, difficulty curve
- `verses.js` — 307 verses (one per level; endless rounds after that)
- `manifest.json`, `sw.js`, `icons/` — installable, works offline

Progress saves on the device (browser storage), so each phone keeps its own scores.
