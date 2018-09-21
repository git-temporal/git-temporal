module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          node: '8',
        },
      },
    ],
    [
      '@babel/stage-1',
      {
        decoratorsLegacy: true,
      },
    ],
    '@babel/typescript',
  ],
  plugins: [
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          test: './test',
        },
      },
    ],
  ],
};
