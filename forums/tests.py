from django.test import TestCase
from django.contrib.auth.models import User

from rest_framework.test import APIRequestFactory, force_authenticate

from .models import Post, Tag
from .serializers import TopicSerializer
from .views import TagList, TopicDetail


class TagTestCase(TestCase):
    def setUp(self):
        Tag.objects.create(name='test', colour=0xFFFFFF)
        Tag.objects.create(name='\\#231[][=-', colour=0xDEAD12)

    def test_colours_stored_correctly(self):
        # Check that everything gets stored right.
        test = Tag.objects.get(name='test')
        rand_chars = Tag.objects.get(name='\\#231[][=-')
        self.assertEqual(rand_chars.colour, 0xDEAD12)
        self.assertEqual(test.colour, 0xFFFFFF)

    def test_api_is_correct(self):
        factory = APIRequestFactory()
        request = factory.get('/tags/1/', format='json')
        force_authenticate(request, user='admin')
        view = TagList.as_view()
        response = view(request)
        self.assertEqual(response.data[0]['name'], 'test')
        self.assertEqual(response.data[1]['name'], '\\#231[][=-')


class SerializerReplyTestCase(TestCase):
    def setUp(self):
        User.objects.create_superuser('admin', 'fake@fakeness.net', 'null')
        u = User.objects.get_by_natural_key('admin')
        Post.objects.create(author_id=u, contents='test', is_topic=True, title='Testing...', tag_ids='1')
        Post.objects.create(author_id=u, contents='Cool post!', reply_to=1)
        Post.objects.create(author_id=u, contents='Cool post!', reply_to=1)
        Post.objects.create(author_id=u, contents='test', is_topic=True, title='This is a different thread',
                            tag_ids='1')
        Post.objects.create(author_id=u, contents='This post shouldn\'t count!', reply_to=4)

    def test_count_is_correct(self):
        topic = Post.objects.get(id=1)
        serializer = TopicSerializer(topic)
        self.assertEqual(serializer.get_reply_count(topic), 2)

    def test_api_is_correct(self):
        factory = APIRequestFactory()
        request = factory.get('/topics/1/', format='json')
        force_authenticate(request, user='admin')
        view = TopicDetail.as_view()
        response = view(request, pk=1)
        self.assertEqual(response.data['reply_count'], 2)
