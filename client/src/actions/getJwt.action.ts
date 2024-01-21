'use server'
import { cookies } from 'next/headers'

export async function getJwtAction() {
	const jwt = cookies().get('jwt')

	return jwt?.value
}
