// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3A8BCA", // Sneat’te sık kullanılan mor
          hover: "#5a5ccc",
        },
        sidebarBg: "#F8F9FA", // açık gri
        navbarBg: "#FFFFFF",  // beyaz
        textColor: "#697A8D", // default text
      },
    },
  },
  plugins: [],
};
