import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import postcss from '@tailwindcss/postcss'

export default {
  plugins: [
    postcss(),
    tailwindcss(),
    autoprefixer()
  ]
}