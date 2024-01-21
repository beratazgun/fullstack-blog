'use client'
import { IBlog } from '@src/core/interface/IBlog'
import React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import parse from 'html-react-parser'
import ReadBlogHeaderSection from './ReadBlogHeaderSection'

interface RenderBlogProps {
	blogData: IBlog
}

function RenderBlog({ blogData }: RenderBlogProps) {
	const queryClient = useQueryClient()

	queryClient.setQueryData(['blogDetail'], blogData)

	return (
		<div>
			<h1 className="text-[2.6rem] font-extrabold break-words">
				{blogData.title}
			</h1>
			<ReadBlogHeaderSection blogData={blogData} />
			<div>{parse(blogData.content)}</div>
		</div>
	)
}

export default RenderBlog
