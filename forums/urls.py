from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns

from .views import topic_list, topic_detail


urlpatterns = [
    url(r'^topics/(?P<pk>[0-9]+)/$', topic_detail),
    url(r'^topics/', topic_list),
]

