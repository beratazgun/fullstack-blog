import React from 'react'
import { Checkbox } from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'
import { Bubble } from '@src/core/libs/Bubble'
import { IReadingList } from '@src/core/interface/IReadingList'

import { AxiosError } from 'axios'
import { NetworkManager } from '@src/core/libs/NetworkManager'
import { IBaseResponse } from '@src/core/interface/IBaseResponse'

interface ReadingListItemProps {
	readingList: IReadingList
	isSelected: boolean
	blogCode: string
	onClick: () => void
}

export interface IReadingListsResponse extends IBaseResponse {}

interface IReadingListsBody {
	blogCode: string
	readingListCode: string
}

function ReadingListItem({
	readingList,
	isSelected,
	blogCode,
	onClick,
}: ReadingListItemProps) {
	const { mutate } = useMutation({
		mutationKey: ['addOrDeleteBlogToReadingList'],
		mutationFn: async ({
			readingListCode,
			action,
		}: {
			readingListCode: string
			action: 'add' | 'delete'
		}) => {
			const res = await NetworkManager.post<
				IReadingListsBody,
				IReadingListsResponse
			>({
				endpoint: `/api/v1/reading-lists/${action}`,
				addBearer: true,
				body: {
					blogCode,
					readingListCode,
				},
			})

			return res.data
		},
		onSuccess: (data) => {
			if (data.isSuccess) {
				onClick()
			}
		},
		onError: (error: AxiosError<IReadingListsResponse>) => {
			if (!error.response?.data?.isSuccess) {
				Bubble.error('Something went wrong. Please try again.')
			}
		},
	})

	return (
		<Checkbox
			onClick={() =>
				mutate({
					action: isSelected ? 'delete' : 'add',
					readingListCode: readingList.readingListCode,
				})
			}
			defaultChecked={false}
			defaultSelected={isSelected}
			className="truncate">
			{readingList.readingListName}
		</Checkbox>
	)
}

export default ReadingListItem
