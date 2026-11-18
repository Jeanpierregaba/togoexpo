export const GET_HOME = /* GraphQL */ `
  query GetHome($first: Int = 10, $language: LanguageCodeFilterEnum) {
    editions(first: 100, where: { language: $language, orderby: { field: DATE, order: DESC } }) {
      nodes {
        slug
        title
        content
        editionFields {
          annee
          ville
          pays
          theme
          dateDebut
          dateFin
          estEvenementFutur
        }
        featuredImage { node { sourceUrl altText } }
      }
    }
    posts(first: $first, where: { language: $language, orderby: { field: DATE, order: DESC } }) {
      nodes {
        slug
        title
        date
        excerpt
        content
        categories { nodes { name slug } }
        featuredImage { node { sourceUrl altText } }
      }
    }
  }
`;

export const GET_EDITIONS = /* GraphQL */ `
  query GetEditions($language: LanguageCodeFilterEnum) {
    editions(first: 100, where: { language: $language, orderby: { field: DATE, order: DESC } }) {
      nodes {
        slug
        title
        content
        editionFields { annee ville pays theme dateDebut dateFin estEvenementFutur }
        featuredImage { node { sourceUrl altText } }
      }
    }
  }
`;

export const GET_POSTS = /* GraphQL */ `
  query GetPosts($first: Int = 20, $language: LanguageCodeFilterEnum) {
    posts(first: $first, where: { language: $language, orderby: { field: DATE, order: DESC } }) {
      nodes {
        slug
        title
        date
        excerpt
        categories { nodes { name slug } }
        featuredImage { node { sourceUrl altText } }
      }
    }
  }
`;

export const GET_POST = /* GraphQL */ `
  query GetPost($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      slug
      title
      date
      excerpt
      content
      categories { nodes { name slug } }
      featuredImage { node { sourceUrl altText } }
    }
  }
`;

export const GET_EDITION = /* GraphQL */ `
  query GetEdition($slug: ID!) {
    edition(id: $slug, idType: SLUG) {
      title
      content
      editionFields {
        annee
        ville
        pays
        theme
        dateDebut
        dateFin
        videoUrl
      }
      featuredImage { node { sourceUrl altText } }
    }
  }
`;
