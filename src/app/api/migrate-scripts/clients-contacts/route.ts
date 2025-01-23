import { NextRequest, NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import { getPayloadClient } from '@/lib/get-payload';
import fs from 'fs';
import path from 'path';
import { Client } from '@/payload/payload-types';

export async function POST(request: NextRequest) {
  noStore();

  try {
    // Initialize Payload client
    const payload = await getPayloadClient();

    // Path to your JSON file
    const jsonFilePath = "C:/dev/sys_contatocliente_grouped.json";

    if (!fs.existsSync(jsonFilePath)) {
      return NextResponse.json(
        { error: 'JSON file not found' },
        { status: 404 }
      );
    }

    // Read and parse JSON file
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));


    if (!Array.isArray(jsonData)) {
      return NextResponse.json(
        { error: 'Invalid JSON format. Expected an array.' },
        { status: 400 }
      );
    }

    console.log(`${jsonData.length} clients to update`)

    for (const data of jsonData) {


      const client = await payload.find({
        collection: 'clients',
        where: { oldId: { equals: data.idcliente } },
        limit: 1
      }).then((res) => res.docs[0])

      // console.log(client)

      const newContactArray = [...client.contacts, ...data.contacts.map((contact) => { return { name: contact.nome, email: contact.email, phone: contact.ramal } })] as Client['contacts']
      // console.log(newContactArray)

      // Create a new entry in the `budget` collection
      await payload.update({
        collection: 'clients',
        where: { oldId: { equals: data.idcliente } },
        data: { contacts: newContactArray }
      })
      // console.log(data); // For debugging
    }

    return NextResponse.json({ success: true, message: 'Import complete' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

