# 트위터 크롤링 + 감정 분석 + 유사도 분석

1. 트위터 API를 이용하여 일 단위 키워드에 대한 단어를 크롤링한다. 여기서는 HYUNDAI
2. 크롤링된 데이터를 정규화(이모지, 불용어, stopwords 등..)하고 textblob을 이용하여 sentiment 분석을 한다.
3. postgresql db에 저장
4. fastText를 이용하여, 일 단위 텍스트의 모델(vec/bin) 을 만든다.
5. react+flask 를 이용하여 간단한 [일 단위] 키워드 관련 트위터 조회, 해당 트위터들의 종합 금정/부정 단어 순위, 단어 유사어 조회
6. 예를 들어 현대차의 일단위 부정어 순위 중 service 항목이 있다면, service 와 유사어(vector) 를 본다면 마케팅 분석에 도움되지 않을까?

# 수정해야할 사항

- [] 스테이트 불변성 모듈 사용해서 바꿀 것 => 스테이드 관리가 불편
- [] 디렉토리 구조..

# 참조한 자료와 링크

reddit api
https://praw.readthedocs.io/en/latest/getting_started/quick_start.html#determine-available-attributes-of-an-object

doc2vec 단어 유사도 분석
https://medium.com/@mishra.thedeepak/doc2vec-in-a-simple-way-fa80bfe81104
https://aileen93.tistory.com/128

tokenize guide
https://docs.python.org/3/library/tokenize.html

nltk book
http://www.nltk.org/book/

뭔가 좀 다른
https://statkclee.github.io/nlp2/nlp-word2vec-python.html

fastText
https://ratsgo.github.io/from%20frequency%20to%20semantics/2017/07/06/fasttext/
https://lovit.github.io/nlp/representation/2018/10/22/fasttext_subword/ : 한국어를 처리하는 fasttext

이 사람 글이 베스트인 듯 싶다.
https://inspiringpeople.github.io/data%20analysis/word_embedding/

1. 장점은 성능이 매우 좋다는 것 = > 노이즈가 많은 일반인 들의 글, 오타에도 효율적으로 성능이 발휘됨
   - 왜 ? 계속 테스트 하면서 느낀 것인데, 오타 자체를 유사한? 아니면 정확한? 키워드로 대치시켜서 연관성이 높다고 판단함 => kia == Kia
2. 단점은 doc2vec과 같이 문맥 단위로 이해하기 때문에 귤/사과/바나나 와 같이 과일이라는 카테고리를 제외한 공통점이 없는 경우에도 벡터가 가까움
   - 즉, 나는 가게에 ~를 사러갔다. 에서 귤/사과/바나나 뿐만 아니라 신발도 대치 될 수 있음
   - 때문에 글쓴이는 토픽(도메인)을 수동으로 걸러줄 필요가 있다고 생각하는 것 같다. (뭐 이건 타겟을 미리 선정해서 크롤링하면 해결될 문제같음, 그게 아니면 최대한 자동화 하거나)

# 한번 꼭 봐야할 자료 정리

https://zzsza.github.io/data/2018/03/10/nlp-python/
