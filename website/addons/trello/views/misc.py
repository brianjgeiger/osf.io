"""

"""

import httplib as http

from framework import request
from framework.exceptions import HTTPError

from website.project.decorators import must_have_permission
from website.project.decorators import must_not_be_registration
from website.project.decorators import must_be_contributor_or_public
from website.project.decorators import must_have_addon
from website.project.views.node import _view_project
from ..api import Trello
import logging

logger = logging.getLogger(__name__)

@must_have_permission('write')
@must_not_be_registration
@must_have_addon('trello', 'node')
def trello_set_config(*args, **kwargs):

    auth = kwargs['auth']
    node_settings = kwargs['node_addon']
    node = node_settings.owner

    trello = node.get_addon('trello')
    try:
        trello_board_id = request.json.get('trello_board_id','')
        trello_board_name = request.json.get('trello_board_name','')
    except:
        raise HTTPError(http.BAD_REQUEST)

    if not trello_board_id:
        raise HTTPError(http.BAD_REQUEST)

    changed = (
        trello_board_id != node_settings.trello_board_id or
        trello_board_name != node_settings.trello_board_name
    )
    if changed:
        node_settings.trello_board_id = trello_board_id
        node_settings.trello_board_name = trello_board_name
        node_settings.save()

    node.add_log(
            action='trello_content_linked',
            params={
                'project': node.parent_id,
                'node': node._id,
                'trello': {
                    'id': trello_board_id,
                    'trello_board_name': trello_board_name,
                }
            },
            auth=auth,
            )

@must_be_contributor_or_public
@must_have_addon('trello', 'node')
def trello_widget(*args, **kwargs):
    node = kwargs['node'] or kwargs['project']
    trello = node.get_addon('trello')
    summary = trello._summarize_references()
    rv = {
        'complete': bool(summary),
        'summary': summary,
    }
    rv.update(trello.config.to_json())
    return rv


@must_be_contributor_or_public
@must_have_addon('trello', 'node')
def trello_page(auth, project, node, **kwargs):
    node = node or project
    node_settings = kwargs['node_addon']
    trello = node.get_addon('trello')
    trello_board_name = node_settings.trello_board_name.strip()
    trello_board_id = node_settings.trello_board_id

    if trello_board_name is not None:
        trello_api = Trello.from_settings(node_settings.user_settings)
        trello_board_url = trello_api.get_board_url(trello_board_id)
        trello_lists = trello_api.get_lists_from_board(trello_board_id)
        trello_cards = trello_api.get_cards_from_board(trello_board_id)
        for trello_list in trello_lists:
            trello_list[u'cards'] = trello_api.get_cards_from_list(trello_list[u'id'])
            for card in trello_list[u'cards']:
                # TODO: Slloooww. Needs optimization probably need to bundle trello requests if possible
                card[u'comments'] = trello_api.get_comments_from_card(card[u'id'])
                checklists = trello_api.get_checklists_from_card(card[u'id'])
                checkItemCount = 0
                checkedItemCount = 0
                for checklist in checklists:
                    checkItems = trello_api.get_checkitems(checklist[u'id'])
                    for checkItem in checkItems:
                        checkItemCount += 1
                        if checkItem[u'state'] == 'complete':
                           checkedItemCount += 1
                card[u'checkItemCount'] = checkItemCount
                card[u'checkedItemCount'] = checkedItemCount
                attachments = trello_api.get_attachments_from_card(card[u'id'],filter="cover")
                for attachment in attachments:
                    if "previews" in attachment:
                        previews = attachment[u'previews']
                        logger.log(10,"Card:" + card[u'name'])
                        logger.log(10,previews)
                        for preview in previews:
                            if "url" in preview:
                                card[u'coverURL'] = preview[u'url']
                                logger.log(10,card[u'coverURL'])
                            else:
                                logger.log(10,"No Preview URL")
        data = _view_project(node, auth)

        # xml = trello._fetch_references()

        return_value = {
            'complete': True,
            # 'xml': xml,
            'trello_board_name': trello_board_name,
            'trello_board_url': trello_board_url,
            'trello_lists': trello_lists,
            'trello_cards': trello_cards,
            'addon_page_js': trello.config.include_js['page'],
            'addon_page_css': trello.config.include_css['page'],
        }
    else:
        data = _view_project(node, auth)
        return_value = {
            'complete': False,
            # 'xml': xml,
            'trello_lists': {u'name': "", },
            'trello_cards': {},
            'trello_board_url': None,
            'trello_board_name': None,
            'addon_page_js': trello.config.include_js['page'],
            'addon_page_css': trello.config.include_css['page'],

        }
    return_value.update(data)

    return return_value
