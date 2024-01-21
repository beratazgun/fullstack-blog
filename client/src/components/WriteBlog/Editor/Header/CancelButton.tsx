import React from 'react'
import { IoCloseSharp } from 'react-icons/io5'
import toast from 'react-hot-toast'
import { useMutation } from '@tanstack/react-query'
import { NetworkManager } from '@src/core/libs/NetworkManager'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@nextui-org/react'
import { AxiosError } from 'axios'
import { Bubble } from '@src/core/libs/Bubble'
import { IBaseResponse } from '@src/core/interface/IBaseResponse'

interface IDeleteBlogResponse extends IBaseResponse {}

function CancelButton() {
	const router = useRouter()
	const blogCode = usePathname().split('/')[3]

	const { mutate } = useMutation({
		mutationFn: async () => {
			const { data } = await NetworkManager.post<any, IDeleteBlogResponse>({
				endpoint: `/api/v1/blog/delete/${blogCode}`,
				addBearer: true,
			})

			return data
		},
		onSuccess: () => {
			toast.dismiss()
			setTimeout(() => {
				router.push('/')
			}, 200)

			localStorage.removeItem('blogData')
			localStorage.removeItem('tags')
		},
		onError: (error: AxiosError<IDeleteBlogResponse>) => {
			if (error.response) {
				Bubble.error(error.response.data.message)
				setTimeout(() => {
					router.push('/')
				}, 400)
			}
		},
	})

	return (
		<Button
			onClick={() => mutate()}
			className="flex flex-row justify-center items-center rounded-none bg-black outline-none  gap-2 h-full text-white px-6 hover:opacity-70 duration-300">
			<IoCloseSharp className="text-4xl" />
		</Button>
	)
}

export default CancelButton
