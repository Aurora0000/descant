from django.conf.urls import url

from .views import *


urlpatterns = [
    url(r'^topics/(?P<pk>[0-9]+)/$', topic_detail),
    url(r'^topics/', topic_list),
    url(r'^posts/(?P<pk>[0-9]+)/$', reply_detail),
    url(r'tags/', tag_list)
]

