module.exports = {
  extends: [
    "airbnb-typescript",
    "airbnb/hooks",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],
  plugins: ['react', '@typescript-eslint'],
  env: {
    browser: true,
    es6: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: "module",
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      alias: {
        map: [
          ['~', './src'],
        ],
        extensions: ['.ts', '.tsx']
      },
    }
  },
  rules: {
    "prettier/prettier": "error",
    "react/jsx-filename-extension": [
      1,
      { "extensions": [".js", ".jsx", ".ts", ".tsx"] },
    ],
    "no-param-reassign": ["error", { "props": false }],
    "react-hooks/exhaustive-deps": "off",
    "react/button-has-type": "off",
    "react/jsx-props-no-spreading": [2, { "custom": "ignore" }],
  },
};
