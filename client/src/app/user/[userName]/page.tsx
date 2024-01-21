import React from 'react'
import NavbarLayout from '@src/layouts/NavbarLayout'

import { IUser } from '@src/core/interface/IUser'
import RenderBlogCard from '@src/components/BlogCard/RenderBlogCard'
import { getUserInfoAction } from '@src/actions/getUserInfo.action'
import { getUserByUsernameAction } from '@src/actions/getUserByUsername.action'
import UserBlogPageHeader from '@src/components/UserBlogPageHeader'

interface Props {
	params: { userName: string }
}

export default async function Page({ params }: Props) {
	const blogOwnerUser = await getUserByUsernameAction(params.userName)
	const signedInUser = await getUserInfoAction()

	return (
		<NavbarLayout>
			<div className="h-full">
				{blogOwnerUser && (
					<div className="h-full flex flex-col justify-center items-start gap-4 px-32">
						<div className="w-full">
							{blogOwnerUser && (
								<UserBlogPageHeader
									blogOwnerUser={blogOwnerUser.payload as IUser}
									signedInUser={signedInUser?.payload}
								/>
							)}
						</div>
						<RenderBlogCard params={{ userName: params.userName }} />
					</div>
				)}
			</div>
		</NavbarLayout>
	)
}
