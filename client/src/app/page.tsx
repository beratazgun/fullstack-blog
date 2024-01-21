// import RenderBlogCard from '@src/components/Renders/RenderBlogCard'
import RenderBlogCard from '@src/components/BlogCard/RenderBlogCard'
import ScroolToTopButton from '@src/components/ScroolToTopButton'
import { IBaseResponse } from '@src/core/interface/IBaseResponse'
import { ITags } from '@src/core/interface/ITags'
import { NetworkManager } from '@src/core/libs/NetworkManager'
import NavbarLayout from '@src/layouts/NavbarLayout'

interface IGetTagsResponsePayload {
	length: number
	docs: ITags[]
}

interface IGetTagsResponse extends IBaseResponse {
	payload: IGetTagsResponsePayload
}

async function getTags() {
	const res = await NetworkManager.get<IGetTagsResponse>({
		endpoint: '/api/v1/tags/get/all',
	})

	return res.data
}

export default async function Home() {
	const tagsData = await getTags()

	return (
		<NavbarLayout>
			<div className="grid grid-cols-[1fr_0.3fr] gap-x-4 max-lg:grid-cols-1">
				<div className="flex flex-col gap-4 px-8 py-8 h-fit">
					<RenderBlogCard params={null} />
				</div>
				<div className="flex w-full h-full pl-4 pt-8 px-8 max-lg:hidden">
					<div className="text-white bg-mediumBlack p-4 rounded-lg h-fit w-full border-[1px] border-lightBlack ">
						<div className="flex flex-col gap-2">
							<div className="text-2xl font-bold">Tags</div>
							<div className="flex flex-wrap gap-2">
								{tagsData.payload.docs.map((tag) => {
									return (
										<a
											key={tag.tag}
											href={`/tag/${tag.tag}`}
											className="text-sm text-white bg-lightBlack px-2 py-1 rounded-lg">
											{tag.beautifiedTag}
										</a>
									)
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
			<ScroolToTopButton />
		</NavbarLayout>
	)
}
