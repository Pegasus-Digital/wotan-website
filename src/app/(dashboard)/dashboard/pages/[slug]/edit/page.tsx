import payload from 'payload'
import { EditPageContent } from './content'

export default async function EditPage({ params: { slug } }) {
  // console.log({ slug })
  const page = await payload
    .find({
      collection: 'pages',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
      pagination: false,
    })
    .then((result) => {
      return result.docs.length >= 1 ? result.docs[0] : null
    })

  return <EditPageContent {...page} />
}
