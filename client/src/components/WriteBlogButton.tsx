'use client'
import React from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Bubble } from '@src/core/libs/Bubble'
import { useRouter } from 'next/navigation'
import useWriteBlogData from '@src/hooks/useWriteBlogData'
import useStore from '@src/hooks/useStore'
import { Button } from '@nextui-org/react'
import { FaSquarePen } from 'react-icons/fa6'
import { NetworkManager } from '@src/core/libs/NetworkManager'
import { IBaseResponse } from '@src/core/interface/IBaseResponse'

interface WriteBlogButtonProps {
	buttonLabel: string
}

interface INewBlogResponse extends IBaseResponse {
	payload: {
		blogCode: string
		writerCode: string
	}
}

function WriteBlogButton({ buttonLabel }: WriteBlogButtonProps) {
	const useBlog = useStore(useWriteBlogData, (state) => state)
	const { push } = useRouter()

	const { mutate } = useMutation({
		mutationKey: ['newBlog'],
		mutationFn: async () => {
			const res = await NetworkManager.post<any, INewBlogResponse>({
				endpoint: '/api/v1/blog/new',
				addBearer: true,
			})

			return res.data
		},
		onMutate: () => {
			Bubble.loading('Creating new blog...')
		},
		onSuccess: (data) => {
			useBlog?.setBlogData({
				blogCode: data.payload.blogCode,
				thumbnail: '',
				title: '',
				content: '',
				tags: [],
				images: [],
				description: '',
			})

			toast.dismiss()
			push(`/blog/write/${data.payload.blogCode}`)
		},
	})

	return (
		<Button
			style={{ minWidth: 'fit-content' }}
			className="bg-gradient-to-tr from-blue-400 via-blue-600 to-blue-700 text-white shadow-lg rounded-xl px-4 py-1 h-8 text-md max-sm:px-0 flex flex-row items-center justify-center max-sm:w-12 duration-700"
			onClick={() => mutate()}>
			<FaSquarePen className="mr-2 max-sm:mr-0 fill-white" />
			<span className="max-sm:hidden text-white">{buttonLabel}</span>
		</Button>
	)
}

export default WriteBlogButton
