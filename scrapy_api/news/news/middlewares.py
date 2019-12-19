# -*- coding: utf-8 -*-

# Define here the models for your spider middleware
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/spider-middleware.html

from scrapy import signals
import requests
import random
import logging
import sys
import json
sys.path.append("/home/sd/workspace/talent")

from utils import chaojiying
from scrapy.http import HtmlResponse

from urllib.parse import urlencode

logger = logging.getLogger(__name__)


class NewsSpiderMiddleware(object):
    # Not all methods need to be defined. If a method is not defined,
    # scrapy acts as if the spider middleware does not modify the
    # passed objects.

    @classmethod
    def from_crawler(cls, crawler):
        # This method is used by Scrapy to create your spiders.
        s = cls()
        crawler.signals.connect(s.spider_opened, signal=signals.spider_opened)
        return s

    def process_spider_input(self, response, spider):
        # Called for each response that goes through the spider
        # middleware and into the spider.

        # Should return None or raise an exception.
        return None

    def process_spider_output(self, response, result, spider):
        # Called with the results returned from the Spider, after
        # it has processed the response.

        # Must return an iterable of Request, dict or Item objects.
        for i in result:
            yield i

    def process_spider_exception(self, response, exception, spider):
        # Called when a spider or process_spider_input() method
        # (from other spider middleware) raises an exception.

        # Should return either None or an iterable of Request, dict
        # or Item objects.
        pass

    def process_start_requests(self, start_requests, spider):
        # Called with the start requests of the spider, and works
        # similarly to the process_spider_output() method, except
        # that it doesn’t have a response associated.

        # Must return only requests (not items).
        for r in start_requests:
            yield r

    def spider_opened(self, spider):
        spider.logger.info('Spider opened: %s' % spider.name)


class NewsDownloaderMiddleware(object):
    # Not all methods need to be defined. If a method is not defined,
    # scrapy acts as if the downloader middleware does not modify the
    # passed objects.
    def __init__(self, username, password, softid, codetype, captcha_url):
        self.uuid = self.get_uuid()
        self.headers = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',
                        'Host': 'zxgk.court.gov.cn',
                        'Referer': 'http://zxgk.court.gov.cn/zhixing/'}
        self.username = username
        self.password = password
        self.softid = softid
        self.codetype = codetype
        self.session = requests.session()
        self.chaoji_client = chaojiying.Chaojiying_Client(self.username, self.password.encode(), self.softid)
        self.captcha_url = captcha_url
        self.captcha = self.get_captcha()

    @classmethod
    def from_crawler(cls, crawler):
        # This method is used by Scrapy to create your spiders.
        settings = crawler.settings
        chaojiying = settings.get("CHAO_JI_YING", {})
        zhixing = settings.get("ZHIXING", {})

        s = cls(
            username=chaojiying.get("username"),
            password=chaojiying.get("password"),
            softid=chaojiying.get("softid"),
            codetype=chaojiying.get("codetype"),
            captcha_url=zhixing.get("captcha_url")
        )
        crawler.signals.connect(s.spider_opened, signal=signals.spider_opened)
        return s

    def get_uuid(self):
        from uuid import uuid4
        uuid = str(uuid4()).replace('-', '')
        return uuid

    def get_captcha(self):
        randnum = random.random()
        headers = self.headers
        uuid = self.uuid
        base_url = self.captcha_url
        payload = {
            "captchaId": uuid,
            "random": randnum
        }
        url = base_url + urlencode(payload)
        try:
            resp = self.session.get(url, headers=headers)
            if resp.status_code == 200:
                yzm = self.chaoji_client.PostPic(resp.content, self.codetype)
                if yzm['err_str'] == 'OK':
                    return yzm['pic_str']
        except Exception as e:
            return e

    def process_request(self, request, spider):
        if request.method == 'POST':
            formdata = json.loads(request.body)
            if formdata.get("currentPage") == '1':
                pname = request.meta.get("pname")
                if not pname:
                    return HtmlResponse(url=request.url, request=request)
                uuid = self.uuid
                captcha = self.captcha
                headers = self.headers
                print(pname, uuid, captcha)

                formdata['pName'] = pname
                formdata['pCode'] = captcha
                formdata['captchaId'] = uuid

                resp = self.session.post(request.url, data=formdata, headers=headers)

                return HtmlResponse(url=request.url, body=resp.content, request=request, encoding='utf-8', status=resp.status_code)
        # Called for each request that goes through the downloader
        # middleware.

        # Must either:
        # - return None: continue processing this request
        # - or return a Response object
        # - or return a Request object
        # - or raise IgnoreRequest: process_exception() methods of
        #   installed downloader middleware will be called
        return None

    def process_response(self, request, response, spider):
        # Called with the response returned from the downloader.
        if not request.meta.get('pname'):
            pname = response.meta.get('pname')
            data = json.loads(request.body)
            data['pName'] = pname
            return request
        else:
            data = json.loads(request.body)
          # request.meta.get('pname')
            data['pCode'] = self.captcha
            data['captchaId'] = self.uuid
            response.meta["data"] = data


        # Must either;
        # - return a Response object
        # - return a Request object
        # - or raise IgnoreRequest
        return response

    def process_exception(self, request, exception, spider):
        # Called when a download handler or a process_request()
        # (from other downloader middleware) raises an exception.

        # Must either:
        # - return None: continue processing this exception
        # - return a Response object: stops process_exception() chain
        # - return a Request object: stops process_exception() chain
        pass

    def spider_opened(self, spider):
        spider.logger.info('Spider opened: %s' % spider.name)
