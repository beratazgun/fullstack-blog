'use client'
import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { Bubble } from '@src/core/libs/Bubble'
import { Button } from '@nextui-org/react'
import useWriteBlogData from '@src/hooks/useWriteBlogData'
import useStore from '@src/hooks/useStore'
import { NetworkManager } from '@src/core/libs/NetworkManager'
import { IBaseResponse } from '@src/core/interface/IBaseResponse'

interface UploadThumbnailButtonProps {
	selectedFile: File | null
}

interface IUploadThumbnailResponse extends IBaseResponse {
	payload: {
		imageUrl: string
	}
}

interface IUploadThumbnailBody {
	image: File | null
}

const UploadThumbnailButton: React.FC<UploadThumbnailButtonProps> = ({
	selectedFile,
}) => {
	const useBlog = useStore(useWriteBlogData, (state) => state)

	const { mutate, isPending } = useMutation({
		mutationKey: ['uploadImage'],
		mutationFn: async () => {
			const res = await NetworkManager.post<
				IUploadThumbnailBody,
				IUploadThumbnailResponse
			>({
				endpoint: '/api/v1/images/upload',
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				addBearer: true,
				body: {
					image: selectedFile,
				},
			})

			return res.data
		},
		onSuccess: (data) => {
			Bubble.success('Thumbnail uploaded successfully.')

			useBlog?.setBlogData({
				...useBlog?.blogData,
				thumbnail: data.payload.imageUrl,
			})
		},
		onError: (error) => {
			Bubble.error(error.message)
		},
	})

	const handleUpload = async () => {
		if (selectedFile) {
			const formData = new FormData()
			formData.append('image', selectedFile)

			try {
				mutate()
			} catch (error) {
				console.error('Error uploading image:', error)
			}
		}
	}

	return (
		<Button
			color="primary"
			isDisabled={useBlog?.blogData.thumbnail !== '' ? true : false}
			isLoading={isPending ? true : false}
			onClick={handleUpload}
			className="w-fit text-sm text-white flex flex-row justify-center items-center gap-2">
			Upload thumbnail
		</Button>
	)
}

export default UploadThumbnailButton
