# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('forums', '0003_auto_20150515_1649'),
    ]

    operations = [
        migrations.RenameField(
            model_name='topic',
            old_name='tags_ids',
            new_name='tag_ids',
        ),
    ]
