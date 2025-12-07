import path from 'path'
import dotenv from 'dotenv'

import payload from 'payload'
import type { Payload } from 'payload'
import type { InitOptions } from 'payload/config'

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
})

let cached = (global as any).payload

if (!cached) {
  cached = (global as any).payload = { client: null, promise: null }
}

interface Args {
  initOptions?: Partial<InitOptions>
}

export const getPayloadClient = async ({
  initOptions,
}: Args = {}): Promise<Payload> => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('PAYLOAD_SECRET environment variable is missing')
  }

  if (cached.client) {
    return cached.client
  }

  try {
    if (!cached.promise) {
      cached.promise = payload.init({
        secret: process.env.PAYLOAD_SECRET,
        local: initOptions?.express ? false : true,
        ...(initOptions || {}),
      })
    }

    cached.client = await cached.promise

    // Validate that client was successfully initialized
    if (!cached.client) {
      cached.promise = null
      throw new Error('Payload client initialization completed but client is null')
    }
  } catch (error) {
    // Reset promise on failure to allow retry
    cached.promise = null
    
    if (error instanceof Error) {
      throw new Error(`Failed to initialize Payload client: ${error.message}`, { cause: error })
    }
    
    throw new Error('Failed to initialize Payload client: Unknown error occurred', { cause: error })
  }

  return cached.client
}
