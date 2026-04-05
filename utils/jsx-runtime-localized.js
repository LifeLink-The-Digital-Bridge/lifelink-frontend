const isDev =
  typeof __DEV__ !== "undefined" ? __DEV__ : process.env.NODE_ENV !== "production";

const runtime = isDev
  ? require("react/cjs/react-jsx-runtime.development.js")
  : require("react/cjs/react-jsx-runtime.production.js");

const { localizeElementProps } = require("./localize-jsx-props");

if (isDev && !global.__lifelink_jsx_runtime_localized_loaded__) {
  global.__lifelink_jsx_runtime_localized_loaded__ = true;
  console.log("[i18n] Localized react/jsx-runtime active");
}

module.exports = {
  ...runtime,
  jsx(type, props, key) {
    return runtime.jsx(type, localizeElementProps(type, props), key);
  },
  jsxs(type, props, key) {
    return runtime.jsxs(type, localizeElementProps(type, props), key);
  },
};
