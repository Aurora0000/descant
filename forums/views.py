from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny, DjangoObjectPermissions
from rest_framework.throttling import UserRateThrottle
from guardian.shortcuts import assign_perm

from .models import Post, Tag
from .serializers import PostSerializer, TopicSerializer, TagSerializer, UserSerializer


class DjangoObjectPermissionsOrAnonReadOnly(DjangoObjectPermissions):
    """
    Unauthenticated users aren't automatically rejected.
    """
    authenticated_users_only = False


class StandardThrottle(UserRateThrottle):
    rate = '15/min'  # 1 per 4 seconds

class TagList(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    throttle_classes = (StandardThrottle,)


class TopicList(generics.ListCreateAPIView):
    # TODO: logic to set is_topic to true, etc.
    queryset = Post.objects.all().filter(is_topic=True)
    serializer_class = TopicSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)
    throttle_classes = (StandardThrottle,)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user, is_topic=True)
        assign_perm('forums.change_post', self.request.user, serializer.instance)
        assign_perm('forums.delete_post', self.request.user, serializer.instance)

class TopicDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all().filter(is_topic=True)
    serializer_class = TopicSerializer
    permission_classes = (DjangoObjectPermissionsOrAnonReadOnly,)


class ReplyList(generics.ListCreateAPIView):
    # TODO: Edit creation logic.
    queryset = Post.objects.all().filter(is_topic=False)
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)
    throttle_classes = (StandardThrottle,)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user, reply_to=self.kwargs['reply_to'])
        assign_perm('forums.change_post', self.request.user, serializer.instance)
        assign_perm('forums.delete_post', self.request.user, serializer.instance)

    def get_queryset(self):
        return Post.objects.all().filter(is_topic=False, reply_to=self.kwargs['reply_to'])


class ReplyDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all().filter(is_topic=False)
    serializer_class = PostSerializer
    permission_classes = (DjangoObjectPermissionsOrAnonReadOnly,)
    throttle_classes = (StandardThrottle,)


class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)
    throttle_classes = (StandardThrottle,)
