import { NextRequest, NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import { getPayloadClient } from '@/lib/get-payload';
import fs from 'fs';
import path from 'path';
import { OldBudget } from '@/payload/payload-types';

export async function POST(request: NextRequest) {
  noStore();

  try {
    // Initialize Payload client
    const payload = await getPayloadClient();

    // Path to your JSON file
    const jsonFilePath = "C:/dev/pegasus/wotan-website/sys-orcamento_final_cleaned.json";
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

    console.log(`Found ${jsonData.length} budgets to import`);

    let counter = 0; // Initialize counter

    for (const oldBudget of jsonData) {
      const {
        idorcamento,
        empresa,
        contato,
        fone,
        email,
        vendedor,
        comissao,
        condicao,
        observacao,
        quandoFoi,
      } = oldBudget;

      const date = quandoFoi === '0000-00-00 00:00:00' ? '2009-01-01' : quandoFoi;
      const cleanedcontato = contato === '' ? 'Nenhum' : contato
      const cleanedEmpresa = empresa === '' ? contato : empresa

      // Prepare data for Payload
      const data = {
        incrementalId: parseInt(idorcamento, 10),
        empresa: cleanedEmpresa,
        fone,
        contato: cleanedcontato,
        email,
        salesperson: await getSalespersonId(vendedor),
        comissioned: comissao === 'S',
        conditions: condicao?.replace(/\\r\\n/g, '\n').trim() || '',
        observacao,
        createdAt: new Date(date).toDateString(),
      };

      // Create a new entry in the `budget` collection
      await payload.create({
        collection: 'old-budget',
        data,
      });

      counter++; // Increment counter

      // Log progress every 1000 records
      if (counter % 1000 === 0) {
        console.log(`${counter} budgets processed...`);
      }
    }

    console.log(`All ${counter} budgets processed successfully.`);
    return NextResponse.json({ success: true, message: 'Import complete' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper function to resolve salesperson name to ID
function getSalespersonId(name: string) {
  if (name.toLowerCase() === 'daniel') {
    return '66cfc0f4b96db9f9657e531e';
  } else if (name.toLowerCase() === 'rita') {
    return '66cfc013b96db9f9657e5309';
  } else {
    return null;
  }
}
