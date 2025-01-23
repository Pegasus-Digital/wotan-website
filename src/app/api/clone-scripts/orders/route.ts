import { NextRequest, NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import { getPayloadClient } from '@/lib/get-payload';
import { OldOrder, Order, Salesperson } from '@/payload/payload-types';
import fs from 'fs';

type SafeOrder = Omit<Order, 'id' | 'updatedAt'>;

export async function POST(request: NextRequest) {
  noStore();
  const payload = await getPayloadClient();

  // Function to get product ID based on old product code
  async function getProductId(oldId: string) {
    try {
      const res = await payload.find({
        collection: 'products',
        where: { oldId: { equals: oldId } },
        limit: 1,
      });

      if (res.docs.length === 0) {
        return '66e05037a57a9c87282e3634'; // Default product ID
      }

      return res.docs[0] ? res.docs[0].id : '66e05037a57a9c87282e3634'; // Default product ID
    } catch (error) {
      console.error(`Error fetching product for SKU ${oldId}:`, error);
      return '66e05037a57a9c87282e3634'; // Default product ID on error
    }
  }

  async function getClientId(oldId: string) {
    try {
      const res = await payload.find({
        collection: 'clients',
        where: { oldId: { equals: oldId } },
        limit: 1,
      });

      if (res.docs.length === 0) {
        return '6788664952eac92ebc6bf1ec'; // Default client ID
      }

      return res.docs[0] ? res.docs[0].id : '6788664952eac92ebc6bf1ec'; // Default client ID
    } catch (error) {
      return '6788664952eac92ebc6bf1ec'; // Default client ID on error
    }
  }

  async function getContactId(oldId: string, contactID: string) {
    const jsonFilePath = "C:/dev/sys_contatocliente_grouped.json";

    if (!fs.existsSync(jsonFilePath)) {
      return NextResponse.json({ error: 'JSON file not found' }, { status: 404 });
    }

    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

    if (!Array.isArray(jsonData)) {
      return NextResponse.json({ error: 'Invalid JSON format. Expected an array.' }, { status: 400 });
    }

    const foundIt = jsonData.find((cliente) => cliente.idcliente === oldId);


    // Return 'nenhum' if no contact is found
    const contact = foundIt?.contacts.find((contact) => contact.idcontato === contactID);
    return contact ? contact.idcontato : 'Nenhum';
  }
  // Process each item within an order
  async function processItem(item: any, oldBudgetItems: any[]) {
    const productId = await getProductId(item.productCode);

    if (!productId) {
      console.log(`Product with SKU ${item.productCode} not found.`);
      return;
    }

    const itemData = {
      product: productId,
      quantity: item.quantity ? item.quantity : 0,
      price: item.price ? item.price : 0,
      print: item.print,
      sample: item.sample
    };

    oldBudgetItems.push(itemData);
  }

  // Process all items in a single order
  async function processOldOrder(oldOrder: any) {
    const oldBudgetItems: any[] = [];
    await Promise.all(oldOrder.itens.map((item) => processItem(item, oldBudgetItems)));
    return oldBudgetItems;
  }

  // Process orders in pages
  try {
    let page = 1;
    const limit = 1;
    let counter = 0;

    while (true) {
      const result = await payload.find({
        collection: 'old-order',
        where: {
          createdAt: {
            greater_than: '2021-01-01',
          },
        },
        limit,
        page,
        pagination: true,
      });

      if (result.docs.length === 0) {
        console.log('No more orders found.');
        break;
      }

      const oldOrder = result.docs[0] as OldOrder;
      console.log(`Processing order with id ${oldOrder.incrementalId}`);

      const oldBudgetItems: Order['itens'] = await processOldOrder(oldOrder);

      // Fix for salesperson ID assignment
      const salespersonId = oldOrder.salesperson ? (oldOrder.salesperson as Salesperson).id : '677ffa5fd52100f2a9818123';
      const clientId = await getClientId(oldOrder.idcliente.toString());
      const contactId = await getContactId(oldOrder.idcliente.toString(), oldOrder.idcontato.toString());

      const newOrderData: SafeOrder = {
        incrementalId: oldOrder.incrementalId,
        salesperson: salespersonId,
        client: clientId,
        contact: contactId,
        // Assign the items
        itens: oldBudgetItems,
        createdAt: oldOrder.createdAt,
      };

      console.log(`Order #${oldOrder.incrementalId} items:`, newOrderData.itens);

      if (newOrderData.itens.length < 1) {
        console.log(`No valid items found for order ${oldOrder.incrementalId}`);
      } else {
        await payload.create({ collection: 'order', data: newOrderData });
      }

      counter++;
      if (counter % 100 === 0) {
        console.log(`Processed ${counter} orders so far.`);
      }

      page++;
    }

    console.log(`All ${counter} orders processed successfully.`);
    return NextResponse.json({ success: true, message: 'Import complete' });
  } catch (error) {
    console.error('Error during processing:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
