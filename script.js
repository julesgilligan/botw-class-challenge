/* TODO
add the cool zelda font
one class to fill in the columns
switching classes to fill in the columns
pictures in place of words in the columns

maybe make a flexible language to describe rules so I can easily change/add classes
*/


function Class(weapon, bow, shield, armor, other) {
    this.weapon_text = weapon;
    this.bow_text = bow;
    this.shield_text = shield;
    this.armor_text = armor
    this.other_text = other
}

example = new Class('one hand < 30, spear < 20, two hand <40', '< 30', '< 30', '< 30', 'Testing text')

function buttonClick() {
    console.log("CLICKED")

    let weaponcol = document.querySelector("#weapons");
    let bowcol = document.querySelector("#bows");
    let shieldcol = document.querySelector("#shields");
    let armorcol = document.querySelector("#armor");
    let othercol = document.querySelector("#other");

    columns = [weaponcol, bowcol, shieldcol, armorcol, othercol];
    properties = ['weapon_text','bow_text','shield_text','armor_text','other_text'];
    for (let i = 0; i < 5; i++) {
        const newNode = document.createElement('div');
        newNode.innerHTML= example[properties[i]];
        columns[i].appendChild(newNode);
    }
    
}

const dfd = require("donfojs-node");

dfd.read_csv("./weapon_data.csv")
    .then(df => {
        df.head().print()
    }).catch(err => {console.log(err);})

