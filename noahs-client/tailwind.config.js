 /** @type {import('tailwindcss').Config} */
 export default {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        maincolor: {
          highlight2: "#653A36",
          highlight: "#D16A54",
          highlight3: "#EAAD62",
          primary: "#E8D4A5",
          secondary: "#CFBF72",
          sectionsdark: "#7A7D55",
          sections: "#314A4A",
          whitetext: "#E3E3E3",
          blacktext: "#212121",
        },
      },
      fontFamily: {
        'monserrat': ['Montserrat'],
      },
    },
  },
  plugins: [],
}
