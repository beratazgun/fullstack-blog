'use client'
import { Editor, EditorContent, useEditor } from '@tiptap/react'
import { Source_Serif_4 } from 'next/font/google'
import React, { useEffect } from 'react'
import TextFormatingBubbleMenu from './Menus/TextFormatingBubbleMenu'
import EditorialToolsFloatingMenu from './Menus/EditorialToolsFloatingMenu'
import BlogEditorHeader from './Header/BlogEditorHeader'
import tippy, { followCursor, roundArrow } from 'tippy.js'
import tiptapOptions from './TiptapOptions'
import 'tippy.js/dist/svg-arrow.css'
import useStore from '@src/hooks/useStore'
import useWriteBlogData from '@src/hooks/useWriteBlogData'
import { LuMonitor } from 'react-icons/lu'

const sourceSerif4 = Source_Serif_4({
	weight: ['300', '400', '500', '600', '700', '800'],
	subsets: ['latin'],
	style: 'normal',
})

function BlogEditor() {
	const useBlog = useStore(useWriteBlogData, (state) => state)
	const editor = useEditor(tiptapOptions) as Editor

	// We create a tooltip that shows the url of the link when you hover over the link using the tippy.js library.
	useEffect(() => {
		if (editor) {
			const links = document.querySelectorAll('p a')

			links.forEach((link) => {
				const url = link.getAttribute('href')
				tippy(link, {
					content: `${url?.includes('http') ? url : `http://${url}`}`,
					trigger: 'mouseenter',
					arrow: roundArrow,
					placement: 'top',
					plugins: [followCursor],
					followCursor: 'horizontal',
					theme: 'link-tooltip',
					animation: 'scale',
				})
			})
		}
	}, [editor, editor?.getHTML()])

	// We set the content of the editor to the content of the blog that we are editing.
	useEffect(() => {
		if (
			useBlog?.blogData.content &&
			editor &&
			editor.getHTML() !== useBlog?.blogData.content
		) {
			editor.commands.setContent(useBlog?.blogData.content)
		}
	}, [editor])

	return (
		<>
			<div className="hidden max-[768px]:visible max-[768px]:flex text-white h-screen flex-col justify-center items-center gap-2">
				<LuMonitor className="text-9xl " />
				Please open this page on a larger screen.
			</div>
			<div className={`w-full max-[768px]:hidden  ${sourceSerif4.className}`}>
				<BlogEditorHeader editor={editor} />
				<div className="flex flex-col justify-center items-center mb-36 mt-12 ">
					<div className="py-4 max-w-[52rem] w-full h-full pb-24 px-4 mt-4 bg-darkBlack">
						{editor && <TextFormatingBubbleMenu editor={editor} />}
						{editor && <EditorialToolsFloatingMenu editor={editor} />}
						<EditorContent editor={editor} />
					</div>
				</div>
			</div>
		</>
	)
}

export default BlogEditor
