from django.conf.urls import url

from .views import *


urlpatterns = [
    url(r'^topics/(?P<reply_to>[0-9]+)/replies/$', ReplyList.as_view()),
    url(r'^topics/(?P<pk>[0-9]+)/$', TopicDetail.as_view()),
    url(r'^topics/', TopicList.as_view()),
    url(r'^posts/(?P<pk>[0-9]+)/$', ReplyDetail.as_view()),
    url(r'tags/', TagList.as_view()),
]

