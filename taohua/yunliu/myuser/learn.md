## 验证码
验证码依赖于第三方包django-simple-captcha,
进入虚拟环境，安装并注册captcha到APP_INSTALL
中并在urls.py中设置二级路由，在forms.py中导入CaptchaField,
最后通过python manage.py migrate迁移数据库