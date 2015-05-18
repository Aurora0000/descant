# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):
    dependencies = [
        ('forums', '0006_auto_20150515_1754'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='reply_to',
            field=models.PositiveIntegerField(null=True, blank=True),
        ),
    ]
