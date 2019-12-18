# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class NewsItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    # company = scrapy.Field()
    # stock_code = scrapy.Field()
    # date_time = scrapy.Field() #截止日期
    # earn_per_share = scrapy.Field() #每股收益
    # operat_income = scrapy.Field() #营业收入
    # income_year_over_year = scrapy.Field()#同比收入
    # income_quarter_on_quarter_growth = scrapy.Field()#环比收入
    # net_profit = scrapy.Field() #净利润
    # profit_year_over_year = scrapy.Field() #同比净利润
    # profit_quarter_on_quarter_growth = scrapy.Field() #环比净利润
    # net_assets_per_share = scrapy.Field()#每股净资产
    # roe = scrapy.Field()#净资产收益率
    # gross_margin = scrapy.Field() #毛利率
    # profit_distribution = scrapy.Field() #利润分配
    # dividend_yield = scrapy.Field() #股息率
    # annouce_date = scrapy.Field() #首次公告日

    case_code = scrapy.Field()
    person_name = scrapy.Field()
    case_create_time = scrapy.Field()
    cert_code = scrapy.Field()
    court = scrapy.Field()
    execute_money = scrapy.Field()



