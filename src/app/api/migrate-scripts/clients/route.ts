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
    const jsonFilePath = "C:/dev/sys_cliente.json";

    if (!fs.existsSync(jsonFilePath)) {
      return NextResponse.json(
        { error: 'JSON file not found' },
        { status: 404 }
      );
    }

    const jsonFilePath2 = "C:/dev/pegasus/wotan-website/sys_cidade_data.json";

    if (!fs.existsSync(jsonFilePath2)) {
      return NextResponse.json(
        { error: 'JSON2 file not found' },
        { status: 404 }
      );
    }

    // Read and parse JSON file
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
    const jsonData2 = JSON.parse(fs.readFileSync(jsonFilePath2, 'utf8'));


    if (!Array.isArray(jsonData)) {
      return NextResponse.json(
        { error: 'Invalid JSON format. Expected an array.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(jsonData2)) {
      return NextResponse.json(
        { error: 'Invalid JSON2 format. Expected an array.' },
        { status: 400 }
      );
    }

    console.info(`Found ${jsonData.length} clients`)

    for (const client of jsonData) {

      const {
        idcliente,
        idcidade,
        idvendedor,
        nomeComercial,
        razaoSocial,
        cnpj, cpf,
        inscricaoEstadual,
        ramo,
        origem,
        site,
        desde,
        rua,
        bairro,
        numero,
        cep,
        fone,
        nome,
        email,
        ramal,
        nasc,
        areaContato,
        obs,
        historico2007,
        historico2008,
        historico2009,
        vendedor
      } = client

      const contactEmail = email !== "NULL" ? email : 'email-nao-encontrado@wotanbrindes.com.br'

      const origins = ["migration", "ads", "indication", "fiergs-list", "telephone-list", "direct", "prospect", "website", "other",]
      const contacts = ramal !== fone ? [{ email: contactEmail, name: nome, phone: fone }, { email: contactEmail, name: nome, phone: ramal }] : [{ email: contactEmail, name: nome, phone: fone }]
      const validDate = (new Date(desde)).toDateString()
      // Prepare data for Payload
      const data = {
        salesperson: getSalespersonId(idvendedor),
        document: cnpj ? cnpj : cpf,
        origin: origins[parseInt(origem)],
        type: cnpj ? 'company' : 'individual',
        adress: { cep: cep, city: jsonData2.find((cidade) => (cidade.id === idcidade)).cidade, number: numero, neighborhood: bairro, state: jsonData2.find((cidade) => (cidade.id === idcidade)).estado, street: rua },
        clientSince: validDate !== 'Invalid Date' ? validDate : null,
        name: nomeComercial,
        razaosocial: razaoSocial,
        observations: obs,
        ramo: ramo,
        contacts: contacts,
        stateIncription: inscricaoEstadual,
        oldId: idcliente,
      } as Client

      // Create a new entry in the `budget` collection
      await payload.create({
        collection: 'clients',
        data,
      });
      // console.log(data); // For debugging
    }

    return NextResponse.json({ success: true, message: 'Import complete' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper function to resolve salesperson name to ID
function getSalespersonId(id: string) {
  if (id === '2') {
    return '66cfc0f4b96db9f9657e531e';
  } else if (id === '1') {
    return '66cfc013b96db9f9657e5309';
  } else {
    return '677ffa5fd52100f2a9818123';
  }
}
