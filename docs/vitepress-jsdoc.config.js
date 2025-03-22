module.exports = {
  source: {
    include: [
      '../src/lib',
      '../src/components',
      '../src/pages'
    ],
    includePattern: '\\.(jsx|js|ts|tsx)$'
  },
  opts: {
    recurse: true,
    destination: './api',
    template: 'vitepress-jsdoc'
  },
  plugins: [
    'plugins/markdown',
    'node_modules/jsdoc-babel'
  ],
  tags: {
    allowUnknownTags: true
  },
  babel: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    ignore: ['**/*.d.ts'],
    babelrc: false,
    configFile: false,
    presets: [
      ['@babel/preset-env', { targets: { node: true } }],
      '@babel/preset-typescript'
    ],
    plugins: [
      '@babel/plugin-transform-class-properties',
      '@babel/plugin-transform-object-rest-spread'
    ]
  }
}