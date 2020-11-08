import pandas as pd

data = pd.read_csv("complete_data.csv")

data = data[~data["Wind Direction"].isna()]

data["Month"] = data["Date Time "].str[5:7]

month_mappings = {
    "04": "April",
    "08": "August",
    "12": "December",
}

data["Month"] = data["Month"].map(month_mappings)

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

rr_gr_data = (
    data.groupby(["Month"])["roadrunner_emission"].sum().reset_index()
)
rr_gr_data["factory"] = "RoadRunner"
rr_gr_data = rr_gr_data[["factory", "Month", "roadrunner_emission"]].rename(
    columns={"roadrunner_emission": "emission", "factory": "Col1", "Month": 'Col2'}
)


ka_gr_data = data.groupby(["Month"])["kasios_emission"].sum().reset_index()
ka_gr_data["factory"] = "Kasios"
ka_gr_data = ka_gr_data[["factory", "Month", "kasios_emission"]].rename(
    columns={"kasios_emission": "emission", "factory": "Col1", "Month": 'Col2'}
)

ra_gr_data = (
    data.groupby(["Month"])["radiance_emission"].sum().reset_index()
)
ra_gr_data["factory"] = "Radiance"
ra_gr_data = ra_gr_data[["factory", "Month", "radiance_emission"]].rename(
    columns={"radiance_emission": "emission", "factory": "Col1", "Month": 'Col2'}
)

in_gr_data = data.groupby(["Month"])["indigo_emission"].sum().reset_index()
in_gr_data["factory"] = "Indigo"
in_gr_data = in_gr_data[["factory", "Month", "indigo_emission"]].rename(
    columns={"indigo_emission": "emission", "factory": "Col1", "Month": 'Col2'}
)


final_data = pd.concat([rr_gr_data, ka_gr_data, ra_gr_data, in_gr_data], axis=0)

gr_data = data.groupby(["Chemical", "Month"])["Reading"].sum().reset_index()
gr_data = gr_data.rename(columns={"Reading": "emission", "Chemical": "Col2", "Month": 'Col1'})

final_data = pd.concat([final_data, gr_data], axis=0)
print(final_data)

final_data.to_csv('sankey.csv', index=False)
