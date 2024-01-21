import { IBlog } from '@src/core/interface/IBlog'
import { ITags } from '@src/core/interface/ITags'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BlogData
	extends Pick<
		IBlog,
		'title' | 'blogCode' | 'description' | 'content' | 'thumbnail'
	> {
	images?: string[]
	tags?: ITags[]
}

interface useWriteBlogDataState {
	blogData: Partial<BlogData>
	setBlogData: (data: Partial<BlogData>) => void
	getBlogData: () => Partial<BlogData>
	availableTags: ITags[]
	setAvailableTags: (data: ITags[]) => void
}

export const useWriteBlogData = create<useWriteBlogDataState>()(
	persist(
		(set, get) => ({
			blogData: {
				title: '',
				blogCode: '',
				description: '',
				content: '',
				thumbnail: '',
				images: [],
				tags: [],
			},
			availableTags: [],
			setAvailableTags: (data: ITags[]) => set({ availableTags: data }),
			setBlogData: (data: Partial<BlogData>) => set({ blogData: data }),
			getBlogData: () => get().blogData,
		}),
		{
			name: 'blogData',
		}
	)
)

export default useWriteBlogData
