# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('forums', '0004_auto_20150515_1657'),
    ]

    operations = [
        migrations.AlterField(
            model_name='topic',
            name='edit_date',
            field=models.DateTimeField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='topic',
            name='post_date',
            field=models.DateTimeField(),
        ),
    ]
