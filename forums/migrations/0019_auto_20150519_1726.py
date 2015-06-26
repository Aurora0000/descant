# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.auth.models import Group, Permission
from django.db import migrations
from django.contrib.contenttypes.models import ContentType

from forums.models import Post


def add_registered_group(apps, schema_editor):
    group, created = Group.objects.get_or_create(name='registered')
    if created:
        content_type = ContentType.objects.get_for_model(Post)
        p, created = Permission.objects.get_or_create(codename='add_post', name='Can add post',
                                                      content_type=content_type)
        group.permissions.add(p)



class Migration(migrations.Migration):
    dependencies = [
        ('forums', '0018_auto_20150518_1634'),
    ]

    operations = [
        migrations.RunPython(add_registered_group),
    ]
