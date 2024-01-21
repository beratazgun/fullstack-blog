import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Bold from '@tiptap/extension-bold'
import Underline from '@tiptap/extension-underline'
import Italic from '@tiptap/extension-italic'
import Strike from '@tiptap/extension-strike'
import Code from '@tiptap/extension-code'
import Heading from '@tiptap/extension-heading'
import { common, createLowlight } from 'lowlight'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Gapcursor from '@tiptap/extension-gapcursor'
import History from '@tiptap/extension-history'
import 'tippy.js/dist/svg-arrow.css'
import { EditorOptions } from '@tiptap/react'

const lowlight = createLowlight(common)

const tiptapOptions: Partial<EditorOptions> = {
	autofocus: 'end',
	extensions: [
		Document,
		Text,
		Underline,
		Italic,
		Strike,
		Code,
		ListItem,
		Gapcursor,
		History.configure({
			depth: 100,
			newGroupDelay: 40,
		}),
		CodeBlockLowlight.configure({
			lowlight,
			languageClassPrefix: 'language-',
			HTMLAttributes: {
				class: 'my-12',
			},
		}),
		Bold.configure({
			HTMLAttributes: {
				class: 'font-bold text-white',
			},
		}),
		Heading.configure({
			levels: [1],
			HTMLAttributes: {
				class:
					'text-3xl font-semibold text-white pt-12 pb-2 tracking-wide leading-relaxed font-sohne',
			},
		}),
		Paragraph.configure({
			HTMLAttributes: {
				class:
					'text-gray-100 tracking-wider subpixel-antialiased leading-relaxed text-[18px] mb-2 font-poppins',
			},
		}),
		Link.configure({
			openOnClick: false,
			HTMLAttributes: {
				target: '_blank',
				class:
					'underline cursor-pointer underline-primary hover:text-primary duration-200',
			},
		}),
		BulletList.configure({
			HTMLAttributes: {
				class: 'list-disc text-white ml-12',
			},
		}),
		OrderedList.configure({
			HTMLAttributes: {
				class: 'list-decimal text-white ml-12',
			},
		}),
		Image.configure({
			HTMLAttributes: {
				class:
					'w-full object-contain mb-12 border-1 border-mediumBlack hover:border-primary duration-200 hover:border-2 rounded-md object-center object-cover',
			},
		}),
	],
	editorProps: {
		attributes: {
			class:
				'2xl:prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none outline-none w-full break-words',
		},
	},
}

export default tiptapOptions
