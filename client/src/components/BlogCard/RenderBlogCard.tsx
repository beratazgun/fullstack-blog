'use client'
import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { IBlog } from '@src/core/interface/IBlog'
import { useInfiniteQuery } from '@tanstack/react-query'
import { NetworkManager } from '@src/core/libs/NetworkManager'
import { flatMap } from 'lodash'
import BlogCard from './BlogCard'
import BlogCardSkeleton from '../Skeletons/BlogCardSkeleton'
import { getBlogsAction } from '@src/actions/getBlogs.action'

export interface IParams {
	userName: string
	tagSlug: string
	blogCode: string
	page: number
	limit: number
	isPublished: boolean
}

interface RenderBlogCardProps {
	params?: Partial<IParams> | null
	showtag?: boolean
}

function RenderBlogCard({ params, showtag }: RenderBlogCardProps) {
	const { ref, inView } = useInView()
	const [fetchedBlogData, setFetchedBlogData] = React.useState<IBlog[]>([])

	const { data, isFetchingNextPage, fetchNextPage, isFetching } =
		useInfiniteQuery({
			queryKey: ['blogs', params],
			queryFn: async ({ pageParam }) => {
				const res = await getBlogsAction({
					...params,
					page: pageParam,
					limit: 6,
					isPublished: true,
				})

				return res.payload
			},
			initialPageParam: 1,
			getNextPageParam: (lastPage) => {
				return lastPage.pagination.hasNextPage
					? lastPage.pagination.nextPage
					: undefined
			},
		})

	useEffect(() => {
		if (inView) {
			fetchNextPage()
		}
	}, [fetchNextPage, inView])

	useEffect(() => {
		if (data) {
			const flatMappedData = flatMap(data.pages, (page) => page.docs)
			setFetchedBlogData(flatMappedData)
		}
	}, [data])

	const renderBlogCards = fetchedBlogData.map((blog, index) => {
		return (
			<BlogCard
				key={index}
				blogData={blog}
				showTag={showtag}
				apiQueryParams={params}
			/>
		)
	})

	return (
		<div className="flex flex-col gap-2 w-full">
			{renderBlogCards}
			<button
				ref={ref}
				className="bg-black2 text-white py-2 rounded-lg w-full "
				onClick={() => {
					fetchNextPage()
				}}>
				{isFetchingNextPage || isFetching ? (
					<div className="flex flex-col gap-1">
						<BlogCardSkeleton howMany={6} />
					</div>
				) : (
					''
				)}
			</button>
		</div>
	)
}

export default RenderBlogCard
