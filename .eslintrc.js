module.exports = {
  root: true,
  extends: "@react-native-community",
  parser: "@typescript-eslint/parser",
  plugins: ["jest", "@typescript-eslint"],
  rules: {
    "react/jsx-uses-react": 0,
    "react/react-in-jsx-scope": 0,
    quotes: 0,
    "prettier/prettier": 0,
    "react-native/no-unused-styles": 1,
    "react-native/no-single-element-style-arrays": 1,
    "react/no-unstable-nested-components": 2,
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "@typescript-eslint/no-shadow": ["error"],
        "no-shadow": "off",
        "no-undef": "off",
      },
    },
  ],
};
