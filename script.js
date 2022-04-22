/* TODO
complete picture list
    - armor
    - something for class armor color
complete metal T/F
switching classes to fill in the columns

maybe make a flexible language to describe rules so I can easily change/add classes
*/
const jd = jsdataframe;

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

    for (let i = 0; i < 3; i++) {
        const newNode = document.createElement('img');
        newNode.setAttribute('src', 'pictures/ancientbattleaxeicon.png');
        newNode.classList.add('icon');
        columns[i].appendChild(newNode);
    }
    
}

function makeIcon(pair){
    const newNode = document.createElement('img');
    newNode.setAttribute('src', 'pictures/'+pair[1]);
    newNode.classList.add('icon');

    const label = document.createElement('div');
    label.innerHTML = pair[0];

    const parent = document.createElement('div');
    parent.appendChild(newNode);
    parent.appendChild(label);
    return parent;
}

function dfToIcons(df){
    matrix = df.toMatrix();
    len = df.nRow();
    const icon_list = document.createElement('div');
    for (let i = 0; i < len; i++) {
        icon_list.append( makeIcon(matrix[i]) );
    }
    return icon_list;
}

d3.csv("./weapon_data.csv", function(d){
    d.Power = +d.Power;
    d.Durability = +d.Durability;
    d.Guardian = d.Guardian == 'Y';
    d.Metal = d.Metal == 'Y';
    d.Amiibo = d.Amiibo == 'Y';
    return d;
    })
    .then(function(data){
        df = jd.dfFromObjArray(data);
        
        exclusive = df.c('Guardian')
            .or(df.c('Amiibo'))
            .or( df.c('Name').eq('Master Sword') )
            .or( df.c('Name').eq('Hylian Shield') )
            .or( df.c('Name').strIncludes('Rod') );

        rule_1 = ( df.c('Subtype').eq("short").and(df.c('Power').lte(30))
                .or( df.c('Subtype').eq("spear").and(df.c('Power').lte(20)) )
                .or( df.c('Subtype').eq("long").and(df.c('Power').lte(40)) )
                .or( df.c('Subtype').eq("normal").and(df.c('Power').lte(30)) )
                .or( df.c('Type').eq("shield").and(df.c('Power').lte(30)) )
                ).and(exclusive.not());
        
        rule_2 = df.c('Guardian');

        rule_3 = (df.c('Type').eq('bow').and(exclusive.not()));

        rule_all = df.c('Name').isNa().not();
        chosen_rule = rule_all;
        // df.s( chosen_rule, ['Name','Icon']).head(10).p();
        
        let weaponcol = document.querySelector("#weapons");
        let bowcol = document.querySelector("#bows");
        let shieldcol = document.querySelector("#shields");
        let armorcol = document.querySelector("#armor");
        let othercol = document.querySelector("#other");

        columns = [weaponcol, bowcol, shieldcol, armorcol, othercol];
        weaponcol.appendChild(dfToIcons(df.s( chosen_rule.and(df.c('Type').eq("weapon")) , ['Name', 'Icon'])));
        bowcol.appendChild(dfToIcons(df.s( chosen_rule.and(df.c('Type').eq("bow")) , ['Name', 'Icon'])));
        shieldcol.appendChild(dfToIcons(df.s( chosen_rule.and(df.c('Type').eq("shield")) , ['Name', 'Icon'])));
        othercol.appendChild(dfToIcons(df.s( chosen_rule.and(df.c('Type').eq("misc")) , ['Name', 'Icon'])));
    });
