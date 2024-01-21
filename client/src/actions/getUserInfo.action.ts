'use server'
import { IBaseResponse } from '@src/core/interface/IBaseResponse'
import { IUser } from '@src/core/interface/IUser'
import { NetworkManager } from '@src/core/libs/NetworkManager'
import { cookies } from 'next/headers'

export interface IGetUserInfo extends IBaseResponse {
	payload: IUser
}

export async function getUserInfoAction(): Promise<IGetUserInfo | null> {
	const jwt = cookies().get('jwt')

	if (jwt) {
		const res = await NetworkManager.get<IGetUserInfo>({
			endpoint: '/api/v1/user/account/me',
			addBearer: true,
		})

		return res.data
	} else {
		return null
	}
}
