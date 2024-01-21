interface IUserInformationRegisterOption {
	firstName: any
	lastName: any
	userName: any
	email: {
		pattern: {
			value: RegExp
			message: string
		}
		required: string
	}
	githubLink: any
	instagramLink: any
	twitterLink: any
	facebookLink: any
	youtubeLink: any
	websiteLink: any
}

const UserInformationRegisterOption: IUserInformationRegisterOption = {
	firstName: {},
	lastName: {},
	userName: {},
	email: {
		pattern: {
			value: /\S+@\S+\.\S+/,
			message: 'Please enter a valid email address.',
		},
		required: 'You should enter your email',
	},
	githubLink: {},
	instagramLink: {},
	twitterLink: {},
	facebookLink: {},
	youtubeLink: {},
	websiteLink: {},
}

export default UserInformationRegisterOption
