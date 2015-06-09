# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('forums', '0022_auto_20150524_1533'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='contents_marked_up',
            field=models.TextField(null=True, editable=False),
        ),
        migrations.AlterField(
            model_name='post',
            name='last_edit_date',
            field=models.DateTimeField(blank=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='post_date',
            field=models.DateTimeField(editable=False),
        ),
    ]
