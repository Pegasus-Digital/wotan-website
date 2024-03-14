import { LINK_FIELDS } from './link'
import { MEDIA, MEDIA_FIELDS } from './media'

export const HEADER_QUERY = `
header {
  logo {
    ${MEDIA_FIELDS}
  }
  navigation {
    style
    links {
      linkTo ${LINK_FIELDS}
      onlyLink
      columns {
        type
        content {
          title
          description
        }
        linkColumn {
          link ${LINK_FIELDS}
          description
        }
      }
      subLinks {
        link ${LINK_FIELDS}
      }
    }
  }
}
`
export const FOOTER_QUERY = `
footer {
  logo {
    ${MEDIA_FIELDS}
  }
  companyInfo {
    showAddress
    showPhone
    showEmail
    showSocial
  }
  columns {
    title ${LINK_FIELDS}
    links {
      link ${LINK_FIELDS}
    }
  }
}
`
export const COMPANY_QUERY = `
company {
  name
  founded
  cnpj
  adress {
    street
    number
    neighborhood
    city
    state
    cep
  }
  googleMaps
  contact {
    email
    phone
    whatsapp
  }
  social {
    facebook
    instagram
    linkedin
  }
}
`

export const SETTINGS = `
  Setting {
    ${HEADER_QUERY}
    ${FOOTER_QUERY}
    ${COMPANY_QUERY}
  }
`

export const SETTINGS_QUERY = `
query Settings {
  ${SETTINGS}
}
`
