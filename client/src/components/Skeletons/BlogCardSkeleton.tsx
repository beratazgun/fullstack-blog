import React from 'react'
import { Card, Skeleton, skeleton } from '@nextui-org/react'

interface IBlogCardSkeleton {
	howMany: number
}

const BlogCardSkeleton: React.FC<IBlogCardSkeleton> = ({ howMany }) => {
	const skeletonCard = (key: number) => {
		return (
			<Card
				key={key}
				className="grid grid-cols-[1fr_0.4fr] gap-4 w-full h-64 px-4 py-4  "
				radius="lg">
				<div className="col-span-3 h-12 w-96 flex flex-row justify-start items-center gap-4">
					<Skeleton className="h-12 w-12 rounded-full bg-default-300 " />
					<Skeleton className="rounded-lg col-span-3  w-72 h-8 bg-default-300" />
				</div>
				<div className="space-y-3 w-full h-[6rem]">
					<Skeleton className="h-3 w-[40rem] rounded-lg bg-default-200" />
					<Skeleton className="h-3 w-full rounded-lg bg-default-200" />
					<Skeleton className="h-3 w-2/5 rounded-lg bg-default-300" />
					<div className="pt-4 flex flex-col justify-between gap-1 h-full">
						<div className="flex flex-row justify-between items-center">
							<Skeleton className="h-6 w-16 rounded-lg bg-default-300" />
							<Skeleton className="h-6 w-6 rounded-full bg-default-300" />
						</div>
					</div>
				</div>
				<Skeleton className="h-full rounded-lg bg-default-300 ml-4" />
			</Card>
		)
	}
	const renderSkeleton = new Array(howMany).fill(1).map((el, index) => {
		return skeletonCard(index)
	})

	return <div className="flex flex-col gap-2">{renderSkeleton}</div>
}

export default BlogCardSkeleton
