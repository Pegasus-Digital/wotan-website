'use client'

export async function getClients() {
  try {
    const response = await fetch('/api/clients', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch clients')
    }

    const data = await response.json()

    return {
      data: data.docs || [], // Ensure it handles an empty or malformed response
    }
  } catch (err) {
    console.error('Error fetching clients:', err)
    return { data: [] }
  }
}
