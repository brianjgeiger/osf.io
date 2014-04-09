# -*- coding: utf-8 -*-
"""Tests for website.addons.dropbox.utils."""
import io
import os

from nose.tools import *  # PEP8 asserts
from werkzeug.wrappers import Response

from framework.auth.decorators import Auth
from website.project.model import NodeLog

from tests.base import DbTestCase
from tests.factories import ProjectFactory

from website.addons.dropbox.tests.factories import DropboxFileFactory
from website.addons.dropbox.tests.utils import DropboxAddonTestCase, mock_responses
from website.app import init_app
from website.addons.dropbox import utils
from website.addons.dropbox.views.config import serialize_folder

app = init_app(set_backends=False, routes=True)


class TestNodeLogger(DropboxAddonTestCase):

    def test_log_file_added(self):
        df = DropboxFileFactory()
        logger = utils.DropboxNodeLogger(node=self.project,
            auth=Auth(self.user), file_obj=df)
        with self.app.app.test_request_context():
            logger.log(NodeLog.FILE_ADDED, save=True)

        last_log = self.project.logs[-1]

        assert_equal(last_log.action, "dropbox_{0}".format(NodeLog.FILE_ADDED))


def test_get_file_name():
    assert_equal(utils.get_file_name('foo/bar/baz.txt'), 'baz.txt')
    assert_equal(utils.get_file_name('/foo/bar/baz.txt'), 'baz.txt')
    assert_equal(utils.get_file_name('/foo/bar/baz.txt/'), 'baz.txt')


def test_clean_path():
    assert_equal(utils.clean_path('/'), '')
    assert_equal(utils.clean_path('/foo/bar/baz/'), 'foo/bar/baz')
    assert_equal(utils.clean_path(None), '')


def test_get_share_folder_uri():
    expected = 'https://dropbox.com/home/foo?shareoptions=1&share_subfolder=0&share=1'
    assert_equal(utils.get_share_folder_uri('/foo/'), expected)
    assert_equal(utils.get_share_folder_uri('foo'), expected)


def test_serialize_folder():
    metadata = {
        u'bytes': 0,
        u'icon': u'folder',
        u'is_dir': True,
        u'modified': u'Sat, 22 Mar 2014 05:40:29 +0000',
        u'path': u'/datasets/New Folder',
        u'rev': u'3fed51f002c12fc',
        u'revision': 67032351,
        u'root': u'dropbox',
        u'size': u'0 bytes',
        u'thumb_exists': False
    }
    result = serialize_folder(metadata)
    assert_equal(result['path'], metadata['path'])
    assert_equal(result['name'], 'Dropbox' + metadata['path'])


def test_make_file_response():
    mockfile = io.BytesIO(b'bohemianrhapsody')
    metadata = {
        u'bytes': 123,
        u'icon': u'file',
        u'is_dir': False,
        u'modified': u'Sat, 22 Mar 2014 05:40:29 +0000',
        u'path': u'foo/song.mp3',
        u'rev': u'3fed51f002c12fc',
        u'revision': 67032351,
        u'root': u'dropbox',
        u'size': u'0 bytes',
        u'thumb_exists': False,
        u'mime_type': u'audio/mpeg',
    }
    with app.test_request_context():
        resp = utils.make_file_response(mockfile, metadata)
    # It's a response
    assert_true(isinstance(resp, Response))
    # Headers are correct
    disposition = 'attachment; filename=song-{0}.mp3'.format(metadata['rev'])
    assert_equal(resp.headers['Content-Disposition'], disposition)
    assert_equal(resp.headers['Content-Type'], metadata['mime_type'])


class TestMetadataSerialization(DbTestCase):

    def test_metadata_to_hgrid(self):
        metadata = {
            u'bytes': 123,
            u'icon': u'file',
            u'is_dir': False,
            u'modified': u'Sat, 22 Mar 2014 05:40:29 +0000',
            u'path': u'/foo/bar/baz.mp3',
            u'rev': u'3fed51f002c12fc',
            u'revision': 67032351,
            u'root': u'dropbox',
            u'size': u'0 bytes',
            u'thumb_exists': False,
            u'mime_type': u'audio/mpeg',
        }
        node = ProjectFactory()
        permissions = {'view': True, 'edit': False}
        with app.test_request_context():
            result = utils.metadata_to_hgrid(metadata, node, permissions)
            assert_equal(result['addon'], 'dropbox')
            assert_equal(result['permissions'], permissions)
            filename = utils.get_file_name(metadata['path'])
            assert_equal(result['name'], filename)
            assert_equal(result['urls'], utils.build_dropbox_urls(metadata, node))
            assert_equal(result['path'], metadata['path'])
            assert_equal(result['ext'], os.path.splitext(filename)[1])


class TestBuildDropboxUrls(DbTestCase):

    def test_build_dropbox_urls_file(self):
        node = ProjectFactory()
        fake_metadata = mock_responses['metadata_single']
        with app.test_request_context():
            result = utils.build_dropbox_urls(fake_metadata, node)
            path = utils.clean_path(fake_metadata['path'])
            assert_equal(result['download'],
                node.web_url_for('dropbox_download', path=path))
            assert_equal(result['view'],
                node.web_url_for('dropbox_view_file', path=path))
            assert_equal(result['delete'],
                node.api_url_for('dropbox_delete_file', path=path))
