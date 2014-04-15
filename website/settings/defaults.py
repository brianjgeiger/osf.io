# -*- coding: utf-8 -*-
"""
Base settings file, common to all environments.
These settings can be overridden in local.py.
"""

import os

def parent_dir(path):
    '''Return the parent of a directory.'''
    return os.path.abspath(os.path.join(path, os.pardir))

HERE = os.path.dirname(os.path.abspath(__file__))
BASE_PATH = parent_dir(HERE)  # website/ directory
STATIC_FOLDER = os.path.join(BASE_PATH, 'static')
STATIC_URL_PATH = "/static"
TEMPLATES_PATH = os.path.join(BASE_PATH, 'templates')
DOMAIN = 'http://localhost:5000/'

# User management & registration
CONFIRM_REGISTRATIONS_BY_EMAIL = True
ALLOW_REGISTRATION = True
ALLOW_LOGIN = True
ALLOW_CLAIMING = True

USE_SOLR = False
SOLR_URI = 'http://localhost:8983/solr/'

# Sessions
# TODO: Override SECRET_KEY in local.py in production
COOKIE_NAME = 'osf'
SECRET_KEY = 'CHANGEME'

# May set these to True in local.py for development
DEV_MODE = False
DEBUG_MODE = False

# External services
USE_CDN_FOR_CLIENT_LIBS = True

USE_EMAIL = True
FROM_EMAIL = 'openscienceframework-noreply@osf.io'
MAIL_SERVER = 'smtp.sendgrid.net'
MAIL_USERNAME = 'osf-smtp'
MAIL_PASSWORD = ''  # Set this in local.py

# TODO: Override in local.py
MAILGUN_API_KEY = None

# TODO: Override in local.py in production
UPLOADS_PATH = os.path.join(BASE_PATH, 'uploads')
MFR_CACHE_PATH = os.path.join(BASE_PATH, 'mfrcache')

# Use Celery for file rendering
USE_CELERY = True

# File rendering timeout (in ms)
MFR_TIMEOUT = 30000

# TODO: Override in local.py in production
DB_PORT = 20771
DB_NAME = 'osf20130903'
DB_USER = None
DB_PASS = None

# Cache settings
SESSION_HISTORY_LENGTH = 5
SESSION_HISTORY_IGNORE_RULES = [
    lambda url: '/static/' in url,
    lambda url: 'favicon' in url,
]

# TODO: Configuration should not change between deploys - this should be dynamic.
CANONICAL_DOMAIN = 'openscienceframework.org'
COOKIE_DOMAIN = '.openscienceframework.org' # Beaker
SHORT_DOMAIN = 'osf.io'

# TODO: Combine Python and JavaScript config
COMMENT_MAXLENGTH = 500

# Gravatar options
GRAVATAR_SIZE_PROFILE = 120
GRAVATAR_SIZE_ADD_CONTRIBUTOR = 40
GRAVATAR_SIZE_DISCUSSION = 20

# User activity style
USER_ACTIVITY_MAX_WIDTH = 325

WIKI_WHITELIST = {
    'tags': [
        'a', 'abbr', 'acronym', 'b', 'bdo', 'big', 'blockquote', 'br',
        'center', 'cite', 'code',
        'dd', 'del', 'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'font',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i', 'img', 'ins',
        'kbd', 'li', 'object', 'ol', 'param', 'pre', 'p', 'q',
        's', 'samp', 'small', 'span', 'strike', 'strong', 'sub', 'sup',
        'table', 'tbody', 'td', 'th', 'thead', 'tr', 'tt', 'ul', 'u',
        'var', 'wbr',
    ],
    'attributes': [
        'align', 'alt', 'border', 'cite', 'class', 'dir',
        'height', 'href', 'src', 'style', 'title', 'type', 'width',
        'face', 'size', # font tags
        'salign', 'align', 'wmode', 'target',
    ],
    # Styles currently used in Reproducibility Project wiki pages
    'styles' : [
        'top', 'left', 'width', 'height', 'position',
        'background', 'font-size', 'text-align', 'z-index',
        'list-style',
    ]
}

##### Celery #####
## Default RabbitMQ broker
BROKER_URL = 'amqp://'

# Default RabbitMQ backend
CELERY_RESULT_BACKEND = 'amqp://'

# Modules to import when celery launches
CELERY_IMPORTS = (
    'framework.email.tasks',
    'framework.tasks',
    'framework.render.tasks'
)

# Add-ons

ADDONS_REQUESTED = [
    'wiki', 'osffiles',
    'github', 's3', 'figshare',
    'badges', 'dropbox', 'trello',
]

ADDON_CATEGORIES = [
    'documentation', 'storage', 'bibliography', 'other',
]

SYSTEM_ADDED_ADDONS = {
    'user': ['badges'],
    'node': []
}

# Piwik

# TODO: Override in local.py in production
PIWIK_HOST = None
PIWIK_ADMIN_TOKEN = None
PIWIK_SITE_ID = None
