'use server'
import { IBaseResponse } from '@src/core/interface/IBaseResponse'
import { IUser } from '@src/core/interface/IUser'
import { NetworkManager } from '@src/core/libs/NetworkManager'

interface IGetUserByUsername extends IBaseResponse {
	payload: IUser
}

export async function getUserByUsernameAction(
	userName: string
): Promise<IGetUserByUsername> {
	const res = await NetworkManager.get<IGetUserByUsername>({
		endpoint: `/api/v1/user/get-by/${userName}`,
		addBearer: true,
	})

	return res.data
}
