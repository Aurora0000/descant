# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):
    dependencies = [
        ('forums', '0017_auto_20150517_1552'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='reply_to',
            field=models.ForeignKey(related_name='replies', blank=True, editable=False, to='forums.Post', null=True),
        ),
    ]
