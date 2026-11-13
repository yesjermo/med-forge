# Published courses

Course packs (`.json`) in this folder are built into the website, so everyone who opens the
deployed site sees them. Unlike `site/src/med/local/`, this folder is committed to git.

- `npm run course:bundle -- --publish` writes your course folders here, or
- drop a pack downloaded from the app (**Tools › Add or import a course › Export pack**) or made with
  `npm run course:pack` into this folder.

Only publish material you wrote yourself or have permission to share.
