import payload from 'payload'
import { BeforeChangeHook } from 'payload/dist/collections/config/types'

// Utility function to generate the next incremental ID across collections
export async function generateIncrementalId(req: any): Promise<number> {
  try {
    // Fetch the latest incrementalID from both collections
    const [maxID1, maxID2] = await Promise.all([
      req.payload.find({
        collection: 'budget',
        limit: 1,
        sort: '-incrementalId',
      }),
      req.payload.find({
        collection: 'order',
        limit: 1,
        sort: '-incrementalId',
      }),
    ])

    // Determine the highest ID across both collections
    const maxID = Math.max(
      maxID1.docs[0]?.incrementalId || 0,
      maxID2.docs[0]?.incrementalId || 0,
    )

    // Return the next incremental ID
    return maxID + 1
  } catch (error) {
    console.error('Error generating incremental Id:', error)
    throw new Error('Failed to generate incremental Id')
  }
}

export const assignIncrementalId: BeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation === 'create') {
    // console.log('Running beforeChange hook')
    try {
      // Generate the next incremental ID
      const newID = await generateIncrementalId(req)
      data.incrementalId = newID // Assign the new ID
      // console.log(`Assigned incremental ID ${newID}`)
    } catch (error) {
      // console.error('Error in beforeChange hook:', error)
    }
  }

  return data
}

export const createLayouts: BeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation === 'create' || operation === 'update') {
    try {
      // Prepare to store all promises of Layout creation
      const layoutPromises = data.itens.map(async (item) => {
        // Check if item.layout is not assigned
        if (!item.layout) {
          // Create a new Layout document with ncm = ''
          const layoutResponse = await req.payload.create({
            collection: 'layouts',
            data: {
              ncm: '',
              printing: {
                quantity: 0,
                price: 0,
              },
              printing2: {
                quantity: 0,
                price: 0,
              },
              supplyer: [
                {
                  quantidade_material: 0,
                  custo_material: 0,
                },
              ],
              additionalCosts: {
                cost: 0,
              },
              additionalCosts2: {
                cost: 0,
              },
              delivery: {
                cost: 0,
              },
              delivery2: {
                cost: 0,
              },
              commisions: {
                agency: {
                  value: 0,
                },
                salesperson: {
                  value: 0,
                },
              },
              invoice: {
                value: 0,
              },
              invoice2: {
                value: 0,
              },
              invoice3: {
                value: 0,
              },
            },
          })

          // Assign the newly created Layout ID to item.layout
          item.layout = layoutResponse.id
        }
        return item
      })

      // Wait for all Layout creations to complete
      await Promise.all(layoutPromises)
    } catch (error) {
      // Handle errors here
      // console.error('Error in beforeChange hook:', error)
    }
  }

  return data
}
