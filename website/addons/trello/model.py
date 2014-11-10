"""

"""


from website.addons.base import AddonUserSettingsBase, AddonNodeSettingsBase
from modularodm import fields
from framework.status import push_status_message
from .api import Trello
from . import messages
from website import models
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
        trello_boards = []
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
            'trello_boards': trello_boards,
        })

        if self.user_settings and self.user_settings.has_auth:
            return_value.update({
                'authorized_user': self.user_settings.owner.fullname,
                'owner_url': self.user_settings.owner.url,
                'is_owner': user == self.user_settings.owner,
                'trello_boards': trello_boards,
            })

        return return_value

    # FIXME This never gets called. Pulled from dropbox.
    def before_remove_contributor_message(self, node, removed):
        """Return warning text to display if removed contributor is the user
        who authorized the Trello addon
        """
        if self.user_settings and self.user_settings.owner == removed:
            category = node.project_or_component
            name = removed.fullname
            return ('The Trello add-on for this {category} is authenticated by {name}. '
                    'Removing this user will also remove write access to Trello '
                    'unless another contributor re-authenticates the add-on.'
                    ).format(**locals())

    # backwards compatibility
    before_remove_contributor = before_remove_contributor_message

    def after_remove_contributor(self, node, removed):
        """If the removed contributor was the user who authorized the Trello
        addon, remove the auth credentials from this node.
        Return the message text that will be displayed to the user.
        """
        if self.user_settings and self.user_settings.owner == removed:
            self.user_settings = None
            self.save()
            name = removed.fullname
            url = node.web_url_for('node_setting')
            return ('Because the Trello add-on for this project was authenticated'
                    'by {name}, authentication information has been deleted. You '
                    'can re-authenticate on the <a href="{url}">Settings</a> page'
                    ).format(**locals())


#TODO: Implement users having their own tokens. When that happens, update the following method with these rules:
# Reasons why a user can write (user always needs their own user token)
# 1) Board is public
# 2) Board is private, but user is a member of the board
# 3) Board is private, but user is a member of organization that is allowed to write
# Currently this is only checking for the user to have write permission to the project, not anything trello-related
def can_user_write_to_project_board(**kwargs):
    user_can_edit = False
    user = kwargs['auth'].user

    nid = kwargs.get('nid') or kwargs.get('pid')
    node_model = models.Node.load(nid) if nid else None

    if user and node_model and node_model.can_edit(user=user):
        user_can_edit = True

    return user_can_edit
