import { ITags } from './ITags'
import { IUser } from './IUser'
import { IReadingList } from './IReadingList'

interface signedInUserReadingList extends IReadingList {
	blogCode: string
}

export interface IBlog {
	blogCode: string
	title: string
	titleSlug: string
	content: string
	description: string
	thumbnail: string
	viewCount: number
	isPublished: boolean
	publishedAt: string
	deletedAt: string
	tags: ITags[]
	writer: Pick<
		IUser,
		'firstName' | 'lastName' | 'profileImage' | 'userName' | 'userCode'
	>
	signedInUserReadingList: signedInUserReadingList[]
}
