import { GraphQLClient } from 'graphql-request';

// Sur le serveur, le front joint WordPress par le réseau Docker interne
// (`WP_GRAPHQL_INTERNAL_URL`, lue à l'exécution) ; sinon par l'adresse publique.
const endpoint =
  process.env.WP_GRAPHQL_INTERNAL_URL ??
  process.env.NEXT_PUBLIC_WP_GRAPHQL_URL ??
  'http://localhost:8080/graphql';

export const wpClient = new GraphQLClient(endpoint);

export async function wpQuery<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  return wpClient.request<T>(query, variables ?? {});
}
