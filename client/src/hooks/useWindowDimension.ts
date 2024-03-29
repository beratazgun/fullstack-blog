import { useEffect, useState } from 'react'

const hasWindow = typeof window !== 'undefined'

function getWindowDimensions() {
	const width = hasWindow ? window.innerWidth : null
	const height = hasWindow ? window.innerHeight : null
	return {
		width,
		height,
	}
}

export default function useWindowDimensions() {
	const [windowDimensions, setWindowDimensions] = useState(
		getWindowDimensions()
	)

	useEffect(() => {
		if (!hasWindow) return

		function handleResize() {
			setWindowDimensions(getWindowDimensions())
		}

		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	return windowDimensions
}
