'use client'
import React from 'react'
import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	useDisclosure,
} from '@nextui-org/react'
import { FiTrash2 } from 'react-icons/fi'
import { RiMenu4Line } from 'react-icons/ri'
import { IoIosShareAlt } from 'react-icons/io'
import DeleteReadingListModal from './Actions/DeleteReadingListModal'
import { IReadingListResponsePayload } from '@src/app/account/reading-list/page'
import { IoCopyOutline } from 'react-icons/io5'
import { Bubble } from '@src/core/libs/Bubble'
import { usePathname } from 'next/navigation'

interface ReadingListCardActionMenuProps {
	readingList: IReadingListResponsePayload
}

function ReadingListCardActionMenu({
	readingList,
}: ReadingListCardActionMenuProps) {
	const pathName = usePathname()
	const { isOpen, onOpen, onOpenChange } = useDisclosure()

	return (
		<>
			<Dropdown className="dark">
				<DropdownTrigger>
					<button className="outline-none p-2 flex justify-center items-center bg-mediumBlack border-[1px] border-lightBlack rounded-full hover:bg-lightBlack duration-300">
						<RiMenu4Line />
					</button>
				</DropdownTrigger>
				<DropdownMenu
					aria-label="Static Actions"
					className="text-white"
					disabledKeys={[readingList.isDeletable ? '' : 'delete']}>
					<DropdownItem
						onClick={onOpen}
						key="delete"
						className="text-danger"
						color="danger"
						aria-disabled="true"
						endContent={<FiTrash2 />}>
						Delete
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
			<DeleteReadingListModal
				readingList={readingList}
				useDisclosure={{ isOpen, onOpenChange }}
			/>
		</>
	)
}

export default ReadingListCardActionMenu
