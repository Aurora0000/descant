# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):
    dependencies = [
        ('forums', '0007_post_reply_to'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='reply_ids',
        ),
        migrations.AlterField(
            model_name='post',
            name='author_id',
            field=models.PositiveIntegerField(editable=False),
        ),
    ]
