var module = module.exports = {
  port: 4000,

  tasks: {
    imagemin:   true,
    sass:       true,
    server:     true,
    webpack:    false,
    scripts:    true,
  },

  paths: {
    dest:      '_site',
    posts:     '_posts',
    assets:    './assets',
    css:       'css',
    js:        'js',
    images:    'img',
    sass:      '_sass',
    jsSrc:     '_js',
    imagesSrc: '_img',
  },

  jekyll: {
    config: '_config.yml'
  },

  sass: {
    outputStyle: 'compressed',
  },

  autoprefixer: {
    browsers: [
      'last 3 versions',
    ]
  },

  js: {
    entry: [
      'plugins/*',
      'script.js'
    ],
    output: 'bundle.js'
  },
};
