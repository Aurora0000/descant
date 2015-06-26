# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations

from forums.models import ForumSettings


def create_default_settings(apps, schema_editor):
    f = ForumSettings.get_solo()


class Migration(migrations.Migration):
    dependencies = [
        ('forums', '0028_auto_20150626_1255'),
    ]

    operations = [
        migrations.RunPython(create_default_settings),
    ]
