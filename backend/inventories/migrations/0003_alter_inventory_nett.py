# Generated by Django 5.1.2 on 2024-10-29 08:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventories', '0002_inventory_nett'),
    ]

    operations = [
        migrations.AlterField(
            model_name='inventory',
            name='nett',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
    ]