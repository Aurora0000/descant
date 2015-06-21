from django.contrib.auth.models import Group
from django.dispatch import receiver
from django.db.models import Avg, Case, Count, F, Max, When
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated, DjangoObjectPermissions
from rest_framework.throttling import UserRateThrottle
from rest_framework.views import APIView
from rest_framework.response import Response
from djoser.signals import user_activated
from notifications import notify

from .serializers import *


class DjangoObjectPermissionsOrAnonReadOnly(DjangoObjectPermissions):
    """
    Unauthenticated users aren't automatically rejected.
    """
    authenticated_users_only = False


class StandardThrottle(UserRateThrottle):
    rate = '60/min'  # 1 per second


class StrictThrottle(UserRateThrottle):
    rate = '5/min'


class ForumStats(APIView):
    def get(self, request, format=None):
        resp_data = {'post_count': Post.objects.count(),
                     'topic_count': Post.objects.filter(is_topic=True).count(),
                     'most_replies': Post.objects.filter(is_topic=True).annotate(reply_count=Count('replies'))
                         .aggregate(Max('reply_count'))['reply_count__max'],
                     'user_most_posts': User.objects.annotate(post_count=Count('posts')).order_by('-post_count')[0]
                         .username,
                     'average_post_per_user': User.objects.annotate(post_count=Count('posts'))
                         .aggregate(Avg('post_count'))['post_count__avg'],
                     'average_replies': Post.objects.filter(is_topic=True).annotate(reply_count=Count('replies'))
                         .aggregate(Avg('reply_count'))['reply_count__avg'],
                     }
        return Response(resp_data)

class TagDetail(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = TopicSerializer
    throttle_classes = (StandardThrottle,)
    permission_classes = (DjangoObjectPermissionsOrAnonReadOnly,)

    def get_queryset(self):
        tag = Tag.objects.get(pk=self.kwargs['id'])
        return Post.objects.all().filter(pk__in=tag.posts.all())


class TagDetailReverse(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = TopicSerializer
    throttle_classes = (StandardThrottle,)
    permission_classes = (DjangoObjectPermissionsOrAnonReadOnly,)

    def get_queryset(self):
        tag = Tag.objects.get(pk=self.kwargs['id'])
        return Post.objects.all().filter(pk__in=tag.posts.all()).order_by('-id')


class TagDetailByLastReply(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = TopicSerializer
    permission_classes = (DjangoObjectPermissionsOrAnonReadOnly,)
    throttle_classes = (StandardThrottle,)

    def get_queryset(self):
        tag = Tag.objects.get(pk=self.kwargs['id'])
        return Post.objects.all().filter(pk__in=tag.posts.all()). \
            annotate(replies_count=Count('replies')). \
            annotate(last_update=Case(When(replies_count=0, then=F('post_date')), default=Max('replies__post_date'))). \
            filter(is_topic=True). \
            order_by('-last_update', '-id')

class TagList(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    throttle_classes = (StandardThrottle,)
    permission_classes = (DjangoObjectPermissionsOrAnonReadOnly,)

class TopicList(generics.ListCreateAPIView):
    queryset = Post.objects.all().filter(is_topic=True)
    serializer_class = TopicSerializer
    permission_classes = (DjangoObjectPermissionsOrAnonReadOnly,)
    throttle_classes = (StandardThrottle,)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user, is_topic=True, is_locked=False)


class TopicListReverse(generics.ListAPIView):
    queryset = Post.objects.all().filter(is_topic=True).order_by('-id')
    serializer_class = TopicSerializer
    permission_classes = (DjangoObjectPermissionsOrAnonReadOnly,)
    throttle_classes = (StandardThrottle,)


class TopicListByLastReply(generics.ListAPIView):
    queryset = Post.objects.all(). \
        annotate(replies_count=Count('replies')). \
        annotate(last_update=Case(When(replies_count=0, then=F('post_date')), default=Max('replies__post_date'))). \
        filter(is_topic=True). \
        order_by('-last_update', '-id')
    serializer_class = TopicSerializer
    permission_classes = (DjangoObjectPermissionsOrAnonReadOnly,)
    throttle_classes = (StandardThrottle,)

class TopicDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all().filter(is_topic=True)
    serializer_class = TopicSerializer
    permission_classes = (DjangoObjectPermissionsOrAnonReadOnly,)
    throttle_classes = (StandardThrottle,)


class ReplyList(generics.ListCreateAPIView):
    queryset = Post.objects.all().filter(is_topic=False)
    serializer_class = PostSerializer
    permission_classes = (DjangoObjectPermissionsOrAnonReadOnly,)
    throttle_classes = (StandardThrottle,)

    def perform_create(self, serializer):
        post = Post.objects.get(id=self.kwargs['reply_to'], is_topic=True)
        if post.is_locked:
            return
        serializer.save(author=self.request.user, reply_to=post)

    def get_queryset(self):
        return Post.objects.all().filter(is_topic=False, reply_to=self.kwargs['reply_to'])


class ReplyDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all().filter(is_topic=False)
    serializer_class = PostSerializer
    permission_classes = (DjangoObjectPermissionsOrAnonReadOnly,)
    throttle_classes = (StandardThrottle,)


class AnyPostDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostOrTopicSerializer
    permission_classes = (DjangoObjectPermissionsOrAnonReadOnly,)
    throttle_classes = (StandardThrottle,)


class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)
    throttle_classes = (StandardThrottle,)


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserStatsSerializer
    permission_classes = (AllowAny,)
    throttle_classes = (StandardThrottle,)


class UserDetailPosts(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostOrTopicSerializer
    permission_classes = (AllowAny,)
    throttle_classes = (StandardThrottle,)

    def get_queryset(self):
        return Post.objects.filter(author=self.kwargs['id'])

class GravatarLink(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserGravatarSerializer
    permission_classes = (AllowAny,)
    throttle_classes = (StandardThrottle,)


class NotificationList(generics.ListAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = (IsAuthenticated,)
    throttle_classes = (StandardThrottle,)
    all = False

    def get_queryset(self):
        user = User.objects.get(pk=self.request.user.id)
        if self.all:
            return user.notifications.all()
        else:
            return user.notifications.unread()


class NotificationDetail(generics.RetrieveDestroyAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = (IsAuthenticated,)
    throttle_classes = (StandardThrottle,)

    def get_queryset(self):
        user = User.objects.get(pk=self.request.user.id)
        return user.notifications.filter(pk=self.kwargs['pk'])


class MarkNotificationAsRead(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None, pk=None):
        try:
            user = User.objects.get(pk=request.user.id)
            notification = user.notifications.unread().filter(pk=pk)
            notification[0].mark_as_read()
        except ObjectDoesNotExist:
            resp_data = {
                'pk': 'Not found!'
            }
            return Response(resp_data, status=404)
        return NotificationSerializer(notification)


class MessageCreate(generics.CreateAPIView):
    queryset = None
    serializer_class = PMSerializer
    permission_classes = (IsAuthenticated,)
    throttle_classes = (StrictThrottle,)

    def perform_create(self, serializer):
        try:
            notify.send(self.request.user, recipient=User.objects.get(username=serializer.data['recipient']),
                        verb='SENT_PRIVATE_MESSAGE', message=serializer.data['message'])
        except ObjectDoesNotExist:
            raise serializers.ValidationError('recipient does not exist!')

# Should really be moved to somewhere that makes more sense.
@receiver(user_activated)
def add_user_to_group(sender, **kwargs):
    grp = Group.objects.get(name='registered')
    grp.user_set.add(kwargs['user'])
    notify.send(kwargs['user'], recipient=kwargs['user'], verb=u'ACTIVATED_ACCOUNT')
