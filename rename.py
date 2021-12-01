import os
import pandas as pd
import re

target_folder = os.path.dirname(__file__) + "/pictures"

df = pd.read_csv('weapon_data.csv')

print(df.head(5))
mask = df['Icon'].isnull()
for ind in df[mask].index:
    name = df['Name'][ind]
    cleaned = name.replace(" ", "").replace("’","27").replace("'","27").replace("+","3f").lower()
    pattern = r"botw" + re.escape(cleaned) + r"icon"
    # print(pattern)
    for file in os.listdir(target_folder):
        if re.match(pattern, file):
            cleaned = cleaned.replace("27s","").replace("3f", "p") + "icon.png"
            print(cleaned, file)
            old_name = os.path.join(target_folder, file)
            new_name = os.path.join(target_folder, cleaned)

            os.rename(old_name, new_name)
            df.at[ind, 'Icon'] = cleaned
            print(old_name, new_name, df['Icon'][ind])
            break
        
df.to_csv('out.csv', index=False)
