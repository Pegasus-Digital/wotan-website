export const QUERY_PRODUCT_CAROUSEL = `
...on ProductCarousel{
  blockType
  title
  description
  populateBy
  limit
  selectedDocs{
    relationTo
    value {
      ...on Product{
        id
        slug
        title
        images {
          filename
        }
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
