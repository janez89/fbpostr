module.exports = {
	// If you change then check facebook section redirect_uri value!
	port: 3000,
	secret: 'ChangeThis', // Cookie secret key
	// admin user login datas
	user: {
		name: 'admin',
		pass: 'admin'
	},
	// facebook app datas
	facebook: {
		client_id:      'YOUR FACEBOOK APP ID',
		client_secret:  'YOU FACEBOOK APP SECRET',
		redirect_uri:   'http://localhost:3000/',
		scope:          'email, user_about_me, publish_stream, manage_pages'
	}
};