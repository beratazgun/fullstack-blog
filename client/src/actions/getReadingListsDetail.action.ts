'use server'
import { IBaseResponse } from '@src/core/interface/IBaseResponse'
import { IReadingList } from '@src/core/interface/IReadingList'
import { NetworkManager } from '@src/core/libs/NetworkManager'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export interface IReadingListsDetailResponsePayload extends IReadingList {
	isDeletable: boolean
	blogsLength: number
	blogsThumbnails: string[]
}

interface IReadingListsDetailResponse extends IBaseResponse {
	payload: IReadingListsDetailResponsePayload[]
}
export async function getReadingListsDetailAction(): Promise<IReadingListsDetailResponse> {
	const jwt = cookies().get('jwt')

	if (!jwt?.value) {
		redirect('/auth/signin')
	}

	const res = await NetworkManager.get<IReadingListsDetailResponse>({
		endpoint: '/api/v1/reading-lists/get/lists/detail',
		headers: {
			Authorization: `Bearer ${jwt?.value}`,
		},
	})

	return res.data
}
