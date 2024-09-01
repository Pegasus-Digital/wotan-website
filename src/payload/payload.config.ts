import { buildConfig } from 'payload/config'
import { mongooseAdapter } from '@payloadcms/db-mongodb' // database-adapter-import
import { slateEditor } from '@payloadcms/richtext-slate'
import nestedDocs from '@payloadcms/plugin-nested-docs'
// import search from '@payloadcms/plugin-search'

import type { GenerateTitle } from '@payloadcms/plugin-seo/types'
import seo from '@payloadcms/plugin-seo'

import { webpackBundler } from '@payloadcms/bundler-webpack'
import { Settings } from './settings'
import Users from './users'
import path from 'path'
import { Media } from './media'
import { Pages } from './settings/pages'
import Products from './products'
import Categories from './products/categories'
import { Budget } from './budget'
import { Attributes, AttributeTypes } from './products/atributes'
import Clients from './clients'
import Salespersons from './salespersons'
import { seed } from './endpoints/seed'

const generateTitle: GenerateTitle = () => {
  return 'Wotan Brindes'
}
import { Contact } from './contact'
import Order from './order'

export default buildConfig({
  admin: {
    user: Users.slug,
    autoLogin:
      process.env.PAYLOAD_PUBLIC_ENABLE_AUTOLOGIN === 'true'
        ? {
            email: 'admin@pegasusds.com.br',
            password: 'wotan',
            prefillOnly: true,
          }
        : false,
    bundler: webpackBundler(), // or viteBundler()
  },
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  collections: [
    Products,
    Categories,
    Attributes,
    AttributeTypes,
    Budget,
    Order,
    Users,
    Media,
    Pages,
    Clients,
    Salespersons,
    Contact,
  ],
  globals: [Settings],
  // database-adapter-config-start
  // Todo: env variable validation
  db: mongooseAdapter({
    url: String(process.env.DATABASE_URI),
  }),
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  editor: slateEditor({}),
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  endpoints: [
    // The seed endpoint is used to populate the database with some example data
    // You should delete this endpoint before deploying your site to production
    {
      path: '/seed',
      method: 'get',
      handler: seed,
    },
  ],
  plugins: [
    nestedDocs({
      collections: ['categories'],
      generateLabel: (_, doc) => doc.title as string,
      generateURL: (docs) =>
        docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
    }),
    seo({
      collections: ['pages', 'products'],
      generateTitle,
      uploadsCollection: 'media',
    }),
    // search({
    //   collections: ['products'],
    //   searchOverrides: {
    //     fields: [
    //       {
    //         name: 'slug',
    //         type: 'text',
    //       },
    //     ],
    //   },
    // }),
  ],
})
