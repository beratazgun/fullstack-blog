'use client'
import React from 'react'
import { Avatar } from '@nextui-org/react'
import { IUser } from '@src/core/interface/IUser'
import UnFollowButton from './UnfollowButton'
import FollowButton from './FollowButton'

interface UserBlogPageHeaderProps {
	blogOwnerUser: IUser
	signedInUser: IUser | undefined
}

function UserBlogPageHeader({
	blogOwnerUser,
	signedInUser,
}: UserBlogPageHeaderProps) {
	return (
		<div className="py-6 px-8 flex flex-col justify-start items-start w-full gap-4">
			<div className="flex flex-row justify-between items-center w-96">
				<div className="flex flex-row justify-start items-center gap-4 ">
					<Avatar
						src={blogOwnerUser.profileImage}
						size="lg"
						alt="Profile Image"
						color="primary"
					/>
					<div className="flex flex-col justify-start items-start text-white">
						<h1 className="text-xl font-bold ">{blogOwnerUser.userName}</h1>
						<p>{blogOwnerUser?.followersCount} followers</p>
					</div>
				</div>
				{signedInUser?.userName !== blogOwnerUser.userName ? (
					blogOwnerUser.isUserFollowingThisUser ? (
						<UnFollowButton userCode={blogOwnerUser.userCode} />
					) : (
						<FollowButton userCode={blogOwnerUser.userCode} />
					)
				) : null}
			</div>
			<div className="pt-4">
				<p className="text-gray-300">{blogOwnerUser.bio}</p>
			</div>
		</div>
	)
}

export default UserBlogPageHeader
