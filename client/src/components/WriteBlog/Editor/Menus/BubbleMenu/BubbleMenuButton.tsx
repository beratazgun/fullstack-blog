'use client'
import { Editor } from '@tiptap/react'
import React from 'react'
import { IconType } from 'react-icons/lib'

interface BubbleMenuButtonProps {
	editor: Editor
	onClick: () => void
	nodesOrMarkName: string
	icon?: IconType
	clickable?: boolean
}

function BubbleMenuButton({
	editor,
	onClick,
	nodesOrMarkName,
	icon: Icon,
	clickable = true,
}: BubbleMenuButtonProps) {
	const handleClick = () => {
		if (clickable) {
			onClick()
		}
	}

	const isActive = editor.isActive(nodesOrMarkName) && clickable
	const opacity = isActive ? 'opacity-100' : 'opacity-50'
	const cursorStyles = clickable
		? 'cursor-pointer'
		: 'opacity-20 cursor-default hover:opacity-20'

	return (
		<button
			onClick={handleClick}
			className={`text-white text-md hover:opacity-100 hover:duration-200 ${opacity} ${cursorStyles}`}>
			{Icon && <Icon />}
		</button>
	)
}

export default BubbleMenuButton
