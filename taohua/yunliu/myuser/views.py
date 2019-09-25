import hashlib

from django.shortcuts import render, redirect
from django.shortcuts import reverse

from .forms import LoginForm, RegisterForm
from .models import User


def hascode(code):
	hash_code = hashlib.md5()
	hash_code.update(code.encode())
	return hash_code.hexdigest()


def index(request):
	if request.session.get('is_login'):
		return render(request, 'myuser/index.html', locals())
	return redirect(reverse('myuser:login'))


def login(request):
	if request.session.get('is_login', None):  # 不允许重复登录
		return redirect(reverse('myuser:index'))
	if request.method == 'POST':
		login_form = LoginForm(request.POST)
		message = '请检查你输入的内容'
		if login_form.is_valid():
			name = login_form.cleaned_data.get('name')
			password = login_form.cleaned_data.get('password')
			email = login_form.cleaned_data.get('email')
			try:
				user = User.objects.get(username=name)
			except Exception as e:
				message = '没有该用户'
				return render(request, 'myuser/login.html', locals())
			pwd = user.password
			if pwd != hascode(password):
				message = '输入的密码不正确，请重新输入'
				return render(request, 'myuser/login.html', locals())
			elif email != user.email:
				message = '输入的邮箱与注册时填写的邮箱不符'
				return render(request, 'myuser/login.html', locals())
			request.session['is_login'] = True
			request.session['user_id'] = user.id
			request.session['user_name'] = user.username
			request.user.username = user.username
			return redirect(reverse('myuser:index'))

		else:
			return render(request, 'myuser/login.html', locals())
	login_form = LoginForm()
	return render(request, 'myuser/login.html', locals())


def register(request):
	if request.method == 'POST':
		register_form = RegisterForm(request.POST)
		message = '请检查你输入的内容'
		if register_form.is_valid():
			name = register_form.cleaned_data.get('username')
			email = register_form.cleaned_data.get('email')
			password = register_form.cleaned_data.get('password')
			confirm_password = register_form.cleaned_data.get('confirm_password')
			sex = register_form.cleaned_data.get('sex')
			if password != confirm_password:
				message = '输入的密码不一致'
				return render(request, 'myuser/register.html', locals())
			user = User()
			user.username = name
			user.password = hascode(password)
			user.email = email
			user.sex = sex
			user.save()
			return redirect(reverse('myuser:login'))
		else:
			return render(request, 'myuser/register.html', locals())
	register_form = RegisterForm()
	return render(request, 'myuser/register.html', locals())



def logout(request):
	if not request.session.get('is_login', None):
		return redirect(reverse('myuser:login'))
	request.session.flush()
	return redirect(reverse('myuser:login'))
