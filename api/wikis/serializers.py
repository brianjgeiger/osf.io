import furl
from modularodm import Q

from rest_framework import serializers as ser

from website import settings
from website.files.models import FileNode
from api.base.utils import absolute_reverse
from api.base.serializers import WikiLink
from api.base.serializers import JSONAPIHyperlinkedIdentityField
from api.base.serializers import Link, JSONAPISerializer, LinksField, IDField, TypeField


class WikiSerializer(JSONAPISerializer):
    filterable_fields = frozenset([
        'id',
        'name',
        'size',
        'last_touched',
    ])
    id = IDField(source='_id', read_only=True)
    type = TypeField()
    name = ser.CharField(read_only=True, help_text='Display name used in the general user interface')
    size = ser.SerializerMethodField(read_only=True, help_text='The size of this file at this version')
    last_touched = ser.DateTimeField(read_only=True, help_text='The last time this file had information fetched about it via the OSF')

    versions = JSONAPIHyperlinkedIdentityField(view_name='files:file-versions', kwargs=(('wiki_id', '_id'), ))

    links = LinksField({
        'info': Link('wikis:wiki-detail', kwargs={'wiki_id': '<_id>'}),
        'move': WikiLink(),
        'upload': WikiLink(),
        'delete': WikiLink(),
        'download': WikiLink()
    })

    class Meta:
        type_ = 'files'

    def get_size(self, obj):
        if obj.versions:
            return obj.versions[-1].size
        return None

    def update(self, instance, validated_data):
        assert isinstance(instance, FileNode), 'Instance must be a FileNode'
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    def is_valid(self, **kwargs):
        return super(WikiSerializer, self).is_valid(clean_html=False, **kwargs)


class WikiDetailSerializer(WikiSerializer):
    """
    Overrides FileSerializer to make id required.
    """
    id = IDField(source='_id', required=True)


class WikiVersionSerializer(JSONAPISerializer):
    filterable_fields = frozenset([
        'id',
        'size',
        'identifier',
        'content_type',
    ])
    id = ser.CharField(read_only=True, source='identifier')
    size = ser.IntegerField(read_only=True, help_text='The size of this file at this version')
    content_type = ser.CharField(read_only=True, help_text='The mime type of this file at this verison')
    links = LinksField({
        'self': 'self_url',
        'html': 'absolute_url'
    })

    class Meta:
        type_ = 'file_versions'

    def self_url(self, obj):
        return absolute_reverse('wikis:version-detail', kwargs={
            'version_id': obj.identifier,
            'wiki_id': self.context['view'].kwargs['wiki_id']
        })

    def absolute_url(self, obj):
        fobj = self.context['view'].get_file()
        return furl.furl(settings.DOMAIN).set(
            path=(fobj.node._id, 'files', fobj.provider, fobj.path.lstrip('/')),
            query={fobj.version_identifier: obj.identifier}  # TODO this can probably just be changed to revision or version
        ).url
