# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):
    dependencies = [
        ('forums', '0023_auto_20150531_1225'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='is_locked',
            field=models.NullBooleanField(),
        ),
    ]
