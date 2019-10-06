import psycopg2  # driver 임포트


class postgredbClass():

    def __init__(self):
        # conn = psycopg2.connect("host=localhost dbname=test user=postgres password=pwtest port=5432")
        self.conn = psycopg2.connect(host='localhost', dbname='db',
                                     user='user', password='pass', port=5432)
        self.cur = self.conn.cursor()

    def closeDB(self):
        self.cur.close()
        self.conn.close()
