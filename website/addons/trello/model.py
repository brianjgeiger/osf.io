"""

"""


from framework import fields
from website.addons.base import AddonUserSettingsBase, AddonNodeSettingsBase

from framework.status import push_status_message
from .api import Trello
from . import settings as trello_settings
from . import messages
import logging

logger = logging.getLogger(__name__)

class AddonTrelloUserSettings(AddonUserSettingsBase):

    oauth_request_token = fields.StringField()
    oauth_request_token_secret = fields.StringField()
    oauth_access_token = fields.StringField()
    oauth_access_token_secret = fields.StringField()

    @property
    def has_auth(self):
        return self.oauth_access_token is not None

    def remove_auth(self):
        self.oauth_access_token = None
        self.oauth_access_token_secret = None

    def to_json(self, user):
        return_value = super(AddonTrelloUserSettings, self).to_json(user)
        return_value.update({
            'authorized': self.has_auth,
        })
        return return_value


class AddonTrelloNodeSettings(AddonNodeSettingsBase):
    trello_user_id = fields.StringField()
    trello_board_id = fields.StringField()
    trello_board_name = fields.StringField()


    user_settings = fields.ForeignField(
        'AddonTrelloUserSettings', backref='authorized'
    )

    # @property
    # def embed_url(self):
    #     return 'http://wl.figshare.com/articles/{fid}/embed?show_title=1'.format(
    #         fid=self.figshare_id,
    #     )

    # @property
    # def api_url(self):
    #     if self.user_settings is None:
    #         return trello_settings.API_URL
    #     else:
    #         return trello_settings.API_OAUTH_URL

    @property
    def has_auth(self):
        return self.user_settings and self.user_settings.has_auth

    def to_json(self, user):
        return_value = super(AddonTrelloNodeSettings, self).to_json(user)

        trello_user = user.get_addon('trello')

        if self.has_auth:
            trello_boards = Trello.from_settings(self.user_settings).get_boards()

            if trello_boards == 401:
                self.user_settings.remove_auth()
                push_status_message(messages.OAUTH_INVALID)

        return_value.update({
            'trello_user_id': self.trello_user_id or '',
            'trello_board_id': self.trello_board_id or '',
            'trello_board_name': self.trello_board_name or '',
            'node_has_auth': self.user_settings and self.user_settings.has_auth,
            'user_has_auth': trello_user and trello_user.has_auth,
            'is_registration': self.owner.is_registration,
            'trello_boards': [],
        })


        if self.user_settings and self.user_settings.has_auth:
            return_value.update({
                'authorized_user': self.user_settings.owner.fullname,
                'owner_url': self.user_settings.owner.url,
                'is_owner': user == self.user_settings.owner,
                'trello_boards': trello_boards,
            })

        return return_value
