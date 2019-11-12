import socket
import datetime
import threading


def server():
	server = socket.socket(family=socket.AF_INET, type=socket.SOCK_STREAM)
	server.bind(('192.168.83.128', 5000))
	server.listen(512)
	print('正在监听192.168.83.128的5000端口')
	while True:
		today = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
		client, addr = server.accept()
		print(addr, '连接到了服务器')
		client.send(today.encode('utf-8'))
		client.close()

########################################################################


class mutiserver(threading.Thread):
	def __init__(self, client):
		super(mutiserver, self).__init__()
		self.client = client

	def run(self) -> None:
		today = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
		# client, addr = self.server.accept()
		self.client.send(today.encode('utf-8'))
		self.client.close()


def work():
	server = socket.socket()
	server.bind(('192.168.83.128', 5000))
	server.listen(512)
	while True:
		client, addr = server.accept()
		t = mutiserver(client)
		t.start()




if __name__ == '__main__':
	work()