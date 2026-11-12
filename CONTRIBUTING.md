# Contributing

1. Open or pick an issue, then branch from `main`: `feat/<short-name>` or `fix/<short-name>`.
2. Keep each pull request to one issue. Put `Closes #<n>` in the description.
3. Before pushing, run:
   ```bash
   npm run typecheck && npm test && npm run build
   ```
4. Every change to the block format (`src/engine/`) needs a test in `tests/`.
5. Never commit `.env` or an API key.

## Block format changes

The format is defined in one place: the system prompt in `src/engine/prompts.ts` and the rules in
`src/engine/validator.ts`. If you change one, change the other in the same PR and add a test.
