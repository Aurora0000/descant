from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIRequestFactory, force_authenticate

from .models import Post, Tag
from .serializers import TopicSerializer
from .views import TagList, TopicDetail, AnyPostDetail


class TagTestCase(TestCase):
    def setUp(self):
        User.objects.create_superuser('admin', 'fake@fakeness.net', 'null')
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
        force_authenticate(request, user=User.objects.get_by_natural_key('admin'))
        view = TagList.as_view()
        response = view(request)
        self.assertEqual(response.data[0]['name'], 'test')
        self.assertEqual(response.data[1]['name'], '\\#231[][=-')


class SerializerReplyTestCase(TestCase):
    def setUp(self):
        User.objects.create_superuser('admin', 'fake@fakeness.net', 'null')
        u = User.objects.get_by_natural_key('admin')
        Post.objects.create(author=u, contents='test', is_topic=True, title='Testing...')
        p = Post.objects.get(id=1)
        Post.objects.create(author=u, contents='Cool post!', reply_to=p)
        Post.objects.create(author=u, contents='Cool post!', reply_to=p)
        Post.objects.create(author=u, contents='test', is_topic=True, title='This is a different thread')
        p2 = Post.objects.get(id=4)
        Post.objects.create(author=u, contents='This post shouldn\'t count!', reply_to=p2)

    def test_count_is_correct(self):
        topic = Post.objects.get(id=1)
        serializer = TopicSerializer(topic)
        self.assertEqual(serializer.get_reply_count(topic), 2)

    def test_api_is_correct(self):
        factory = APIRequestFactory()
        request = factory.get('/topics/1/', format='json')
        force_authenticate(request, user=User.objects.get_by_natural_key('admin'))
        view = TopicDetail.as_view()
        response = view(request, pk=1)
        self.assertEqual(response.data['reply_count'], 2)

    def test_any_post_view(self):
        factory = APIRequestFactory()
        request = factory.get('/posts/3/', format='json')
        force_authenticate(request, user=User.objects.get_by_natural_key('admin'))
        view = AnyPostDetail.as_view()
        response = view(request, pk=3)
        self.assertEqual(response.data['contents'], 'Cool post!')


class LoadTestCase(TestCase):
    def setUp(self):
        User.objects.create_superuser('admin', 'fake@fakeness.net', 'null')
        u = User.objects.get_by_natural_key('admin')
        Post.objects.create(author=u, contents='test', is_topic=True, title='Testing...')

    def test_10k_replies(self):
        i = 0
        u = User.objects.get_by_natural_key('admin')
        t = Post.objects.ghet(id=1)
        while i < 10000:
            if i % 1000 == 0:
                print("Test 10,000 replies: At iteration {}".format(i))
            Post.objects.create(author=u, contents='test', reply_to=t)
            i += 1

        topic = Post.objects.get(id=1)
        serializer = TopicSerializer(topic)
        self.assertEqual(serializer.get_reply_count(topic), 10000)
