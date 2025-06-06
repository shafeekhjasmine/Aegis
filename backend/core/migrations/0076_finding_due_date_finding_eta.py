# Generated by Django 5.1.9 on 2025-05-21 13:10

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0075_incident_detection_incident_reported_at"),
    ]

    operations = [
        migrations.AddField(
            model_name="finding",
            name="due_date",
            field=models.DateField(blank=True, null=True, verbose_name="Due date"),
        ),
        migrations.AddField(
            model_name="finding",
            name="eta",
            field=models.DateField(blank=True, null=True, verbose_name="ETA"),
        ),
    ]
