

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


'''
USERNAME="matthew.wong20031223@gmail.com"
PASSWORD="2495960332"

email=driver.find_element_by_id("username")
email.send_keys(USERNAME)
password=driver.find_element_by_id("password")
password.send_keys(PASSWORD)
time.sleep(3)
password.send_keys(Keys.RETURN)
'''


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
    nos = int(input("Enter number of posts: "))
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
            

            if(iterations == nos):
                print("break")
                break

        except:
            pass


if __name__ == "__main__":
    client = MongoClient('localhost', 27017)
    mydb = client["test"]
    connection=mydb['connections']
    documents=connection.find({ "linkedInURL": "oneeight.linkedin.com" })

    for i in documents:
        print(i)

    driver = webdriver.Chrome()
    email = "matthew.wong20031223@gmail.com"
    password = "2495960332"
    actions.login(driver, email, password)

    post_links = []
    post_texts = []
    post_names = []

    n = int(input("Enter the number of entries: "))
    for i in range(n):
        post_links.append(input("Enter the link: "))
    for j in range(n):
        Scrape_func(post_links[j], post_texts, post_names)

    for k in post_texts:
        print(k)

    driver.quit()
