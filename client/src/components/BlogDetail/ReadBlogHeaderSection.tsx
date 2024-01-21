'use client'
import React from 'react'
import { Avatar, AvatarIcon } from '@nextui-org/react'
import { capitalize } from 'lodash'
import Link from 'next/link'
import { IBlog } from '@src/core/interface/IBlog'
import CopyBlogLinkButton from '@src/components/CopyBlogLinkButton'
import ReadingListButton from '@src/components/ReadingListsButton/ReadingListButton'
import BlogDetailRenderReadingLists from './BlogDetailRenderReadingLists'
import { getBlogsAction } from '@src/actions/getBlogs.action'

interface ReadBlogHeaderSectionProps {
	blogData: IBlog
	apiQueryParams?: any
}

function ReadBlogHeaderSection({ blogData }: ReadBlogHeaderSectionProps) {
	const handleRefetch = async () => {
		const res = await getBlogsAction({
			blogCode: blogData.blogCode,
		})

		return res.payload.docs[0]
	}

	return (
		<div className="flex flex-row justify-between items-center w-full py-8">
			<div className="flex items-center gap-4">
				<Avatar
					color="primary"
					src={blogData.writer.profileImage}
					icon={<AvatarIcon />}
					size="lg"
				/>
				<div className="flex flex-col">
					<Link
						href={`/user/${blogData.writer.userName}`}
						className="text-xl text-white font-medium">
						{capitalize(blogData.writer.firstName)} {blogData.writer.lastName}
					</Link>
					<p className="text-sm text-white">
						{new Date(blogData.publishedAt).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						})}
					</p>
				</div>
			</div>
			<div className="flex flex-row justify-between items-center gap-2">
				<ReadingListButton blogData={blogData}>
					<BlogDetailRenderReadingLists
						blogData={blogData}
						handlePrefetch={() => handleRefetch()}
					/>
				</ReadingListButton>
				<CopyBlogLinkButton />
			</div>
		</div>
	)
}

export default ReadBlogHeaderSection
