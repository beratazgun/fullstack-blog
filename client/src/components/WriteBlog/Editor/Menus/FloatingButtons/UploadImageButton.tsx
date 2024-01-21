import { Editor } from '@tiptap/react'
import React, { ChangeEvent, useRef } from 'react'
import { IconType } from 'react-icons/lib'
import { useMutation } from '@tanstack/react-query'
import { Bubble } from '@src/core/libs/Bubble'
import toast from 'react-hot-toast'
import { NetworkManager } from '@src/core/libs/NetworkManager'
import { IBaseResponse } from '@src/core/interface/IBaseResponse'

interface IUploadThumbnailResponse extends IBaseResponse {
	payload: {
		imageUrl: string
	}
}

interface IUploadThumbnailBody {
	image: File | null
}

interface UploadImageButtonProps {
	icon?: IconType
	editor: Editor
}

function UploadImageButton({ icon: Icon, editor }: UploadImageButtonProps) {
	const fileInputRef = useRef<HTMLInputElement | null>(null)

	const { mutate } = useMutation({
		mutationKey: ['uploadImage'],
		mutationFn: async (files: FileList | null) => {
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
					image: files?.[0],
				},
			})

			return res.data
		},
		onMutate: () => {
			Bubble.loading('Image is uploading')
		},
		onSuccess: (data) => {
			toast.dismiss()
			editor
				.chain()
				.setImage({
					src: data.payload.imageUrl,
					alt: 'image',
				})
				.focus('end')
				.run()

			editor.commands.createParagraphNear()
		},
		onError: (error) => {
			toast.dismiss()
			Bubble.error(error.message)
		},
	})

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const supportedImageTypes = [
			'image/gif',
			'image/jpeg',
			'image/png',
			'image/jpg',
			'image/webp',
		]
		const files = event.target.files

		if (
			files !== null &&
			files.length !== 0 &&
			!supportedImageTypes.includes(files[0].type)
		) {
			Bubble.error(
				'File type is not supported. Supported file types are: jpeg, png, jpg, gif, webp'
			)
		} else if (files !== null && files.length !== 0) mutate(files)
	}

	const triggerFileInput = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click()
		}
	}

	return (
		<div className="relative hover:border-primary">
			<button
				onClick={triggerFileInput}
				className="flex flex-row justify-center items-center text-2xl opacity-70 hover:opacity-100">
				{Icon && <Icon />}
			</button>
			<input
				ref={fileInputRef}
				type="file"
				style={{ display: 'none' }}
				className="w-full"
				onChange={handleFileChange}
			/>
		</div>
	)
}

export default UploadImageButton
