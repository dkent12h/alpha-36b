/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'alpha-dark': '#0f172a', // Slate 900
                'alpha-card': '#1e293b', // Slate 800
                'alpha-accent': '#38bdf8', // Sky 400
                'alpha-green': '#10b981', // Emerald 500
                'alpha-red': '#ef4444', // Red 500
                'alpha-amber': '#f59e0b', // Amber 500
            }
        },
    },
    plugins: [
        require("tailwindcss-animate"),
    ],
}
