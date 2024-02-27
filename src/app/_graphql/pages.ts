import {
  QUERY_FEATURED_SECTION,
  QUERY_PRODUCT_CAROUSEL,
  QUERY_STATISTICS_SECTION,
  QUERY_CONTENT_SECTION,
} from './blocks'

export const PAGES = `
  query Pages {
    Pages(limit: 300, where: { slug: { not_equals: "cart" } })  {
      docs {
        slug
      }
    }
  }
`

export const PAGE = `
query Page($slug: String){
  Pages(where: {slug: {equals:$slug}}, limit: 1){ 
    docs {
      id
      title
      slug
      carousel {
        image {
          alt
          filename
        }
      }
      layout{
       ${QUERY_PRODUCT_CAROUSEL}
       ${QUERY_STATISTICS_SECTION}
       ${QUERY_FEATURED_SECTION}
       ${QUERY_CONTENT_SECTION}
      }
      publishedOn
    }
  }
}`
