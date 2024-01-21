'use client'
import { Card, CardBody } from '@nextui-org/react'
import React from 'react'
import UserInformationContent from './UserInformationContent'
import SecurityContent from './SecurityContent'
import { IUser } from '@src/core/interface/IUser'

interface ProfileProps {
	user: IUser
}

function Profile({ user }: ProfileProps) {
	return (
		<Card className="w-full">
			<CardBody className="grid grid-cols-[1.5fr_10px_1fr] gap-8 py-8 max-lg:grid-cols-1">
				<UserInformationContent user={user as IUser} />
				<div className="h-full w-1 border-r-[1px] border-white border-opacity-50 max-lg:hidden"></div>
				<SecurityContent />
			</CardBody>
		</Card>
	)
}

export default Profile
