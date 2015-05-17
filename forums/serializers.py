from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Post, Tag


class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('id', 'author', 'author_name', 'contents',
                  'post_date', 'edit_date', 'reply_to')

    def get_author_name(self, obj):
        return User.objects.get(id=obj.author.id).username


class TopicSerializer(serializers.ModelSerializer):
    reply_count = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('id', 'title', 'tag_ids', 'author', 'author_name',
                  'contents', 'post_date', 'edit_date', 'reply_count')

    def get_reply_count(self, obj):
        return len(Post.objects.all().filter(reply_to=obj.id))

    def get_author_name(self, obj):
        return User.objects.get(id=obj.author.id).username

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'name', 'colour', 'posts')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'posts')
