from django import forms


class LoginForm(forms.Form):
	name = forms.CharField(max_length=240)
	email = forms.EmailField()
	password = forms.CharField(max_length=240, widget=forms.PasswordInput)
