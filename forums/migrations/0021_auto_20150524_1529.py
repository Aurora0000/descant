# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('forums', '0020_auto_20150524_1525'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='last_edit_date',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
