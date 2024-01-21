import React from 'react'
import { Button } from '@nextui-org/react'
import Input from '@src/components/Input'
import UpdatePasswordRegisterOption from './UpdatePasswordRegisterOption'
import { FieldValues, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { Bubble } from '@src/core/libs/Bubble'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { IBaseResponse } from '@src/core/interface/IBaseResponse'
import { NetworkManager } from '@src/core/libs/NetworkManager'

export interface IUpdatePasswordResponse extends IBaseResponse {
	validationErrors?: IUpdatePasswordBody
}

interface IUpdatePasswordBody {
	currentPassword: string
	newPassword: string
	newPasswordConfirmation: string
}

const SecurityContent = () => {
	const router = useRouter()
	const {
		register,
		getValues,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			currentPassword: '',
			newPassword: '',
			newPasswordConfirmation: '',
		},
		mode: 'all',
	})

	const { mutate } = useMutation({
		mutationKey: ['updatePassword'],
		mutationFn: async () => {
			const res = await NetworkManager.post<
				IUpdatePasswordBody,
				IUpdatePasswordResponse
			>({
				endpoint: '/api/v1/user/account/update-password',
				addBearer: true,
				body: {
					currentPassword: getValues().currentPassword,
					newPassword: getValues().newPassword,
					newPasswordConfirmation: getValues().newPasswordConfirmation,
				},
			})

			return res.data
		},
		onSuccess: (data) => {
			Bubble.success(data.message)
			setTimeout(() => {
				toast.dismiss()
			}, 1000)
			router.refresh()
		},
		onError: (err: AxiosError<IUpdatePasswordResponse>) => {
			if (err.response) {
				toast.dismiss()

				if (err.response.data.validationErrors) {
					Object.entries(err.response.data.validationErrors).forEach(
						([key, value]) => {
							Bubble.error(value)
						}
					)
				}

				setTimeout(() => {
					toast.dismiss()
				}, 2000)
			}
		},
		onMutate: () => {
			Bubble.loading('Updating password...')
		},
	})

	const handleClick = () => {
		if (
			Object.keys(errors).length > 0 ||
			Object.values(getValues()).includes('')
		) {
			Bubble.error('Please fill all fields.')
		} else {
			mutate()
		}
	}

	return (
		<div className="text-white">
			<div className="pb-8 text-2xl">Update your password</div>
			<div className="grid grid-cols-1 grid-rows-3 gap-8">
				<Input
					id="currentPassword"
					type="password"
					label="Current Password"
					placeholder="example123"
					register={register}
					registerOptions={UpdatePasswordRegisterOption.currentPassword}
					errors={errors}
				/>
				<Input
					id="newPassword"
					type="password"
					label="New Password"
					placeholder="example123"
					register={register}
					registerOptions={UpdatePasswordRegisterOption.newPassword}
					errors={errors}
				/>
				<Input
					id="newPasswordConfirmation"
					type="password"
					label="New Password Confirmation"
					placeholder="example123"
					register={register}
					registerOptions={UpdatePasswordRegisterOption.newPasswordConfirmation}
					errors={errors}
				/>
				<Button
					onClick={() => handleClick()}
					disabled={
						Object.keys(errors).length > 0 ||
						Object.values(getValues()).includes('')
					}
					color="primary"
					className="w-full disabled:cursor-not-allowed disabled:opacity-50">
					Update Password
				</Button>
			</div>
		</div>
	)
}

export default SecurityContent
