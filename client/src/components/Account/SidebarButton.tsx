import React from 'react'
import { IconType } from '@react-icons/all-files'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import classNames from 'classnames'

interface SidebarButtonProps {
	label: string
	href: string
	icon: IconType
	isMenuOpen: boolean
}

function SidebarButton({
	label,
	href,
	icon: Icon,
	isMenuOpen,
}: SidebarButtonProps) {
	const pathName = usePathname()
	const isCurrentPath =
		pathName === `/${href}` || pathName.includes(`/${href}/`)

	const currentPathStyle = classNames({
		'border-opacity-30 bg-lightBlack/80': isCurrentPath,
	})

	return (
		<Link
			href={`/${href}`}
			className={` cursor-pointer px-2 py-2 rounded-lg border-[0.8px] hover:border-opacity-30 hover:border-opacity-1 border-lightBlack hover:bg-lightBlack/70 hover:border-black  ${currentPathStyle} ${
				isMenuOpen
					? 'grid grid-cols-[40px,minmax(140px,1fr)] w-full justify-center items-center'
					: ''
			}`}>
			<Icon className="fill-white" size={20} />
			<p
				className={`text-white text-sm leading-wider ${
					isMenuOpen ? 'block' : 'hidden'
				}`}>
				{label}
			</p>
		</Link>
	)
}

export default SidebarButton
