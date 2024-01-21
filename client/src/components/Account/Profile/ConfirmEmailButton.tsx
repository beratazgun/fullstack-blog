'use client'
import { Button } from '@nextui-org/react'
import { Bubble } from '@src/core/libs/Bubble'
import { useMutation } from '@tanstack/react-query'
import React from 'react'
import useVerifyEmail from '@src/hooks/useVerifyEmail'
import { AxiosError } from 'axios'
import { NetworkManager } from '@src/core/libs/NetworkManager'
import { IBaseResponse } from '@src/core/interface/IBaseResponse'

interface ConfirmEmailButtonProps {
	onClose: () => void
}

export interface ISendUpdateEmailResponse extends IBaseResponse {}

interface IUpdateEmailBody {
	email: string
}

function ConfirmEmailButton({ onClose }: ConfirmEmailButtonProps) {
	const { verifyEmailData } = useVerifyEmail()

	const { mutate } = useMutation({
		mutationKey: ['updateEmail'],
		mutationFn: async () => {
			const res = await NetworkManager.post<
				IUpdateEmailBody,
				ISendUpdateEmailResponse
			>({
				endpoint: `api/v1/user/verify/update-email/${verifyEmailData?.verifyEmailToken}`,
				addBearer: true,
				body: {
					email: verifyEmailData?.email,
				},
			})

			return res.data
		},
		onSuccess: (data) => {
			Bubble.success(data.message)
			onClose()
		},
		onError: (error: AxiosError<ISendUpdateEmailResponse>) => {
			if (error.response) {
				Bubble.error(error.response.data.message)
			}
		},
	})

	return (
		<Button
			color="primary"
			variant="solid"
			className="w-full text-lg"
			onClick={() => mutate()}>
			Confirm
		</Button>
	)
}

export default ConfirmEmailButton
