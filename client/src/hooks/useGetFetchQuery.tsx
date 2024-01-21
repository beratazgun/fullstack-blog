import { useQueryClient } from '@tanstack/react-query'

export const useGetFetchQuery = (queryKey: string[]) => {
	const queryClient = useQueryClient()

	return queryClient.getQueryData(queryKey)
}
