Javascript for PHP Geeks Tutorial
=================================
 [Modern JavaScript Tutorials](http://knpuniversity.com/tracks/javascript#modern-javascript)

## Setup
**Setup parameters.yml**
First, make sure you have an `app/config/parameters.yml`
file (you should). If you don't, copy `app/config/parameters.yml.dist`
to get it.


**Download Composer dependencies**
```
composer install
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

User : ron_furgundy
Pass : pumpup

### GO ###
