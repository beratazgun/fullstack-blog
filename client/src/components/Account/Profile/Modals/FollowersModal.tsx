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
import { IUser } from '@src/core/interface/IUser'
import Input from '@src/components/Input'
import { getFollowersOrFollowingsAction } from '@src/actions/getFollowersOrFollowings.action'
import { IBaseResponse } from '@src/core/interface/IBaseResponse'

interface FollowersModalProps {
	user: IUser
}

interface IFollowers {
	firstName: string
	lastName: string
	userName: string
	userCode: string
	profileImage: string
}

interface IGetFollowersResponsePayload {
	length: number
	docs: IFollowers[]
}

export interface IGetFollowersResponse extends IBaseResponse {
	payload: IGetFollowersResponsePayload
}

function FollowersModal({ user }: FollowersModalProps) {
	const [filteredData, setFilteredData] = React.useState<IFollowers[]>([])
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
		queryKey: ['getFollowers'],
		queryFn: async () => {
			const res = await getFollowersOrFollowingsAction<IGetFollowersResponse>(
				user.userCode,
				'followers'
			)
			setFilteredData(res.payload.docs)

			console.log(res)

			return res
		},
	})

	useEffect(() => {
		const search = watch('search')

		if (search === '') {
			setFilteredData(data?.payload.docs as IFollowers[])
			return
		}

		const filteredData =
			search &&
			data?.payload.docs.filter((item) => {
				return item.userName.toLowerCase().startsWith(search.toLowerCase())
			})

		setFilteredData(filteredData as IFollowers[])
	}, [watch('search')])

	const renderFollowers =
		filteredData &&
		filteredData.map((follower: IFollowers) => {
			return (
				<Link
					href={`/user/${follower.userName}`}
					className="flex flex-row justify-start items-center gap-4 ">
					<Avatar
						icon={<AvatarIcon />}
						color="primary"
						radius="full"
						className="h-10 w-10 cursor-pointer"
						src={follower.profileImage}
					/>
					<div className="text-white text-xl">
						<p className=" text-xl">
							{follower.firstName} {follower.lastName}
						</p>
						<p className="text-sm text-white">{follower.userName}</p>
					</div>
				</Link>
			)
		})

	return (
		<>
			<a onClick={onOpen} className="text-white max-sm:text-sm cursor-pointer">
				{user.followersCount} Followers
			</a>
			<Modal
				backdrop="blur"
				size="md"
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				className="bg-darkBlack text-white border-[1px] rounded-lg border-lightBlack min-h-[32rem] ">
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Followers
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
								<div className="flex flex-col py-2">
									{filteredData.length > 0 ? renderFollowers : 'No followers'}
								</div>
							</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	)
}

export default FollowersModal
