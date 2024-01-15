/**
 * Old custom configuration for React Native v0.71.
 * From @react-native/metro-config 0.72.1, it is no longer necessary to use a config function to access the complete default config.
 * Please port your custom configuration to metro.config.js.
 * Please see https://reactnative.dev/docs/metro to learn about configuration.
 */
const { withNxMetro } = require('@nx/react-native');

module.exports = withNxMetro(
  {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
  },
  {
    // Change this to true to see debugging info.
    // Useful if you have issues resolving modules
    projectRoot: __dirname,
    watchFolders: [],
    debug: false,
    // all the file extensions used for imports other than 'ts', 'tsx', 'js', 'jsx'
    extensions: [],
  }
);
