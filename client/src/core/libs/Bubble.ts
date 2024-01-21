import toast from 'react-hot-toast'

export class Bubble {
	static loading(message: string, duration: number = 2000) {
		return toast.loading(message, {
			duration,
			style: {
				color: '#fff',
				backgroundColor: '#18181b',
				padding: '1rem',
			},
		})
	}

	static success(message: string, duration: number = 2000) {
		return toast.success(message, {
			duration,
			style: {
				color: '#fff',
				padding: '1rem',
				backgroundColor: '#16a34a',
			},
			iconTheme: {
				primary: '#fff',
				secondary: '#16a34a',
			},
		})
	}

	static error(message: string, duration: number = 2000) {
		return toast.error(message, {
			duration,
			style: {
				color: '#fff',
				padding: '1rem',
				backgroundColor: '#ef4444',
			},
			iconTheme: {
				primary: '#fff',
				secondary: '#ef4444',
			},
		})
	}

	static info(message: string, duration: number = 2000) {
		return toast(message, {
			duration,
			style: {
				color: '#fff',
				backgroundColor: '#18181b',
				padding: '1rem',
			},
		})
	}
}
