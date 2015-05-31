from django.db import models
from django.utils import timezone

from markupsafe import escape
from markdown2 import markdown

class Tag(models.Model):
    name = models.CharField(max_length=40)
    # Hex colours will be converted to an integer here for convenience
    colour = models.IntegerField()

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

    # These fields apply to replies only #

    reply_to = models.ForeignKey('Post', related_name='replies', blank=True, null=True, editable=False)

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
        self.contents_marked_up = escape(self.contents_marked_up)
        self.contents_marked_up = markdown(self.contents).replace('\n', '<br />')
        return super(Post, self).save(*args, **kwargs)
