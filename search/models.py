from django.db import models
import requests
from bs4 import BeautifulSoup
import urllib.request
import json 
# import HTMLSession from requests_html
from requests_html import HTMLSession
# Selenium
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

class YtTrending(models.Model):
    title = models.CharField(max_length=500)
    url = models.CharField(max_length=500)
    thumbnail = models.ImageField(blank=True)
    thumbnail_url = models.CharField(max_length=500)

    def __str__(self):
        return str(self.title)

class NewsItem(models.Model):
    title = models.CharField(max_length=1000)
    content = models.CharField(max_length=5000)
    thumbnail_url = models.CharField(max_length=500)

    def __str__(self):
        return self.title

class StatusObject(models.Model):
    weather_value = models.IntegerField()
    rupee_value = models.IntegerField()
    population = models.IntegerField()

def updateNews(array):
    for url in array:
        # Headers for the request
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:20.0) Gecko/20100101 Firefox/20.0'}
        page = requests.get(url, headers=headers)
        soup = BeautifulSoup(page.text, 'html.parser')
        all_metas = soup.findAll('meta')

        news_title = ''
        news_image_url = ''
        for meta in all_metas:
            if meta.get('property') == 'og:image':
                news_image_url = meta['content']
            if meta.get('name') == 'description':
                news_title = meta['content']
        news_title = news_title.replace('COLOMBO ', '')
        # Creating news item instance
        newsItemIns = NewsItem()
        newsItemIns.title = news_title
        newsItemIns.thumbnail_url = news_image_url


def updateForDay():
    # Universal Status Object
    status_obj = StatusObject.objects.all()[0]
    # Weather request
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:20.0) Gecko/20100101 Firefox/20.0'}
    url = 'http://dataservice.accuweather.com/currentconditions/v1/311399?apikey=VwRiGtlkn8iDjFACNoLYwo5rJfaiUCAJ'
    page = requests.get(url, headers=headers)
    soup = BeautifulSoup(page.text, 'html.parser')
    python_data = json.loads(soup.text)
    # Weather updated
    try:
        status_obj.weather_value = python_data[0]['Temperature']['Metric']['Value']
    except:
        pass
    finally:
        pass
    # Currency Request
    url = 'https://fixer-fixer-currency-v1.p.rapidapi.com/latest?base=USD&symbols=LKR'  
    headers['x-rapidapi-host'] = 'fixer-fixer-currency-v1.p.rapidapi.com'
    headers['x-rapidapi-key'] = 'ab045ea05emsh499f266fee90a9dp146e28jsn3a4cfc349f00'
    page = requests.get(url, headers=headers)
    soup = BeautifulSoup(page.text, 'html.parser')
    python_data = json.loads(soup.text)
    status_obj.rupee_value = python_data['rates']['LKR']
    # Population
    url = 'https://countrymeters.info/en/Sri_Lanka'
    session = HTMLSession()
    page = session.get(url, headers=headers)
    soup = BeautifulSoup(page.text, 'html.parser')
    status_obj.population = int(str(soup.find("div", {"id": "cp1"}).text).replace(',', ''))
    # Universal save
    status_obj.save()
