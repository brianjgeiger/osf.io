"""
Views to get data to and from the javascript components onto various views. Essentially everything that's not the
Auth views right now, though this could clearly be refactored.

A note for people who come along and want to use this code: The pattern I used where I catch the TrelloError
and pass it along as successful JSON with an error flag is not a good way to do it. It was a hack because
I couldn't get past the exception reporting mechanism on the front end otherwise. There are better ways to do this,
and if I had the time, I would go back and fix it. So don't copy that pattern.
"""

import httplib as http
from framework import request
from framework.exceptions import HTTPError as OSFHTTPError

from website.project.decorators import must_have_permission
from website.project.decorators import must_not_be_registration
from website.project.decorators import must_be_contributor_or_public
from website.project.decorators import must_have_addon
from website.project.views.node import _view_project
from website.addons.trello.api import Trello
import logging
from dateutil import parser
from ..exceptions import TrelloError
from requests import HTTPError as RequestsHTTPError
from ..model import can_user_write_to_project_board

logger = logging.getLogger(__name__)


@must_have_permission('write')
@must_not_be_registration
@must_have_addon('trello', 'node')
def trello_set_config(**kwargs):
    auth = kwargs['auth']
    node_settings = kwargs['node_addon']
    node = node_settings.owner

    trello_board_id = request.json.get('trello_board_id')
    trello_board_name = request.json.get('trello_board_name')

    if not trello_board_id or not trello_board_name:
        raise OSFHTTPError(http.BAD_REQUEST)

    changed = trello_board_id != node_settings.trello_board_id or trello_board_name != node_settings.trello_board_name

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
def trello_page(project, node, **kwargs):
    auth = kwargs['auth']
    node = node or project
    node_settings = kwargs['node_addon']
    trello = node.get_addon('trello')
    trello_board_name = node_settings.trello_board_name
    trello_board_id = node_settings.trello_board_id
    user_can_edit = can_user_write_to_project_board(**kwargs)
    return_value = \
        {
            'addon_page_js': trello.config.include_js['page'],
            'addon_page_css': trello.config.include_css['page'],
            'user_can_edit': user_can_edit,
            'node_url': node.api_url,
        }
    if trello_board_name is not None:
        trello_board_name = trello_board_name.strip()
        data = _view_project(node, auth)
        return_value['complete'] = True
        return_value['trello_board_name'] = trello_board_name
        return_value['trello_board_id'] = trello_board_id

    else:
        data = _view_project(node, auth)
        return_value['complete'] = False
        return_value['error'] = True
        return_value['errorInfo'] = "Could not find board in project settings"
        return_value['trello_board_name'] = None
        return_value['trello_board_id'] = None

    return_value.update(data)
    return return_value


@must_be_contributor_or_public
@must_have_addon('trello', 'node')
def trello_lists(**kwargs):
    node_settings = kwargs.get('node_addon')
    trello_board_name = node_settings.trello_board_name.strip()
    trello_board_id = node_settings.trello_board_id
    user_can_edit = can_user_write_to_project_board(**kwargs)

    if trello_board_name is not None:
        try:
            trello_api = Trello.from_settings(node_settings.user_settings)
        except RequestsHTTPError as e:
            return_value = {
                'error': True,
                'HTTPError': e[0][0],
                'errorInfo': "Could not connect to Trello",
                'trello_board_id': trello_board_id,
            }
            return return_value
        try:
            trello_board_url = trello_api.get_board_url(trello_board_id)
            the_lists = trello_api.get_lists_from_board(trello_board_id)
        except TrelloError as e:
            return_value = {
                'complete': True,
                'error': True,
                'errorInfo': "Could not load Trello Board",
                'HTTPError': e[0][0],
                'trello_cards': {},
                'trello_board_id': trello_board_id,
                'user_can_edit': user_can_edit,
            }
            return return_value

        return_value = {
            'complete': True,
            'trello_board_name': trello_board_name,
            'trello_board_url': trello_board_url,
            'trello_lists': the_lists,
            'user_can_edit': user_can_edit,
        }
    else:
        return_value = {
            'complete': False,
            'error': True,
            'errorInfo': "Could not find board in project settings",
            'trello_lists': {u'name': "", },
            'trello_board_url': None,
            'trello_board_name': None,
            'user_can_edit': user_can_edit,
        }
    return return_value


@must_be_contributor_or_public
@must_have_addon('trello', 'node')
def trello_cards_from_lists(**kwargs):
    node_settings = kwargs['node_addon']

    list_id = kwargs['listid']
    return_value = {
        'complete': True,
        'trello_cards': {},
        'trello_list_id': list_id,
    }
    user_can_edit = can_user_write_to_project_board(**kwargs)
    try:
        trello_api = Trello.from_settings(node_settings.user_settings)
    except RequestsHTTPError as e:
        return_value = {
            'error': True,
            'HTTPError': e[0][0],
            'errorInfo': "Could not connect to Trello",
            'trello_list_id': list_id,
        }
        return return_value
    try:
        cards = trello_api.get_cards_from_list(list_id)
        for card in cards:
            if card['badges']['due'] is not None:
                due_date = parser.parse(card['badges']['due'])
                card['due_date_string'] = due_date.strftime('%b %d')
            else:
                card['due_date_string'] = ""
            if card[u'badges'][u'attachments'] > 0:
                attachments = trello_api.get_attachments_from_card(card[u'id'], attachment_filter="cover")
                cover_url = get_cover_url(attachments)
                if cover_url is not None:
                    card[u'coverURL'] = cover_url

        return_value = {
            'complete': True,
            'trello_cards': cards,
            'trello_list_id': list_id,
            'user_can_edit': user_can_edit,
        }
    except TrelloError as e:
        return_value = {
            'complete': True,
            'error': True,
            'errorInfo': "Could not load cards for the list",
            'HTTPError': e[0][0],
            'trello_cards': {},
            'trello_list_id': list_id,
            'user_can_edit': user_can_edit,
        }
    return return_value


def get_checked_state(check_item):
    if check_item['state'] == 'complete':
        return 'checked'
    else:
        return ''


def get_preview_url(previews):
    for preview in previews:
        if "url" in preview:
            return preview[u'url']
    return None


def get_cover_url(attachments):
    for attachment in attachments:
        if "previews" in attachment:
            return get_preview_url(attachment[u'previews'])
    return None


@must_be_contributor_or_public
@must_have_addon('trello', 'node')
def trello_card_details(**kwargs):
    node_settings = kwargs['node_addon']

    card_id = kwargs['cardid']
    return_value = {
        'complete': True,
        'trello_card': {},
        'trello_card_id': card_id,
    }
    user_can_edit = can_user_write_to_project_board(**kwargs)
    try:
        trello_api = Trello.from_settings(node_settings.user_settings)
    except RequestsHTTPError as e:
        return_value = {
            'error': True,
            'HTTPError': e[0][0],
            'errorInfo': "Could not connect to Trello",
            'trello_card_id': card_id,
        }
        return return_value
    try:
        card = trello_api.get_card(card_id)
        if card[u'badges'][u'attachments'] > 0:
            attachments = trello_api.get_attachments_from_card(card[u'id'], attachment_filter="cover")
            cover_url = get_cover_url(attachments)
            if cover_url is not None:
                card[u'coverURL'] = cover_url
        card[u'comments'] = trello_api.get_comments_from_card(card_id)
        card[u'checklists'] = trello_api.get_checklists_from_card(card_id)
        for checklist in card[u'checklists']:
            checklist[u'checkItems'] = trello_api.get_checkitems(checklist[u'id'])
            for check_item in checklist[u'checkItems']:
                check_item['checked'] = get_checked_state(check_item)
        return_value = {
            'complete': True,
            'trello_card': card,
            'trello_card_id': card_id,
            'user_can_edit': user_can_edit,
        }
    except TrelloError as e:
        return_value = {
            'complete': True,
            'error': True,
            'errorInfo': "Could not load card details",
            'HTTPError': e[0][0],
            'trello_card': {},
            'trello_card_id': card_id,
            'user_can_edit': user_can_edit,
        }
    return return_value


@must_be_contributor_or_public
@must_have_addon('trello', 'node')
def trello_card_attachments(**kwargs):
    node_settings = kwargs['node_addon']

    card_id = kwargs['cardid']
    return_value = {
        'complete': True,
        'attachments': {},
        'trello_card_id': card_id,
    }

    trello_api = Trello.from_settings(node_settings.user_settings)
    try:
        attachments = trello_api.get_attachments_from_card(card_id)
        for attachment in attachments:
            attachment['previewType'] = ""
            attachment['previewURL'] = ""
            number_of_previews = len(attachment['previews'])
            if number_of_previews > 0:
                preview_item = min(1, number_of_previews)
                attachment['previewURL'] = attachment['previews'][preview_item]['url']
            else:
                name_split = attachment['name'].split('.')
                if len(name_split) > 1:
                    attachment['previewType'] = name_split[len(name_split) - 1]
        return_value = {
            'complete': True,
            'attachments': attachments,
            'trello_card_id': card_id,
        }
    except TrelloError as e:
        return_value = {
            'complete': True,
            'error': True,
            'errorInfo': "Could not load attachments from card",
            'HTTPError': e[0][0],
            'attachments': {},
            'trello_card_id': card_id,
        }
    return return_value


@must_have_permission('write')
@must_have_addon('trello', 'node')
def trello_card_add(**kwargs):
    node_settings = kwargs['node_addon']
    return_value = None
    try:
        list_id = request.json.get('listid', '')
        new_card_name = request.json.get('cardname', '')
    except:
        raise OSFHTTPError(http.BAD_REQUEST)

    if not (list_id and new_card_name):
        raise OSFHTTPError(http.BAD_REQUEST)

    try:
        trello_api = Trello.from_settings(node_settings.user_settings)
    except RequestsHTTPError as e:
        return_value = {
            'error': True,
            'HTTPError': e[0][0],
            'errorInfo': "Could not connect to Trello",
            'list_id': list_id,
        }
        return return_value
    try:
        return_value = trello_api.create_card_in_list(card_name=new_card_name, list_id=list_id)
    except TrelloError as e:
        return_value = {
            'error': True,
            'HTTPError': e[0][0],
            'errorInfo': "Could not add a card",
            'list_id': list_id,
        }
        return return_value
    return return_value


@must_have_permission('write')
@must_have_addon('trello', 'node')
def trello_card_update(**kwargs):
    node_settings = kwargs['node_addon']
    try:
        new_list_id = request.json.get('listid', None)
        new_card_pos = request.json.get('cardpos', None)
        card_id = request.json.get('cardid', '')
        new_card_name = request.json.get('cardname', None)
        card_closed = request.json.get('closed', None)
    except:
        raise OSFHTTPError(http.BAD_REQUEST)
    else:
        if not card_id:
            raise OSFHTTPError(http.BAD_REQUEST)

    try:
        trello_api = Trello.from_settings(node_settings.user_settings)
    except RequestsHTTPError as e:
        return_value = {
            'error': True,
            'HTTPError': e[0][0],
            'errorInfo': "Could not connect to Trello",
            'trello_card_id': card_id,
        }
        return return_value
    try:
        trello_api.update_card(card_id=card_id, id_list=new_list_id, pos=new_card_pos, name=new_card_name,
                               closed=card_closed)
    except TrelloError as e:
        return_value = {
            'error': True,
            'HTTPError': e[0][0],
            'errorInfo': "Could not update card",
            'trello_card_id': card_id,
        }
        return return_value


@must_have_permission('write')
@must_have_addon('trello', 'node')
def trello_card_delete(**kwargs):
    node_settings = kwargs['node_addon']
    return_value = None
    try:
        card_id = request.json.get('cardid', '')
    except:
        raise OSFHTTPError(http.BAD_REQUEST)

    if not card_id:
        raise OSFHTTPError(http.BAD_REQUEST)

    try:
        trello_api = Trello.from_settings(node_settings.user_settings)
    except RequestsHTTPError as e:
        return_value = {
            'error': True,
            'HTTPError': e[0][0],
            'errorInfo': "Could not connect to Trello",
            'card_id': card_id,
        }
        return return_value
    try:
        return_value = trello_api.delete_card(card_id)
    except TrelloError as e:
        return_value = {
            'error': True,
            'HTTPError': e[0][0],
            'errorInfo': "Could not delete checklist",
            'card_id': card_id,
        }
        return return_value
    return return_value


@must_have_permission('write')
@must_have_addon('trello', 'node')
def trello_card_description_update(**kwargs):
    node_settings = kwargs['node_addon']
    try:
        card_id = request.json.get('cardid', '')
        new_desc = request.json.get('desc', None)
    except:
        raise OSFHTTPError(http.BAD_REQUEST)
    if not (card_id and new_desc):
        raise OSFHTTPError(http.BAD_REQUEST)

    try:
        trello_api = Trello.from_settings(node_settings.user_settings)
    except RequestsHTTPError as e:
        return_value = {
            'error': True,
            'HTTPError': e[0][0],
            'errorInfo': "Could not connect to Trello",
            'trello_card_id': card_id,
        }
        return return_value
    try:
        trello_api.update_card_description(card_id=card_id, desc=new_desc)
    except TrelloError as e:
        return_value = {
            'error': True,
            'HTTPError': e[0][0],
            'errorInfo': "Could not update card description",
            'trello_card_id': card_id,
        }
        return return_value


@must_have_permission('write')
@must_have_addon('trello', 'node')
def trello_checklist_add(**kwargs):
    node_settings = kwargs['node_addon']
    return_value = None
    try:
        card_id = request.json.get('cardid', '')
        checklist_name = request.json.get('checklistname', '')
    except:
        raise OSFHTTPError(http.BAD_REQUEST)

    if not (card_id and checklist_name):
        raise OSFHTTPError(http.BAD_REQUEST)

    try:
        trello_api = Trello.from_settings(node_settings.user_settings)
    except RequestsHTTPError as e:
        return_value = {
            'error': True,
            'HTTPError': e[0][0],
            'errorInfo': "Could not connect to Trello",
            'card_id': card_id,
        }
        return return_value
    try:
        return_value = trello_api.create_checklist_in_card(card_id=card_id, name=checklist_name)
    except TrelloError as e:
        return_value = {
            'error': True,
            'HTTPError': e[0][0],
            'errorInfo': "Could not add a checklist to the card",
            'card_id': card_id,
        }
        return return_value
    return return_value


@must_have_permission('write')
@must_have_addon('trello', 'node')
def trello_checklist_update(**kwargs):
    node_settings = kwargs['node_addon']

    try:
        checklist_id = request.json.get('checklistid', '')
        new_checklist_name = request.json.get('checklistname', None)
    except:
        raise OSFHTTPError(http.BAD_REQUEST)

    if not checklist_id:
        raise OSFHTTPError(http.BAD_REQUEST)

    try:
        trello_api = Trello.from_settings(node_settings.user_settings)
    except RequestsHTTPError as e:
        return_value = {
            'error': True,
            'HTTPError': e[0][0],
            'errorInfo': "Could not connect to Trello",
            'checklist_id': checklist_id,
        }
        return return_value
    try:
        trello_api.update_checklist(checklist_id=checklist_id, name=new_checklist_name)
    except TrelloError as e:
        return_value = {
            'error': True,
            'HTTPError': e[0][0],
            'errorInfo': "Could not update checklist",
            'checklist_id': checklist_id,
        }
        return return_value


@must_have_permission('write')
@must_have_addon('trello', 'node')
def trello_checklist_delete(**kwargs):
    node_settings = kwargs['node_addon']
    return_value = None
    try:
        card_id = request.json.get('cardid', '')
        checklist_id = request.json.get('checklistid', '')
    except:
        raise OSFHTTPError(http.BAD_REQUEST)

    if not (card_id and checklist_id):
        raise OSFHTTPError(http.BAD_REQUEST)
    try:
        trello_api = Trello.from_settings(node_settings.user_settings)
    except RequestsHTTPError as e:
        return_value = {
            'error': True,
            'HTTPError': e[0][0],
            'errorInfo': "Could not connect to Trello",
            'checklist_id': checklist_id,
        }
        return return_value
    try:
        return_value = trello_api.delete_checklist_from_card(card_id=card_id, checklist_id=checklist_id)
    except TrelloError as e:
        return_value = {
            'error': True,
            'HTTPError': e[0][0],
            'errorInfo': "Could not delete checklist",
            'checklist_id': checklist_id,
        }
        return return_value
    return return_value


@must_have_permission('write')
@must_have_addon('trello', 'node')
def trello_checkitem_add(**kwargs):
    node_settings = kwargs['node_addon']
    return_value = None
    try:
        checklist_id = request.json.get('checklistid', '')
        checkitem_name = request.json.get('checkitemname', '')
    except:
        raise OSFHTTPError(http.BAD_REQUEST)

    if not (checklist_id and checkitem_name):
        raise OSFHTTPError(http.BAD_REQUEST)

    try:
        trello_api = Trello.from_settings(node_settings.user_settings)
    except RequestsHTTPError as e:
        return_value = {
            'error': True,
            'HTTPError': e[0][0],
            'errorInfo': "Could not connect to Trello",
            'checklist_id': checklist_id,
        }
        return return_value
    try:
        return_value = trello_api.create_checkitem_in_checklist(checklist_id=checklist_id,
                                                                checkitem_name=checkitem_name)
    except TrelloError as e:
        return_value = {
            'error': True,
            'HTTPError': e[0][0],
            'errorInfo': "Could not add an item to the checklist",
            'checklist_id': checklist_id,
        }
        return return_value
    return return_value


@must_have_permission('write')
@must_have_addon('trello', 'node')
def trello_checkitem_update(**kwargs):
    node_settings = kwargs['node_addon']
    return_value = None

    card_id = request.json.get('cardid', '')
    checklist_id = request.json.get('checklistid', '')
    checkitem_id = request.json.get('checkitemid', '')
    checkitem_state = request.json.get('state', None)
    checkitem_pos = request.json.get('pos', None)
    checkitem_name = request.json.get('name', None)

    if not (card_id and checklist_id and checkitem_id):
        raise OSFHTTPError(http.BAD_REQUEST)

    try:
        trello_api = Trello.from_settings(node_settings.user_settings)
    except RequestsHTTPError as e:
        return_value = {
            'error': True,
            'HTTPError': e[0][0],
            'errorInfo': "Could not connect to Trello",
            'card_id': card_id,
            'checklist_id': checklist_id,
            'checkitem_id': checkitem_id,
        }
        return return_value
    try:
        return_value = trello_api.update_checkitem(
            card_id=card_id,
            checklist_id=checklist_id,
            checkitem_id=checkitem_id,
            state=checkitem_state,
            name=checkitem_name,
            pos=checkitem_pos,
        )
    except TrelloError as e:
        return_value = {
            'error': True,
            'HTTPError': e[0][0],
            'errorInfo': "Could not update checklist item",
            'card_id': card_id,
            'checklist_id': checklist_id,
            'checkitem_id': checkitem_id,
        }
        return return_value
    return return_value


@must_have_permission('write')
@must_have_addon('trello', 'node')
def trello_checkitem_delete(**kwargs):
    node_settings = kwargs['node_addon']
    return_value = None
    try:
        checkitem_id = request.json.get('checkitemid', '')
        checklist_id = request.json.get('checklistid', '')
    except:
        raise OSFHTTPError(http.BAD_REQUEST)

    if not (checkitem_id and checklist_id):
        raise OSFHTTPError(http.BAD_REQUEST)


    try:
        trello_api = Trello.from_settings(node_settings.user_settings)
    except RequestsHTTPError as e:
        return_value = {
            'error': True,
            'HTTPError': e[0][0],
            'errorInfo': "Could not connect to Trello",
            'checklist_id': checklist_id,
            'checkitem_id': checkitem_id,
        }
        return return_value
    try:
        return_value = trello_api.delete_checkitem(checkitem_id=checkitem_id, checklist_id=checklist_id)
    except TrelloError as e:
        return_value = {
            'error': True,
            'HTTPError': e[0][0],
            'errorInfo': "Could not delete checklist item",
            'checklist_id': checklist_id,
            'checkitem_id': checkitem_id,
        }
        return return_value
    return return_value