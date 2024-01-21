import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { NetworkManager } from '@src/core/libs/NetworkManager'
import { Bubble } from '@src/core/libs/Bubble'
import useJwt from '@src/hooks/useJwt'
import { IBaseResponse } from '@src/core/interface/IBaseResponse'

interface IDeleteBlogResponse extends IBaseResponse {}

interface DeleteBlogActionProps {
	blogCode: string
	handleDeleteBlog: (blogCode: string) => void
}

function DeleteBlogAction({
	blogCode,
	handleDeleteBlog,
}: DeleteBlogActionProps) {
	const { jwt } = useJwt()

	const { mutate } = useMutation({
		mutationKey: ['deleteBlog'],
		mutationFn: async () => {
			const { data } = await NetworkManager.post<any, IDeleteBlogResponse>({
				endpoint: `/api/v1/blog/delete/${blogCode}`,
				addBearer: true,
			})

			return data
		},
		onSuccess: () => {
			Bubble.success('Blog deleted successfully')
			handleDeleteBlog(blogCode)
		},
		onError: (error) => {
			Bubble.error(error.message)
		},
	})

	return (
		<div
			onClick={() => mutate()}
			className="w-full h-8 flex justify-start items-center">
			delete
		</div>
	)
}

export default DeleteBlogAction
