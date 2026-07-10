import fetch from 'node-fetch'

async function isSalesAuthenticated(req) {
  const token = req.cookies['payload-token']

  if (!token) {
    return false
  }

  try {
    const meUserReq = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/salespersons/me`,
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      },
    )

    if (meUserReq.ok) {
      return true
    } else if (meUserReq.status === 404) {
      // Handle the case where the user was not found
      // console.warn('User not found for provided token.')
      return false
    } else {
      // Handle other potential non-200 responses
      // console.warn('Failed to authenticate user:', meUserReq.statusText)
      return false
    }
  } catch (error) {
    // Handle any network or unexpected errors
    // console.error('Error checking authentication:', error)
    return false
  }
}

export default isSalesAuthenticated
