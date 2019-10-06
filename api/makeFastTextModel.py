# reddit.py 실행
import os
from gensim.models import KeyedVectors
import myPostgre

from datetime import datetime

now = datetime.now()
currentDate = str(now)
currentDate = currentDate[:10]

postgreObj = myPostgre.postgredbClass()

# select daily
postgres_select_query = ''' SELECT nomalizedtext FROM "TWEET_TB" WHERE created_at > %(currentDate)s '''
postgreObj.cur.execute(postgres_select_query, {'currentDate': currentDate})
records = postgreObj.cur.fetchall()
twitter = []

# make twitter txt

for row in records:
    twitter.append(row[0])

fileName = "data/"+currentDate+'.txt'

file = open(fileName, 'w')
for i in range(len(twitter)):
    file.write('%s\n' % twitter[i])
file.close()

# make fasttext model => os command

fastTextCommand = "./fasttext skipgram -input ../" + \
    fileName+" -output ../data/"+currentDate
os.getcwd()
os.chdir("./fastText")
print(os.getcwd())

os.system(
    fastTextCommand)

postgreObj.closeDB()
