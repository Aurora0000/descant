from django.conf.urls import url

from .views import *


urlpatterns = [
    url(r'^topics/(?P<reply_to>[0-9]+)/replies/(?P<pk>[0-9]+)/$', ReplyDetail.as_view()),
    url(r'^topics/(?P<reply_to>[0-9]+)/replies/$', ReplyList.as_view()),
    url(r'^topics/(?P<pk>[0-9]+)/$', TopicDetail.as_view()),
    url(r'^topics/newest/$', TopicListReverse.as_view()),
    url(r'^topics/newestreplies/$', TopicListByLastReply.as_view()),
    url(r'^topics/$', TopicList.as_view()),
    url(r'^posts/(?P<pk>[0-9]+)/$', AnyPostDetail.as_view()),
    url(r'tags/(?P<id>[0-9]+)/newest/$', TagDetailReverse.as_view()),
    url(r'tags/(?P<id>[0-9]+)/newestreplies/$', TagDetailByLastReply.as_view()),
    url(r'tags/(?P<id>[0-9]+)/$', TagDetail.as_view()),
    url(r'tags/', TagList.as_view()),
    url(r'users/', UserList.as_view()),
    url(r'avatars/(?P<pk>[0-9]+)/$', GravatarLink.as_view()),
    url(r'stats/', ForumStats.as_view())
]

