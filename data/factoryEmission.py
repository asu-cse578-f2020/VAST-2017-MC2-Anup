import pandas as pd

data = pd.read_csv("complete_data.csv")

data = data[~data["Wind Direction"].isna()]

data["roadrunner_dist"] = data["roadrunner_dist"].astype(float)
data["kasios_dist"] = data["kasios_dist"].astype(float)
data["radiance_dist"] = data["radiance_dist"].astype(float)
data["indigo_dist"] = data["indigo_dist"].astype(float)

data["max_distance"] = data[
    ["roadrunner_dist", "kasios_dist", "radiance_dist", "indigo_dist"]
].max(axis=1)

data["total_distance"] = (
    data["roadrunner_dist"]
    + data["kasios_dist"]
    + data["radiance_dist"]
    + data["indigo_dist"]
)

data["roadrunner_emission"] = (
    (1-data["roadrunner_dist"]/data["total_distance"])/3
    * data["Reading"]
)
data["kasios_emission"] = (
    (1-data["kasios_dist"]/data["total_distance"])/3
    * data["Reading"]
)
data["radiance_emission"] = (
    (1-data["radiance_dist"]/data["total_distance"])/3
    * data["Reading"]
)
data["indigo_emission"] = (
    (1-data["indigo_dist"]/data["total_distance"])/3
    * data["Reading"]
)

data_subset = data[['Chemical', 'Date Time ', 'roadrunner_emission', 'kasios_emission', 'radiance_emission', 'indigo_emission']]
for i, row in data_subset.iterrows():

    if row['Chemical'] == 'Methylosmolene':
        data_subset.loc[i, 'roadrunner_emission'] = row['roadrunner_emission'] * 4
        data_subset.loc[i, 'kasios_emission'] = row['kasios_emission'] * 4
        data_subset.loc[i, 'radiance_emission'] = row['radiance_emission'] * 4
        data_subset.loc[i, 'indigo_emission'] = row['indigo_emission'] * 4

    elif row['Chemical'] == 'Chlorodinine':
        data_subset.loc[i, 'roadrunner_emission'] = row['roadrunner_emission'] * 5
        data_subset.loc[i, 'kasios_emission'] = row['kasios_emission'] * 5
        data_subset.loc[i, 'radiance_emission'] = row['radiance_emission'] * 5
        data_subset.loc[i, 'indigo_emission'] = row['indigo_emission'] * 5

    elif row['Chemical'] == 'Methylosmolene':
        data_subset.loc[i, 'roadrunner_emission'] = row['roadrunner_emission'] * 2
        data_subset.loc[i, 'kasios_emission'] = row['kasios_emission'] * 2
        data_subset.loc[i, 'radiance_emission'] = row['radiance_emission'] * 2
        data_subset.loc[i, 'indigo_emission'] = row['indigo_emission'] * 2

data_grouped = data_subset.groupby(['Date Time ']).sum()
data_grouped.to_csv('factoryEmissions.csv')
