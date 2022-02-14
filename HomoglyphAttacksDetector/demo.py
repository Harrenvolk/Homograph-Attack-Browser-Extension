import os
import codecs
import pickle
import random
import pandas as pd
import numpy as np

from vision_models.siamese_cnn import build_model, initialize_encoder
from utils.image_utils import generate_imgs, generate_img
from keras import backend as K
from keras.models import Sequential, Model, model_from_json
from keras.utils.vis_utils import plot_model
from keras.layers import Dense, Input, Lambda, Flatten, Conv2D, MaxPooling2D

dataset_type = "process"

OUTPUT_DIR = 'output'

model = build_model((12, 150, 1))

model.load_weights(os.path.join(
    OUTPUT_DIR, dataset_type + '_cnn.h5'))

best_threshold = -0.42333611845970154

font_location = "arial.ttf"
font_size = 10
image_size = (150, 12)
text_location = (0, 0)

def get_feature_vector(query):
    x1 = generate_img(query, font_location, font_size, image_size, text_location).transpose((0, 2, 3, 1))
    x2 = generate_img("google.com", font_location, font_size, image_size, text_location).transpose((0, 2, 3, 1))

    score = model.predict([x1, x2])
    score = - score


    predict = 1 if score > best_threshold else 0

    print("score: {}, predict: {}".format(score, predict))

    model.layers.pop()


    inter_output_model = Model(model.input, model.get_layer(index = 2).get_output_at(1) )
    inter_output = inter_output_model.predict([x1,x2])
    return inter_output
print(get_feature_vector("facebook.com"))