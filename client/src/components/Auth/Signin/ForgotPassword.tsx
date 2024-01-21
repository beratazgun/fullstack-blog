import React from 'react'
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
} from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'
import Input from '@src/components/Input'
import { IoMail } from 'react-icons/io5'
import { FieldValues, useForm } from 'react-hook-form'
import { NetworkManager } from '@src/core/libs/NetworkManager'
import { Bubble } from '@src/core/libs/Bubble'
import toast from 'react-hot-toast'
import { IBaseResponse } from '@src/core/interface/IBaseResponse'

interface ISendForgotPasswordEmailBody {
	email: string
}

interface ISendForgotPasswordEmailResponse extends IBaseResponse {}

export default function ForgotPassword() {
	const { isOpen, onOpen, onOpenChange } = useDisclosure()

	const {
		register,
		getValues,
		formState: { errors, isDirty },
	} = useForm<FieldValues>({
		defaultValues: {
			forgotPasswordEmail: '',
		},
		mode: 'all',
	})

	const sendForgotPasswordEmail = useMutation({
		mutationKey: ['sendForgotPasswordEmail'],
		mutationFn: async () => {
			const res = await NetworkManager.post<
				ISendForgotPasswordEmailBody,
				ISendForgotPasswordEmailResponse
			>({
				endpoint: '/api/v1/user/auth/forgot-password',
				body: {
					email: getValues('forgotPasswordEmail'),
				},
			})

			return res.data
		},
		onSuccess: (data) => {
			if (data.isSuccess) {
				toast.dismiss()
				Bubble.success(data.message, 4000)
			}
		},
		onError: (error) => {
			toast.dismiss()
			Bubble.error(error.message)
		},
		onMutate: () => {
			Bubble.loading('Sending reset link...')
		},
	})

	return (
		<>
			<a onClick={onOpen} className="cursor-pointer hover:text-primary w-fit">
				Forgot Password
			</a>
			<Modal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				className="dark"
				classNames={{
					wrapper: 'flex justify-center items-center',
				}}
				backdrop="blur">
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1"></ModalHeader>
							<ModalBody className="mx-auto">
								<div className="text-center">
									<h1 className="text-white text-2xl">Reset Your Password</h1>
									<p className="text-white pt-2">
										We need your email address so we can send you the password
										reset link.
									</p>
								</div>
								<div className="flex flex-col gap-4 mt-4">
									<Input
										id="forgotPasswordEmail"
										type="text"
										label="Email Address"
										placeholder=""
										register={register}
										registerOptions={{
											required: 'Email is required',
											pattern: {
												value: /\S+@\S+\.\S+/,
												message: 'Please enter a valid email address.',
											},
										}}
										icon={IoMail}
										errors={errors}
									/>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button
									color="primary"
									className="disabled:opacity-50"
									disabled={Object.keys(errors).length > 0 || !isDirty}
									onClick={() => {
										sendForgotPasswordEmail.mutate()
									}}>
									Send Reset Link
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	)
}
