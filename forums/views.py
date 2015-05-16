from rest_framework.permissions import IsAuthenticatedOrReadOnly

from rest_framework import generics

from .models import Post, Tag
from .serializers import PostSerializer, TopicSerializer, TagSerializer


class TagList(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


class TopicList(generics.ListCreateAPIView):
    # TODO: logic to set is_topic to true, etc.
    queryset = Post.objects.all().filter(is_topic=True)
    serializer_class = TopicSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def perform_create(self, serializer):
        serializer.save(author_id=self.request.user.id)

class TopicDetail(generics.RetrieveUpdateDestroyAPIView):
    # TODO: some logic with the PUT to verify things aren't changed in a hostile way.
    queryset = Post.objects.all().filter(is_topic=True)
    serializer_class = TopicSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)


class ReplyList(generics.ListCreateAPIView):
    # TODO: Edit creation logic.
    queryset = Post.objects.all().filter(is_topic=False)
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get_queryset(self):
        return Post.objects.all().filter(is_topic=False, reply_to=self.kwargs['reply_to'])


class ReplyDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.get(is_topic=False)
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)
