from hashlib import md5

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
        return obj.author.username


class TopicSerializer(serializers.ModelSerializer):
    reply_count = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('id', 'title', 'tag_ids', 'author', 'author_name',
                  'contents', 'post_date', 'edit_date', 'reply_count', 'replies')

    def get_reply_count(self, obj):
        return Post.objects.all().filter(reply_to=obj).count()

    def get_author_name(self, obj):
        return obj.author.username


class PostOrTopicSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('id', 'author', 'author_name', 'contents',
                  'post_date', 'edit_date', 'is_topic')

    def get_author_name(self, obj):
        return obj.author.username

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'name', 'colour', 'posts')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'posts', 'date_joined')


class UserGravatarSerializer(serializers.ModelSerializer):
    gravatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('gravatar_url',)

    def get_gravatar_url(self, obj):
        emailhash = md5(obj.email.strip().lower().encode('utf-8')).hexdigest()
        return "https://secure.gravatar.com/avatar/{}?d=identicon".format(emailhash)
