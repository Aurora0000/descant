# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):
    dependencies = [
        ('forums', '0026_auto_20150626_0922'),
    ]

    operations = [
        migrations.CreateModel(
            name='ForumSettings',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('rules', models.TextField()),
                ('rules_marked_up', models.TextField(null=True, editable=False)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
