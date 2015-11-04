from django.conf.urls import url

from api.wikis import views

urlpatterns = [
    url(r'^(?P<wiki_id>\w+)/$', views.WikiDetail.as_view(), name='wiki-detail'),
    url(r'^(?P<wiki_id>\w+)/versions/$', views.WikiVersionsList.as_view(), name='wiki-versions'),
    url(r'^(?P<wiki_id>\w+)/versions/(?P<version_id>\w+)/$', views.WikiVersionDetail.as_view(), name='version-detail'),
]
