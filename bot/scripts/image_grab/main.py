""" Image Stealer """
# Image getting mainly comes to two things
# 1.Getting image url by meta tags
# 2.Geting image by its size
from bs4 import BeautifulSoup
import requests
import random
import re 

# For Sorting list = For getting largest image
import operator

def getSize(image):
    x = re.search("(\d+)x(\d+)", image['src'])
    if x != None:
        x = x.group(0)
        height = int(x.split('x')[0])
        width = int(x.split('x')[1])
        total_size = height + width
        return total_size
    return None;

def urlCorrector(url):
    corrected_url = url
    if 'https' not in corrected_url:
        corrected_url = f'https:{url}'

    return corrected_url

def returnPoints(image):
    points = 1
    try:
        if image['alt'] > 2:
            points += 1;
        if image['alt'] < 100:
            points += 1
    except:
        pass
    finally:
        pass

    return str(points)
 
def image_grabber(soup):
    while True:
        # The Variable storing the returning image url
        ultimate_returning_image = ''
        break_it = False
        """ ============  Request ============ """
        # Soup Passed
        soup = soup
        # List for getting all images in the page
        all_img = []
    
        # Geting Images To Array 
        images = soup.findAll('img')
        # Array for Storing images with a source
        images_with_src = []
        for image in images:
            try:
                if len(image['src']) > 5:
                    if '.gif' not in image['src']:
                        images_with_src.append(image)
            except: 
                pass
            finally:
                pass

        
        """
        ============================================================ CHECKING IF MEETA TAG PRESENTED THE =================================================
        ============================================================ IF ELSE, THEN CONTINUING ============================================================
        """
        metas = soup.findAll('meta')
        for meta in metas:
            if meta.get("property") != None:
                if 'og' in meta.get("property"):
                    if meta.get('content').endswith('png') or meta.get('content').endswith('jpg') or meta.get('content').endswith('jpeg'):
                        ultimate_returning_image = urlCorrector(meta.get('content'))
                        break_it = True
        """
        ============================================================ CHECKING IF IMAGE URL PRESENTED THE =================================================
        ============================================================ IMAGE SIZE IF ELSE, THEN CONTINUING =================================================
        """
        if break_it == False:
            # Bool for track if thier images with no size
            none_image_sizes_found = False
            # Going through all images
            for image in images_with_src:
                image['src'] = urlCorrector(image['src'])
                image['points'] = returnPoints(image)
                image['size'] = getSize(image)
                # No size image found So Breaking size operations
                if getSize(image) == None:
                    none_image_sizes_found = True


            if none_image_sizes_found == False:
                # Sorting images by thier size
                images_with_src = sorted(images_with_src, key=operator.attrgetter('size'))
                ultimate_returning_image = images_with_src[0]
                break_it = True

        """
        ============================================================ RANDOM RANDOM RANDOM RANDOM RANDOM =================================================
        ============================================================ RANDOM RANDOM RANDOM RANDOM RANDOM =================================================
        """
        
        if break_it == False:
            # Randomly getting a Url
            ultimate_returning_image = urlCorrector(random.choice(images_with_src)['src'])
            break_it = True

        # Returning the image depending on the circumstance
        if break_it == False:
            return None

        if break_it == True:
            return ultimate_returning_image
