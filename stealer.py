""" For Ikman.lk """
import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "sihala.settings")
django.setup()

from bot.models import WebPage, HeadedUrl
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
    while True:
        url = HeadedUrl.objects.all().order_by('-id')[0].url
        # Headers for the request
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:20.0) Gecko/20100101 Firefox/20.0'}
        page = requests.get(url, headers=headers)
        soup = BeautifulSoup(page.text, 'html.parser')
        title = soup.title.text

        all_a = []
    
        # Links Filtered!
        for a in soup.find_all('a', href=True):
            if '/si/ad/' in a['href']:
                all_a.append('https://ikman.lk' + a['href'])

        # Creating a Web Page
        new_web_page = WebPage()
        new_web_page.title = title
        new_web_page.url = url
        new_web_page.content = description_grabber(soup)
        new_web_page.img_url = image_grabber(soup)
        new_web_page.save()


        all_a2 = []
        for a in all_a:
            if '/si/ad/' in a:
                if 'report' not in a and 'promote' not in a and 'http:' not in a:
                    all_a2.append(a)
                    
        # removing duplicates of filtered
        all_a2 = list(dict.fromkeys(all_a2))

        # Making the next headed link
        if len(all_a2) > 0:
            #Making the next endpoint url 
            new_headed_url = HeadedUrl()
            new_headed_url.url = random.choice(all_a2)
            new_headed_url.title = title
            new_headed_url.save()
            print('current url : ' + url)


def remove_duplicates():
    for title in WebPage.objects.values_list('title', flat=True).distinct():
        WebPage.objects.filter(pk__in=WebPage.objects.filter(title=title).values_list('id', flat=True)[1:]).delete()

just_crawl()
