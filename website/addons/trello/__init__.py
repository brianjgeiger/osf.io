from .model import AddonTrelloNodeSettings, AddonTrelloUserSettings
from .routes import settings_routes,page_routes, widget_routes

MODELS = [
    AddonTrelloNodeSettings,
    AddonTrelloUserSettings,

    ]
USER_SETTINGS_MODEL = AddonTrelloUserSettings
NODE_SETTINGS_MODEL = AddonTrelloNodeSettings

ROUTES = [settings_routes, page_routes, widget_routes ]

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
    'page': [],
}

INCLUDE_CSS = {
    'page': [],
}

WIDGET_HELP = 'Trello Add-on Alpha'
