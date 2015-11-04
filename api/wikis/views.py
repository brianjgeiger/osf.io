from rest_framework import generics
from rest_framework import permissions as drf_permissions

from framework.auth.oauth_scopes import CoreScopes

from api.base.permissions import PermissionWithGetter
from api.base.utils import get_object_or_error
from api.base import permissions as base_permissions
from api.nodes.permissions import ContributorOrPublic
from api.nodes.permissions import ReadOnlyIfRegistration
from api.wikis.serializers import WikiSerializer, WikiDetailSerializer, WikiVersionSerializer


class WikiMixin(object):
    """Mixin with convenience methods for retrieving the current file based on the
    current URL. By default, fetches the wiki based on the wiki_id kwarg.
    """

    serializer_class = WikiSerializer
    file_lookup_url_kwarg = 'wiki_id'

    def get_file(self, check_permissions=True):
        obj = get_object_or_error(WikiNode, self.kwargs[self.file_lookup_url_kwarg])

        if check_permissions:
            # May raise a permission denied
            self.check_object_permissions(self.request, obj)
        return obj.wrapped()
