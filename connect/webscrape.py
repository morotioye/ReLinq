

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium import webdriver
from bs4 import BeautifulSoup as bs
import re as re
import time
import pandas as pd
from linkedin_scraper import Person, actions
import pymongo
from pymongo import MongoClient
import requests
from sms import SMSLine


'''
USERNAME="email"
PASSWORD="password"

email=driver.find_element_by_id("username")
email.send_keys(USERNAME)
password=driver.find_element_by_id("password")
password.send_keys(PASSWORD)
time.sleep(3)
password.send_keys(Keys.RETURN)
'''

def read_Mongo():
    mongo_uri = "mongodb+srv://connect1:connect1@seeoh.i2jzuxi.mongodb.net/?retryWrites=true&w=majority"

    client = MongoClient(mongo_uri)

    db = client['test']

    collection = db['connections']


    all_records=collection.find()

    record_dict={}
    for record in all_records:
        record_dict[record['name']]=record['linkedInURL']
    #pd.read_json(all_records)

    return record_dict
    
def Scrape_func(a, b, c):
    name = a[28:-1]
    page = a
    time.sleep(10)

    driver.get(page + 'recent-activity/all/')
    start = time.time()
    lastHeight = driver.execute_script("return document.body.scrollHeight")
    while True:
        driver.execute_script(
            "window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(5)
        newHeight = driver.execute_script("return document.body.scrollHeight")
        if newHeight == lastHeight:
            break
        lastHeight = newHeight
        end = time.time()
        if round(end-start) > 20:
            break

    company_page = driver.page_source

    linkedin_soup = bs(company_page, "html.parser")
    containers = linkedin_soup.findAll(
        "li", {"class": "profile-creator-shared-feed-update__container"})
    print("Fetching data from account: " + name)
    iterations = 0
    #nos = int(input("Enter number of posts: "))
    for container in containers:

        try:
            text_box = container.find(
                "div", {"class": "feed-shared-update-v2__description-wrapper mr2"})
            text = text_box.find("span", {"dir": "ltr"})
            print("here")
            print(text)
            b.append(text.text.strip())
            c.append(name)
            iterations += 1
            print(iterations)
            
            '''
            if(iterations == nos):
                print("break")
                break
            '''

        except:
            pass


if __name__ == "__main__":

    record_dict=read_Mongo()

    #print(recordd_dict['Moroti'])
  
    driver = webdriver.Chrome()
    email = "matthew.wong20031223@gmail.com"
    password = "2495960332"
    actions.login(driver, email, password)

    post_links = []
    post_texts = []
    post_names = []

    for value in record_dict.values():
        Scrape_func(value,post_texts,post_names)
   
    
    line = SMSLine()
    for texts in post_texts:
        linkedin_update=texts
        line.process_content(message_type='linkedin_update', linkedin_update=linkedin_update, sender_name="Mike", recipient_name="Emily", user_phone_number="+12403748332")


    driver.quit()
