import os
import matplotlib.pyplot as plt
from flask import Flask, render_template, jsonify, request
import myPostgre
from collections import OrderedDict
from flask_cors import CORS
import json
from wordcloud import WordCloud
from gensim.models import KeyedVectors


app = Flask(__name__)
app.config['DEBUG'] = True  # like nodemon
CORS(app, support_credentials=True)

postgreObj = myPostgre.postgredbClass()

# https://velog.io/@doondoony/python-sql-formatting
@app.route('/GET/NN', methods=['GET', 'POST'])
def GET_NN():
    content = request.json
    # print(content['date'][:10])
    select_date = content['date'][:10]
    vecFile = "../data/"+select_date+".vec"
    model = KeyedVectors.load_word2vec_format(vecFile)

    simList = model.most_similar(content['searchWord'], topn=11)
    resSimilar = {'data': []}

    for idx, data in enumerate(simList):
        word = dict()
        word['idx'] = idx
        word['word'] = simList[idx][0]
        word['relative'] = simList[idx][1]
        resSimilar['data'].append(word)

    return jsonify(resSimilar)


# https://velog.io/@doondoony/python-sql-formatting
@app.route('/GET/TWEET', methods=['GET', 'POST'])
def GET_TWEET():
    content = request.json
    select_date = content[:10]
    postgres_select_query = ''' SELECT id,nomalizedtext,to_char(created_at, 'YYYY-MM-DD HH24:MI:SS'), subjectivity, polarity FROM "TWEET_TB" WHERE created_at < date %(select_date)s + 2 and created_at > date %(select_date)s + 1 '''
    postgreObj.cur.execute(postgres_select_query, {'select_date': select_date})
    records = postgreObj.cur.fetchall()
    twitter = {'data': []}

    for row in records:
        tweet = dict()
        tweet["id"] = row[0]
        tweet["nomalizedtext"] = row[1]
        tweet["created_at"] = row[2]
        tweet["subjectivity"] = row[3]
        tweet["polarity"] = row[4]
        twitter['data'].append(tweet)

    # with open('/Users/plant/코드실험실👀/sentiment-app-full/api/test.json', 'w', encoding='utf-8') as make_file:
    #     json.dump(twitter, make_file, indent="\t")

    return jsonify(twitter)


# https://velog.io/@doondoony/python-sql-formatting
@app.route('/GET/WORD', methods=['GET', 'POST'])
def GET_WORD():
    content = request.json
    word_select_date = content['date'][:10]
    if(content['pn'] == "1"):
        postgres_select_query = ''' SELECT nomalizedtext FROM "TWEET_TB" WHERE polarity >= 0 and created_at < date %(word_select_date)s + 2 and created_at > date %(word_select_date)s + 1'''
    else:
        print("sex")
        postgres_select_query = ''' SELECT nomalizedtext FROM "TWEET_TB" WHERE polarity < 0 and created_at < date %(word_select_date)s + 2 and created_at > date %(word_select_date)s + 1'''

    postgreObj.cur.execute(postgres_select_query, {
                           'word_select_date': word_select_date})
    records = postgreObj.cur.fetchall()

    twitterText = []
    wordAward = {'data': []}

    for row in records:
        twitterText.append(row[0])
    wordcloud = WordCloud().generate('-'.join(twitterText))

    for idx, data in enumerate(wordcloud.words_):
        if(idx > 6):
            break
        else:
            word = dict()
            word['idx'] = idx
            word['word'] = data
            wordAward['data'].append(word)
    return jsonify(wordAward)


# @app.route('/GET/CLOUD')
# def GET_CLOUD():
#     # echo "backend: TkAgg" >> ~/.matplotlib/matplotlibrc
#     postgres_select_query = ''' SELECT nomalizedtext FROM "TWEET_TB" WHERE  WHERE created_at >  %(recent_date)s '''
#     postgreObj.cur.execute(postgres_select_query, {'recent_date': recent_date})
#     postgreObj.cur.execute(postgres_select_query)
#     records = postgreObj.cur.fetchall()
#     twitter = []
#     for row in records:
#         twitter.append(row[0])
#     wordcloud = WordCloud().generate('-'.join(twitter))
#     print(wordcloud.words_)

#     # plt.figure(figsize=(12, 12))
#     # plt.imshow(wordcloud, interpolation='bilinear')
#     # plt.axis('off')
#     # plt.show()

#     return "ty"

if __name__ == '__main__':
    try:
        app.run(host='127.0.0.1', port=8899)
    finally:
        postgreObj.closeDB()
