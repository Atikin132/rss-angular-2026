export default {
  extends: ['@commitlint/config-conventional'],

  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'test',
        'chore',
        'ci',
        'build',
        'perf',
        'revert',
      ],
    ],

    'type-case': [2, 'always', 'lower-case'],

    'subject-case': [0],
    'header-format': [2, 'always'],
  },

  plugins: [
    {
      rules: {
        'header-format': ({ header }) => {
          const regex =
            /(^(feat|fix|style|refactor|test|chore|ci|build|perf|revert): RSA-\d+ [a-z].+$)|(^(docs): .+$)/;
          const valid = regex.test(header);
          return [valid, 'Commit must be in format: <type>: RSA-<number> <description>'];
        },
      },
    },
  ],
};
