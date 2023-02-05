from flask import Flask, render_template, redirect, url_for, request, abort
import json 

app = Flask(__name__, instance_relative_config=True)

@app.route("/", methods=("GET", "POST"))
def index():
    words_table = json.loads(open("words_table.json","r",encoding="utf-8").read())
    # print(words_table)
    sample_words = [words_table["toki"],words_table["pona"]] #とりあえずtokiとponaを表示する
    return render_template("index.html", words=words_table)

@app.route("/<toki_pona_word>", methods=("GET", "POST"))
def word(toki_pona_word):
    words_table = json.loads(open("words_table.json","r",encoding="utf-8").read())
    if toki_pona_word not in words_table:
        #単語がない場合は404ページに飛ばす
        abort(404)
    return render_template("word.html", word=words_table[toki_pona_word])

@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000,debug=True)