import { NextRequest, NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import { getPayloadClient } from '@/lib/get-payload';
import fs from 'fs';
import path from 'path';
import { Client, OldBudget, OldOrder } from '@/payload/payload-types';

export async function POST(request: NextRequest) {
  noStore();
  const payload = await getPayloadClient();

  async function getProductId(oldId: string) {
    try {
      const res = await payload.find({
        collection: 'products',
        where: { oldId: { equals: oldId } },
        limit: 1,
      });

      if (res.docs.length === 0) {
        // console.log(`No product found for SKU ${oldId}`);
        return '66e05037a57a9c87282e3634'
      }

      return res.docs[0] ? res.docs[0].id : '66e05037a57a9c87282e3634'; // Default product ID
    } catch (error) {
      console.error(`Error fetching product for SKU ${oldId}:`, error);
      return '66e05037a57a9c87282e3634'; // Default product ID on error
    }
  }


  try {
    // Initialize Payload client

    // Path to your JSON file
    const jsonFilePath = "C:/dev/pegasus/wotan-website/sys_geral_grouped_by_idpedido.json";

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

    console.log(`${jsonData.length} budgets to update`)

    for (const data of jsonData) {
      // Find the old budget entry using the oldId (assuming this is the linking field)
      const oldOrder = await payload.find({
        collection: 'old-order',
        where: { incrementalId: { equals: data.idpedido } }, // Adjusted based on your data model
        limit: 1
      }).then((res) => res.docs[0]);

      if (!oldOrder) {
        console.log(`Budget with oldId ${data.idpedido} not found.`);
        continue;
      }

      // Prepare the new items to be added (mapping products with the relevant quantity)
      const newItemsArray = [
        // ...oldOrder.itens,
        ...data.items.map(async (product: any) => {
          return {
            product: await getProductId(product.idproduto),
            quantity: product.quant,
            price: product.preco,
            print: product.impressao,
            sample: product.amostra,
          };
        })
      ] as OldOrder['itens']
      // Update the `old-budget` collection with the new items array

      await payload.update({
        collection: 'old-order',
        where: { incrementalId: { equals: data.idpedido } },
        data: { itens: newItemsArray }
      });

      console.log(`Budget with oldId ${data.idpedido} updated successfully`);
    }


    return NextResponse.json({ success: true, message: 'Import complete' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

