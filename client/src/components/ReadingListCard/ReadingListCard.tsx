'use client'
import React, { useState } from 'react'
import {
	Card,
	CardHeader,
	CardBody,
	Image,
	useDisclosure,
} from '@nextui-org/react'
import ReadingListCardActionMenu from './ReadingListCardActionMenu'
import { IReadingListsDetailResponsePayload } from '@src/actions/getReadingListsDetail.action'
import ReadingListDetailModal from './ReadingListDetailModal'

interface ReadingListCardProps {
	readingListsData: IReadingListsDetailResponsePayload
}

export function ReadingListCard({ readingListsData }: ReadingListCardProps) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	const [isImageLoading, setIsImageLoading] = useState(true)
	const randomImage =
		readingListsData.blogsThumbnails[
			Math.floor(Math.random() * readingListsData.blogsLength)
		]

	const handleClickToOpenModal = () => {
		onOpen()
	}

	return (
		<Card
			className="py-4 bg-mediumBlack border-[1px] border-lightBlack min-h-fit w-full cursor-pointer"
			key={readingListsData.readingListCode}>
			<CardHeader className="pb-0 pt-2 px-4 flex flex-row justify-between">
				<div onClick={() => handleClickToOpenModal()} className="h-full w-4/5">
					<p className="text-tiny uppercase font-bold truncate  max-[500px]:text-[12px]">
						{readingListsData.readingListName}
					</p>
					<small className="text-default-500">
						{readingListsData.blogsLength} Blogs
					</small>
				</div>
				<ReadingListCardActionMenu readingList={readingListsData} />
			</CardHeader>
			<CardBody className="overflow-visible py-2">
				<div className="h-full w-full" onClick={() => handleClickToOpenModal()}>
					{readingListsData.blogsThumbnails.length > 0 ? (
						<Image
							alt="Card background"
							className="object-cover rounded-xl h-full w-full"
							src={randomImage}
							isLoading={isImageLoading}
							onLoad={() => {
								setIsImageLoading(false)
							}}
						/>
					) : (
						<div
							className="h-full w-full flex justify-center items-center"
							onClick={() => handleClickToOpenModal()}>
							<p className="text-default-500 text-center max-[500px]:text-[10px] max-[550px]:text-[12px]">
								No blogs in this reading list
							</p>
						</div>
					)}
				</div>
			</CardBody>
			<ReadingListDetailModal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				readingListData={readingListsData}
			/>
		</Card>
	)
}
