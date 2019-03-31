var module = module.exports = {
  port: 4000,

  tasks: {
    imagemin:   true,
    sass:       true,
    scripts:    true,
    server:     true,
    twitter:    true
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
    imagesSrc: '_img'
  },

  autoprefixer: {
    browsers: [
      'last 3 versions',
    ]
  },

};
