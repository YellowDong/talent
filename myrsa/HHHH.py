import rsa
import base64
from Crypto.Hash import SHA1

from Crypto import Hash
from Crypto.Cipher import PKCS1_v1_5 as Cipher_pkcs1_v1_5
sign = 'juptInavPPVpnzGo6lx7joUv7Vod0+eWVDygbjuJfFPtP9sKMRgxh8Z8n9TPrzYQvG4dAY4+ifeMxHE/ZtT3oSX2RS30N+eZ9usVmUZ9e7WTYkXn8pqiI/4kVeSTLvQtZPWYzL8vwCHrHE3RtL9pwYsIx67AylSMokLashBHO79baeghp7B/igAKwAo4MN2zgaUkrXeXb/hyijtDVEv8IEbBhMARd6c2x2pmAID9o+8HpxemmFay7AxKCkMBrwMoRh2GanfPjHDlq25w215g18/eT2H4Xzqvkirby0Q+Tt/O3cB8garB0eVflQZd6kmsjyjsXIATAdCuaLyeGIaFAA=='
data = 'Cpvy5zpho2ucbv+ne4CvP013tzHnbKoC1ulDzIXxxMKXOQ9wMt9x5Yex2XpLMIQ6g2+iiq3oGbIRD2SI2USydh7XO6+5xxLqAQ+6l5EYRNn1HVZEg/wEkqJ0qZkDrdaT9O+ENTqhWFKE25KZVG2lfuUL0eZbOsMrpKbir408/qRp9SmuWobQJYhHFh933ZnWpX5H3JSlaY2/Z2uwUAa/peB66afH1U3qFnmwx4koOLz8Ikf8wrcH6T+AM3GpMMJjdJCEpI+0OkEzcWNriOXqQjNM3o2GaJnB7ZsvOLOIcDWTQmn0lOYqcSp840wKzhek/4QOGQ7FqVavPt1xRrFEIg=='
from Crypto.Signature import PKCS1_v1_5 as Signature_pkcs1_v1_5
from Crypto.PublicKey import RSA

messge = 'hello word'


def to_sign(messge):
    """RSA签名"""
    with open('pri.pem', 'r') as f:
        pri_key = RSA.importKey(f.read())
        hash_obj = SHA1.new(messge.encode())
        signature = Signature_pkcs1_v1_5.new(pri_key).sign(hash_obj)
        signature = base64.b64encode(signature).decode('utf-8')
        print(signature)
        return signature


def to_verify(signature, messge):
    """RSA验签"""
    with open('my_pksc8_public_key.pem', 'r')as f:
        pub_key = RSA.importKey(f.read())
        verifier = Signature_pkcs1_v1_5.new(pub_key)
        hash_obj = SHA1.new(messge.encode())
        is_verify = verifier.verify(hash_obj, base64.b64decode(signature.encode()))
        print(is_verify)
        return is_verify
s = 'juptInavPPVpnzGo6lx7joUv7Vod0+eWVDygbjuJfFPtP9sKMRgxh8Z8n9TPrzYQvG4dAY4+ifeMxHE/ZtT3oSX2RS30N+eZ9usVmUZ9e7WTYkXn8pqiI/4kVeSTLvQtZPWYzL8vwCHrHE3RtL9pwYsIx67AylSMokLashBHO79baeghp7B/igAKwAo4MN2zgaUkrXeXb/hyijtDVEv8IEbBhMARd6c2x2pmAID9o+8HpxemmFay7AxKCkMBrwMoRh2GanfPjHDlq25w215g18/eT2H4Xzqvkirby0Q+Tt/O3cB8garB0eVflQZd6kmsjyjsXIATAdCuaLyeGIaFAA=='
mss = 'channelCode=CCB&data=Cpvy5zpho2ucbv+ne4CvP013tzHnbKoC1ulDzIXxxMKXOQ9wMt9x5Yex2XpLMIQ6g2+iiq3oGbIRD2SI2USydh7XO6+5xxLqAQ+6l5EYRNn1HVZEg/wEkqJ0qZkDrdaT9O+ENTqhWFKE25KZVG2lfuUL0eZbOsMrpKbir408/qRp9SmuWobQJYhHFh933ZnWpX5H3JSlaY2/Z2uwUAa/peB66afH1U3qFnmwx4koOLz8Ikf8wrcH6T+AM3GpMMJjdJCEpI+0OkEzcWNriOXqQjNM3o2GaJnB7ZsvOLOIcDWTQmn0lOYqcSp840wKzhek/4QOGQ7FqVavPt1xRrFEIg==&timeStamp=1587042198&serviceName=getInsuranceFiles'

# if __name__ == '__main__':
# s = to_sign(messge)
to_verify(s, mss)