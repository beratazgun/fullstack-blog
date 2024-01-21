'use client'
import React, { useEffect, useState } from 'react'
import { IoIosArrowRoundUp } from 'react-icons/io'

function ScroolToTopButton() {
	const [isVisible, setIsVisible] = useState(false)

	const handleScroll = () => {
		const scrollY = window.scrollY
		setIsVisible(scrollY > 200)
	}

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		})
	}

	useEffect(() => {
		window.addEventListener('scroll', handleScroll)
		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	return (
		<button
			onClick={scrollToTop}
			className={`fixed bottom-8 right-24 z-50 bg-mediumBlack rounded-full flex justify-center items-center text-white gap-2 px-4 py-2 border-mediumBlack border-[2px] hover:border-primary duration-400 ${
				isVisible ? 'visible' : 'invisible'
			}`}>
			<IoIosArrowRoundUp className="text-2xl" />

			<span>Scroll to top</span>
		</button>
	)
}

export default ScroolToTopButton
