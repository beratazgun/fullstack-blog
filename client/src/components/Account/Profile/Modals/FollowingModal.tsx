'use client'
import React, { useEffect } from 'react'
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	useDisclosure,
	Avatar,
	AvatarIcon,
} from '@nextui-org/react'
import { FieldValues, useForm } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import UnFollowButton from '@src/components/UnfollowButton'
import { IUser } from '@src/core/interface/IUser'
import { IBaseResponse } from '@src/core/interface/IBaseResponse'
import Input from '@src/components/Input'
import { getFollowersOrFollowingsAction } from '@src/actions/getFollowersOrFollowings.action'

interface FollowingModalProps {
	user: IUser
}

interface IFollowing {
	firstName: string
	lastName: string
	userName: string
	userCode: string
	profileImage: string
}

interface IGetFollowingResponsePayload {
	length: number
	docs: IFollowing[]
}

interface IGetFollowingResponse extends IBaseResponse {
	payload: IGetFollowingResponsePayload
}

interface FollowingModalProps {
	user: IUser
}

function FollowingModal({ user }: FollowingModalProps) {
	const [filteredData, setFilteredData] = React.useState<IFollowing[]>([])
	const { isOpen, onOpen, onOpenChange } = useDisclosure()

	const {
		register,
		watch,
		formState: { errors },
	} = useForm<FieldValues>({
		mode: 'all',
		defaultValues: {
			search: '',
		},
	})

	const { data } = useQuery({
		queryKey: ['getFollowings'],
		queryFn: async () => {
			const res = await getFollowersOrFollowingsAction<IGetFollowingResponse>(
				user.userCode,
				'followings'
			)

			setFilteredData(res.payload.docs)

			return res
		},
	})

	useEffect(() => {
		const search = watch('search')

		if (search === '') {
			setFilteredData(data?.payload.docs as IFollowing[])
			return
		}

		const filteredData = data?.payload.docs.filter((item) => {
			return item.userName.toLowerCase().startsWith(search.toLowerCase())
		})

		setFilteredData(filteredData as IFollowing[])
	}, [watch('search')])

	const handleUnFollow = (userCode: string) => {
		setFilteredData((prev) => prev.filter((item) => item.userCode !== userCode))
	}

	const renderFollowings =
		filteredData &&
		filteredData.map((following: IFollowing) => {
			return (
				<div className="flex flex-row justify-between items-center gap-4 ">
					<Link
						href={`/user/${following.userName}`}
						className="flex flex-row justify-start items-center gap-4 ">
						<Avatar
							icon={<AvatarIcon />}
							color="primary"
							radius="full"
							className="h-10 w-10 cursor-pointer"
							src={following.profileImage}
						/>
						<div className="text-white text-xl">
							<p className=" text-xl">
								{following.firstName} {following.lastName}
							</p>
							<p className="text-sm text-white">{following.userName}</p>
						</div>
					</Link>
					<div className="flex flex-row justify-start items-center gap-4">
						<UnFollowButton
							userCode={following.userCode}
							handleUnFollow={() => handleUnFollow(following.userCode)}
						/>
					</div>
				</div>
			)
		})

	return (
		<>
			<a onClick={onOpen} className="text-white max-sm:text-sm cursor-pointer">
				{user.followingCount} Followings
			</a>
			<Modal
				backdrop="blur"
				size="md"
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				className="bg-darkBlack text-white border-[1px] rounded-lg border-lightBlack  min-h-[32rem] ">
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Followings
							</ModalHeader>
							<ModalBody>
								<Input
									id="search"
									type="text"
									label="Search"
									placeholder="Search"
									register={register}
									errors={errors}
								/>
								<div className="flex flex-col py-2 gap-4">
									{filteredData.length > 0 ? renderFollowings : 'No followings'}
								</div>
							</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	)
}

export default FollowingModal
