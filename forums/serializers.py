from rest_framework import serializers

from .models import Post, Tag


# TODO: Differentiate serializers between posts and topics (so topics don't see useless reply_to fields, and vice versa)
class PostSerializer(serializers.ModelSerializer):
    reply_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('id', 'title', 'tag_ids', 'author_id', 'contents',
                  'post_date', 'edit_date', 'is_topic', 'reply_to',
                  'reply_count')

    def get_reply_count(self, obj):
        return len(Post.objects.all().filter(reply_to=obj.id))


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
