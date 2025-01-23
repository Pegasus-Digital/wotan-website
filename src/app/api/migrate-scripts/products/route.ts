// pages/api/importProducts.ts

import { NextRequest, NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import { getPayloadClient } from '@/lib/get-payload'; // Assuming you have this helper to initialize Payload
import fs from 'fs';

export async function POST(request: NextRequest) {
  noStore();

  try {
    // Initialize Payload client
    const payload = await getPayloadClient();

    // Path to your JSON file (replace with your actual path)
    const jsonFilePath = "C:/dev/pegasus/wotan-website/sys_produtos_parsed.json";

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

    console.log(`${jsonData.length} products to create`);

    for (const data of jsonData) {
      // Ensure quant_minima is a valid number, default to 0 if not
      const quantMin = isNaN(Number(data.quant_minima)) ? 0 : Number(data.quant_minima);

      // Ensure title is provided, default to 'Sem Nome' if empty or missing
      const title = data.desc_simples && data.desc_simples.trim() !== '' ? data.desc_simples : 'Sem Nome';

      const newProductData = {
        sku: data.codigo,
        active: false,
        featuredImage: '66e05032a57a9c87282e362d', // Example featured image ID
        minimumQuantity: quantMin, // Ensure quantMin is a valid number
        title: title, // Ensure the title is never empty
        description: data.desc_completa,
        oldId: data.idprodutos,
      };

      // Prepare the product data to be created
      const newProduct = await payload.create({
        collection: 'products', // Ensure the correct collection name
        data: newProductData,
      });

      console.log(`Product created with ID: ${newProduct.id}`);
    }

    return NextResponse.json({ success: true, message: 'Import complete' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
