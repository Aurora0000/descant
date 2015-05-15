from django.forms import widgets
from rest_framework import serializers
from .models import Topic, Tag


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ('id', 'title', 'tag_ids', 'author_id', 'contents', 
                  'reply_ids', 'post_date', 'edit_date')

