import { getJwtAction } from '@src/actions/getJwt.action'
import axios, { AxiosInstance, AxiosResponse } from 'axios'

interface IHeader {
	[key: string]: string | boolean | number
}

interface IParams extends IHeader {}

export interface IBaseOptions {
	url?: string
	endpoint: string
	headers?: IHeader
	params?: IParams
	addBearer?: boolean
}

interface IPostOptions<TBody> extends IBaseOptions {
	body?: TBody
}

interface IGetOptions extends IBaseOptions {}

interface IAxiosCreateOptions {
	url?: string
	addBearer?: boolean
}

export class NetworkManager {
	protected static async axiosCreate({
		url,
		addBearer = false,
	}: IAxiosCreateOptions): Promise<AxiosInstance> {
		const jwt = await getJwtAction()

		const headers: IHeader = {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json',
		}

		if (addBearer) {
			headers['Authorization'] = `Bearer ${jwt}`
		}

		const instance = axios.create({
			baseURL: url ?? process.env.BACKEND_URL,
			withCredentials: true,
			headers: headers,
			timeout: 30000,
		})

		return instance
	}

	static async post<TBody = any, TResponse = any>({
		url,
		endpoint,
		body,
		headers,
		addBearer,
	}: IPostOptions<Partial<TBody>>): Promise<AxiosResponse<TResponse>> {
		const instance = await this.axiosCreate({
			url,
			addBearer,
		})

		return instance.post<TResponse>(endpoint, body, {
			headers,
			withCredentials: true,
		})
	}

	static async get<TResponse = any>({
		url,
		endpoint,
		headers,
		params,
		addBearer,
	}: IGetOptions): Promise<AxiosResponse<TResponse>> {
		const instance = await this.axiosCreate({
			url,
			addBearer,
		})

		const res = await instance.get<TResponse>(endpoint, {
			headers,
			params,
			withCredentials: true,
		})

		return res
	}
}
