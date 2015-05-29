from django.contrib.auth.models import User, Group
from django.dispatch import receiver
from django.db.models import Max
from rest_framework import generics
from rest_framework.permissions import AllowAny, DjangoObjectPermissions
from rest_framework.throttling import UserRateThrottle
from guardian.shortcuts import assign_perm
from djoser.signals import user_activated

from .models import Post, Tag
from .serializers import PostSerializer, TopicSerializer, TagSerializer, UserSerializer, UserGravatarSerializer, \
    PostOrTopicSerializer


class DjangoObjectPermissionsOrAnonReadOnly(DjangoObjectPermissions):
    """
    Unauthenticated users aren't automatically rejected.
    """
    authenticated_users_only = False


class StandardThrottle(UserRateThrottle):
    rate = '60/min'  # 1 per second


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
        return Post.objects.all().annotate(last_reply_date=Max('replies__post_date')).filter(pk__in=tag.posts.all()) \
            .order_by('-last_reply_date', '-id')

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
        serializer.save(author=self.request.user, is_topic=True)
        assign_perm('forums.change_post', self.request.user, serializer.instance)
        assign_perm('forums.delete_post', self.request.user, serializer.instance)


class TopicListReverse(generics.ListAPIView):
    queryset = Post.objects.all().filter(is_topic=True).order_by('-id')
    serializer_class = TopicSerializer
    permission_classes = (DjangoObjectPermissionsOrAnonReadOnly,)
    throttle_classes = (StandardThrottle,)


class TopicListByLastReply(generics.ListAPIView):
    queryset = Post.objects.all().annotate(last_reply_date=Max('replies__post_date')).filter(is_topic=True) \
        .order_by('-last_reply_date', '-id')
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
        serializer.save(author=self.request.user, reply_to=Post.objects.get(id=self.kwargs['reply_to'], is_topic=True))
        assign_perm('forums.change_post', self.request.user, serializer.instance)
        assign_perm('forums.delete_post', self.request.user, serializer.instance)

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


class GravatarLink(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserGravatarSerializer
    permission_classes = (AllowAny,)
    throttle_classes = (StandardThrottle,)

@receiver(user_activated)
def add_user_to_group(sender, **kwargs):
    grp = Group.objects.get(name='registered')
    print (kwargs['user'])
    grp.user_set.add(kwargs['user'])
