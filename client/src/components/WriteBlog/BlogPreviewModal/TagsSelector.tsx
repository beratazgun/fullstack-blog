'use client'
import React, { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { NetworkManager } from '@src/core/libs/NetworkManager'
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import useStore from '@src/hooks/useStore'
import useWriteBlogData from '@src/hooks/useWriteBlogData'
import { IoIosClose } from 'react-icons/io'
import { FieldValues, useForm } from 'react-hook-form'
import Input from '@src/components/Input'
import { ITags } from '@src/core/interface/ITags'
import { IBaseResponse } from '@src/core/interface/IBaseResponse'

interface ITagPayload {
	length: number
	docs: ITags[]
}

interface ITagsResponse extends IBaseResponse {
	payload: ITagPayload
}

const TagsSelector = () => {
	const useBlog = useStore(useWriteBlogData, (state) => state)
	const [isClickedToAddTag, setIsClickedToAddTag] = useState(false)
	const [selectedTags, setSelectedTags] = useState<ITags[]>([])
	const [filteredTags, setFilteredTags] = useState<ITags[]>([])

	const {
		register,
		watch,
		formState: { errors },
	} = useForm<FieldValues>({
		mode: 'all',
		defaultValues: {
			search: '',
		},
	})

	const { mutate } = useMutation({
		mutationKey: ['tags'],
		mutationFn: async () => {
			const res = await NetworkManager.get<ITagsResponse>({
				endpoint: '/api/v1/tags/get/all',
			})

			return res.data
		},
		onSuccess: (data) => {
			useBlog?.setAvailableTags(data.payload.docs)
			setFilteredTags(data.payload.docs)
		},
	})

	useEffect(() => {
		if (useBlog?.availableTags?.length === 0) {
			mutate()
		}

		if (useBlog?.availableTags && useBlog?.availableTags.length > 0) {
			setFilteredTags(useBlog?.availableTags)
		}

		// İf there are selected tags in localstroage, set it to the state
		useBlog?.getBlogData().tags &&
			setSelectedTags(useBlog?.getBlogData().tags ?? [])
	}, [useBlog])

	// This will trigger when the user types on the search bar
	useEffect(() => {
		const filterTags = useBlog?.availableTags.filter((item: ITags) =>
			item.tag.includes(watch('search'))
		)

		filterTags &&
			setFilteredTags(
				filterTags.filter((item: ITags) => {
					return !selectedTags.includes(item)
				})
			)
	}, [watch('search')])

	// This will trigger when a tag is selected on the popover
	const handleSelect = (tag: ITags) => {
		setSelectedTags((values) => {
			const isTagAlreadySelected = values.find((item) => item.tag === tag.tag)

			if (isTagAlreadySelected) {
				return values
			} else {
				return [...values, tag]
			}
		})

		setIsClickedToAddTag(false)
		setFilteredTags(useBlog?.availableTags ?? [])

		useBlog &&
			useBlog.setBlogData({
				...useBlog.blogData,
				tags: [
					...(useBlog
						.getBlogData()
						.tags?.filter((item) => item.tag !== tag.tag) ?? []),
					tag,
				],
			})
	}

	const renderSelectedTags = selectedTags.map((value, index) => {
		return (
			<p
				onClick={() => {
					setSelectedTags(selectedTags.filter((item) => item.tag !== value.tag))

					useBlog?.setBlogData({
						...useBlog?.blogData,
						tags: selectedTags.filter((item) => item.tag !== value.tag),
					})
				}}
				className="text-justify text-[12px] px-2 py-1 rounded-lg border-[0.2px] cursor-pointer border-slate-50 border-opacity-30 flex flex-row justify-between items-center hover:border-primary hover:border-opacity-100 hover:text-primary group w-full"
				key={index}>
				{value.beautifiedTag}
				<IoIosClose className="hidden group-hover:inline-block" />
			</p>
		)
	})

	return (
		<div className="flex w-full flex-col gap-2 bg-mediumBlack">
			<Popover
				isOpen={isClickedToAddTag}
				onOpenChange={(open) => setIsClickedToAddTag(open)}
				backdrop="opaque"
				placement="bottom"
				showArrow
				offset={10}
				classNames={{
					content:
						'bg-black border-[0.1px] border-slate-50 border-opacity-30 h-[24rem] flex flex-col justify-start items-center py-2 w-full',
					arrow: 'fill-primary',
				}}
				className="w-72">
				<PopoverTrigger>
					<div className="flex flex-row justify-center items-center gap-2 bg-mediumBlack px-2 py-2 rounded-lg border-[0.1px] border-slate-50 border-opacity-30">
						<p className="text-justify text-sm cursor-pointer">Add a tag</p>
					</div>
				</PopoverTrigger>
				<PopoverContent>
					<div className="w-full pb-2 border-b-[0.1px] border-slate-50 border-opacity-30">
						<Input
							id="search"
							type="text"
							label="Search for tags"
							placeholder="Search for tags"
							register={register}
							registerOptions={{
								required: { value: true, message: 'This field is required' },
							}}
							errors={errors}
						/>
					</div>
					<div className="overflow-y-auto py-2 w-full">
						{filteredTags.map((tag: ITags, index: number) => {
							return (
								<div className="py-1" key={index}>
									<p
										className="flex flex-row justify-start items-center pl-4 gap-2 text-slate-1 bg-black px-2 py-2 rounded-lg border-[0.1px] border-slate-50 border-opacity-30 w-full cursor-pointer  text-white"
										onClick={() => handleSelect(tag)}>
										{tag.beautifiedTag}
									</p>
								</div>
							)
						})}
					</div>
				</PopoverContent>
			</Popover>
			<div className="grid grid-flow-col-dense grid-cols-2  grid-rows-3 gap-2 pt-2 ">
				{renderSelectedTags}
			</div>
		</div>
	)
}

export default TagsSelector
