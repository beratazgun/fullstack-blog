import React from 'react'
import { capitalize } from 'lodash'

import NavbarLayout from '@src/layouts/NavbarLayout'
import RenderBlogCard from '@src/components/BlogCard/RenderBlogCard'

interface Props {
	params: { tagSlug: string }
}

export default function Page({ params }: Props) {
	return (
		<NavbarLayout>
			<div className="flex flex-col justify-center items-center gap-4 px-24 pt-8 pb-12 max-md:px-8">
				<h1 className="text-4xl font-bold text-white pb-8">
					{capitalize(params.tagSlug).replace('%20', ' ')}
				</h1>
				<RenderBlogCard params={{ tagSlug: params.tagSlug }} />
			</div>
		</NavbarLayout>
	)
}
