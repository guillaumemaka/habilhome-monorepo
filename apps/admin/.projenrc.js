const { AwsCdkTypeScriptApp, NodeProject, CdkApprovalLevel } = require('projen')

const authorInfo = {
  authorName: 'Guillaume Maka',
  authorEmail: 'guillaume.maka@gmail.com'
}

const nuxtProject = new NodeProject({
  ...authorInfo,
  name: '@habilhome/admin',
  dependabot: false,
  gitignore: [
    '.secrets',
    'logs',
    '*.log',
    'npm-debug.log*',
    'yarn-debug.log*',
    'yarn-error.log*',
    'pids',
    '*.pid',
    '*.seed',
    '*.pid.lock',
    'lib-cov',
    'coverage',
    '.nyc_output',
    '.grunt',
    'bower_components',
    '.lock-wscript',
    'build/Release',
    'node_modules/',
    'jspm_packages/',
    'typings/',
    '.npm',
    '.eslintcache',
    '.node_repl_history',
    '*.tgz',
    '.yarn-integrity',
    '.env',
    '.cache',
    '.next',
    '.nuxt',
    'dist',
    '.vuepress/dist',
    '.serverless',
    '.idea',
    'sw.*'
  ],
  deps: [
    '@nuxtjs/axios@^5.3.6',
    '@nuxtjs/dotenv@1.3.0',
    '@nuxtjs/proxy@1.3.3',
    '@nuxtjs/pwa@^2.6.0',
    '@tinymce/tinymce-vue@2.1.0',
    '@tweenjs/tween.js@17.3.0',
    'chartist@0.11.0',
    'cookieparser@0.1.0',
    'cross-env@^5.2.0',
    'es6-promise@4.2.5',
    'fullcalendar@3.10.0',
    'fuse.js@3.4.2',
    'google-maps@3.3.0',
    'jquery@3.3.1',
    'js-cookie@2.2.0',
    'json-form-data@1.7.2',
    'jvectormap-next@3.0.0',
    'koa@^2.6.2',
    'koa-cookie@1.0.0',
    'lodash@4.17.11',
    'moment@2.24.0',
    'nouislider@13.1.0',
    'nuxt@^2.4.0',
    'nuxt-validate@0.1.2',
    'perfect-scrollbar@1.4.0',
    'remove-accents@0.4.2',
    'sweetalert2@8.7.0',
    'tinymce@^5.0.9',
    'vee-validate@2.1.7',
    'vue@^2.6.6',
    'vue-clickaway@2.2.2',
    'vue-gravatar@1.3.0',
    'vue-material@vuematerial/vue-material#dev',
    'vue-router@3.0.2',
    'vue-server-renderer@^2.6.6',
    'vue-template-compiler@^2.6.6',
    'vue2-filters@0.6.0',
    'vue2-transitions@0.2.3',
    'vuetify@^1.5.4',
    'vuetify-loader@^1.2.1',
    'vuex@^3.1.0'
  ],
  devDeps: [
    '@nuxtjs/eslint-config@^0.0.1',
    '@vue/test-utils@^1.0.0-beta.29',
    'autoprefixer@^9.5.1',
    'babel-core@7.0.0-bridge.0',
    'babel-eslint@^8.2.1',
    'babel-jest@^23.6.0',
    'cssnano@^4.1.10',
    'eslint@^5.0.1',
    'eslint-config-prettier@^3.1.0',
    'eslint-config-standard@>=12.0.0',
    'eslint-loader@^2.0.0',
    'eslint-plugin-import@>=2.14.0',
    'eslint-plugin-jest@>=21.24.1',
    'eslint-plugin-node@>=7.0.1',
    'eslint-plugin-prettier@2.6.2',
    'eslint-plugin-promise@>=4.0.1',
    'eslint-plugin-standard@>=4.0.0',
    'eslint-plugin-vue@^5.0.0',
    'glob-all@3.1.0',
    'node-sass@^4.11.0',
    'nodemon@^1.18.9',
    'nuxt-purgecss@^0.2.1',
    'postcss-loader@^3.0.0',
    'postcss-preset-env@^6.6.0',
    'postcss-url@^8.0.0',
    'prettier@1.14.3',
    'purgecss-webpack-plugin@1.5.0',
    'sass-loader@7.1.0',
    'stylus@^0.54.5',
    'stylus-loader@^3.0.2',
    'tailwindcss@1.0.1',
    'vue-jest@^3.0.2'
  ],
  jest: true,
  jestOptions: {
    jestConfig: {
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '^~/(.*)$': '<rootDir>/$1',
        '^vue$': 'vue/dist/vue.common.js'
      },
      moduleFileExtensions: ['js', 'vue', 'json'],
      transform: {
        '^.+\\.js$': 'babel-jest',
        '.*\\.(vue)$': 'vue-jest'
      },
      testMatch: [
        '**/__tests__/**/*.(spec|test).js?(x)',
        '**/?(*.)+(spec|test).js?(x)'
      ]
    }
  },
  scripts: {
    lint: 'eslint --ext .js,.vue --ignore-path .gitignore .',
    precommit: 'npm run lint',
    'heroku-postbuild': 'yarn build',
    'vue-i18n-extract': 'vue-i18n-extract'
  },
  buildWorkflow: false,
  releaseWorkflow: false,
  defaultReleaseBranch: 'main',
  packageManager: 'pnpm'
})

nuxtProject.removeTask('build')
nuxtProject.removeTask('projen]')

nuxtProject.addTask('projen')
  .exec('npx projen --no-post')


nuxtProject.addTask('build')
.exec('nuxt build')

nuxtProject.addTask('dev')
.exec('cross-env NODE_ENV=development nodemon server/index.js --watch server')

nuxtProject.addTask('start')
.exec('cross-env NODE_ENV=production node server/index.js')

nuxtProject.addTask('generate')
.exec('nuxt generate')


nuxtProject.synth()

const cdkProject = new AwsCdkTypeScriptApp({
  parent: nuxtProject,
  outdir: 'cdk',
  ...authorInfo,
  name: '@habilhome/admin-cdk',
  cdkVersionPinning: true,
  cdkVersion: '1.77.0',
  requireApproval: CdkApprovalLevel.NEVER,
  cdkDependencies: [
    '@aws-cdk/aws-certificatemanager',
    '@aws-cdk/aws-ec2',
    '@aws-cdk/aws-ecr',
    '@aws-cdk/aws-ecr-assets',
    '@aws-cdk/aws-ecs',
    '@aws-cdk/aws-ecs-patterns',
    '@aws-cdk/aws-elasticloadbalancingv2',
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-route53',
    '@aws-cdk/aws-s3',
    '@aws-cdk/aws-sqs',
    '@aws-cdk/aws-ssm',
    '@aws-cdk/aws-servicediscovery'
  ],
  devDeps: ['esbuild'],
  defaultReleaseBranch: 'main',
  packageManager: 'pnpm'
})

cdkProject.addTask('projen')
.exec('npx projen --no-post')

if (process.env.EXCLUDE_CDK === undefined) {
  cdkProject.synth()
}
