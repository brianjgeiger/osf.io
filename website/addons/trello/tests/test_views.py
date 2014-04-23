from nose.tools import *  # PEP8 asserts
import mock
from tests.base import URLLookup
from website.addons.trello.tests.utils import (
    app, mock_responses, expected_responses, TrelloAddonTestCase
)
import httplib
from ..exceptions import TrelloError
from requests.exceptions import HTTPError as reqError
from tests.factories import AuthUserFactory
from framework.auth.decorators import Auth
import unittest

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
        assert_equal(res.status_code, httplib.OK)
        assert_equal(res.json, expected_responses['successful_board_lists'])
        assert_equal(res.json[u'user_can_edit'], True)

    @mock.patch('website.addons.trello.views.misc.Trello.get_board_url')
    @mock.patch('website.addons.trello.views.misc.Trello.get_lists_from_board')
    def test_trello_lists_trello_exception(self, mock_trello_lists, mock_trello_board_url):
        e = TrelloError(reqError('RandomError'))
        mock_trello_lists.side_effect = e
        mock_trello_lists.return_value = mock_responses['successful_board_lists']
        mock_trello_board_url.return_value = None
        url = lookup('api', 'trello_lists', pid=self.project._id)
        res = self.app.get(url, auth=self.user.auth)
        assert_equal(res.status_code, httplib.OK)
        assert_equal(res.json, expected_responses['trello_exception_board_lists'])


class TestCardsFromLists(TrelloAddonTestCase):
    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.get_attachments_from_card')
    @mock.patch('website.addons.trello.views.misc.Trello.get_cards_from_list')
    def test_trello_get_cards_from_list_success(self, mock_trello_get_cards, mock_trello_get_attachments):
        pass

    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.get_attachments_from_card')
    @mock.patch('website.addons.trello.views.misc.Trello.get_cards_from_list')
    def test_trello_get_cards_from_list_trello_exception(self, mock_trello_get_cards, mock_trello_get_attachments):
        pass


class TestCardDetails(TrelloAddonTestCase):
    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.get_checkitems')
    @mock.patch('website.addons.trello.views.misc.Trello.get_checklists_from_card')
    @mock.patch('website.addons.trello.views.misc.Trello.get_comments_from_card')
    @mock.patch('website.addons.trello.views.misc.Trello.get_attachments_from_card')
    @mock.patch('website.addons.trello.views.misc.Trello.get_card')
    def test_trello_get_card_detail_success(self, mock_trello_get_card, mock_trello_get_attachments,
                                            mock_trello_get_comments, mock_trello_get_checklists,
                                            mock_trello_get_checkitems):
        pass

    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.get_checkitems')
    @mock.patch('website.addons.trello.views.misc.Trello.get_checklists_from_card')
    @mock.patch('website.addons.trello.views.misc.Trello.get_comments_from_card')
    @mock.patch('website.addons.trello.views.misc.Trello.get_attachments_from_card')
    @mock.patch('website.addons.trello.views.misc.Trello.get_card')
    def test_trello_get_card_detail_trello_exception(self, mock_trello_get_card, mock_trello_get_attachments,
                                                     mock_trello_get_comments, mock_trello_get_checklists,
                                                     mock_trello_get_checkitems):
        pass


class TestCardAttachments(TrelloAddonTestCase):
    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.get_attachments_from_card')
    def test_trello_get_card_attachments_success(self, mock_trello_get_attachments):
        pass

    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.get_attachments_from_card')
    def test_trello_get_card_attachments_trello_exception(self, mock_trello_get_attachments):
        pass


class TestCardAdd(TrelloAddonTestCase):
    @mock.patch('website.addons.trello.views.misc.Trello.create_card_in_list')
    def test_trello_card_add_success(self, mock_trello_create_card):
        mock_trello_create_card.return_value = {'listid': 1, 'cardname': 'Card Name'}
        payload = {'listid': 1, 'cardname': 'Card Name'}
        url = lookup('api', 'trello_card_add', pid=self.project._id)
        res = self.app.post_json(url, payload, auth=self.user.auth)
        assert_equal(res.status_code, httplib.OK)
        assert_equal(res.json, payload)

    @mock.patch('website.addons.trello.views.misc.Trello.create_card_in_list')
    def test_trello_card_add_unauthorized(self, mock_trello_create_card):
        mock_trello_create_card.return_value = {'listid': 1, 'cardname': 'Card Name'}
        payload = {'listid': 1, 'cardname': 'Card Name'}
        url = lookup('api', 'trello_card_add', pid=self.project._id)
        res = self.app.post_json(url, payload, auth=None, expect_errors=True)
        assert_equal(res.status_code, httplib.UNAUTHORIZED)

    @mock.patch('website.addons.trello.views.misc.Trello.create_card_in_list')
    def test_trello_card_add_bad_request(self, mock_trello_create_card):
        mock_trello_create_card.return_value = {'listid': 1, 'cardname': 'Card Name'}
        # No list id makes it hard to add a card to a list, so this will fail.
        payload = {'cardname': 'Card Name'}
        url = lookup('api', 'trello_card_add', pid=self.project._id)
        res = self.app.post_json(url, payload, auth=self.user.auth, expect_errors=True)
        assert_equal(res.status_code, httplib.BAD_REQUEST)

    @mock.patch('website.addons.trello.views.misc.Trello.create_card_in_list')
    def test_trello_card_add_trello_exception(self, mock_trello_create_card):
        e = TrelloError(reqError('RandomError'))
        mock_trello_create_card.return_value = {'listid': 1, 'cardname': 'Card Name'}
        mock_trello_create_card.side_effect = e
        payload = {'listid': 1, 'cardname': 'Card Name'}
        url = lookup('api', 'trello_card_add', pid=self.project._id)
        res = self.app.post_json(url, payload, auth=self.user.auth, expect_errors=True)
        assert_equal(res.status_code, httplib.OK)
        assert_equal(res.json, expected_responses['trello_exception_add_card'])


class TestCardUpdate(TrelloAddonTestCase):
    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.update_card')
    def test_trello_card_update(self, mock_trello_update_card):
        pass

    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.update_card')
    def test_trello_card_update_unauthorized(self, mock_trello_update_card):
        pass

    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.update_card')
    def test_trello_card_update_bad_request(self, mock_trello_update_card):
        pass

    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.update_card')
    def test_trello_card_update_trello_exception(self, mock_trello_update_card):
        pass


class TestCardDelete(TrelloAddonTestCase):
    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.delete_card')
    def test_trello_card_delete(self, mock_trello_delete_card):
        pass

    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.delete_card')
    def test_trello_card_delete_unauthorized(self, mock_trello_delete_card):
        pass

    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.delete_card')
    def test_trello_card_delete_bad_request(self, mock_trello_delete_card):
        pass

    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.delete_card')
    def test_trello_card_delete_trello_exception(self, mock_trello_delete_card):
        pass


class TestCardDescriptionUpdate(TrelloAddonTestCase):
    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.update_card_description')
    def test_trello_card_description_update(self, mock_trello_update_card_description):
        pass

    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.update_card_description')
    def test_trello_card_description_update_unauthorized(self, mock_trello_update_card_description):
        pass

    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.update_card_description')
    def test_trello_card_description_update_bad_request(self, mock_trello_update_card_description):
        pass

    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.update_card_description')
    def test_trello_card_description_update_trello_exception(self, mock_trello_update_card_description):
        pass


class TestChecklistAdd(TrelloAddonTestCase):
    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.create_checklist_in_card')
    def test_trello_checklist_add(self, mock_trello_create_checklist):
        pass

    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.create_checklist_in_card')
    def test_trello_checklist_add_unauthorized(self, mock_trello_create_checklist):
        pass

    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.create_checklist_in_card')
    def test_trello_checklist_add_bad_request(self, mock_trello_create_checklist):
        pass

    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.create_checklist_in_card')
    def test_trello_checklist_add_trello_exception(self, mock_trello_create_checklist):
        pass


class TestChecklistUpdate(TrelloAddonTestCase):
    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.update_checklist')
    def test_trello_checklist_update(self, mock_trello_update_checklist):
        pass

    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.update_checklist')
    def test_trello_checklist_update_unauthorized(self, mock_trello_update_checklist):
        pass

    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.update_checklist')
    def test_trello_checklist_update_bad_request(self, mock_trello_update_checklist):
        pass

    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.update_checklist')
    def test_trello_checklist_update_trello_exception(self, mock_trello_update_checklist):
        pass


class TestChecklistDelete(TrelloAddonTestCase):
    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.delete_checklist_from_card')
    def test_trello_checklist_delete(self, mock_trello_delete_checklist):
        pass

    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.update_checklist')
    def test_trello_checklist_delete_unauthorized(self, mock_trello_delete_checklist):
        pass

    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.update_checklist')
    def test_trello_checklist_delete_bad_request(self, mock_trello_delete_checklist):
        pass

    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.update_checklist')
    def test_trello_checklist_delete_trello_exception(self, mock_trello_delete_checklist):
        pass


class TestCheckitemAdd(TrelloAddonTestCase):
    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.create_checkitem_in_checklist')
    def test_trello_checkitem_add(self, mock_trello_add_checkitem):
        pass

    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.create_checkitem_in_checklist')
    def test_trello_checkitem_add_unauthorized(self, mock_trello_add_checkitem):
        pass

    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.create_checkitem_in_checklist')
    def test_trello_checkitem_add_bad_request(self, mock_trello_add_checkitem):
        pass

    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.create_checkitem_in_checklist')
    def test_trello_checkitem_add_trello_exception(self, mock_trello_add_checkitem):
        pass


class TestCheckitemUpdate(TrelloAddonTestCase):
    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.update_checkitem')
    def test_trello_checkitem_update(self, mock_trello_update_checkitem):
        pass

    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.update_checkitem')
    def test_trello_checkitem_update_unauthorized(self, mock_trello_update_checkitem):
        pass

    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.update_checkitem')
    def test_trello_checkitem_update_bad_request(self, mock_trello_update_checkitem):
        pass

    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.update_checkitem')
    def test_trello_checkitem_update_trello_exception(self, mock_trello_update_checkitem):
        pass


class TestCheckitemDelete(TrelloAddonTestCase):
    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.delete_checkitem')
    def test_trello_checkitem_delete(self, mock_trello_delete_checkitem):
        pass

    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.delete_checkitem')
    def test_trello_checkitem_delete_unauthorized(self, mock_trello_delete_checkitem):
        pass

    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.delete_checkitem')
    def test_trello_checkitem_delete_bad_request(self, mock_trello_delete_checkitem):
        pass

    @unittest.skip('Unwritten')
    @mock.patch('website.addons.trello.views.misc.Trello.delete_checkitem')
    def test_trello_checkitem_delete_trello_exception(self, mock_trello_delete_checkitem):
        pass


class TestCanUserWrite(TrelloAddonTestCase):
    pass