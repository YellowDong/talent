import rsa

# from Crypto.PublicKey import RSA
def readPem(self, path_name, key_type):
    """
    :param path_name: 密钥文件
    :param key_type:类型
    :return:
    """
    if 'pubkey' in key_type:
        self.pubkey = rsa.PublicKey.load_pkcs1(path_name)
    else:
        self.privkey = rsa.PublicKey.load_pkcs1(path_name)


def readpublic():
    with open(r'C:\Users\Administrator\Desktop\test_rsa_public_key1.pem', 'r') as f:
        pubkey = rsa.PublicKey.load_pkcs1(f.read().encode())
        return pubkey


def rsaEncrypt(text, pubkey):
    """
    :param test: str
    :return: bytes
    """
    content = text.encode('utf-8')
    crypto = rsa.encrypt(content, pubkey)
    return crypto


pub, pri = rsa.newkeys(2048)
pub = pub.save_pkcs1()
print(pub)
pri = pri.save_pkcs1()
with open('pub.pem', 'wb+')as f:
    f.write(pub)

with open('pri.pem', 'wb+') as f:
    f.write(pri)
# # import base64
# sign = 'juptInavPPVpnzGo6lx7joUv7Vod0+eWVDygbjuJfFPtP9sKMRgxh8Z8n9TPrzYQvG4dAY4+ifeMxHE/ZtT3oSX2RS30N+eZ9usVmUZ9e7WTYkXn8pqiI/4kVeSTLvQtZPWYzL8vwCHrHE3RtL9pwYsIx67AylSMokLashBHO79baeghp7B/igAKwAo4MN2zgaUkrXeXb/hyijtDVEv8IEbBhMARd6c2x2pmAID9o+8HpxemmFay7AxKCkMBrwMoRh2GanfPjHDlq25w215g18/eT2H4Xzqvkirby0Q+Tt/O3cB8garB0eVflQZd6kmsjyjsXIATAdCuaLyeGIaFAA=='
# data = 'Cpvy5zpho2ucbv+ne4CvP013tzHnbKoC1ulDzIXxxMKXOQ9wMt9x5Yex2XpLMIQ6g2+iiq3oGbIRD2SI2USydh7XO6+5xxLqAQ+6l5EYRNn1HVZEg/wEkqJ0qZkDrdaT9O+ENTqhWFKE25KZVG2lfuUL0eZbOsMrpKbir408/qRp9SmuWobQJYhHFh933ZnWpX5H3JSlaY2/Z2uwUAa/peB66afH1U3qFnmwx4koOLz8Ikf8wrcH6T+AM3GpMMJjdJCEpI+0OkEzcWNriOXqQjNM3o2GaJnB7ZsvOLOIcDWTQmn0lOYqcSp840wKzhek/4QOGQ7FqVavPt1xRrFEIg=='
# with open('pub.pem', 'rb') as f:
#     pub = rsa.PublicKey.load_pkcs1(f.read())
#     print(pub)
#     # public_keyBytes = base64.b64decode(pub)
#     result = rsa.verify(sign, data, pub)
#     print(result)
# import base64
# # 签名
# mgss = 'hello'
# pri_key = rsa.PrivateKey.load_pkcs1(pri)
# signture = rsa.sign(mgss.encode(), pri_key, 'SHA-1')
# print('签名结果：', signture)
# s = base64.b64encode(signture).decode('utf-8')
# print(s)
# #
# # # 验签
# with open('pub.pem', 'r')as f:
#
#     pub_key = rsa.PublicKey.load_pkcs1(f.read().encode())
# result = rsa.verify(mgss, signture, pub_key)
# print('验签结果:', result)

# with open(r'C:\Users\Administrator\Desktop\test_rsa_public_key1.pem', 'r')as f:
#     pub_key = rsa.PublicKey.load_pkcs1(f.read().encode())
#     print(pub_key)



if __name__ == '__main__':
    pass
    # pathname = r'C:\Users\Administrator\Desktop\test_rsa_public_key1.pem'
    # text = 'hello'
    # pubkey = readpublic()
    # print(pubkey)
    # crypto = rsaEncrypt(text, pubkey)
    # print(crypto)