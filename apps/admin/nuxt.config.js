const path = require('path')
const pkg = require('./package')

require('dotenv').config()

module.exports = {
  mode: 'universal',
  server: {
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'Habilhome Admin',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ],
    script: [
      {
        src:
          '//polyfill.io/v3/polyfill.min.js?features=es2015%2CMutationObserver',
        crossorigin: 'anonymous',
        type: 'javascript'
      }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/style/app.styl',
    '~/assets/css/tailwind.css',
    '~/assets/scss/app.scss',
    '~node_modules/tinymce/skins/ui/oxide/skin.min.css',
    '~node_modules/tinymce/skins/ui/oxide/content.min.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    // '@/plugins/vuetify',
    '@/plugins/axios',
    '@/plugins/material-dashboard',
    '@/plugins/vue2-filters',
    { src: '@/plugins/tinymce', mode: 'client', ssr: false },
    { src: '@/plugins/material-dashboard-no-ssr', mode: 'client', ssr: false }
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/dotenv',
    '@nuxtjs/proxy',
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    [
      'nuxt-validate',
      {
        lang: 'fr'
      }
    ]
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    debug: process.env.NODE_ENV === 'development',
    proxy: true
    // See https://github.com/nuxt-community/axios-module#options
  },
  proxy: {
    '/api/': {
      target: process.env.CONTAINER_API_URL,
      pathRewrite: { '^/api/': '' }
    }
  },
  router: {
    linkActiveClass: 'active md-rose'
  },
  /*
  ** Build configuration
  */
  build: {
    filenames: {
      chunk: ({ isDev }) => (isDev ? '[name].js' : '[id].[chunkhash].js')
    },
    postcss: {
      plugins: {
        'postcss-url': {},
        tailwindcss: path.resolve(__dirname, './tailwind.config.js'),
        cssnano: {
          preset: 'default',
          discardComments: { removeAll: true },
          zIndex: false
        }
      },
      preset: {
        stage: 0,
        autoprefixer: {
          cascade: false,
          grid: true
        }
      }
    },
    /**
     * Extract CSS
     */
    extractCSS: true,
    // transpile: ['vuetify/lib'],
    transpile: ['vue-material/src'],
    // plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      stylus: {
        import: ['~assets/style/variables.styl']
      }
    },

    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          // loader: 'eslint-loader',
          exclude: /(node_modules)/
        })

        // Remove unused CSS using purgecss. See https://github.com/FullHuman/purgecss
        // for more information about purgecss.
        // config.plugins.push(
        //   new PurgecssPlugin({
        //     paths: glob.sync([
        //       path.join(__dirname, './pages/**/*.vue'),
        //       path.join(__dirname, './layouts/**/*.vue'),
        //       path.join(__dirname, './components/**/*.vue')
        //     ]),
        //     whitelist: ['html', 'body']
        //   })
        // )
      }
    }
  }
}
