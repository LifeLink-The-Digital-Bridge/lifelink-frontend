const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "react/jsx-runtime") {
    return {
      type: "sourceFile",
      filePath: path.resolve(__dirname, "utils/jsx-runtime-localized.js"),
    };
  }

  if (moduleName === "react/jsx-dev-runtime") {
    return {
      type: "sourceFile",
      filePath: path.resolve(__dirname, "utils/jsx-dev-runtime-localized.js"),
    };
  }

  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
