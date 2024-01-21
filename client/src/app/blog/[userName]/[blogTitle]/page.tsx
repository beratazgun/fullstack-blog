import React from 'react'
import NavbarLayout from '@src/layouts/NavbarLayout'
import RenderBlog from '@src/components/BlogDetail/RenderBlog'
import { getBlogsAction } from '@src/actions/getBlogs.action'

interface Props {
	params: { userName: string; blogTitle: string }
}

export default async function Page({ params }: Props) {
	const blogCode =
		params.blogTitle.split('-')[params.blogTitle.split('-').length - 1]
	const getBlog = await getBlogsAction({
		blogCode,
	})

	return (
		<NavbarLayout>
			<div className="flex flex-col gap-4 text-white max-w-[52rem] w-full py-16 mx-auto px-4">
				<RenderBlog blogData={getBlog.payload.docs[0]} />
				<div className="flex flex-row justify-start items-start gap-4 pt-12">
					{getBlog.payload.docs[0].tags.map((tag, index) => (
						<a
							href={`/tag/${tag.tagSlug}`}
							key={index}
							className="text-white text-md bg-mediumBlack px-3 py-1 rounded-2xl border-[0.8px] border-lightBlack">
							{tag.beautifiedTag}
						</a>
					))}
				</div>
			</div>
		</NavbarLayout>
	)
}
