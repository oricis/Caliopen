from nltk.tokenize import word_tokenize
from bs4 import BeautifulSoup

resources_path = "/var/tmp/"


def pre_process(text, html=False):
    if html:
        text = BeautifulSoup(text, "html.parser").text
    return " ".join(word_tokenize(text)) \
        .replace("\n", " ") \
        .lower()
