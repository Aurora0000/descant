# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('forums', '0005_auto_20150515_1731'),
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('author_id', models.PositiveIntegerField()),
                ('contents', models.CharField(max_length=5000)),
                ('post_date', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('edit_date', models.DateTimeField(null=True, blank=True)),
                ('is_topic', models.BooleanField(default=False)),
                ('title', models.CharField(max_length=120, null=True, blank=True)),
                ('tag_ids', models.CommaSeparatedIntegerField(max_length=10, null=True, blank=True)),
                ('reply_ids', models.CommaSeparatedIntegerField(max_length=100000, null=True, blank=True)),
            ],
        ),
        migrations.DeleteModel(
            name='Topic',
        ),
    ]
