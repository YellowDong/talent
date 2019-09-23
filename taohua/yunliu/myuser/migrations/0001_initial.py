# Generated by Django 2.1.11 on 2019-09-20 17:00

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=240, unique=True)),
                ('sex', models.CharField(default='1', max_length=2)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('password', models.CharField(max_length=240)),
                ('c_time', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]