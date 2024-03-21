import { LINK_FIELDS } from './link'

export const QUERY_PRODUCT_CAROUSEL = `
...on ProductCarousel{
  blockType
  title
  description
  populateBy
  selectedDocs{
    relationTo
    value {
      ...on Product{
        id
        slug
        title
        minimumQuantity
        featuredImage {
          mimeType
          filename
          width
          height
          alt
        }
        categories {
          title
        }
      }
    }
  }
  seeMore
  seeMoreLink ${LINK_FIELDS}
}
`
export const QUERY_STATISTICS_SECTION = `
... on StatisticSection {
  blockType
  title
  description
  statistics{
    title
    value
  }
}
`

export const QUERY_FEATURED_SECTION = `
... on FeaturedSection {
  blockType
  title
  description
  cards {
    title
    description
    image {
      mimeType
      filename
      width
      height
      alt
    }
    linkTo {
      relationTo
      value {
        ...on Product {
          slug
        }
        ...on Category {
          slug
        }
      }
    }
  }
}
`
export const QUERY_CONTENT_SECTION = `
... on ContentSection {
  invertBackground
  title
  description
  columns {
    text
    size
  }
  blockName
  blockType
}
`
export const QUERY_CLIENT_GRID = `
... on ClientGrid {
  title
  description
  clients{
    logo{
      mimeType
      filename
      width
      height
      alt
    }
  }
  id
  blockName
  blockType
}
`

export const QUERY_CONTENT_MEDIA = `
... on ContentMedia {
  title
  description
  invertBackground
  mediaPosition
  richText
  media{
    mimeType
    filename
    width
    height
    alt
  }
  blockName 
  blockType
}
`

export const QUERY_FAQ = `
... on FAQ {
  title
  description
  invertBackground
  questions {
    question
    answer
  }
  blockName 
  blockType
}
`
export const QUERY_THREE_COLUMNS = `
... on ThreeColumns {
  title
  description
  invertBackground
  mission {
    title
    description
  }
  vision {
    title
    description
  }
  values {
    title
    description
  }
  blockName
  blockType
}
`
