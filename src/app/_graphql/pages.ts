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
        ...on ProductCarousel{
          blockType
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
      }
      publishedOn
    }
  }
}`
