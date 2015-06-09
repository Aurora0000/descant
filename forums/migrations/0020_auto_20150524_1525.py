# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('forums', '0019_auto_20150519_1726'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='edit_date',
        ),
        migrations.AddField(
            model_name='post',
            name='last_edit_date',
            field=models.DateTimeField(default=django.utils.timezone.now, blank=True),
        ),
    ]
