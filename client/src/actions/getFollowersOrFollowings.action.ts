'use server'
import { NetworkManager } from '@src/core/libs/NetworkManager'
import { cookies } from 'next/headers'

export async function getFollowersOrFollowingsAction<TResponse>(
	userCode: string,
	type: 'followers' | 'followings'
): Promise<TResponse> {
	const jwt = cookies().get('jwt')
	const res = await NetworkManager.get<TResponse>({
		endpoint: `/api/v1/user/${userCode}/${type}`,
		headers: {
			Authorization: `Bearer ${jwt?.value}`,
		},
	})

	return res.data
}
