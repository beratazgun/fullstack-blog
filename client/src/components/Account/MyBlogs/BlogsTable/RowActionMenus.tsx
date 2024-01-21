import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from '@nextui-org/react'
import React from 'react'
import { BiDotsVertical } from 'react-icons/bi'
import UpdateStatusAction from './ActionMenus/UpdateStatusAction'
import { useRouter } from 'next/navigation'
import { IBlog } from '@src/core/interface/IBlog'
import DeleteBlogAction from './ActionMenus/DeleteBlogAction'

interface RowActionMenusProps {
	blogData: IBlog
	handleDeleteBlog: (blogCode: string) => void
	handleUpdateBlogStatus: (blogCode: string, isPublished: boolean) => void
}

const RowActionMenus: React.FC<RowActionMenusProps> = ({
	blogData,
	handleDeleteBlog,
	handleUpdateBlogStatus,
}) => {
	const router = useRouter()

	return (
		<Dropdown className="bg-mediumBlack text-white ">
			<DropdownTrigger>
				<Button variant="bordered">
					<BiDotsVertical className="text-white text-2xl" />
				</Button>
			</DropdownTrigger>
			<DropdownMenu
				aria-label="Static Actions"
				itemClasses={{
					base: 'h-8 w-full text-white ',
				}}>
				<DropdownItem
					onClick={() => {
						// router.push(
						// 	`/blog/${blogData.writer.userName}/${blogData.titleSlug}`
						// )
					}}>
					View
				</DropdownItem>
				<DropdownItem>Edit</DropdownItem>
				<DropdownItem>
					<UpdateStatusAction
						currentStatus={blogData.isPublished}
						blogCode={blogData.blogCode}
						handleUpdateBlogStatus={handleUpdateBlogStatus}
					/>
				</DropdownItem>
				<DropdownItem className="text-danger" color="danger">
					<DeleteBlogAction
						blogCode={blogData.blogCode}
						handleDeleteBlog={handleDeleteBlog}
					/>
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	)
}

export default RowActionMenus
