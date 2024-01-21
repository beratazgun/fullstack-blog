import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { Bubble } from '@src/core/libs/Bubble'
import { Button } from '@nextui-org/react'
import useWriteBlogData from '@src/hooks/useWriteBlogData'
import useStore from '@src/hooks/useStore'
import { NetworkManager } from '@src/core/libs/NetworkManager'
import { IBaseResponse } from '@src/core/interface/IBaseResponse'

interface DeleteThumbnailButtonProps {
	onClick: any
}

interface IDeleteThumbnailResponse extends IBaseResponse {}

interface IDeleteThumbnailBody {
	imageUrls: string[]
}

const DeleteThumbnailButton: React.FC<DeleteThumbnailButtonProps> = ({
	onClick,
}) => {
	const useBlog = useStore(useWriteBlogData, (state) => state)

	const { mutate } = useMutation({
		mutationKey: ['deleteImage'],
		mutationFn: async () => {
			const res = await NetworkManager.post<
				IDeleteThumbnailBody,
				IDeleteThumbnailResponse
			>({
				endpoint: '/api/v1/images/delete',
				addBearer: true,
				body: {
					imageUrls: [useBlog?.getBlogData().thumbnail as string],
				},
			})

			return res.data
		},
		onSuccess: () => {
			Bubble.success('Thumbnail deleted successfully.')

			useBlog?.setBlogData({
				...useBlog?.blogData,
				thumbnail: '',
			})

			onClick()
		},
		onError: (error) => {
			Bubble.error(error.message)
		},
	})

	const handleClick = () => {
		if (useBlog?.getBlogData().thumbnail !== '') {
			mutate()
		} else {
			onClick()
		}
	}

	return (
		<Button
			color="danger"
			onClick={() => handleClick()}
			className="block w-fit text-sm ">
			Delete thumbnail
		</Button>
	)
}

export default DeleteThumbnailButton
