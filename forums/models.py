from django.db import models
from django.utils import timezone


class Tag(models.Model):
    name = models.CharField(max_length=40)
    # Hex colours will be converted to an integer here for convenience
    colour = models.IntegerField()

    def __str__(self):
        return self.name


class Post(models.Model):
    author = models.ForeignKey('auth.User', related_name='posts', editable=False)

    contents = models.TextField()
    
    post_date = models.DateTimeField(default=timezone.now, editable=False)
    
    edit_date = models.DateTimeField(blank=True, null=True)
    
    # These fields apply to topics only #
    
    is_topic = models.BooleanField(default=False)
    
    title = models.CharField(max_length=120, blank=True, null=True)
    
    # Tags are stored in their own table, the IDs of those are here.
    tag_ids = models.ManyToManyField(Tag, related_name='posts', blank=True)

    # These fields apply to replies only #

    reply_to = models.PositiveIntegerField(blank=True, null=True, editable=False)

    def was_edited(self):
        return True if self.edit_date is not None else False
    
    def __str__(self):
        return "Reply to Topic {} (ID {})".format(str(self.reply_to), str(self.id)) if (self.title is None) or (
            self.title == "") else self.title

