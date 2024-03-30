import { NextRequest, NextResponse } from 'next/server'
import payload from 'payload'

// TODO: importação de produtos, recebe um csv, trata e cria um produdo para cada linha do arquivo

export async function POST(request: NextRequest, response: NextResponse) {
  // const base64Data = request.body.data;
  // try {
  //   const response = await payload.create({
  //     collection: 'products',
  //     data: {
  //     },
  //   })
  //   return Response.json(response)
  // } catch (error) {
  //   console.error(error)
  // }
}
