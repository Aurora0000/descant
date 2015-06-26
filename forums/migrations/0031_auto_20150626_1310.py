# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):
    dependencies = [
        ('forums', '0030_auto_20150626_1303'),
    ]

    operations = [
        migrations.AlterField(
            model_name='forumsettings',
            name='rules_marked_up',
            field=models.TextField(default=b'<p>There are no rules.</p>', editable=False),
        ),
    ]
