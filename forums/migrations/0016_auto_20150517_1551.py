# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):
    dependencies = [
        ('forums', '0015_auto_20150517_1221'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='tag_ids',
        ),
        migrations.AddField(
            model_name='post',
            name='tag_ids',
            field=models.ManyToManyField(related_name='posts', null=True, to='forums.Tag', blank=True),
        ),
    ]
