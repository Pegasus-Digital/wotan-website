export const SETTINGS = `
  Setting {
    header {
      navigation {
        logo {
          mimeType
          filename
          width
          height
          alt
        }
        style
        links {
          title
          onlyLink
          href
          columns {
            type
            content{
              title
              description
            }
            linkColumn{
              title
              href
              description
            }
          }
        }
      }
    }
    footer{
      logo {
        mimeType
        filename
        width
        height
        alt
      }
      companyInfo{
        showAddress
        showPhone
        showEmail
        showSocial
      }
      columns{
        title
        href
        links{
          title
          href
        }
      }
    }
  }
`

export const SETTINGS_QUERY = `
query Settings {
  ${SETTINGS}
}
`

export const COMPANY_QUERY = `
query Company{
  Company {
    adress{

        street
        number
        neighborhood
        city
        state
        cep
      
    }
    contact{
      email
      phone
      whatsapp
    }
  }
}
`
