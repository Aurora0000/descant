# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):
    dependencies = [
        ('forums', '0008_auto_20150516_1132'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='author_id',
            field=models.ForeignKey(related_name='posts', to=settings.AUTH_USER_MODEL),
        ),
    ]
