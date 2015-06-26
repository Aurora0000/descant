# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ('forums', '0029_auto_20150626_1257'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='forumsettings',
            options={'verbose_name': 'Forum Settings'},
        ),
    ]
