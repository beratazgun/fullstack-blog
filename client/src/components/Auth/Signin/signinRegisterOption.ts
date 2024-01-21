const signinRegisterOption = {
	signinEmail: {
		pattern: {
			value: /\S+@\S+\.\S+/,
			message: 'Please enter a valid email address.',
		},
		required: 'You should enter your email',
	},

	signinPassword: {
		required: 'You should enter your password',
	},
}

export default signinRegisterOption
