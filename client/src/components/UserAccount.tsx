'use client'
import React from 'react'
import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Avatar,
} from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { AxiosError } from 'axios'
import { Bubble } from '@src/core/libs/Bubble'
import { toast } from 'react-hot-toast'
import { VscFeedback } from 'react-icons/vsc'
import { HiOutlineLogout } from 'react-icons/hi'
import { useMutation } from '@tanstack/react-query'
import { AvatarIcon } from '@nextui-org/react'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { HiOutlineClipboardList } from 'react-icons/hi'
import { PiIdentificationCardLight } from 'react-icons/pi'
import { IUser } from '@src/core/interface/IUser'

import { NetworkManager } from '@src/core/libs/NetworkManager'
import { IBaseResponse } from '@src/core/interface/IBaseResponse'

interface UserAccountProps {
	user: IUser
}

export interface ISignoutResponse extends IBaseResponse {}

export default function UserAccount({ user }: UserAccountProps) {
	const { refresh, push } = useRouter()

	const { mutate } = useMutation({
		mutationFn: async () => {
			const res = await NetworkManager.post<any, ISignoutResponse>({
				endpoint: '/api/v1/user/account/signout',
				addBearer: true,
			})

			return res.data
		},
		onSuccess: (data) => {
			if (data.isSuccess) {
				toast.dismiss()
				refresh()
				window.location.href = '/'
			}
		},
		onError: (error: AxiosError<ISignoutResponse>) => {
			toast.dismiss()
			if (error.response) {
				Bubble.error(error.response.data.message)
			}
		},
	})

	return (
		<Dropdown
			placement="bottom"
			backdrop="blur"
			classNames={{
				base: 'before:bg-primary',
			}}
			className="bg-black text-white h-full">
			<DropdownTrigger>
				<div className="flex flex-row gap-2 justify-center items-center cursor-pointer h-full">
					<Avatar
						icon={<AvatarIcon />}
						color="primary"
						onClick={() => {}}
						isBordered
						radius="full"
						className="h-8 w-8 cursor-pointer"
						src={user.profileImage === '' ? '' : user.profileImage}
					/>
					<p className="block text-white text-sm max-sm:hidden">
						{user.firstName} {user.lastName}
					</p>
				</div>
			</DropdownTrigger>
			<DropdownMenu
				aria-label="User Actions"
				variant="flat"
				itemClasses={{
					base: [
						'rounded-md',
						'transition-opacity',
						'data-[hover=true]:text-white',
						'data-[hover=true]:bg-lightBlack',
					],
				}}
				classNames={{
					base: ' rounded-lg',
				}}>
				<DropdownItem
					onClick={() => push('/account/profile')}
					key="profile"
					className="text-white"
					startContent={
						<PiIdentificationCardLight className="text-xl text-white" />
					}>
					Profile
				</DropdownItem>
				<DropdownItem
					key="readingList"
					className="text-white hover:text-white focus:text-white"
					startContent={
						<HiOutlineClipboardList className="text-xl text-white" />
					}>
					<a href="/account/reading-list">Reading List</a>
				</DropdownItem>
				<DropdownItem
					onClick={() => push('/account/my-blogs')}
					key="myBlogs"
					className="text-white"
					startContent={
						<IoDocumentTextOutline className="text-xl text-white" />
					}>
					<a href="/account/my-blogs">My Blogs</a>
				</DropdownItem>
				<DropdownItem
					key="help_and_feedback"
					className="text-white"
					startContent={<VscFeedback className="text-xl text-white" />}>
					Help & Feedback
				</DropdownItem>
				<DropdownItem
					key="signout"
					className="text-red-500 bg-red-500/20 hover:bg-red-500/30 focus:bg-red-500/30"
					classNames={{
						base: 'text-red-500 bg-red-500/20 hover:bg-red-500/30 focus:bg-red-500/30',
					}}
					startContent={<HiOutlineLogout className="text-xl" />}
					onClick={() => mutate()}>
					Sign Out
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	)
}
