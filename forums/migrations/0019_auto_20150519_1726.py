# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.core import exceptions

from django.contrib.auth.models import Group, Permission
from django.db import migrations
from django.contrib.contenttypes.models import ContentType

from forums.models import Post


def add_registered_group(apps, schema_editor):
    try:
        group, created = Group.objects.get_or_create(name='registered')
        if created:
            content_type = ContentType.objects.get_for_model(Post)
            p = Permission.objects.get(codename='add_post', content_type=content_type)
            group.permissions.add(p)
    except exceptions.ObjectDoesNotExist:
        # TODO: Unit tests can't create database because of this migration. Need to fix it.
        pass



class Migration(migrations.Migration):
    dependencies = [
        ('forums', '0018_auto_20150518_1634'),
    ]

    operations = [
        migrations.RunPython(add_registered_group),
    ]
