import React, { useEffect } from 'react'
import { Card, Skeleton } from '@nextui-org/react'

const ReadingListSkeleton = () => {
	return (
		<div className="flex flex-col justify-start items-center gap-2 w-full">
			{new Array(3).fill(0).map((_, i) => {
				return (
					<div
						key={i}
						className="flex flex-row justify-start items-center gap-2 w-full">
						<Skeleton className="rounded-lg col-span-3  w-5 h-5 bg-default-300" />
						<Skeleton
							className={`rounded-lg col-span-3 h-5 bg-default-300 w-[12rem]`}
						/>
					</div>
				)
			})}
		</div>
	)
}

export default ReadingListSkeleton
