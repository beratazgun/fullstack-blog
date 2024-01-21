'use server'
import { IBaseResponse } from '@src/core/interface/IBaseResponse'
import { IReadingList } from '@src/core/interface/IReadingList'
import { NetworkManager } from '@src/core/libs/NetworkManager'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

interface IReadingListsResponse extends IBaseResponse {
	payload: IReadingList[]
}

export async function getReadingListsAction(): Promise<IReadingListsResponse> {
	const jwt = cookies().get('jwt')

	if (!jwt?.value) {
		redirect('/auth/signin')
	}

	const res = await NetworkManager.get<IReadingListsResponse>({
		endpoint: '/api/v1/reading-lists/get/lists',
		headers: {
			Authorization: `Bearer ${jwt?.value}`,
		},
	})

	return res.data
}
