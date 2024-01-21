'use client'
import React, { ChangeEvent, useState } from 'react'
import UploadThumbnailButton from './UploadThumbnailButton'
import useStore from '@src/hooks/useStore'
import useWriteBlogData from '@src/hooks/useWriteBlogData'
import DeleteThumbnailButton from './DeleteThumbnailButton'
import Image from 'next/image'

const ThumbnailUpload: React.FC = () => {
	const useBlog = useStore(useWriteBlogData, (state) => state)
	const [selectedFile, setSelectedFile] = useState<File | null>(null)

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files && event.target.files[0]
		setSelectedFile(file || null)
	}

	const handleDeleteThumbnail = () => {
		setSelectedFile(null)

		useBlog?.setBlogData({
			...useBlog?.getBlogData(),
			thumbnail: '',
		})
	}

	return (
		<form className="flex items-center h-[14rem] w-[24rem]">
			{!selectedFile && !useBlog?.getBlogData().thumbnail && (
				<label
					htmlFor="ımage"
					className="border-[1px] rounded-lg border-dashed text-md font-bold leading-normal focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer border-slate-50 w-full h-full text-slate-200 flex flex-row justify-center items-center">
					<input
						type="file"
						id="ımage"
						name="ımage"
						multiple
						accept="*"
						className="hidden"
						onChange={handleFileChange}
					/>
					Add Thumbnail
				</label>
			)}
			{(selectedFile || useBlog?.getBlogData().thumbnail !== '') && (
				<div className="flex flex-col gap-4 h-full w-full rounded-lg">
					<Image
						priority
						src={
							selectedFile
								? URL.createObjectURL(selectedFile)
								: useBlog?.getBlogData().thumbnail || ''
						}
						height={400}
						width={400}
						alt="Preview"
						className="w-full h-full object-contain rounded-lg"
					/>
					<div className="flex flex-row justify-between items-between w-full">
						<UploadThumbnailButton selectedFile={selectedFile} />
						<DeleteThumbnailButton onClick={() => handleDeleteThumbnail()} />
					</div>
				</div>
			)}
		</form>
	)
}

export default ThumbnailUpload
