import React from 'react'
import { FieldValues, UseFormRegister } from 'react-hook-form'
import { Input as NextUInput } from '@nextui-org/react'
import { IconType } from '@react-icons/all-files'

interface InputProps {
	id: string
	type: string
	label: string
	register: UseFormRegister<FieldValues>
	registerOptions?: any
	errors?: any
	icon?: IconType
	placeholder?: string
	defaultValue?: string
	maxLength?: number
}

export const inputOverrideStyle = {
	input: ['bg-transparent'],
	innerWrapper: 'bg-transparent  ',
	inputWrapper: [
		'shadow-xl',
		'border-[1px] border-white dark:border-white/20',
		'bg-mediumBlack',
		'!cursor-text',
		'rounded-lg',
	],
}

export default function Input({
	type,
	label,
	register,
	id,
	registerOptions = {},
	errors,
	icon: Icon,
	placeholder,
	defaultValue,
	maxLength,
}: InputProps) {
	return (
		<NextUInput
			id={id}
			{...register(id, registerOptions)}
			type={type}
			label={label}
			placeholder={placeholder}
			defaultValue={defaultValue}
			labelPlacement="inside"
			className="w-full dark max-sm:w-full"
			maxLength={maxLength}
			classNames={inputOverrideStyle}
			endContent={
				Icon && (
					<Icon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
				)
			}
			errorMessage={errors[id] && errors[id].message}
		/>
	)
}
