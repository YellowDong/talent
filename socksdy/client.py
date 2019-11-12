import socket


def client():
	client = socket.socket()
	client.connect(('192.168.83.128', 5000))
	data = client.recv(1024)
	print('接收到数据:', data.decode('utf-8'))
	client.close()


if __name__ == '__main__':
	client()