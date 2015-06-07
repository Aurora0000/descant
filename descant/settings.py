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
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'djoser',
    'corsheaders',
    'permission',
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
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

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

# Change these settings to something more appropriate
DJOSER = {
    # Set this to your domain (it'll be put on emails, etc)
    'DOMAIN': 'localhost',
    # Include your site's name here
    'SITE_NAME': 'Descant Forum',
    # Currently not available in the front-end UI, so users will have to interact
    # with the API directly
    'PASSWORD_RESET_CONFIRM_URL': 'api/auth/password/reset/confirm/{uid}/{token}',
    # Change this to <frontend_url>/#/activate?uid={uid}&token={token}
    # Make sure to replace <frontend_url> with the actual front-end URL,
    # relative to 'DOMAIN', like this: forums/#/activate?uid={uid}&token={token}
    'ACTIVATION_URL': 'api/auth/activate/{uid}/{token}',
    # Don't touch these.
    'LOGIN_AFTER_ACTIVATION': True,
    'SEND_ACTIVATION_EMAIL': True,
}
