import pandas as pd
import numpy as np
import csv
from keras.models import Sequential
from keras.layers import Dense
from keras.models import Sequential, load_model
from keras.layers import Dense, Dropout, BatchNormalization, Activation
import keras.backend as K
def mean_pred(y_true, y_pred):
    return K.mean(y_pred - y_true)
from keras import losses
import keras
# import h5py
from sklearn.preprocessing import MinMaxScaler
import json

predict_data = pd.read_json('./../hello.json')
predict_data["Centre_Name"] = predict_data["Centre_Name"].astype('category')
predict_data["Centre_Name_cat"] = predict_data["Centre_Name"].cat.codes

raw_data  = pd.read_csv("data.csv").drop("Commodity_Name",axis = 1)

raw_data = raw_data[raw_data["Price"]>0]
raw_data[['date','month','year']] = raw_data['Date'].str.split("-",expand=True)
raw_data["date"]= raw_data.apply(lambda row: int(row['date']),axis = 1)
raw_data["month"]= raw_data.apply(lambda row: int(row['month']),axis = 1)
raw_data["year"]= raw_data.apply(lambda row: int(row['year']),axis = 1)
raw_data = raw_data.drop("Date",axis =1)
raw_data["Centre_Name"] = raw_data["Centre_Name"].astype('category')
raw_data["Centre_Name_cat"] = raw_data["Centre_Name"].cat.codes

DataScalerx = MinMaxScaler()
DataScalery = MinMaxScaler()

DataScalerx.fit(X=raw_data.drop(["Centre_Name","Price"],axis=1),y=raw_data["Price"])
DataScalery.fit(X=raw_data["Price"].values.reshape(-1, 1)) 

to_predict = DataScalerx.transform(predict_data.drop(["Centre_Name"],axis=1))
model=keras.models.load_model("hello.h5")

prediction = {
    "output": (DataScalery.inverse_transform(model.predict(to_predict))).tolist()
}


print(json.dumps(prediction))