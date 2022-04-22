import os
import pandas as pd
import re

target_folder = os.path.dirname(__file__) + "/renameNeeded"

df = pd.read_csv('weapon_data.csv')

mask = df['Icon'].isnull()
for ind in df[mask].index:
    name = df['Name'][ind]
    search_file = name.replace(" ", "").replace("’","27").replace("'","27").replace("+","3f").lower()
    pattern = re.escape(search_file)
    print("--Working on: " + pattern)
    for file in os.listdir(target_folder):
        print(file)
        if re.search(pattern, file):
            cleaned = search_file.replace("27s","").replace("3f", "p").replace("_","").lower() + "model.png"
            print(file, cleaned)
            old_name = os.path.join(target_folder, file)
            new_name = os.path.join(target_folder, cleaned)

            os.rename(old_name, new_name)
            df.at[ind, 'Icon'] = cleaned
            print(old_name, new_name, "now:", df['Icon'][ind])
            break
        
df.to_csv('out.csv', index=False)
