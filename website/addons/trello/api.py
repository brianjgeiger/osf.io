"""

"""

import os
import urllib
import itertools

from trello import TrelloApi
from framework.auth import get_current_user
from requests_oauthlib import OAuth1Session
import requests
import json
from website.addons.trello import settings as trello_settings


class Trello(object):

#     def __init__(self, app_key=None, oauth_token=None):
#         self.app_key = app_key
#         if app_key and oauth_token:
#             self.trello_api = TrelloApi(app_key,oauth_token)
#         else:
#             self.trello_api = None
#
#     @classmethod
#     def from_settings(cls, settings):
#         if settings:
#             return cls(
#                 access_token=settings.oauth_token,
#                 token_type=settings.oauth_token_type,
#             )
#         return cls()


    def __init__(self, client_token, client_secret, owner_token, owner_secret):
        # if no OAuth
        if owner_token is None:
            self.session = requests
        else:
            self.client_token = client_token
            self.client_secret = client_secret
            self.owner_token = owner_token
            self.owner_secret = owner_secret

            self.session = OAuth1Session(
                client_token,
                client_secret=client_secret,
                resource_owner_key=owner_token,
                resource_owner_secret=owner_secret,
                signature_type='auth_header'
            )
        self.last_error = None

    @classmethod
    def from_settings(cls, settings):
        if settings is None or not hasattr(settings, 'oauth_access_token'):
            return cls(None, None, None, None)
        else:
            return cls(
                client_token=trello_settings.CLIENT_ID,
                client_secret=trello_settings.CLIENT_SECRET,
                owner_token=settings.oauth_access_token,
                owner_secret=settings.oauth_access_token_secret,
            )

    def _get_last_error(self):
        e = self.last_error
        self.last_error = None
        return e

    def get_trello(self):
        return TrelloApi(self.client_token,self.owner_token)

    def get_boards(self):
        trello_api = self.get_trello()
        my_record = trello_api.members.get('me')
        my_id = my_record[u'id']
        xml = trello_api.members.get_board(my_id, filter="open")

        my_open_boards = trello_api.members.get_board(my_id, filter="open")
        return my_open_boards

    def get_cards_from_board(self,board_id):
        return self.get_trello().boards.get_card(board_id)

    def get_board_url(self,board_id):
        return self.get_trello().boards.get(board_id)[u'url']

    def get_lists_from_board(self,board_id):
        return self.get_trello().boards.get_list(board_id)

    def get_card(self,card_id):
        return self.get_trello().cards.get(card_id)

    def get_comments_from_card(self,card_id):
        return self.get_trello().cards.get_action(card_id,filter="commentCard")

    def get_cards_from_list(self,list_id):
        return self.get_trello().lists.get_card(list_id)

    def get_checklists_from_card(self,card_id):
        return self.get_trello().cards.get_checklist(card_id)

    def get_checkitems(self,checklist_id):
        return self.get_trello().checklists.get_checkItem(checklist_id)

    def get_attachments_from_card(self,card_id, fields=None, filter="true"):
        resp = requests.get("https://trello.com/1/cards/%s/attachments" % (card_id), params=dict(key=self.client_token, token=self.owner_token, fields=fields, filter=filter), data=None)
        resp.raise_for_status()
        return json.loads(resp.content)

    def update_card(self, card_id, name=None, desc=None, closed=None, idList=None, due=None, pos=None):
        resp = requests.put("https://trello.com/1/cards/%s" % (card_id), params=dict(key=self.client_token, token=self.owner_token), data=dict(name=name, desc=desc, closed=closed, idList=idList, due=due, pos=pos))
        resp.raise_for_status()
        return json.loads(resp.content)
