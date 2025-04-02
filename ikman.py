""" For Ikman.lk """
import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "sihala.settings")
django.setup()

from bot.models import WebPage, HeadedUrl, LastPageNumber
from bs4 import BeautifulSoup
import requests
import random
# character converters
import sys

# Importing Self Made Module
from bot.scripts.image_grab.main import image_grabber
from bot.scripts.description_grab.main import description_grabber
from bot.scripts.title_grab.main import title_grabber

# Encoder to Correct Charsets
non_bmp_map = dict.fromkeys(range(0x10000, sys.maxunicode + 1), 0xfffd)

def just_crawl():
    for pageNum in range(157, 225000):
        aNewLastPage = LastPageNumber(last_page_number=pageNum)
        aNewLastPage.save()
        url = f'https://ikman.lk/si/ads/sri-lanka?by_paying_member=0&sort=date&buy_now=0&page={str(pageNum)}'
        # Headers for the request
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:20.0) Gecko/20100101 Firefox/20.0'}
        page = requests.get(url, headers=headers)
        soup = BeautifulSoup(page.text, 'html.parser')
        title = soup.title.text

        # Creating a Web Page
        new_web_page = WebPage()
        new_web_page.title = title
        new_web_page.url = url
        new_web_page.content = description_grabber(soup)
        new_web_page.img_url = image_grabber(soup)
        new_web_page.save()

        all_a = []
        # Links Filtered!
        for a in soup.find_all('a', href=True):
            if '/si/ad/' in a['href']:
                if 'report' not in a['href'] and 'promote' not in a['href'] and 'http:' not in a['href']:
                    if 'card-link' in a['class'][0]:
                        all_a.append('https://ikman.lk' + a['href'])
            
                    
        # removing duplicates of filtered
        all_a = list(dict.fromkeys(all_a))
        # Making the next headed link
        for a in all_a:
            url = a
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:20.0) Gecko/20100101 Firefox/20.0'}
            page = requests.get(url, headers=headers)
            soup = BeautifulSoup(page.text, 'html.parser')

            # Creating a Web Page
            new_web_page = WebPage()
            new_web_page.title = title_grabber(soup)
            new_web_page.url = url
            new_web_page.content = description_grabber(soup)
            new_web_page.img_url = image_grabber(soup)
            new_web_page.save()
            


def remove_duplicates():
    for title in WebPage.objects.values_list('title', flat=True).distinct():
        WebPage.objects.filter(pk__in=WebPage.objects.filter(title=title).values_list('id', flat=True)[1:]).delete()

just_crawl()
