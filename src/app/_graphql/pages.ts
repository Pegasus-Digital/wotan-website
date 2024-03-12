import {
  QUERY_FEATURED_SECTION,
  QUERY_PRODUCT_CAROUSEL,
  QUERY_STATISTICS_SECTION,
  QUERY_CONTENT_SECTION,
  QUERY_CLIENT_GRID,
  QUERY_CONTENT_MEDIA,
} from './blocks'
import { MEDIA } from './media'

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
      description

      layout{
       ${QUERY_PRODUCT_CAROUSEL}
       ${QUERY_STATISTICS_SECTION}
       ${QUERY_FEATURED_SECTION}
       ${QUERY_CONTENT_SECTION}
       ${QUERY_CLIENT_GRID}
       ${QUERY_CONTENT_MEDIA}
      }
      publishedOn
    }
  }
}`
