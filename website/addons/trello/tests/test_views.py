from nose.tools import *  # PEP8 asserts
import mock
import unittest
import httplib
import datetime
from tests.factories import AuthUserFactory, ProjectFactory
from framework.auth.decorators import Auth
from webtest_plus import TestApp
from website.addons.trello.tests.utils import (
    app, mock_responses, MockTrello, patch_api, TrelloAddonTestCase
)
from website.addons.trello import views
from website.addons.trello import api


# TODO: Set up tests
# Tests that need to happen in views are:
# Auth view tests. Ensure that the settings are properly modified when the various OAUth calls are made.
#
# Misc view tests. Most of the methods are focused on shuttling data from Trello to the web page. For each of those,
# ensure that the proper API method gets called with the proper arguments, and that the two major failure modes,
# uncaught exception and TrelloException, produce the right kinds of errors and send the right kind of data to
# the web page. For the success tests, grab and mock some JSON from Trello and ensure that the correct data is put
# into the JSON that goes from the view function to the web.
# There is also a function can_user_write_to_project_board(). This is simple right now, but if we have the test in
# place, it will be better for when we upgrade so that we can add the additional tests to verify its functionality, as
# it will get somewhat complicated once we add on separate contributor permissions.

class TestPageViews(TrelloAddonTestCase):
    def setUp(self):
        self.trello = MockTrello()
        self.user = AuthUserFactory()
        self.consolidated_auth = Auth(user=self.user)
        self.project = ProjectFactory(creator=self.user)
        self.project.add_addon('trello', auth=self.consolidated_auth)
        self.project.creator.add_addon('trello')
        self.node_settings = self.project.get_addon('trello')
        self.node_settings.user_settings = self.project.creator.get_addon('trello')
        self.node_settings.save()


    @mock.patch('website.addons.trello.views.misc.can_user_write_to_project_board')
    def test_trello_lists(self, mock_can_write):
        #Not yet actually doing anything. Essentially just ensuring test mechanism works at this point.
        mock_trello = self.trello
        mock_can_write.return_value = True
        assert_equal(mock_trello.trello_mock.get_lists_from_board(),mock_responses['successful_board_lists'])