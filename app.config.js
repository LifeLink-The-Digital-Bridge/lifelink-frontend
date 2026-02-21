export default ({ config }) => {
  return {
    ...config,
    android: {
      ...config.android,
      config: {
        ...config.android?.config,
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
        },
      },
    },
    extra: {
      ...config.extra,
      eas: {
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
      },
      API_URL: process.env.EXPO_PUBLIC_API_URL,
    },
  };
};
