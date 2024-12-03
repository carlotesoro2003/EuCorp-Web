export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    "postcss-preset-env": {
      stage: 0, // Enable all modern CSS features
      features: {
        "color-function": true, // Converts `oklch` to supported formats
      },
    },
  },
};
