const commitlintConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'refactor', 'perf', 'docs', 'chore', 'test', 'ci', 'build', 'revert'],
    ],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
    'header-max-length': [2, 'always', 500],
    'body-max-line-length': [2, 'always', 1000],
  },
} as const

export default commitlintConfig
export { commitlintConfig }
