'use client'
import { Button } from '@nextui-org/react'
import React from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import Input from '@src/components/Input'
import signinRegisterOption from './signinRegisterOption'
import { IoMail } from 'react-icons/io5'
import { HiLockClosed } from 'react-icons/hi'
import { useMutation } from '@tanstack/react-query'
import { NetworkManager } from '@src/core/libs/NetworkManager'
import { AxiosError } from 'axios'
import { Bubble } from '@src/core/libs/Bubble'
import toast from 'react-hot-toast'
import { IBaseResponse } from '@src/core/interface/IBaseResponse'
import ForgotPassword from './ForgotPassword'

interface ISigninBody {
	email: string
	password: string
}

interface ISigninResponse extends IBaseResponse {
	accessToken: {
		jwt: string
		maxAge: number
	}
	validationErrors?: {
		email: string
		password: string
	}
}

export default function Signin() {
	const {
		register,
		getValues,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			signinEmail: 'johndoe@gmail.com',
			signinPassword: 'Usrw123!_',
		},
		mode: 'all',
	})

	const { mutate } = useMutation({
		mutationFn: async () => {
			const res = await NetworkManager.post<ISigninBody, ISigninResponse>({
				endpoint: '/api/v1/user/auth/signin',
				body: {
					email: getValues('signinEmail'),
					password: getValues('signinPassword'),
				},
			})

			return res.data
		},
		onError: (error: AxiosError<ISigninResponse>) => {
			toast.dismiss()
			if (error.response) {
				Bubble.error(error.response.data.message)
			}
		},
		onSuccess: (data) => {
			if (data.isSuccess === true) {
				toast.dismiss()
				window.location.href = '/'
			}
		},
		onMutate: () => {
			Bubble.loading('Signing in...')
		},
	})

	return (
		<form className="flex flex-col gap-4">
			<Input
				id="signinEmail"
				type="text"
				label="Email Address"
				placeholder="you@example.com"
				register={register}
				registerOptions={signinRegisterOption.signinEmail}
				icon={IoMail}
				errors={errors}
			/>
			<Input
				id="signinPassword"
				type="password"
				label="Password"
				placeholder="Password"
				register={register}
				registerOptions={signinRegisterOption.signinPassword}
				icon={HiLockClosed}
				errors={errors}
			/>
			<ForgotPassword />
			<div className="flex gap-2 justify-end">
				<Button
					fullWidth
					color="primary"
					onClick={() => mutate()}
					disabled={Object.keys(errors).length > 0}>
					signin
				</Button>
			</div>
		</form>
	)
}
