from django import forms
from . import models


class LoginForm(forms.Form):
	name = forms.CharField(max_length=240)
	email = forms.EmailField()
	password = forms.CharField(max_length=240, widget=forms.PasswordInput)


class RegisterForm(forms.ModelForm):
	password = forms.CharField(max_length=240, widget=forms.PasswordInput)
	confirm_password = forms.CharField(max_length=240, widget=forms.PasswordInput)

	class Meta:
		model = models.User
		fields = ['username', 'email', 'sex', 'password', 'confirm_password']
