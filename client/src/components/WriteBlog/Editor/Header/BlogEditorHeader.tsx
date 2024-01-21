import React, { useEffect } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import useWriteBlogData from '@src/hooks/useWriteBlogData'
import { Editor } from '@tiptap/react'
import BlogPreviewModal from '@src/components/WriteBlog/BlogPreviewModal/BlogPreviewModal'
import CancelButton from './CancelButton'
import useStore from '@src/hooks/useStore'
import { Bubble } from '@src/core/libs/Bubble'
import * as cheerio from 'cheerio'

interface BlogEditorHeaderProps {
	editor: Editor
}

function BlogEditorHeader({ editor }: BlogEditorHeaderProps) {
	const useBlog = useStore(useWriteBlogData, (state) => state)

	const { register, handleSubmit, watch } = useForm<FieldValues>({
		defaultValues: {
			title: useBlog?.blogData.title,
		},
		mode: 'all',
	})

	const saveBlogDataAndOpenPreviewModal = () => {
		const content = editor.getHTML()
		const description = content.replace(/<[^>]*>?/gm, '').slice(0, 200)
		const images = content.match(/<img[^>]+>/g)
		let imagesSrc: string[] = []

		const $ = cheerio.load(content)
		const preTags = $('pre')

		preTags.each((index, element) => {
			const newContentsArr = document.querySelectorAll('.ProseMirror pre code')
			$(element).replaceWith(
				`<pre class="my-12"><code>${newContentsArr[index].innerHTML}</code></pre>`
			)
		})

		if (images) {
			images.map((image) => {
				const src = image.match(/src="([^"]*)"/)?.[1]

				if (src) {
					imagesSrc.push(src)
				}
			})
		}

		useBlog?.setBlogData({
			...useBlog?.blogData,
			content: $.html('body').replace(/<\/?body>/g, ''),
			description,
			images: imagesSrc,
		})
	}

	useEffect(() => {
		const keydownFunc = () => {
			return document.addEventListener('keydown', (e) => {
				if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
					e.preventDefault()
					Bubble.success('Blog saved')
				}
			})
		}

		if (editor) {
			keydownFunc()
		}
	}, [editor])

	useEffect(() => {
		useBlog?.setBlogData({
			...useBlog?.blogData,
			content: editor?.getHTML(),
			title: watch('title') !== '' ? watch('title') : useBlog?.blogData.title,
		})
	}, [editor, editor?.getHTML(), watch('title')])

	return (
		<div className="flex flex-row justify-between items-center h-14 border-b-[0.1px] border-slate-50 border-opacity-30 fixed top-0 left-0 w-full bg-darkBlack z-[100] font-poppins ">
			<CancelButton />
			<form
				onSubmit={handleSubmit((data) => data)}
				className=" w-full bg-darkBlack">
				<input
					type="text"
					id="title"
					className="w-full h-full bg-darkBlack text-xl px-6 outline-none text-white"
					placeholder="Title"
					defaultValue={useBlog?.blogData.title}
					{...register('title', { required: true })}
				/>
			</form>
			<BlogPreviewModal onClick={() => saveBlogDataAndOpenPreviewModal()} />
		</div>
	)
}

export default BlogEditorHeader
