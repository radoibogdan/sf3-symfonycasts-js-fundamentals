Javascript for PHP Geeks Tutorial
=================================
 [Modern JavaScript Tutorials](http://knpuniversity.com/tracks/javascript#modern-javascript)

Magic happens here :
- web/assets/js/RepLogApp.js
- app/Resources/views/lift/index.html.twig

## Setup
**Setup parameters.yml**
First, make sure you have an `app/config/parameters.yml`
file (you should). If you don't, copy `app/config/parameters.yml.dist`
to get it.

**Install composer 2.2 else errors**  
https://stackoverflow.com/questions/75258393/how-to-install-two-composer-in-one-windows-system  
- Go to C:\ProgramData\ComposerSetup\bin
- Create folder composer2.2
- Copy files  
    - from C:\ProgramData\ComposerSetup\bin
    - to   C:\ProgramData\ComposerSetup\bin\composer2.2
- Rename composer.bat to composer2.2.bat
- Set path composer2.2 to environment variable
- Run `composer1 self-update --2.2`
- Test with `composer2.2 -v`

**Download Composer dependencies**
```
composer2.2 install
```

**Setup the Database**

Again, make sure `app/config/parameters.yml` is setup
for your computer. Then, create the database and the
schema!

```
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
php bin/console doctrine:fixtures:load
```

```
php bin/console serve -d
```

Now check out the site at `http://localhost:8000`

User : ron_furgandy  
Pass : pumpup

## Start
Install jquery  
Go to base.html.twig   
ALT + ENTER on links => Download  
```
{% block javascripts %}  
<script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
{% endblock %}
```

## UnderscoreJS
[CDN Link][1]

## FosJSRouting
[FosJSRouting Link][2]
Might need to run
```
php bin/console assets:install
```
```
composer2.2 require friendsofsymfony/jsrouting-bundle:^1.6
```

## Install SweetAlert2 for Modal
[SweetAlert Link][3]  
[SweetAlert CDN][4]


## Links

[1]: https://cdnjs.com/libraries/underscore.js
[2]: https://github.com/FriendsOfSymfony/FOSJsRoutingBundle/blob/master/Resources/doc/installation.rst
[3]: https://sweetalert2.github.io/
[4]: https://www.jsdelivr.com/package/npm/sweetalert2