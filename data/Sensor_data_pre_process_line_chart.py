import pandas as pd
import numpy as np

class PreProcess:
    def __init__(self, sensor_data):
        self.sensor = sensor_data

    def sensor_data_preprocessing(self):
        self.sensor["Date"] = pd.to_datetime(
            self.sensor.DateTime, format="%m/%d/%y %H:%M"
        ).dt.date

        self.sensor = sensor_data[['Chemical','Monitor', 'Date', 'Reading']]
        self.sensor  = self.sensor.groupby(['Chemical','Monitor','Date'])[['Reading']].mean()

        return self.sensor



if __name__ == "__main__":
    sensor_data = pd.read_csv("Sensor_Data_line_chart.csv")
    preprocess = PreProcess(sensor_data)
    sensor_data = preprocess.sensor_data_preprocessing()

    sensor_data.to_csv('processed_sensor_data_line_chart.csv')

