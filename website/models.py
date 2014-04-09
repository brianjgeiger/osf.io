# -*- coding: utf-8 -*-
'''Consolidates all necessary models from the framework and website packages.
'''

from framework.guid.model import Guid
from framework.auth.model import User
from framework.sessions.model import Session

from website.project.model import (
    ApiKey, Node, NodeLog,
    Tag, WatchConfig, MetaSchema, Pointer,
    MailRecord, Comment, PrivateLink
)

# All models
MODELS = (
    User, ApiKey, Node, NodeLog,
    Tag, WatchConfig, Session, Guid, MetaSchema, Pointer,
    MailRecord, Comment, PrivateLink
)

GUID_MODELS = (User, Node, Comment)
