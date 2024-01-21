'use client'
import { Textarea, useDisclosure } from '@nextui-org/react'
import React from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { omitBy } from 'lodash'
import { FaGithub } from 'react-icons/fa'
import { FaInstagram } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { PiYoutubeLogoFill } from 'react-icons/pi'
import { FaFacebook } from 'react-icons/fa'
import { BsBrowserChrome } from 'react-icons/bs'
import UserInformationRegisterOption from './UserInformationRegisterOption'
import { Bubble } from '@src/core/libs/Bubble'
import UpdateProfileButton from './Modals/UpdateProfileModal'
import Input, { inputOverrideStyle } from '@src/components/Input'
import useVerifyEmail from '@src/hooks/useVerifyEmail'
import { IUser } from '@src/core/interface/IUser'
import { AxiosError } from 'axios'
import { NetworkManager } from '@src/core/libs/NetworkManager'
import { IBaseResponse } from '@src/core/interface/IBaseResponse'

export interface IUpdateProfileResponse extends IBaseResponse {
	validationErrors?: IUpdateProfileBody
}

interface IUpdateProfileBody {
	firstName: string
	lastName: string
	userName: string
	email: string
	bio: string
	githubLink: string
	instagramLink: string
	twitterLink: string
	youtubeLink: string
	facebookLink: string
	websiteLink: string
}

const fields = [
	{
		label: 'First Name',
		value: 'firstName',
		register: UserInformationRegisterOption.firstName,
	},
	{
		label: 'Last Name',
		value: 'lastName',
		register: UserInformationRegisterOption.lastName,
	},
	{
		label: 'Email',
		value: 'email',
		register: UserInformationRegisterOption.email,
	},
	{
		label: 'Username',
		value: 'userName',
		register: UserInformationRegisterOption.userName,
	},
	{
		label: 'Github',
		value: 'githubLink',
		icon: FaGithub,
		register: UserInformationRegisterOption.githubLink,
	},
	{
		label: 'Instagram',
		value: 'instagramLink',
		icon: FaInstagram,
		register: UserInformationRegisterOption.instagramLink,
	},
	{
		label: 'Twitter',
		value: 'twitterLink',
		icon: FaXTwitter,
		register: UserInformationRegisterOption.twitterLink,
	},
	{
		label: 'Youtube',
		value: 'youtubeLink',
		icon: PiYoutubeLogoFill,
		register: UserInformationRegisterOption.youtubeLink,
	},
	{
		label: 'Facebook',
		value: 'facebookLink',
		icon: FaFacebook,
		register: UserInformationRegisterOption.facebookLink,
	},
	{
		label: 'Website',
		value: 'websiteLink',
		icon: BsBrowserChrome,
		register: UserInformationRegisterOption.websiteLink,
	},
]

interface UserInformationContentProps {
	user: IUser
}

function UserInformationContent({ user }: UserInformationContentProps) {
	const { setVerifyEmailData } = useVerifyEmail()
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
	const router = useRouter()
	const {
		register,
		getValues,
		getFieldState,
		reset,
		formState: { errors, isDirty },
	} = useForm<FieldValues>({
		mode: 'onTouched',
		defaultValues: {
			firstName: user.firstName,
			lastName: user.lastName,
			userName: user.userName,
			email: user.email,
			bio: user.bio,
			githubLink: user.githubLink,
			instagramLink: user.instagramLink,
			twitterLink: user.twitterLink,
			youtubeLink: user.youtubeLink,
			facebookLink: user.facebookLink,
			websiteLink: user.websiteLink,
		},
	})

	const { mutate } = useMutation({
		mutationKey: ['UpdateUserBio'],
		mutationFn: async () => {
			const res = await NetworkManager.post<
				IUpdateProfileBody,
				IUpdateProfileResponse
			>({
				endpoint: '/api/v1/user/account/update-profile',
				addBearer: true,
				body: {
					...omitBy(
						getValues(),
						(value) => value === null || value === undefined
					),
				},
			})

			return res.data
		},
		onSuccess: (data) => {
			if (!getFieldState('email').isDirty) {
				reset()
				Bubble.success(data.message)
				router.refresh()
			}
		},
		onError: (err: AxiosError<IUpdateProfileResponse>) => {
			if (err.response) {
				Bubble.error(err.response.data.message)
			}
		},
	})

	const handleOnPress = () => {
		if (getFieldState('email').isDirty) {
			onOpen()
			setVerifyEmailData({
				email: getValues('email'),
				verifyEmailToken: '',
			})
		}
	}

	return (
		<div className="text-white w-full">
			<div className="flex flex-col gap-y-4">
				<div className="grid grid-cols-2 grid-rows-3 gap-x-8 gap-y-4 max-md:grid-cols-1 max-md:grid-rows-6 ">
					{fields.map((field) => (
						<Input
							id={field.value}
							key={field.value}
							type="text"
							label={field.label}
							register={register}
							defaultValue={user[field.value as keyof typeof user] as string}
							icon={field.icon ? field.icon : null}
							registerOptions={field.register}
							errors={errors}
						/>
					))}
				</div>
				<Textarea
					{...register('bio')}
					defaultValue={user.bio}
					label="Bio"
					placeholder="Enter your Bio"
					className="w-full col-span-2 dark bg-mediumBlack border-[1px] border-lightBlack border-opacity-40 rounded-lg text-white"
					classNames={inputOverrideStyle}
				/>
			</div>
			<UpdateProfileButton
				handleClick={() => {
					if (isDirty) {
						mutate()
					}
				}}
				onClose={() => onClose()}
				handleOnPress={() => handleOnPress()}
				isButtonDisabled={Object.keys(errors).length > 0 || !isDirty}
				isOpen={isOpen}
				onOpenChange={onOpenChange}
			/>
		</div>
	)
}

export default UserInformationContent
