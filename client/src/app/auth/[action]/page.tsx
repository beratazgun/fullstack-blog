import React from 'react'
import Image from 'next/image'
import BLogo from '@src/public/big_logo.png'
import Auth from '@src/components/Auth/Auth'

interface AuthPageProps {
	params: {
		action: string
	}
}

export default function AuthPage({ params }: AuthPageProps) {
	return (
		<div className="flex flex-row justify-between items-center h-screen w-full max-lg:flex-col max-lg:justify-center max-lg:gap-8 max-sm:px-4 ">
			<div className="w-full h-16 flex items-center justify-center">
				<Image alt="logo" src={BLogo} width={400} height={300} priority />
			</div>
			<Auth action={params.action} />
		</div>
	)
}
