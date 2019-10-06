import emoList
import pandas as pd
import jsonpickle
import json
import tweepy
from tweepy import Stream
from tweepy import OAuthHandler
from tweepy.streaming import StreamListener
import pandas as pd
import csv
import re  # regular expression
from textblob import TextBlob
import string
import preprocessor as p
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import myPostgre
import time

start = time.time()  # 시작 시간 저장


with open('config.json', 'r') as f:
    config = json.load(f)

    CONSUMER_KEY = config['CONSUMER_KEY']
    CONSUMER_SECRET = config['CONSUMER_SECRET']
    ACCESS_TOKEN = config['ACCESS_TOKEN']
    ACCESS_SECRET = config['ACCESS_SECRET']


# Setup access API
def ConnectTwitterOAuth():
    auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
    auth.set_access_token(ACCESS_TOKEN, ACCESS_SECRET)
    api = tweepy.API(auth)
    return api


# Create API object
api = ConnectTwitterOAuth()
query = '#HYUNDAI OR #hyundai OR #Hyundai OR Hyundai OR hyundai OR HYUNDAI -filter:retweets'

# emoticon and emoji List Load
emoListObj = emoList.emoList()
emoticons = emoListObj.emoticons
emoji_pattern = emoListObj.emoji_pattern


# text clean
def CleanText(tweet):
    stop_words = set(stopwords.words('english'))
    word_tokens = word_tokenize(tweet)
    # after tweepy preprocessing the colon symbol left remain after      #removing mentions
    tweet = re.sub(r':', '', tweet)
    tweet = re.sub(r'‚Ä¶', '', tweet)
    # replace consecutive non-ASCII characters with a space
    tweet = re.sub(r'[^\x00-\x7F]+', ' ', tweet)
    # remove emojis from tweet
    tweet = emoji_pattern.sub(r'', tweet)
    # filter using NLTK library append it to a string
    filtered_tweet = [w for w in word_tokens if not w in stop_words]
    filtered_tweet = []
    # looping through conditions
    for w in word_tokens:
        # check tokens against stop words , emoticons and punctuations
        if w not in stop_words and w not in emoticons and w not in string.punctuation:
            filtered_tweet.append(w)
    return ' '.join(filtered_tweet)


postgreObj = myPostgre.postgredbClass()


# Get Save tweets
def GetSaveTweet(xApi, xQuery, xUntil, xMaxItem=50, xLang='en'):
    resTweet = {
        # "originText": [],
        "nomalizedText": [],
        "created_at": [],
        "polarity": [],
        "subjectivity": []
    }
    for tweet in tweepy.Cursor(xApi.search, q=xQuery, lang=xLang, until=xUntil).items(xMaxItem):
        # tweet-preprocessing p and cleantextFn
        cleanTweet = p.clean(tweet.text)
        filteredTweet = CleanText(cleanTweet)
        # sentiment
        blob = TextBlob(filteredTweet)
        Sentiment = blob.sentiment
        polarity = Sentiment.polarity
        subjectivity = Sentiment.subjectivity

        # resTweet["originText"].append(tweet.text)
        resTweet["nomalizedText"].append(filteredTweet)
        resTweet["created_at"].append(tweet.created_at)
        resTweet["polarity"].append(polarity)
        resTweet["subjectivity"].append(subjectivity)

        # save db
        postgres_insert_query = ''' INSERT INTO "TWEET_TB" (nomalizedText,created_at, polarity,subjectivity) VALUES (%s, %s ,%s, %s) '''
        record_to_insert = (filteredTweet, tweet.created_at,
                            polarity, subjectivity)
        postgreObj.cur.execute(postgres_insert_query, record_to_insert)
        postgreObj.conn.commit()


GetSaveTweet(api, query, '2019-10-06 ', 500, 'en')


# close cusor and connect
postgreObj.closeDB()

print("time :", time.time() - start)  # 현재시각 - 시작시간 = 실행 시간

# https://www.geeksforgeeks.org/removing-stop-words-nltk-python/
