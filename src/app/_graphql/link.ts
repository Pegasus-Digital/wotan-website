export const LINK_FIELDS = `
{
  label
  type
  newTab
  url
  reference {
    relationTo
    value {
      ...on Page {
        slug
      }
    }
  }
}
`
