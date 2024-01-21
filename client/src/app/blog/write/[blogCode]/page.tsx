import BlogEditor from '@src/components/WriteBlog/Editor/BlogEditor'
import React from 'react'

interface WriteBlogPageProp {
	params: {
		blogCode: string
	}
}

export default function WriteBlogPage({ params }: WriteBlogPageProp) {
	return <BlogEditor />
}
