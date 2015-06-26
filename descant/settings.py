"""
Django settings for descant project.

**CONSIDER USING ENVIRONMENT VARIABLES FOR GREATER SECURITY**

**BEFORE DEPLOYING, RUN THIS:**
    manage.py check --deploy
**ALSO, READ THIS:**
https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

**REMEMBER, RUN THAT COMMAND ABOVE, OR REGRET IT LATER!**

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.8/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Scroll down to the bottom for configuration settings that you need to change.
# You probably don't need to touch any of the settings below unless you're tinkering
# with Descant's source.

SITE_ID = 1

INSTALLED_APPS = (
    'django_admin_bootstrapped',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'solo',
    'djoser',
    'corsheaders',
    'permission',
    'notifications',
    'forums',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
)

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',  # default
    'permission.backends.PermissionBackend',
)

ANONYMOUS_USER_ID = -1

CORS_ORIGIN_ALLOW_ALL = True

CORS_URLS_REGEX = r'^/api/.*$'


ROOT_URLCONF = 'descant.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.debug',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.request'
            ]
        },
    },
]

BOOTSTRAP_ADMIN_SIDEBAR_MENU = True

WSGI_APPLICATION = 'descant.wsgi.application'


REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
    ),
}

# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

NOTIFICATIONS_USE_JSONFIELD = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = './static/'

ALLOWED_TAGS = [
    'a',
    'abbr',
    'acronym',
    'b',
    'blockquote',
    'code',
    'em',
    'i',
    'li',
    'ol',
    'strong',
    'ul',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'hr',
    'p',
    'pre',
    'br',
    'img',
]

ALLOWED_ATTRIBUTES = {
    'a': ['href', 'title'],
    'abbr': ['title'],
    'acronym': ['title'],
    'img': ['src', 'alt']
}


## EDIT THESE ##

# Change this to a long, random and secure string. Do not release
# it publicly anywhere, or your security will be compromised.
SECRET_KEY = '1g72n-3b=b^!x-_p7tcz58f!p)sg#^r!!vm2v^$i8q874&k9qu'

# Disable debug when your server is working fine.
DEBUG = True

# Set this to your domain name, or Django will crash when Debug is
# turned off.
ALLOWED_HOSTS = []

# Set up your email configuration here
# Get configuration information at:
# https://docs.djangoproject.com/en/1.8/ref/settings/#email-backend
# noinspection PyPackageRequirements
if DEBUG:
    # If debug is on, log emails to a file
    EMAIL_BACKEND = 'django.core.mail.backends.filebased.EmailBackend'
    EMAIL_FILE_PATH = '/tmp/descant-emails'
else:
    # Make sure to update these. Again, ensure that your auth details
    # remain private.
    EMAIL_HOST = 'localhost'
    EMAIL_PORT = 587
    EMAIL_USE_TLS = True

    EMAIL_HOST_USER = 'misconfigured'
    EMAIL_HOST_PASSWORD = 'misconfigured'

# Database settings, get more information at:
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases

# The config below will work fine for SQLite, but you'll get better
# performance with Postgres or MySQL.
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

# See PASSWORD_RESET_CONFIRM_URL's comment to understand what this does
FRONTEND_URL = 'forums/'

# Change these settings to something more appropriate
DJOSER = {
    # Set this to your domain (it'll be put on emails, etc)
    'DOMAIN': 'localhost',
    # Include your site's name here
    'SITE_NAME': 'Descant Forum',
    # Don't edit PASSWORD_RESET or ACTIVATION_URL directly. Instead
    # edit FRONTEND_URL so this would work:
    # DOMAIN/FRONTEND_URL/#/reset?uid={uid}&token={token}
    # For example, if your site's index page is at example.com/descant/
    # you would set DOMAIN to example.com and FRONTEND_URL to descant/
    'PASSWORD_RESET_CONFIRM_URL': FRONTEND_URL + '#/reset?uid={uid}&token={token}',
    'ACTIVATION_URL': FRONTEND_URL + '#/activate?uid={uid}&tpken={token}',
    # Don't touch these.
    'LOGIN_AFTER_ACTIVATION': True,
    'SEND_ACTIVATION_EMAIL': True,
}
