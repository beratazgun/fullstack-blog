'use client'
import { IBaseResponse } from '@src/core/interface/IBaseResponse'
import { NetworkManager } from '@src/core/libs/NetworkManager'
import { useMutation } from '@tanstack/react-query'
import React from 'react'

interface ConfirmEmailPageProps {
	params: {
		confirmToken: string
	}
}

interface IConfirmEmailResponse extends IBaseResponse {}

export default function Page({ params }: ConfirmEmailPageProps) {
	const { mutate, isPending, isError } = useMutation({
		mutationKey: ['confirmEmail'],
		mutationFn: async () => {
			const res = await NetworkManager.post<IConfirmEmailResponse>({
				endpoint: `/api/v1/user/verify/confirm-email/${params.confirmToken}`,
			})

			console.log(res.data)

			return res.data
		},
	})

	React.useEffect(() => {
		mutate()
	}, [])

	return (
		<div className="flex justify-center items-center h-[100vh] w-full text-white">
			{isPending ? (
				<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
			) : isError ? (
				<div className="text-center">
					<h1 className="text-4xl font-bold">Email Verification Failed</h1>
					<p className="text-lg">Your email token is invalid or expired.</p>
				</div>
			) : (
				<div className="text-center">
					<h1 className="text-4xl font-bold">Email Verified</h1>
					<p className="text-lg">You can now login to your account</p>
				</div>
			)}
		</div>
	)
}
