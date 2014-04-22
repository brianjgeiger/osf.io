# -*- coding: utf-8 -*-
"""Factory boy factories for the Trello addon."""

from factory import SubFactory, Sequence
from tests.factories import ModularOdmFactory, UserFactory, ProjectFactory

from website.addons.trello.model import (
    AddonTrelloUserSettings, AddonTrelloNodeSettings
)
class DropboxUserSettingsFactory(ModularOdmFactory):
    FACTORY_FOR = AddonTrelloUserSettings

    owner = SubFactory(UserFactory)
    access_token = Sequence(lambda n: 'abcdef{0}'.format(n))


class DropboxNodeSettingsFactory(ModularOdmFactory):
    FACTORY_FOR = AddonTrelloNodeSettings

    owner = SubFactory(ProjectFactory)
    user_settings = SubFactory(DropboxUserSettingsFactory)
    trello_board_name = 'Test Board'
