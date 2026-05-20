import { NextResponse } from 'next/server'

import { getPrintingTypes } from '@/lib/queries/printing-types'

export async function GET() {
  const printingTypes = await getPrintingTypes()
  return NextResponse.json(printingTypes)
}
