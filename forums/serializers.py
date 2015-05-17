from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Post, Tag


class PostSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post
        fields = ('id', 'author', 'contents',
                  'post_date', 'edit_date', 'reply_to')


class TopicSerializer(serializers.ModelSerializer):
    reply_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('id', 'title', 'tag_ids', 'author', 'contents',
                  'post_date', 'edit_date', 'reply_count')

    def get_reply_count(self, obj):
        return len(Post.objects.all().filter(reply_to=obj.id))

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'posts')
