'use client'
import React, { useEffect } from 'react'
import {
	Modal,
	ModalContent,
	ModalBody,
	ModalFooter,
	Button,
} from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'
import { MdEmail } from 'react-icons/md'
import { FieldValues, useForm } from 'react-hook-form'
import Input from '@src/components/Input'
import { Bubble } from '@src/core/libs/Bubble'
import useVerifyEmail from '@src/hooks/useVerifyEmail'
import { AxiosError } from 'axios'
import ConfirmEmailButton from '../ConfirmEmailButton'
import { NetworkManager } from '@src/core/libs/NetworkManager'
import { IBaseResponse } from '@src/core/interface/IBaseResponse'

interface UpdateProfileModalProps {
	isOpen: boolean
	onOpenChange: () => void
	isButtonDisabled: boolean
	handleClick: () => void
	onClose: () => void
	handleOnPress: () => void
}

interface ISendUpdateEmailResponse extends IBaseResponse {}

function UpdateProfileModal({
	isOpen,
	onOpenChange,
	isButtonDisabled,
	handleClick,
	onClose,
	handleOnPress,
}: UpdateProfileModalProps) {
	const { verifyEmailData, setVerifyEmailData } = useVerifyEmail()
	const [second, setSecond] = React.useState(180)

	const {
		register,
		getValues,
		formState: { errors },
	} = useForm<FieldValues>({
		mode: 'onTouched',
	})

	const { mutate } = useMutation({
		mutationKey: ['sendEmailForUpdate'],
		mutationFn: async () => {
			const res = await NetworkManager.post<any, ISendUpdateEmailResponse>({
				endpoint: 'api/v1/user/account/send-update-email',
				addBearer: true,
				body: {
					email: verifyEmailData.email,
				},
			})

			return res.data
		},
		onSuccess: (data) => {
			Bubble.success(data.message)
		},
		onError: (error: AxiosError<ISendUpdateEmailResponse>) => {
			if (error.response) {
				Bubble.error(error.response?.data.message)
			}
		},
	})

	useEffect(() => {
		if (isOpen === true) {
			const timer = setInterval(() => {
				if (second > 0) {
					setSecond(second - 1)
				}
			}, 1000)

			if (second === 0) {
				Bubble.error('Your confirmation code has expired.')
				setSecond(180)
				onClose()
			}

			return () => {
				clearInterval(timer)
			}
		}
	}, [second, isOpen])

	useEffect(() => {
		if (verifyEmailData.email) {
			mutate()
		}
	}, [verifyEmailData.email])

	useEffect(() => {
		setVerifyEmailData({
			...verifyEmailData,
			verifyEmailToken: getValues('confirmCode'),
		})
	}, [getValues('confirmCode')])

	return (
		<div className="pt-4">
			<Button
				color="primary"
				className="disabled:cursor-not-allowed disabled:opacity-50"
				disabled={isButtonDisabled}
				onPress={() => handleOnPress()}
				onClick={() => handleClick()}>
				Update Profile
			</Button>
			<Modal
				backdrop="blur"
				size="lg"
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				className="bg-mediumBlack text-white border-[1px] rounded-lg border-lightBlack min-h-[32rem] w-[32rem] max-sm:h-full">
				<ModalContent>
					{(onClose) => (
						<>
							<ModalBody>
								<div className="flex flex-col justify-center items-center py-8 overflow-hidden">
									<div className="w-fit h-fit bg-primary/20 p-4 rounded-full">
										<MdEmail className="text-6xl mx-auto text-primary " />
									</div>
									<h1 className="text-2xl text-white pt-4 font-bold max-sm:text-xl">
										CONFIRM YOUR NEW EMAIL
									</h1>
									<p className="text-white text-center pt-4 max-sm:text-[14px]">
										We've sent a confirmation code to your new email address.
										Please enter the code below to confirm your new email
										address.
									</p>
									<div className="flex flex-col justify-center items-center pt-4 w-full">
										<Input
											id="confirmCode"
											type="text"
											label="Confirmation Code"
											placeholder="Confirmation Code"
											register={register}
											maxLength={6}
											registerOptions={{
												required: 'Please enter your password',
											}}
											errors={errors}
										/>
										<p className="text-white text-center pt-4">
											{second} second left.
										</p>
									</div>
								</div>
							</ModalBody>
							<ModalFooter className="flex flex-col justify-center items-center w-full">
								<ConfirmEmailButton onClose={() => onClose()} />
								<Button
									variant="bordered"
									className="w-full text-lg text-white hover:border-primary hover:text-primary">
									Resend Code
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	)
}

export default UpdateProfileModal
