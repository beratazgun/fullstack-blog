'use client'
import Image from 'next/image'
import React from 'react'
import BLogo from '@src/public/big_logo.png'
import { FieldValues, useForm } from 'react-hook-form'
import Input from '@src/components/Input'
import { Button } from '@nextui-org/react'
import resetPasswordRegisterOption from './resetPasswordRegisterOption'
import { useMutation } from '@tanstack/react-query'
import { NetworkManager } from '@src/core/libs/NetworkManager'
import { Bubble } from '@src/core/libs/Bubble'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'

interface Props {
	params: {
		resetToken: string
	}
}

interface ResetPasswordBodyInterface {
	newPassword: string
	newPasswordConfirmation: string
}

interface ResetPasswordResponseInterface {
	message: string
	isSuccess: boolean
	statusCode: number
	status: string
	validationErrors?: {
		newPassword: string
		newPasswordConfirmation: string
	}
}

export default function Page({ params }: Props) {
	const router = useRouter()
	const { mutate } = useMutation({
		mutationKey: ['resetPassword'],
		mutationFn: async () => {
			const res = await NetworkManager.post<
				ResetPasswordBodyInterface,
				ResetPasswordResponseInterface
			>({
				endpoint: `/api/v1/user/auth/reset-password/${params.resetToken}`,
				body: {
					newPassword: getValues('newPassword'),
					newPasswordConfirmation: getValues('newPasswordConfirmation'),
				},
			})

			return res.data
		},
		onSuccess: (data) => {
			if (data.isSuccess) {
				toast.dismiss()
				Bubble.success(data.message)
				router.push('/auth/signin')
			}
		},
		onError: (error: AxiosError<ResetPasswordResponseInterface>) => {
			toast.dismiss()
			if (error.response?.data.statusCode === 401) {
				Bubble.error(error.response.data.message)
				router.push('/auth/signin')
			}
			if (error.response?.data.validationErrors) {
				const { validationErrors } = error.response.data
				if (validationErrors.newPassword) {
					Bubble.error(validationErrors.newPassword)
				} else if (validationErrors.newPasswordConfirmation) {
					Bubble.error(validationErrors.newPasswordConfirmation)
				}
			}
		},
		onMutate: () => {
			Bubble.loading('')
		},
	})

	const {
		register,
		getValues,
		formState: { errors, isDirty },
	} = useForm<FieldValues>({
		defaultValues: {
			newPassword: '',
			newPasswordConfirmation: '',
		},
		mode: 'all',
	})

	return (
		<div className=" w-full h-screen flex flex-col justify-center items-center gap-12 ">
			<Image src={BLogo} priority height={100} width={400} alt="logo" />
			<div className="bg-mediumBlack min-w-[32rem] max-w-[32rem] min-h-[24rem] rounded-lg border-lightBlack border-[2px] text-center px-4 py-6">
				<h1 className="text-white text-2xl">Enter your new password</h1>
				<p className="text-slate-100 py-6">
					Your password should include at least 8 characters, 1 uppercase
					letter, 1 lowercase letter, 1 number, and 1 special character.
				</p>
				<div className="flex flex-col gap-4">
					<Input
						id="newPassword"
						type="password"
						label="New Password"
						register={register}
						registerOptions={resetPasswordRegisterOption.newPassword}
						errors={errors}
					/>
					<Input
						id="newPasswordConfirmation"
						type="password"
						label="New Password Confirmation"
						register={register}
						registerOptions={
							resetPasswordRegisterOption.newPasswordConfirmation
						}
						errors={errors}
					/>
					<Button
						color="primary"
						onClick={() => {
							mutate()
						}}
						className="w-full disabled:opacity-50"
						type="submit"
						disabled={Object.keys(errors).length > 0 || !isDirty}>
						Reset Password
					</Button>
				</div>
			</div>
		</div>
	)
}
