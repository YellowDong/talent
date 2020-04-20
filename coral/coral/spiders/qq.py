# -*- coding: utf-8 -*-
import scrapy


class QqSpider(scrapy.Spider):
    name = 'qq'
    allowed_domains = ['qq.com']
    # start_urls = ['http://qq.com/']
    start_urls = ['https://pacaio.match.qq.com/irs/rcd?cid=137&token=d0f13d594edfc180f5bf6b845456f3ea&id=&ext=top&page=4&expIds=20200419V0ILRZ|20200419A0FE5G|20200419A0ES8I|20200419V0742G|20200123003581|20200128005373|20200419V0IC6I|20200419004443|20200419004804|20200419A09DWV&callback=__jp7']

    def parse(self, response):
        print(response.text)
