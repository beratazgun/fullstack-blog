'use client'
import { Button } from '@nextui-org/react'
import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { Bubble } from '@src/core/libs/Bubble'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { IBaseResponse } from '@src/core/interface/IBaseResponse'
import { NetworkManager } from '@src/core/libs/NetworkManager'

interface UnFollowButtonProps {
	userCode: string
	handleUnFollow?: () => void
}

export interface IUnFollowUserResponse extends IBaseResponse {}

const UnFollowButton: React.FC<UnFollowButtonProps> = ({
	userCode,
	handleUnFollow,
}) => {
	const router = useRouter()

	const { mutate } = useMutation({
		mutationKey: ['followUser'],
		mutationFn: async () => {
			const res = await NetworkManager.post<IUnFollowUserResponse>({
				endpoint: `/api/v1/user/unfollow/${userCode}`,
				addBearer: true,
			})

			return res.data
		},
		onSuccess: (data) => {
			Bubble.success(data.message)
			router.refresh()

			handleUnFollow && handleUnFollow()
		},
		onError: (err: AxiosError<IUnFollowUserResponse>) => {
			if (err.response) {
				Bubble.error(err.response.data.message)
			}
		},
	})

	return (
		<Button color="primary" className="w-20" onClick={() => mutate()}>
			Unfollow
		</Button>
	)
}

export default UnFollowButton
