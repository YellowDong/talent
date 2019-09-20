from django.db import models


class User(models.Model):
	SEX_CHOICE = (
		('1', '男'),
		('2', '女')
	)
	username = models.CharField(max_length=240, unique=True)
	sex = models.CharField(max_length=2, default='1', choices=SEX_CHOICE)
	email = models.EmailField(unique=True)
	password = models.CharField(max_length=240)
	c_time = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ['-c_time']
		verbose_name_plural = verbose_name = '用户'

	def __str__(self):
		return self.username