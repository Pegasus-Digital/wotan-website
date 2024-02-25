import type { Access } from 'payload/types'

import { checkRole } from '../users/checkRole'

const adminsOrSelf: Access = ({ req: { user } }) => {
  if (user) {
    if (checkRole(['admin'], user)) {
      return true
    }

    return {
      id: {
        equals: user.id,
      },
    }
  }

  return false
}

export { adminsOrSelf }
