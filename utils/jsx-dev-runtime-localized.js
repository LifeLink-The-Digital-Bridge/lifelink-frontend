const isDev =
  typeof __DEV__ !== "undefined" ? __DEV__ : process.env.NODE_ENV !== "production";

const runtime = isDev
  ? require("react/cjs/react-jsx-dev-runtime.development.js")
  : require("react/cjs/react-jsx-dev-runtime.production.js");

const { localizeElementProps } = require("./localize-jsx-props");

if (isDev && !global.__lifelink_jsx_dev_runtime_localized_loaded__) {
  global.__lifelink_jsx_dev_runtime_localized_loaded__ = true;
  console.log("[i18n] Localized react/jsx-dev-runtime active");
}

module.exports = {
  ...runtime,
  jsxDEV(type, props, key, isStaticChildren, source, self) {
    return runtime.jsxDEV(
      type,
      localizeElementProps(type, props),
      key,
      isStaticChildren,
      source,
      self
    );
  },
};
