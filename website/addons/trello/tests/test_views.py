from nose.tools import *  # PEP8 asserts
import mock
from tests.base import URLLookup
from website.addons.trello.tests.utils import (
    app, mock_responses, expected_responses, TrelloAddonTestCase
)
lookup = URLLookup(app)

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

class TestListsViews(TrelloAddonTestCase):
    @mock.patch('website.addons.trello.views.misc.Trello.get_board_url')
    @mock.patch('website.addons.trello.views.misc.Trello.get_lists_from_board')
    def test_trello_lists_success(self, mock_trello_lists, mock_trello_board_url):

        mock_trello_lists.return_value = mock_responses['successful_board_lists']
        mock_trello_board_url.return_value = None
        url = lookup('api', 'trello_lists', pid=self.project._id)
        res = self.app.get(url, auth=self.user.auth)
        assert_equal(res.json, expected_responses['successful_board_lists'])