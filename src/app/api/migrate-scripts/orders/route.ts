import { NextRequest, NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import { getPayloadClient } from '@/lib/get-payload';
import fs from 'fs';
import path from 'path';
import { OldOrder } from '@/payload/payload-types';

export async function POST(request: NextRequest) {
  noStore();

  try {
    // Initialize Payload client
    const payload = await getPayloadClient();

    // Path to your JSON file
    const jsonFilePath = "C:/dev/pegasus/wotan-website/sys-pedido.json";
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

    console.log(`Found ${jsonData.length} orders to import`);

    let counter = 0; // Initialize counter

    for (const oldOrder of jsonData) {
      const {
        idpedido,
        idcliente,
        idcontato,
        idvendedor,
        vendedor,
        contato,
        foneContato,
        emailContato,
        frete,
        transp,
        prazo,
        cond,
        tipopagamento,
        comissao,
        porcentagem,
        obs,
        idcidade,
        rua,
        numero,
        bairro,
        cep,
        quando,
        ordem,
        serasa,
        pos,
        itens = [],
      } = oldOrder;

      const clientId = await payload
        .find({ collection: 'clients', where: { oldId: { equals: idcliente } }, limit: 1 })
        .then((res) => res.docs[0]?.id || null);

      const salespersonId = getSalespersonId(idvendedor);
      const date = quando === '0000-00-00 00:00:00' ? '2009-01-01' : quando;
      const cleanedContato = contato || 'Nenhum';
      const parsedFrete = parseFloat(frete) || 0;
      const parsedPorcentagem = parseFloat(porcentagem) || 0;

      const data = {
        incrementalId: parseInt(idpedido, 10),
        idcliente,
        client: clientId,
        idcontato: parseInt(idcontato, 10),
        salesperson: salespersonId,
        contato: cleanedContato,
        foneContato: foneContato === 'NULL' ? '' : foneContato,
        emailContato: emailContato === 'NULL' ? '' : emailContato,
        frete: parsedFrete,
        transp,
        prazo,
        cond,
        tipopagamento: parseInt(tipopagamento, 10),
        comissao,
        porcentagem: parsedPorcentagem,
        obs,
        rua,
        numero,
        bairro,
        cep,
        ordem,
        serasa,
        // itens: itens.map((item) => ({
        //   product: item.product,
        //   layout: item.layout,
        //   quantity: parseInt(item.quantity, 10) || 0,
        //   price: parseFloat(item.price) || 0,
        //   attributes: item.attributes || [],
        //   print: item.print,
        //   sample: !!item.sample,
        //   layoutSent: !!item.layoutSent,
        //   layoutApproved: !!item.layoutApproved,
        // })),
        createdAt: new Date(date).toISOString(),
        paymentConditions: cond,
        // paymentType: getPaymentType(tipopagamento),
        agency: '',
        notes: obs,
        status: 'pending',
      } as OldOrder

      // Create a new entry in the `old-order` collection
      await payload.create({
        collection: 'old-order',
        data,
      });

      counter++; // Increment counter

      // Log progress every 1000 records
      if (counter % 1000 === 0) {
        console.log(`${counter} orders processed...`);
      }
    }

    console.log(`All ${counter} orders processed successfully.`);
    return NextResponse.json({ success: true, message: 'Import complete' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper function to resolve salesperson ID
function getSalespersonId(id) {
  if (id === '2') {
    return '66cfc0f4b96db9f9657e531e';
  } else if (id === '1') {
    return '66cfc013b96db9f9657e5309';
  } else {
    return null;
  }
}

