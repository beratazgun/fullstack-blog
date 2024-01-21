import { Avatar, AvatarIcon } from '@nextui-org/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { IBlog } from '@src/core/interface/IBlog'
import ReadingListButton from '../ReadingListsButton/ReadingListButton'
import BlogCardRenderReadingList from './BlogCardRenderReadingList'

interface BlogCardProps {
	blogData: IBlog
	showTag?: boolean
	apiQueryParams?: any
	showReadingList?: boolean
	additionalBLogCardFooter?: React.ReactNode[]
}

function BlogCard({
	blogData,
	showTag = true,
	apiQueryParams,
	showReadingList = true,
	additionalBLogCardFooter,
}: BlogCardProps) {
	return (
		<div
			className="grid grid-cols-[1fr_0.40fr] grid-flow-dense items-start h-fit px-8 py-4 gap-y-4 bg-mediumBlack/60 rounded-lg hover:bg-mediumBlack/40 duration-300 border-lightBlack border-[1px] max-[700px]:grid-cols-1 max-[700px]:px-4 max-[700px]:gap-y-2 w-full"
			key={blogData.blogCode}>
			<Link
				href={`/user/${blogData.writer.userName}`}
				className="flex flex-row gap-3 justify-start items-center cursor-pointer col-span-3 w-fit">
				<Avatar
					icon={<AvatarIcon />}
					color="primary"
					onClick={() => {}}
					isBordered
					radius="full"
					className="h-8 w-8 cursor-pointer"
					src={
						blogData.writer.profileImage === ''
							? ''
							: blogData.writer.profileImage
					}
				/>
				<div className="flex flex-row justify-center items-center text-md gap-2 text-white max-[380px]:flex-col max-[380px]:gap-0 max-[380px]:items-start">
					<p className="block">{blogData.writer.userName}</p>
					<div className="w-1 h-1 rounded-full border-1 border-white bg-white max-[380px]:hidden"></div>
					<p>{new Date(blogData.publishedAt).toLocaleDateString()}</p>
				</div>
			</Link>
			<div className="w-full pr-8 break-normal flex flex-col justify-between gap-2 h-full max-[700px]:pr-0 max-sm:text-[8px]">
				<Link href={`/blog/${blogData.writer.userName}/${blogData.titleSlug}`}>
					<h1 className="text-xl font-bold text-white max-[380px]:text-[18px]">
						{blogData.title}
					</h1>
					<p className="text-white max-[700px]:hidden">
						{blogData.description.slice(0, 120)}
					</p>
				</Link>
				<div className="flex flex-row justify-between items-center">
					<div className="flex flex-row justify-between items-center gap-2">
						{showTag && (
							<Link
								href={`/tag/${blogData.tags[0].tagSlug}`}
								key={blogData.tags[0].tagSlug}
								className="text-sm font-medium bg-lightBlack text-white px-3 py-1 rounded-lg">
								{blogData.tags[0].beautifiedTag}
							</Link>
						)}
					</div>
					<div className="flex flex-row gap-2 items-center">
						{showReadingList && (
							<ReadingListButton blogData={blogData}>
								<BlogCardRenderReadingList
									blogData={blogData}
									apiQueryParams={apiQueryParams}
								/>
							</ReadingListButton>
						)}
						{additionalBLogCardFooter}
					</div>
				</div>
			</div>
			<div className="h-[180px] max-[700px]:hidden">
				<Image
					className="h-full w-64 object-top object-cover rounded-lg"
					src={blogData.thumbnail}
					height={180}
					width={300}
					alt={blogData.titleSlug}
				/>
			</div>
		</div>
	)
}

export default BlogCard
