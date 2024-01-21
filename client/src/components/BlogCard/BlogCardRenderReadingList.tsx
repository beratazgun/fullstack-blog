'use client'
import React from 'react'
import { IBlog } from '@src/core/interface/IBlog'
import { IReadingList } from '@src/core/interface/IReadingList'
import ReadingListItem from '@src/components/ReadingListsButton/ReadingListItem'
import { useQueryClient } from '@tanstack/react-query'

interface BlogCardRenderReadingListProps {
	blogData: IBlog
	apiQueryParams: any
}

function BlogCardRenderReadingList({
	blogData,
	apiQueryParams,
}: BlogCardRenderReadingListProps) {
	const queryClient = useQueryClient()
	const readingLists = queryClient.getQueryData<IReadingList[]>([
		'readingLists',
	])
	const getQueryBlogData: any = queryClient.getQueryData([
		'blogs',
		apiQueryParams,
	])

	const isCheckboxSelected = (readingListCode: string): boolean => {
		return !!blogData.signedInUserReadingList.find(
			(el) => el.readingListCode === readingListCode
		)
	}

	const handleDeleteOrAdd = (readingList: IReadingList) => {
		if (isCheckboxSelected(readingList.readingListCode)) {
			queryClient.setQueryData(['blogs'], () => {
				return getQueryBlogData.pages.map((page: any) => {
					return page.docs.map((doc: any) => {
						if (doc.blogCode === blogData.blogCode) {
							doc.signedInUserReadingList = [
								...doc.signedInUserReadingList.filter((el: any) => {
									return el.readingListCode !== readingList.readingListCode
								}),
							]
						}
					})
				})
			})
		} else {
			queryClient.setQueryData(['blogs'], () => {
				return getQueryBlogData.pages.map((page: any) => {
					return page.docs.map((doc: any) => {
						if (doc.blogCode === blogData.blogCode) {
							doc.signedInUserReadingList = [
								...doc.signedInUserReadingList,
								{
									readingListCode: readingList.readingListCode,
									readingListSlug: (
										readingList.readingListName.toLowerCase() +
										'-' +
										readingList.readingListCode
									).replace(/ /g, '-'),
									readingListName: readingList.readingListName,
									blogCode: blogData.blogCode,
								},
							]
						}
					})
				})
			})
		}
	}

	const BlogCardRenderReadingLists =
		readingLists &&
		readingLists.map((readingList: IReadingList) => {
			return (
				<ReadingListItem
					key={readingList.readingListCode}
					readingList={readingList}
					blogCode={blogData.blogCode}
					isSelected={isCheckboxSelected(readingList.readingListCode)}
					onClick={() => handleDeleteOrAdd(readingList)}
				/>
			)
		})

	return (
		<div className="flex flex-col gap-2 w-full h-full py-2">
			{BlogCardRenderReadingLists}
		</div>
	)
}

export default BlogCardRenderReadingList
