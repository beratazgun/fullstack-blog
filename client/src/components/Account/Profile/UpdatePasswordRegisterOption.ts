import validator from 'validator'

const UpdatePasswordRegisterOption = {
	currentPassword: {
		required: 'The password can not be empty',
		minLength: {
			value: 8,
			message: 'Your password must be at least 8 characters',
		},
		maxLength: {
			value: 64,
			message: 'Your password must be at most 64 characters',
		},
	},
	newPassword: {
		required: 'The password can not be empty',
		minLength: {
			value: 8,
			message: 'Your password must be at least 8 characters',
		},
		maxLength: {
			value: 64,
			message: 'Your password must be at most 64 characters',
		},
		validate: {
			isPassword: (value: string) =>
				validator.isStrongPassword(value) ||
				'Your password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character',
		},
	},
	newPasswordConfirmation: {
		required: "The password confirmation can't be empty",
		validate: {
			isPairedPassword: () => {
				const newPassword = (
					document.querySelector('#newPassword') as HTMLInputElement
				).value
				const newPasswordConfirmation = (
					document.querySelector('#newPasswordConfirmation') as HTMLInputElement
				).value
				return (
					newPassword === newPasswordConfirmation || 'Passwords do not match'
				)
			},
		},
	},
}

export default UpdatePasswordRegisterOption
