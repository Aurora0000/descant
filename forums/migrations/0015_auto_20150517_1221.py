# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):
    dependencies = [
        ('forums', '0014_auto_20150516_2009'),
    ]

    operations = [
        migrations.RenameField(
            model_name='post',
            old_name='author_id',
            new_name='author',
        ),
        migrations.AlterField(
            model_name='post',
            name='contents',
            field=models.TextField(),
        ),
    ]
