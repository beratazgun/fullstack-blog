import { Editor } from '@tiptap/react'
import React from 'react'
import { IconType } from 'react-icons/lib'

interface CodeBlockButtonProps {
	editor: Editor
	icon: IconType
}

function CodeBlockButton({ editor, icon: Icon }: CodeBlockButtonProps) {
	return (
		<div className="relative hover:border-primary flex flex-row justify-center items-center opacity-70 hover:opacity-100">
			<button onClick={() => editor.chain().focus().setCodeBlock().run()}>
				{Icon && <Icon />}
			</button>
		</div>
	)
}

export default CodeBlockButton
