# -*- coding: utf-8 -*-
import mock
from contextlib import contextmanager

from webtest_plus import TestApp

from framework import storage
from framework.mongo import db, set_up_storage

import website
from website.addons.base.testing import AddonTestCase
from website.addons.trello import MODELS
from website.addons.trello.api import Trello

app = website.app.init_app(
    routes=True, set_backends=False, settings_module='website.settings'
)


def init_storage():
    set_up_storage(MODELS, storage_class=storage.MongoStorage, db=db)


class TrelloAddonTestCase(AddonTestCase):
    ADDON_SHORT_NAME = 'trello'

    def create_app(self):
        return TestApp(app)

    def set_user_settings(self, settings):
        settings.client_token = '12345abc'
        settings.trello_id = 'my_trello_id'

    def set_node_settings(self, settings):
        settings.trello_board_name = 'foo'
        settings.trello_board_id = 123


mock_responses = {
    'successful_board_lists':
        [{u'idBoard': u'53189b693b58e0d16ac26e51', u'subscribed': False, u'pos': 24576, u'closed': False,
          u'id': u'5329b9925ada884a59088461', u'name': u'Future Versions'},
         {u'idBoard': u'53189b693b58e0d16ac26e51', u'subscribed': False, u'pos': 26624, u'closed': False,
          u'id': u'5331dd6d128bb1cb24dcb144', u'name': u'Bugs'},
         {u'idBoard': u'53189b693b58e0d16ac26e51', u'subscribed': False, u'pos': 28672, u'closed': False,
          u'id': u'53189b693b58e0d16ac26e52', u'name': u'Features'},
         {u'idBoard': u'53189b693b58e0d16ac26e51', u'subscribed': False, u'pos': 32768, u'closed': False,
          u'id': u'53189b693b58e0d16ac26e53', u'name': u'Doing'},
         {u'idBoard': u'53189b693b58e0d16ac26e51', u'subscribed': False, u'pos': 49152, u'closed': False,
          u'id': u'53189b693b58e0d16ac26e54', u'name': u'Done'},
         {u'idBoard': u'53189b693b58e0d16ac26e51', u'subscribed': False, u'pos': 114688, u'closed': False,
          u'id': u'5319cf5f3f19d10f7e999b57', u'name': u'Playground'},
         {u'idBoard': u'53189b693b58e0d16ac26e51', u'subscribed': False, u'pos': 180224, u'closed': False,
          u'id': u'53235737af540b2b49a8eab2', u'name': u'Empty List'}]
}


class MockTrello(object):
    trello_mock = mock.create_autospec(Trello)

    trello_mock.get_lists_from_board.return_value = mock_responses['successful_board_lists']


@contextmanager
def patch_api(target):
    """Patches a function that returns a TrelloApi, returning an instance
    of MockTrello instead.

    Usage: ::

        with patch_client('website.addons.dropbox.view.config.get_client') as client:
            # test view that uses the dropbox client.
    """
    with mock.patch(target) as api_getter:
        api = MockTrello()
        api_getter.return_value = api
        yield api
