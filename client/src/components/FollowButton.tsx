'use client'
import { Button } from '@nextui-org/react'
import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { NetworkManager } from '@src/core/libs/NetworkManager'
import { Bubble } from '@src/core/libs/Bubble'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { IBaseResponse } from '@src/core/interface/IBaseResponse'

interface FollowButtonProps {
	userCode: string
}

export interface IFollowUserResponse extends IBaseResponse {}

function FollowButton({ userCode }: FollowButtonProps) {
	const router = useRouter()

	const { mutate } = useMutation({
		mutationKey: ['followUser'],
		mutationFn: async () => {
			const res = await NetworkManager.post<IFollowUserResponse>({
				endpoint: `/api/v1/user/follow/${userCode}`,
				addBearer: true,
			})

			return res.data
		},
		onSuccess: (data) => {
			Bubble.success(data.message)
			router.refresh()
		},
		onError: (err: AxiosError<IFollowUserResponse>) => {
			if (err.response) {
				Bubble.error(err.response.data.message)
			}
		},
	})

	return (
		<Button color="primary" className="w-20" onClick={() => mutate()}>
			Follow
		</Button>
	)
}

export default FollowButton
