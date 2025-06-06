# Generated by Django 5.1.1 on 2024-11-09 08:49

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0034_fix_loaded_libraries_objects_meta"),
    ]

    operations = [
        migrations.AddField(
            model_name="riskscenario",
            name="existing_applied_controls",
            field=models.ManyToManyField(
                blank=True,
                related_name="risk_scenarios_e",
                to="core.appliedcontrol",
                verbose_name="Existing Applied controls",
            ),
        ),
    ]
