# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):
    dependencies = [
        ('forums', '0016_auto_20150517_1551'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='tag_ids',
            field=models.ManyToManyField(related_name='posts', to='forums.Tag', blank=True),
        ),
    ]
