import { Bubble } from '@src/core/libs/Bubble'
import React from 'react'
import { IoCopyOutline } from 'react-icons/io5'
import { usePathname } from 'next/navigation'

const CopyBlogLinkButton = () => {
	const pathName = usePathname()

	return (
		<button
			className="text-white  p-2 rounded-full hover:bg-lightBlack duration-300"
			onClick={() => {
				navigator.clipboard.writeText(`${window.location.origin}${pathName}`)
				Bubble.info('Link copied to clipboard')
			}}>
			<IoCopyOutline className="text-2xl" />
		</button>
	)
}

export default CopyBlogLinkButton
