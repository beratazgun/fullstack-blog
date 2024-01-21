import { Button } from '@nextui-org/react'
import { redirect, useRouter } from 'next/navigation'
import React from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import Input from '@src/components/Input'
import signupRegisterOption from './signupRegisterOption'
import { useMutation } from '@tanstack/react-query'
import { NetworkManager } from '@src/core/libs/NetworkManager'
import { AxiosError } from 'axios'
import { Bubble } from '@src/core/libs/Bubble'
import toast from 'react-hot-toast'
import { capitalize } from 'lodash'
import { IBaseResponse } from '@src/core/interface/IBaseResponse'

interface ISignupBody {
	firstName: string
	lastName: string
	userName: string
	email: string
	password: string
	passwordConfirmation: string
}

interface ISignupResponse extends IBaseResponse {
	validationErrors?: {
		email: string
		password: string
	}
}

export default function Signup() {
	const { push } = useRouter()
	const {
		register,
		getValues,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			signupFirstName: 'testjohn',
			signupLastName: 'testdoe',
			signupUserName: 'testjohndoe',
			signupEmail: 'testjohndoe@gmail.com',
			signupPassword: 'Usrw123!_',
			signupPasswordConfirmation: 'Usrw123!_',
		},
		mode: 'all',
	})

	const { mutate } = useMutation({
		mutationFn: async () => {
			const res = await NetworkManager.post<ISignupBody, ISignupResponse>({
				endpoint: '/api/v1/user/auth/signup',
				body: {
					firstName: getValues('signupFirstName'),
					lastName: getValues('signupLastName'),
					userName: getValues('signupUserName'),
					email: getValues('signupEmail'),
					password: getValues('signupPassword'),
					passwordConfirmation: getValues('signupPasswordConfirmation'),
				},
			})

			return res.data
		},
		onError: (error: AxiosError<any>) => {
			toast.dismiss()
			if (error.response) {
				const validationErrors = error.response.data.validationErrors

				if (validationErrors) {
					for (const key in validationErrors) {
						Bubble.error(capitalize(validationErrors[key]))
					}
				} else {
					Bubble.error(error.response.data.message)
				}
			}
		},
		onSuccess: (data) => {
			toast.dismiss()
			if (data.isSuccess) {
				Bubble.success(data.message)
				push('/auth/signin')
			}
		},
		onMutate: () => {
			Bubble.loading('Signing up...')
		},
	})

	return (
		<form className="flex flex-col gap-4 ">
			<Input
				id="signupFirstName"
				type="text"
				label="First Name"
				placeholder="John"
				register={register}
				registerOptions={signupRegisterOption.signupFirstName}
				errors={errors}
			/>
			<Input
				id="signupLastName"
				type="text"
				label="Last Name"
				placeholder="Doe"
				register={register}
				registerOptions={signupRegisterOption.signupLastName}
				errors={errors}
			/>
			<Input
				id="signupUserName"
				type="text"
				label="Username"
				placeholder="johndoe123"
				register={register}
				registerOptions={signupRegisterOption.signupUserName}
				errors={errors}
			/>
			<Input
				id="signupEmail"
				type="email"
				label="Email"
				placeholder="example@gmail.com"
				register={register}
				registerOptions={signupRegisterOption.signupEmail}
				errors={errors}
			/>
			<Input
				id="signupPassword"
				type="password"
				label="Password"
				placeholder="********"
				register={register}
				registerOptions={signupRegisterOption.signupPassword}
				errors={errors}
			/>
			<Input
				id="signupPasswordConfirmation"
				type="password"
				label="Password Confirmation"
				placeholder="********"
				register={register}
				registerOptions={signupRegisterOption.signupPasswordConfirmation}
				errors={errors}
			/>
			<div className="flex gap-2 justify-end">
				<Button fullWidth color="primary" onClick={() => mutate()}>
					Sign up
				</Button>
			</div>
		</form>
	)
}
