'use client'
import React, { useEffect, useState } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Bubble } from '@src/core/libs/Bubble'
import { IBlog } from '@src/core/interface/IBlog'
import { TbBookmark, TbBookmarkFilled } from 'react-icons/tb'
import ReadingListSkeleton from '../Skeletons/ReadingListSkeleton'
import CreateReadingListInput from './CreateReadingListInput'
import { getReadingListsAction } from '@src/actions/getReadingLists.action'

interface ReadingListButtonProps {
	children: React.ReactNode
	blogData: IBlog
}

function ReadingListButton({ children, blogData }: ReadingListButtonProps) {
	const [isPopoverOpen, setIsPopoverOpen] = useState(false)
	const queryClient = useQueryClient()

	const readingListsMutation = useMutation({
		mutationKey: ['readingLists'],
		mutationFn: async () => {
			const res = await getReadingListsAction()

			return res.payload
		},
		onSuccess: (data) => {
			if (data.length === 0) {
				Bubble.info('You have no reading lists yet.')
			}

			queryClient.setQueryData(['readingLists'], data)
		},
	})

	useEffect(() => {
		if (isPopoverOpen === true) {
			readingListsMutation.mutate()
		}
	}, [isPopoverOpen])

	return (
		<>
			<Popover
				isOpen={isPopoverOpen}
				onOpenChange={(open) => {
					setIsPopoverOpen(open)
				}}
				size="lg"
				placement="bottom"
				showArrow={true}
				className="dark"
				classNames={{
					content: 'bg-mediumBlack rounded-lg',
				}}>
				<PopoverTrigger>
					<button className="text-white  rounded-full hover:bg-lightBlack duration-300 p-2 outline-none">
						{blogData.signedInUserReadingList.length > 0 ? (
							<TbBookmarkFilled className="text-2xl" />
						) : (
							<TbBookmark className="text-2xl" />
						)}
					</button>
				</PopoverTrigger>
				<PopoverContent>
					<div className="flex flex-col justify-between items-center  w-[16rem] max-w-[16rem] min-w-[16rem]">
						{readingListsMutation.isPending ? (
							<ReadingListSkeleton />
						) : (
							<>{children}</>
						)}
						<CreateReadingListInput
							closePopover={() => setIsPopoverOpen(false)}
						/>
					</div>
				</PopoverContent>
			</Popover>
		</>
	)
}

export default ReadingListButton
