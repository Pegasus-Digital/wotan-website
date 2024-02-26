import { buildConfig } from 'payload/config'
import { mongooseAdapter } from '@payloadcms/db-mongodb' // database-adapter-import
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { webpackBundler } from '@payloadcms/bundler-webpack'
import { Settings } from './settings'
import Users from './users'
import path from 'path'
import { Media } from './media'
import { Company } from './settings/company'
import { Pages } from './settings/pages'
import Products from './products'
import Categories from './products/categories'

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
  collections: [Users, Media, Pages, Products, Categories],
  globals: [Settings, Company],
  // database-adapter-config-start
  // Todo: env variable validation
  db: mongooseAdapter({
    url: String(process.env.DATABASE_URI),
  }),
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  editor: lexicalEditor(),
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
})
