import { Editor, FloatingMenu } from '@tiptap/react'
import React from 'react'
import { FaImages } from 'react-icons/fa'
import UploadImageButton from './FloatingButtons/UploadImageButton'
import { roundArrow } from 'tippy.js'
import CodeBlockButton from './FloatingButtons/CodeBlockButton'
import { FaCode } from 'react-icons/fa'
import 'tippy.js/dist/svg-arrow.css'

interface EditorialToolsFloatingMenuProps {
	editor: Editor
}

function EditorialToolsFloatingMenu({
	editor,
}: EditorialToolsFloatingMenuProps) {
	return (
		<FloatingMenu
			className="flex flex-row gap-4 text-xl text-white bg-black rounded-lg px-3 py-2 border-[1px] border-primary"
			editor={editor}
			tippyOptions={{
				arrow: roundArrow,
				placement: 'right',
				offset: [0, 40],
				theme: 'editorial-tools-tooltip',
			}}>
			<UploadImageButton icon={FaImages} editor={editor} />
			<CodeBlockButton editor={editor} icon={FaCode} />
		</FloatingMenu>
	)
}

export default EditorialToolsFloatingMenu
