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

        categories {
          title
        }
      }
    }
  }
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
      filename
    }
    linkTo {
      relationTo
      value {
        __typename
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
... on ClientGrid{
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
... on ContentMediaSection{
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
