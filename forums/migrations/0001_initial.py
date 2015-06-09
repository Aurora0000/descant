# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('tag_name', models.CharField(max_length=40)),
                ('tag_colour', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Topic',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('topic_name', models.CharField(max_length=120)),
                ('topic_tags_ids', models.CommaSeparatedIntegerField(max_length=10)),
                ('topic_author_id', models.PositiveIntegerField()),
                ('topic_contents', models.CharField(max_length=5000)),
                ('topic_reply_ids', models.CommaSeparatedIntegerField(max_length=100000, null=True, blank=True)),
                ('topic_post_date', models.DateField()),
                ('topic_edit_date', models.DateField(blank=True)),
            ],
        ),
    ]
