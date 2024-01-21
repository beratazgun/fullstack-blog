import { getReadingListsDetailAction } from '@src/actions/getReadingListsDetail.action'
import RenderReadingListCard from '@src/components/ReadingListCard/RenderReadingListCard'
import { IReadingList } from '@src/core/interface/IReadingList'
import AccountLayout from '@src/layouts/AccountLayout'
import React from 'react'

export interface IReadingListResponsePayload extends IReadingList {
	isDeletable: boolean
	blogsLength: number
	blogsThumbnails: string[]
}

async function ReadingListPage() {
	const readingLists = await getReadingListsDetailAction()

	return (
		<AccountLayout>
			<div className="px-8 py-4">
				<h1 className="text-white text-3xl max-[400px]:text-xl">
					Your Reading lists
				</h1>
				<RenderReadingListCard readingListsData={readingLists.payload} />
			</div>
		</AccountLayout>
	)
}

export default ReadingListPage
