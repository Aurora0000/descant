from hashlib import md5

from django.contrib.auth.models import User
from rest_framework import serializers
from notifications.models import Notification

from .models import Post, Tag


class JSONSerializerField(serializers.Field):
    def to_internal_value(self, data):
        return data

    def to_representation(self, value):
        return value

class TargetRelatedField(serializers.RelatedField):

    def to_representation(self, value):
        """
        Serialize target object
        """
        if isinstance(value, Post):
            return ContextlessPostOrTopicSerializer(value).data
        elif isinstance(value, User):
            return UserSerializer(value).data

        raise Exception('Unexpected type of tagged object')

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'name', 'colour', 'posts')


class TagForTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('name', 'colour')

class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    was_edited = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()
    can_edit = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('id', 'author', 'author_name', 'contents',
                  'post_date', 'last_edit_date', 'reply_to',
                  'was_edited', 'avatar_url', 'contents_marked_up',
                  'can_edit')

    def get_author_name(self, obj):
        return obj.author.username

    def get_was_edited(self, obj):
        return obj.was_edited()

    def get_avatar_url(self, obj):
        emailhash = md5(obj.author.email.strip().lower().encode('utf-8')).hexdigest()
        return "https://secure.gravatar.com/avatar/{}?d=identicon".format(emailhash)

    def get_can_edit(self, obj):
        if self.context['request'].user.is_authenticated():
            if self.context['request'].user.has_perm('forums.change_post', obj):
                return True
            else:
                return False
        return False


class TopicSerializer(serializers.ModelSerializer):
    reply_count = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()
    was_edited = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()
    can_edit = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('id', 'title', 'tag_ids', 'author', 'author_name',
                  'contents', 'post_date', 'last_edit_date', 'reply_count',
                  'was_edited', 'avatar_url', 'contents_marked_up',
                  'is_locked', 'can_edit')

        read_only_fields = ('replies',)

    def get_reply_count(self, obj):
        return Post.objects.all().filter(reply_to=obj).count()

    def get_author_name(self, obj):
        return obj.author.username

    def get_was_edited(self, obj):
        return obj.was_edited()

    def get_avatar_url(self, obj):
        emailhash = md5(obj.author.email.strip().lower().encode('utf-8')).hexdigest()
        return "https://secure.gravatar.com/avatar/{}?d=identicon".format(emailhash)

    def get_can_edit(self, obj):
        if self.context['request'].user.is_authenticated():
            if self.context['request'].user.has_perm('forums.change_post', obj):
                return True
            else:
                return False
        return False


class PostOrTopicSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    was_edited = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()
    can_edit = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('id', 'author', 'author_name', 'contents',
                  'post_date', 'last_edit_date', 'is_topic',
                  'was_edited', 'avatar_url', 'contents_marked_up',
                  'can_edit')

    def get_author_name(self, obj):
        return obj.author.username

    def get_was_edited(self, obj):
        return obj.was_edited()

    def get_avatar_url(self, obj):
        email_hash = md5(obj.author.email.strip().lower().encode('utf-8')).hexdigest()
        return "https://secure.gravatar.com/avatar/{}?d=identicon".format(email_hash)

    def get_can_edit(self, obj):
        if self.context['request'].user.is_authenticated():
            if self.context['request'].user.has_perm('forums.change_post', obj):
                return True
            else:
                return False
        return False

class ContextlessPostOrTopicSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    was_edited = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('id', 'author', 'author_name', 'contents',
                  'post_date', 'last_edit_date', 'is_topic',
                  'was_edited', 'avatar_url', 'contents_marked_up',
                  'title')

    def get_author_name(self, obj):
        return obj.author.username

    def get_was_edited(self, obj):
        return obj.was_edited()

    def get_avatar_url(self, obj):
        email_hash = md5(obj.author.email.strip().lower().encode('utf-8')).hexdigest()
        return "https://secure.gravatar.com/avatar/{}?d=identicon".format(email_hash)


class UserSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'posts', 'date_joined', 'avatar_url')

    def get_avatar_url(self, obj):
        emailhash = md5(obj.email.strip().lower().encode('utf-8')).hexdigest()
        return "https://secure.gravatar.com/avatar/{}?d=identicon".format(emailhash)


class UserStatsSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()
    post_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('username', 'date_joined', 'avatar_url', 'post_count')

    def get_avatar_url(self, obj):
        emailhash = md5(obj.email.strip().lower().encode('utf-8')).hexdigest()
        return "https://secure.gravatar.com/avatar/{}?d=identicon".format(emailhash)

    def get_post_count(self, obj):
        return obj.posts.count()


class UserGravatarSerializer(serializers.ModelSerializer):
    gravatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('gravatar_url',)

    def get_gravatar_url(self, obj):
        emailhash = md5(obj.email.strip().lower().encode('utf-8')).hexdigest()
        return "https://secure.gravatar.com/avatar/{}?d=identicon".format(emailhash)


class NotificationSerializer(serializers.ModelSerializer):
    data = JSONSerializerField()
    target = TargetRelatedField(read_only=True)
    actor = TargetRelatedField(read_only=True)
    action_object = TargetRelatedField(read_only=True)

    class Meta:
        model = Notification
        fields = ('id', 'actor', 'verb', 'target', 'action_object', 'timestamp', 'data', 'unread')

    def get_actor_name(self, obj):
        return obj.actor.username


class PMSerializer(serializers.Serializer):
    recipient = serializers.CharField(max_length=50)
    message = serializers.CharField(max_length=5000)


class ReportSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=5000)
