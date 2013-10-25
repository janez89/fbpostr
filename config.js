module.exports = {
	// admin user login datas
	user: {
		name: 'username',
		pass: 'password'
	},
	// facebook app datas
	facebook: {
		client_id:      'YOUR FACEBOOK APP ID',
		client_secret:  'YOU FACEBOOK APP SECRET',
		scope:          'email, user_about_me, user_birthday, user_location, publish_stream',
		redirect_uri:   'http://localhost:3000/',
	}
};