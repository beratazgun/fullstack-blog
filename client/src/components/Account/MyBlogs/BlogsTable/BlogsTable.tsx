'use client'
import React, { Key, useCallback, useState } from 'react'
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Chip,
} from '@nextui-org/react'
import RowActionMenus from './RowActionMenus'
import Image from 'next/image'
import WriteBlogButton from '@src/components/WriteBlogButton'
import { IBlog } from '@src/core/interface/IBlog'

interface RowFields
	extends Pick<
		IBlog,
		| 'blogCode'
		| 'thumbnail'
		| 'title'
		| 'isPublished'
		| 'viewCount'
		| 'publishedAt'
	> {}

const columns = [
	{
		key: 'blogCode',
		label: 'BlOG CODE',
	},
	{
		key: 'thumbnail',
		label: 'THUMBNAIL',
	},
	{
		key: 'title',
		label: 'TİTLE',
	},
	{
		key: 'isPublished',
		label: 'STATUS',
	},
	{
		key: 'viewCount',
		label: 'VİEW COUNT',
	},
	{
		key: 'publishedAt',
		label: 'PUBLİSHED AT',
	},
	{
		key: 'actions',
		label: 'ACTİONS',
	},
]

interface BlogsTableProps {
	blogData: IBlog[]
}

function BlogsTable({ blogData }: BlogsTableProps) {
	const [allData, setAllData] = useState<IBlog[]>(blogData)

	const handleDeleteBlog = useCallback(
		(blogCode: string) => {
			setAllData((prev) => prev?.filter((item) => item.blogCode !== blogCode))
		},
		[allData]
	)

	const handleUpdateBlogStatus = useCallback(
		(blogCode: string, isPublished: boolean) => {
			setAllData((prev) =>
				prev?.map((item) =>
					item.blogCode === blogCode ? { ...item, isPublished } : item
				)
			)
		},
		[allData]
	)

	const renderCell = useCallback((usersBlog: IBlog, columnKey: Key) => {
		switch (columnKey) {
			case 'isPublished':
				return (
					<Chip
						className="capitalize w-20"
						size="sm"
						variant="flat"
						color={usersBlog.isPublished === true ? 'success' : 'danger'}>
						{usersBlog.isPublished === true ? 'Published' : 'Unpublished'}
					</Chip>
				)
			case 'publishedAt':
				return new Date(usersBlog.publishedAt).toLocaleDateString('tr-TR')
			case 'thumbnail':
				return (
					<Image
						priority
						className="w-24 h-24 rounded-2xl object-contain"
						width={96}
						height={96}
						src={usersBlog.thumbnail}
						alt={usersBlog.title}
					/>
				)
			case 'actions':
				return (
					<RowActionMenus
						blogData={usersBlog}
						handleDeleteBlog={handleDeleteBlog}
						handleUpdateBlogStatus={handleUpdateBlogStatus}
					/>
				)

			default:
				return usersBlog[columnKey as keyof RowFields]
		}
	}, [])

	return (
		<div className="overflow-y-auto pb-8">
			{allData?.length > 0 ? (
				<Table
					isStriped
					isHeaderSticky
					aria-labelledby="User blogs"
					topContentPlacement="outside">
					<TableHeader columns={columns}>
						{(column) => (
							<TableColumn key={column.key}>{column.label}</TableColumn>
						)}
					</TableHeader>
					<TableBody items={allData}>
						{(item: IBlog) => (
							<TableRow key={item.blogCode} className="text-white">
								{(columnKey) => (
									<TableCell>
										{renderCell(item, columnKey) as React.ReactNode}
									</TableCell>
								)}
							</TableRow>
						)}
					</TableBody>
				</Table>
			) : (
				<div className="flex flex-col items-center justify-center gap-4 h-96 text-white">
					<p className="">You don't have any blog yet.</p>
					<WriteBlogButton buttonLabel="Write your first blog" />
				</div>
			)}
		</div>
	)
}

export default BlogsTable
