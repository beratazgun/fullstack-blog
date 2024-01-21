'use client'
import React, { useEffect, useState } from 'react'
import SidebarButton from './SidebarButton'
import { PiIdentificationCardFill } from 'react-icons/pi'
import { IoDocumentText } from 'react-icons/io5'
import { FaClipboardList } from 'react-icons/fa6'
import { RiMenu5Line } from 'react-icons/ri'
import { motion } from 'framer-motion'
import BLogo from '@src/public/big_logo.png'
import Image from 'next/image'
import useWindowDimensions from '@src/hooks/useWindowDimension'
import Link from 'next/link'

function AccountSidebar() {
	const [isMenuOpen, setIsMenuOpen] = useState(true)
	const windowDimensions = useWindowDimensions()

	useEffect(() => {
		if (windowDimensions.width && windowDimensions.width <= 1000) {
			setIsMenuOpen(false)
		} else setIsMenuOpen(true)
	}, [windowDimensions.width])

	return (
		<motion.div
			className={`items-center h-screen border-r-[0.1px] pt-4 border-white border-opacity-30 px-4 max-w-[18rem] ${
				isMenuOpen && windowDimensions.width && windowDimensions.width <= 768
					? 'fixed bg-darkBlack z-50'
					: ''
			}`}
			initial={{
				transform: `translateX(${-10}rem)`,
			}}
			animate={{
				transform: `translateX(${0}rem)`,
			}}>
			<div
				className={`flex flex-row ${
					isMenuOpen ? 'justify-between' : ' justify-center'
				}`}>
				<Link href="/">
					<Image
						src={BLogo}
						width={140}
						height={40}
						alt="Logo"
						className={`${isMenuOpen ? 'block' : 'hidden duration-500'}`}
					/>
				</Link>
				<button onClick={() => setIsMenuOpen(!isMenuOpen)}>
					<RiMenu5Line className="text-2xl text-white" />
				</button>
			</div>
			<div className="flex flex-col justify-start items-center pt-8 gap-2">
				<SidebarButton
					label="Profile"
					href="account/profile"
					icon={PiIdentificationCardFill}
					isMenuOpen={isMenuOpen}
				/>
				<SidebarButton
					label="Reading list"
					href="account/reading-list"
					icon={FaClipboardList}
					isMenuOpen={isMenuOpen}
				/>
				<SidebarButton
					label="My Blogs"
					href="account/my-blogs"
					icon={IoDocumentText}
					isMenuOpen={isMenuOpen}
				/>
			</div>
		</motion.div>
	)
}

export default AccountSidebar
