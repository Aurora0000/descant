# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('forums', '0002_auto_20150515_1611'),
    ]

    operations = [
        migrations.RenameField(
            model_name='tag',
            old_name='tag_colour',
            new_name='colour',
        ),
        migrations.RenameField(
            model_name='tag',
            old_name='tag_name',
            new_name='name',
        ),
        migrations.RenameField(
            model_name='topic',
            old_name='topic_author_id',
            new_name='author_id',
        ),
        migrations.RenameField(
            model_name='topic',
            old_name='topic_contents',
            new_name='contents',
        ),
        migrations.RenameField(
            model_name='topic',
            old_name='topic_edit_date',
            new_name='edit_date',
        ),
        migrations.RenameField(
            model_name='topic',
            old_name='topic_post_date',
            new_name='post_date',
        ),
        migrations.RenameField(
            model_name='topic',
            old_name='topic_reply_ids',
            new_name='reply_ids',
        ),
        migrations.RenameField(
            model_name='topic',
            old_name='topic_tags_ids',
            new_name='tags_ids',
        ),
        migrations.RenameField(
            model_name='topic',
            old_name='topic_name',
            new_name='title',
        ),
    ]
