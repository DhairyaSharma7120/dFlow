/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                accent: '#FF5722',
                surface: '#303841',
                base: '#F5F5F5',
            },
        },
    },
    plugins: [],
}
