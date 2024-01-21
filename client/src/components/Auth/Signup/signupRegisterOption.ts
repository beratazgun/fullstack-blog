import validator from 'validator'

const signupRegisterOption = {
	signupFirstName: {
		required: 'First name is required',
		minLength: {
			value: 2,
			message: 'First name must be at least 2 characters',
		},
		maxLength: {
			value: 20,
			message: 'First name must be at most 20 characters',
		},
	},
	signupLastName: {
		required: 'Last name is required',
		minLength: {
			value: 2,
			message: 'Last name must be at least 2 characters',
		},
		maxLength: {
			value: 20,
			message: 'Last name must be at most 20 characters',
		},
	},
	signupUserName: {
		required: 'User name is required',
		minLength: {
			value: 2,
			message: 'User name must be at least 2 characters',
		},
		maxLength: {
			value: 20,
			message: 'User name must be at most 20 characters',
		},
	},
	signupEmail: {
		required: 'Email is required',
		pattern: {
			value: /\S+@\S+\.\S+/,
			message: 'Please enter a valid email address.',
		},
	},
	signupPassword: {
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
	signupPasswordConfirmation: {
		required: "The password confirmation can't be empty",
		validate: {
			isPairedPassword: () => {
				const password = (
					document.querySelector('#signupPassword') as HTMLInputElement
				).value
				const PasswordConfirmation = (
					document.querySelector(
						'#signupPasswordConfirmation'
					) as HTMLInputElement
				).value
				return password === PasswordConfirmation || 'Passwords do not match'
			},
		},
	},
}

export default signupRegisterOption
