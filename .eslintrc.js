module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "es2021": true,
        "jquery": true,
        "jest/globals": true,
    },
    "globals": {
        "NodeJS": true,
        "JQuery": true,
        "$": 'readonly',
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        'airbnb',
        'airbnb-typescript/base',
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "project": "./tsconfig.json"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'],
        "@typescript-eslint/no-shadow": "off",
    },
}
