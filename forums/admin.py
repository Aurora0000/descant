from django.contrib import admin

from .models import Tag, Post

admin.site.site_header = "Descant Administration Panel"
admin.site.site_title = "Descant"
admin.site.register(Tag)
admin.site.register(Post)
