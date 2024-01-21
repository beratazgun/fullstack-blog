'use client'
import React, { useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody } from '@nextui-org/react'
import { IReadingList } from '@src/core/interface/IReadingList'
import { useMutation } from '@tanstack/react-query'
import { NetworkManager } from '@src/core/libs/NetworkManager'
import BlogCard from '../BlogCard/BlogCard'
import { IBaseResponse } from '@src/core/interface/IBaseResponse'
import { IBlog } from '@src/core/interface/IBlog'

interface ReadingListDetailModalProps {
	isOpen: boolean
	onOpenChange: (isOpen: boolean) => void
	readingListData: IReadingList
}

interface IGetsBlogsInReadingList extends IBaseResponse {
	payload: IBlog[]
}

function ReadingListDetailModal({
	isOpen,
	onOpenChange,
	readingListData,
}: ReadingListDetailModalProps) {
	const { mutate, data, isPending } = useMutation({
		mutationKey: ['getBlogsInReadingList', readingListData.readingListCode],
		mutationFn: async () => {
			const res = await NetworkManager.get<IGetsBlogsInReadingList>({
				endpoint: `/api/v1/reading-lists/get/bilist/${readingListData.readingListCode}`,
				addBearer: true,
			})

			return res.data.payload
		},
	})

	useEffect(() => {
		if (isOpen) {
			mutate()
		}
	}, [isOpen])

	const renderBlogCard = data?.map((el) => {
		return <BlogCard blogData={el} showReadingList={false} />
	})

	return (
		<>
			<Modal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				backdrop="blur"
				placement="center"
				className="dark h-[80%]"
				size="5xl">
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col items-start ">
								<p className=" text-[18px] uppercase font-bold truncate  max-[500px]:text-[12px] text-white">
									{readingListData.readingListName}
								</p>
							</ModalHeader>
							<ModalBody className="overflow-y-scroll">
								<div className="flex flex-col gap-2 h-dvh ">
									{data?.length === 0 && !isPending ? (
										<p className="text-white flex justify-center items-center h-full w-full text-[18px]">
											No blogs in this reading list
										</p>
									) : (
										renderBlogCard
									)}
								</div>
							</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	)
}

export default ReadingListDetailModal
