const path = require('path')

/** @type {import('next').NextConfig} */

const nextConfig = {
	output: 'standalone',
	sassOptions: {
		includePaths: [path.join(__dirname, '/src/scss')],
	},
	env: {
		BACKEND_URL: 'http://localhost:3000',
		CLIENT_URL: 'http://localhost:3001',
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'picsum.photos',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '4566',
				pathname: '/blog-aws/images/**',
			},
			{
				protocol: 'https',
				hostname: 'loremflickr',
				port: '',
				pathname: '/**',
			},
		],
	},
}

https: module.exports = nextConfig
