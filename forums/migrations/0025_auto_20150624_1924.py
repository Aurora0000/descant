# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('forums', '0024_post_is_locked'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tag',
            name='colour',
        ),
        migrations.AddField(
            model_name='tag',
            name='description',
            field=models.TextField(null=True, blank=True),
        ),
    ]
