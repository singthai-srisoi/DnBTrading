# Generated by Django 5.1.2 on 2024-11-07 06:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('inventories', '0004_alter_inventory_bucket_alter_inventory_deduction_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='inventory',
            name='destination',
        ),
    ]
