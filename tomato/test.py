import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import sys

import pandas as pd
# import numpy as np
# import csv
# from keras.models import Sequential
# from keras.layers import Dense
# from keras.models import Sequential, load_model
# from keras.layers import Dense, Dropout, BatchNormalization, Activation
# import keras.backend as K
# def mean_pred(y_true, y_pred):
#     return K.mean(y_pred - y_true)
# from keras import losses
# import keras
# # import h5py
# from sklearn.preprocessing import MinMaxScaler

# import json

# # while True:
# #     try:
# #         import keras
# #         print("hello")
# #     except:
# #         pass

# guess = {
#     "date": [30],
#     "month": [10],
#     "year": [2013],
#     "Centre_Name": ["SHILLONG"]
# }

data = pd.read_json('./../hello.json')
print(data)