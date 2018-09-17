module.exports = {
  presets: [
    '@babel/env',
    '@babel/stage-1',
    '@babel/typescript',
    '@babel/react',
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
