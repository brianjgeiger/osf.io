"""

"""

from framework.routing import Rule, json_renderer
from . import views
from website.routes import OsfWebRenderer


widget_routes = {
    'rules': [
        Rule([
            '/project/<pid>/trello/widget/',
            '/project/<pid>/node/<nid>/trello/widget/',
        ], 'get', views.misc.trello_widget, json_renderer),
    ],
    'prefix': '/api/v1',
}

settings_routes = {
    'rules': [
        Rule([
            '/project/<pid>/trello/settings/',
            '/project/<pid>/node/<nid>/trello/settings/',
        ], 'post', views.misc.trello_set_config, json_renderer),
        # OAuth: User
        Rule(
            '/settings/trello/oauth/',
            'get',
            views.auth.trello_oauth_start,
            json_renderer,
            endpoint_suffix='__user',
        ),
        Rule(
            '/settings/trello/oauth/',
            'delete',
            views.auth.trello_oauth_delete_user,
            json_renderer,
        ),

        # OAuth: Node
        Rule(
            [
                '/project/<pid>/trello/oauth/',
                '/project/<pid>/node/<nid>/trello/oauth/',
            ],
            'get',
            views.auth.trello_oauth_start,
            json_renderer,
        ),
        Rule(
            [
                '/project/<pid>/trello/user_auth/',
                '/project/<pid>/node/<nid>/trello/user_auth/',
            ],
            'post',
            views.auth.trello_add_user_auth,
            json_renderer,
        ),
        Rule(
            [
                '/project/<pid>/trello/oauth/',
                '/project/<pid>/node/<nid>/trello/oauth/',
            ],
            'delete',
            views.auth.trello_oauth_delete_node,
            json_renderer,
        ),

        # OAuth: General
        Rule(
            [
                '/addons/trello/callback/<uid>/',
                '/addons/trello/callback/<uid>/<nid>/',
            ],
            'get',
            views.auth.trello_oauth_callback,
            json_renderer,
        ),
    ],
    'prefix': '/api/v1',
}

page_routes = {
    'rules': [
        Rule([
            '/project/<pid>/trello/',
            '/project/<pid>/node/<nid>/trello/',
        ], 'get', views.misc.trello_page, OsfWebRenderer('../addons/trello/templates/trello_page.mako')),
    ],
}
