from .model import AddonTrelloNodeSettings, AddonTrelloUserSettings
from .routes import settings_routes,page_routes, widget_routes, api_routes

MODELS = [
    AddonTrelloNodeSettings,
    AddonTrelloUserSettings,

    ]
USER_SETTINGS_MODEL = AddonTrelloUserSettings
NODE_SETTINGS_MODEL = AddonTrelloNodeSettings

ROUTES = [settings_routes, page_routes, widget_routes, api_routes ]

SHORT_NAME = 'trello'
FULL_NAME = 'Trello'

OWNERS = ['user','node']

ADDED_TO = {
    'node': False,
}

VIEWS = [ 'page']
CONFIGS = ['node', 'user']

CATEGORIES = ['other']

INCLUDE_JS = {
    'page': [
        'showdown.js',
        'kanbanic.js',
        'jquery.kinetic.js' ,
        'handlebars-v1.3.0.js',
        'Autolinker.js',
        'alertify.js',
    ]
}

INCLUDE_CSS = {
    'page': ['trelloboard.css',
             'alertify.default.css',
             'alertify.core.css',
             '//code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.css'],
}

WIDGET_HELP = 'Trello Add-on Alpha'
