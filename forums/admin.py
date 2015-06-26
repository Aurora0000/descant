from django.contrib import admin
from solo.admin import SingletonModelAdmin

from .models import ForumSettings, Tag, Post

admin.site.site_header = 'Descant Administration Panel'
admin.site.site_title = 'Descant'

admin.site.register(Tag)
admin.site.register(Post)
admin.site.register(ForumSettings, SingletonModelAdmin)
