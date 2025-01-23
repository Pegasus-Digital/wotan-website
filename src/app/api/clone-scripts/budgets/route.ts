import { NextRequest, NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import { getPayloadClient } from '@/lib/get-payload';
import { Budget, OldBudget, Salesperson } from '@/payload/payload-types';

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
        // console.log(`No product found for SKU ${oldId}`);
        return '66e05037a57a9c87282e3634'
      }

      return res.docs[0] ? res.docs[0].id : '66e05037a57a9c87282e3634'; // Default product ID
    } catch (error) {
      console.error(`Error fetching product for SKU ${oldId}:`, error);
      return '66e05037a57a9c87282e3634'; // Default product ID on error
    }
  }

  // Process each item within an order
  async function processItem(item: any, oldBudgetItems: any[]) {
    const productId = await getProductId(item.productCode);

    if (!productId) {
      console.log(`Product with SKU ${item.productCode} not found.`);
      return;
    }

    // Collect valid items based on quantity and price
    const itemsToPush = [];

    for (let i = 1; i <= 7; i++) {
      const quantity = item[`qtde${i}`];
      const price = item[`preco${i}`];

      if (quantity > 0 && price !== undefined) {
        itemsToPush.push({
          product: productId,
          description: item.details !== undefined ? item.details : '',
          quantity,
          price,
        });
      }
    }

    // Push valid items to the main collection
    if (itemsToPush.length > 0) {
      oldBudgetItems.push(...itemsToPush);
    } else {
      console.log(`No valid items found for SKU ${item.productCode}`);
    }
  }

  // Process all items in a single order
  async function processOldOrder(oldOrder: any) {
    const oldBudgetItems: any[] = [];

    // Process items asynchronously
    await Promise.all(oldOrder.items.map((item) => processItem(item, oldBudgetItems)));

    return oldBudgetItems;
  }

  try {
    let page = 1;
    const limit = 1;  // Fetch one order at a time
    let counter = 0;

    // Continue fetching and processing orders until no more results are found
    while (true) {
      const result = await payload.find({
        collection: 'old-budget',
        where: {
          createdAt: {
            greater_than: '2021-01-01',
          },
        },
        limit,
        page,
        pagination: true,
      });

      // Break the loop if no more orders are found
      if (result.docs.length === 0) {
        console.log('No more orders found.');
        break;
      }

      const oldOrder = result.docs[0] as OldBudget;
      console.log(`Processing order with id ${oldOrder.incrementalId}`)


      // Process the current order
      const oldBudgetItems: Budget['items'] = await processOldOrder(oldOrder);

      // Fix for salesperson ID assignment
      const salespersonId = oldOrder.salesperson ? (oldOrder.salesperson as Salesperson).id : '677ffa5fd52100f2a9818123';

      const newOrderData = {
        incrementalId: oldOrder.incrementalId,
        salesperson: salespersonId,
        comissioned: oldOrder.comissioned,
        conditions: oldOrder.conditions,
        contact: {
          companyName: oldOrder.empresa,
          customerName: oldOrder.contato,
          email: oldOrder.email,
          phone: oldOrder.fone,
        },
        items: oldBudgetItems,
        createdAt: oldOrder.createdAt,
      };


      console.log(`Order #${oldOrder.incrementalId} items:`, newOrderData.items)

      // Log and review if no items exist in the order
      if (newOrderData.items.length < 1) {
        console.log(`No valid items found for order ${oldOrder.incrementalId}`);
      } else {

        await payload.create({ collection: 'budget', data: newOrderData });
      }





      counter++;
      if (counter % 100 === 0) {
        console.log(`Processed ${counter} orders so far.`);
      }

      page++;  // Move to the next page in the next loop iteration
    }

    console.log(`All ${counter} budgets processed successfully.`);
    return NextResponse.json({ success: true, message: 'Import complete' });
  } catch (error) {
    console.error('Error during processing:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
