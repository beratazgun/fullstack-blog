import React, { useEffect, useState } from 'react'
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
} from '@nextui-org/react'
import { TbMessagePlus } from 'react-icons/tb'
import ThumbnailUpload from './ThumbnailUpload/ThumbnailUpload'
import { FaInfoCircle } from 'react-icons/fa'
import useWriteBlogData from '@src/hooks/useWriteBlogData'
import { Bubble } from '@src/core/libs/Bubble'
import TagsInput from './TagsSelector'
import { usePathname } from 'next/navigation'
import toast from 'react-hot-toast'
import useStore from '@src/hooks/useStore'
import { useMutation } from '@tanstack/react-query'
import { map, omit } from 'lodash'
import { useRouter } from 'next/navigation'
import { IBaseResponse } from '@src/core/interface/IBaseResponse'
import { NetworkManager } from '@src/core/libs/NetworkManager'

interface BlogPreviewModalProps {
	onClick: () => void
}

interface IPublishBlogBody {
	title: string
	blogCode: string
	content: string
	description: string
	images: string[]
	tag: string[]
	thumbnail: string
}

interface IPublishBlogResponse extends IBaseResponse {}

const BlogPreviewModal: React.FC<BlogPreviewModalProps> = ({ onClick }) => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	const pathName = usePathname()
	const blogCode = pathName.split('/')[3]
	const router = useRouter()
	const useBlog = useStore(useWriteBlogData, (state) => state)
	const [isClickedPublishNowButton, setIsClickedPublishNowButton] =
		useState(false)

	const { mutate } = useMutation({
		mutationKey: ['publishBlog'],
		mutationFn: async () => {
			const res = await NetworkManager.post<
				IPublishBlogBody,
				IPublishBlogResponse
			>({
				endpoint: '/api/v1/blog/publish',
				addBearer: true,
				body: {
					title: useBlog?.blogData.title as string,
					blogCode: useBlog?.blogData.blogCode as string,
					content: useBlog?.blogData.content as string,
					description: useBlog?.blogData.description as string,
					images: useBlog?.blogData.images as string[],
					tag: map(useBlog?.blogData.tags, (tag) => tag.tag),
					thumbnail: useBlog?.blogData.thumbnail as string,
				},
			})

			return res.data
		},
		onSuccess: (data) => {
			toast.dismiss()
			if (data.isSuccess) {
				Bubble.success('Blog published successfully.')
				localStorage.removeItem('blogData')

				setTimeout(() => {
					router.push('/')
				}, 1000)
			} else {
				Bubble.error(data.message)
			}
		},
		onError: (error) => {
			toast.dismiss()
			Bubble.error(error.message)
			setIsClickedPublishNowButton(false)
		},
		onMutate: () => {
			Bubble.loading('Publishing...')
		},
	})

	const publishBlog = () => {
		setIsClickedPublishNowButton(true)
		useBlog?.setBlogData({
			...useBlog?.blogData,
			blogCode: blogCode,
		})

		const hasEmptyValues = Object.values(
			omit(useBlog?.blogData!, ['images'])
		).some(
			(value) =>
				(typeof value === 'string' && value.trim() === '') ||
				(Array.isArray(value) && value.length === 0)
		)

		if (hasEmptyValues) {
			Bubble.error(
				'Title, description, content, thumbnail and blogCode should not be empty.'
			)
			setIsClickedPublishNowButton(false)
			return
		} else {
			mutate()
		}
	}

	useEffect(() => {
		toast.dismiss()
	}, [onOpenChange])

	return (
		<>
			<Button
				radius="none"
				onClick={() => onClick()}
				onPress={onOpen}
				startContent={
					<div>
						<TbMessagePlus />
					</div>
				}
				className="flex flex-row justify-center items-center px-8 gap-2 h-full text-lg bg-gradient-to-tr from-blue-400 via-blue-600 to-blue-700 rounded-l-lg  text-white hover:opacity-70 duration-300 outline-none font-poppins">
				Publish
			</Button>
			<Modal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				backdrop="blur"
				className="bg-mediumBlack text-white border-[2px] rounded-lg border-lightBlack"
				size="4xl">
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col justify-center items-center border-b-[2px] rounded-lg border-lightBlack ">
								Blog Preview
							</ModalHeader>
							<ModalBody>
								<div className="py-4 w-full">
									<div className="grid grid-cols-[24rem_5px_24rem] gap-x-8 w-full">
										<div className="flex flex-col justify-start gap-4 w-full">
											<div className="flex flex-row justify-center items-center gap-2 bg-mediumBlack px-2 py-2 rounded-lg border-[0.1px] border-slate-50 border-opacity-30">
												<FaInfoCircle className="text-6xl " />
												<p className="text-justify text-sm">
													Include a high-quality image in your story to make it
													more inviting to readers.
												</p>
											</div>
											<ThumbnailUpload />
										</div>
										<div className="h-full border-r-[0.1px] border-slate-50 border-opacity-30"></div>
										<div className=" flex flex-col gap-4 w-full">
											<p>
												Add or change topics (up to 5) so readers know what your
												story is about
											</p>
											<TagsInput />
										</div>
									</div>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button
									disabled={isClickedPublishNowButton}
									className="bg-green-600 text-white disabled:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
									onClick={() => publishBlog()}>
									Publish Now
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	)
}

export default BlogPreviewModal
