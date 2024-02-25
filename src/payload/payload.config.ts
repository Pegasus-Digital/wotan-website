import { buildConfig } from 'payload/config'
import { mongooseAdapter } from '@payloadcms/db-mongodb' // database-adapter-import
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { webpackBundler } from '@payloadcms/bundler-webpack'
import { Settings } from './settings'
import Users from './users'
import path from 'path'

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
  collections: [Users],
  globals: [Settings],
  // database-adapter-config-start
  // Todo: env variable validation
  db: mongooseAdapter({
    url: String(process.env.DATABASE_URI),
  }),
  editor: lexicalEditor(),
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
})
