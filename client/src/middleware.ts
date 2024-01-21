import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
	if (
		request.nextUrl.pathname.includes('account') &&
		request.cookies.has('jwt') === false
	) {
		return NextResponse.redirect(new URL('/auth/signin', request.url))
	}

	if (
		request.nextUrl.pathname.includes('auth/sign') &&
		request.cookies.has('jwt') === true
	) {
		return NextResponse.redirect(new URL('/', request.url))
	}
}

export const config = {
	// matcher: ['/auth/:path*', '/account/:path*'],
	matcher: ['/:path*', '/account/:path*', '/api/client'],
}
