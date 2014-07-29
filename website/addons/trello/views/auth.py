import os
import httplib as http

from framework import request, redirect
from framework.auth import get_current_user
from framework.auth.decorators import must_be_logged_in
from framework.exceptions import HTTPError

from website import models
from website.project.decorators import must_have_permission
from website.project.decorators import must_have_addon

from ..auth import oauth_start_url, oauth_get_token


@must_have_permission('write')
@must_have_addon('trello', 'node')
def trello_add_user_auth(**kwargs):
    user = kwargs['auth'].user

    user_settings = user.get_addon('trello')
    node_settings = kwargs['node_addon']

    if node_settings is None or user_settings is None:
        raise HTTPError(http.BAD_REQUEST)

    node_settings.user_settings = user_settings
    node_settings.save()

    return {}


@must_be_logged_in
def trello_oauth_start(**kwargs):
    user = get_current_user()

    nid = kwargs.get('nid') or kwargs.get('pid')
    node = models.Node.load(nid) if nid else None

    # Fail if node provided and user not contributor
    if node and not node.is_contributor(user):
        raise HTTPError(http.FORBIDDEN)

    user.add_addon('trello')
    user_settings = user.get_addon('trello')

    if node:
        trello_node = node.get_addon('trello')
        trello_node.user_settings = user_settings
        trello_node.save()

    request_token, request_token_secret, authorization_url = oauth_start_url(user, node)

    user_settings.oauth_request_token = request_token
    user_settings.oauth_request_token_secret = request_token_secret
    user_settings.save()

    return redirect(authorization_url)


#TODO: Revoke authorization through Trello
@must_have_addon('trello', 'user')
def trello_oauth_delete_user(**kwargs):
    trello_user = kwargs['user_addon']

    trello_user.oauth_access_token = None
    trello_user.oauth_token_type = None
    trello_user.save()

    return {}


@must_have_permission('write')
@must_have_addon('trello', 'node')
def trello_oauth_delete_node(**kwargs):
    auth = kwargs['auth']
    node = kwargs['node'] or kwargs['project']
    node_settings = node.get_addon('trello')
    board_name = node_settings.trello_board_name
    user_id = node_settings.trello_user_id
    node_settings.user_settings = None
    node_settings.trello_user_id = None
    node_settings.trello_board_name = None
    node_settings.trello_board_id = None
    node_settings.save()

    node.add_log(
        action='trello_content_unlinked',
        params={
            'project': node.parent_id,
            'node': node._id,
            'trello': {
                'trello_board_name': board_name,
                'trello_user_id': user_id
            }
        },
        auth=auth,
    )

    return {}


def trello_oauth_callback(**kwargs):
    user = get_current_user()

    nid = kwargs.get('nid') or kwargs.get('pid')
    node = models.Node.load(nid) if nid else None

    # Fail if node provided and user not contributor
    if node and not node.is_contributor(user):
        raise HTTPError(http.FORBIDDEN)

    if user is None:
        raise HTTPError(http.NOT_FOUND)
    if kwargs.get('nid') and not node:
        raise HTTPError(http.NOT_FOUND)

    trello_user = user.get_addon('trello')
    if not trello_user:
        return redirect('/settings/')

    verifier = request.args.get('oauth_verifier')

    access_token, access_token_secret = oauth_get_token(
        trello_user.oauth_request_token,
        trello_user.oauth_request_token_secret,
        verifier
    )
    if not access_token or not access_token_secret:
        return redirect('/settings/')

    trello_user.oauth_request_token = None
    trello_user.oauth_request_token_secret = None
    trello_user.oauth_access_token = access_token
    trello_user.oauth_access_token_secret = access_token_secret
    trello_user.save()

    if node:
        trello_node = node.get_addon('trello')

        trello_node.user_settings = trello_user
        trello_node.save()
        return redirect(os.path.join(node.url, 'settings'))
    return redirect('/settings/')
