#! python3.8

import requests
from bs4 import BeautifulSoup

ingredients_page = requests.get(
    'https://elderscrolls.fandom.com/wiki/Ingredients_(Skyrim)')
ingredients_soup = BeautifulSoup(ingredients_page.content, 'html.parser')

print(ingredients_soup.title.text)

ingredients_table = ingredients_soup.select(
    'table.wikitable.sortable.highlight')
ingredients_table_rows = ingredients_table[0].select('tr')

ingr_init_list = []
for row in ingredients_table_rows[1:]:
    ingredient_page = requests.get(
        'https://elderscrolls.fandom.com'+row.select('td')[0].select_one('a').get('href'))
    ingredient_soup = BeautifulSoup(ingredient_page.content, 'html.parser')
    d = {
        'ingredient_thumbnail': ingredient_soup.select_one(
            '.pi-image-thumbnail').get('src'),
        'ingredient_name': row.select('td')[0].select_one('a').get('title'),
        'ingredient_effect1': row.select('td')[1].select_one('a').text.strip(),
        'ingredient_effect2': row.select('td')[2].select_one('a').text.strip(),
        'ingredient_effect3': row.select('td')[3].select_one('a').text.strip(),
        'ingredient_effect4': row.select('td')[4].select_one('a').text.strip(),
        'ingredient_weight': row.select('td')[5].text.strip(),
        'ingredient_value': row.select('td')[6].text.strip()
    }
    ingr_init_list += ['''
                    new Merchandise
                    {{
                        Name = "{ingredient_name}",
                        Price = {ingredient_value},
                        ShortDescription = "{ingredient_name}",
                        LongDescription = "{ingredient_name} is an ingredient, it can be used to make potions at an alchemy lab as part of alchemy.",
                        Category = Categories["Ingredients"],
                        ImageUrl = "{ingredient_thumbnail}",
                        AmountInStock = 15,
                        Weight = {ingredient_weight}M,
                        IsPreferred = false,
                        ImageThumbnailUrl = "{ingredient_thumbnail}",
                        PrimaryEffect = effects["{ingredient_effect1}"],
                        SecondaryEffect = effects["{ingredient_effect2}"],
                        TertiaryEffect = effects["{ingredient_effect3}"],
                        QuaternaryEffect = effects["{ingredient_effect4}"],
                    }}'''.format(**d)]

potions_page = requests.get(
    'https://elderscrolls.fandom.com/wiki/Potions_(Skyrim)')

potions_soup = BeautifulSoup(potions_page.content, 'html.parser')

potions_tables = potions_soup.select(
    'table.wikitable.sortable')
potions_headlines = potions_soup.select(
    'span.mw-headline')

potions_list = []
i = 1
j = 0
category = "Potions"
while i < len(potions_tables):
    # print(potions_table)
    if potions_headlines[i].text == 'Poisons':
        category = "Poisons"
        i += 1
        continue
    elif potions_headlines[i].text == 'Thieves Guild potions':
        i += 6
        j += 5
        continue
    elif potions_headlines[i].text == 'Drugs' or potions_headlines[i].text == 'Unique and non-leveled potions':
        i += 1
        j += 1
        continue
    potions_table = potions_tables[j]
    print('======================')
    print(potions_headlines[i].text)
    print('----------------------')
    for row in potions_table.select('tr')[1:]:
        columns = row.select('td')
        print(columns)
        print(columns[2].text)
        d = {
            'potion_thumbnail':  columns[3].select_one('a').get('href').strip(),
            'potion_name': columns[0].contents[0].strip(),
            'potion_description': columns[1].text.strip(),
            'potion_effect1': potions_headlines[i].text.strip(),
            'potion_value': columns[2].text.strip(),
            'category': category
        }
        potions_list += ['''
                        new Merchandise
                        {{
                            Name = "{potion_name}",
                            Price = {potion_value},
                            ShortDescription = "{potion_name}",
                            LongDescription = "{potion_description}",
                            Category = Categories["{category}"],
                            ImageUrl = "{potion_thumbnail}",
                            AmountInStock = 15,
                            Weight = 0.1M,
                            IsPreferred = false,
                            ImageThumbnailUrl = "{potion_thumbnail}",
                            PrimaryEffect = effects["{potion_effect1}"],
                            SecondaryEffect = null,
                            TertiaryEffect = null,
                            QuaternaryEffect = null,
                        }}'''.format(**d)]

    i += 1
    j += 1

march_init_string = ','.join(ingr_init_list + potions_list)
print(march_init_string)
with open('merch.txt', 'w') as f:
    f.write(march_init_string)
    f.close()
