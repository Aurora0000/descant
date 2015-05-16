from django.db import models
from django.utils import timezone

class Post(models.Model):
    author_id = models.PositiveIntegerField()
    
    contents = models.CharField(max_length=5000)
    
    post_date = models.DateTimeField(default=timezone.now, editable=False)
    
    edit_date = models.DateTimeField(blank=True, null=True)
    
    # These fields apply to topics only #
    
    is_topic = models.BooleanField(default=False)
    
    title = models.CharField(max_length=120, blank=True, null=True)
    
    # Tags are stored in their own table, the IDs of those are here.
    tag_ids = models.CommaSeparatedIntegerField(max_length=10, blank=True,
                                                null=True)

    # These fields apply to replies only #

    reply_to = models.PositiveIntegerField(blank=True, null=True)

    def was_edited(self):
        return True if self.edit_date is not None else False
    
    def __str__(self):
        return "Post" if self.title is None else self.title


class Tag(models.Model):
    name = models.CharField(max_length=40)
    # Hex colours will be converted to an integer here for convenience
    colour = models.IntegerField()
    
    def __str__(self):
        return self.name
