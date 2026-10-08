import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'zip-source/**',
    'public/**',
    'node_modules/**',
  ]),
  {
    rules: {
      'react/no-unescaped-entities': 'error',
      '@next/next/no-img-element': 'warn',
      // Next 16 / React 19 eslint-plugin-react-hooks is stricter than 15.x.
      // These effects read matchMedia / localStorage after mount — valid.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
]);

export default eslintConfig;
