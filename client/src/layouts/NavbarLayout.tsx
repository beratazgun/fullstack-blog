import Navbar from '@src/components/Navbar'
import React from 'react'

interface NavbarLayoutProps {
	children: React.ReactNode
}

async function NavbarLayout({ children }: NavbarLayoutProps) {
	return (
		<div className="w-full">
			<Navbar />
			{children}
		</div>
	)
}

export default NavbarLayout
