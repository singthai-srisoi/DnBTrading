module.exports = {
	apps: [
		{
			name: 'dnbtrading-app',
			script: 'build/index.js',
			instances: 2,
			exec_mode: 'cluster',
			node_args: '--env-file=.env',
			env: {
				NODE_ENV: 'production',
				PORT: 3034,
				HOST: '127.0.0.1',
				ORIGIN: 'https://new.dnbtrading.website'
			}
		}
	]
};
