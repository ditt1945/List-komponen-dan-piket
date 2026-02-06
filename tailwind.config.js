export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        elite: {
          orange: "#ff7a00", // Reference repo primary
          black: "#0e0e0e",  // Reference repo dark mode bg
          gray: "#1a1a1a",   // Reference repo card bg 
          text: "#f2f2f2",   // Reference repo text
          subtext: "#b5b5b5" // Reference repo subtext
        }
      },
      fontFamily: {
        elite: ['"Space Grotesk"', 'sans-serif']
      }
    },
  },
  plugins: [],
}
