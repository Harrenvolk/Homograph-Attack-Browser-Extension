from audioop import mul
from sklearn.neighbors import KDTree
import numpy as np
import os
import codecs
import pickle
import random
import pandas as pd
import numpy as np
import csv
from pyflann import *
from vision_models.siamese_cnn import build_model, initialize_encoder
from utils.image_utils import generate_imgs, generate_img
from keras import backend as K
from keras.models import Sequential, Model, model_from_json
from keras.utils.vis_utils import plot_model
from keras.layers import Dense, Input, Lambda, Flatten, Conv2D, MaxPooling2D
import flask
from flask import request
import tensorflow as tf
import idna

app = flask.Flask(__name__)

dataset_type = "process"

OUTPUT_DIR = 'output'

global graph
graph = tf.get_default_graph()
model = build_model((12, 150, 1))

model.load_weights(os.path.join(
    OUTPUT_DIR, dataset_type + '_cnn.h5'))

best_threshold = -0.42333611845970154

font_location = "arial.ttf"
font_size = 10
image_size = (150, 12)
text_location = (0, 0)

def get_feature_vector(query, model, font_location, font_size, image_size, text_location, best_threshold):
    x1 = generate_img(query, font_location, font_size, image_size, text_location).transpose((0, 2, 3, 1))
    x2 = generate_img("google.com", font_location, font_size, image_size, text_location).transpose((0, 2, 3, 1))

    score = model.predict([x1, x2])
    score = - score

    predict = 1 if score > best_threshold else 0

    # print("score: {}, predict: {}".format(score, predict))

    


    inter_output_model = Model(model.input, model.get_layer(index = 2).get_output_at(1) )
    inter_output = inter_output_model.predict([x1,x2])
    return inter_output

def build_tree(model, file_path):
    file = open(file_path)
    csvreader = csv.reader(file)
    rows = []
    i = 0
    for row in csvreader:
        if i == 1000:
            break
        rows.append(row)
        i += 1

    X = np.array([[-1, -1], [-2, -1], [-3, -2], [1, 1], [2, 1], [3, 2]])
    kdt = KDTree(X, leaf_size=30, metric='euclidean')
    print(kdt.query(X, k=2, return_distance=False))


def save_feature_vectors_10k(filename):
    file = open("./homo-data/top10kwebsites.csv")
    csvreader = csv.reader(file)
    rows = []
    i = 0
    for row in csvreader:
        if i == 10000:
            break
        rows.append(row)
        i += 1 
    for i in range(len(rows)):
        rows[i] = get_feature_vector(rows[i][0], model, font_location, font_size, image_size, text_location, best_threshold)[0]

    rows = np.array(rows, dtype=np.float64)
    np.save(filename,rows)

def build_kd_tree(query, n, multiplier=1):
    
    feature_vectors = np.genfromtxt('./fvtop10000.csv', delimiter=',')*multiplier
    kdt = KDTree(feature_vectors, leaf_size=15, metric='euclidean')

    print(kdt.query(query, k=n, return_distance=True))

def query_build_flann_tree(query, n):
    feature_vectors = np.load('top10k.npy')
    flann = FLANN()
    result, dists = flann.nn(feature_vectors, query, n, algorithm="kmeans", branching=64, iterations=7, checks=512)
    return result[0]


def query(q):
    file = open("./homo-data/top10kwebsites.csv")
    csvreader = csv.reader(file)
    rows = []
    for row in csvreader:
        rows.append(row[0])
    fv = get_feature_vector(q, model, font_location, font_size, image_size, text_location, best_threshold)[0]
    
    #fv = np.array([2.108535766601562500e+00,2.526350498199462891e+00,-4.385903835296630859e+00,3.596658706665039062e+00,1.183110833168029785e+00,-5.300607204437255859e+00,4.548181533813476562e+00,7.190895080566406250e-01,3.906112670898437500e+00,-3.359806537628173828e-01,4.578958034515380859e+00,4.396099746227264404e-01,1.053744506835937500e+01,-5.481204986572265625e+00,4.600178599357604980e-01,-3.296939849853515625e+00,-2.880102872848510742e+00,1.713205218315124512e+00,-4.300805568695068359e+00,1.118852794170379639e-01,5.504348278045654297e+00,3.379937171936035156e+00,7.754400372505187988e-01,6.860317707061767578e+00,-3.358414888381958008e+00,3.577767372131347656e+00,-6.909746527671813965e-01,-3.940430641174316406e+00,5.601037979125976562e+00,3.262878179550170898e+00,1.030666470527648926e+00,4.264379143714904785e-01])
    X = np.array(fv, dtype=np.float64)
    X = np.reshape(X,(1, X.size))
    
    #print(X)
    results = query_build_flann_tree(X, 2)
    return [rows[i] for i in results]
    # build_flann_tree(multiplier=1)
    # build_kd_tree(multiplier=1)

@app.route("/predict", methods=["GET","POST"])
def suggest():
    ...
    # You need to use the following line
    with graph.as_default():
        decoded_url = idna.decode(request.args.get('url').encode('utf-8'))
        print(decoded_url)
        result = query(decoded_url)
    # return a response in json format 
    message = {'status': 200, 'suggestions': result}
    return flask.jsonify(message) 

def main():
    #save_feature_vectors_10k('top10k.npy')
    #print(query("googļę.com"))
    app.run(host='localhost')
if __name__ == "__main__":
    main()