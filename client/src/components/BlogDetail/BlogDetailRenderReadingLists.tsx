import { IBlog } from '@src/core/interface/IBlog'
import { IReadingList } from '@src/core/interface/IReadingList'
import { useQueryClient } from '@tanstack/react-query'
import React from 'react'
import ReadingListItem from '../ReadingListsButton/ReadingListItem'

interface BlogDetailRenderReadingListsProps {
	blogData: IBlog
	handlePrefetch: () => Promise<any>
}

function BlogDetailRenderReadingLists({
	blogData,
	handlePrefetch,
}: BlogDetailRenderReadingListsProps) {
	const [fetchedBlogData, setFetchedBlogData] = React.useState<IBlog>(blogData)
	const queryClient = useQueryClient()
	const readingLists = queryClient.getQueryData<IReadingList[]>([
		'readingLists',
	])

	const isCheckboxSelected = (readingListCode: string): boolean => {
		return !!fetchedBlogData.signedInUserReadingList.find(
			(el) => el.readingListCode === readingListCode
		)
	}

	const hanldeDeleteOrAdd = (readingList: IReadingList) => {
		if (isCheckboxSelected(readingList.readingListCode)) {
			setFetchedBlogData({
				...fetchedBlogData,
				signedInUserReadingList: [
					...fetchedBlogData.signedInUserReadingList.filter((el: any) => {
						return el.readingListCode !== readingList.readingListCode
					}),
				],
			})
		} else {
			setFetchedBlogData({
				...fetchedBlogData,
				signedInUserReadingList: [
					...fetchedBlogData.signedInUserReadingList,
					{
						readingListCode: readingList.readingListCode,
						readingListSlug: (
							readingList.readingListName.toLowerCase() +
							'-' +
							readingList.readingListCode
						).replace(/ /g, '-'),
						readingListName: readingList.readingListName,
						blogCode: fetchedBlogData.blogCode,
					},
				],
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
					blogCode={fetchedBlogData.blogCode}
					isSelected={isCheckboxSelected(readingList.readingListCode)}
					onClick={() => hanldeDeleteOrAdd(readingList)}
				/>
			)
		})

	return (
		<div className="flex flex-col gap-2 w-full py-2 ">
			{BlogCardRenderReadingLists}
		</div>
	)
}

export default BlogDetailRenderReadingLists
