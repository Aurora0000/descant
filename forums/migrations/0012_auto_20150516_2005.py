# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ('forums', '0011_auto_20150516_1931'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='post',
            options={'permissions': ('view_post', 'Can view posts')},
        ),
    ]
