import React from 'react'
import Image from 'next/image'
import BLogo from '@src/public/big_logo.png'
import SLogo from '@src/public/small_logo.png'
import { Button } from '@nextui-org/react'
import Link from 'next/link'
import { PiSignInBold } from 'react-icons/pi'
import UserAccount from '@src/components/UserAccount'
import WriteBlogButton from './WriteBlogButton'
import { getUserInfoAction } from '@src/actions/getUserInfo.action'

async function Navbar() {
	const user = await getUserInfoAction()

	return (
		<div className=" border-b-[1px] border-white border-opacity-20 ">
			<div className="flex flex-row justify-between items-center py-4 2xl:max-w-[1440px] xl:max-w-[1440px] lg:max-w-[1440px] md:max-w-[1440px] mx-auto">
				<div className="px-8 flex row justify-between items-center w-full">
					<a href="/">
						<Image
							className="max-sm:hidden"
							src={BLogo}
							priority
							alt="Picture of the author"
							width={200}
							height={200}
						/>
						<Image
							className="hidden max-sm:block"
							src={SLogo}
							priority
							alt="Picture of the author"
							width={40}
							height={40}
						/>
					</a>
					<div>
						{user === null ? (
							<div className="flex flex-row justify-center items-center gap-2">
								<Link
									href="/auth/signin"
									className="group text-white flex flex-row justify-between items-center w-18 duration-500 gap-1 hover:bg-mediumBlack px-4 py-2 rounded-xl">
									<span>Signin</span>
									<PiSignInBold className="text-black group-hover:text-white duration-300" />
								</Link>
								<Link href="/auth/signup" className="text-white ">
									<Button className="bg-gradient-to-tr from-blue-500 via-blue-600 to-blue-700 text-white shadow-lg rounded-xl px-4 py-2 h-fit text-md">
										Signup
									</Button>
								</Link>
							</div>
						) : (
							<div className="flex flex-row justify-center items-center gap-4">
								<WriteBlogButton buttonLabel="Write" />
								<UserAccount user={user.payload} />
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Navbar
