module.exports = function(api) {
  api.cache(true);
  return {
    
    presets: ['babel-preset-expo']
    // "presets": ["react-native", "react-native-dotenv"]
    // presets: ['babel-preset-expo'],
    // presets: ['babel-preset-expo', 'module:react-native-dotenv'],
  };
};
