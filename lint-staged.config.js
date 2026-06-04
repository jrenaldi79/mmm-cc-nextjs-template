/**
 * lint-staged configuration.
 * Runs on staged files before each commit (invoked by .husky/pre-commit).
 * ESLint auto-fixes app/lib/components/types source; Prettier formats everything.
 */
module.exports = {
  '{app,components,lib,types}/**/*.{ts,tsx,js,jsx}': [
    'eslint --fix --no-warn-ignored',
  ],
  '**/*.{ts,tsx,js,jsx,json,css,md}': ['prettier --write'],
};
