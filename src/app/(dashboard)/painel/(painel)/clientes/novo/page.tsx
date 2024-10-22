import { Heading } from '@/pegasus/heading'
import { NewClientContent } from './content'
import { getSalespeople } from '../../orcamentos/_logic/queries'

export default async function NewClient() {
  const { data: salespeopleData } = await getSalespeople()

  return <NewClientContent salespeople={salespeopleData} />
}
