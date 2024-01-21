import { create } from 'zustand'

interface useJwtState {
	jwt: string | null
	setJwt: (jwt: string) => void
}

const useJwt = create<useJwtState>((set) => ({
	jwt: null,
	setJwt: (jwt: string) => set({ jwt: jwt }),
}))

export default useJwt
