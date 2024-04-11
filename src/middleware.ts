import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isAuthenticated } from './_middlewares/admin-auth'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // TODO: criar mais condiçoes para o middleware

  if (
    request.nextUrl.pathname.startsWith('/dashboard') &&
    !request.nextUrl.pathname.endsWith('/login')
  ) {
    const loggedIn = await isAuthenticated(request)
    if (!loggedIn) {
      request.cookies.delete('payload-token')

      return NextResponse.redirect(
        new URL(
          `/dashboard/login?error=${encodeURIComponent(
            'Você deve estar logado para acessar o painel de Administrador',
          )}&redirect=${encodeURIComponent(request.nextUrl.pathname)}`,
          request.url,
        ),
      )
    }
  }
}

// export const config = {
//   matcher: ['/dashboard'],
// }
