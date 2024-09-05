import path from 'path'

import { seed } from './endpoints/seed'
import { buildConfig } from 'payload/config'

import seo from '@payloadcms/plugin-seo'
import nestedDocs from '@payloadcms/plugin-nested-docs'
import { slateEditor } from '@payloadcms/richtext-slate'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import type { GenerateTitle } from '@payloadcms/plugin-seo/types'

import { Media } from './media'
import { Users } from './users'
import { Order } from './order'
import { Budget } from './budget'
import { Clients } from './clients'
import { Contact } from './contact'
import { Products } from './products'
import { Settings } from './settings'
import { Pages } from './settings/pages'
import { Salespersons } from './salespersons'
import { Categories } from './products/categories'
import { Attributes, AttributeTypes } from './products/atributes'
import Layout from './layout'

const generateTitle: GenerateTitle = () => {
  return 'Wotan Brindes'
}

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
    Layout,
    Users,
    Media,
    Pages,
    Clients,
    Salespersons,
    Contact,
  ],
  globals: [Settings],
  // database-adapter-config-start
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
