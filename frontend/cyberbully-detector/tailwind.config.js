/** @type {import('tailwindcss').Config} */
export default {
  // Update the content array to point to all your source files
  content: [
    "./index.html",
    // This glob pattern correctly covers all .js, .jsx files (and .ts, .tsx if you use TypeScript) 
    // inside the 'src' directory.
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}