import fetch from 'node-fetch'

async function isAuthenticated(req) {
  const token = req.cookies['payload-token']

  if (!token) {
    return false
  }

  try {
    const meUserReq = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      },
    )

    if (meUserReq.ok) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error('Error checking authentication:', error)
    return false
  }
}

export default isAuthenticated
