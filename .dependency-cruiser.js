/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-deep-imports',
      severity: 'error',
      from: { pathNot: '^packages/shared/' },
      to: { path: '^packages/shared/src/', pathNot: '^packages/shared/src/index\\.ts$' },
      comment: 'Only @ecom/shared/<export-path> allowed. Internal src/ files unreachable from outside shared/'
    },
    {
      name: 'no-circular-deps',
      severity: 'error',
      from: {},
      to: { circular: true },
      comment: 'Zero tolerance for circular dependencies'
    },
    {
      name: 'prisma-server-only',
      severity: 'error',
      from: { path: '^(apps/(storefront|admin|seller)/|packages/ui-|packages/core-ui)' },
      to: { path: '^packages/shared/src/pagination/prisma' },
      comment: 'Prisma pagination helpers are server-only — cannot be imported from UI/client packages'
    },
    {
      name: 'react-client-only',
      severity: 'error',
      from: { path: '^(apps/api-|packages/database|packages/auth|packages/nestjs-core|packages/redis|packages/email)' },
      to: { path: '^packages/shared/src/pagination/react' },
      comment: 'React pagination hooks are client-only — cannot be imported from backend packages'
    },
    {
      name: 'contracts-no-internal-deps',
      severity: 'error',
      from: { path: '^packages/contracts/' },
      to: { path: '^packages/(shared|database|auth|redis|email|nestjs-core|api-client|core-ui|ui-|config)/' },
      comment: 'contracts is a stable leaf — it cannot import from any internal workspace package'
    },
    {
      name: 'shared-leaf-only',
      severity: 'error',
      from: { path: '^packages/shared/' },
      to: { path: '^packages/(contracts|database|auth|redis|email|nestjs-core|api-client|core-ui|ui-|config)/' },
      comment: 'shared is a leaf — it cannot import internal workspace packages (external libs only)'
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.json',
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },
    reporterOptions: {
      dot: { collapsePattern: 'node_modules/[^/]+' },
      archi: { collapsePattern: 'node_modules/[^/]+' },
    },
  },
};