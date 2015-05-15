from django.db import models

class Topic(models.Model):
    title = models.CharField(max_length=120)
    
    # Tags are stored in their own table, the IDs of those are here.
    tag_ids = models.CommaSeparatedIntegerField(max_length=10)
    
    author_id = models.PositiveIntegerField()
    
    contents = models.CharField(max_length=5000)
    
    # Cap of 100,000 replies...
    reply_ids = models.CommaSeparatedIntegerField(max_length=100000,
                                                        blank=True, null=True)
    
    post_date = models.DateField()
    
    edit_date = models.DateField(blank=True, null=True)
    
    def was_edited(self):
        return True if edit_date != None else False
    
    def __str__(self):
        return self.title
    
class Tag(models.Model):
    name = models.CharField(max_length=40)
    # Hex colours will be converted to an integer here for convenience
    colour = models.IntegerField()
    
    def __str__(self):
        return self.name
    
