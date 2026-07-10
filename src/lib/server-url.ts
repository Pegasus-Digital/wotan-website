// Server-side only.
//
// Next.js inlines NEXT_PUBLIC_* vars at BUILD time, so with a single Docker
// image serving both production and testes, process.env.NEXT_PUBLIC_SERVER_URL
// is frozen to whatever the image was built with. This helper reads a
// non-public var at RUNTIME instead — docker-compose sets
// PAYLOAD_PUBLIC_SERVER_URL per service (prod vs testes).
export function getServerURL(): string {
  return (
    process.env.PAYLOAD_PUBLIC_SERVER_URL ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    'http://localhost:3000'
  )
}
