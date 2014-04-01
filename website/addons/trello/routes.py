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

        # Data Gathering for Javascript
          Rule(
            [
            '/<nid>/trello/card/<cardid>',
            '/<pid>/node/<nid>/trello/card/<cardid>',
            ],
            'get',
            views.misc.trello_card_details,
            json_renderer,
        ),
          Rule(
            [
            '/<nid>/trello/list/<listid>',
            '/<pid>/node/<nid>/trello/list/<listid>',
            ],
            'get',
            views.misc.trello_list_cards,
            json_renderer,
        ),
           Rule(
            [
            '/<nid>/trello/lists',
            '/<pid>/node/<nid>/trello/lists',
            ],
            'get',
            views.misc.get_trello_lists,
            json_renderer,
        ),
         Rule(
            [
            '/<nid>/trello/card',
            '/<pid>/node/<nid>/trello/card',
            ],
            'put',
            views.misc.trello_card_update,
            json_renderer,
        ),
         Rule(
            [
            '/<nid>/trello/checkitem',
            '/<pid>/node/<nid>/trello/checkitem',
            ],
            'put',
            views.misc.trello_edit_checkitem,
            json_renderer,
        ),
          Rule(
            [
            '/<nid>/trello/attachments/<cardid>',
            '/<pid>/node/<nid>/trello/attachments/<cardid>',
            ],
            'get',
            views.misc.trello_card_attachments,
            json_renderer,
        ),
          Rule(
            [
            '/<nid>/trello/card/',
            '/<pid>/node/<nid>/trello/card/',
            ],
            'post',
            views.misc.trello_add_card_to_list,
            json_renderer,
        ),
          Rule(
            [
            '/<nid>/trello/card/',
            '/<pid>/node/<nid>/trello/card/',
            ],
            'delete',
            views.misc.trello_delete_card,
            json_renderer,
        ),
          Rule(
            [
            '/<nid>/trello/checkitem/',
            '/<pid>/node/<nid>/trello/checkitem/',
            ],
            'post',
            views.misc.trello_add_item_to_checklist,
            json_renderer,
        ),
          Rule(
            [
            '/<nid>/trello/checkitem/',
            '/<pid>/node/<nid>/trello/checkitem/',
            ],
            'delete',
            views.misc.trello_delete_checkitem,
            json_renderer,
        ),
   ],

}
