import flask
from flask import Flask, abort
from flask import request, jsonify
from flask_cors import CORS
import scrappingfiles as scrap
import pre
from pre import preprocess_fun
import text_summarization as summ
import re
import requests
import bs4
from transformers import pipeline

app = flask.Flask(__name__)
app.config["DEBUG"] = True
CORS(app)


#
# global ob
# global model
# global model2
# ob = preprocess_fun()
# model = ob.loadmodelD2V()
# model2 = ob.getWord2VecModel()

#
# @app.route('/test', methods=['POST'])
# def home():
#     if not request.json:
#         print('ERROR')
#         abort(400)
#
#     PageName = request.json['page']
#     Query = request.json['query']
#     currenturl = 'https://en.wikipedia.org/wiki/' + PageName
#     CitationsExtData, CitationsIntData, QueryString = scrap.getCitationsQuery(currenturl, Query)
#     v1 = ob.getDoc2Vec(CitationsExtData, model)
#     v2 = ob.getWord2Vec(QueryString,model2)
#     scores = []
#     for i in range(len(v1)):
#         scores.append(ob.cosine_similarity(v1[i], v2))
#     s = ""
#     for lines in CitationsExtData:
#         s = s + lines
#     CitationsExtData = s
#     rank = ob.ranking(CitationsExtData, scores)
#
#     output = {'demo': "done",
#               'data': QueryString,
#               'citations': CitationsExtData,
#               'res': rank[0]
#               }
#
#     return jsonify(output), 201
#
@app.route('/sumarize', methods=['POST'])
def summary():
    if not request.json:
        print('ERROR')
        abort(400)

    PageName = request.json['page']
    print(PageName)
    res = requests.get("https://en.wikipedia.org/wiki/"+PageName)
    wiki = bs4.BeautifulSoup(res.text, "lxml")
    para = [''.join([i.getText() for i in wiki.select('p')])]
    summary = summ.getSummary(para[0])
    print(summary)


    output = {'demo': "done",
              'summary': summary
              }

    return jsonify(output), 201

@app.route('/question', methods=['POST'])
def question():
    if not request.json:
        print('ERROR')
        abort(400)


    question = request.json['query']
    PageName = request.json['PageName']
    res = requests.get("https://en.wikipedia.org/wiki/" + PageName)
    wiki = bs4.BeautifulSoup(res.text, "lxml")
    para = [''.join([i.getText() for i in wiki.select('p')])]
    context = summ.getSummary(para[0])
    qa = pipeline("question-answering")
    answer = qa(question=question, context=context)

    output = {'demo': "done",
              'result': answer['answer']
              }

    return jsonify(output), 201

@app.route('/AnswerFromSummary', methods=['POST'])
def AnswerFromSummary():
    if not request.json:
        print('ERROR')
        abort(400)

    PageName = request.json['page']
    Query = request.json['query']
    Question = request.json['question']
    currenturl = 'https://en.wikipedia.org/wiki/' + PageName
    CitationsExtData, CitationsIntData, QueryString = scrap.getCitationsQuery(currenturl, Query)
    context1 = ''.join(CitationsExtData[i] for i in range(0, len(CitationsExtData)))
    a = context1 + QueryString
    qa = pipeline("question-answering")
    answer = qa( question= Question, context=a)

    output = {'demo': "done",
              'result': answer['answer']
              }

    return jsonify(output), 201



app.run()
