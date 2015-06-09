# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):
    dependencies = [
        ('forums', '0009_auto_20150516_1707'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='post',
            options={'permissions': (('view', 'View post'), ('change', 'Change post'), ('delete', 'Delete post'))},
        ),
        migrations.AlterField(
            model_name='post',
            name='author_id',
            field=models.ForeignKey(related_name='posts', editable=False, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='post',
            name='reply_to',
            field=models.PositiveIntegerField(null=True, editable=False, blank=True),
        ),
    ]
