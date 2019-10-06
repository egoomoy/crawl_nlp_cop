simList = [('Hyundai', 0.9402693510055542), ('Championship', 0.8653907775878906), ('Michael', 0.835659384727478), ('Motors', 0.8118155002593994), ('intermediate', 0.8079379200935364),
           ('Hurling', 0.7873251438140869), ('</s>', 0.7830777168273926), ('final', 0.7739806175231934), ('replay', 0.7688336372375488), ('Martins', 0.7680972814559937)]
wardAward = {'data': []}


for idx, data in enumerate(simList):
    word = dict()
    word['idx'] = idx
    word['word'] = simList[idx][0]
    word['relative'] = simList[idx][1]
    wardAward['data'].append(word)

print(wardAward)
