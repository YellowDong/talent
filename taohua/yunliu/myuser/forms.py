from django import forms
from . import models

from captcha.fields import CaptchaField


class LoginForm(forms.Form):
	name = forms.CharField(max_length=240,widget=forms.TextInput(attrs={'class':'form-control','placeholder': 'Username', 'autofocus':''}))
	email = forms.EmailField(widget=forms.EmailInput(attrs={'class': 'form-control','placeholder':'Email'}))
	password = forms.CharField(max_length=240, widget=forms.PasswordInput(attrs={'class':'form-control','placeholder':'Password'}))


class RegisterForm(forms.ModelForm):
	password = forms.CharField(max_length=240, widget=forms.PasswordInput)
	confirm_password = forms.CharField(max_length=240, widget=forms.PasswordInput)
	captcha = CaptchaField(label='验证码', required=True, error_messages={'required': '验证码不能为空'})

	class Meta:
		model = models.User
		fields = ['username', 'email', 'sex', 'password', 'confirm_password', 'captcha']
