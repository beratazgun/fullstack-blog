import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { FaSave } from 'react-icons/fa'
import { Bubble } from '@src/core/libs/Bubble'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'
import { capitalize } from 'lodash'

import { NetworkManager } from '@src/core/libs/NetworkManager'
import { IBaseResponse } from '@src/core/interface/IBaseResponse'

interface CreateReadingListProps {
	closePopover: () => void
}

export interface ICreateReadingListResponse extends IBaseResponse {
	payload: {
		readingListName: string
	}
	validationErrors: {
		readingListName: string
	}
}

interface ICreateReadingListBody {
	readingListName: string
}

function CreateReadingListInput({ closePopover }: CreateReadingListProps) {
	const {
		register,
		getValues,
		formState: { isDirty },
	} = useForm<FieldValues>({
		defaultValues: {
			readingListName: '',
		},
		mode: 'all',
	})

	const { mutate } = useMutation({
		mutationKey: ['createReadingList'],
		mutationFn: async () => {
			const res = await NetworkManager.post<
				ICreateReadingListBody,
				ICreateReadingListResponse
			>({
				endpoint: '/api/v1/reading-lists/create',
				addBearer: true,
				body: {
					readingListName: getValues('readingListName'),
				},
			})

			return res.data
		},
		onSuccess: (data) => {
			if (data.isSuccess) {
				closePopover()
				toast.dismiss()
			}
		},
		onError: (error: AxiosError<ICreateReadingListResponse>) => {
			if (error.response) {
				toast.dismiss()
				if (error.response.data.validationErrors) {
					Bubble.error(
						capitalize(error.response.data.validationErrors.readingListName)
					)
				}
			}
		},
		onMutate: () => {
			Bubble.loading('Creating reading list...')
		},
	})

	return (
		<>
			<div className="pt-2 border-t-[0.1px] border-white border-opacity-30 w-full flex flex-row justify-between items-center gap-2 relative h-12">
				<input
					placeholder="Create reading list"
					{...register('readingListName', {
						required: true,
					})}
					className="bg-black2 text-white dark placeholder-white dark:placeholder-white dark:bg-black2 dark:text-white w-full px-2 py-1 rounded-lg outline-none border-[0.1px] border-white border-opacity-30"
				/>
				<button
					disabled={!isDirty}
					className="p-2 w-8 h-8 bg-primary rounded-lg flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
					onClick={() => {
						if (isDirty) {
							mutate()
						}
					}}>
					<FaSave className="text-xl dark:text-white absolute " />
				</button>
			</div>
		</>
	)
}

export default CreateReadingListInput
