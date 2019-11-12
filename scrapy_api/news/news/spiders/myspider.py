# -*- coding: utf-8 -*-
import json
import os
from urllib.parse import urlencode

import scrapy
import demjson

from .. import settings
from ..items import NewsItem


base_path = '/home/sd/workspace/talent/'


class MyspiderSpider(scrapy.Spider):
    name = 'myspider'
    allowed_domains = ['eastmoney.com']
    # start_urls = ['http://eastmoney.com/']

    def start_requests(self):
        h_or_s = "gf1"

    def get_company_code(self, h_or_s, page='1'):
        # h_url = 'http://xuanguapi.eastmoney.com/Stock/JS.aspx?type=xgq&sty=xgq&token=eastmoney&c=[gf1]&p=7&jn=DerJFQos&ps=40&s=gf1&st=-1&r=1571126342736'
        # s_url = 'http://xuanguapi.eastmoney.com/Stock/JS.aspx?type=xgq&sty=xgq&token=eastmoney&c=[gf2]&p=2&jn=DjEhzzpp&ps=40&s=gf2&st=-1&r=1571126451554'
        url = 'http://xuanguapi.eastmoney.com/Stock/JS.aspx?'
        paras = {
            'type': 'xgq',
            'sty': 'xgq',
            'token': 'eastmoney',
            'c': f'[{h_or_s}]',
            'p': page,
            'jn': '',
            'ps': '40',
            's': h_or_s,
            'st': '-1'
        }
        yield scrapy.Request(url+urlencode(paras), meta={'h_or_s': h_or_s}, callback=self.parse_company_code)

    def parse_company_code(self, response):
        json_text = response.text.split('=')[1]
        json_response = json.loads(json_text)
        results = json_response.get('Results')
        current_page = json_response.get('AtPage')
        page_count = json_response.get('PageCount')
        if settings.IS_WRITE_JSON:
            self.write_code_to_file(results)
        if settings.IS_STORE_DATABASE:
            for result in results:
                temps = result.split(',')
                code = temps[1]
                self.get_data(code)

        if current_page < page_count:
            page = int(current_page) + 1
            h_or_s = response.meta.get('h_or_s')
            self.get_company_code(h_or_s, str(page))

    def get_data(self, stock_code, page='1'):
        # url = 'http://dcfm.eastmoney.com//em_mutisvcexpandinterface/api/js/get?type=YJBB21_YJBB&token=70f12f2f4f091e459a279469fe49eca5&filter=(scode=600185)&st=reportdate&sr=-1&p=2&ps=50&js=
        # var%20XRFJZipT={pages:(tp),data:%20(x),font:(font)}&rt=52370730'
        url = 'http://dcfm.eastmoney.com//em_mutisvcexpandinterface/api/js/get?'
        params = {
            'type': 'YJBB21_YJBB',
            'token': '70f12f2f4f091e459a279469fe49eca5',
            'filter': f'(scode={stock_code})',
            'st': 'reportdate',
            'sr': '-1',
            'p': page,
            'ps': '50',
            'js': 'var%20XRFJZipT={pages:(tp),data:%20(x),font:(font)}',
            'rt': '52370730'
        }
        yield scrapy.Request(url+urlencode(params), meta={'stock_code': stock_code, 'page': page}, callback=self.parse_data)

    @staticmethod
    def write_code_to_file(content):
        file_path = os.path.join(base_path, 'code_company.json')
        with open(file_path, 'a') as f:
            json.dump(content, f)
            print('写入数据完成')

    def parse_data(self, response):
        item = NewsItem()
        json_data = response.text.split("=")[1]
        dict_data = demjson.decode(json_data)
        page_count = dict_data.get("pages")
        datas = dict_data.get("data")
        font_map = dict_data.get("font").get("FontMapping")
        font_dict = {font.get("code"): font.get("value") for font in font_map}
        stock_code = response.meta.get("stock_code")
        page = response.meta.get("stock_code")
        for data in datas:
            stock_code = data.get('scode')
            company = data.get('sname')
            earn_per_share = self.font_mapping(font_dict, data.get("basiceps").split(";"))
            roe = self.font_mapping(font_dict, data.get("roeweighted").split(";"))
            annouce_date = data.get("firstnoticedate")  # 首次公告日
            reportdate = data.get("reportdate")  # 截止日期
            operat_income = self.font_mapping(font_dict, data.get("totaloperatereve").split(";"))  # 营业收入
            parentnetprofit = self.font_mapping(font_dict, data.get("parentnetprofit").split(";"))  # 净利润
            sjlhz = self.font_mapping(font_dict, data.get("sjlhz").split(";"))  # 净利润环比增长
            sjltz = self.font_mapping(font_dict, data.get("sjltz").split(";"))  # 净利润同比增长
            xsmll = self.font_mapping(font_dict, data.get("xsmll").split(";"))  # 毛利率
            ystz = self.font_mapping(font_dict, data.get("ystz").split(";"))  # 营业收入同比增长
            yshz = self.font_mapping(font_dict, data.get("yshz").split(";"))  # 营业收入环比增长
            assigndscrpt = self.font_mapping(font_dict, data.get("assigndscrpt").split(";"))  # 利润分配
            gxl = self.font_mapping(font_dict, data.get("gxl").split(";"))  # 股息率
            bps = self.font_mapping(font_dict, data.get("bps").split(";"))  # 每股净资产
            item['stock_code'] = stock_code
            item['company'] = company
            item['earn_per_share'] = earn_per_share
            item['roe'] = roe
            item['annouce_date'] = annouce_date
            item['date_time'] = reportdate
            item['operat_income'] = operat_income
            item['net_profit'] = parentnetprofit
            item['profit_quarter_on_quarter_growth'] = sjlhz
            item['profit_year_over_year'] = sjltz
            item['gross_margin'] = xsmll
            item['income_year_over_year'] = ystz
            item['income_quarter_on_quarter_growth'] = yshz
            item['profit_distribution'] = assigndscrpt
            item['dividend_yield'] = gxl
            item['net_assets_per_share'] = bps
            yield item
        if int(page_count) > int(page):
            page = int(page) + 1
            self.get_data(stock_code, str(page))

    @staticmethod
    def font_mapping(font_dict, listing):
        numstr = [font_dict[i] for i in listing if i]
        num = ''.join(numstr)
        return num
