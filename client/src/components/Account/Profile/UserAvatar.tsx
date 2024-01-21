'use client'
import { Avatar, AvatarIcon } from '@nextui-org/react'
import React from 'react'
import FollowersModal from './Modals/FollowersModal'
import FollowingModal from './Modals/FollowingModal'
import { IUser } from '@src/core/interface/IUser'

interface UserAvatarProps {
	user: IUser
}

function UserAvatar({ user }: UserAvatarProps) {
	return (
		<div className="flex flex-col justify-center items-start gap-4 py-8 pl-4">
			<div className="flex flex-row justify-start items-center gap-4">
				<Avatar
					icon={<AvatarIcon />}
					color="primary"
					onClick={() => {}}
					isBordered
					radius="full"
					className="h-16 w-16 cursor-pointer max-sm:h-8 max-sm:w-8"
					src={user !== null ? user.profileImage : ''}
				/>
				<div className="text-white text-[2rem] max-sm:text-md">
					<span>{user.firstName}</span>
					<span> </span>
					<span>{user.lastName}</span>
				</div>
			</div>
			<div className="flex flex-row justify-start items-center gap-4">
				<FollowersModal user={user} />
				<FollowingModal user={user} />
			</div>
		</div>
	)
}

export default UserAvatar
