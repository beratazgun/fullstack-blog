import React from 'react'
import AccountLayout from '@src/layouts/AccountLayout'
import { NetworkManager } from '@src/core/libs/NetworkManager'
import { cookies } from 'next/headers'
import { getUserInfoAction } from '@src/actions/getUserInfo.action'
import BlogsTable from '@src/components/Account/MyBlogs/BlogsTable/BlogsTable'
import { IGetAllBlogResponse } from '@src/actions/getBlogs.action'

async function getBlogs() {
	const jwt = cookies().get('jwt')
	const userData = await getUserInfoAction()
	const res = await NetworkManager.get<IGetAllBlogResponse>({
		endpoint: `/api/v1/blog/get/all`,
		headers: {
			Authorization: `Bearer ${jwt?.value}`,
		},
		params: {
			userName: userData?.payload.userName as string,
			isDeleted: false,
		},
	})

	return res.data.payload.docs
}

async function page() {
	const blogData = await getBlogs()

	return (
		<AccountLayout>
			<div className="px-8">
				<div className="pb-8">
					<h1 className="text-3xl text-white pl-2 pt-8">Your Blogs</h1>
				</div>
				<BlogsTable blogData={blogData} />
			</div>
		</AccountLayout>
	)
}

export default page
