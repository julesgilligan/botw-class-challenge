/* TODO
something for class armor color
complete metal T/F
combine general and exclusives into Base => better exclusive listing


Source Links:
https://github.com/coltonoscopy/botw-class-challenge
https://www.reddit.com/r/Breath_of_the_Wild/comments/62xfvm/breath_of_the_wild_enforced_classes_challenge/
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

function classSelected() {
    var selector = document.getElementById("selectorList");
    var classValue = parseInt(selector.value);
    console.log(classValue);
    applyRule(classValue);
  }

function applyRule(num) {
    exclusive = df.c('Guardian')
            .or(df.c('Amiibo'))
            .or( df.c('Name').eq('Master Sword') )
            .or( df.c('Name').eq('Hylian Shield') )
            .or( df.c('Name').strIncludes('Rod') )
            .or( df.c('Name').strIncludes('Spring'))
            .or( df.c('Name').strIncludes('Arrow'))
            .or( df.c('Name').strIncludes('Stealth'));

    general = df.c('Name').regexTest(new RegExp('(Well)|(Torch)|(Tree)|(Kor)|(Gerudo Set)|(Hylian Set)'))
            
    rule = null;
    switch (num) {
        case 1 : // Alchemist
        case 6 : // Chef
            rule = general.or( 
                df.c('Subtype').eq("short").and(df.c('Power').lte(30))
                .or( df.c('Subtype').eq("spear").and(df.c('Power').lte(20)) )
                .or( df.c('Subtype').eq("long").and(df.c('Power').lte(40)) )
                .or( df.c('Subtype').eq("normal").and(df.c('Power').lte(30)) )
                .or( df.c('Type').eq("shield").and(df.c('Power').lte(30)) )
            ).and(exclusive.not());
            break;
        case 2 :
            rule = general.or(
                df.c('Guardian'));
            break;
        case 3 : // ARCHER
            rule = general
            .and(exclusive.not())
            .or( df.c('Type').eq('bow').and(df.c('Subtype').eq("zoom").not()) );
            break;
        case 4 : // Berserker
            rule = general.or( 
                df.c('Monster').and(df.c('Type').eq("shield").not())
                .or(df.c('Subtype').eq("long"))
                .or(df.c('Name').eq("Barbarian Set"))
                .or(df.c('Name').eq("Urbosa's Fury"))
            ).and(exclusive.not());
            break;
        // case 5 :
        //     break;
        case 7 : // DARK IMAGE
            rule = general.or(
                df.c('Monster')
                .or(df.c('Type').eq("armor").and(df.c('Name').regexTest(new RegExp('(Dark)|(Ganon)'))))
            ).and(exclusive.not()) // don't include exclusive things
            .or(df.c('Name').strIncludes('Spring')); // But do include Spring..Hammer
            break;
        case 8 : // DRUID
            rule = general.or(
                df.c('Metal').not()
                .or(df.c('Name').eq("Urbosa's Fury"))
                .or(df.c('Name').eq("Revali's Gale"))
            ).and(exclusive.not())
            .and( df.c('Subtype').regexTest(new RegExp('(zoom)|(multi)')).not() );
            break;
        case 9 : //EXPLORER
            rule = general.or(
                df.c('Name').regexTest(
                new RegExp('(Climb)|(Snowq)|(Firep)|(Voe)|(Rub)|(Zora)|(Rev)|(Boat)|(Trav)|(Drill)|(Farm)|(Sledge)|(Soup)|(Woodc)|(Mop)'))
            );//.and(exclusive.not()) // don't include exclusive things
            break;
        case 11 : // HERO
            rule = general.or(
                df.c('Name').regexTest(
                new RegExp("(Master)|(Hylian S)|(Bow of Light)|(Champion)|(Tingle)|(of the Wild)"))
            .or(df.c('Name').regexTest(
                new RegExp("(Lightscale)|(Scimitar of the Seven)|(Daybreaker)|(Boulder Breaker)|(Great Eagle)")))
            .or(df.c('Subtype').eq('blessing'))
            .or(df.c('Amiibo'))
            );
            break;
        case 12 : // MYSTIC KNIGHT
            rule = general.or(
                df.c('Name').regexTest(new RegExp("(Flame)|(Frost)|(Thun)|(Elem)"))
                .or( df.c('Subtype').eq("normal"))
            ).and(exclusive.not())
            .or( df.c('Name').strIncludes('Rod') );
            break;
        case 13 : // NINJA
            rule = general.or(
                df.c('Subtype').eq('short')
                .or(df.c('Type').eq('shield'))
                .or(df.c('Name').regexTest(
                    new RegExp("(fold Long)|(Serpen)|(cleaver)|(Duality)|(Duplex)")))
                .or( df.c('Subtype').eq("normal"))
                .or( df.c('Subtype').eq("zoom"))
            ).and(exclusive.not())
            .or(df.c('Name').strIncludes('Stealth'));
            break;
        // case 14 :
        //     break;
        // case 15 :
        //     break;
        case 16 : // QUEASY
            rule = df.c('Name').isNa().not()
                .and( df.c('Name').regexTest(
                    new RegExp("(Master)|(Hylian Shield)|(Guardi)|(Ancien)|(Barba)"))
                    .or(df.c('Subtype').eq("zoom")).not()
                )
            break;
        case 10 : // FREELANCER
        default :
            console.log('enter default');
            rule = df.c('Name').isNa().not();
            break;
    }
    populateColumns(rule);
}

function populateColumns(chosen_rule){
    let weaponcol = document.querySelector("#weapons");
    let bowcol = document.querySelector("#bows");
    let shieldcol = document.querySelector("#shields");
    let armorcol = document.querySelector("#armor");
    let othercol = document.querySelector("#other");

    weaponcol.replaceChildren(dfToIcons(df.s( chosen_rule.and(df.c('Type').eq("weapon")) , ['Name', 'Icon'])));
    bowcol.replaceChildren(dfToIcons(df.s( chosen_rule.and(df.c('Type').eq("bow")) , ['Name', 'Icon'])));
    shieldcol.replaceChildren(dfToIcons(df.s( chosen_rule.and(df.c('Type').eq("shield")) , ['Name', 'Icon'])));
    armorcol.replaceChildren(dfToIcons(df.s( chosen_rule.and(df.c('Type').eq("armor")) , ['Name', 'Icon'])));
    othercol.replaceChildren(dfToIcons(df.s( chosen_rule.and(df.c('Type').eq("misc")) , ['Name', 'Icon'])));
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

df = null;
d3.csv("./weapon_data.csv", function(d){
    d.Power = +d.Power;
    d.Durability = +d.Durability;
    d.Guardian = d.Guardian == 'Y';
    d.Monster = d.Monster == 'Y';
    d.Metal = d.Metal == 'Y';
    d.Amiibo = d.Amiibo == 'Y';
    return d;
    })
    .then(function(data){
        df = jd.dfFromObjArray(data);
        applyRule(-1);
    });
