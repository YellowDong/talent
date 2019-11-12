# -*- coding: utf-8 -*-
from django import forms
from . import models

from captcha.fields import CaptchaField, CaptchaTextInput


class LoginForm(forms.Form):
	name = forms.CharField(max_length=240, widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': '用户名', 'autofocus': ''}))
	email = forms.EmailField(widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': '邮箱'}))
	password = forms.CharField(max_length=240, widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': '密码'}))
	captcha = CaptchaField(label='验证码', required=True, error_messages={'required': '验证码不能为空'}, widget=CaptchaTextInput(attrs={'class': 'form-control'}))


class RegisterForm(forms.ModelForm):
	# 自定义的表单字段属性在Meta类中定义没有起效果
	confirm_password = forms.CharField(label='确认密码', max_length=240, widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': '确认密码'}))
	captcha = CaptchaField(label='验证码', required=True, error_messages={'required': '验证码不能为空'}, widget=CaptchaTextInput(attrs={'class': 'form-control'}))

	class Meta:
		model = models.User
		fields = ['username', 'email', 'sex', 'password', 'confirm_password', 'captcha']

		widgets = {'username': forms.TextInput(attrs={'class': 'form-control', 'placeholder': '用户名', 'autofocus': ''}),
					'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': '邮箱'}),
					'password': forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': '密码'}),
					'confirm_password': forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': '确认密码'})
				}
		labels = {'username': '用户名', 'email': '邮箱', 'sex': '性别', 'password': '密码'}
