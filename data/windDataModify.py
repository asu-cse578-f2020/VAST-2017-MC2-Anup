import pandas as pd
import datetime

comp = pd.read_csv('complete_data.csv').reset_index()
wind = pd.read_csv('windData_old.csv')

final_wind = comp[['index', 'Date Time ']].merge(wind, on='index')

for i, row in final_wind.iterrows():
    final_wind.loc[i ,'Date Time '] = datetime.datetime.strptime(row['Date Time '], '%Y-%m-%d %H:%M:%S').strftime('%B %d, %Y, %r')

final_wind.to_csv('windData.csv')