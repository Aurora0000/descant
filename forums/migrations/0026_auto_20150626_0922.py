# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations
from django.contrib.auth.models import Group


def add_moderators_group(apps, schema_editor):
    group, created = Group.objects.get_or_create(name='moderators')


class Migration(migrations.Migration):
    dependencies = [
        ('forums', '0025_auto_20150624_1924'),
    ]

    operations = [
        migrations.RunPython(add_moderators_group),
    ]
