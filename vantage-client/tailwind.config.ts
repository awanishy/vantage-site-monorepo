module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // 👈 catches everything inside /app
    "./app/components/**/*.{js,ts,jsx,tsx}", // 👈 catches /app/components
  ],
  theme: {
    extend: {
      screens: {
        // pick whatever width you want for "5xl"
        "5xl": "1200px", // example
      },
    },
  },
};
