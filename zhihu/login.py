import execjs
import hmac
import time
import hashlib
import requests
from urllib.parse import urlencode

def login(username, password):
    # 构造登录请求
    client_id = 'c3cef7c66a1843f8b3a9e6a1e3160e20'
    timestamp = str(int(time.time() * 1000))
    grant_type = 'password'
    source = 'com.zhihu.web'
    signature = hmac.new(b'd1b964811afb40118a12068ff74a12f4', digestmod=hashlib.sha1)
    signature.update(bytes((grant_type + client_id + source + timestamp), 'utf-8'))
    signature = signature.hexdigest()
    login_url = 'https://www.zhihu.com/api/v3/oauth/sign_in'
    data = {
        'client_id': client_id,
        'grant_type': grant_type,
        'source': source,
        'username': username,
        'password': password,
        'lang': 'cn',
        'ref_source': 'other_https://www.zhihu.com/signin',
        'utm_source': '',
        'captcha': '',
        'timestamp': timestamp,
        'signature': signature
    }
    login_headers = {
        'content-type': 'application/x-www-form-urlencoded',
        'origin': 'https://www.zhihu.com',
        'referer': 'https://www.zhihu.com/signin',
        'x-requested-with': 'fetch',
        'x-zse-83': '3_2.0'
    }
    with open(r'zhihu.js') as f:
        ctx = execjs.compile(f.read())
        data = ctx.call('encrypt', urlencode(data))
        print(data)

    #登录部分自己完善
    # res = requests.post(login_url, data=data, headers=login_headers)
    # res_json = res.json()
    # print(res_json)

if __name__ == '__main__':
    login('12345678', 'hello')