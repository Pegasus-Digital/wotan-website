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
        collection: 'budget',
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
