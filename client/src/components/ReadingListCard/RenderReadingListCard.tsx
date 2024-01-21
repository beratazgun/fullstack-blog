import React from 'react'
import { ReadingListCard } from '../ReadingListCard/ReadingListCard'
import { IReadingListsDetailResponsePayload } from '@src/actions/getReadingListsDetail.action'

interface RenderReadingListCardProps {
	readingListsData: IReadingListsDetailResponsePayload[]
}

function RenderReadingListCard({
	readingListsData,
}: RenderReadingListCardProps) {
	const renderReadingListCard = readingListsData.map((readingList) => {
		return (
			<ReadingListCard
				readingListsData={readingList}
				key={readingList.readingListCode}
			/>
		)
	})

	return (
		<div className="grid grid-cols-3 gap-4 pt-4 pb-8 max-[900px]:grid-cols-2 max-[500px]:grid-cols-1 h-full ">
			{renderReadingListCard}
		</div>
	)
}

export default RenderReadingListCard
