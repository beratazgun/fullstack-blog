import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { NetworkManager } from '@src/core/libs/NetworkManager'
import { Bubble } from '@src/core/libs/Bubble'
import useJwt from '@src/hooks/useJwt'
import { IBaseResponse } from '@src/core/interface/IBaseResponse'
import { toast } from 'react-hot-toast'

interface IUpdateBlogStatusBody {
	isPublished: boolean
}

interface IUpdateBlogStatusResponse extends IBaseResponse {
	validationErrors: {
		isPublished: string
	}
}

interface DeleteBlogActionProps {
	blogCode: string
	currentStatus: boolean
	handleUpdateBlogStatus: (blogCode: string, isPublished: boolean) => void
}

const UpdateStatusAction: React.FC<DeleteBlogActionProps> = ({
	blogCode,
	currentStatus,
	handleUpdateBlogStatus,
}) => {
	const { jwt } = useJwt()

	const { mutate } = useMutation({
		mutationKey: ['updateStatus'],
		mutationFn: async () => {
			const { data } = await NetworkManager.post<
				IUpdateBlogStatusBody,
				IUpdateBlogStatusResponse
			>({
				endpoint: `/api/v1/blog/update/status/${blogCode}`,
				addBearer: true,
				body: {
					isPublished: !currentStatus,
				},
			})

			return data
		},
		onSuccess: () => {
			toast.dismiss()
			Bubble.success('Blog status update successfully')
			handleUpdateBlogStatus(blogCode, !currentStatus)
		},
		onError: (error) => {
			toast.dismiss()
			Bubble.error(error.message)
		},
		onMutate: () => {
			Bubble.loading('Updating blog status...')
		},
	})
	return (
		<div
			onClick={() => mutate()}
			className="w-full h-8 flex justify-start items-center">
			{currentStatus ? 'Unpublish' : ' Publish'}
		</div>
	)
}

export default UpdateStatusAction
