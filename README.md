# Descant
[![Coverage Status](https://coveralls.io/repos/Aurora0000/descant/badge.svg)](https://coveralls.io/r/Aurora0000/descant) ![Travis CI](https://travis-ci.org/Aurora0000/descant.svg)


Free, open-source forum software powered by Angular and Django.

## [Live Demo](http://django-descant.rhcloud.com/static/descant/#/) | [Releases](https://github.com/Aurora0000/descant/releases)

## Features
- RESTful API that provides access to *all* features
- Posting with Markdown formatting.
- Tagging as opposed to categories/forums
- Editing and deleting (for the original poster of the post and staff)
- Responsive front-end UI
- Avatars powered by Gravatar
- Topic locking/unlocking
- Administration Panel (via Django)
- Notifications, Reports and Private Messages

## Installing
For either option below, if you don't have `git`, instead of `git clone`, download the .tar.gz from below, extract and navigate into that folder with your shell, then continue after the `cd descant` line.


### Debian, Ubuntu or other apt-based distributions

    sudo apt-get install python3 python3-pip git
    git clone -b v0.2.0 --depth=1 https://github.com/Aurora0000/descant.git
    cd descant
    sudo pip3 install -r requirements.txt
    sudo python3 manage.py migrate
    sudo python3 manage.py runserver

### Via Docker/Vagrant

    git clone -b v0.2.0 --depth=1 https://github.com/Aurora0000/descant.git
    cd descant
    vagrant up

**Note:** The Vagrant image does *not* serve static files. You'll need to configure nginx to serve up static files. [This](https://gist.github.com/Aurora0000/0af65d3310e2c7d059fb) code may be helpful.

## Translations
- English [native, by [@Aurora0000](https://github.com/Aurora0000)]
- German [native, by [@SplittyDev](https://github.com/SplittyDev)]
- Romanian [native, by [@chronium](https://github.com/chronium)]
- French [***non-native***, by [@Aurora0000](https://github.com/Aurora0000)]
- Spanish [***non-native***, by [@Tel-Aviv](https://github.com/Tel-Aviv)]
- Simplified Chinese [***non-native***, by [@CallumDev](https://github.com/CallumDev)]

## Developing with Descant
If you're interested in developing the front-end of Descant, take a look in static/descant/. Otherwise, you'll find the descant/ and forums/ directories interesting.
