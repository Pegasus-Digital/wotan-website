import { Access } from 'payload/types'

export const isInternal: Access = ({ req: { user } }) => {
  if (!user) return false
  return user.roles?.equals('internal')
}

export const isRepresentative: Access = ({ req: { user } }) => {
  if (!user) return false
  return user.roles?.equals('representative')
}

export const isAdmin: Access = ({ req: { user } }) => {
  if (!user) return false
  return user.roles?.includes('admin')
}

export const isUser: Access = ({ req: { user } }) => {
  if (!user) return false
  return user.roles?.includes('user')
}

export const isSelf: Access = ({ req: { user } }) => {
  if (user) {
    return {
      id: {
        equals: user.id,
      },
    }
  }

  return false
}

export const isLoggedIn: Access = ({ req: { user } }) => {
  console.log(user)
  return !!user
}
