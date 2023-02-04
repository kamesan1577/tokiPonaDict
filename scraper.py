import requests
from bs4 import BeautifulSoup
import json

DICT_URL = "https://ja.wikibooks.org/wiki/%E3%83%88%E3%82%AD%E3%83%9D%E3%83%8A/%E8%BE%9E%E6%9B%B8"

def fetch_words(): #wikibooksから単語のリストを取得する
    words_table = {} #単語のリストを格納する辞書
    response = requests.get(DICT_URL)
    table_soup = BeautifulSoup(response.text,"html.parser").select("#mw-content-text > div.mw-parser-output > table")

    #words_tableに単語のリストを格納する
    for table in table_soup:
        for tr in table.select("tr"):
            try:
                key = tr.select("td")[0].text.strip()
                #読み、名詞、動詞、修飾子、その他の順に格納する。 strip()は余分な改行コードを削除する
                value = {"単語":key,"カナ":tr.select("td")[1].text.strip(),"名詞":tr.select("td")[2].text.strip(),"動詞":tr.select("td")[3].text.strip(),"修飾子":tr.select("td")[4].text.strip(),"その他":tr.select("td")[5].text.strip()}
                words_table[key] = value
            except IndexError:
                pass
            except AttributeError:
                pass
    return words_table

if __name__ == "__main__":
    words_table = fetch_words()
    json.dump(words_table,open("words_table.json","w",encoding="utf-8"),ensure_ascii=False,indent=4)
    







