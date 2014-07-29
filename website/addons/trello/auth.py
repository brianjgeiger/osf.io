"""
Get access to Trello using OAuth 1.0.
"""

import os
from requests_oauthlib import OAuth1Session
import logging

from website import settings
from . import settings as trello_settings

OAUTH_REQUEST_TOKEN_URL = 'https://trello.com/1/OAuthGetRequestToken'
OAUTH_AUTHORIZE_URL = 'https://trello.com/1/OAuthAuthorizeToken'
OAUTH_ACCESS_TOKEN_URL = 'https://trello.com/1/OAuthGetAccessToken'

logger = logging.getLogger(__name__)


def oauth_start_url(user, node=None):
    """Get authorization URL for OAuth.

    :param User user: OSF user
    :param Node node: OSF node
    :return tuple: Tuple of authorization URL and OAuth state

    """
    uri_parts = [
        settings.DOMAIN, 'api', 'v1', 'addons', 'trello',
        'callback', user._id,
    ]
    if node:
        uri_parts.append(node._id)
    callback_uri = os.path.join(*uri_parts)

    session = OAuth1Session(
        trello_settings.CLIENT_ID,
        client_secret=trello_settings.CLIENT_SECRET,
        callback_uri=callback_uri
    )

    request_key = session.fetch_request_token(OAUTH_REQUEST_TOKEN_URL)
    resource_owner_key = request_key.get('oauth_token')
    resource_owner_secret = request_key.get('oauth_token_secret')

    authorization_url = session.authorization_url(OAUTH_AUTHORIZE_URL)
    authorization_url += "&name="+trello_settings.APP_NAME_URL
    #TODO: Make this appropriate scope for the user in question (well, if we need that fancy)
    authorization_url += "&scope=read,write"
    authorization_url += "&expiration=never"
    return resource_owner_key, resource_owner_secret, authorization_url


def oauth_get_token(owner_key, owner_secret, verifier):
    """Get OAuth access token.

    :param str owner_key: Authorization code from provider
    :return: OAuth access token
    :rtype: str

    """

    session = OAuth1Session(
        trello_settings.CLIENT_ID,
        client_secret=trello_settings.CLIENT_SECRET,
        resource_owner_key=owner_key,
        resource_owner_secret=owner_secret,
        verifier=verifier,
    )
    try:
        access_tokens = session.fetch_access_token(OAUTH_ACCESS_TOKEN_URL)
    except:
        return None, None
    access_token = access_tokens.get('oauth_token')
    access_token_secret = access_tokens.get('oauth_token_secret')

    return access_token, access_token_secret