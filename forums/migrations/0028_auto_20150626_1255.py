# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):
    dependencies = [
        ('forums', '0027_forumsettings'),
    ]

    operations = [
        migrations.AlterField(
            model_name='forumsettings',
            name='rules',
            field=models.TextField(default=b'There are no rules.'),
        ),
    ]
