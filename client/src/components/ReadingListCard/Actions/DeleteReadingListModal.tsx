import React from 'react'
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
} from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'
import { Bubble } from '@src/core/libs/Bubble'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { IReadingListsDetailResponsePayload } from '@src/actions/getReadingListsDetail.action'
import { NetworkManager } from '@src/core/libs/NetworkManager'
import { IBaseResponse } from '@src/core/interface/IBaseResponse'

interface DeleteReadingListModalProps {
	readingList: IReadingListsDetailResponsePayload
	useDisclosure: {
		isOpen: boolean
		onOpenChange: (open: boolean) => void
	}
}

export interface IDeleteReadingListResponse extends IBaseResponse {}

function DeleteReadingListModal({
	readingList,
	useDisclosure: { isOpen, onOpenChange },
}: DeleteReadingListModalProps) {
	const { refresh } = useRouter()
	const { mutate } = useMutation({
		mutationKey: ['deleteReadingList'],
		mutationFn: async () => {
			// return await deleteReadingListAction(readingList.readingListCode)
			const res = await NetworkManager.post<any, IDeleteReadingListResponse>({
				endpoint: `/api/v1/reading-lists/delete/${readingList.readingListCode}`,
				addBearer: true,
			})

			return res.data
		},
		onSuccess: (data) => {
			toast.dismiss()
			Bubble.success(data.message)
			refresh()
			onOpenChange(false)
		},
		onMutate: () => {
			Bubble.loading('Deleting reading list...')
		},
		onError: (err) => {
			toast.dismiss()
			Bubble.error(err.message)
		},
	})

	return (
		<>
			<Modal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				className="dark"
				backdrop="blur">
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1 text-white text-md">
								Delete '{readingList.readingListName}'
							</ModalHeader>
							<ModalBody>
								<p className="text-default-600">
									Are you sure you want to delete this reading list? This action
									cannot be undone.
								</p>
							</ModalBody>
							<ModalFooter>
								<Button
									color="danger"
									className="text-white w-full"
									onPress={() => mutate()}>
									Confirm
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	)
}

export default DeleteReadingListModal
