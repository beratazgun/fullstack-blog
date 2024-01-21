'use client'
import { BubbleMenu, Editor } from '@tiptap/react'
import React, { useCallback } from 'react'
import {
	FaBold,
	FaItalic,
	FaHeading,
	FaStrikethrough,
	FaUnderline,
	FaLink,
	FaListOl,
	FaListUl,
} from 'react-icons/fa'
import BubbleMenuButton from './BubbleMenu/BubbleMenuButton'
import { roundArrow } from 'tippy.js'
import 'tippy.js/dist/svg-arrow.css'

interface Props {
	editor: Editor
}

const TextFormatingBubbleMenu: React.FC<Props> = ({ editor }) => {
	const setEnteredLink = useCallback(() => {
		const { from, to } = editor.state.selection

		let hasLink = false

		// checks if there is a link in the selected text, if there is, hasLink becomes true.
		editor.state.doc.nodesBetween(from, to, (node, pos) => {
			if (node.isText) {
				const marks = node.marks
				if (marks.length > 0) {
					marks.forEach((mark) => {
						if (mark.type.name === 'link') {
							hasLink = true
						}
					})
				}
			}
		})

		// if has link is true, it removes the link
		if (hasLink) {
			editor.chain().focus().extendMarkRange('link').unsetLink().run()
		} else {
			const url = window.prompt('URL')
			if (url) {
				editor
					.chain()
					.focus()
					.extendMarkRange('link')
					.setLink({ href: url.includes('http') ? url : `http://${url}` })
					.run()
			}
		}
	}, [editor])

	return (
		<BubbleMenu
			className="flex flex-row gap-4 text-xl text-white border-[0.1px] border-primary bg-black px-4 py-3 rounded-lg"
			tippyOptions={{
				arrow: roundArrow,
				placement: 'top',
				theme: 'text-formating-bubble-menu',
			}}
			shouldShow={({ editor, state }) => {
				return (
					!editor.isActive('image') &&
					!editor.isActive('code') &&
					!editor.isActive('dots') &&
					!editor.isActive('codeBlock') &&
					!state.selection.empty
				)
			}}
			editor={editor}>
			<BubbleMenuButton
				editor={editor}
				onClick={() => editor.chain().focus().toggleBold().run()}
				nodesOrMarkName="bold"
				icon={FaBold}
			/>
			<BubbleMenuButton
				editor={editor}
				onClick={() => editor.chain().focus().toggleItalic().run()}
				nodesOrMarkName="italic"
				icon={FaItalic}
			/>
			<BubbleMenuButton
				editor={editor}
				onClick={() => editor.chain().focus().toggleUnderline().run()}
				nodesOrMarkName="underline"
				icon={FaUnderline}
			/>
			<BubbleMenuButton
				editor={editor}
				onClick={() => editor.chain().focus().toggleStrike().run()}
				nodesOrMarkName="strike"
				icon={FaStrikethrough}
			/>
			<BubbleMenuButton
				editor={editor}
				onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
				nodesOrMarkName="heading"
				icon={FaHeading}
			/>
			<BubbleMenuButton
				editor={editor}
				onClick={() => editor.chain().focus().toggleBulletList().run()}
				nodesOrMarkName="bulletList"
				icon={FaListUl}
			/>
			<BubbleMenuButton
				editor={editor}
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
				nodesOrMarkName="orderedList"
				icon={FaListOl}
			/>
			<BubbleMenuButton
				editor={editor}
				onClick={() => setEnteredLink()}
				nodesOrMarkName="link"
				icon={FaLink}
				clickable={!editor.isActive('heading')}
			/>
		</BubbleMenu>
	)
}

export default TextFormatingBubbleMenu
