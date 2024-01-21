'use client'
import React, { useState } from 'react'
import { Tabs, Tab, Card, CardBody } from '@nextui-org/react'
import { redirect, useRouter } from 'next/navigation'
import Signin from './Signin/Signin'
import Signup from './Signup/Signup'

interface AuthProps {
	action: string
}

export default function Auth({ action }: AuthProps) {
	const [selected, setSelected] = useState(action)
	const { replace } = useRouter()

	const handleChangeTab = (value: string) => {
		setSelected(value)
		redirect(`/auth/${value}`)
	}

	return (
		<div className="flex flex-col justify-center items-start w-full  max-lg:items-center ">
			<Card className="max-w-full w-[400px] h-fit">
				<CardBody>
					<Tabs
						fullWidth
						size="md"
						color="primary"
						aria-label="Tabs form"
						selectedKey={selected}
						onSelectionChange={() => {
							setSelected(selected === 'signin' ? 'signup' : 'signin')
							replace(`/auth/${selected === 'signin' ? 'signup' : 'signin'}`)
						}}>
						<Tab
							key="signin"
							title="signin"
							onClick={() => handleChangeTab('signin')}>
							<Signin />
						</Tab>
						<Tab
							key="signup"
							title="Sign up"
							onClick={() => handleChangeTab('signup')}>
							<Signup />
						</Tab>
					</Tabs>
				</CardBody>
			</Card>
		</div>
	)
}
