import type { Access } from 'payload/config'

import { checkRole } from '../users/checkRole'

export const adminsOrPublished: Access = ({ req: { user } }) => {
  if (checkRole(['admin'], user)) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}
