import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.NEXT_PUBLIC_WP_GRAPHQL_URL ?? 'http://localhost:8080/graphql',
  documents: ['src/graphql/**/*.ts'],
  generates: {
    'src/lib/gql/': {
      preset: 'client-preset',
      presetConfig: { fragmentMasking: false }
    }
  }
};
export default config;
