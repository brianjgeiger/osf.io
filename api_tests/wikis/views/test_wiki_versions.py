import furl
from urlparse import urlparse
from nose.tools import *  # flake8: noqa

from api.base.settings.defaults import API_BASE
from website.addons.wiki.model import NodeWikiPage
from tests.base import ApiWikiTestCase
from tests.factories import (ProjectFactory, RegistrationFactory,
                             NodeWikiFactory, PrivateLinkFactory)


class TestWikiVersionsList(ApiWikiTestCase):
    def setUp(self):
        super(TestWikiVersionsList, self).setUp()

    def test_return_public_node_wiki_version_list_unauthenticated(self):
        pass

    def test_return_public_node_wiki_version_list_non_contributor(self):
        pass

    def test_return_public_node_wiki_version_list_contributor(self):
        pass

    def test_do_not_return_private_node_wiki_version_list_unauthenticated(self):
        pass

    def test_do_not_return_private_node_wiki_version_list_non_contributor(self):
        pass

    def test_return_private_node_wiki_version_list_contributor(self):
        pass

    def test_return_public_registration_wiki_version_list_unauthenticated(self):
        pass

    def test_return_public_registration_wiki_version_list_non_contributor(self):
        pass

    def test_return_public_registration_wiki_version_list_contributor(self):
        pass

    def test_do_not_return_embargoed_registration_wiki_version_list_unauthenticated(self):
        pass

    def test_do_not_return_embargoed_registration_wiki_version_list_non_contributor(self):
        pass

    def test_return_embargoed_registration_wiki_version_list_contributor(self):
        pass

    def test_do_not_return_withdrawn_registration_wiki_version_list_unauthenticated(self):
        pass

    def test_do_not_return_withdrawn_registration_wiki_version_list_non_contributor(self):
        pass

    def test_do_not_return_withdrawn_registration_wiki_version_list_contributor(self):
        pass

    def test_filter_wiki_version_by_page_name(self):
        pass

    def test_filter_wiki_version_on_date_modified(self):
        pass

    def test_filter_wiki_version_before_date_modified(self):
        pass

    def test_filter_wiki_version_after_date_modified(self):
        pass

class TestWikiVersionDetail(ApiWikiTestCase):
    def setUp(self):
        super(TestWikiVersionDetail, self).setUp()

    def test_contributor_can_read_old_public_wiki_version(self):
        pass

    def test_unauthenticated_user_can_read_old_public_wiki_version(self):
        pass

    def test_non_contributor_can_read_old_public_wiki_version(self):
        pass

    def test_contributor_can_read_old_private_wiki_version(self):
        pass

    def test_unauthenticated_user_can_not_read_old_private_wiki_version(self):
        pass

    def test_non_contributor_can_not_read_old_private_wiki_version(self):
        pass
