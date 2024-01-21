import type { Metadata } from 'next'
import { Karla } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import ReactQueryProvider from '@src/providers/ReactQueryProvider'
import { NextUiProvider } from '@src/providers/NextUiProvider'
import '@src/scss/main.scss'

const karla = Karla({
	weight: ['300', '400', '500', '600', '700', '800'],
	subsets: ['latin'],
	style: 'normal',
})

export const metadata: Metadata = {
	title: 'Mine Blog',
	description: 'A blog about me',
}

interface RootLayoutProps {
	children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en">
			<body className={karla.className}>
				<ReactQueryProvider>
					<NextUiProvider>
						{children}
						<Toaster />
					</NextUiProvider>
				</ReactQueryProvider>
			</body>
		</html>
	)
}
