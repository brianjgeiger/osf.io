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
import logging
from website.addons.trello import settings as trello_settings
from framework.exceptions import HTTPError as OSFHTTPError

logger = logging.getLogger(__name__)
#TODO Make a decorator that catches requests's HTTPError, grabs the info, and passes it as a TrelloError
class Trello(object):

    def __init__(self, client_token, client_secret, owner_token, owner_secret, user_token):

        # if no OAuth
        if owner_token is None:
            self.session = requests
            self.user_session = requests
        else:
            self.client_token = client_token
            self.client_secret = client_secret
            self.owner_token = owner_token
            self.owner_secret = owner_secret
            self.user_token = user_token

            self.session = OAuth1Session(
                client_token,
                client_secret=client_secret,
                resource_owner_key=owner_token,
                resource_owner_secret=owner_secret,
                signature_type='auth_header'
            )

            if(user_token is not None):
                self.user_session = OAuth1Session(
                client_token,
                client_secret=client_secret,
                resource_owner_key=user_token,
                resource_owner_secret=owner_secret,
                signature_type='auth_header'
            )

        self.last_error = None

    @classmethod
    def from_settings(cls, settings):
        if settings is None or not hasattr(settings, 'oauth_access_token'):
            return cls(None, None, None, None, None)
        else:
            user = get_current_user()
            user_token = None
            if user is not None:
                trello_user = user.get_addon('trello')
                if trello_user is not None:
                    # Swap the comment on the following two lines to enable user-specific trello write access based on user trello tokens
                    # user_token = trello_user.oauth_access_token
                    user_token = settings.oauth_access_token
            return cls(
                client_token=trello_settings.CLIENT_ID,
                client_secret=trello_settings.CLIENT_SECRET,
                owner_token=settings.oauth_access_token,
                owner_secret=settings.oauth_access_token_secret,
                user_token=user_token
            )

    def _get_last_error(self):
        e = self.last_error
        self.last_error = None
        return e

    def get_trello(self):
        return TrelloApi(self.client_token,self.owner_token)

    def get_user_trello(self):
        return TrelloApi(self.client_token,self.user_token)

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

    def get_board_user_prefs(self,board_id):
        return self.get_user_trello().boards.get_myPref(board_id)

    def can_user_write_to_board(self,board_id):
        return_val = False
        board_prefs = self.get_board_prefs_from_user_perspective(board_id)
        if board_prefs is not None:
            return_val = True
        return return_val

    def get_board_prefs_from_user_perspective(self,board_id):
        if(self.user_token is not None):
            resp = requests.put("https://api.trello.com/1/boards/%s" % (board_id), params=dict(key=self.client_token, token=self.user_token), data=None)
            logger.log(10,resp.content)
            if resp.status_code == 401:
                return None
            else:
                resp.raise_for_status()
            return json.loads(resp.content)
        else:
            return None

    def get_board_prefs_from_owner_perspective(self,board_id):
            resp = requests.put("https://api.trello.com/1/boards/%s" % (board_id), params=dict(key=self.client_token, token=self.owner_token), data=None)
            resp.raise_for_status()
            return json.loads(resp.content)

    def update_card(self, card_id, name=None, desc=None, closed=None, idList=None, due=None, pos=None):
        if(self.user_token is not None):
            resp = requests.put("https://trello.com/1/cards/%s" % (card_id),
                                params=dict(key=self.client_token, token=self.user_token),
                                data=dict(name=name, desc=desc, closed=closed, idList=idList, due=due, pos=pos))
            resp.raise_for_status()
            return json.loads(resp.content)
        else:
            return None

    def create_card_in_list(self,card_name,list_id):
        return self.get_user_trello().lists.new_card(list_id,card_name)

    def update_checkitem(self,card_id,checklist_id,checkitem_id,state=None,name=None,pos=None,closed=None):
        if(self.user_token is not None):
            resp = requests.put("https://trello.com/1/cards/%s/checklist/%s/checkItem/%s" % (card_id,checklist_id,checkitem_id),
                                params=dict(key=self.client_token, token=self.user_token),
                                data=dict(idChecklist=checklist_id,idCheckItem=checkitem_id,value=state,pos=pos,name=name,closed=closed))
            resp.raise_for_status()
            return json.loads(resp.content)
        else:
            return None

    def create_checkitem_in_checklist(self,checklist_id,checkitem_name):
        return self.get_user_trello().checklists.new_checkItem(checklist_id,checkitem_name)

    def delete_checkitem(self,checkitem_id,checklist_id):
        return self.get_user_trello().checklists.delete_checkItem_idCheckItem(checkitem_id,checklist_id)

    def delete_card(self,card_id):
        return self.get_user_trello().cards.delete(card_id)