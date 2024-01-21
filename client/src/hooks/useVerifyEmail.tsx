import { create } from 'zustand'

interface IVerifyEmailData {
	email: string
	verifyEmailToken: string
}
interface UseVerifyEmailState {
	verifyEmailData: IVerifyEmailData
	setVerifyEmailData: (data: IVerifyEmailData) => void
}

const useVerifyEmail = create<UseVerifyEmailState>((set) => ({
	verifyEmailData: {
		email: '',
		verifyEmailToken: '',
	},
	setVerifyEmailData: (data) =>
		set((state) => ({
			verifyEmailData: { ...state.verifyEmailData, ...data },
		})),
}))

export default useVerifyEmail
