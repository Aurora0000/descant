from django.db import models
from django.utils import timezone
import bleach
from markdown2 import markdown

from descant import settings


class Tag(models.Model):
    name = models.CharField(max_length=40)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class Post(models.Model):
    author = models.ForeignKey('auth.User', related_name='posts', editable=False)

    contents = models.TextField()

    contents_marked_up = models.TextField(editable=False, null=True)

    post_date = models.DateTimeField(editable=False)

    last_edit_date = models.DateTimeField(blank=True)

    # These fields apply to topics only #

    is_topic = models.BooleanField(default=False)

    title = models.CharField(max_length=120, blank=True, null=True)

    # Tags are stored in their own table, the IDs of those are here.
    tag_ids = models.ManyToManyField(Tag, related_name='posts', blank=True)

    is_locked = models.NullBooleanField(blank=True)

    # END Topics only fields #
    # These fields apply to replies only #

    reply_to = models.ForeignKey('Post', related_name='replies', blank=True, null=True, editable=False)

    # END Replies only fields #

    def was_edited(self):
        return True if self.last_edit_date != self.post_date else False

    def __str__(self):
        return "Reply to Topic {} (ID {})".format(str(self.reply_to), str(self.id)) if (self.title is None) or (
            self.title == "") else self.title

    def save(self, *args, **kwargs):
        now = timezone.now()
        if not self.id:
            self.post_date = now
        self.last_edit_date = now
        self.contents_marked_up = bleach.clean(markdown(self.contents).replace('\n', ''), settings.ALLOWED_TAGS,
                                               settings.ALLOWED_ATTRIBUTES)
        return super(Post, self).save(*args, **kwargs)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'contents': self.contents,
            'contents_marked_up': self.contents_marked_up,
            'post_date': self.post_date,
            'last_edit_date': self.last_edit_date,
            'is_topic': self.is_topic,
            'tag_ids': self.tag_ids,
            'is_locked': self.is_locked,
            'reply_to': self.reply_to
        }
