Facebook Postr
=======

Időzített tartalom kihelyező eszköz a facebook oldalakhoz.

![alt text][login]

![alt text][accounts]

![alt text][newpost]

![alt text][posts]

### Telepítés

A Postr futtatásához szükség van a [Node.JS](http://nodejs.org/download/)-re.

[Telepítés linuxra](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)

Függőségek kielégítéséhez parancssorban navigáljunk az alkalmazás könyvtárába majd:
> npm install

### Beállítások

Változtassuk meg az adminisztrátor felhasználó belépési adatait, illetve hozzunk létre egy facebook alkalmazást a facebookon, amivel az üzeneteket elhelyezzük majd az oldalainkon.

[Facebook új alkalamzás létrehozása](https://developers.facebook.com/apps)

![alt text][fbapp]

Töltsük ki a "Weboldal facebook bejelentkezéssel" részt a megfelelő URL-el.
Az alkalmazást hagyhatjuk sandbox módban ha csak mi használjuk, így más nem fér hozzá.

Már csak annyi dolgunk van, hogy a config fálba átírjuk az alkamlazás `App Id` és `App Secret` részeket és kirakjuk az alaklmazást egy szerverre, de akár futtathatjuk sajátgépünkről is.

A beállítások a `config.js` fájlban vannak.
```javascript
module.exports = {
        // admin user login datas. CHANGE THIS!
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
```

[accounts]: ./docs/accounts.png  "Accounts"
[newpost]: ./docs/newpost.png  "New Post"
[posts]: ./docs/posts.png  "Posts"
[login]: ./docs/login.png  "Login"
[fbapp]: ./docs/fbapp.png  "Facebook App Example"