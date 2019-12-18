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
    def __init__(self, username, password, softid, codetype):
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

    @classmethod
    def from_crawler(cls, crawler):
        # This method is used by Scrapy to create your spiders.
        s = cls(
            crawler.settings.get('USERNAME'),
            crawler.settings.get('PASSWORD'),
            crawler.settings.get('SOFTID'),
            crawler.settings.get('CODETYPE')
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
        try:
            resp = self.session.get(f"http://zxgk.court.gov.cn/zhixing/captcha.do?captchaId={uuid}&random={randnum}", headers=headers)
            if resp.status_code == 200:
                yzm = self.chaoji_client.PostPic(resp.content, self.codetype)
                if yzm['err_str'] == 'OK':
                    return yzm['pic_str']
        except Exception as e:
            return e

    def process_request(self, request, spider):
        pname = request.meta.get("pname", "陈亮")
        uuid = self.uuid
        captcha = self.get_captcha()
        headers = self.headers
        print(pname, uuid, captcha)
        # logger.debug(pname, uuid, captcha)
        # request.headers['User-Agent'] = headers['User-Agent']
        # formdata = json.loads(request.body)
        # formdata['pName'] = pname
        # formdata['pCode'] = captcha
        # formdata['captchaId'] = uuid
        # print(formdata)
        # resp = self.session.post(request.url, data=formdata, headers=headers)
        # print(resp)

        # print(resp.json())
        #request.body = json.dumps(formdata)
        formdata = {
            'pName': pname,
            'pCardNum': '',
            'selectCourtId': '0',
            'pCode': captcha,
            'captchaId': uuid,
            'searchCourtName': '全国法院（包含地方各级法院）',
            'selectCourtArrange': '1',
            'currentPage': '1'
        }
        resp = self.session.post(request.url, data=formdata, headers=headers)
        # request.formdata['captchaId'] = uuid
        # request.formdata['pCode'] = captcha
        # request.formdata['pName'] = pname
        # print(request.url)
        # resp = requests.post(request.url, data=form_data, headers=headers)
        # print(resp.status_code)
        # print(resp)
        # print('+++++++++')
        # print(resp.json())
        # print('_++_+_+_+_')
        # #logger.debug(pname, uuid, captcha, resp.text)
        # print(resp.text, '==============')
        return HtmlResponse(url=request.url, body=resp.content, request=request, encoding='utf-8', status=resp.status_code, uuid=uuid, captcha=captcha, formdata=formdata)
        # Called for each request that goes through the downloader
        # middleware.

        # Must either:
        # - return None: continue processing this request
        # - or return a Response object
        # - or return a Request object
        # - or raise IgnoreRequest: process_exception() methods of
        #   installed downloader middleware will be called
        # return None

    def process_response(self, request, response, spider):
        # Called with the response returned from the downloader.

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
