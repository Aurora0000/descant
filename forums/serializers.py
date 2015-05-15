from django.forms import widgets
from rest_framework import serializers
from .models import Post, Tag


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('id', 'title', 'tag_ids', 'author_id', 'contents', 
                  'reply_ids', 'post_date', 'edit_date', 'is_topic')

