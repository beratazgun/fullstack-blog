import { getUserInfoAction } from '@src/actions/getUserInfo.action'
import Profile from '@src/components/Account/Profile/Profile'
import UserAvatar from '@src/components/Account/Profile/UserAvatar'
import { IUser } from '@src/core/interface/IUser'
import AccountLayout from '@src/layouts/AccountLayout'
import React from 'react'

async function ProfilePage() {
	const user = await getUserInfoAction()

	return (
		<AccountLayout>
			<div className="text-white px-4">
				<UserAvatar user={user?.payload as IUser} />
				<Profile user={user?.payload as IUser} />
			</div>
		</AccountLayout>
	)
}

export default ProfilePage
