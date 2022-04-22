import pandas as pd

df = pd.read_csv('weapon_data.csv')

def print_rule(name, rule_mask):
    string = f'{name:<10}'
    for mask in [hand_mask, long_mask, spear_mask, bow_mask, shield_mask]:
        string += f'{len(df[rule_mask & mask]):<3}'
    print(string)

exclusive = (df['Guardian'] == 'Y') | (df['Amiibo'] == 'Y') | ((df['Name'] == 'Master Sword')
         | (df['Name'] == 'Hylian Shield')) | (df['Name'].str.contains("Rod"))

spear_mask = df['Subtype'] == 'spear'
hand_mask = df['Subtype'] == 'short'
long_mask = df['Subtype'] == 'long'
bow_mask = df['Type'] == 'bow' 
shield_mask = df['Type'] == 'shield'

# print_rule("Full:", df['Name'] != 'Empty')

rule_1 = ( 
    (  hand_mask & (df['Power'] <= 30))
    | (spear_mask & (df['Power'] <= 20))
    | (long_mask & (df['Power'] <= 40))
    | (bow_mask & (df['Subtype'] == 'normal') & (df['Power'] <= 30))
    | (shield_mask & (df['Power'] <= 30)) ) & ~exclusive

print_rule('Rule 1', rule_1)

rule_2 = (df['Guardian'] == 'Y')
# print_rule('Rule 2', rule_2)

rule_3 = (df['Type'] == 'bow') & ~exclusive
# print_rule('Rule 3', rule_3)

rule_4 = (
    ( (df['Monster'] == 'Y') & ~(df['Type'] == 'shield'))
    | (df['Subtype'] == 'long') ) & ~exclusive

# print_rule('Rule 4', rule_4)

cavalier_list = df['Name'].str.contains('|'.join(['Rusty', 'Traveler', 'Soldier', 'Knight', 'Royal']))
rule_5 = (
    (spear_mask)
    | ((df['Subtype'] == 'normal') & (df['Power'] < 30))
    | (shield_mask & cavalier_list)
) & ~exclusive

# print_rule('Rule 5', rule_5)
