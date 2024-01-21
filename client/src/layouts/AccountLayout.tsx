import AccountNavbar from '@src/components/Account/AccountNavbar'
import AccountSidebar from '@src/components/Account/AccountSidebar'
import React from 'react'

interface AccountLayoutProps {
	children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ children }) => {
	return (
		<div className="overflow-y-hidden h-screen">
			<div className="flex flex-row w-full">
				<AccountSidebar />
				<div className="w-full min-h-[42rem] h-[42rem] overflow-y-auto auto-cols-max">
					<AccountNavbar />
					{children}
				</div>
			</div>
		</div>
	)
}

export default AccountLayout
