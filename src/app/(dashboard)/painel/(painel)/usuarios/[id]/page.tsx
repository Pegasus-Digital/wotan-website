import { getUserById } from '../_logic/queries'
import { UserContent } from './content'

export default async function UserPage({
  params: { id },
  searchParams: { edit },
}) {
  const { data } = await getUserById(id)

  if (!data) {
    return <p>Usuário não encontrado</p>
  }
  return <UserContent user={data} edit={edit} />
}
