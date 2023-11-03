npm install husky -D
npm install -D @commitlint/config-conventional @commitlint/cli
//npm install -D lint-staged
npx husky install
npm set-script prepare "husky install"
npx husky add .husky/pre-commit "npm run lint"
echo "module.exports = {extends: ['@commitlint/config-conventional']};" > commitlint.config.js
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "${1}"'