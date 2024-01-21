'use server'
import { IBaseResponse } from '@src/core/interface/IBaseResponse'
import { IBlog } from '@src/core/interface/IBlog'
import { IPagination } from '@src/core/interface/IPagination'
import { NetworkManager } from '@src/core/libs/NetworkManager'

interface IGetAllBlogsResponsePayload {
	pagination: IPagination
	docs: IBlog[]
}

export interface IGetAllBlogResponse extends IBaseResponse {
	payload: IGetAllBlogsResponsePayload
}

interface IGetBlogsActionParams {
	[key: string]: string | boolean | number
}

export async function getBlogsAction(params: IGetBlogsActionParams) {
	const res = await NetworkManager.get<IGetAllBlogResponse>({
		endpoint: `/api/v1/blog/get/all?${params}`,
		addBearer: true,
		params,
	})

	return res.data
}
