// ==UserScript==
// @name         PokeCatch Assistant / 全图鉴与推图助手
// @namespace    local.pokecatch.assistant
// @version      0.16.2
// @description  Bilingual story, Pokédex, roaming, team and berry automation / 中英双语推图、图鉴、神兽、队伍和果子自动化。
// @updateURL    https://raw.githubusercontent.com/stdAri/pokecatch-assistant/main/dist/pokecatch-assistant.user.js
// @downloadURL  https://raw.githubusercontent.com/stdAri/pokecatch-assistant/main/dist/pokecatch-assistant.user.js
// @match        https://pokecatch-online.netlify.app/*
// @match        https://pokecatch-online.pages.dev/*
// @run-at       document-idle
// @grant        GM_notification
// ==/UserScript==

(() => {
  "use strict";

  if (window.__pokeCatchAssistant) return;

  const DATA = {"appBuild":"f01c6dd773","langBuild":"db096ca203","species":{"1":{"n":"妙蛙种子","t":["grass","poison"],"s":[45,49,49,65,65,45],"l":[[1,"growl"],[1,"tackle"],[3,"vine-whip"],[6,"growth"],[9,"leech-seed"],[12,"razor-leaf"],[15,"acid-spray"],[15,"magical-leaf"],[15,"poison-powder"],[15,"sleep-powder"],[15,"venoshock"],[18,"seed-bomb"],[21,"take-down"],[24,"sweet-scent"],[27,"synthesis"],[30,"giga-drain"],[30,"grass-pledge"],[30,"worry-seed"],[33,"double-edge"],[33,"power-whip"],[36,"solar-beam"],[45,"sludge-bomb"],[85,"leaf-storm"]],"g":false,"m":false},"2":{"n":"妙蛙草","t":["grass","poison"],"s":[60,62,63,80,80,60],"l":[[1,"growl"],[1,"tackle"],[3,"vine-whip"],[6,"growth"],[9,"leech-seed"],[12,"razor-leaf"],[15,"acid-spray"],[15,"magical-leaf"],[15,"poison-powder"],[15,"sleep-powder"],[15,"venoshock"],[20,"seed-bomb"],[25,"take-down"],[30,"giga-drain"],[30,"grass-pledge"],[30,"sweet-scent"],[33,"double-edge"],[35,"synthesis"],[40,"worry-seed"],[45,"power-whip"],[45,"sludge-bomb"],[50,"solar-beam"],[85,"leaf-storm"]],"g":false,"m":false},"3":{"n":"妙蛙花","t":["grass","poison"],"s":[80,82,83,100,100,80],"l":[[0,"petal-blizzard"],[0,"petal-dance"],[1,"growl"],[1,"tackle"],[3,"vine-whip"],[6,"growth"],[9,"leech-seed"],[12,"razor-leaf"],[15,"acid-spray"],[15,"magical-leaf"],[15,"poison-powder"],[15,"sleep-powder"],[15,"venoshock"],[20,"seed-bomb"],[25,"take-down"],[30,"giga-drain"],[30,"grass-pledge"],[30,"poison-jab"],[30,"sweet-scent"],[33,"double-edge"],[37,"synthesis"],[44,"worry-seed"],[45,"sludge-bomb"],[51,"power-whip"],[58,"solar-beam"],[85,"leaf-storm"]],"g":false,"m":false},"4":{"n":"小火龙","t":["fire"],"s":[39,52,43,60,50,65],"l":[[1,"growl"],[1,"scratch"],[4,"ember"],[8,"smokescreen"],[12,"dragon-breath"],[13,"metal-claw"],[15,"flame-charge"],[15,"incinerate"],[15,"leer"],[17,"fire-fang"],[18,"fury-swipes"],[20,"slash"],[24,"flamethrower"],[28,"scary-face"],[32,"fire-spin"],[36,"inferno"],[40,"flare-blitz"],[65,"fire-blast"],[85,"overheat"]],"g":false,"m":false},"5":{"n":"火恐龙","t":["fire"],"s":[58,64,58,80,65,80],"l":[[1,"growl"],[1,"scratch"],[4,"ember"],[8,"smokescreen"],[12,"dragon-breath"],[13,"metal-claw"],[15,"flame-charge"],[15,"incinerate"],[15,"leer"],[18,"fury-swipes"],[19,"fire-fang"],[24,"slash"],[30,"flamethrower"],[32,"fire-spin"],[37,"scary-face"],[48,"inferno"],[54,"flare-blitz"],[65,"fire-blast"],[85,"overheat"]],"g":false,"m":false},"6":{"n":"喷火龙","t":["fire","flying"],"s":[78,84,78,109,85,100],"l":[[0,"air-slash"],[1,"growl"],[1,"scratch"],[4,"ember"],[8,"smokescreen"],[12,"dragon-breath"],[13,"metal-claw"],[15,"flame-charge"],[15,"incinerate"],[15,"leer"],[18,"fury-swipes"],[19,"fire-fang"],[24,"slash"],[30,"flamethrower"],[39,"scary-face"],[46,"fire-spin"],[54,"inferno"],[62,"flare-blitz"],[65,"fire-blast"],[65,"hurricane"],[85,"overheat"]],"g":false,"m":false},"7":{"n":"杰尼龟","t":["water"],"s":[44,48,65,50,64,43],"l":[[1,"tackle"],[1,"tail-whip"],[3,"water-gun"],[6,"withdraw"],[9,"rapid-spin"],[12,"bite"],[15,"bubble-beam"],[15,"water-pulse"],[18,"protect"],[21,"rain-dance"],[24,"aqua-tail"],[27,"shell-smash"],[30,"iron-defense"],[33,"hydro-pump"],[36,"headbutt"],[36,"skull-bash"],[36,"wave-crash"]],"g":false,"m":false},"8":{"n":"卡咪龟","t":["water"],"s":[59,63,80,65,80,58],"l":[[1,"tackle"],[1,"tail-whip"],[3,"water-gun"],[6,"withdraw"],[9,"rapid-spin"],[12,"bite"],[15,"bubble-beam"],[15,"water-pulse"],[20,"protect"],[25,"rain-dance"],[30,"aqua-tail"],[35,"shell-smash"],[36,"headbutt"],[36,"skull-bash"],[40,"iron-defense"],[45,"hydro-pump"],[50,"wave-crash"]],"g":false,"m":false},"9":{"n":"水箭龟","t":["water"],"s":[79,83,100,85,105,78],"l":[[0,"flash-cannon"],[1,"tackle"],[1,"tail-whip"],[3,"water-gun"],[6,"withdraw"],[9,"rapid-spin"],[12,"bite"],[15,"bubble-beam"],[15,"water-pulse"],[20,"protect"],[25,"rain-dance"],[30,"aqua-tail"],[35,"shell-smash"],[36,"headbutt"],[36,"skull-bash"],[42,"iron-defense"],[49,"hydro-pump"],[56,"wave-crash"]],"g":false,"m":false},"10":{"n":"绿毛虫","t":["bug"],"s":[45,30,35,20,20,45],"l":[[1,"string-shot"],[1,"tackle"],[9,"bug-bite"]],"g":false,"m":false},"11":{"n":"铁甲蛹","t":["bug"],"s":[50,20,55,25,25,30],"l":[[0,"harden"],[1,"string-shot"],[1,"tackle"],[9,"bug-bite"]],"g":false,"m":false},"12":{"n":"巴大蝶","t":["bug","flying"],"s":[60,45,50,90,80,70],"l":[[0,"gust"],[0,"harden"],[1,"string-shot"],[1,"tackle"],[4,"supersonic"],[8,"confusion"],[9,"bug-bite"],[12,"poison-powder"],[12,"sleep-powder"],[12,"stun-spore"],[15,"struggle-bug"],[16,"psybeam"],[19,"silver-wind"],[20,"whirlwind"],[24,"air-slash"],[28,"safeguard"],[32,"bug-buzz"],[36,"tailwind"],[37,"captivate"],[40,"rage-powder"],[44,"quiver-dance"],[65,"hurricane"]],"g":false,"m":false},"13":{"n":"独角虫","t":["bug","poison"],"s":[40,35,30,20,20,50],"l":[[1,"poison-sting"],[1,"string-shot"],[9,"bug-bite"]],"g":false,"m":false},"14":{"n":"铁壳蛹","t":["bug","poison"],"s":[45,25,50,25,25,35],"l":[[0,"harden"],[1,"poison-sting"],[1,"string-shot"],[9,"bug-bite"]],"g":false,"m":false},"15":{"n":"大针蜂","t":["bug","poison"],"s":[65,90,40,45,80,75],"l":[[0,"fury-attack"],[0,"harden"],[0,"twineedle"],[1,"poison-sting"],[1,"string-shot"],[9,"bug-bite"],[11,"fury-cutter"],[14,"laser-focus"],[17,"pursuit"],[20,"focus-energy"],[23,"venoshock"],[26,"assurance"],[29,"toxic-spikes"],[30,"u-turn"],[30,"x-scissor"],[31,"outrage"],[32,"pin-missile"],[35,"poison-jab"],[38,"agility"],[41,"endeavor"],[44,"fell-stinger"]],"g":false,"m":false},"16":{"n":"波波","t":["normal","flying"],"s":[40,45,40,35,35,56],"l":[[1,"tackle"],[5,"sand-attack"],[9,"gust"],[9,"mirror-move"],[13,"quick-attack"],[15,"pluck"],[15,"swift"],[17,"whirlwind"],[21,"twister"],[25,"feather-dance"],[29,"agility"],[29,"razor-wind"],[30,"headbutt"],[33,"wing-attack"],[37,"roost"],[41,"tailwind"],[45,"aerial-ace"],[45,"fly"],[45,"take-down"],[49,"air-slash"],[53,"hurricane"],[85,"double-edge"],[85,"sky-attack"]],"g":false,"m":false},"17":{"n":"比比鸟","t":["normal","flying"],"s":[63,60,55,50,50,71],"l":[[1,"tackle"],[5,"sand-attack"],[9,"gust"],[9,"mirror-move"],[13,"quick-attack"],[15,"pluck"],[15,"swift"],[17,"whirlwind"],[22,"twister"],[27,"feather-dance"],[29,"razor-wind"],[30,"headbutt"],[32,"agility"],[37,"wing-attack"],[42,"roost"],[45,"fly"],[45,"take-down"],[47,"tailwind"],[52,"aerial-ace"],[57,"air-slash"],[62,"hurricane"],[85,"double-edge"],[85,"sky-attack"]],"g":false,"m":false},"18":{"n":"大比鸟","t":["normal","flying"],"s":[83,80,75,70,70,101],"l":[[1,"tackle"],[5,"sand-attack"],[9,"gust"],[9,"mirror-move"],[13,"quick-attack"],[15,"pluck"],[15,"swift"],[17,"whirlwind"],[22,"twister"],[27,"feather-dance"],[29,"razor-wind"],[30,"headbutt"],[32,"agility"],[38,"wing-attack"],[44,"roost"],[45,"fly"],[45,"take-down"],[50,"tailwind"],[56,"aerial-ace"],[62,"air-slash"],[62,"hurricane"],[85,"double-edge"],[85,"sky-attack"]],"g":false,"m":false},"19":{"n":"小拉达","t":["normal"],"s":[30,56,35,25,35,72],"l":[[1,"tackle"],[1,"tail-whip"],[4,"quick-attack"],[7,"focus-energy"],[10,"bite"],[13,"laser-focus"],[15,"cut"],[16,"take-down"],[19,"assurance"],[22,"crunch"],[25,"sucker-punch"],[28,"super-fang"],[31,"double-edge"],[34,"endeavor"],[85,"skull-bash"]],"g":false,"m":false},"20":{"n":"拉达","t":["normal"],"s":[55,81,60,50,70,97],"l":[[0,"scary-face"],[1,"tackle"],[1,"tail-whip"],[4,"quick-attack"],[7,"focus-energy"],[10,"bite"],[13,"laser-focus"],[15,"cut"],[16,"take-down"],[19,"assurance"],[24,"crunch"],[29,"sucker-punch"],[34,"super-fang"],[39,"double-edge"],[44,"endeavor"],[85,"skull-bash"]],"g":false,"m":false},"21":{"n":"烈雀","t":["normal","flying"],"s":[40,60,30,31,31,70],"l":[[1,"growl"],[1,"peck"],[4,"leer"],[8,"assurance"],[11,"fury-attack"],[15,"aerial-ace"],[18,"wing-attack"],[19,"mirror-move"],[22,"take-down"],[25,"agility"],[29,"focus-energy"],[32,"roost"],[36,"drill-peck"],[45,"fly"],[85,"double-edge"],[85,"sky-attack"]],"g":false,"m":false},"22":{"n":"大嘴雀","t":["normal","flying"],"s":[65,90,65,61,61,100],"l":[[1,"growl"],[1,"peck"],[4,"leer"],[8,"assurance"],[11,"fury-attack"],[15,"aerial-ace"],[18,"wing-attack"],[19,"mirror-move"],[23,"take-down"],[27,"agility"],[32,"focus-energy"],[36,"roost"],[41,"drill-peck"],[45,"drill-run"],[45,"fly"],[85,"double-edge"],[85,"sky-attack"]],"g":false,"m":false},"23":{"n":"阿柏蛇","t":["poison"],"s":[35,60,44,40,54,55],"l":[[1,"leer"],[1,"wrap"],[4,"poison-sting"],[9,"bite"],[12,"glare"],[15,"poison-tail"],[17,"screech"],[20,"acid"],[24,"poison-jab"],[25,"spit-up"],[25,"stockpile"],[25,"swallow"],[28,"acid-spray"],[28,"slam"],[33,"mud-bomb"],[33,"sludge-bomb"],[36,"gastro-acid"],[36,"toxic"],[38,"belch"],[41,"haze"],[44,"coil"],[49,"gunk-shot"]],"g":false,"m":false},"24":{"n":"阿柏怪","t":["poison"],"s":[60,95,69,65,79,80],"l":[[0,"crunch"],[1,"leer"],[1,"wrap"],[4,"poison-sting"],[9,"bite"],[12,"glare"],[15,"poison-tail"],[17,"screech"],[20,"acid"],[24,"poison-jab"],[27,"spit-up"],[27,"stockpile"],[27,"swallow"],[28,"slam"],[32,"acid-spray"],[33,"mud-bomb"],[36,"toxic"],[39,"sludge-bomb"],[44,"gastro-acid"],[48,"belch"],[51,"haze"],[56,"coil"],[63,"gunk-shot"]],"g":false,"m":false},"25":{"n":"皮卡丘","t":["electric"],"s":[35,55,40,50,50,90],"l":[[1,"tail-whip"],[1,"thunder-shock"],[4,"play-nice"],[4,"thunder-wave"],[5,"growl"],[6,"quick-attack"],[8,"double-team"],[8,"sweet-kiss"],[9,"double-kick"],[12,"electro-ball"],[12,"nuzzle"],[15,"charge-beam"],[15,"electroweb"],[15,"shock-wave"],[16,"feint"],[16,"nasty-plot"],[20,"charm"],[20,"spark"],[24,"agility"],[26,"swift"],[28,"iron-tail"],[28,"slam"],[30,"thunder-punch"],[30,"volt-switch"],[32,"discharge"],[36,"thunderbolt"],[40,"light-screen"],[44,"thunder"],[45,"wild-charge"],[85,"zap-cannon"]],"g":false,"m":false},"26":{"n":"雷丘","t":["electric"],"s":[60,90,55,90,80,110],"l":[[0,"thunder-punch"],[1,"tail-whip"],[1,"thunder-shock"],[4,"play-nice"],[4,"thunder-wave"],[5,"growl"],[5,"thunderbolt"],[6,"quick-attack"],[8,"double-team"],[8,"sweet-kiss"],[9,"double-kick"],[12,"electro-ball"],[12,"nuzzle"],[15,"charge-beam"],[15,"electroweb"],[15,"shock-wave"],[16,"feint"],[16,"nasty-plot"],[20,"charm"],[20,"spark"],[24,"agility"],[26,"swift"],[28,"iron-tail"],[28,"slam"],[30,"volt-switch"],[32,"discharge"],[40,"light-screen"],[44,"thunder"],[45,"wild-charge"],[85,"zap-cannon"]],"g":false,"m":false},"27":{"n":"穿山鼠","t":["ground"],"s":[50,75,85,20,30,40],"l":[[1,"defense-curl"],[1,"scratch"],[3,"poison-sting"],[6,"sand-attack"],[9,"rollout"],[12,"fury-cutter"],[14,"magnitude"],[15,"rapid-spin"],[18,"bulldoze"],[21,"swift"],[24,"fury-swipes"],[24,"protect"],[27,"agility"],[30,"slash"],[30,"stomping-tantrum"],[33,"dig"],[36,"gyro-ball"],[39,"swords-dance"],[42,"sandstorm"],[45,"earthquake"]],"g":false,"m":false},"28":{"n":"穿山王","t":["ground"],"s":[75,100,110,45,55,65],"l":[[0,"crush-claw"],[1,"defense-curl"],[1,"scratch"],[3,"poison-sting"],[6,"sand-attack"],[9,"rollout"],[12,"fury-cutter"],[14,"magnitude"],[15,"rapid-spin"],[18,"bulldoze"],[21,"swift"],[24,"protect"],[26,"fury-swipes"],[27,"agility"],[30,"drill-run"],[30,"stomping-tantrum"],[31,"sand-tomb"],[36,"slash"],[41,"dig"],[46,"gyro-ball"],[51,"swords-dance"],[56,"sandstorm"],[61,"earthquake"]],"g":false,"m":false},"29":{"n":"尼多兰","t":["poison"],"s":[55,47,52,40,40,41],"l":[[1,"growl"],[1,"poison-sting"],[1,"tackle"],[5,"scratch"],[10,"tail-whip"],[15,"fury-swipes"],[15,"venoshock"],[20,"toxic-spikes"],[25,"double-kick"],[27,"super-fang"],[30,"bite"],[30,"poison-jab"],[35,"helping-hand"],[40,"toxic"],[43,"captivate"],[45,"flatter"],[45,"poison-fang"],[50,"crunch"],[55,"earth-power"]],"g":false,"m":false},"30":{"n":"尼多娜","t":["poison"],"s":[70,62,67,55,55,56],"l":[[1,"growl"],[1,"poison-sting"],[1,"tackle"],[5,"scratch"],[10,"tail-whip"],[15,"fury-swipes"],[15,"venoshock"],[22,"toxic-spikes"],[27,"super-fang"],[29,"double-kick"],[30,"poison-jab"],[36,"bite"],[43,"captivate"],[43,"helping-hand"],[45,"poison-fang"],[50,"toxic"],[57,"flatter"],[64,"crunch"],[71,"earth-power"]],"g":false,"m":false},"31":{"n":"尼多后","t":["poison","ground"],"s":[90,92,87,75,85,76],"l":[[0,"body-slam"],[0,"superpower"],[1,"growl"],[1,"poison-sting"],[1,"tackle"],[5,"scratch"],[10,"tail-whip"],[15,"bulldoze"],[15,"fury-swipes"],[15,"mud-shot"],[15,"mud-slap"],[15,"sand-tomb"],[15,"venoshock"],[22,"toxic-spikes"],[27,"super-fang"],[29,"double-kick"],[30,"dig"],[30,"poison-jab"],[30,"stomping-tantrum"],[36,"bite"],[43,"captivate"],[43,"helping-hand"],[45,"high-horsepower"],[45,"poison-fang"],[50,"toxic"],[57,"flatter"],[64,"crunch"],[65,"earthquake"],[71,"earth-power"]],"g":false,"m":false},"32":{"n":"尼多朗","t":["poison"],"s":[46,57,40,40,40,50],"l":[[1,"leer"],[1,"poison-sting"],[1,"tackle"],[5,"peck"],[10,"focus-energy"],[15,"fury-attack"],[15,"venoshock"],[20,"toxic-spikes"],[25,"double-kick"],[27,"horn-drill"],[30,"horn-attack"],[35,"helping-hand"],[40,"toxic"],[43,"captivate"],[45,"flatter"],[45,"sludge-bomb"],[50,"poison-jab"],[55,"earth-power"]],"g":false,"m":false},"33":{"n":"尼多力诺","t":["poison"],"s":[61,72,57,55,55,65],"l":[[1,"leer"],[1,"poison-sting"],[1,"tackle"],[5,"peck"],[10,"focus-energy"],[15,"fury-attack"],[15,"venoshock"],[22,"toxic-spikes"],[27,"horn-drill"],[29,"double-kick"],[36,"horn-attack"],[43,"captivate"],[43,"helping-hand"],[45,"sludge-bomb"],[50,"toxic"],[57,"flatter"],[64,"poison-jab"],[71,"earth-power"]],"g":false,"m":false},"34":{"n":"尼多王","t":["poison","ground"],"s":[81,102,77,85,75,85],"l":[[0,"megahorn"],[0,"thrash"],[1,"leer"],[1,"poison-sting"],[1,"tackle"],[5,"peck"],[10,"focus-energy"],[15,"bulldoze"],[15,"fury-attack"],[15,"mud-shot"],[15,"mud-slap"],[15,"sand-tomb"],[15,"venoshock"],[22,"toxic-spikes"],[27,"horn-drill"],[29,"double-kick"],[30,"dig"],[30,"poison-jab"],[30,"stomping-tantrum"],[36,"horn-attack"],[43,"captivate"],[43,"helping-hand"],[45,"high-horsepower"],[45,"sludge-bomb"],[50,"toxic"],[57,"flatter"],[65,"earthquake"],[71,"earth-power"]],"g":false,"m":false},"35":{"n":"皮皮","t":["fairy"],"s":[70,45,48,60,65,35],"l":[[1,"copycat"],[1,"pound"],[1,"splash"],[4,"defense-curl"],[4,"sing"],[4,"stored-power"],[8,"encore"],[8,"minimize"],[8,"sweet-kiss"],[12,"after-you"],[12,"disarming-voice"],[12,"double-slap"],[15,"draining-kiss"],[16,"amnesia"],[16,"life-dew"],[16,"magical-leaf"],[19,"bestow"],[20,"charm"],[20,"metronome"],[22,"wake-up-slap"],[24,"body-slam"],[24,"moonlight"],[28,"gravity"],[30,"dazzling-gleam"],[32,"meteor-mash"],[36,"follow-me"],[37,"lucky-chant"],[40,"cosmic-power"],[44,"moonblast"],[46,"light-screen"],[48,"healing-wish"]],"g":false,"m":false},"36":{"n":"皮可西","t":["fairy"],"s":[95,70,73,95,90,60],"l":[[1,"copycat"],[1,"pound"],[1,"splash"],[4,"defense-curl"],[4,"sing"],[4,"stored-power"],[8,"encore"],[8,"minimize"],[8,"sweet-kiss"],[12,"after-you"],[12,"disarming-voice"],[12,"double-slap"],[15,"draining-kiss"],[16,"amnesia"],[16,"life-dew"],[16,"magical-leaf"],[19,"bestow"],[20,"charm"],[20,"metronome"],[22,"wake-up-slap"],[24,"body-slam"],[24,"moonlight"],[28,"gravity"],[30,"dazzling-gleam"],[32,"meteor-mash"],[36,"follow-me"],[37,"lucky-chant"],[40,"cosmic-power"],[44,"moonblast"],[46,"light-screen"],[48,"healing-wish"]],"g":false,"m":false},"37":{"n":"六尾","t":["fire"],"s":[38,41,40,50,65,65],"l":[[1,"ember"],[1,"tackle"],[1,"tail-whip"],[4,"disable"],[8,"quick-attack"],[9,"baby-doll-eyes"],[12,"spite"],[15,"flame-charge"],[16,"incinerate"],[18,"payback"],[20,"confuse-ray"],[23,"feint-attack"],[24,"will-o-wisp"],[26,"hex"],[28,"extrasensory"],[28,"flame-burst"],[28,"roar"],[30,"mystical-fire"],[32,"flamethrower"],[36,"imprison"],[40,"fire-spin"],[44,"safeguard"],[45,"heat-wave"],[47,"captivate"],[48,"inferno"],[52,"fire-blast"],[52,"grudge"],[85,"overheat"]],"g":false,"m":false},"38":{"n":"九尾","t":["fire"],"s":[73,76,75,81,100,100],"l":[[1,"ember"],[1,"tackle"],[1,"tail-whip"],[4,"disable"],[8,"quick-attack"],[9,"baby-doll-eyes"],[12,"spite"],[15,"flame-charge"],[15,"incinerate"],[18,"payback"],[20,"confuse-ray"],[23,"feint-attack"],[24,"will-o-wisp"],[26,"hex"],[28,"extrasensory"],[28,"flame-burst"],[28,"roar"],[30,"mystical-fire"],[32,"flamethrower"],[36,"imprison"],[40,"fire-spin"],[44,"safeguard"],[45,"heat-wave"],[47,"captivate"],[48,"inferno"],[52,"fire-blast"],[52,"grudge"],[85,"overheat"]],"g":false,"m":false},"39":{"n":"胖丁","t":["normal","fairy"],"s":[115,45,20,45,25,20],"l":[[1,"copycat"],[1,"pound"],[1,"sing"],[4,"defense-curl"],[4,"echoed-voice"],[8,"covet"],[8,"sweet-kiss"],[9,"play-nice"],[10,"bide"],[12,"disarming-voice"],[12,"spit-up"],[12,"stockpile"],[12,"swallow"],[15,"draining-kiss"],[15,"swift"],[16,"disable"],[16,"round"],[20,"charm"],[20,"rest"],[20,"rollout"],[24,"body-slam"],[27,"wake-up-slap"],[28,"mimic"],[30,"dazzling-gleam"],[30,"tera-blast"],[32,"gyro-ball"],[36,"hyper-voice"],[40,"play-rough"],[44,"double-edge"],[45,"uproar"],[85,"skull-bash"]],"g":false,"m":false},"40":{"n":"胖可丁","t":["normal","fairy"],"s":[140,70,45,85,50,45],"l":[[1,"copycat"],[1,"pound"],[1,"sing"],[4,"defense-curl"],[4,"echoed-voice"],[5,"play-rough"],[8,"covet"],[8,"sweet-kiss"],[9,"play-nice"],[10,"bide"],[12,"disarming-voice"],[12,"spit-up"],[12,"stockpile"],[12,"swallow"],[15,"draining-kiss"],[15,"swift"],[16,"disable"],[16,"round"],[20,"charm"],[20,"rest"],[20,"rollout"],[24,"body-slam"],[27,"wake-up-slap"],[28,"mimic"],[30,"dazzling-gleam"],[30,"tera-blast"],[32,"gyro-ball"],[36,"hyper-voice"],[44,"double-edge"],[45,"uproar"],[85,"skull-bash"]],"g":false,"m":false},"41":{"n":"超音蝠","t":["poison","flying"],"s":[40,45,35,30,40,55],"l":[[1,"absorb"],[1,"supersonic"],[4,"wing-attack"],[5,"astonish"],[10,"mean-look"],[12,"swift"],[15,"poison-fang"],[20,"quick-guard"],[25,"air-cutter"],[28,"toxic"],[30,"bite"],[35,"haze"],[40,"venoshock"],[45,"confuse-ray"],[45,"fly"],[45,"sludge-bomb"],[50,"air-slash"],[55,"leech-life"],[85,"brave-bird"]],"g":false,"m":false},"42":{"n":"大嘴蝠","t":["poison","flying"],"s":[75,80,70,65,75,90],"l":[[0,"crunch"],[1,"absorb"],[1,"supersonic"],[4,"wing-attack"],[5,"astonish"],[10,"mean-look"],[12,"swift"],[15,"poison-fang"],[20,"quick-guard"],[27,"air-cutter"],[28,"toxic"],[34,"bite"],[41,"haze"],[45,"fly"],[45,"sludge-bomb"],[48,"venoshock"],[55,"confuse-ray"],[62,"air-slash"],[69,"leech-life"],[85,"brave-bird"]],"g":false,"m":false},"43":{"n":"走路草","t":["grass","poison"],"s":[45,50,55,75,65,30],"l":[[1,"absorb"],[1,"growth"],[4,"acid"],[8,"sweet-scent"],[12,"mega-drain"],[14,"poison-powder"],[15,"magical-leaf"],[15,"venoshock"],[16,"stun-spore"],[18,"sleep-powder"],[20,"giga-drain"],[23,"lucky-chant"],[24,"toxic"],[28,"moonblast"],[32,"grassy-terrain"],[36,"moonlight"],[39,"natural-gift"],[40,"petal-dance"],[45,"sludge-bomb"],[85,"leaf-storm"]],"g":false,"m":false},"44":{"n":"臭臭花","t":["grass","poison"],"s":[60,65,70,85,75,40],"l":[[1,"absorb"],[1,"growth"],[4,"acid"],[8,"sweet-scent"],[12,"mega-drain"],[14,"poison-powder"],[15,"magical-leaf"],[15,"venoshock"],[16,"stun-spore"],[18,"sleep-powder"],[20,"giga-drain"],[23,"lucky-chant"],[26,"toxic"],[32,"moonblast"],[38,"grassy-terrain"],[39,"natural-gift"],[44,"moonlight"],[45,"sludge-bomb"],[50,"petal-dance"],[85,"leaf-storm"]],"g":false,"m":false},"45":{"n":"霸王花","t":["grass","poison"],"s":[75,80,85,110,90,50],"l":[[0,"petal-blizzard"],[1,"absorb"],[1,"growth"],[4,"acid"],[8,"sweet-scent"],[12,"mega-drain"],[14,"poison-powder"],[15,"magical-leaf"],[15,"venoshock"],[16,"stun-spore"],[18,"sleep-powder"],[20,"giga-drain"],[23,"lucky-chant"],[26,"toxic"],[32,"moonblast"],[38,"grassy-terrain"],[39,"natural-gift"],[44,"moonlight"],[45,"sludge-bomb"],[45,"sludge-wave"],[50,"petal-dance"],[85,"leaf-storm"]],"g":false,"m":false},"46":{"n":"派拉斯","t":["bug","grass"],"s":[35,70,55,45,55,25],"l":[[1,"scratch"],[2,"sleep-powder"],[6,"poison-powder"],[6,"stun-spore"],[11,"absorb"],[15,"fury-swipes"],[15,"grass-knot"],[15,"mega-drain"],[15,"struggle-bug"],[17,"fury-cutter"],[22,"spore"],[23,"leech-life"],[27,"slash"],[30,"bullet-seed"],[33,"growth"],[38,"giga-drain"],[43,"aromatherapy"],[49,"rage-powder"],[54,"x-scissor"]],"g":false,"m":false},"47":{"n":"派拉斯特","t":["bug","grass"],"s":[60,95,80,60,80,30],"l":[[1,"scratch"],[2,"sleep-powder"],[6,"poison-powder"],[6,"stun-spore"],[11,"absorb"],[15,"fury-swipes"],[15,"grass-knot"],[15,"mega-drain"],[15,"struggle-bug"],[17,"fury-cutter"],[22,"spore"],[23,"leech-life"],[29,"slash"],[30,"bullet-seed"],[37,"growth"],[44,"giga-drain"],[51,"aromatherapy"],[59,"rage-powder"],[66,"x-scissor"]],"g":false,"m":false},"48":{"n":"毛球","t":["bug","poison"],"s":[60,55,50,40,55,45],"l":[[1,"disable"],[1,"foresight"],[1,"struggle-bug"],[1,"tackle"],[5,"supersonic"],[11,"confusion"],[13,"poison-powder"],[15,"acid-spray"],[15,"bug-bite"],[15,"pounce"],[15,"venoshock"],[17,"psybeam"],[23,"stun-spore"],[25,"bug-buzz"],[25,"mega-drain"],[29,"sleep-powder"],[30,"lunge"],[30,"skitter-smack"],[35,"leech-life"],[37,"zen-headbutt"],[41,"poison-fang"],[45,"sludge-bomb"],[47,"psychic"]],"g":false,"m":false},"49":{"n":"摩鲁蛾","t":["bug","poison"],"s":[70,65,60,90,75,90],"l":[[0,"air-slash"],[1,"disable"],[1,"foresight"],[1,"struggle-bug"],[1,"tackle"],[5,"supersonic"],[11,"confusion"],[13,"poison-powder"],[15,"acid-spray"],[15,"bug-bite"],[15,"pounce"],[15,"silver-wind"],[15,"venoshock"],[17,"psybeam"],[23,"stun-spore"],[25,"bug-buzz"],[25,"mega-drain"],[29,"sleep-powder"],[30,"lunge"],[30,"skitter-smack"],[37,"leech-life"],[41,"zen-headbutt"],[45,"sludge-bomb"],[45,"sludge-wave"],[47,"poison-fang"],[55,"psychic"],[63,"quiver-dance"]],"g":false,"m":false},"50":{"n":"地鼠","t":["ground"],"s":[10,55,25,35,45,95],"l":[[1,"sand-attack"],[1,"scratch"],[4,"growl"],[8,"astonish"],[12,"agility"],[12,"mud-slap"],[14,"magnitude"],[15,"fury-swipes"],[16,"bulldoze"],[20,"sucker-punch"],[24,"slash"],[28,"sandstorm"],[30,"stomping-tantrum"],[32,"dig"],[36,"earth-power"],[40,"earthquake"],[44,"fissure"]],"g":false,"m":false},"51":{"n":"三地鼠","t":["ground"],"s":[35,100,50,50,70,120],"l":[[0,"sand-tomb"],[0,"tri-attack"],[1,"sand-attack"],[1,"scratch"],[4,"growl"],[8,"astonish"],[12,"agility"],[12,"mud-slap"],[14,"magnitude"],[15,"fury-swipes"],[16,"bulldoze"],[20,"sucker-punch"],[24,"slash"],[30,"sandstorm"],[30,"stomping-tantrum"],[36,"dig"],[42,"earth-power"],[48,"earthquake"],[54,"fissure"]],"g":false,"m":false},"52":{"n":"喵喵","t":["normal"],"s":[40,45,35,40,40,90],"l":[[1,"fake-out"],[1,"growl"],[4,"feint"],[8,"scratch"],[12,"pay-day"],[15,"cut"],[15,"swift"],[16,"bite"],[20,"taunt"],[24,"assurance"],[29,"fury-swipes"],[30,"headbutt"],[30,"tera-blast"],[32,"screech"],[36,"slash"],[40,"nasty-plot"],[44,"play-rough"],[45,"body-slam"],[45,"swagger"],[45,"take-down"],[46,"captivate"],[49,"night-slash"],[85,"double-edge"],[85,"skull-bash"]],"g":false,"m":false},"53":{"n":"猫老大","t":["normal"],"s":[65,70,60,65,65,115],"l":[[0,"power-gem"],[1,"fake-out"],[1,"growl"],[4,"feint"],[8,"scratch"],[12,"pay-day"],[15,"cut"],[15,"swift"],[16,"bite"],[20,"taunt"],[24,"assurance"],[30,"headbutt"],[30,"tera-blast"],[31,"fury-swipes"],[36,"screech"],[42,"slash"],[45,"body-slam"],[45,"swagger"],[45,"take-down"],[46,"captivate"],[48,"nasty-plot"],[49,"night-slash"],[54,"play-rough"],[85,"double-edge"],[85,"skull-bash"]],"g":false,"m":false},"54":{"n":"可达鸭","t":["water"],"s":[50,52,48,65,50,55],"l":[[1,"scratch"],[1,"tail-whip"],[1,"water-sport"],[3,"water-gun"],[6,"confusion"],[9,"fury-swipes"],[12,"water-pulse"],[15,"bubble-beam"],[15,"disable"],[18,"zen-headbutt"],[21,"screech"],[24,"aqua-tail"],[27,"psybeam"],[27,"soak"],[30,"psych-up"],[30,"scald"],[34,"amnesia"],[36,"hydro-pump"],[36,"surf"],[39,"wonder-room"]],"g":false,"m":false},"55":{"n":"哥达鸭","t":["water"],"s":[80,82,78,95,80,85],"l":[[1,"scratch"],[1,"tail-whip"],[1,"water-sport"],[3,"water-gun"],[6,"confusion"],[9,"fury-swipes"],[12,"water-pulse"],[15,"bubble-beam"],[15,"disable"],[18,"zen-headbutt"],[21,"screech"],[24,"aqua-tail"],[27,"psybeam"],[27,"soak"],[30,"psych-up"],[30,"scald"],[36,"amnesia"],[36,"surf"],[40,"hydro-pump"],[45,"wonder-room"]],"g":false,"m":false},"56":{"n":"猴怪","t":["fighting"],"s":[40,80,35,35,45,70],"l":[[1,"covet"],[1,"focus-energy"],[1,"leer"],[1,"scratch"],[5,"fury-swipes"],[8,"low-kick"],[8,"mud-slap"],[8,"taunt"],[12,"pursuit"],[12,"seismic-toss"],[15,"low-sweep"],[15,"retaliate"],[17,"swagger"],[22,"cross-chop"],[26,"assurance"],[29,"punishment"],[29,"skull-bash"],[29,"thrash"],[29,"u-turn"],[33,"close-combat"],[36,"screech"],[40,"stomping-tantrum"],[44,"outrage"],[48,"final-gambit"]],"g":false,"m":false},"57":{"n":"火暴猴","t":["fighting"],"s":[65,105,60,60,70,95],"l":[[0,"rage"],[1,"covet"],[1,"focus-energy"],[1,"leer"],[1,"scratch"],[5,"fury-swipes"],[8,"low-kick"],[8,"mud-slap"],[8,"taunt"],[12,"pursuit"],[15,"low-sweep"],[15,"retaliate"],[15,"seismic-toss"],[17,"swagger"],[22,"cross-chop"],[26,"assurance"],[29,"punishment"],[29,"skull-bash"],[29,"u-turn"],[30,"thrash"],[35,"rage-fist"],[39,"close-combat"],[44,"screech"],[48,"stomping-tantrum"],[53,"outrage"],[57,"final-gambit"]],"g":false,"m":false},"58":{"n":"卡蒂狗","t":["fire"],"s":[55,70,45,70,50,60],"l":[[1,"ember"],[1,"leer"],[4,"howl"],[8,"bite"],[10,"odor-sleuth"],[12,"flame-wheel"],[16,"helping-hand"],[20,"agility"],[24,"fire-fang"],[24,"heat-wave"],[28,"retaliate"],[31,"outrage"],[32,"crunch"],[36,"take-down"],[40,"flamethrower"],[44,"roar"],[48,"play-rough"],[52,"reversal"],[56,"flare-blitz"],[85,"overheat"]],"g":false,"m":false},"59":{"n":"风速狗","t":["fire"],"s":[90,110,80,100,80,95],"l":[[0,"extreme-speed"],[1,"ember"],[1,"leer"],[4,"howl"],[5,"flamethrower"],[8,"bite"],[10,"odor-sleuth"],[12,"flame-wheel"],[16,"helping-hand"],[20,"agility"],[24,"fire-fang"],[24,"heat-wave"],[28,"retaliate"],[31,"outrage"],[32,"crunch"],[36,"take-down"],[44,"roar"],[48,"play-rough"],[52,"reversal"],[56,"flare-blitz"],[85,"overheat"]],"g":false,"m":false},"60":{"n":"蚊香蝌蚪","t":["water"],"s":[40,50,40,40,40,90],"l":[[1,"hypnosis"],[1,"water-gun"],[1,"water-sport"],[6,"pound"],[12,"mud-shot"],[15,"chilling-water"],[15,"water-pulse"],[16,"double-slap"],[18,"bubble-beam"],[24,"rain-dance"],[26,"low-kick"],[30,"body-slam"],[30,"waterfall"],[35,"wake-up-slap"],[36,"earth-power"],[38,"amnesia"],[42,"hydro-pump"],[48,"belly-drum"],[54,"double-edge"]],"g":false,"m":false},"61":{"n":"蚊香君","t":["water"],"s":[65,65,65,50,50,90],"l":[[1,"hypnosis"],[1,"water-gun"],[1,"water-sport"],[6,"pound"],[12,"mud-shot"],[15,"chilling-water"],[15,"water-pulse"],[16,"double-slap"],[18,"bubble-beam"],[24,"rain-dance"],[26,"low-kick"],[30,"waterfall"],[32,"body-slam"],[35,"wake-up-slap"],[38,"amnesia"],[40,"earth-power"],[45,"liquidation"],[48,"hydro-pump"],[56,"belly-drum"],[66,"double-edge"]],"g":false,"m":false},"62":{"n":"蚊香泳士","t":["water","fighting"],"s":[90,95,95,70,90,70],"l":[[0,"dynamic-punch"],[1,"hypnosis"],[1,"water-gun"],[1,"water-sport"],[6,"pound"],[12,"mud-shot"],[15,"bubble-beam"],[15,"chilling-water"],[15,"water-pulse"],[16,"double-slap"],[24,"rain-dance"],[26,"low-kick"],[30,"waterfall"],[32,"body-slam"],[35,"wake-up-slap"],[38,"amnesia"],[40,"earth-power"],[43,"mind-reader"],[45,"liquidation"],[48,"hydro-pump"],[56,"belly-drum"],[57,"superpower"],[66,"double-edge"]],"g":false,"m":false},"63":{"n":"凯西","t":["psychic"],"s":[25,20,15,105,55,90],"l":[[1,"teleport"],[15,"psywave"],[30,"psyshock"],[45,"psychic"]],"g":false,"m":false},"64":{"n":"勇基拉","t":["psychic"],"s":[40,35,30,120,70,105],"l":[[0,"confusion"],[0,"kinesis"],[1,"teleport"],[5,"psybeam"],[6,"disable"],[10,"reflect"],[13,"flash"],[15,"ally-switch"],[15,"psywave"],[19,"night-shade"],[20,"psycho-cut"],[23,"miracle-eye"],[25,"recover"],[26,"substitute"],[30,"psyshock"],[33,"telekinesis"],[35,"psychic"],[40,"role-play"],[45,"future-sight"],[46,"trick"],[50,"calm-mind"]],"g":false,"m":false},"65":{"n":"胡地","t":["psychic"],"s":[55,50,45,135,95,120],"l":[[0,"confusion"],[0,"kinesis"],[1,"teleport"],[5,"psybeam"],[6,"disable"],[10,"reflect"],[13,"flash"],[15,"ally-switch"],[15,"psywave"],[19,"night-shade"],[20,"psycho-cut"],[23,"miracle-eye"],[25,"recover"],[26,"substitute"],[30,"psyshock"],[33,"telekinesis"],[35,"psychic"],[40,"role-play"],[45,"future-sight"],[46,"trick"],[50,"calm-mind"]],"g":false,"m":false},"66":{"n":"腕力","t":["fighting"],"s":[70,80,50,35,35,35],"l":[[1,"leer"],[1,"low-kick"],[4,"focus-energy"],[8,"bide"],[8,"revenge"],[9,"foresight"],[12,"low-sweep"],[16,"knock-off"],[20,"scary-face"],[21,"brick-break"],[24,"vital-throw"],[26,"submission"],[29,"strength"],[32,"dual-chop"],[36,"bulk-up"],[36,"superpower"],[40,"seismic-toss"],[44,"dynamic-punch"],[48,"cross-chop"],[52,"double-edge"]],"g":false,"m":false},"67":{"n":"豪力","t":["fighting"],"s":[80,100,70,50,60,45],"l":[[1,"leer"],[1,"low-kick"],[4,"focus-energy"],[8,"bide"],[8,"revenge"],[9,"foresight"],[12,"low-sweep"],[16,"knock-off"],[20,"scary-face"],[21,"brick-break"],[24,"vital-throw"],[26,"submission"],[31,"strength"],[36,"dual-chop"],[36,"superpower"],[42,"bulk-up"],[48,"seismic-toss"],[54,"dynamic-punch"],[60,"cross-chop"],[66,"double-edge"]],"g":false,"m":false},"68":{"n":"怪力","t":["fighting"],"s":[90,130,80,65,85,55],"l":[[1,"leer"],[1,"low-kick"],[4,"focus-energy"],[8,"bide"],[8,"revenge"],[9,"foresight"],[12,"low-sweep"],[16,"knock-off"],[20,"scary-face"],[21,"brick-break"],[24,"vital-throw"],[26,"submission"],[31,"strength"],[36,"dual-chop"],[36,"superpower"],[42,"bulk-up"],[48,"seismic-toss"],[54,"dynamic-punch"],[60,"cross-chop"],[66,"double-edge"]],"g":false,"m":false},"69":{"n":"喇叭芽","t":["grass","poison"],"s":[50,75,35,70,30,40],"l":[[1,"vine-whip"],[7,"growth"],[11,"wrap"],[13,"sleep-powder"],[15,"acid-spray"],[15,"grassy-glide"],[15,"magical-leaf"],[15,"poison-powder"],[15,"trailblaze"],[15,"venoshock"],[17,"stun-spore"],[23,"acid"],[27,"knock-off"],[29,"sweet-scent"],[30,"bullet-seed"],[30,"giga-drain"],[30,"seed-bomb"],[35,"gastro-acid"],[39,"razor-leaf"],[41,"poison-jab"],[45,"energy-ball"],[45,"sludge-bomb"],[45,"sludge-wave"],[47,"slam"],[50,"wring-out"],[52,"power-whip"],[85,"leaf-storm"]],"g":false,"m":false},"70":{"n":"口呆花","t":["grass","poison"],"s":[65,90,50,85,45,55],"l":[[1,"vine-whip"],[7,"growth"],[11,"wrap"],[13,"sleep-powder"],[15,"acid-spray"],[15,"grassy-glide"],[15,"magical-leaf"],[15,"poison-powder"],[15,"trailblaze"],[15,"venoshock"],[17,"stun-spore"],[24,"acid"],[29,"knock-off"],[30,"bullet-seed"],[30,"giga-drain"],[30,"seed-bomb"],[32,"sweet-scent"],[39,"gastro-acid"],[44,"razor-leaf"],[45,"energy-ball"],[45,"sludge-bomb"],[45,"sludge-wave"],[47,"poison-jab"],[50,"wring-out"],[54,"slam"],[58,"power-whip"],[85,"leaf-storm"]],"g":false,"m":false},"71":{"n":"大食花","t":["grass","poison"],"s":[80,105,65,100,70,70],"l":[[0,"leaf-storm"],[1,"vine-whip"],[7,"growth"],[11,"wrap"],[13,"sleep-powder"],[15,"acid-spray"],[15,"grassy-glide"],[15,"magical-leaf"],[15,"poison-powder"],[15,"trailblaze"],[15,"venoshock"],[17,"stun-spore"],[24,"acid"],[29,"knock-off"],[30,"bullet-seed"],[30,"giga-drain"],[30,"poison-jab"],[30,"seed-bomb"],[32,"sweet-scent"],[39,"gastro-acid"],[44,"leaf-blade"],[44,"razor-leaf"],[45,"energy-ball"],[45,"sludge-bomb"],[45,"sludge-wave"],[50,"wring-out"],[54,"slam"],[58,"power-whip"]],"g":false,"m":false},"72":{"n":"玛瑙水母","t":["water","poison"],"s":[40,40,35,50,100,70],"l":[[1,"poison-sting"],[1,"water-gun"],[4,"acid"],[4,"constrict"],[8,"wrap"],[12,"supersonic"],[13,"toxic-spikes"],[15,"brine"],[15,"chilling-water"],[15,"venoshock"],[16,"water-pulse"],[20,"screech"],[24,"bubble-beam"],[28,"hex"],[30,"scald"],[31,"barrier"],[32,"acid-armor"],[36,"poison-jab"],[40,"surf"],[44,"sludge-wave"],[48,"hydro-pump"],[49,"wring-out"],[85,"gunk-shot"]],"g":false,"m":false},"73":{"n":"毒刺水母","t":["water","poison"],"s":[80,70,65,80,120,100],"l":[[1,"poison-sting"],[1,"water-gun"],[4,"acid"],[4,"constrict"],[8,"wrap"],[12,"supersonic"],[13,"toxic-spikes"],[15,"brine"],[15,"chilling-water"],[15,"venoshock"],[16,"water-pulse"],[20,"screech"],[24,"bubble-beam"],[28,"hex"],[30,"scald"],[31,"barrier"],[34,"acid-armor"],[40,"poison-jab"],[46,"surf"],[49,"wring-out"],[52,"sludge-wave"],[58,"hydro-pump"],[85,"gunk-shot"]],"g":false,"m":false},"74":{"n":"小拳石","t":["rock","ground"],"s":[40,80,100,30,30,20],"l":[[1,"defense-curl"],[1,"tackle"],[3,"sand-attack"],[4,"mud-sport"],[4,"sandstorm"],[6,"bide"],[6,"rock-polish"],[10,"rollout"],[12,"bulldoze"],[12,"harden"],[12,"magnitude"],[15,"rock-tomb"],[15,"take-down"],[16,"rock-throw"],[18,"smack-down"],[23,"rock-slide"],[24,"self-destruct"],[28,"stealth-rock"],[30,"dig"],[30,"rock-blast"],[30,"stomping-tantrum"],[34,"earthquake"],[36,"explosion"],[40,"double-edge"],[42,"stone-edge"]],"g":false,"m":false},"75":{"n":"隆隆石","t":["rock","ground"],"s":[55,95,115,45,45,35],"l":[[1,"defense-curl"],[1,"tackle"],[3,"sand-attack"],[4,"mud-sport"],[4,"sandstorm"],[6,"bide"],[6,"rock-polish"],[10,"rollout"],[12,"bulldoze"],[12,"harden"],[12,"magnitude"],[15,"rock-tomb"],[15,"take-down"],[16,"rock-throw"],[18,"smack-down"],[23,"rock-slide"],[24,"self-destruct"],[30,"dig"],[30,"stealth-rock"],[30,"stomping-tantrum"],[34,"rock-blast"],[40,"earthquake"],[44,"explosion"],[50,"double-edge"],[54,"stone-edge"]],"g":false,"m":false},"76":{"n":"隆隆岩","t":["rock","ground"],"s":[80,120,130,55,65,45],"l":[[1,"defense-curl"],[1,"tackle"],[3,"sand-attack"],[4,"mud-sport"],[4,"sandstorm"],[6,"bide"],[6,"rock-polish"],[10,"rollout"],[10,"steamroller"],[12,"harden"],[12,"magnitude"],[15,"rock-tomb"],[15,"take-down"],[16,"rock-throw"],[18,"smack-down"],[22,"bulldoze"],[23,"rock-slide"],[24,"self-destruct"],[30,"dig"],[30,"stealth-rock"],[30,"stomping-tantrum"],[34,"rock-blast"],[40,"earthquake"],[44,"explosion"],[50,"double-edge"],[54,"stone-edge"],[60,"heavy-slam"]],"g":false,"m":false},"77":{"n":"小火马","t":["fire"],"s":[50,85,55,65,65,90],"l":[[1,"growl"],[1,"tackle"],[5,"tail-whip"],[10,"ember"],[15,"double-kick"],[15,"flame-charge"],[20,"agility"],[25,"flame-wheel"],[30,"stomp"],[35,"fire-spin"],[41,"take-down"],[45,"bounce"],[45,"inferno"],[50,"fire-blast"],[55,"flare-blitz"]],"g":false,"m":false},"78":{"n":"烈焰马","t":["fire"],"s":[65,100,70,80,80,105],"l":[[0,"fury-attack"],[0,"smart-strike"],[1,"growl"],[1,"tackle"],[5,"tail-whip"],[10,"ember"],[15,"double-kick"],[15,"flame-charge"],[20,"agility"],[25,"flame-wheel"],[30,"stomp"],[35,"fire-spin"],[43,"take-down"],[45,"bounce"],[49,"inferno"],[56,"fire-blast"],[63,"flare-blitz"]],"g":false,"m":false},"79":{"n":"呆呆兽","t":["water","psychic"],"s":[90,65,65,40,40,15],"l":[[1,"curse"],[1,"tackle"],[3,"growl"],[6,"water-gun"],[9,"yawn"],[12,"confusion"],[15,"bubble-beam"],[15,"chilling-water"],[15,"disable"],[15,"psybeam"],[18,"water-pulse"],[21,"headbutt"],[24,"zen-headbutt"],[27,"amnesia"],[30,"rest"],[30,"surf"],[30,"waterfall"],[33,"slack-off"],[36,"psychic"],[39,"psych-up"],[42,"rain-dance"],[45,"heal-pulse"],[45,"liquidation"]],"g":false,"m":false},"80":{"n":"呆壳兽","t":["water","psychic"],"s":[95,75,110,100,80,30],"l":[[0,"withdraw"],[1,"curse"],[1,"tackle"],[3,"growl"],[6,"water-gun"],[9,"yawn"],[12,"confusion"],[15,"bubble-beam"],[15,"chilling-water"],[15,"disable"],[15,"psybeam"],[18,"water-pulse"],[21,"headbutt"],[24,"zen-headbutt"],[27,"amnesia"],[30,"psychic-noise"],[30,"psyshock"],[30,"rest"],[30,"surf"],[30,"waterfall"],[33,"slack-off"],[36,"psychic"],[41,"psych-up"],[45,"liquidation"],[46,"rain-dance"],[51,"heal-pulse"],[65,"hydro-pump"],[85,"future-sight"]],"g":false,"m":false},"81":{"n":"小磁怪","t":["electric","steel"],"s":[25,35,70,95,55,45],"l":[[1,"tackle"],[1,"thunder-shock"],[4,"supersonic"],[8,"thunder-wave"],[11,"magnet-bomb"],[12,"electro-ball"],[15,"sonic-boom"],[16,"gyro-ball"],[20,"spark"],[23,"mirror-shot"],[24,"screech"],[26,"thunderbolt"],[28,"magnet-rise"],[32,"flash-cannon"],[36,"discharge"],[38,"swift"],[40,"metal-sound"],[44,"light-screen"],[44,"thunder"],[48,"lock-on"],[52,"zap-cannon"]],"g":false,"m":false},"82":{"n":"三合一磁怪","t":["electric","steel"],"s":[50,60,95,120,70,70],"l":[[0,"tri-attack"],[1,"tackle"],[1,"thunder-shock"],[4,"supersonic"],[8,"thunder-wave"],[11,"electric-terrain"],[11,"magnet-bomb"],[12,"electro-ball"],[15,"sonic-boom"],[16,"gyro-ball"],[20,"spark"],[23,"mirror-shot"],[24,"screech"],[26,"thunderbolt"],[28,"magnet-rise"],[34,"flash-cannon"],[38,"swift"],[40,"discharge"],[44,"thunder"],[46,"metal-sound"],[52,"light-screen"],[58,"lock-on"],[64,"zap-cannon"]],"g":false,"m":false},"83":{"n":"大葱鸭","t":["normal","flying"],"s":[52,90,55,58,62,60],"l":[[1,"feint"],[1,"mirror-move"],[1,"peck"],[1,"poison-jab"],[1,"quick-attack"],[1,"sand-attack"],[4,"focus-energy"],[5,"leer"],[10,"fury-cutter"],[13,"razor-leaf"],[15,"acrobatics"],[15,"cut"],[15,"pluck"],[20,"aerial-ace"],[25,"air-cutter"],[30,"headbutt"],[30,"knock-off"],[33,"night-slash"],[35,"false-swipe"],[40,"sky-attack"],[40,"slash"],[45,"body-slam"],[45,"swords-dance"],[45,"take-down"],[50,"air-slash"],[55,"leaf-blade"],[60,"agility"],[65,"brave-bird"],[85,"double-edge"],[85,"skull-bash"]],"g":false,"m":false},"84":{"n":"嘟嘟","t":["normal","flying"],"s":[35,85,45,35,35,75],"l":[[1,"growl"],[1,"peck"],[5,"quick-attack"],[8,"leer"],[9,"fury-attack"],[14,"pluck"],[15,"pursuit"],[19,"double-hit"],[23,"agility"],[27,"uproar"],[30,"acupressure"],[33,"swords-dance"],[36,"drill-peck"],[38,"jump-kick"],[39,"endeavor"],[40,"lunge"],[43,"thrash"],[45,"fly"],[85,"brave-bird"],[85,"skull-bash"],[85,"sky-attack"]],"g":false,"m":false},"85":{"n":"嘟嘟利","t":["normal","flying"],"s":[60,110,70,60,60,110],"l":[[0,"tri-attack"],[1,"growl"],[1,"peck"],[5,"quick-attack"],[8,"leer"],[12,"fury-attack"],[15,"pluck"],[15,"pursuit"],[19,"double-hit"],[23,"agility"],[26,"uproar"],[30,"acupressure"],[34,"swords-dance"],[38,"drill-peck"],[38,"jump-kick"],[40,"lunge"],[43,"endeavor"],[45,"fly"],[50,"thrash"],[85,"brave-bird"],[85,"skull-bash"],[85,"sky-attack"]],"g":false,"m":false},"86":{"n":"小海狮","t":["water"],"s":[65,45,55,45,70,45],"l":[[1,"headbutt"],[3,"growl"],[7,"charm"],[7,"water-gun"],[7,"water-sport"],[11,"icy-wind"],[13,"encore"],[15,"bubble-beam"],[15,"chilling-water"],[15,"water-pulse"],[17,"ice-shard"],[21,"rest"],[23,"aqua-ring"],[27,"aurora-beam"],[31,"aqua-jet"],[32,"waterfall"],[33,"brine"],[37,"take-down"],[41,"dive"],[43,"aqua-tail"],[47,"ice-beam"],[50,"double-edge"],[51,"safeguard"],[53,"hail"],[53,"snowscape"],[65,"hydro-pump"]],"g":false,"m":false},"87":{"n":"白海狮","t":["water","ice"],"s":[90,70,80,70,95,70],"l":[[0,"sheer-cold"],[1,"headbutt"],[3,"growl"],[7,"charm"],[7,"signal-beam"],[7,"water-gun"],[7,"water-sport"],[11,"icy-wind"],[13,"encore"],[15,"avalanche"],[15,"bubble-beam"],[15,"chilling-water"],[15,"water-pulse"],[17,"ice-shard"],[21,"rest"],[23,"aqua-ring"],[27,"aurora-beam"],[30,"ice-spinner"],[30,"icicle-spear"],[30,"waterfall"],[31,"aqua-jet"],[33,"brine"],[39,"take-down"],[45,"dive"],[49,"aqua-tail"],[50,"double-edge"],[53,"hail"],[55,"ice-beam"],[61,"safeguard"],[65,"blizzard"],[65,"hydro-pump"],[65,"snowscape"],[85,"triple-axel"]],"g":false,"m":false},"88":{"n":"臭泥","t":["poison"],"s":[80,80,50,40,50,25],"l":[[1,"poison-gas"],[1,"pound"],[4,"harden"],[7,"mud-slap"],[12,"disable"],[15,"sludge"],[18,"mud-bomb"],[18,"mud-shot"],[21,"minimize"],[26,"fling"],[26,"toxic"],[29,"sludge-bomb"],[30,"poison-jab"],[32,"sludge-wave"],[37,"screech"],[40,"gunk-shot"],[43,"acid-armor"],[46,"belch"],[48,"memento"]],"g":false,"m":false},"89":{"n":"臭臭泥","t":["poison"],"s":[105,105,75,65,100,50],"l":[[0,"venom-drench"],[1,"poison-gas"],[1,"pound"],[4,"harden"],[7,"mud-slap"],[12,"disable"],[15,"sludge"],[18,"mud-bomb"],[18,"mud-shot"],[21,"minimize"],[26,"fling"],[26,"toxic"],[29,"sludge-bomb"],[30,"poison-jab"],[32,"sludge-wave"],[37,"screech"],[40,"gunk-shot"],[46,"acid-armor"],[52,"belch"],[57,"memento"]],"g":false,"m":false},"90":{"n":"大舌贝","t":["water"],"s":[30,65,100,45,25,40],"l":[[1,"tackle"],[1,"water-gun"],[4,"withdraw"],[8,"ice-shard"],[12,"leer"],[13,"icicle-spear"],[15,"bubble-beam"],[15,"chilling-water"],[15,"water-pulse"],[16,"whirlpool"],[20,"supersonic"],[22,"clamp"],[24,"aurora-beam"],[28,"protect"],[30,"waterfall"],[32,"razor-shell"],[36,"iron-defense"],[40,"ice-beam"],[44,"shell-smash"],[45,"liquidation"],[48,"hydro-pump"]],"g":false,"m":false},"91":{"n":"刺甲贝","t":["water","ice"],"s":[50,95,180,85,45,70],"l":[[0,"icicle-spear"],[0,"spike-cannon"],[1,"tackle"],[1,"water-gun"],[4,"withdraw"],[5,"razor-shell"],[8,"ice-shard"],[12,"leer"],[15,"bubble-beam"],[15,"chilling-water"],[15,"water-pulse"],[16,"whirlpool"],[20,"supersonic"],[22,"clamp"],[24,"aurora-beam"],[28,"protect"],[28,"spikes"],[30,"ice-spinner"],[30,"waterfall"],[36,"iron-defense"],[40,"ice-beam"],[44,"shell-smash"],[45,"liquidation"],[48,"hydro-pump"],[50,"icicle-crash"],[65,"blizzard"]],"g":false,"m":false},"92":{"n":"鬼斯","t":["ghost","poison"],"s":[30,35,30,100,35,80],"l":[[1,"confuse-ray"],[1,"lick"],[1,"smog"],[4,"hypnosis"],[7,"poison-gas"],[8,"mean-look"],[12,"payback"],[14,"will-o-wisp"],[15,"acid-spray"],[15,"venoshock"],[16,"spite"],[20,"curse"],[21,"toxic"],[24,"hex"],[28,"night-shade"],[32,"sucker-punch"],[36,"dark-pulse"],[40,"shadow-ball"],[44,"destiny-bond"],[45,"sludge-bomb"],[45,"sludge-wave"],[47,"nightmare"],[48,"dream-eater"]],"g":false,"m":false},"93":{"n":"鬼斯通","t":["ghost","poison"],"s":[45,50,45,115,55,95],"l":[[0,"shadow-punch"],[1,"confuse-ray"],[1,"lick"],[1,"smog"],[4,"hypnosis"],[7,"poison-gas"],[8,"mean-look"],[12,"payback"],[14,"will-o-wisp"],[15,"acid-spray"],[15,"venoshock"],[16,"spite"],[20,"curse"],[21,"toxic"],[24,"hex"],[30,"night-shade"],[36,"sucker-punch"],[42,"dark-pulse"],[45,"sludge-bomb"],[45,"sludge-wave"],[47,"nightmare"],[48,"shadow-ball"],[54,"destiny-bond"],[60,"dream-eater"]],"g":false,"m":false},"94":{"n":"耿鬼","t":["ghost","poison"],"s":[60,65,60,130,75,110],"l":[[0,"shadow-punch"],[1,"confuse-ray"],[1,"lick"],[1,"smog"],[4,"hypnosis"],[7,"poison-gas"],[8,"mean-look"],[12,"payback"],[14,"will-o-wisp"],[15,"acid-spray"],[15,"venoshock"],[16,"spite"],[20,"curse"],[21,"toxic"],[24,"hex"],[30,"night-shade"],[36,"sucker-punch"],[42,"dark-pulse"],[45,"sludge-bomb"],[45,"sludge-wave"],[47,"nightmare"],[48,"shadow-ball"],[54,"destiny-bond"],[60,"dream-eater"]],"g":false,"m":false},"95":{"n":"大岩蛇","t":["rock","ground"],"s":[35,45,160,30,45,70],"l":[[1,"bind"],[1,"harden"],[1,"mud-sport"],[1,"rock-throw"],[1,"tackle"],[4,"smack-down"],[8,"rock-polish"],[10,"rock-tomb"],[12,"dragon-breath"],[15,"bulldoze"],[15,"mud-slap"],[16,"curse"],[20,"gyro-ball"],[20,"rock-slide"],[24,"screech"],[28,"sand-tomb"],[30,"drill-run"],[30,"rock-blast"],[30,"stomping-tantrum"],[32,"stealth-rock"],[35,"earthquake"],[36,"slam"],[40,"sandstorm"],[44,"dig"],[48,"iron-tail"],[52,"stone-edge"],[56,"double-edge"]],"g":false,"m":false},"96":{"n":"催眠貘","t":["psychic"],"s":[60,48,45,43,90,42],"l":[[1,"hypnosis"],[1,"pound"],[5,"disable"],[9,"confusion"],[13,"headbutt"],[17,"poison-gas"],[18,"meditate"],[21,"psybeam"],[25,"psych-up"],[29,"mind-reader"],[29,"wake-up-slap"],[29,"zen-headbutt"],[33,"swagger"],[37,"psychic"],[37,"synchronoise"],[40,"dream-eater"],[41,"nasty-plot"],[45,"psyshock"],[49,"future-sight"]],"g":false,"m":false},"97":{"n":"引梦貘人","t":["psychic"],"s":[85,73,70,73,115,67],"l":[[1,"hypnosis"],[1,"pound"],[5,"disable"],[9,"confusion"],[13,"headbutt"],[17,"poison-gas"],[18,"meditate"],[21,"psybeam"],[25,"psych-up"],[29,"mind-reader"],[29,"wake-up-slap"],[32,"zen-headbutt"],[37,"swagger"],[37,"synchronoise"],[40,"dream-eater"],[42,"psychic"],[47,"nasty-plot"],[51,"psyshock"],[56,"future-sight"]],"g":false,"m":false},"98":{"n":"大钳蟹","t":["water"],"s":[30,105,90,25,25,50],"l":[[1,"leer"],[1,"mud-sport"],[1,"water-gun"],[4,"harden"],[5,"vice-grip"],[8,"metal-claw"],[12,"mud-shot"],[15,"brine"],[15,"water-pulse"],[16,"protect"],[20,"bubble-beam"],[24,"stomp"],[29,"flail"],[30,"dive"],[32,"razor-shell"],[36,"slam"],[40,"swords-dance"],[44,"crabhammer"],[48,"guillotine"]],"g":false,"m":false},"99":{"n":"巨钳蟹","t":["water"],"s":[55,130,115,50,50,75],"l":[[1,"leer"],[1,"mud-sport"],[1,"water-gun"],[4,"harden"],[5,"vice-grip"],[8,"metal-claw"],[12,"mud-shot"],[15,"brine"],[15,"water-pulse"],[16,"protect"],[20,"bubble-beam"],[24,"stomp"],[30,"dive"],[31,"flail"],[36,"razor-shell"],[42,"slam"],[48,"swords-dance"],[54,"crabhammer"],[60,"guillotine"]],"g":false,"m":false},"100":{"n":"霹雳电球","t":["electric"],"s":[40,30,50,55,55,100],"l":[[1,"charge"],[1,"tackle"],[4,"thunder-shock"],[6,"eerie-impulse"],[6,"sonic-boom"],[9,"spark"],[11,"rollout"],[13,"screech"],[15,"electroweb"],[15,"shock-wave"],[16,"charge-beam"],[20,"swift"],[22,"electro-ball"],[26,"self-destruct"],[29,"light-screen"],[30,"volt-switch"],[31,"thunderbolt"],[34,"magnet-rise"],[37,"discharge"],[41,"explosion"],[46,"gyro-ball"],[50,"mirror-coat"],[65,"thunder"],[85,"zap-cannon"]],"g":false,"m":false},"101":{"n":"顽皮雷弹","t":["electric"],"s":[60,50,70,80,80,150],"l":[[1,"charge"],[1,"tackle"],[4,"thunder-shock"],[6,"eerie-impulse"],[6,"sonic-boom"],[9,"spark"],[11,"rollout"],[13,"screech"],[15,"electroweb"],[15,"shock-wave"],[16,"charge-beam"],[20,"swift"],[22,"electro-ball"],[26,"self-destruct"],[29,"light-screen"],[30,"volt-switch"],[31,"thunderbolt"],[36,"magnet-rise"],[41,"discharge"],[47,"explosion"],[54,"gyro-ball"],[58,"mirror-coat"],[65,"thunder"],[85,"zap-cannon"]],"g":false,"m":false},"102":{"n":"蛋蛋","t":["grass","psychic"],"s":[60,40,80,60,45,40],"l":[[1,"absorb"],[1,"barrage"],[1,"hypnosis"],[5,"reflect"],[10,"leech-seed"],[15,"grass-knot"],[15,"mega-drain"],[15,"psywave"],[15,"stored-power"],[16,"stun-spore"],[18,"poison-powder"],[20,"confusion"],[20,"sleep-powder"],[25,"synthesis"],[27,"psybeam"],[30,"bullet-seed"],[30,"psychic-noise"],[30,"psyshock"],[35,"giga-drain"],[37,"natural-gift"],[40,"extrasensory"],[45,"energy-ball"],[45,"uproar"],[47,"psychic"],[50,"bestow"],[50,"worry-seed"],[55,"solar-beam"],[85,"leaf-storm"]],"g":false,"m":false},"103":{"n":"椰蛋树","t":["grass","psychic"],"s":[95,95,85,125,75,55],"l":[[0,"stomp"],[1,"absorb"],[1,"barrage"],[1,"hypnosis"],[5,"reflect"],[10,"leech-seed"],[15,"grass-knot"],[15,"mega-drain"],[15,"psybeam"],[15,"psywave"],[15,"stored-power"],[16,"stun-spore"],[18,"poison-powder"],[20,"confusion"],[20,"sleep-powder"],[25,"synthesis"],[27,"egg-bomb"],[30,"bullet-seed"],[30,"giga-drain"],[30,"psychic-noise"],[30,"psyshock"],[37,"natural-gift"],[37,"wood-hammer"],[40,"extrasensory"],[45,"energy-ball"],[45,"psychic"],[45,"uproar"],[50,"bestow"],[50,"worry-seed"],[55,"solar-beam"],[85,"future-sight"],[85,"leaf-storm"]],"g":false,"m":false},"104":{"n":"卡拉卡拉","t":["ground"],"s":[50,50,95,40,50,35],"l":[[1,"growl"],[1,"mud-slap"],[4,"tail-whip"],[6,"leer"],[8,"false-swipe"],[12,"bone-club"],[12,"headbutt"],[16,"retaliate"],[20,"fling"],[24,"stomping-tantrum"],[29,"bone-rush"],[30,"dig"],[32,"focus-energy"],[36,"endeavor"],[40,"bonemerang"],[44,"thrash"],[48,"double-edge"]],"g":false,"m":false},"105":{"n":"嘎啦嘎啦","t":["ground"],"s":[60,80,110,50,80,45],"l":[[0,"swords-dance"],[1,"growl"],[1,"mud-slap"],[4,"tail-whip"],[6,"leer"],[8,"false-swipe"],[12,"bone-club"],[12,"headbutt"],[16,"retaliate"],[20,"fling"],[24,"stomping-tantrum"],[30,"dig"],[31,"bone-rush"],[36,"focus-energy"],[42,"endeavor"],[48,"bonemerang"],[54,"thrash"],[60,"double-edge"]],"g":false,"m":false},"106":{"n":"飞腿郎","t":["fighting"],"s":[50,120,53,35,110,87],"l":[[0,"brick-break"],[1,"fake-out"],[1,"focus-energy"],[1,"foresight"],[1,"helping-hand"],[1,"tackle"],[4,"double-kick"],[5,"meditate"],[8,"low-kick"],[12,"endure"],[15,"low-sweep"],[15,"rock-smash"],[16,"sucker-punch"],[21,"wide-guard"],[24,"blaze-kick"],[25,"facade"],[28,"feint"],[28,"mind-reader"],[30,"jump-kick"],[32,"mega-kick"],[36,"close-combat"],[40,"reversal"],[44,"high-jump-kick"],[50,"axe-kick"]],"g":false,"m":false},"107":{"n":"快拳郎","t":["fighting"],"s":[50,105,79,35,110,76],"l":[[0,"comet-punch"],[0,"drain-punch"],[1,"fake-out"],[1,"focus-energy"],[1,"foresight"],[1,"helping-hand"],[1,"tackle"],[4,"mach-punch"],[5,"leer"],[8,"vacuum-wave"],[11,"pursuit"],[12,"detect"],[15,"low-kick"],[15,"low-sweep"],[15,"rock-smash"],[16,"bullet-punch"],[21,"quick-guard"],[24,"fire-punch"],[24,"ice-punch"],[24,"thunder-punch"],[25,"dizzy-punch"],[28,"agility"],[30,"brick-break"],[30,"submission"],[32,"mega-punch"],[36,"close-combat"],[40,"counter"],[44,"focus-punch"]],"g":false,"m":false},"108":{"n":"大舌头","t":["normal"],"s":[90,55,75,60,75,30],"l":[[1,"defense-curl"],[1,"lick"],[6,"rollout"],[10,"acid"],[12,"supersonic"],[15,"cut"],[15,"hidden-power"],[15,"rage"],[18,"wrap"],[24,"disable"],[30,"headbutt"],[30,"mega-punch"],[30,"stomp"],[36,"knock-off"],[37,"chip-away"],[40,"thrash"],[41,"me-first"],[42,"screech"],[45,"refresh"],[48,"slam"],[54,"power-whip"],[57,"wring-out"],[60,"belly-drum"],[85,"skull-bash"]],"g":false,"m":false},"109":{"n":"瓦斯弹","t":["poison"],"s":[40,65,95,60,45,35],"l":[[1,"poison-gas"],[1,"tackle"],[4,"smog"],[8,"smokescreen"],[12,"clear-smog"],[15,"venoshock"],[16,"assurance"],[20,"sludge"],[24,"haze"],[28,"self-destruct"],[29,"gyro-ball"],[32,"sludge-bomb"],[36,"toxic"],[40,"belch"],[44,"explosion"],[45,"sludge-wave"],[48,"memento"],[52,"destiny-bond"],[85,"gunk-shot"]],"g":false,"m":false},"110":{"n":"双弹瓦斯","t":["poison"],"s":[65,90,120,85,70,60],"l":[[0,"double-hit"],[1,"poison-gas"],[1,"tackle"],[4,"smog"],[8,"smokescreen"],[12,"clear-smog"],[15,"venoshock"],[16,"assurance"],[20,"sludge"],[24,"haze"],[28,"self-destruct"],[29,"gyro-ball"],[32,"sludge-bomb"],[38,"toxic"],[44,"belch"],[45,"sludge-wave"],[50,"explosion"],[56,"memento"],[62,"destiny-bond"],[85,"gunk-shot"]],"g":false,"m":false},"111":{"n":"独角犀牛","t":["ground","rock"],"s":[80,85,95,30,30,25],"l":[[1,"sand-attack"],[1,"tackle"],[1,"tail-whip"],[5,"smack-down"],[7,"fury-attack"],[10,"bulldoze"],[15,"horn-attack"],[15,"rock-tomb"],[20,"scary-face"],[25,"chip-away"],[25,"stomp"],[30,"dig"],[30,"rock-blast"],[30,"stomping-tantrum"],[35,"drill-run"],[40,"take-down"],[45,"earthquake"],[50,"leer"],[50,"stone-edge"],[55,"megahorn"],[60,"horn-drill"]],"g":false,"m":false},"112":{"n":"钻角犀兽","t":["ground","rock"],"s":[105,130,120,45,45,40],"l":[[0,"hammer-arm"],[1,"sand-attack"],[1,"tackle"],[1,"tail-whip"],[5,"smack-down"],[7,"fury-attack"],[10,"bulldoze"],[15,"horn-attack"],[15,"rock-tomb"],[20,"scary-face"],[25,"chip-away"],[25,"stomp"],[30,"dig"],[30,"rock-blast"],[30,"stomping-tantrum"],[35,"drill-run"],[40,"take-down"],[47,"earthquake"],[50,"leer"],[54,"stone-edge"],[61,"megahorn"],[68,"horn-drill"]],"g":false,"m":false},"113":{"n":"吉利蛋","t":["normal"],"s":[250,5,5,35,105,50],"l":[[1,"charm"],[1,"copycat"],[1,"covet"],[1,"defense-curl"],[1,"disarming-voice"],[1,"minimize"],[1,"pound"],[1,"sweet-kiss"],[4,"tail-whip"],[5,"growl"],[8,"echoed-voice"],[9,"refresh"],[12,"life-dew"],[15,"hidden-power"],[16,"sing"],[20,"bestow"],[20,"fling"],[24,"take-down"],[28,"heal-pulse"],[30,"tera-blast"],[32,"helping-hand"],[36,"light-screen"],[40,"double-edge"],[44,"soft-boiled"],[45,"uproar"],[48,"last-resort"],[52,"healing-wish"]],"g":false,"m":false},"114":{"n":"蔓藤怪","t":["grass"],"s":[65,55,115,100,40,60],"l":[[1,"absorb"],[1,"bind"],[4,"stun-spore"],[8,"growth"],[10,"confusion"],[12,"mega-drain"],[15,"grass-knot"],[16,"vine-whip"],[20,"poison-powder"],[24,"ancient-power"],[28,"knock-off"],[32,"giga-drain"],[33,"natural-gift"],[36,"sleep-powder"],[39,"leech-seed"],[40,"slam"],[44,"tickle"],[45,"energy-ball"],[46,"wring-out"],[48,"power-whip"],[49,"amnesia"],[52,"ingrain"],[56,"grassy-terrain"],[85,"leaf-storm"],[85,"solar-beam"]],"g":false,"m":false},"115":{"n":"袋兽","t":["normal"],"s":[105,95,80,40,80,90],"l":[[1,"comet-punch"],[1,"leer"],[1,"pound"],[1,"tail-whip"],[4,"growl"],[8,"fake-out"],[12,"bite"],[16,"stomp"],[20,"focus-energy"],[24,"headbutt"],[28,"mega-punch"],[28,"sucker-punch"],[32,"double-hit"],[36,"crunch"],[40,"endure"],[44,"reversal"],[45,"body-slam"],[45,"take-down"],[48,"outrage"],[52,"last-resort"],[85,"mega-kick"],[85,"skull-bash"]],"g":false,"m":false},"116":{"n":"墨海马","t":["water"],"s":[30,40,70,70,25,60],"l":[[1,"leer"],[1,"water-gun"],[5,"smokescreen"],[10,"twister"],[15,"brine"],[15,"chilling-water"],[15,"focus-energy"],[20,"dragon-breath"],[25,"bubble-beam"],[30,"agility"],[30,"scald"],[35,"laser-focus"],[35,"water-pulse"],[40,"dragon-pulse"],[45,"hydro-pump"],[50,"dragon-dance"],[55,"rain-dance"]],"g":false,"m":false},"117":{"n":"海刺龙","t":["water"],"s":[55,65,95,95,45,85],"l":[[1,"leer"],[1,"water-gun"],[5,"smokescreen"],[10,"twister"],[15,"brine"],[15,"chilling-water"],[15,"focus-energy"],[20,"dragon-breath"],[25,"bubble-beam"],[30,"agility"],[30,"scald"],[35,"laser-focus"],[37,"water-pulse"],[44,"dragon-pulse"],[51,"hydro-pump"],[58,"dragon-dance"],[65,"rain-dance"]],"g":false,"m":false},"118":{"n":"角金鱼","t":["water"],"s":[45,67,60,35,50,63],"l":[[1,"peck"],[1,"tail-whip"],[1,"water-sport"],[5,"supersonic"],[10,"quick-attack"],[10,"water-pulse"],[15,"bubble-beam"],[15,"horn-attack"],[20,"agility"],[25,"aqua-ring"],[30,"dive"],[30,"flail"],[35,"waterfall"],[40,"soak"],[45,"megahorn"],[50,"horn-drill"]],"g":false,"m":false},"119":{"n":"金鱼王","t":["water"],"s":[80,92,65,65,80,68],"l":[[1,"peck"],[1,"tail-whip"],[1,"water-sport"],[5,"supersonic"],[10,"quick-attack"],[10,"water-pulse"],[15,"bubble-beam"],[15,"horn-attack"],[20,"agility"],[25,"aqua-ring"],[30,"dive"],[30,"flail"],[37,"waterfall"],[44,"soak"],[51,"megahorn"],[58,"horn-drill"]],"g":false,"m":false},"120":{"n":"海星星","t":["water"],"s":[30,45,55,70,55,85],"l":[[1,"harden"],[1,"tackle"],[4,"psywave"],[4,"water-gun"],[8,"confuse-ray"],[12,"rapid-spin"],[15,"water-pulse"],[16,"minimize"],[20,"swift"],[22,"camouflage"],[24,"gyro-ball"],[24,"psybeam"],[27,"bubble-beam"],[28,"brine"],[30,"scald"],[32,"light-screen"],[35,"reflect-type"],[36,"power-gem"],[40,"psychic"],[44,"surf"],[48,"recover"],[52,"cosmic-power"],[56,"hydro-pump"]],"g":false,"m":false},"121":{"n":"宝石海星","t":["water","psychic"],"s":[60,75,85,100,85,115],"l":[[1,"harden"],[1,"tackle"],[4,"psywave"],[4,"water-gun"],[8,"confuse-ray"],[12,"rapid-spin"],[15,"bubble-beam"],[15,"water-pulse"],[16,"minimize"],[20,"swift"],[22,"camouflage"],[24,"gyro-ball"],[24,"psybeam"],[28,"brine"],[30,"psyshock"],[30,"scald"],[32,"light-screen"],[35,"reflect-type"],[36,"power-gem"],[40,"psychic"],[44,"surf"],[48,"recover"],[52,"cosmic-power"],[56,"hydro-pump"]],"g":false,"m":false},"122":{"n":"魔墙人偶","t":["psychic","fairy"],"s":[40,45,65,100,120,90],"l":[[1,"barrier"],[1,"baton-pass"],[1,"copycat"],[1,"encore"],[1,"guard-swap"],[1,"pound"],[1,"power-swap"],[1,"quick-guard"],[1,"tickle"],[1,"wide-guard"],[8,"meditate"],[11,"double-slap"],[12,"confusion"],[16,"role-play"],[20,"protect"],[22,"magical-leaf"],[24,"recycle"],[28,"psybeam"],[29,"substitute"],[30,"psyshock"],[32,"mimic"],[36,"light-screen"],[36,"reflect"],[36,"safeguard"],[36,"trick"],[40,"sucker-punch"],[44,"dazzling-gleam"],[48,"psychic"],[52,"teeter-dance"],[85,"future-sight"]],"g":false,"m":false},"123":{"n":"飞天螳螂","t":["bug","flying"],"s":[70,110,80,55,80,105],"l":[[1,"leer"],[1,"quick-attack"],[1,"vacuum-wave"],[4,"fury-cutter"],[8,"false-swipe"],[9,"pursuit"],[12,"wing-attack"],[15,"bug-bite"],[15,"pounce"],[16,"double-team"],[20,"double-hit"],[24,"slash"],[28,"focus-energy"],[30,"dual-wingbeat"],[30,"lunge"],[30,"u-turn"],[32,"agility"],[36,"air-slash"],[40,"x-scissor"],[44,"laser-focus"],[44,"swords-dance"],[45,"night-slash"]],"g":false,"m":false},"124":{"n":"迷唇姐","t":["ice","psychic"],"s":[65,50,35,115,95,95],"l":[[1,"lick"],[1,"pound"],[4,"powder-snow"],[8,"copycat"],[12,"confusion"],[15,"frost-breath"],[15,"icy-wind"],[16,"covet"],[18,"screech"],[20,"sing"],[24,"fake-tears"],[28,"ice-punch"],[30,"body-slam"],[30,"psyshock"],[31,"lucky-chant"],[33,"wake-up-slap"],[34,"psychic"],[36,"sweet-kiss"],[40,"lovely-kiss"],[45,"ice-beam"],[46,"mean-look"],[47,"thrash"],[49,"wring-out"],[52,"perish-song"],[58,"blizzard"],[85,"future-sight"]],"g":false,"m":false},"125":{"n":"电击兽","t":["electric"],"s":[65,83,57,95,85,105],"l":[[1,"leer"],[1,"quick-attack"],[4,"thunder-shock"],[8,"charge"],[12,"swift"],[15,"charge-beam"],[15,"electro-ball"],[15,"electroweb"],[16,"shock-wave"],[20,"thunder-wave"],[24,"screech"],[28,"thunder-punch"],[30,"volt-switch"],[34,"discharge"],[40,"low-kick"],[46,"thunderbolt"],[52,"light-screen"],[58,"thunder"],[64,"giga-impact"],[85,"zap-cannon"]],"g":false,"m":false},"126":{"n":"鸭嘴火兽","t":["fire"],"s":[65,95,57,100,85,93],"l":[[1,"leer"],[1,"smog"],[4,"ember"],[8,"smokescreen"],[12,"clear-smog"],[12,"feint-attack"],[15,"flame-charge"],[15,"incinerate"],[16,"flame-wheel"],[20,"confuse-ray"],[22,"flame-burst"],[24,"scary-face"],[28,"fire-punch"],[34,"lava-plume"],[40,"low-kick"],[45,"heat-wave"],[46,"flamethrower"],[52,"sunny-day"],[58,"fire-blast"],[64,"hyper-beam"],[85,"flare-blitz"],[85,"overheat"]],"g":false,"m":false},"127":{"n":"凯罗斯","t":["bug"],"s":[65,125,100,55,70,85],"l":[[1,"harden"],[1,"vice-grip"],[4,"focus-energy"],[8,"bind"],[12,"seismic-toss"],[15,"fury-cutter"],[16,"brick-break"],[16,"bug-bite"],[20,"storm-throw"],[24,"double-hit"],[28,"vital-throw"],[32,"x-scissor"],[36,"strength"],[38,"thrash"],[40,"swords-dance"],[44,"submission"],[48,"guillotine"],[52,"superpower"]],"g":false,"m":false},"128":{"n":"肯泰罗","t":["normal"],"s":[75,100,95,40,70,110],"l":[[1,"tackle"],[1,"tail-whip"],[5,"work-up"],[10,"payback"],[15,"assurance"],[20,"horn-attack"],[24,"leer"],[25,"scary-face"],[30,"headbutt"],[30,"strength"],[30,"zen-headbutt"],[35,"raging-bull"],[38,"focus-energy"],[40,"rest"],[45,"swagger"],[50,"outrage"],[50,"thrash"],[55,"double-edge"],[60,"giga-impact"]],"g":false,"m":false},"129":{"n":"鲤鱼王","t":["water"],"s":[20,10,55,15,20,80],"l":[[1,"splash"],[15,"tackle"],[25,"flail"],[65,"hydro-pump"]],"g":false,"m":false},"130":{"n":"暴鲤龙","t":["water","flying"],"s":[95,125,79,60,100,81],"l":[[0,"bite"],[1,"splash"],[4,"whirlpool"],[6,"leer"],[8,"ice-fang"],[11,"dragon-rage"],[12,"brine"],[15,"tackle"],[16,"scary-face"],[21,"waterfall"],[24,"crunch"],[25,"flail"],[26,"dragon-tail"],[28,"rain-dance"],[32,"aqua-tail"],[36,"dragon-dance"],[40,"hydro-pump"],[41,"outrage"],[44,"hurricane"],[45,"bounce"],[48,"thrash"],[52,"hyper-beam"]],"g":false,"m":false},"131":{"n":"拉普拉斯","t":["water","ice"],"s":[130,85,80,85,95,60],"l":[[1,"growl"],[1,"water-gun"],[5,"sing"],[10,"mist"],[15,"avalanche"],[15,"bubble-beam"],[15,"chilling-water"],[15,"icy-wind"],[15,"life-dew"],[20,"ice-shard"],[25,"confuse-ray"],[30,"icicle-spear"],[30,"water-pulse"],[30,"waterfall"],[35,"brine"],[40,"body-slam"],[43,"safeguard"],[45,"ice-beam"],[45,"surf"],[50,"rain-dance"],[52,"dragon-pulse"],[55,"hydro-pump"],[58,"blizzard"],[60,"perish-song"],[65,"sheer-cold"]],"g":false,"m":false},"132":{"n":"百变怪","t":["normal"],"s":[48,48,48,48,48,48],"l":[[1,"transform"]],"g":false,"m":false},"133":{"n":"伊布","t":["normal"],"s":[55,55,50,45,65,55],"l":[[1,"covet"],[1,"growl"],[1,"helping-hand"],[1,"tackle"],[1,"tail-whip"],[5,"sand-attack"],[10,"double-kick"],[10,"quick-attack"],[15,"baby-doll-eyes"],[20,"refresh"],[20,"swift"],[25,"bite"],[30,"copycat"],[30,"headbutt"],[35,"baton-pass"],[36,"focus-energy"],[40,"take-down"],[45,"charm"],[45,"trump-card"],[50,"double-edge"],[55,"last-resort"],[85,"skull-bash"]],"g":false,"m":false},"134":{"n":"水伊布","t":["water"],"s":[130,65,60,110,95,65],"l":[[0,"water-gun"],[1,"covet"],[1,"growl"],[1,"helping-hand"],[1,"tackle"],[1,"tail-whip"],[5,"sand-attack"],[10,"double-kick"],[10,"quick-attack"],[15,"baby-doll-eyes"],[15,"bubble-beam"],[15,"chilling-water"],[20,"haze"],[20,"refresh"],[20,"swift"],[25,"bite"],[25,"water-pulse"],[30,"aurora-beam"],[30,"copycat"],[30,"headbutt"],[30,"scald"],[35,"aqua-ring"],[35,"baton-pass"],[36,"focus-energy"],[40,"muddy-water"],[40,"take-down"],[42,"mist"],[45,"acid-armor"],[45,"charm"],[45,"trump-card"],[50,"double-edge"],[50,"hydro-pump"],[55,"last-resort"],[85,"skull-bash"]],"g":false,"m":false},"135":{"n":"雷伊布","t":["electric"],"s":[65,65,60,110,95,130],"l":[[0,"thunder-shock"],[1,"covet"],[1,"growl"],[1,"helping-hand"],[1,"tackle"],[1,"tail-whip"],[5,"sand-attack"],[10,"quick-attack"],[15,"baby-doll-eyes"],[15,"charge-beam"],[15,"electroweb"],[15,"shock-wave"],[20,"refresh"],[20,"swift"],[20,"thunder-wave"],[25,"bite"],[25,"double-kick"],[30,"copycat"],[30,"headbutt"],[30,"thunder-fang"],[30,"volt-switch"],[35,"baton-pass"],[35,"pin-missile"],[36,"focus-energy"],[40,"discharge"],[40,"take-down"],[45,"agility"],[45,"charm"],[45,"thunderbolt"],[45,"trump-card"],[50,"double-edge"],[50,"thunder"],[55,"last-resort"],[85,"skull-bash"],[85,"zap-cannon"]],"g":false,"m":false},"136":{"n":"火伊布","t":["fire"],"s":[65,130,60,95,110,65],"l":[[0,"ember"],[1,"covet"],[1,"growl"],[1,"helping-hand"],[1,"tackle"],[1,"tail-whip"],[5,"sand-attack"],[10,"double-kick"],[10,"quick-attack"],[15,"baby-doll-eyes"],[15,"flame-charge"],[20,"refresh"],[20,"smog"],[20,"swift"],[25,"bite"],[30,"copycat"],[30,"fire-fang"],[30,"headbutt"],[30,"temper-flare"],[35,"baton-pass"],[35,"fire-spin"],[36,"focus-energy"],[40,"lava-plume"],[40,"take-down"],[45,"charm"],[45,"fire-blast"],[45,"scary-face"],[45,"trump-card"],[47,"leer"],[50,"double-edge"],[50,"flare-blitz"],[55,"last-resort"],[85,"skull-bash"]],"g":false,"m":false},"137":{"n":"多边兽","t":["normal"],"s":[65,60,70,85,75,40],"l":[[1,"conversion"],[1,"tackle"],[4,"sharpen"],[5,"recycle"],[10,"magnet-rise"],[15,"swift"],[15,"thunder-shock"],[18,"barrier"],[20,"psybeam"],[25,"conversion-2"],[27,"thunder-wave"],[29,"signal-beam"],[30,"agility"],[30,"tera-blast"],[35,"recover"],[40,"discharge"],[40,"hyper-beam"],[45,"tri-attack"],[50,"double-edge"],[50,"magic-coat"],[55,"lock-on"],[60,"zap-cannon"]],"g":false,"m":false},"138":{"n":"菊石兽","t":["rock","water"],"s":[35,40,100,90,55,35],"l":[[1,"bind"],[1,"withdraw"],[5,"rollout"],[10,"sand-attack"],[15,"bubble-beam"],[15,"rock-tomb"],[15,"smack-down"],[15,"water-gun"],[15,"water-pulse"],[20,"leer"],[22,"bite"],[25,"mud-shot"],[26,"rock-throw"],[30,"ancient-power"],[30,"scald"],[34,"horn-attack"],[35,"brine"],[41,"protect"],[43,"tickle"],[45,"muddy-water"],[45,"rock-blast"],[50,"surf"],[55,"shell-smash"],[60,"hydro-pump"]],"g":false,"m":false},"139":{"n":"多刺菊石兽","t":["rock","water"],"s":[70,60,125,115,70,55],"l":[[0,"crunch"],[0,"spike-cannon"],[1,"bind"],[1,"withdraw"],[5,"rollout"],[10,"sand-attack"],[15,"bubble-beam"],[15,"rock-tomb"],[15,"smack-down"],[15,"water-gun"],[15,"water-pulse"],[20,"leer"],[22,"bite"],[25,"mud-shot"],[26,"rock-throw"],[30,"ancient-power"],[30,"scald"],[34,"horn-attack"],[35,"brine"],[43,"protect"],[43,"tickle"],[45,"muddy-water"],[49,"rock-blast"],[56,"surf"],[63,"shell-smash"],[70,"hydro-pump"]],"g":false,"m":false},"140":{"n":"化石盔","t":["rock","water"],"s":[30,80,90,55,45,55],"l":[[1,"absorb"],[1,"harden"],[5,"scratch"],[10,"sand-attack"],[15,"aqua-jet"],[15,"bubble-beam"],[15,"rock-tomb"],[15,"rollout"],[15,"smack-down"],[15,"water-pulse"],[20,"leer"],[25,"mud-shot"],[26,"endure"],[30,"ancient-power"],[30,"rock-blast"],[30,"rock-throw"],[30,"waterfall"],[35,"brine"],[36,"mega-drain"],[39,"slash"],[41,"protect"],[42,"rock-slide"],[45,"leech-life"],[49,"hydro-pump"],[50,"liquidation"],[50,"wring-out"],[55,"metal-sound"],[60,"stone-edge"]],"g":false,"m":false},"141":{"n":"镰刀盔","t":["rock","water"],"s":[60,115,105,65,70,80],"l":[[0,"slash"],[1,"absorb"],[1,"harden"],[5,"scratch"],[10,"sand-attack"],[15,"aqua-jet"],[15,"bubble-beam"],[15,"rock-tomb"],[15,"rollout"],[15,"smack-down"],[15,"water-pulse"],[20,"leer"],[25,"mud-shot"],[26,"endure"],[30,"ancient-power"],[30,"rock-blast"],[30,"rock-throw"],[30,"waterfall"],[35,"brine"],[36,"mega-drain"],[42,"rock-slide"],[43,"protect"],[49,"hydro-pump"],[49,"leech-life"],[50,"wring-out"],[56,"liquidation"],[63,"metal-sound"],[63,"swords-dance"],[70,"stone-edge"],[72,"night-slash"]],"g":false,"m":false},"142":{"n":"化石翼龙","t":["rock","flying"],"s":[80,105,65,60,75,130],"l":[[1,"ancient-power"],[1,"bite"],[1,"fire-fang"],[1,"ice-fang"],[1,"thunder-fang"],[5,"supersonic"],[10,"wing-attack"],[15,"rock-tomb"],[15,"scary-face"],[15,"smack-down"],[20,"rock-slide"],[25,"roar"],[30,"crunch"],[30,"rock-blast"],[35,"iron-head"],[40,"take-down"],[45,"stone-edge"],[49,"fly"],[50,"agility"],[55,"hyper-beam"],[60,"giga-impact"],[85,"sky-attack"]],"g":false,"m":false},"143":{"n":"卡比兽","t":["normal"],"s":[160,110,65,65,110,30],"l":[[1,"block"],[1,"covet"],[1,"defense-curl"],[1,"flail"],[1,"fling"],[1,"last-resort"],[1,"lick"],[1,"metronome"],[1,"odor-sleuth"],[1,"recycle"],[1,"screech"],[1,"stockpile"],[1,"swallow"],[1,"tackle"],[12,"yawn"],[16,"bite"],[17,"chip-away"],[20,"rest"],[20,"sleep-talk"],[20,"snore"],[24,"crunch"],[28,"body-slam"],[32,"heavy-slam"],[36,"amnesia"],[36,"rollout"],[40,"high-horsepower"],[41,"harden"],[44,"hammer-arm"],[45,"take-down"],[48,"belly-drum"],[48,"double-edge"],[49,"natural-gift"],[50,"snatch"],[52,"belch"],[56,"giga-impact"],[65,"superpower"],[85,"mega-kick"]],"g":false,"m":false},"144":{"n":"急冻鸟","t":["ice","flying"],"s":[90,85,100,95,125,85],"l":[[1,"gust"],[1,"mist"],[5,"powder-snow"],[10,"reflect"],[15,"air-cutter"],[15,"frost-breath"],[15,"ice-shard"],[15,"icy-wind"],[16,"leer"],[20,"agility"],[24,"mirror-coat"],[25,"ancient-power"],[30,"air-slash"],[30,"ice-spinner"],[30,"icicle-spear"],[30,"tailwind"],[35,"freeze-dry"],[40,"roost"],[45,"fly"],[45,"ice-beam"],[50,"hail"],[50,"snowscape"],[55,"hurricane"],[60,"haze"],[60,"mind-reader"],[65,"blizzard"],[70,"sheer-cold"],[72,"sky-attack"]],"g":true,"m":false},"145":{"n":"闪电鸟","t":["electric","flying"],"s":[90,90,85,125,90,100],"l":[[1,"peck"],[1,"thunder-wave"],[5,"thunder-shock"],[10,"light-screen"],[15,"air-cutter"],[15,"charge-beam"],[15,"pluck"],[15,"shock-wave"],[16,"leer"],[20,"agility"],[25,"ancient-power"],[30,"charge"],[30,"volt-switch"],[32,"thunderbolt"],[35,"drill-peck"],[40,"roost"],[45,"discharge"],[45,"fly"],[50,"rain-dance"],[55,"thunder"],[60,"detect"],[65,"hurricane"],[65,"magnetic-flux"],[70,"zap-cannon"],[72,"sky-attack"]],"g":true,"m":false},"146":{"n":"火焰鸟","t":["fire","flying"],"s":[90,100,90,125,85,90],"l":[[1,"gust"],[1,"leer"],[5,"ember"],[10,"safeguard"],[15,"air-cutter"],[15,"wing-attack"],[20,"agility"],[25,"ancient-power"],[30,"burning-jealousy"],[30,"dual-wingbeat"],[30,"incinerate"],[30,"mystical-fire"],[32,"flamethrower"],[35,"air-slash"],[40,"roost"],[45,"heat-wave"],[50,"sunny-day"],[55,"hurricane"],[60,"endure"],[64,"solar-beam"],[65,"overheat"],[70,"sky-attack"]],"g":true,"m":false},"147":{"n":"迷你龙","t":["dragon"],"s":[41,64,45,50,50,50],"l":[[1,"leer"],[1,"wrap"],[5,"twister"],[10,"thunder-wave"],[14,"dragon-rage"],[15,"dragon-tail"],[20,"agility"],[25,"slam"],[30,"scale-shot"],[31,"aqua-tail"],[35,"dragon-rush"],[40,"safeguard"],[45,"rain-dance"],[50,"dragon-dance"],[55,"outrage"],[60,"hyper-beam"]],"g":false,"m":false},"148":{"n":"哈克龙","t":["dragon"],"s":[61,84,65,70,70,70],"l":[[1,"leer"],[1,"wrap"],[5,"twister"],[10,"thunder-wave"],[14,"dragon-rage"],[15,"dragon-tail"],[20,"agility"],[25,"slam"],[30,"scale-shot"],[33,"aqua-tail"],[39,"dragon-rush"],[46,"safeguard"],[53,"rain-dance"],[60,"dragon-dance"],[67,"outrage"],[74,"hyper-beam"]],"g":false,"m":false},"149":{"n":"快龙","t":["dragon","flying"],"s":[91,134,95,100,100,80],"l":[[0,"hurricane"],[1,"leer"],[1,"wrap"],[5,"twister"],[10,"thunder-wave"],[14,"dragon-rage"],[15,"dragon-tail"],[20,"agility"],[25,"slam"],[30,"dragon-claw"],[30,"scale-shot"],[33,"aqua-tail"],[39,"dragon-rush"],[41,"outrage"],[45,"fly"],[46,"safeguard"],[53,"rain-dance"],[62,"dragon-dance"],[80,"hyper-beam"],[88,"roost"]],"g":false,"m":false},"150":{"n":"超梦","t":["psychic"],"s":[106,110,90,154,90,130],"l":[[1,"confuse-ray"],[1,"confusion"],[1,"disable"],[1,"laser-focus"],[1,"life-dew"],[1,"swift"],[1,"teleport"],[8,"ancient-power"],[16,"psycho-cut"],[22,"psybeam"],[22,"psych-up"],[24,"safeguard"],[29,"miracle-eye"],[30,"psychic-noise"],[30,"psyshock"],[32,"amnesia"],[40,"aura-sphere"],[48,"psychic"],[56,"guard-swap"],[56,"power-swap"],[64,"mist"],[72,"psystrike"],[77,"barrier"],[80,"recover"],[88,"agility"],[88,"future-sight"],[93,"me-first"],[99,"calm-mind"]],"g":true,"m":false},"151":{"n":"梦幻","t":["psychic"],"s":[100,100,100,100,100,100],"l":[[1,"confusion"],[1,"mimic"],[1,"pound"],[1,"reflect-type"],[10,"amnesia"],[11,"swift"],[15,"psybeam"],[20,"baton-pass"],[30,"ancient-power"],[30,"psychic-noise"],[30,"psycho-cut"],[30,"zen-headbutt"],[40,"life-dew"],[44,"barrier"],[45,"psychic-fangs"],[50,"nasty-plot"],[55,"mega-punch"],[60,"metronome"],[70,"imprison"],[70,"me-first"],[80,"transform"],[85,"future-sight"],[90,"aura-sphere"],[100,"psychic"]],"g":false,"m":true},"152":{"n":"菊草叶","t":["grass"],"s":[45,49,65,49,65,45],"l":[[1,"growl"],[1,"tackle"],[6,"razor-leaf"],[9,"poison-powder"],[12,"synthesis"],[15,"grass-knot"],[17,"reflect"],[20,"magical-leaf"],[23,"leech-seed"],[23,"natural-gift"],[23,"nature-power"],[28,"sweet-scent"],[30,"bullet-seed"],[30,"seed-bomb"],[31,"light-screen"],[34,"body-slam"],[39,"safeguard"],[42,"aromatherapy"],[42,"giga-drain"],[45,"solar-beam"],[85,"leaf-storm"],[85,"solar-blade"]],"g":false,"m":false},"153":{"n":"月桂叶","t":["grass"],"s":[60,62,80,63,80,60],"l":[[1,"growl"],[1,"tackle"],[6,"razor-leaf"],[9,"poison-powder"],[12,"synthesis"],[15,"grass-knot"],[18,"reflect"],[22,"magical-leaf"],[23,"natural-gift"],[23,"nature-power"],[26,"leech-seed"],[30,"bullet-seed"],[30,"grass-pledge"],[30,"seed-bomb"],[32,"sweet-scent"],[36,"light-screen"],[40,"body-slam"],[42,"aromatherapy"],[46,"safeguard"],[50,"giga-drain"],[54,"solar-beam"],[85,"leaf-storm"],[85,"solar-blade"]],"g":false,"m":false},"154":{"n":"大竺葵","t":["grass"],"s":[80,82,100,83,100,80],"l":[[0,"petal-dance"],[1,"growl"],[1,"tackle"],[6,"razor-leaf"],[9,"poison-powder"],[12,"synthesis"],[15,"grass-knot"],[18,"reflect"],[22,"magical-leaf"],[23,"natural-gift"],[23,"nature-power"],[26,"leech-seed"],[30,"bullet-seed"],[30,"grass-pledge"],[30,"seed-bomb"],[34,"sweet-scent"],[40,"light-screen"],[42,"aromatherapy"],[46,"body-slam"],[54,"safeguard"],[60,"giga-drain"],[65,"solar-beam"],[85,"leaf-storm"],[85,"solar-blade"]],"g":false,"m":false},"155":{"n":"火球鼠","t":["fire"],"s":[39,52,43,60,50,65],"l":[[1,"leer"],[1,"tackle"],[6,"smokescreen"],[10,"ember"],[13,"quick-attack"],[15,"incinerate"],[19,"flame-wheel"],[22,"defense-curl"],[28,"flame-charge"],[30,"burning-jealousy"],[30,"fire-pledge"],[31,"swift"],[37,"lava-plume"],[40,"flamethrower"],[45,"heat-wave"],[46,"inferno"],[49,"rollout"],[55,"double-edge"],[58,"overheat"],[64,"eruption"]],"g":false,"m":false},"156":{"n":"火岩鼠","t":["fire"],"s":[58,64,58,80,65,80],"l":[[1,"leer"],[1,"tackle"],[6,"smokescreen"],[10,"ember"],[13,"quick-attack"],[15,"incinerate"],[20,"flame-wheel"],[24,"defense-curl"],[30,"burning-jealousy"],[30,"fire-pledge"],[31,"swift"],[35,"flame-charge"],[42,"lava-plume"],[45,"heat-wave"],[46,"flamethrower"],[53,"inferno"],[57,"rollout"],[64,"double-edge"],[68,"overheat"],[75,"eruption"]],"g":false,"m":false},"157":{"n":"火暴兽","t":["fire"],"s":[78,84,78,109,85,100],"l":[[1,"leer"],[1,"tackle"],[6,"smokescreen"],[10,"ember"],[13,"quick-attack"],[15,"incinerate"],[20,"flame-wheel"],[24,"defense-curl"],[30,"burning-jealousy"],[30,"fire-pledge"],[31,"swift"],[35,"flame-charge"],[43,"lava-plume"],[45,"heat-wave"],[48,"flamethrower"],[56,"inferno"],[61,"rollout"],[64,"double-edge"],[74,"overheat"],[75,"eruption"]],"g":false,"m":false},"158":{"n":"小锯鳄","t":["water"],"s":[50,65,64,44,48,43],"l":[[1,"leer"],[1,"scratch"],[6,"water-gun"],[8,"mud-slap"],[9,"bite"],[13,"scary-face"],[15,"chilling-water"],[15,"flip-turn"],[15,"water-pulse"],[19,"ice-fang"],[22,"flail"],[27,"crunch"],[29,"chip-away"],[29,"low-kick"],[30,"slash"],[30,"waterfall"],[33,"screech"],[37,"thrash"],[41,"aqua-tail"],[45,"superpower"],[50,"hydro-pump"]],"g":false,"m":false},"159":{"n":"蓝鳄","t":["water"],"s":[65,80,80,59,63,58],"l":[[1,"leer"],[1,"scratch"],[6,"water-gun"],[8,"mud-slap"],[13,"bite"],[15,"chilling-water"],[15,"flip-turn"],[15,"scary-face"],[15,"water-pulse"],[21,"ice-fang"],[24,"flail"],[29,"chip-away"],[29,"low-kick"],[30,"crunch"],[30,"waterfall"],[34,"slash"],[37,"screech"],[42,"thrash"],[47,"aqua-tail"],[50,"superpower"],[55,"hydro-pump"]],"g":false,"m":false},"160":{"n":"大力鳄","t":["water"],"s":[85,105,100,79,83,78],"l":[[1,"leer"],[1,"scratch"],[6,"water-gun"],[8,"mud-slap"],[13,"bite"],[15,"chilling-water"],[15,"flip-turn"],[15,"scary-face"],[15,"water-pulse"],[21,"ice-fang"],[24,"flail"],[29,"chip-away"],[29,"low-kick"],[30,"agility"],[30,"waterfall"],[32,"crunch"],[37,"slash"],[44,"screech"],[51,"thrash"],[59,"aqua-tail"],[65,"superpower"],[70,"hydro-pump"]],"g":false,"m":false},"161":{"n":"尾立","t":["normal"],"s":[35,46,34,35,45,20],"l":[[1,"foresight"],[1,"growl"],[1,"scratch"],[4,"defense-curl"],[7,"quick-attack"],[13,"fury-swipes"],[15,"super-fang"],[16,"helping-hand"],[19,"follow-me"],[25,"slam"],[28,"rest"],[31,"sucker-punch"],[36,"amnesia"],[39,"baton-pass"],[42,"double-edge"],[42,"me-first"],[42,"reversal"],[47,"hyper-voice"]],"g":false,"m":false},"162":{"n":"大尾立","t":["normal"],"s":[85,76,64,45,55,90],"l":[[0,"agility"],[1,"foresight"],[1,"growl"],[1,"scratch"],[4,"defense-curl"],[7,"quick-attack"],[13,"fury-swipes"],[15,"super-fang"],[17,"helping-hand"],[21,"follow-me"],[28,"slam"],[32,"rest"],[36,"sucker-punch"],[42,"amnesia"],[42,"me-first"],[42,"reversal"],[46,"baton-pass"],[50,"double-edge"],[56,"hyper-voice"]],"g":false,"m":false},"163":{"n":"咕咕","t":["normal","flying"],"s":[60,30,30,36,56,50],"l":[[1,"foresight"],[1,"growl"],[1,"peck"],[3,"tackle"],[6,"echoed-voice"],[9,"confusion"],[12,"reflect"],[15,"acrobatics"],[15,"air-cutter"],[15,"defog"],[15,"psycho-shift"],[15,"swift"],[16,"zen-headbutt"],[18,"air-slash"],[21,"extrasensory"],[24,"take-down"],[27,"uproar"],[30,"roost"],[33,"moonblast"],[36,"hypnosis"],[39,"dream-eater"],[43,"synchronoise"],[65,"hurricane"]],"g":false,"m":false},"164":{"n":"猫头夜鹰","t":["normal","flying"],"s":[100,50,50,86,96,70],"l":[[1,"foresight"],[1,"growl"],[1,"peck"],[3,"tackle"],[6,"echoed-voice"],[9,"confusion"],[12,"reflect"],[15,"acrobatics"],[15,"air-cutter"],[15,"defog"],[15,"psycho-shift"],[15,"swift"],[16,"zen-headbutt"],[18,"air-slash"],[23,"extrasensory"],[28,"take-down"],[33,"uproar"],[38,"roost"],[43,"moonblast"],[43,"synchronoise"],[48,"hypnosis"],[53,"dream-eater"],[65,"hurricane"]],"g":false,"m":false},"165":{"n":"芭瓢虫","t":["bug","flying"],"s":[40,20,30,40,80,55],"l":[[1,"tackle"],[5,"supersonic"],[8,"swift"],[12,"light-screen"],[12,"reflect"],[12,"safeguard"],[15,"acrobatics"],[15,"aerial-ace"],[15,"infestation"],[15,"mach-punch"],[19,"roost"],[19,"silver-wind"],[22,"struggle-bug"],[26,"baton-pass"],[29,"agility"],[33,"bug-buzz"],[36,"air-slash"],[40,"double-edge"]],"g":false,"m":false},"166":{"n":"安瓢虫","t":["bug","flying"],"s":[55,35,50,55,110,85],"l":[[1,"tackle"],[5,"supersonic"],[8,"swift"],[12,"light-screen"],[12,"reflect"],[12,"safeguard"],[15,"acrobatics"],[15,"aerial-ace"],[15,"infestation"],[15,"mach-punch"],[15,"silver-wind"],[20,"roost"],[24,"struggle-bug"],[29,"baton-pass"],[33,"agility"],[38,"bug-buzz"],[42,"air-slash"],[47,"double-edge"]],"g":false,"m":false},"167":{"n":"圆丝蛛","t":["bug","poison"],"s":[40,60,40,40,40,30],"l":[[1,"constrict"],[1,"poison-sting"],[1,"string-shot"],[5,"absorb"],[8,"infestation"],[12,"scary-face"],[15,"acid-spray"],[15,"bug-bite"],[15,"night-shade"],[15,"pounce"],[15,"struggle-bug"],[15,"venoshock"],[19,"shadow-sneak"],[22,"fury-swipes"],[26,"sucker-punch"],[29,"agility"],[29,"leech-life"],[29,"spider-web"],[33,"pin-missile"],[36,"psychic"],[40,"poison-jab"],[44,"cross-poison"],[45,"screech"],[47,"sticky-web"],[51,"toxic-thread"]],"g":false,"m":false},"168":{"n":"阿利多斯","t":["bug","poison"],"s":[70,90,70,60,70,40],"l":[[0,"swords-dance"],[1,"constrict"],[1,"poison-sting"],[1,"string-shot"],[5,"absorb"],[8,"infestation"],[12,"scary-face"],[15,"acid-spray"],[15,"bug-bite"],[15,"night-shade"],[15,"pounce"],[15,"struggle-bug"],[15,"venoshock"],[19,"shadow-sneak"],[23,"fury-swipes"],[28,"sucker-punch"],[29,"leech-life"],[29,"spider-web"],[31,"agility"],[35,"pin-missile"],[41,"psychic"],[45,"screech"],[46,"poison-jab"],[50,"cross-poison"],[54,"sticky-web"],[59,"toxic-thread"]],"g":false,"m":false},"169":{"n":"叉字蝠","t":["poison","flying"],"s":[85,90,80,70,80,130],"l":[[0,"cross-poison"],[0,"crunch"],[1,"absorb"],[1,"supersonic"],[4,"wing-attack"],[5,"astonish"],[10,"mean-look"],[12,"swift"],[15,"poison-fang"],[20,"quick-guard"],[27,"air-cutter"],[28,"toxic"],[34,"bite"],[41,"haze"],[45,"fly"],[45,"sludge-bomb"],[48,"venoshock"],[55,"confuse-ray"],[62,"air-slash"],[69,"leech-life"],[85,"brave-bird"]],"g":false,"m":false},"170":{"n":"灯笼鱼","t":["water","electric"],"s":[75,38,38,56,56,67],"l":[[1,"supersonic"],[1,"water-gun"],[4,"electro-ball"],[8,"thunder-wave"],[12,"bubble-beam"],[16,"confuse-ray"],[20,"spark"],[24,"charge"],[28,"discharge"],[28,"signal-beam"],[30,"scald"],[32,"aqua-ring"],[36,"flail"],[40,"take-down"],[44,"hydro-pump"],[45,"thunderbolt"],[47,"ion-deluge"],[65,"thunder"],[85,"zap-cannon"]],"g":false,"m":false},"171":{"n":"电灯怪","t":["water","electric"],"s":[125,58,58,76,76,67],"l":[[0,"spit-up"],[0,"stockpile"],[0,"swallow"],[1,"supersonic"],[1,"water-gun"],[4,"electro-ball"],[8,"thunder-wave"],[12,"bubble-beam"],[16,"confuse-ray"],[20,"spark"],[24,"charge"],[28,"signal-beam"],[30,"discharge"],[30,"scald"],[36,"aqua-ring"],[42,"flail"],[45,"thunderbolt"],[47,"ion-deluge"],[48,"take-down"],[54,"hydro-pump"],[65,"thunder"],[85,"zap-cannon"]],"g":false,"m":false},"172":{"n":"皮丘","t":["electric"],"s":[20,40,15,35,35,60],"l":[[1,"tail-whip"],[1,"thunder-shock"],[4,"play-nice"],[8,"sweet-kiss"],[12,"nuzzle"],[15,"charge-beam"],[15,"electroweb"],[15,"shock-wave"],[16,"nasty-plot"],[18,"thunder-wave"],[20,"charm"],[30,"thunder-punch"],[30,"volt-switch"],[45,"thunderbolt"],[45,"wild-charge"],[65,"thunder"],[85,"zap-cannon"]],"g":false,"m":false},"173":{"n":"皮宝宝","t":["fairy"],"s":[50,25,28,45,55,15],"l":[[1,"copycat"],[1,"pound"],[1,"splash"],[4,"sing"],[8,"sweet-kiss"],[12,"disarming-voice"],[15,"draining-kiss"],[16,"encore"],[16,"magical-leaf"],[20,"charm"],[30,"dazzling-gleam"]],"g":false,"m":false},"174":{"n":"宝宝丁","t":["normal","fairy"],"s":[90,30,15,40,20,15],"l":[[1,"copycat"],[1,"pound"],[1,"sing"],[4,"defense-curl"],[8,"sweet-kiss"],[12,"disarming-voice"],[15,"draining-kiss"],[15,"echoed-voice"],[15,"swift"],[16,"disable"],[20,"charm"],[30,"dazzling-gleam"],[30,"tera-blast"],[45,"uproar"]],"g":false,"m":false},"175":{"n":"波克比","t":["fairy"],"s":[35,20,65,40,65,20],"l":[[1,"growl"],[1,"pound"],[4,"sweet-kiss"],[8,"life-dew"],[12,"charm"],[15,"draining-kiss"],[16,"ancient-power"],[17,"encore"],[20,"yawn"],[24,"metronome"],[25,"bestow"],[28,"after-you"],[30,"dazzling-gleam"],[32,"double-edge"],[36,"safeguard"],[40,"follow-me"],[44,"baton-pass"],[48,"last-resort"],[52,"wish"]],"g":false,"m":false},"176":{"n":"波克基古","t":["fairy","flying"],"s":[55,40,85,80,105,40],"l":[[0,"fairy-wind"],[1,"growl"],[1,"pound"],[4,"sweet-kiss"],[8,"life-dew"],[12,"charm"],[15,"aerial-ace"],[15,"draining-kiss"],[16,"ancient-power"],[17,"encore"],[20,"yawn"],[24,"metronome"],[25,"bestow"],[28,"after-you"],[30,"dazzling-gleam"],[32,"double-edge"],[36,"safeguard"],[40,"follow-me"],[44,"baton-pass"],[45,"fly"],[48,"last-resort"],[52,"wish"]],"g":false,"m":false},"177":{"n":"天然雀","t":["psychic","flying"],"s":[40,50,45,70,45,70],"l":[[1,"leer"],[1,"peck"],[5,"stored-power"],[10,"teleport"],[12,"lucky-chant"],[15,"aerial-ace"],[15,"confuse-ray"],[20,"night-shade"],[26,"psycho-shift"],[30,"air-slash"],[30,"power-swap"],[30,"psyshock"],[30,"zen-headbutt"],[35,"guard-swap"],[35,"psychic"],[36,"miracle-eye"],[40,"wish"],[45,"future-sight"],[50,"me-first"]],"g":false,"m":false},"178":{"n":"天然鸟","t":["psychic","flying"],"s":[65,75,70,95,70,95],"l":[[0,"air-slash"],[1,"leer"],[1,"peck"],[5,"stored-power"],[10,"teleport"],[12,"lucky-chant"],[15,"aerial-ace"],[15,"confuse-ray"],[20,"night-shade"],[27,"tailwind"],[28,"psycho-shift"],[30,"psyshock"],[30,"zen-headbutt"],[34,"guard-swap"],[34,"power-swap"],[36,"miracle-eye"],[41,"psychic"],[48,"wish"],[50,"me-first"],[55,"future-sight"]],"g":false,"m":false},"179":{"n":"咩利羊","t":["electric"],"s":[55,40,40,65,45,35],"l":[[1,"growl"],[1,"tackle"],[4,"thunder-wave"],[8,"thunder-shock"],[11,"cotton-spore"],[15,"charge"],[15,"charge-beam"],[15,"electroweb"],[15,"shock-wave"],[18,"take-down"],[22,"electro-ball"],[25,"confuse-ray"],[29,"power-gem"],[30,"volt-switch"],[32,"discharge"],[36,"cotton-guard"],[39,"dazzling-gleam"],[39,"signal-beam"],[43,"light-screen"],[45,"thunderbolt"],[46,"thunder"],[85,"zap-cannon"]],"g":false,"m":false},"180":{"n":"茸茸羊","t":["electric"],"s":[70,55,55,80,60,45],"l":[[1,"growl"],[1,"tackle"],[6,"thunder-shock"],[9,"thunder-wave"],[11,"cotton-spore"],[15,"charge-beam"],[15,"electroweb"],[15,"shock-wave"],[16,"charge"],[20,"take-down"],[25,"electro-ball"],[29,"confuse-ray"],[30,"volt-switch"],[34,"power-gem"],[38,"discharge"],[39,"signal-beam"],[43,"cotton-guard"],[45,"thunderbolt"],[47,"dazzling-gleam"],[52,"light-screen"],[56,"thunder"],[85,"zap-cannon"]],"g":false,"m":false},"181":{"n":"电龙","t":["electric"],"s":[90,75,85,115,90,55],"l":[[0,"thunder-punch"],[1,"growl"],[1,"tackle"],[6,"thunder-shock"],[9,"thunder-wave"],[11,"cotton-spore"],[15,"charge-beam"],[15,"electroweb"],[15,"shock-wave"],[16,"charge"],[20,"take-down"],[25,"electro-ball"],[29,"confuse-ray"],[30,"volt-switch"],[35,"power-gem"],[39,"signal-beam"],[40,"discharge"],[45,"thunderbolt"],[46,"cotton-guard"],[51,"dazzling-gleam"],[57,"light-screen"],[62,"thunder"],[65,"dragon-pulse"],[85,"zap-cannon"]],"g":false,"m":false},"182":{"n":"美丽花","t":["grass"],"s":[75,80,95,90,100,50],"l":[[0,"petal-blizzard"],[1,"absorb"],[1,"growth"],[4,"acid"],[8,"sweet-scent"],[12,"mega-drain"],[14,"poison-powder"],[15,"magical-leaf"],[15,"venoshock"],[16,"stun-spore"],[18,"sleep-powder"],[20,"giga-drain"],[23,"lucky-chant"],[26,"toxic"],[32,"moonblast"],[38,"grassy-terrain"],[39,"natural-gift"],[39,"quiver-dance"],[44,"moonlight"],[45,"sludge-bomb"],[50,"petal-dance"],[85,"leaf-storm"]],"g":false,"m":false},"183":{"n":"玛力露","t":["water","fairy"],"s":[70,20,50,20,50,40],"l":[[1,"defense-curl"],[1,"helping-hand"],[1,"rollout"],[1,"splash"],[1,"tackle"],[1,"tail-whip"],[1,"water-gun"],[5,"water-sport"],[6,"bubble-beam"],[9,"charm"],[12,"slam"],[15,"bounce"],[15,"draining-kiss"],[19,"aqua-tail"],[21,"play-rough"],[24,"aqua-ring"],[27,"rain-dance"],[30,"alluring-voice"],[30,"hydro-pump"],[33,"double-edge"],[36,"superpower"],[45,"body-slam"],[45,"take-down"]],"g":false,"m":false},"184":{"n":"玛力露丽","t":["water","fairy"],"s":[100,50,80,60,80,50],"l":[[1,"defense-curl"],[1,"helping-hand"],[1,"rollout"],[1,"splash"],[1,"tackle"],[1,"tail-whip"],[1,"water-gun"],[5,"water-sport"],[6,"bubble-beam"],[9,"charm"],[12,"slam"],[15,"bounce"],[15,"draining-kiss"],[21,"aqua-tail"],[25,"play-rough"],[30,"alluring-voice"],[30,"aqua-ring"],[35,"rain-dance"],[40,"hydro-pump"],[45,"body-slam"],[45,"double-edge"],[45,"take-down"],[50,"superpower"]],"g":false,"m":false},"185":{"n":"树才怪","t":["rock"],"s":[70,100,115,30,65,30],"l":[[0,"slam"],[1,"copycat"],[1,"fake-tears"],[1,"flail"],[1,"hammer-arm"],[1,"rock-throw"],[1,"stone-edge"],[1,"wood-hammer"],[12,"block"],[16,"mimic"],[19,"feint-attack"],[20,"rock-tomb"],[24,"tearful-look"],[28,"sucker-punch"],[30,"rock-blast"],[32,"rock-slide"],[36,"low-kick"],[40,"counter"],[44,"double-edge"],[48,"head-smash"]],"g":false,"m":false},"186":{"n":"蚊香蛙皇","t":["water"],"s":[90,75,75,90,100,70],"l":[[0,"bounce"],[1,"hypnosis"],[1,"water-gun"],[1,"water-sport"],[6,"pound"],[12,"mud-shot"],[15,"chilling-water"],[15,"water-pulse"],[16,"double-slap"],[18,"bubble-beam"],[24,"rain-dance"],[26,"low-kick"],[27,"swagger"],[30,"scald"],[30,"waterfall"],[32,"body-slam"],[35,"perish-song"],[35,"wake-up-slap"],[38,"amnesia"],[40,"earth-power"],[45,"liquidation"],[48,"hydro-pump"],[48,"hyper-voice"],[56,"belly-drum"],[66,"double-edge"]],"g":false,"m":false},"187":{"n":"毽子草","t":["grass","flying"],"s":[35,35,40,35,55,50],"l":[[1,"splash"],[1,"tackle"],[4,"tail-whip"],[6,"absorb"],[8,"fairy-wind"],[10,"poison-powder"],[10,"sleep-powder"],[10,"stun-spore"],[12,"bullet-seed"],[15,"aerial-ace"],[15,"synthesis"],[19,"leech-seed"],[22,"mega-drain"],[24,"acrobatics"],[27,"cotton-spore"],[29,"u-turn"],[30,"seed-bomb"],[31,"rage-powder"],[32,"giga-drain"],[35,"bounce"],[38,"memento"],[40,"worry-seed"],[45,"energy-ball"],[85,"leaf-storm"],[85,"solar-beam"]],"g":false,"m":false},"188":{"n":"毽子花","t":["grass","flying"],"s":[55,45,50,45,65,80],"l":[[1,"splash"],[4,"tail-whip"],[6,"absorb"],[8,"tackle"],[10,"fairy-wind"],[12,"poison-powder"],[12,"sleep-powder"],[12,"stun-spore"],[15,"aerial-ace"],[15,"bullet-seed"],[15,"synthesis"],[20,"leech-seed"],[24,"mega-drain"],[28,"acrobatics"],[30,"seed-bomb"],[31,"cotton-spore"],[31,"rage-powder"],[34,"u-turn"],[37,"giga-drain"],[40,"worry-seed"],[41,"bounce"],[44,"memento"],[45,"energy-ball"],[85,"leaf-storm"],[85,"solar-beam"]],"g":false,"m":false},"189":{"n":"毽子棉","t":["grass","flying"],"s":[75,55,70,55,95,110],"l":[[1,"splash"],[4,"tail-whip"],[6,"absorb"],[8,"tackle"],[10,"fairy-wind"],[12,"poison-powder"],[12,"sleep-powder"],[12,"stun-spore"],[15,"aerial-ace"],[15,"bullet-seed"],[15,"synthesis"],[20,"leech-seed"],[24,"mega-drain"],[30,"acrobatics"],[30,"seed-bomb"],[31,"rage-powder"],[35,"cotton-spore"],[39,"u-turn"],[40,"worry-seed"],[43,"giga-drain"],[45,"energy-ball"],[49,"bounce"],[55,"memento"],[85,"leaf-storm"],[85,"solar-beam"]],"g":false,"m":false},"190":{"n":"长尾怪手","t":["normal"],"s":[55,70,55,40,55,85],"l":[[1,"scratch"],[1,"tail-whip"],[4,"sand-attack"],[8,"astonish"],[11,"baton-pass"],[15,"cut"],[15,"tickle"],[18,"fury-swipes"],[22,"swift"],[25,"screech"],[29,"agility"],[30,"headbutt"],[30,"strength"],[32,"double-hit"],[36,"fling"],[39,"nasty-plot"],[43,"last-resort"],[45,"take-down"],[85,"double-edge"]],"g":false,"m":false},"191":{"n":"向日种子","t":["grass"],"s":[30,30,30,30,30,30],"l":[[1,"growth"],[1,"tackle"],[4,"ingrain"],[7,"absorb"],[7,"grass-whistle"],[10,"mega-drain"],[13,"leech-seed"],[15,"magical-leaf"],[15,"trailblaze"],[16,"razor-leaf"],[19,"worry-seed"],[22,"giga-drain"],[25,"endeavor"],[28,"synthesis"],[30,"bullet-seed"],[31,"natural-gift"],[31,"solar-beam"],[34,"double-edge"],[36,"sunny-day"],[39,"seed-bomb"],[85,"leaf-storm"]],"g":false,"m":false},"192":{"n":"向日花怪","t":["grass"],"s":[75,75,55,105,85,30],"l":[[1,"growth"],[1,"tackle"],[4,"ingrain"],[7,"absorb"],[7,"grass-whistle"],[10,"mega-drain"],[13,"leech-seed"],[15,"magical-leaf"],[15,"trailblaze"],[16,"razor-leaf"],[19,"worry-seed"],[22,"giga-drain"],[25,"bullet-seed"],[25,"endeavor"],[28,"petal-dance"],[28,"synthesis"],[31,"natural-gift"],[31,"solar-beam"],[34,"double-edge"],[39,"seed-bomb"],[39,"sunny-day"],[43,"leaf-storm"],[50,"petal-blizzard"]],"g":false,"m":false},"193":{"n":"蜻蜻蜓","t":["bug","flying"],"s":[65,65,45,75,45,95],"l":[[1,"foresight"],[1,"gust"],[1,"tackle"],[6,"quick-attack"],[11,"double-team"],[14,"air-cutter"],[14,"sonic-boom"],[15,"silver-wind"],[15,"struggle-bug"],[17,"detect"],[22,"supersonic"],[27,"uproar"],[30,"bug-bite"],[30,"leech-life"],[30,"pursuit"],[30,"skitter-smack"],[30,"string-shot"],[33,"ancient-power"],[38,"hypnosis"],[43,"wing-attack"],[46,"screech"],[49,"u-turn"],[54,"air-slash"],[57,"bug-buzz"]],"g":false,"m":false},"194":{"n":"乌波","t":["water","ground"],"s":[55,45,45,25,25,15],"l":[[1,"tail-whip"],[1,"water-gun"],[4,"rain-dance"],[5,"mud-sport"],[8,"mud-shot"],[12,"haze"],[12,"mist"],[15,"bulldoze"],[15,"chilling-water"],[15,"water-pulse"],[16,"slam"],[19,"mud-bomb"],[21,"yawn"],[24,"aqua-tail"],[28,"muddy-water"],[30,"dig"],[30,"stomping-tantrum"],[32,"amnesia"],[36,"toxic"],[40,"earthquake"]],"g":false,"m":false},"195":{"n":"沼王","t":["water","ground"],"s":[95,85,85,65,65,35],"l":[[1,"tail-whip"],[1,"water-gun"],[4,"rain-dance"],[5,"mud-sport"],[8,"mud-shot"],[12,"haze"],[12,"mist"],[15,"bulldoze"],[15,"chilling-water"],[15,"water-pulse"],[16,"slam"],[19,"mud-bomb"],[23,"yawn"],[28,"aqua-tail"],[30,"dig"],[30,"stomping-tantrum"],[34,"muddy-water"],[40,"amnesia"],[46,"toxic"],[52,"earthquake"]],"g":false,"m":false},"196":{"n":"太阳伊布","t":["psychic"],"s":[65,65,60,130,95,110],"l":[[0,"confusion"],[1,"covet"],[1,"growl"],[1,"helping-hand"],[1,"tackle"],[1,"tail-whip"],[5,"sand-attack"],[10,"double-kick"],[10,"quick-attack"],[15,"baby-doll-eyes"],[20,"refresh"],[20,"swift"],[25,"bite"],[25,"psybeam"],[30,"copycat"],[30,"headbutt"],[30,"morning-sun"],[30,"psychic-noise"],[30,"psyshock"],[35,"baton-pass"],[35,"power-swap"],[36,"focus-energy"],[40,"psychic"],[40,"take-down"],[45,"charm"],[45,"psych-up"],[45,"trump-card"],[50,"double-edge"],[50,"future-sight"],[55,"last-resort"],[85,"skull-bash"]],"g":false,"m":false},"197":{"n":"月亮伊布","t":["dark"],"s":[95,65,110,60,130,65],"l":[[0,"snarl"],[1,"covet"],[1,"growl"],[1,"helping-hand"],[1,"tackle"],[1,"tail-whip"],[5,"sand-attack"],[10,"double-kick"],[10,"quick-attack"],[15,"baby-doll-eyes"],[15,"thief"],[20,"confuse-ray"],[20,"feint-attack"],[20,"refresh"],[20,"swift"],[25,"assurance"],[25,"bite"],[30,"copycat"],[30,"crunch"],[30,"headbutt"],[30,"lash-out"],[30,"moonlight"],[35,"baton-pass"],[35,"guard-swap"],[36,"focus-energy"],[40,"dark-pulse"],[40,"take-down"],[45,"charm"],[45,"foul-play"],[45,"screech"],[45,"trump-card"],[50,"double-edge"],[50,"mean-look"],[55,"last-resort"],[85,"skull-bash"]],"g":false,"m":false},"198":{"n":"黑暗鸦","t":["dark","flying"],"s":[60,85,42,85,42,91],"l":[[1,"astonish"],[1,"peck"],[5,"gust"],[5,"pursuit"],[11,"haze"],[15,"payback"],[15,"snarl"],[15,"thief"],[15,"wing-attack"],[21,"night-shade"],[25,"assurance"],[30,"air-slash"],[30,"dark-pulse"],[30,"dual-wingbeat"],[30,"lash-out"],[31,"taunt"],[35,"mean-look"],[40,"foul-play"],[45,"fly"],[50,"sucker-punch"],[50,"tailwind"],[55,"torment"],[60,"quash"],[65,"hurricane"],[85,"brave-bird"]],"g":false,"m":false},"199":{"n":"呆呆王","t":["water","psychic"],"s":[95,75,80,100,110,30],"l":[[1,"curse"],[1,"tackle"],[3,"growl"],[6,"water-gun"],[9,"yawn"],[12,"confusion"],[15,"bubble-beam"],[15,"chilling-water"],[15,"disable"],[15,"psybeam"],[18,"water-pulse"],[21,"headbutt"],[24,"zen-headbutt"],[27,"amnesia"],[30,"psychic-noise"],[30,"psyshock"],[30,"rest"],[30,"surf"],[30,"waterfall"],[33,"slack-off"],[36,"nasty-plot"],[36,"psychic"],[39,"psych-up"],[41,"swagger"],[42,"rain-dance"],[45,"heal-pulse"],[45,"liquidation"],[49,"trump-card"],[65,"hydro-pump"],[85,"future-sight"]],"g":false,"m":false},"200":{"n":"梦妖","t":["ghost"],"s":[60,60,60,85,85,85],"l":[[1,"confusion"],[1,"growl"],[5,"spite"],[10,"astonish"],[14,"confuse-ray"],[15,"night-shade"],[19,"mean-look"],[23,"hex"],[28,"psybeam"],[32,"pain-split"],[37,"payback"],[41,"shadow-ball"],[46,"perish-song"],[50,"grudge"],[50,"power-gem"]],"g":false,"m":false},"201":{"n":"未知图腾 A","t":["psychic"],"s":[48,72,48,72,48,48],"l":[[1,"hidden-power"]],"g":false,"m":false,"d":"201-A"},"202":{"n":"果然翁","t":["psychic"],"s":[190,33,58,33,58,33],"l":[[0,"counter"],[0,"destiny-bond"],[0,"mirror-coat"],[0,"safeguard"],[1,"amnesia"],[1,"charm"],[1,"encore"],[1,"splash"]],"g":false,"m":false},"203":{"n":"麒麟奇","t":["normal","psychic"],"s":[70,80,65,90,65,85],"l":[[1,"astonish"],[1,"growl"],[1,"guard-swap"],[1,"power-swap"],[1,"tackle"],[5,"confusion"],[5,"odor-sleuth"],[10,"assurance"],[14,"stomp"],[15,"swift"],[19,"psybeam"],[23,"agility"],[28,"double-hit"],[30,"psychic-noise"],[30,"psyshock"],[30,"strength"],[30,"tera-blast"],[32,"twin-beam"],[37,"crunch"],[41,"baton-pass"],[45,"uproar"],[46,"nasty-plot"],[50,"psychic"],[85,"double-edge"],[85,"future-sight"]],"g":false,"m":false},"204":{"n":"榛果球","t":["bug"],"s":[50,65,90,35,35,15],"l":[[1,"protect"],[1,"tackle"],[6,"self-destruct"],[9,"bug-bite"],[12,"take-down"],[17,"rapid-spin"],[20,"autotomize"],[20,"bide"],[20,"rollout"],[23,"curse"],[23,"natural-gift"],[28,"spikes"],[30,"lunge"],[31,"payback"],[34,"explosion"],[39,"iron-defense"],[42,"gyro-ball"],[45,"double-edge"]],"g":false,"m":false},"205":{"n":"佛烈托斯","t":["bug","steel"],"s":[75,90,140,60,60,40],"l":[[0,"heavy-slam"],[1,"protect"],[1,"tackle"],[6,"self-destruct"],[9,"bug-bite"],[12,"take-down"],[17,"rapid-spin"],[20,"autotomize"],[20,"bide"],[20,"reflect"],[20,"rollout"],[23,"curse"],[23,"natural-gift"],[28,"spikes"],[30,"lunge"],[32,"payback"],[36,"explosion"],[42,"iron-defense"],[46,"gyro-ball"],[50,"double-edge"],[56,"magnet-rise"],[60,"zap-cannon"]],"g":false,"m":false},"206":{"n":"土龙弟弟","t":["normal"],"s":[100,70,70,65,65,45],"l":[[1,"defense-curl"],[1,"flail"],[4,"mud-slap"],[6,"spite"],[8,"pursuit"],[8,"rollout"],[12,"glare"],[15,"hidden-power"],[16,"screech"],[20,"ancient-power"],[24,"drill-run"],[28,"yawn"],[30,"headbutt"],[30,"strength"],[32,"hyper-drill"],[36,"roost"],[40,"dragon-rush"],[43,"air-slash"],[44,"coil"],[48,"double-edge"],[48,"endure"],[52,"endeavor"]],"g":false,"m":false},"207":{"n":"天蝎","t":["ground","flying"],"s":[65,75,105,35,65,85],"l":[[1,"poison-sting"],[4,"sand-attack"],[7,"harden"],[10,"knock-off"],[13,"quick-attack"],[15,"aerial-ace"],[15,"bulldoze"],[15,"sand-tomb"],[16,"fury-cutter"],[19,"mud-slap"],[19,"poison-tail"],[22,"acrobatics"],[27,"slash"],[30,"dig"],[30,"dual-wingbeat"],[30,"u-turn"],[35,"screech"],[40,"x-scissor"],[45,"crabhammer"],[45,"earthquake"],[45,"sky-uppercut"],[50,"swords-dance"],[55,"guillotine"]],"g":false,"m":false},"208":{"n":"大钢蛇","t":["steel","ground"],"s":[75,85,200,55,65,30],"l":[[1,"bind"],[1,"harden"],[1,"mud-sport"],[1,"rock-throw"],[1,"tackle"],[4,"smack-down"],[8,"autotomize"],[8,"rock-polish"],[10,"rock-tomb"],[12,"dragon-breath"],[15,"bulldoze"],[15,"gyro-ball"],[15,"mud-slap"],[16,"curse"],[20,"rock-slide"],[24,"screech"],[28,"sand-tomb"],[30,"drill-run"],[30,"iron-head"],[30,"rock-blast"],[30,"stomping-tantrum"],[32,"stealth-rock"],[35,"earthquake"],[36,"slam"],[37,"crunch"],[40,"sandstorm"],[44,"dig"],[48,"iron-tail"],[52,"stone-edge"],[56,"double-edge"],[60,"magnet-rise"]],"g":false,"m":false},"209":{"n":"布鲁","t":["fairy"],"s":[60,80,50,40,40,30],"l":[[1,"charm"],[1,"fire-fang"],[1,"growl"],[1,"ice-fang"],[1,"scary-face"],[1,"tackle"],[1,"tail-whip"],[1,"thunder-fang"],[7,"bite"],[13,"lick"],[19,"headbutt"],[25,"roar"],[30,"dazzling-gleam"],[31,"last-resort"],[31,"taunt"],[37,"play-rough"],[37,"take-down"],[43,"payback"],[49,"crunch"]],"g":false,"m":false},"210":{"n":"布鲁皇","t":["fairy"],"s":[90,120,75,60,60,45],"l":[[1,"charm"],[1,"fire-fang"],[1,"growl"],[1,"ice-fang"],[1,"scary-face"],[1,"tackle"],[1,"tail-whip"],[1,"thunder-fang"],[7,"bite"],[13,"lick"],[19,"headbutt"],[27,"roar"],[30,"dazzling-gleam"],[31,"taunt"],[35,"last-resort"],[37,"take-down"],[43,"play-rough"],[51,"payback"],[59,"crunch"],[67,"outrage"]],"g":false,"m":false},"211":{"n":"千针鱼","t":["water","poison"],"s":[65,95,85,55,55,85],"l":[[1,"hydro-pump"],[1,"poison-sting"],[1,"tackle"],[4,"harden"],[8,"water-gun"],[12,"fell-stinger"],[15,"acid-spray"],[15,"poison-tail"],[16,"minimize"],[17,"rollout"],[20,"spikes"],[24,"brine"],[28,"poison-jab"],[28,"revenge"],[30,"waterfall"],[32,"pin-missile"],[36,"toxic-spikes"],[40,"spit-up"],[40,"stockpile"],[44,"toxic"],[45,"liquidation"],[48,"aqua-tail"],[48,"take-down"],[52,"acupressure"],[56,"destiny-bond"],[85,"gunk-shot"]],"g":false,"m":false},"212":{"n":"巨钳螳螂","t":["bug","steel"],"s":[70,130,100,55,80,65],"l":[[0,"bullet-punch"],[1,"leer"],[1,"quick-attack"],[1,"vacuum-wave"],[4,"fury-cutter"],[8,"false-swipe"],[9,"pursuit"],[12,"metal-claw"],[12,"wing-attack"],[15,"bug-bite"],[15,"pounce"],[16,"double-team"],[20,"double-hit"],[24,"slash"],[28,"focus-energy"],[30,"dual-wingbeat"],[30,"lunge"],[30,"steel-wing"],[30,"u-turn"],[32,"agility"],[32,"iron-defense"],[36,"air-slash"],[36,"iron-head"],[40,"x-scissor"],[44,"laser-focus"],[44,"swords-dance"],[45,"night-slash"]],"g":false,"m":false},"213":{"n":"壶壶","t":["bug","rock"],"s":[20,10,230,10,230,5],"l":[[1,"bide"],[1,"withdraw"],[1,"wrap"],[5,"encore"],[5,"rollout"],[10,"struggle-bug"],[15,"rock-throw"],[15,"rock-tomb"],[20,"safeguard"],[25,"rest"],[30,"bug-bite"],[30,"rock-blast"],[35,"guard-split"],[35,"power-split"],[40,"rock-slide"],[45,"gastro-acid"],[50,"sticky-web"],[55,"power-trick"],[60,"stone-edge"],[65,"shell-smash"]],"g":false,"m":false},"214":{"n":"赫拉克罗斯","t":["bug","fighting"],"s":[80,125,75,40,95,85],"l":[[1,"arm-thrust"],[1,"bullet-seed"],[1,"leer"],[1,"night-slash"],[1,"tackle"],[5,"fury-attack"],[10,"endure"],[15,"aerial-ace"],[15,"bug-bite"],[15,"fury-cutter"],[15,"low-kick"],[15,"pounce"],[16,"chip-away"],[20,"horn-attack"],[25,"counter"],[30,"brick-break"],[30,"lunge"],[30,"skitter-smack"],[34,"take-down"],[35,"pin-missile"],[40,"throat-chop"],[45,"thrash"],[50,"swords-dance"],[55,"megahorn"],[60,"close-combat"]],"g":false,"m":false},"215":{"n":"狃拉","t":["dark","ice"],"s":[55,95,55,35,75,115],"l":[[1,"leer"],[1,"scratch"],[6,"taunt"],[10,"feint-attack"],[12,"quick-attack"],[15,"avalanche"],[15,"knock-off"],[18,"metal-claw"],[24,"icy-wind"],[30,"fury-swipes"],[30,"ice-punch"],[30,"icicle-spear"],[30,"lash-out"],[30,"throat-chop"],[36,"hone-claws"],[40,"snatch"],[42,"beat-up"],[44,"punishment"],[45,"foul-play"],[47,"ice-shard"],[48,"agility"],[54,"screech"],[60,"slash"],[85,"triple-axel"]],"g":false,"m":false},"216":{"n":"熊宝宝","t":["normal"],"s":[60,80,50,50,50,40],"l":[[1,"baby-doll-eyes"],[1,"covet"],[1,"fake-tears"],[1,"fling"],[1,"leer"],[1,"lick"],[1,"scratch"],[8,"fury-swipes"],[13,"payback"],[15,"feint-attack"],[17,"sweet-scent"],[22,"slash"],[25,"play-nice"],[29,"play-rough"],[30,"strength"],[33,"charm"],[37,"rest"],[37,"snore"],[41,"thrash"]],"g":false,"m":false},"217":{"n":"圈圈熊","t":["normal"],"s":[90,130,75,75,75,55],"l":[[1,"baby-doll-eyes"],[1,"covet"],[1,"fake-tears"],[1,"fling"],[1,"leer"],[1,"lick"],[1,"scratch"],[8,"fury-swipes"],[13,"payback"],[15,"feint-attack"],[17,"sweet-scent"],[22,"slash"],[25,"play-nice"],[29,"play-rough"],[30,"strength"],[33,"charm"],[35,"scary-face"],[41,"rest"],[41,"snore"],[48,"high-horsepower"],[56,"thrash"],[64,"hammer-arm"]],"g":false,"m":false},"218":{"n":"熔岩虫","t":["fire"],"s":[40,40,40,70,40,20],"l":[[1,"smog"],[1,"yawn"],[6,"ember"],[8,"rock-throw"],[13,"harden"],[20,"clear-smog"],[22,"ancient-power"],[27,"flame-burst"],[27,"incinerate"],[29,"rock-slide"],[34,"lava-plume"],[36,"amnesia"],[41,"body-slam"],[43,"recover"],[45,"heat-wave"],[48,"flamethrower"],[50,"earth-power"],[65,"fire-blast"],[85,"overheat"]],"g":false,"m":false},"219":{"n":"熔岩蜗牛","t":["fire","rock"],"s":[60,50,120,90,80,30],"l":[[0,"shell-smash"],[1,"smog"],[1,"yawn"],[6,"ember"],[8,"rock-throw"],[13,"harden"],[15,"rock-tomb"],[20,"clear-smog"],[22,"ancient-power"],[27,"flame-burst"],[27,"incinerate"],[29,"rock-slide"],[30,"power-gem"],[34,"lava-plume"],[36,"amnesia"],[43,"body-slam"],[45,"heat-wave"],[47,"recover"],[50,"earth-power"],[54,"flamethrower"],[65,"fire-blast"],[85,"overheat"]],"g":false,"m":false},"220":{"n":"小山猪","t":["ice","ground"],"s":[50,50,40,30,30,50],"l":[[1,"mud-slap"],[1,"odor-sleuth"],[1,"tackle"],[5,"mud-sport"],[5,"powder-snow"],[10,"flail"],[15,"avalanche"],[15,"bulldoze"],[15,"ice-fang"],[15,"ice-shard"],[15,"sand-tomb"],[18,"mud-bomb"],[20,"mist"],[25,"endure"],[30,"dig"],[30,"icicle-spear"],[30,"icy-wind"],[30,"stomping-tantrum"],[35,"amnesia"],[40,"take-down"],[45,"earthquake"],[50,"blizzard"]],"g":false,"m":false},"221":{"n":"长毛猪","t":["ice","ground"],"s":[100,100,80,60,60,50],"l":[[0,"fury-attack"],[0,"ice-fang"],[1,"mud-slap"],[1,"odor-sleuth"],[1,"tackle"],[5,"mud-sport"],[5,"powder-snow"],[10,"flail"],[15,"avalanche"],[15,"bulldoze"],[15,"ice-shard"],[15,"sand-tomb"],[18,"mud-bomb"],[20,"mist"],[25,"endure"],[30,"dig"],[30,"icicle-spear"],[30,"icy-wind"],[30,"stomping-tantrum"],[37,"amnesia"],[44,"take-down"],[51,"earthquake"],[58,"blizzard"],[65,"thrash"]],"g":false,"m":false},"222":{"n":"太阳珊瑚","t":["water","rock"],"s":[65,55,95,65,95,35],"l":[[1,"harden"],[1,"tackle"],[4,"bubble"],[5,"water-gun"],[10,"aqua-ring"],[13,"refresh"],[15,"brine"],[15,"endure"],[15,"rock-tomb"],[15,"rollout"],[15,"water-pulse"],[20,"ancient-power"],[20,"spike-cannon"],[23,"lucky-chant"],[25,"bubble-beam"],[29,"iron-defense"],[30,"flail"],[30,"rock-slide"],[30,"scald"],[31,"rock-blast"],[35,"life-dew"],[40,"power-gem"],[45,"earth-power"],[45,"surf"],[50,"recover"],[55,"mirror-coat"],[65,"hydro-pump"],[65,"stone-edge"]],"g":false,"m":false},"223":{"n":"铁炮鱼","t":["water"],"s":[35,65,35,65,35,65],"l":[[1,"helping-hand"],[1,"water-gun"],[4,"water-pulse"],[8,"focus-energy"],[12,"psybeam"],[15,"brine"],[16,"aurora-beam"],[20,"bubble-beam"],[24,"lock-on"],[28,"bullet-seed"],[30,"signal-beam"],[30,"waterfall"],[32,"ice-beam"],[36,"hydro-pump"],[40,"soak"],[44,"hyper-beam"]],"g":false,"m":false},"224":{"n":"章鱼桶","t":["water"],"s":[75,105,75,105,75,45],"l":[[0,"octazooka"],[1,"helping-hand"],[1,"water-gun"],[4,"water-pulse"],[6,"constrict"],[8,"focus-energy"],[12,"psybeam"],[15,"brine"],[16,"aurora-beam"],[20,"bubble-beam"],[24,"lock-on"],[28,"wring-out"],[30,"bullet-seed"],[30,"signal-beam"],[30,"waterfall"],[36,"ice-beam"],[42,"hydro-pump"],[48,"soak"],[54,"hyper-beam"]],"g":false,"m":false},"225":{"n":"信使鸟","t":["ice","flying"],"s":[45,55,45,65,45,75],"l":[[1,"present"],[15,"acrobatics"],[15,"air-cutter"],[15,"frost-breath"],[15,"icy-wind"],[25,"drill-peck"],[30,"air-slash"],[30,"ice-punch"],[30,"ice-spinner"],[30,"icicle-spear"],[45,"fly"],[45,"ice-beam"],[65,"blizzard"],[85,"brave-bird"]],"g":false,"m":false},"226":{"n":"巨翅飞鱼","t":["water","flying"],"s":[85,40,70,80,140,70],"l":[[1,"bullet-seed"],[1,"psybeam"],[1,"roost"],[1,"supersonic"],[1,"tackle"],[1,"water-gun"],[1,"wing-attack"],[11,"confuse-ray"],[12,"water-pulse"],[15,"brine"],[16,"wide-guard"],[20,"agility"],[24,"bubble-beam"],[28,"headbutt"],[30,"scald"],[32,"air-slash"],[36,"aqua-ring"],[40,"bounce"],[44,"take-down"],[45,"surf"],[48,"hydro-pump"],[65,"hurricane"]],"g":false,"m":false},"227":{"n":"盔甲鸟","t":["steel","flying"],"s":[65,80,140,40,70,70],"l":[[1,"leer"],[1,"peck"],[4,"sand-attack"],[8,"fury-attack"],[12,"metal-claw"],[15,"aerial-ace"],[16,"agility"],[20,"wing-attack"],[24,"slash"],[28,"steel-wing"],[30,"dual-wingbeat"],[30,"iron-head"],[32,"autotomize"],[32,"payback"],[36,"drill-peck"],[40,"metal-sound"],[44,"spikes"],[45,"fly"],[48,"iron-defense"],[52,"brave-bird"],[53,"night-slash"]],"g":false,"m":false},"228":{"n":"戴鲁比","t":["dark","fire"],"s":[45,60,30,80,50,65],"l":[[1,"ember"],[1,"leer"],[4,"howl"],[8,"smog"],[13,"roar"],[15,"payback"],[15,"snarl"],[16,"bite"],[20,"incinerate"],[20,"odor-sleuth"],[20,"taunt"],[25,"beat-up"],[28,"fire-fang"],[30,"burning-jealousy"],[30,"dark-pulse"],[30,"lash-out"],[32,"torment"],[37,"comeuppance"],[37,"embargo"],[40,"foul-play"],[44,"flamethrower"],[45,"heat-wave"],[49,"crunch"],[52,"nasty-plot"],[56,"inferno"],[65,"fire-blast"],[85,"overheat"]],"g":false,"m":false},"229":{"n":"黑鲁加","t":["dark","fire"],"s":[75,90,50,110,80,95],"l":[[1,"ember"],[1,"leer"],[4,"howl"],[8,"smog"],[13,"roar"],[15,"flame-charge"],[15,"payback"],[15,"snarl"],[16,"bite"],[20,"incinerate"],[20,"odor-sleuth"],[20,"taunt"],[26,"beat-up"],[30,"burning-jealousy"],[30,"dark-pulse"],[30,"fire-fang"],[30,"lash-out"],[35,"torment"],[37,"embargo"],[41,"comeuppance"],[45,"foul-play"],[45,"heat-wave"],[50,"flamethrower"],[52,"nasty-plot"],[56,"crunch"],[62,"inferno"],[65,"fire-blast"],[85,"overheat"]],"g":false,"m":false},"230":{"n":"刺龙王","t":["water","dragon"],"s":[75,95,95,95,95,85],"l":[[1,"leer"],[1,"water-gun"],[5,"smokescreen"],[10,"twister"],[15,"breaking-swipe"],[15,"brine"],[15,"chilling-water"],[15,"focus-energy"],[20,"dragon-breath"],[25,"bubble-beam"],[30,"agility"],[30,"scald"],[30,"scale-shot"],[35,"laser-focus"],[37,"water-pulse"],[44,"dragon-pulse"],[51,"hydro-pump"],[58,"dragon-dance"],[65,"rain-dance"],[72,"wave-crash"],[85,"draco-meteor"],[85,"outrage"]],"g":false,"m":false},"231":{"n":"小小象","t":["ground"],"s":[90,60,60,40,40,40],"l":[[1,"defense-curl"],[1,"growl"],[1,"odor-sleuth"],[1,"tackle"],[6,"flail"],[10,"rollout"],[15,"bulldoze"],[15,"natural-gift"],[19,"endure"],[24,"slam"],[28,"take-down"],[30,"dig"],[30,"stomping-tantrum"],[33,"charm"],[37,"last-resort"],[42,"double-edge"],[45,"high-horsepower"],[65,"earthquake"]],"g":false,"m":false},"232":{"n":"顿甲","t":["ground"],"s":[90,120,120,60,60,50],"l":[[0,"fury-attack"],[1,"defense-curl"],[1,"growl"],[1,"odor-sleuth"],[1,"tackle"],[6,"flail"],[6,"rapid-spin"],[10,"rollout"],[15,"assurance"],[15,"bulldoze"],[15,"natural-gift"],[19,"endure"],[19,"knock-off"],[24,"slam"],[28,"take-down"],[30,"dig"],[30,"rock-tomb"],[30,"stomping-tantrum"],[33,"charm"],[37,"last-resort"],[37,"scary-face"],[42,"double-edge"],[43,"earthquake"],[45,"high-horsepower"],[50,"giga-impact"]],"g":false,"m":false},"233":{"n":"多边兽２型","t":["normal"],"s":[85,80,90,105,95,60],"l":[[1,"conversion"],[1,"tackle"],[4,"sharpen"],[5,"recycle"],[10,"magnet-rise"],[15,"swift"],[15,"thunder-shock"],[18,"barrier"],[20,"psybeam"],[24,"defense-curl"],[25,"conversion-2"],[27,"thunder-wave"],[29,"signal-beam"],[30,"agility"],[30,"tera-blast"],[35,"recover"],[40,"discharge"],[45,"tri-attack"],[50,"double-edge"],[50,"lock-on"],[50,"magic-coat"],[55,"zap-cannon"],[60,"hyper-beam"]],"g":false,"m":false},"234":{"n":"惊角鹿","t":["normal"],"s":[73,95,62,85,65,85],"l":[[1,"me-first"],[1,"tackle"],[3,"leer"],[7,"astonish"],[10,"hypnosis"],[13,"stomp"],[16,"sand-attack"],[21,"take-down"],[23,"confuse-ray"],[27,"calm-mind"],[32,"role-play"],[37,"zen-headbutt"],[43,"jump-kick"],[43,"lunge"],[49,"imprison"],[50,"captivate"],[50,"entrainment"],[55,"double-edge"]],"g":false,"m":false},"235":{"n":"图图犬","t":["normal"],"s":[55,20,35,20,45,75],"l":[[1,"sketch"]],"g":false,"m":false},"236":{"n":"无畏小子","t":["fighting"],"s":[35,35,35,35,35,35],"l":[[1,"fake-out"],[1,"focus-energy"],[1,"foresight"],[1,"helping-hand"],[1,"tackle"],[15,"low-kick"],[15,"low-sweep"],[15,"rock-smash"],[30,"brick-break"]],"g":false,"m":false},"237":{"n":"战舞郎","t":["fighting"],"s":[50,95,95,35,110,70],"l":[[0,"triple-kick"],[1,"fake-out"],[1,"focus-energy"],[1,"foresight"],[1,"helping-hand"],[1,"tackle"],[4,"quick-attack"],[8,"gyro-ball"],[10,"pursuit"],[12,"detect"],[15,"low-kick"],[15,"low-sweep"],[15,"rock-smash"],[16,"rapid-spin"],[21,"quick-guard"],[21,"wide-guard"],[24,"sucker-punch"],[28,"agility"],[30,"brick-break"],[32,"dig"],[36,"close-combat"],[40,"counter"],[44,"endeavor"]],"g":false,"m":false},"238":{"n":"迷唇娃","t":["ice","psychic"],"s":[45,30,15,85,65,65],"l":[[1,"lick"],[1,"pound"],[4,"powder-snow"],[8,"copycat"],[12,"confusion"],[15,"frost-breath"],[15,"icy-wind"],[16,"covet"],[20,"sing"],[24,"fake-tears"],[28,"ice-punch"],[30,"psyshock"],[31,"lucky-chant"],[32,"psychic"],[36,"sweet-kiss"],[40,"mean-look"],[44,"perish-song"],[45,"ice-beam"],[48,"blizzard"]],"g":false,"m":false},"239":{"n":"电击怪","t":["electric"],"s":[45,63,37,65,55,95],"l":[[1,"leer"],[1,"quick-attack"],[4,"thunder-shock"],[8,"charge"],[12,"swift"],[15,"charge-beam"],[15,"electro-ball"],[15,"electroweb"],[16,"shock-wave"],[20,"thunder-wave"],[24,"screech"],[28,"thunder-punch"],[32,"discharge"],[36,"low-kick"],[40,"thunderbolt"],[44,"light-screen"],[48,"thunder"],[85,"zap-cannon"]],"g":false,"m":false},"240":{"n":"鸭嘴宝宝","t":["fire"],"s":[45,75,37,70,55,83],"l":[[1,"leer"],[1,"smog"],[4,"ember"],[8,"smokescreen"],[12,"clear-smog"],[12,"feint-attack"],[15,"flame-charge"],[15,"incinerate"],[16,"flame-wheel"],[20,"confuse-ray"],[22,"flame-burst"],[24,"scary-face"],[28,"fire-punch"],[32,"lava-plume"],[36,"low-kick"],[40,"flamethrower"],[44,"sunny-day"],[45,"heat-wave"],[48,"fire-blast"],[85,"flare-blitz"],[85,"overheat"]],"g":false,"m":false},"241":{"n":"大奶罐","t":["normal"],"s":[95,80,105,40,70,100],"l":[[1,"growl"],[1,"tackle"],[5,"rollout"],[10,"defense-curl"],[15,"bide"],[15,"stomp"],[20,"heal-bell"],[25,"headbutt"],[30,"mega-punch"],[30,"zen-headbutt"],[35,"captivate"],[35,"milk-drink"],[40,"body-slam"],[41,"gyro-ball"],[45,"play-rough"],[50,"charm"],[50,"wake-up-slap"],[55,"high-horsepower"],[85,"mega-kick"]],"g":false,"m":false},"242":{"n":"幸福蛋","t":["normal"],"s":[255,10,10,75,135,55],"l":[[1,"charm"],[1,"copycat"],[1,"covet"],[1,"defense-curl"],[1,"disarming-voice"],[1,"minimize"],[1,"pound"],[1,"sweet-kiss"],[4,"tail-whip"],[5,"growl"],[8,"echoed-voice"],[9,"refresh"],[12,"life-dew"],[15,"hidden-power"],[16,"sing"],[20,"bestow"],[20,"fling"],[24,"take-down"],[28,"heal-pulse"],[30,"tera-blast"],[32,"helping-hand"],[36,"light-screen"],[40,"double-edge"],[44,"soft-boiled"],[45,"uproar"],[48,"last-resort"],[52,"healing-wish"]],"g":false,"m":false},"243":{"n":"雷公","t":["electric"],"s":[90,85,75,115,100,115],"l":[[1,"charge"],[1,"extreme-speed"],[1,"leer"],[1,"quick-attack"],[1,"thunder-shock"],[6,"spark"],[12,"bite"],[15,"charge-beam"],[15,"electroweb"],[15,"shock-wave"],[18,"calm-mind"],[24,"roar"],[30,"thunder-fang"],[30,"volt-switch"],[36,"howl"],[42,"crunch"],[45,"thunderbolt"],[48,"extrasensory"],[54,"discharge"],[60,"reflect"],[66,"rain-dance"],[72,"thunder"],[78,"zap-cannon"]],"g":true,"m":false},"244":{"n":"炎帝","t":["fire"],"s":[115,115,85,90,75,100],"l":[[1,"ember"],[1,"extreme-speed"],[1,"leer"],[1,"sacred-fire"],[1,"smokescreen"],[1,"stomp"],[6,"flame-wheel"],[12,"bite"],[18,"calm-mind"],[24,"roar"],[30,"fire-fang"],[36,"scary-face"],[42,"crunch"],[48,"extrasensory"],[54,"lava-plume"],[60,"swagger"],[66,"sunny-day"],[72,"fire-blast"],[78,"eruption"],[85,"flare-blitz"]],"g":true,"m":false},"245":{"n":"水君","t":["water"],"s":[100,75,115,90,115,85],"l":[[1,"bubble-beam"],[1,"extreme-speed"],[1,"gust"],[1,"leer"],[1,"mist"],[1,"sheer-cold"],[1,"water-gun"],[6,"water-pulse"],[12,"bite"],[18,"calm-mind"],[24,"roar"],[29,"aurora-beam"],[30,"ice-fang"],[30,"scald"],[30,"waterfall"],[36,"tailwind"],[42,"crunch"],[48,"extrasensory"],[54,"surf"],[60,"mirror-coat"],[66,"rain-dance"],[72,"hydro-pump"],[78,"blizzard"]],"g":true,"m":false},"246":{"n":"幼基拉斯","t":["rock","ground"],"s":[50,64,50,45,50,41],"l":[[1,"leer"],[1,"tackle"],[3,"rock-throw"],[6,"payback"],[9,"bite"],[12,"scary-face"],[14,"chip-away"],[15,"bulldoze"],[15,"mud-shot"],[15,"mud-slap"],[15,"rock-slide"],[15,"sand-tomb"],[18,"stomping-tantrum"],[21,"screech"],[24,"smack-down"],[27,"crunch"],[30,"dig"],[30,"rock-blast"],[31,"earthquake"],[33,"stone-edge"],[36,"thrash"],[39,"sandstorm"],[42,"hyper-beam"]],"g":false,"m":false},"247":{"n":"沙基拉斯","t":["rock","ground"],"s":[70,84,70,65,70,51],"l":[[0,"iron-defense"],[1,"leer"],[1,"tackle"],[3,"rock-throw"],[6,"payback"],[9,"bite"],[12,"scary-face"],[14,"chip-away"],[15,"bulldoze"],[15,"mud-shot"],[15,"mud-slap"],[15,"rock-slide"],[15,"sand-tomb"],[18,"stomping-tantrum"],[21,"screech"],[24,"dark-pulse"],[24,"smack-down"],[27,"crunch"],[30,"dig"],[30,"rock-blast"],[33,"earthquake"],[37,"stone-edge"],[42,"thrash"],[47,"sandstorm"],[52,"hyper-beam"]],"g":false,"m":false},"248":{"n":"班基拉斯","t":["rock","dark"],"s":[100,134,110,95,100,61],"l":[[0,"iron-defense"],[1,"leer"],[1,"tackle"],[3,"rock-throw"],[6,"payback"],[9,"bite"],[12,"scary-face"],[14,"chip-away"],[15,"bulldoze"],[15,"knock-off"],[15,"mud-shot"],[15,"mud-slap"],[15,"rock-slide"],[15,"sand-tomb"],[18,"stomping-tantrum"],[21,"screech"],[24,"dark-pulse"],[24,"smack-down"],[27,"crunch"],[30,"dig"],[30,"rock-blast"],[33,"earthquake"],[37,"stone-edge"],[42,"thrash"],[45,"foul-play"],[47,"sandstorm"],[52,"hyper-beam"],[59,"giga-impact"]],"g":false,"m":false},"249":{"n":"洛奇亚","t":["psychic","flying"],"s":[106,90,130,90,154,110],"l":[[1,"ancient-power"],[1,"dragon-rush"],[1,"gust"],[1,"weather-ball"],[1,"whirlwind"],[9,"mist"],[15,"acrobatics"],[15,"air-cutter"],[18,"safeguard"],[27,"calm-mind"],[30,"air-slash"],[30,"dual-wingbeat"],[30,"psychic-noise"],[30,"zen-headbutt"],[36,"extrasensory"],[43,"swift"],[45,"fly"],[45,"psychic"],[45,"recover"],[50,"punishment"],[54,"aeroblast"],[63,"rain-dance"],[65,"hurricane"],[72,"hydro-pump"],[81,"future-sight"],[85,"brave-bird"],[85,"natural-gift"],[90,"sky-attack"]],"g":true,"m":false},"250":{"n":"凤王","t":["fire","flying"],"s":[106,130,90,110,154,90],"l":[[1,"ancient-power"],[1,"gust"],[1,"weather-ball"],[1,"whirlwind"],[9,"life-dew"],[15,"brave-bird"],[15,"fire-spin"],[15,"flame-charge"],[15,"incinerate"],[18,"safeguard"],[27,"calm-mind"],[30,"mystical-fire"],[36,"extrasensory"],[43,"swift"],[45,"flamethrower"],[45,"heat-wave"],[45,"recover"],[50,"punishment"],[54,"sacred-fire"],[63,"sunny-day"],[72,"fire-blast"],[81,"future-sight"],[85,"flare-blitz"],[85,"natural-gift"],[90,"sky-attack"],[99,"overheat"]],"g":true,"m":false},"251":{"n":"时拉比","t":["psychic","grass"],"s":[100,100,100,100,100,100],"l":[[1,"confusion"],[1,"heal-bell"],[10,"magical-leaf"],[10,"safeguard"],[20,"baton-pass"],[30,"ancient-power"],[30,"giga-drain"],[30,"psycho-cut"],[30,"seed-bomb"],[30,"zen-headbutt"],[40,"life-dew"],[45,"leaf-blade"],[45,"psychic"],[46,"natural-gift"],[50,"leech-seed"],[55,"heal-block"],[60,"recover"],[70,"future-sight"],[80,"healing-wish"],[85,"solar-beam"],[85,"solar-blade"],[90,"leaf-storm"],[100,"perish-song"]],"g":false,"m":true},"252":{"n":"木守宫","t":["grass"],"s":[40,45,35,65,55,70],"l":[[1,"leer"],[1,"pound"],[3,"leafage"],[6,"quick-attack"],[9,"mega-drain"],[12,"detect"],[15,"magical-leaf"],[15,"quick-guard"],[17,"pursuit"],[18,"assurance"],[21,"giga-drain"],[24,"slam"],[25,"agility"],[27,"double-team"],[30,"energy-ball"],[33,"screech"],[36,"endeavor"],[39,"leaf-storm"]],"g":false,"m":false},"253":{"n":"森林蜥蜴","t":["grass"],"s":[50,65,45,85,65,95],"l":[[0,"fury-cutter"],[1,"leer"],[1,"pound"],[3,"leafage"],[6,"quick-attack"],[9,"mega-drain"],[12,"detect"],[15,"magical-leaf"],[15,"quick-guard"],[17,"pursuit"],[20,"assurance"],[25,"agility"],[25,"giga-drain"],[30,"energy-ball"],[30,"slam"],[35,"double-team"],[40,"leaf-blade"],[43,"x-scissor"],[45,"screech"],[50,"endeavor"],[55,"leaf-storm"]],"g":false,"m":false},"254":{"n":"蜥蜴王","t":["grass"],"s":[70,85,65,105,85,120],"l":[[0,"dual-chop"],[0,"fury-cutter"],[0,"leaf-blade"],[1,"leer"],[1,"pound"],[3,"leafage"],[5,"mega-drain"],[6,"quick-attack"],[12,"detect"],[15,"magical-leaf"],[15,"quick-guard"],[17,"pursuit"],[20,"assurance"],[25,"agility"],[25,"giga-drain"],[30,"energy-ball"],[30,"slam"],[35,"double-team"],[42,"screech"],[43,"x-scissor"],[49,"endeavor"],[56,"leaf-storm"]],"g":false,"m":false},"255":{"n":"火稚鸡","t":["fire"],"s":[45,60,40,70,50,45],"l":[[1,"growl"],[1,"scratch"],[3,"ember"],[6,"quick-attack"],[9,"flame-charge"],[12,"detect"],[14,"peck"],[15,"incinerate"],[15,"sand-attack"],[18,"aerial-ace"],[21,"slash"],[24,"bounce"],[27,"focus-energy"],[28,"flame-burst"],[30,"flamethrower"],[33,"feather-dance"],[36,"reversal"],[39,"flare-blitz"],[41,"mirror-move"],[65,"fire-blast"],[85,"overheat"]],"g":false,"m":false},"256":{"n":"力壮鸡","t":["fire","fighting"],"s":[60,85,60,85,60,55],"l":[[0,"double-kick"],[1,"growl"],[1,"scratch"],[3,"ember"],[6,"quick-attack"],[9,"flame-charge"],[12,"detect"],[14,"peck"],[15,"incinerate"],[15,"low-sweep"],[15,"sand-attack"],[20,"aerial-ace"],[25,"slash"],[28,"flame-burst"],[30,"bounce"],[30,"brick-break"],[30,"flamethrower"],[33,"feather-dance"],[35,"focus-energy"],[40,"blaze-kick"],[41,"mirror-move"],[45,"bulk-up"],[50,"reversal"],[53,"sky-uppercut"],[55,"flare-blitz"],[65,"fire-blast"],[85,"close-combat"],[85,"overheat"]],"g":false,"m":false},"257":{"n":"火焰鸡","t":["fire","fighting"],"s":[80,120,70,110,70,80],"l":[[0,"blaze-kick"],[0,"double-kick"],[1,"growl"],[1,"scratch"],[3,"ember"],[6,"quick-attack"],[9,"flame-charge"],[12,"detect"],[14,"peck"],[15,"incinerate"],[15,"low-sweep"],[15,"sand-attack"],[20,"aerial-ace"],[25,"slash"],[28,"flame-burst"],[30,"bounce"],[30,"brick-break"],[30,"flamethrower"],[33,"feather-dance"],[35,"focus-energy"],[41,"mirror-move"],[42,"bulk-up"],[49,"reversal"],[53,"sky-uppercut"],[56,"flare-blitz"],[63,"brave-bird"],[65,"fire-blast"],[85,"close-combat"],[85,"overheat"]],"g":false,"m":false},"258":{"n":"水跃鱼","t":["water"],"s":[50,70,50,50,50,40],"l":[[1,"growl"],[1,"tackle"],[3,"water-gun"],[6,"rock-smash"],[9,"mud-slap"],[9,"rock-throw"],[12,"foresight"],[12,"protect"],[15,"chilling-water"],[15,"supersonic"],[17,"bide"],[18,"water-pulse"],[20,"mud-sport"],[21,"rock-slide"],[24,"take-down"],[27,"amnesia"],[30,"surf"],[30,"waterfall"],[33,"screech"],[36,"endeavor"],[39,"hydro-pump"],[45,"liquidation"]],"g":false,"m":false},"259":{"n":"沼跃鱼","t":["water","ground"],"s":[70,85,70,60,70,50],"l":[[0,"mud-shot"],[1,"growl"],[1,"tackle"],[3,"water-gun"],[6,"rock-smash"],[9,"mud-slap"],[9,"rock-throw"],[12,"foresight"],[12,"protect"],[15,"bulldoze"],[15,"chilling-water"],[15,"supersonic"],[17,"bide"],[20,"mud-sport"],[20,"water-pulse"],[22,"mud-bomb"],[25,"rock-slide"],[30,"dig"],[30,"surf"],[30,"take-down"],[30,"waterfall"],[35,"amnesia"],[40,"muddy-water"],[45,"liquidation"],[45,"screech"],[48,"earthquake"],[50,"endeavor"],[55,"hydro-pump"]],"g":false,"m":false},"260":{"n":"巨沼怪","t":["water","ground"],"s":[100,110,90,85,90,60],"l":[[0,"mud-shot"],[1,"growl"],[1,"tackle"],[3,"water-gun"],[6,"rock-smash"],[9,"mud-slap"],[9,"rock-throw"],[12,"foresight"],[12,"protect"],[15,"bulldoze"],[15,"chilling-water"],[15,"flip-turn"],[15,"supersonic"],[17,"bide"],[20,"mud-sport"],[20,"water-pulse"],[22,"mud-bomb"],[25,"rock-slide"],[30,"dig"],[30,"surf"],[30,"take-down"],[30,"waterfall"],[35,"amnesia"],[42,"muddy-water"],[45,"high-horsepower"],[45,"liquidation"],[48,"earthquake"],[49,"screech"],[56,"endeavor"],[63,"hammer-arm"],[63,"hydro-pump"]],"g":false,"m":false},"261":{"n":"土狼犬","t":["dark"],"s":[35,55,35,30,30,35],"l":[[1,"tackle"],[4,"howl"],[7,"sand-attack"],[10,"bite"],[13,"leer"],[13,"mud-slap"],[13,"odor-sleuth"],[16,"roar"],[19,"swagger"],[22,"assurance"],[25,"scary-face"],[28,"embargo"],[28,"headbutt"],[28,"taunt"],[30,"lash-out"],[31,"crunch"],[34,"yawn"],[36,"take-down"],[40,"sucker-punch"],[44,"play-rough"],[45,"foul-play"]],"g":false,"m":false},"262":{"n":"大狼犬","t":["dark"],"s":[70,90,70,60,60,70],"l":[[0,"snarl"],[1,"tackle"],[7,"sand-attack"],[10,"bite"],[13,"howl"],[13,"leer"],[13,"mud-slap"],[13,"odor-sleuth"],[16,"roar"],[20,"swagger"],[24,"assurance"],[28,"embargo"],[28,"headbutt"],[28,"scary-face"],[30,"crunch"],[30,"lash-out"],[36,"taunt"],[44,"yawn"],[45,"foul-play"],[48,"take-down"],[52,"sucker-punch"],[56,"play-rough"]],"g":false,"m":false},"263":{"n":"蛇纹熊","t":["normal"],"s":[38,30,41,30,41,60],"l":[[1,"growl"],[1,"tackle"],[3,"sand-attack"],[6,"tail-whip"],[9,"covet"],[12,"headbutt"],[13,"odor-sleuth"],[15,"baby-doll-eyes"],[17,"mud-sport"],[18,"pin-missile"],[21,"rest"],[24,"take-down"],[25,"bestow"],[27,"fling"],[30,"flail"],[33,"belly-drum"],[36,"double-edge"]],"g":false,"m":false},"264":{"n":"直冲熊","t":["normal"],"s":[78,70,61,50,61,100],"l":[[0,"slash"],[1,"growl"],[1,"tackle"],[3,"sand-attack"],[6,"tail-whip"],[9,"covet"],[12,"headbutt"],[13,"odor-sleuth"],[15,"baby-doll-eyes"],[15,"hone-claws"],[17,"mud-sport"],[18,"fury-swipes"],[18,"pin-missile"],[23,"rest"],[25,"bestow"],[28,"take-down"],[33,"fling"],[38,"flail"],[43,"belly-drum"],[48,"double-edge"]],"g":false,"m":false},"265":{"n":"刺尾虫","t":["bug"],"s":[45,45,35,20,30,20],"l":[[1,"string-shot"],[1,"tackle"],[5,"poison-sting"],[15,"bug-bite"]],"g":false,"m":false},"266":{"n":"甲壳茧","t":["bug"],"s":[50,35,55,25,25,15],"l":[[0,"harden"],[1,"string-shot"],[1,"tackle"],[5,"poison-sting"],[15,"bug-bite"]],"g":false,"m":false},"267":{"n":"狩猎凤蝶","t":["bug","flying"],"s":[60,70,50,100,50,65],"l":[[0,"gust"],[0,"harden"],[1,"string-shot"],[1,"tackle"],[5,"poison-sting"],[12,"absorb"],[15,"aerial-ace"],[15,"bug-bite"],[15,"struggle-bug"],[15,"stun-spore"],[17,"morning-sun"],[20,"air-cutter"],[22,"mega-drain"],[25,"leech-life"],[25,"silver-wind"],[27,"attract"],[30,"whirlwind"],[32,"giga-drain"],[35,"bug-buzz"],[37,"protect"],[40,"quiver-dance"]],"g":false,"m":false},"268":{"n":"盾甲茧","t":["bug"],"s":[50,35,55,25,25,15],"l":[[0,"harden"],[1,"string-shot"],[1,"tackle"],[5,"poison-sting"],[15,"bug-bite"]],"g":false,"m":false},"269":{"n":"毒粉蛾","t":["bug","poison"],"s":[60,50,70,50,90,65],"l":[[0,"gust"],[0,"harden"],[1,"string-shot"],[1,"tackle"],[5,"poison-sting"],[12,"confusion"],[15,"bug-bite"],[15,"poison-powder"],[17,"moonlight"],[20,"venoshock"],[22,"psybeam"],[25,"leech-life"],[27,"light-screen"],[30,"whirlwind"],[32,"toxic"],[35,"bug-buzz"],[37,"protect"],[40,"quiver-dance"],[45,"sludge-bomb"]],"g":false,"m":false},"270":{"n":"莲叶童子","t":["water","grass"],"s":[40,30,30,40,50,30],"l":[[1,"astonish"],[1,"growl"],[3,"absorb"],[6,"water-gun"],[9,"mist"],[12,"mega-drain"],[12,"natural-gift"],[15,"chilling-water"],[15,"grassy-glide"],[15,"magical-leaf"],[15,"water-pulse"],[16,"flail"],[20,"bubble-beam"],[24,"leech-seed"],[24,"nature-power"],[28,"giga-drain"],[30,"scald"],[33,"rain-dance"],[38,"zen-headbutt"],[43,"energy-ball"],[45,"surf"],[85,"solar-beam"]],"g":false,"m":false},"271":{"n":"莲帽小童","t":["water","grass"],"s":[60,50,50,60,70,50],"l":[[1,"astonish"],[1,"growl"],[3,"absorb"],[6,"water-gun"],[9,"mist"],[12,"mega-drain"],[12,"natural-gift"],[15,"chilling-water"],[15,"grassy-glide"],[15,"magical-leaf"],[15,"water-pulse"],[16,"fake-out"],[16,"flail"],[18,"fury-swipes"],[20,"water-sport"],[24,"bubble-beam"],[24,"nature-power"],[30,"leech-seed"],[30,"scald"],[32,"uproar"],[33,"rain-dance"],[36,"giga-drain"],[36,"knock-off"],[45,"surf"],[50,"zen-headbutt"],[57,"energy-ball"],[64,"hydro-pump"],[85,"solar-beam"]],"g":false,"m":false},"272":{"n":"乐天河童","t":["water","grass"],"s":[80,70,70,90,100,70],"l":[[1,"astonish"],[1,"growl"],[3,"absorb"],[6,"water-gun"],[9,"mist"],[12,"mega-drain"],[12,"natural-gift"],[15,"chilling-water"],[15,"grassy-glide"],[15,"magical-leaf"],[15,"water-pulse"],[16,"fake-out"],[16,"flail"],[18,"fury-swipes"],[20,"water-sport"],[24,"bubble-beam"],[24,"nature-power"],[30,"leech-seed"],[30,"scald"],[32,"uproar"],[33,"rain-dance"],[36,"giga-drain"],[36,"knock-off"],[45,"surf"],[50,"zen-headbutt"],[57,"energy-ball"],[64,"hydro-pump"],[85,"leaf-storm"],[85,"solar-beam"]],"g":false,"m":false},"273":{"n":"橡实果","t":["grass"],"s":[40,40,50,30,30,30],"l":[[1,"bide"],[1,"harden"],[1,"tackle"],[3,"absorb"],[6,"astonish"],[9,"growth"],[12,"rollout"],[15,"grassy-glide"],[15,"mega-drain"],[15,"trailblaze"],[18,"payback"],[21,"headbutt"],[21,"nature-power"],[24,"sunny-day"],[27,"synthesis"],[30,"bullet-seed"],[30,"giga-drain"],[30,"seed-bomb"],[30,"sucker-punch"],[33,"explosion"],[85,"leaf-storm"],[85,"solar-beam"]],"g":false,"m":false},"274":{"n":"长鼻叶","t":["grass","dark"],"s":[70,70,40,60,40,60],"l":[[0,"razor-leaf"],[1,"bide"],[1,"harden"],[1,"tackle"],[3,"absorb"],[6,"astonish"],[9,"growth"],[9,"torment"],[12,"fake-out"],[12,"rollout"],[15,"beat-up"],[15,"fling"],[15,"grassy-glide"],[15,"knock-off"],[15,"snarl"],[15,"thief"],[15,"trailblaze"],[18,"mega-drain"],[20,"razor-wind"],[21,"headbutt"],[21,"nature-power"],[24,"feint-attack"],[24,"payback"],[30,"bullet-seed"],[30,"giga-drain"],[30,"lash-out"],[30,"seed-bomb"],[30,"synthesis"],[32,"swagger"],[33,"explosion"],[36,"sunny-day"],[43,"extrasensory"],[45,"foul-play"],[50,"sucker-punch"],[57,"leaf-blade"],[85,"leaf-storm"],[85,"solar-beam"],[85,"solar-blade"]],"g":false,"m":false},"275":{"n":"狡猾天狗","t":["grass","dark"],"s":[90,100,60,90,60,80],"l":[[0,"leaf-blade"],[0,"razor-leaf"],[1,"bide"],[1,"harden"],[1,"tackle"],[3,"absorb"],[6,"astonish"],[9,"growth"],[9,"torment"],[12,"fake-out"],[12,"rollout"],[15,"beat-up"],[15,"fling"],[15,"grassy-glide"],[15,"knock-off"],[15,"snarl"],[15,"thief"],[15,"trailblaze"],[18,"mega-drain"],[20,"razor-wind"],[21,"headbutt"],[21,"nature-power"],[24,"feint-attack"],[24,"payback"],[30,"bullet-seed"],[30,"giga-drain"],[30,"lash-out"],[30,"seed-bomb"],[30,"synthesis"],[30,"throat-chop"],[32,"hurricane"],[32,"swagger"],[33,"explosion"],[36,"sunny-day"],[43,"extrasensory"],[45,"foul-play"],[50,"sucker-punch"],[85,"leaf-storm"],[85,"solar-beam"],[85,"solar-blade"]],"g":false,"m":false},"276":{"n":"傲骨燕","t":["normal","flying"],"s":[40,55,30,30,30,85],"l":[[1,"growl"],[1,"peck"],[5,"focus-energy"],[9,"quick-attack"],[13,"wing-attack"],[17,"double-team"],[21,"aerial-ace"],[25,"quick-guard"],[29,"agility"],[30,"facade"],[33,"air-slash"],[37,"endeavor"],[41,"brave-bird"],[45,"reversal"]],"g":false,"m":false},"277":{"n":"大王燕","t":["normal","flying"],"s":[60,85,60,75,50,125],"l":[[1,"growl"],[1,"peck"],[5,"focus-energy"],[9,"quick-attack"],[13,"wing-attack"],[15,"hidden-power"],[17,"double-team"],[21,"aerial-ace"],[27,"quick-guard"],[30,"facade"],[33,"agility"],[33,"air-slash"],[41,"brave-bird"],[45,"endeavor"],[57,"reversal"]],"g":false,"m":false},"278":{"n":"长翅鸥","t":["water","flying"],"s":[40,30,30,55,30,85],"l":[[1,"growl"],[1,"water-gun"],[5,"quick-attack"],[10,"supersonic"],[15,"brine"],[15,"chilling-water"],[15,"wing-attack"],[20,"water-pulse"],[22,"air-cutter"],[26,"agility"],[26,"pursuit"],[30,"air-slash"],[30,"scald"],[35,"mist"],[40,"roost"],[45,"hurricane"],[45,"surf"],[65,"hydro-pump"]],"g":false,"m":false},"279":{"n":"大嘴鸥","t":["water","flying"],"s":[60,50,100,95,70,65],"l":[[0,"protect"],[1,"growl"],[1,"water-gun"],[5,"quick-attack"],[10,"supersonic"],[15,"air-cutter"],[15,"brine"],[15,"chilling-water"],[15,"wing-attack"],[19,"payback"],[20,"water-pulse"],[26,"agility"],[26,"pursuit"],[28,"spit-up"],[28,"stockpile"],[28,"swallow"],[30,"air-slash"],[30,"scald"],[34,"fling"],[41,"mist"],[44,"tailwind"],[45,"surf"],[48,"roost"],[55,"hurricane"],[62,"hydro-pump"]],"g":false,"m":false},"280":{"n":"拉鲁拉丝","t":["psychic","fairy"],"s":[28,25,25,45,35,40],"l":[[1,"disarming-voice"],[1,"growl"],[3,"double-team"],[6,"confusion"],[9,"hypnosis"],[12,"draining-kiss"],[14,"lucky-chant"],[15,"teleport"],[17,"magical-leaf"],[18,"psybeam"],[21,"life-dew"],[24,"charm"],[27,"calm-mind"],[29,"imprison"],[30,"dazzling-gleam"],[30,"psychic"],[33,"heal-pulse"],[36,"dream-eater"],[39,"future-sight"]],"g":false,"m":false},"281":{"n":"奇鲁莉安","t":["psychic","fairy"],"s":[38,35,35,65,55,50],"l":[[1,"disarming-voice"],[1,"growl"],[3,"double-team"],[6,"confusion"],[9,"hypnosis"],[12,"draining-kiss"],[14,"lucky-chant"],[15,"teleport"],[17,"magical-leaf"],[18,"psybeam"],[23,"life-dew"],[28,"charm"],[29,"imprison"],[30,"dazzling-gleam"],[33,"calm-mind"],[38,"psychic"],[43,"heal-pulse"],[48,"dream-eater"],[53,"future-sight"]],"g":false,"m":false},"282":{"n":"沙奈朵","t":["psychic","fairy"],"s":[68,65,65,125,115,80],"l":[[0,"dazzling-gleam"],[1,"disarming-voice"],[1,"growl"],[3,"double-team"],[6,"confusion"],[9,"hypnosis"],[12,"draining-kiss"],[14,"lucky-chant"],[15,"teleport"],[17,"magical-leaf"],[18,"psybeam"],[23,"life-dew"],[28,"charm"],[28,"wish"],[29,"imprison"],[35,"calm-mind"],[42,"psychic"],[43,"heal-pulse"],[44,"captivate"],[49,"moonblast"],[56,"dream-eater"],[63,"future-sight"]],"g":false,"m":false},"283":{"n":"溜溜糖球","t":["bug","water"],"s":[40,30,32,50,52,65],"l":[[1,"water-gun"],[6,"quick-attack"],[9,"sweet-scent"],[14,"soak"],[14,"water-sport"],[15,"chilling-water"],[15,"infestation"],[15,"struggle-bug"],[15,"water-pulse"],[17,"bubble-beam"],[22,"agility"],[25,"haze"],[25,"mist"],[30,"scald"],[35,"baton-pass"],[38,"sticky-web"],[45,"bug-buzz"],[45,"surf"],[65,"hydro-pump"]],"g":false,"m":false},"284":{"n":"雨翅蛾","t":["bug","flying"],"s":[70,60,62,100,82,80],"l":[[1,"water-gun"],[6,"quick-attack"],[9,"sweet-scent"],[14,"soak"],[14,"water-sport"],[15,"acrobatics"],[15,"aerial-ace"],[15,"chilling-water"],[15,"infestation"],[15,"struggle-bug"],[15,"water-pulse"],[17,"bubble-beam"],[17,"gust"],[22,"agility"],[22,"air-cutter"],[22,"scary-face"],[25,"haze"],[25,"mist"],[26,"stun-spore"],[30,"scald"],[32,"air-slash"],[32,"silver-wind"],[32,"supersonic"],[35,"baton-pass"],[38,"giga-drain"],[38,"sticky-web"],[44,"bug-buzz"],[45,"surf"],[48,"whirlwind"],[52,"quiver-dance"],[65,"hurricane"],[65,"hydro-pump"]],"g":false,"m":false},"285":{"n":"蘑蘑菇","t":["grass"],"s":[60,40,60,40,60,35],"l":[[1,"absorb"],[1,"tackle"],[5,"stun-spore"],[8,"leech-seed"],[12,"mega-drain"],[15,"headbutt"],[15,"magical-leaf"],[19,"poison-powder"],[22,"worry-seed"],[26,"giga-drain"],[29,"growth"],[30,"bullet-seed"],[33,"toxic"],[36,"seed-bomb"],[40,"spore"],[45,"energy-ball"],[85,"solar-beam"]],"g":false,"m":false},"286":{"n":"斗笠菇","t":["grass","fighting"],"s":[60,130,80,60,60,70],"l":[[0,"mach-punch"],[1,"absorb"],[1,"tackle"],[5,"stun-spore"],[8,"leech-seed"],[12,"mega-drain"],[15,"headbutt"],[15,"low-kick"],[15,"low-sweep"],[15,"magical-leaf"],[19,"feint"],[19,"poison-powder"],[22,"counter"],[26,"giga-drain"],[28,"force-palm"],[29,"growth"],[30,"bullet-seed"],[30,"drain-punch"],[33,"mind-reader"],[33,"toxic"],[33,"worry-seed"],[39,"brick-break"],[39,"sky-uppercut"],[40,"spore"],[44,"seed-bomb"],[45,"energy-ball"],[50,"dynamic-punch"],[55,"focus-punch"],[85,"close-combat"],[85,"solar-beam"]],"g":false,"m":false},"287":{"n":"懒人獭","t":["normal"],"s":[60,60,60,35,35,30],"l":[[1,"scratch"],[1,"yawn"],[6,"encore"],[9,"slack-off"],[14,"feint-attack"],[14,"headbutt"],[14,"rest"],[17,"amnesia"],[22,"covet"],[25,"throat-chop"],[30,"counter"],[30,"strength"],[33,"flail"],[38,"play-rough"],[45,"body-slam"],[45,"take-down"]],"g":false,"m":false},"288":{"n":"过动猿","t":["normal"],"s":[80,80,80,55,55,90],"l":[[1,"scratch"],[1,"yawn"],[6,"encore"],[9,"slack-off"],[9,"uproar"],[14,"feint-attack"],[14,"fury-swipes"],[14,"headbutt"],[14,"rest"],[17,"amnesia"],[17,"endure"],[22,"covet"],[23,"slash"],[27,"throat-chop"],[30,"strength"],[33,"counter"],[33,"flail"],[37,"focus-punch"],[38,"play-rough"],[43,"reversal"],[45,"body-slam"],[45,"take-down"],[85,"double-edge"]],"g":false,"m":false},"289":{"n":"请假王","t":["normal"],"s":[150,160,100,95,65,100],"l":[[0,"swagger"],[1,"scratch"],[1,"yawn"],[6,"encore"],[9,"slack-off"],[9,"uproar"],[14,"feint-attack"],[14,"fury-swipes"],[14,"headbutt"],[14,"rest"],[17,"amnesia"],[17,"endure"],[23,"covet"],[23,"slash"],[27,"throat-chop"],[30,"strength"],[33,"counter"],[37,"focus-punch"],[38,"play-rough"],[39,"flail"],[43,"reversal"],[45,"body-slam"],[45,"fling"],[45,"take-down"],[52,"mega-kick"],[53,"punishment"],[63,"hammer-arm"],[85,"double-edge"]],"g":false,"m":false},"290":{"n":"土居忍士","t":["bug","ground"],"s":[31,45,90,30,30,40],"l":[[1,"sand-attack"],[1,"scratch"],[5,"harden"],[5,"leech-life"],[10,"false-swipe"],[15,"mud-slap"],[21,"absorb"],[25,"metal-claw"],[29,"bide"],[30,"fury-swipes"],[35,"mind-reader"],[40,"dig"]],"g":false,"m":false},"291":{"n":"铁面忍者","t":["bug","flying"],"s":[61,90,45,50,50,160],"l":[[0,"double-team"],[0,"fury-cutter"],[0,"screech"],[1,"sand-attack"],[1,"scratch"],[5,"harden"],[5,"leech-life"],[10,"false-swipe"],[15,"acrobatics"],[15,"aerial-ace"],[15,"agility"],[15,"mud-slap"],[23,"absorb"],[25,"metal-claw"],[29,"bide"],[29,"bug-bite"],[35,"baton-pass"],[36,"fury-swipes"],[40,"dig"],[43,"mind-reader"],[50,"slash"],[57,"swords-dance"],[64,"x-scissor"]],"g":false,"m":false},"292":{"n":"脱壳忍者","t":["bug","ghost"],"s":[1,90,45,30,30,40],"l":[[1,"sand-attack"],[1,"scratch"],[5,"harden"],[5,"leech-life"],[10,"false-swipe"],[15,"confuse-ray"],[15,"hex"],[15,"mud-slap"],[23,"absorb"],[25,"metal-claw"],[29,"bide"],[29,"shadow-sneak"],[30,"shadow-claw"],[36,"fury-swipes"],[37,"grudge"],[40,"dig"],[41,"heal-block"],[43,"mind-reader"],[50,"shadow-ball"],[57,"spite"],[64,"phantom-force"]],"g":false,"m":false},"293":{"n":"咕妞妞","t":["normal"],"s":[64,51,23,51,23,28],"l":[[1,"astonish"],[1,"pound"],[5,"echoed-voice"],[10,"howl"],[15,"hidden-power"],[15,"rest"],[15,"sleep-talk"],[21,"stomp"],[25,"roar"],[30,"facade"],[30,"mega-punch"],[30,"supersonic"],[35,"uproar"],[40,"screech"],[43,"synchronoise"],[45,"hyper-voice"],[85,"mega-kick"]],"g":false,"m":false},"294":{"n":"吼爆弹","t":["normal"],"s":[84,71,43,71,43,48],"l":[[0,"bite"],[1,"astonish"],[1,"pound"],[5,"echoed-voice"],[10,"howl"],[15,"hidden-power"],[15,"rest"],[15,"sleep-talk"],[23,"stomp"],[29,"roar"],[30,"facade"],[30,"mega-punch"],[36,"supersonic"],[43,"synchronoise"],[43,"uproar"],[50,"screech"],[57,"hyper-voice"],[85,"mega-kick"]],"g":false,"m":false},"295":{"n":"爆音怪","t":["normal"],"s":[104,91,63,91,73,68],"l":[[0,"bite"],[0,"crunch"],[1,"astonish"],[1,"pound"],[5,"echoed-voice"],[10,"howl"],[15,"hidden-power"],[15,"rest"],[15,"sleep-talk"],[23,"stomp"],[29,"roar"],[30,"facade"],[30,"mega-punch"],[36,"supersonic"],[43,"synchronoise"],[45,"uproar"],[54,"screech"],[63,"hyper-voice"],[72,"boomburst"],[81,"hyper-beam"],[85,"mega-kick"]],"g":false,"m":false},"296":{"n":"幕下力士","t":["fighting"],"s":[72,60,30,20,30,25],"l":[[1,"focus-energy"],[1,"tackle"],[4,"sand-attack"],[7,"arm-thrust"],[10,"fake-out"],[13,"force-palm"],[15,"low-sweep"],[16,"whirlwind"],[19,"knock-off"],[22,"bulk-up"],[22,"vital-throw"],[25,"belly-drum"],[28,"detect"],[28,"smelling-salts"],[30,"body-press"],[30,"brick-break"],[31,"seismic-toss"],[34,"focus-punch"],[37,"endure"],[40,"close-combat"],[43,"reversal"],[46,"heavy-slam"]],"g":false,"m":false},"297":{"n":"铁掌力士","t":["fighting"],"s":[144,120,60,40,60,50],"l":[[1,"focus-energy"],[1,"tackle"],[4,"sand-attack"],[7,"arm-thrust"],[10,"fake-out"],[13,"force-palm"],[15,"low-sweep"],[16,"whirlwind"],[19,"knock-off"],[22,"bulk-up"],[22,"vital-throw"],[26,"belly-drum"],[28,"smelling-salts"],[30,"body-press"],[30,"brick-break"],[30,"detect"],[34,"seismic-toss"],[38,"focus-punch"],[42,"endure"],[46,"close-combat"],[50,"reversal"],[54,"heavy-slam"],[60,"headlong-rush"]],"g":false,"m":false},"298":{"n":"露力丽","t":["normal","fairy"],"s":[50,20,40,20,40,20],"l":[[1,"splash"],[1,"tail-whip"],[1,"water-gun"],[3,"helping-hand"],[5,"water-sport"],[6,"bubble-beam"],[9,"charm"],[12,"slam"],[15,"bounce"],[15,"draining-kiss"],[30,"alluring-voice"],[45,"body-slam"],[45,"take-down"]],"g":false,"m":false},"299":{"n":"朝北鼻","t":["rock"],"s":[30,45,135,45,90,30],"l":[[1,"tackle"],[4,"harden"],[7,"block"],[10,"rock-throw"],[13,"thunder-wave"],[15,"rock-tomb"],[16,"rest"],[19,"spark"],[22,"rock-slide"],[25,"power-gem"],[28,"rock-blast"],[31,"discharge"],[34,"sandstorm"],[37,"earth-power"],[40,"stone-edge"],[43,"lock-on"],[43,"zap-cannon"],[85,"meteor-beam"]],"g":false,"m":false},"300":{"n":"向尾喵","t":["normal"],"s":[50,45,45,35,35,50],"l":[[1,"fake-out"],[1,"growl"],[1,"tail-whip"],[4,"foresight"],[4,"tackle"],[7,"sing"],[10,"attract"],[13,"disarming-voice"],[15,"hidden-power"],[16,"fury-swipes"],[19,"copycat"],[22,"feint-attack"],[22,"payback"],[25,"charm"],[28,"wake-up-slap"],[30,"secret-power"],[31,"assist"],[31,"facade"],[34,"covet"],[37,"heal-bell"],[40,"double-edge"],[43,"baby-doll-eyes"],[43,"captivate"],[46,"play-rough"]],"g":false,"m":false},"301":{"n":"优雅猫","t":["normal"],"s":[70,65,65,55,55,90],"l":[[1,"fake-out"],[1,"growl"],[1,"tail-whip"],[4,"foresight"],[4,"tackle"],[7,"sing"],[10,"attract"],[13,"disarming-voice"],[15,"hidden-power"],[16,"fury-swipes"],[19,"copycat"],[22,"feint-attack"],[22,"payback"],[25,"charm"],[28,"wake-up-slap"],[30,"secret-power"],[30,"strength"],[31,"assist"],[31,"facade"],[34,"covet"],[37,"heal-bell"],[40,"double-edge"],[43,"baby-doll-eyes"],[43,"captivate"],[46,"play-rough"]],"g":false,"m":false},"302":{"n":"勾魂眼","t":["dark","ghost"],"s":[50,75,75,65,65,50],"l":[[1,"leer"],[1,"scratch"],[3,"astonish"],[4,"foresight"],[6,"confuse-ray"],[9,"shadow-sneak"],[12,"fake-out"],[15,"disable"],[15,"fling"],[15,"hex"],[15,"payback"],[15,"thief"],[18,"detect"],[19,"feint-attack"],[21,"night-shade"],[24,"fury-swipes"],[24,"punishment"],[27,"knock-off"],[30,"lash-out"],[30,"quash"],[30,"throat-chop"],[33,"shadow-claw"],[36,"mean-look"],[39,"power-gem"],[42,"zen-headbutt"],[45,"phantom-force"],[45,"shadow-ball"],[48,"foul-play"],[65,"poltergeist"]],"g":false,"m":false},"303":{"n":"大嘴娃","t":["steel","fairy"],"s":[50,85,85,55,55,50],"l":[[1,"astonish"],[1,"growl"],[4,"fairy-wind"],[8,"baton-pass"],[12,"bite"],[15,"draining-kiss"],[16,"spit-up"],[16,"stockpile"],[16,"swallow"],[17,"vice-grip"],[20,"sucker-punch"],[24,"iron-defense"],[28,"crunch"],[30,"flash-cannon"],[32,"sweet-scent"],[36,"iron-head"],[40,"taunt"],[44,"fake-tears"],[48,"play-rough"]],"g":false,"m":false},"304":{"n":"可可多拉","t":["steel","rock"],"s":[50,70,100,40,40,30],"l":[[1,"harden"],[1,"tackle"],[4,"metal-claw"],[4,"mud-slap"],[8,"rock-tomb"],[12,"roar"],[16,"headbutt"],[20,"protect"],[24,"rock-slide"],[28,"iron-head"],[33,"metal-sound"],[36,"take-down"],[40,"autotomize"],[44,"iron-tail"],[48,"iron-defense"],[52,"heavy-slam"],[56,"double-edge"],[60,"metal-burst"]],"g":false,"m":false},"305":{"n":"可多拉","t":["steel","rock"],"s":[60,90,140,50,50,40],"l":[[1,"harden"],[1,"tackle"],[4,"metal-claw"],[4,"mud-slap"],[8,"rock-tomb"],[12,"roar"],[16,"headbutt"],[20,"protect"],[24,"rock-slide"],[28,"iron-head"],[30,"rock-blast"],[35,"metal-sound"],[40,"take-down"],[46,"autotomize"],[52,"iron-tail"],[58,"iron-defense"],[64,"heavy-slam"],[65,"stone-edge"],[70,"double-edge"],[76,"metal-burst"]],"g":false,"m":false},"306":{"n":"波士可多拉","t":["steel","rock"],"s":[70,110,180,60,60,50],"l":[[1,"harden"],[1,"tackle"],[4,"metal-claw"],[4,"mud-slap"],[8,"rock-tomb"],[12,"roar"],[16,"headbutt"],[20,"protect"],[24,"rock-slide"],[28,"iron-head"],[30,"rock-blast"],[35,"metal-sound"],[40,"take-down"],[48,"autotomize"],[56,"iron-tail"],[64,"iron-defense"],[65,"stone-edge"],[72,"heavy-slam"],[80,"double-edge"],[88,"metal-burst"]],"g":false,"m":false},"307":{"n":"玛沙那","t":["fighting","psychic"],"s":[30,40,55,40,55,60],"l":[[1,"bide"],[1,"confusion"],[1,"pound"],[1,"work-up"],[4,"low-kick"],[4,"meditate"],[9,"detect"],[12,"endure"],[15,"feint"],[15,"low-sweep"],[17,"force-palm"],[20,"hidden-power"],[20,"psybeam"],[20,"swagger"],[23,"calm-mind"],[25,"mind-reader"],[25,"zen-headbutt"],[28,"high-jump-kick"],[31,"psych-up"],[33,"acupressure"],[36,"power-trick"],[39,"reversal"],[41,"recover"],[44,"counter"],[45,"psychic"]],"g":false,"m":false},"308":{"n":"恰雷姆","t":["fighting","psychic"],"s":[60,60,75,60,75,80],"l":[[1,"bide"],[1,"confusion"],[1,"pound"],[1,"work-up"],[4,"low-kick"],[4,"meditate"],[9,"detect"],[12,"endure"],[15,"feint"],[15,"low-sweep"],[17,"force-palm"],[20,"hidden-power"],[20,"psybeam"],[20,"swagger"],[23,"calm-mind"],[25,"mind-reader"],[25,"zen-headbutt"],[28,"high-jump-kick"],[31,"psych-up"],[33,"acupressure"],[36,"power-trick"],[39,"reversal"],[45,"psychic"],[47,"recover"],[53,"axe-kick"],[53,"counter"]],"g":false,"m":false},"309":{"n":"落雷兽","t":["electric"],"s":[40,45,40,65,40,65],"l":[[1,"tackle"],[1,"thunder-wave"],[4,"leer"],[8,"howl"],[12,"quick-attack"],[13,"spark"],[15,"charge-beam"],[15,"electro-ball"],[16,"odor-sleuth"],[16,"shock-wave"],[20,"bite"],[24,"thunder-fang"],[28,"roar"],[30,"volt-switch"],[32,"discharge"],[36,"charge"],[40,"wild-charge"],[44,"thunder"]],"g":false,"m":false},"310":{"n":"雷电兽","t":["electric"],"s":[70,75,60,105,60,105],"l":[[1,"tackle"],[1,"thunder-wave"],[4,"leer"],[8,"howl"],[12,"quick-attack"],[13,"spark"],[15,"charge-beam"],[15,"electro-ball"],[16,"odor-sleuth"],[16,"shock-wave"],[20,"bite"],[24,"thunder-fang"],[30,"roar"],[30,"volt-switch"],[36,"discharge"],[42,"charge"],[48,"wild-charge"],[54,"thunder"],[60,"electric-terrain"]],"g":false,"m":false},"311":{"n":"正电拍拍","t":["electric"],"s":[60,50,40,85,75,95],"l":[[1,"growl"],[1,"nuzzle"],[1,"play-nice"],[1,"quick-attack"],[1,"thunder-wave"],[4,"helping-hand"],[7,"spark"],[10,"encore"],[13,"bestow"],[13,"skill-swap"],[13,"switcheroo"],[15,"charge-beam"],[15,"electroweb"],[15,"shock-wave"],[16,"swift"],[19,"electro-ball"],[22,"copycat"],[25,"charm"],[26,"charge"],[30,"volt-switch"],[31,"discharge"],[34,"baton-pass"],[35,"fake-tears"],[37,"agility"],[40,"last-resort"],[43,"thunder"],[46,"nasty-plot"],[49,"entrainment"]],"g":false,"m":false},"312":{"n":"負电拍拍","t":["electric"],"s":[60,40,50,75,85,95],"l":[[1,"growl"],[1,"nuzzle"],[1,"play-nice"],[1,"quick-attack"],[1,"thunder-wave"],[4,"helping-hand"],[7,"spark"],[10,"encore"],[13,"switcheroo"],[15,"charge-beam"],[15,"electroweb"],[15,"shock-wave"],[16,"swift"],[19,"electro-ball"],[21,"charm"],[22,"copycat"],[25,"fake-tears"],[26,"charge"],[30,"volt-switch"],[31,"discharge"],[34,"baton-pass"],[37,"agility"],[40,"last-resort"],[40,"trump-card"],[43,"thunder"],[46,"nasty-plot"],[49,"entrainment"]],"g":false,"m":false},"313":{"n":"电萤虫","t":["bug"],"s":[65,73,75,47,85,85],"l":[[1,"flash"],[1,"play-nice"],[1,"tackle"],[5,"double-team"],[8,"confuse-ray"],[12,"quick-attack"],[15,"bug-bite"],[15,"pounce"],[15,"struggle-bug"],[19,"moonlight"],[22,"tail-glow"],[26,"encore"],[26,"protect"],[26,"signal-beam"],[29,"zen-headbutt"],[30,"lunge"],[30,"u-turn"],[33,"helping-hand"],[36,"bug-buzz"],[40,"play-rough"],[43,"double-edge"],[47,"infestation"]],"g":false,"m":false},"314":{"n":"甜甜萤","t":["bug"],"s":[65,47,75,73,85,85],"l":[[1,"play-nice"],[1,"tackle"],[5,"sweet-scent"],[9,"charm"],[12,"quick-attack"],[15,"silver-wind"],[15,"struggle-bug"],[19,"moonlight"],[22,"wish"],[26,"encore"],[29,"flatter"],[33,"zen-headbutt"],[36,"helping-hand"],[40,"bug-buzz"],[43,"play-rough"],[47,"covet"],[47,"infestation"]],"g":false,"m":false},"315":{"n":"毒蔷薇","t":["grass","poison"],"s":[50,60,45,100,80,65],"l":[[0,"poison-sting"],[1,"absorb"],[1,"growth"],[1,"stun-spore"],[1,"worry-seed"],[5,"mega-drain"],[7,"water-sport"],[10,"leech-seed"],[15,"grass-knot"],[15,"magical-leaf"],[15,"venoshock"],[20,"toxic-spikes"],[22,"grass-whistle"],[25,"sweet-scent"],[30,"giga-drain"],[35,"synthesis"],[40,"toxic"],[45,"energy-ball"],[45,"petal-blizzard"],[45,"sludge-bomb"],[50,"aromatherapy"],[55,"ingrain"],[60,"petal-dance"],[85,"leaf-storm"],[85,"solar-beam"]],"g":false,"m":false},"316":{"n":"溶食兽","t":["poison"],"s":[70,43,53,43,53,40],"l":[[1,"pound"],[5,"yawn"],[8,"poison-gas"],[10,"sludge"],[12,"amnesia"],[17,"acid-spray"],[20,"encore"],[25,"toxic"],[28,"spit-up"],[28,"stockpile"],[28,"swallow"],[30,"poison-jab"],[33,"sludge-bomb"],[36,"gastro-acid"],[41,"belch"],[44,"pain-split"],[44,"wring-out"],[45,"sludge-wave"],[49,"gunk-shot"]],"g":false,"m":false},"317":{"n":"吞食兽","t":["poison"],"s":[100,73,83,73,83,55],"l":[[0,"body-slam"],[1,"pound"],[5,"yawn"],[8,"poison-gas"],[10,"sludge"],[12,"amnesia"],[17,"acid-spray"],[20,"encore"],[25,"toxic"],[30,"poison-jab"],[30,"spit-up"],[30,"stockpile"],[30,"swallow"],[37,"sludge-bomb"],[42,"gastro-acid"],[44,"pain-split"],[44,"wring-out"],[45,"sludge-wave"],[49,"belch"],[49,"gunk-shot"]],"g":false,"m":false},"318":{"n":"利牙鱼","t":["water","dark"],"s":[45,90,20,65,20,65],"l":[[1,"aqua-jet"],[1,"leer"],[4,"poison-fang"],[4,"rage"],[8,"focus-energy"],[12,"scary-face"],[15,"assurance"],[15,"brine"],[15,"water-pulse"],[16,"bite"],[20,"ice-fang"],[24,"screech"],[28,"swagger"],[30,"waterfall"],[32,"crunch"],[36,"agility"],[40,"liquidation"],[44,"take-down"]],"g":false,"m":false},"319":{"n":"巨牙鲨","t":["water","dark"],"s":[70,120,40,95,40,95],"l":[[0,"slash"],[1,"aqua-jet"],[1,"leer"],[4,"poison-fang"],[4,"rage"],[8,"focus-energy"],[12,"scary-face"],[15,"assurance"],[15,"brine"],[15,"water-pulse"],[16,"bite"],[20,"ice-fang"],[24,"screech"],[28,"swagger"],[30,"dark-pulse"],[30,"waterfall"],[34,"crunch"],[40,"agility"],[46,"liquidation"],[51,"skull-bash"],[52,"take-down"],[56,"taunt"],[65,"hydro-pump"]],"g":false,"m":false},"320":{"n":"吼吼鲸","t":["water"],"s":[130,70,35,70,35,60],"l":[[1,"splash"],[3,"growl"],[6,"astonish"],[10,"rollout"],[12,"water-gun"],[15,"mist"],[18,"water-pulse"],[21,"heavy-slam"],[24,"brine"],[27,"whirlpool"],[30,"dive"],[33,"bounce"],[36,"body-slam"],[39,"rest"],[42,"amnesia"],[45,"hydro-pump"],[48,"water-spout"]],"g":false,"m":false},"321":{"n":"吼鲸王","t":["water"],"s":[170,90,45,90,45,60],"l":[[1,"splash"],[3,"growl"],[6,"astonish"],[10,"rollout"],[12,"water-gun"],[15,"mist"],[18,"water-pulse"],[21,"heavy-slam"],[24,"brine"],[27,"whirlpool"],[30,"dive"],[33,"bounce"],[36,"body-slam"],[39,"rest"],[44,"amnesia"],[49,"hydro-pump"],[54,"water-spout"]],"g":false,"m":false},"322":{"n":"呆火驼","t":["fire","ground"],"s":[60,60,40,65,45,35],"l":[[1,"growl"],[1,"tackle"],[5,"ember"],[8,"focus-energy"],[12,"bulldoze"],[12,"magnitude"],[15,"flame-burst"],[15,"incinerate"],[19,"amnesia"],[22,"lava-plume"],[26,"earth-power"],[29,"curse"],[31,"take-down"],[36,"yawn"],[40,"earthquake"],[43,"flamethrower"],[45,"heat-wave"],[47,"double-edge"],[65,"fire-blast"],[85,"flare-blitz"],[85,"overheat"]],"g":false,"m":false},"323":{"n":"喷火驼","t":["fire","ground"],"s":[70,100,70,105,75,40],"l":[[0,"rock-slide"],[1,"growl"],[1,"tackle"],[5,"ember"],[8,"focus-energy"],[12,"bulldoze"],[12,"magnitude"],[15,"flame-burst"],[15,"incinerate"],[19,"amnesia"],[22,"lava-plume"],[26,"earth-power"],[29,"curse"],[31,"take-down"],[39,"yawn"],[43,"flamethrower"],[45,"heat-wave"],[46,"earthquake"],[47,"double-edge"],[52,"eruption"],[59,"fissure"],[65,"fire-blast"],[85,"flare-blitz"],[85,"overheat"]],"g":false,"m":false},"324":{"n":"煤炭龟","t":["fire"],"s":[70,85,140,85,70,20],"l":[[1,"ember"],[1,"smog"],[4,"withdraw"],[8,"rapid-spin"],[12,"smokescreen"],[15,"flame-charge"],[15,"incinerate"],[16,"clear-smog"],[20,"flame-wheel"],[24,"protect"],[28,"lava-plume"],[32,"body-slam"],[36,"iron-defense"],[40,"flamethrower"],[44,"curse"],[48,"heat-wave"],[52,"amnesia"],[56,"inferno"],[60,"shell-smash"],[64,"eruption"]],"g":false,"m":false},"325":{"n":"跳跳猪","t":["psychic"],"s":[60,25,35,70,80,60],"l":[[1,"splash"],[7,"confusion"],[10,"growl"],[10,"odor-sleuth"],[14,"psybeam"],[18,"psych-up"],[21,"magic-coat"],[22,"confuse-ray"],[29,"power-gem"],[29,"rest"],[30,"expanding-force"],[33,"snore"],[38,"psyshock"],[40,"payback"],[44,"psychic"],[50,"bounce"],[85,"future-sight"]],"g":false,"m":false},"326":{"n":"噗噗猪","t":["psychic"],"s":[80,45,65,90,110,80],"l":[[0,"teeter-dance"],[1,"splash"],[7,"confusion"],[10,"growl"],[10,"odor-sleuth"],[14,"psybeam"],[18,"psych-up"],[21,"magic-coat"],[22,"confuse-ray"],[26,"zen-headbutt"],[29,"power-gem"],[30,"expanding-force"],[35,"rest"],[35,"snore"],[42,"psyshock"],[46,"payback"],[52,"psychic"],[60,"bounce"],[85,"future-sight"]],"g":false,"m":false},"327":{"n":"晃晃斑","t":["normal"],"s":[60,60,60,60,60,60],"l":[[1,"tackle"],[5,"copycat"],[10,"feint-attack"],[10,"teeter-dance"],[14,"psybeam"],[15,"hidden-power"],[19,"hypnosis"],[23,"body-slam"],[28,"sucker-punch"],[37,"uproar"],[41,"psych-up"],[46,"double-edge"],[50,"flail"],[55,"thrash"]],"g":false,"m":false},"328":{"n":"大颚蚁","t":["ground"],"s":[45,100,45,45,45,10],"l":[[1,"astonish"],[1,"bide"],[1,"feint-attack"],[1,"sand-attack"],[4,"laser-focus"],[8,"bite"],[12,"mud-slap"],[15,"mud-shot"],[15,"rock-slide"],[16,"sand-tomb"],[20,"bulldoze"],[24,"dig"],[28,"crunch"],[29,"feint"],[32,"sandstorm"],[36,"earth-power"],[40,"earthquake"],[43,"hyper-beam"],[44,"superpower"],[48,"fissure"]],"g":false,"m":false},"329":{"n":"超音波幼虫","t":["ground","dragon"],"s":[50,70,50,50,50,70],"l":[[0,"dragon-breath"],[1,"astonish"],[1,"bide"],[1,"feint-attack"],[1,"sand-attack"],[4,"laser-focus"],[8,"bite"],[12,"mud-slap"],[15,"bulldoze"],[15,"mud-shot"],[15,"rock-slide"],[16,"sand-tomb"],[19,"supersonic"],[20,"dragon-tail"],[24,"dig"],[24,"screech"],[28,"bug-buzz"],[28,"crunch"],[29,"feint"],[30,"dragon-claw"],[32,"sandstorm"],[38,"earth-power"],[43,"hyper-beam"],[44,"earthquake"],[44,"superpower"],[48,"fissure"],[50,"uproar"],[56,"dragon-rush"],[62,"boomburst"],[85,"outrage"]],"g":false,"m":false},"330":{"n":"沙漠蜻蜓","t":["ground","dragon"],"s":[80,100,80,80,80,100],"l":[[0,"dragon-breath"],[0,"dragon-claw"],[1,"astonish"],[1,"bide"],[1,"feint-attack"],[1,"sand-attack"],[4,"laser-focus"],[8,"bite"],[12,"mud-slap"],[15,"bulldoze"],[15,"mud-shot"],[15,"rock-slide"],[16,"sand-tomb"],[19,"supersonic"],[20,"dragon-tail"],[24,"dig"],[24,"screech"],[28,"bug-buzz"],[28,"crunch"],[29,"feint"],[32,"sandstorm"],[38,"earth-power"],[43,"hyper-beam"],[44,"earthquake"],[44,"superpower"],[48,"fissure"],[52,"uproar"],[60,"dragon-rush"],[68,"boomburst"],[85,"outrage"]],"g":false,"m":false},"331":{"n":"刺球仙人掌","t":["grass"],"s":[50,85,40,85,40,35],"l":[[1,"leer"],[1,"poison-sting"],[4,"absorb"],[7,"growth"],[10,"leech-seed"],[13,"sand-attack"],[15,"grassy-glide"],[15,"magical-leaf"],[15,"trailblaze"],[16,"bullet-seed"],[16,"poison-jab"],[19,"feint-attack"],[19,"power-trip"],[22,"ingrain"],[26,"payback"],[30,"seed-bomb"],[30,"spikes"],[34,"sucker-punch"],[38,"pin-missile"],[42,"energy-ball"],[46,"cotton-spore"],[50,"sandstorm"],[54,"destiny-bond"],[85,"leaf-storm"],[85,"solar-beam"]],"g":false,"m":false},"332":{"n":"梦歌仙人掌","t":["grass","dark"],"s":[70,115,60,115,60,55],"l":[[0,"spiky-shield"],[1,"leer"],[1,"poison-sting"],[4,"absorb"],[7,"growth"],[10,"leech-seed"],[13,"sand-attack"],[15,"fling"],[15,"grassy-glide"],[15,"knock-off"],[15,"magical-leaf"],[15,"thief"],[15,"trailblaze"],[16,"bullet-seed"],[16,"poison-jab"],[19,"feint-attack"],[19,"power-trip"],[22,"ingrain"],[26,"payback"],[30,"dark-pulse"],[30,"lash-out"],[30,"seed-bomb"],[30,"spikes"],[35,"sucker-punch"],[38,"pin-missile"],[44,"energy-ball"],[45,"foul-play"],[49,"cotton-spore"],[54,"destiny-bond"],[54,"sandstorm"],[85,"leaf-storm"],[85,"solar-beam"]],"g":false,"m":false},"333":{"n":"青绵鸟","t":["normal","flying"],"s":[45,40,60,40,75,50],"l":[[1,"growl"],[1,"peck"],[3,"astonish"],[4,"disarming-voice"],[8,"mist"],[12,"fury-attack"],[15,"acrobatics"],[15,"aerial-ace"],[15,"swift"],[16,"round"],[20,"dragon-breath"],[20,"natural-gift"],[24,"safeguard"],[26,"refresh"],[28,"sing"],[30,"dual-wingbeat"],[30,"facade"],[30,"mirror-move"],[30,"tera-blast"],[32,"cotton-guard"],[36,"take-down"],[38,"dragon-pulse"],[40,"moonblast"],[44,"perish-song"],[45,"fly"],[65,"hurricane"],[85,"brave-bird"]],"g":false,"m":false},"334":{"n":"七夕青鸟","t":["dragon","flying"],"s":[75,70,90,70,105,80],"l":[[0,"dragon-pulse"],[1,"growl"],[1,"peck"],[3,"astonish"],[4,"disarming-voice"],[8,"mist"],[12,"fury-attack"],[15,"acrobatics"],[15,"aerial-ace"],[15,"swift"],[16,"round"],[20,"dragon-breath"],[20,"natural-gift"],[24,"safeguard"],[26,"refresh"],[28,"sing"],[30,"dragon-dance"],[30,"dual-wingbeat"],[30,"facade"],[30,"mirror-move"],[30,"tera-blast"],[32,"cotton-guard"],[38,"take-down"],[44,"moonblast"],[45,"fly"],[50,"perish-song"],[56,"sky-attack"],[65,"hurricane"],[85,"brave-bird"],[85,"draco-meteor"],[85,"outrage"]],"g":false,"m":false},"335":{"n":"猫鼬斩","t":["normal"],"s":[73,115,60,60,60,90],"l":[[1,"leer"],[1,"scratch"],[5,"quick-attack"],[8,"fury-cutter"],[12,"metal-claw"],[12,"pursuit"],[15,"aerial-ace"],[15,"hone-claws"],[19,"slash"],[22,"power-trip"],[22,"revenge"],[26,"crush-claw"],[29,"false-swipe"],[30,"strength"],[33,"embargo"],[33,"switcheroo"],[36,"detect"],[40,"x-scissor"],[43,"taunt"],[45,"body-slam"],[45,"take-down"],[47,"swords-dance"],[50,"close-combat"],[85,"double-edge"]],"g":false,"m":false},"336":{"n":"饭匙蛇","t":["poison"],"s":[73,100,60,100,60,65],"l":[[1,"swagger"],[1,"wrap"],[4,"bite"],[6,"lick"],[9,"poison-tail"],[11,"feint"],[14,"screech"],[19,"glare"],[21,"poison-fang"],[24,"venom-drench"],[24,"venoshock"],[26,"night-slash"],[29,"gastro-acid"],[31,"poison-jab"],[34,"haze"],[36,"swords-dance"],[39,"crunch"],[41,"belch"],[44,"coil"],[45,"sludge-wave"],[46,"sludge-bomb"],[46,"wring-out"],[85,"gunk-shot"]],"g":false,"m":false},"337":{"n":"月石","t":["rock","psychic"],"s":[90,55,65,95,85,70],"l":[[1,"confusion"],[1,"harden"],[1,"moonblast"],[1,"moonlight"],[1,"power-gem"],[1,"rock-throw"],[1,"tackle"],[5,"hypnosis"],[10,"rock-polish"],[15,"rock-slide"],[17,"embargo"],[20,"psyshock"],[25,"cosmic-power"],[30,"psychic"],[33,"heal-block"],[35,"stone-edge"],[40,"future-sight"],[45,"magic-room"],[50,"explosion"]],"g":false,"m":false},"338":{"n":"太阳岩","t":["rock","psychic"],"s":[90,95,85,55,65,70],"l":[[1,"confusion"],[1,"flare-blitz"],[1,"harden"],[1,"morning-sun"],[1,"rock-throw"],[1,"tackle"],[5,"hypnosis"],[10,"rock-polish"],[15,"rock-slide"],[17,"embargo"],[20,"zen-headbutt"],[25,"cosmic-power"],[30,"psychic"],[30,"rock-blast"],[33,"heal-block"],[35,"stone-edge"],[40,"solar-beam"],[45,"wonder-room"],[50,"explosion"]],"g":false,"m":false},"339":{"n":"泥泥鳅","t":["water","ground"],"s":[50,48,43,46,41,60],"l":[[1,"mud-slap"],[1,"water-gun"],[6,"mud-sport"],[6,"rest"],[6,"snore"],[6,"water-sport"],[12,"water-pulse"],[13,"mud-bomb"],[18,"amnesia"],[20,"magnitude"],[24,"aqua-tail"],[30,"stomping-tantrum"],[31,"muddy-water"],[36,"earthquake"],[42,"future-sight"],[48,"fissure"],[65,"hydro-pump"]],"g":false,"m":false},"340":{"n":"鲶鱼王","t":["water","ground"],"s":[110,78,73,76,71,60],"l":[[0,"thrash"],[1,"mud-slap"],[1,"water-gun"],[6,"mud-sport"],[6,"rest"],[6,"snore"],[6,"water-sport"],[12,"water-pulse"],[13,"mud-bomb"],[18,"amnesia"],[20,"magnitude"],[24,"aqua-tail"],[30,"stomping-tantrum"],[30,"zen-headbutt"],[33,"muddy-water"],[40,"earthquake"],[48,"future-sight"],[56,"fissure"],[65,"hydro-pump"]],"g":false,"m":false},"341":{"n":"龙虾小兵","t":["water"],"s":[43,80,65,50,35,35],"l":[[1,"harden"],[1,"water-gun"],[4,"leer"],[7,"vice-grip"],[8,"taunt"],[12,"bubble-beam"],[16,"knock-off"],[20,"double-hit"],[24,"protect"],[28,"night-slash"],[30,"waterfall"],[32,"razor-shell"],[36,"swords-dance"],[40,"crunch"],[44,"crabhammer"],[48,"endeavor"],[52,"guillotine"]],"g":false,"m":false},"342":{"n":"铁螯龙虾","t":["water","dark"],"s":[63,120,85,90,55,55],"l":[[0,"swift"],[1,"harden"],[1,"water-gun"],[4,"leer"],[7,"vice-grip"],[8,"taunt"],[12,"bubble-beam"],[15,"fling"],[15,"payback"],[15,"thief"],[16,"knock-off"],[20,"double-hit"],[24,"protect"],[28,"night-slash"],[30,"lash-out"],[30,"waterfall"],[34,"razor-shell"],[40,"swords-dance"],[46,"crunch"],[52,"crabhammer"],[58,"endeavor"],[64,"guillotine"]],"g":false,"m":false},"343":{"n":"天秤偶","t":["ground","psychic"],"s":[40,40,55,40,70,55],"l":[[1,"harden"],[1,"mud-slap"],[3,"rapid-spin"],[6,"confusion"],[9,"rock-tomb"],[10,"heal-block"],[12,"power-trick"],[15,"bulldoze"],[15,"psybeam"],[15,"sand-tomb"],[18,"ancient-power"],[21,"imprison"],[24,"cosmic-power"],[27,"extrasensory"],[30,"earth-power"],[33,"self-destruct"],[36,"guard-split"],[36,"power-split"],[39,"sandstorm"],[42,"explosion"],[45,"psychic"],[65,"earthquake"]],"g":false,"m":false},"344":{"n":"念力土偶","t":["ground","psychic"],"s":[60,70,105,70,120,75],"l":[[0,"hyper-beam"],[1,"harden"],[1,"mud-slap"],[3,"rapid-spin"],[6,"confusion"],[9,"rock-tomb"],[10,"heal-block"],[12,"power-trick"],[15,"bulldoze"],[15,"psybeam"],[15,"sand-tomb"],[18,"ancient-power"],[21,"imprison"],[24,"cosmic-power"],[27,"extrasensory"],[30,"earth-power"],[33,"self-destruct"],[38,"guard-split"],[38,"power-split"],[43,"sandstorm"],[45,"psychic"],[48,"explosion"],[65,"earthquake"],[85,"future-sight"]],"g":false,"m":false},"345":{"n":"触手百合","t":["rock","grass"],"s":[66,41,77,61,87,23],"l":[[1,"astonish"],[1,"wrap"],[4,"acid"],[8,"confuse-ray"],[12,"ingrain"],[15,"grass-knot"],[15,"rock-tomb"],[15,"smack-down"],[16,"ancient-power"],[20,"mega-drain"],[24,"brine"],[28,"amnesia"],[32,"gastro-acid"],[36,"giga-drain"],[41,"spit-up"],[41,"stockpile"],[41,"swallow"],[44,"energy-ball"],[52,"wring-out"],[85,"solar-beam"]],"g":false,"m":false},"346":{"n":"摇篮百合","t":["rock","grass"],"s":[86,81,97,81,107,43],"l":[[1,"astonish"],[1,"wrap"],[4,"acid"],[8,"confuse-ray"],[12,"ingrain"],[15,"grass-knot"],[15,"rock-tomb"],[15,"smack-down"],[16,"ancient-power"],[20,"mega-drain"],[24,"brine"],[28,"amnesia"],[30,"bullet-seed"],[30,"rock-blast"],[30,"rock-slide"],[30,"seed-bomb"],[32,"gastro-acid"],[36,"giga-drain"],[43,"spit-up"],[43,"stockpile"],[43,"swallow"],[48,"energy-ball"],[52,"wring-out"],[65,"stone-edge"],[85,"solar-beam"]],"g":false,"m":false},"347":{"n":"太古羽虫","t":["rock","bug"],"s":[45,95,50,40,50,75],"l":[[1,"fury-cutter"],[1,"harden"],[1,"scratch"],[4,"mud-sport"],[4,"water-gun"],[8,"smack-down"],[12,"metal-claw"],[15,"rock-tomb"],[16,"ancient-power"],[20,"bug-bite"],[24,"brine"],[28,"slash"],[30,"rock-slide"],[32,"crush-claw"],[36,"rock-blast"],[41,"protect"],[44,"x-scissor"]],"g":false,"m":false},"348":{"n":"太古盔甲","t":["rock","bug"],"s":[75,125,100,70,80,45],"l":[[1,"fury-cutter"],[1,"harden"],[1,"scratch"],[4,"mud-sport"],[4,"water-gun"],[8,"smack-down"],[12,"metal-claw"],[15,"rock-tomb"],[16,"ancient-power"],[20,"bug-bite"],[24,"brine"],[28,"slash"],[30,"rock-slide"],[32,"crush-claw"],[36,"rock-blast"],[43,"protect"],[48,"x-scissor"],[65,"stone-edge"]],"g":false,"m":false},"349":{"n":"丑丑鱼","t":["water"],"s":[20,15,20,10,55,80],"l":[[1,"splash"],[15,"brine"],[15,"chilling-water"],[15,"tackle"],[15,"water-pulse"],[15,"whirlpool"],[25,"flail"],[30,"waterfall"]],"g":false,"m":false},"350":{"n":"美纳斯","t":["water"],"s":[95,60,79,100,125,81],"l":[[0,"water-pulse"],[1,"splash"],[4,"disarming-voice"],[4,"water-sport"],[5,"wrap"],[7,"refresh"],[8,"twister"],[12,"aqua-ring"],[15,"brine"],[15,"chilling-water"],[15,"tackle"],[15,"whirlpool"],[16,"attract"],[20,"life-dew"],[21,"captivate"],[24,"dragon-tail"],[25,"flail"],[28,"recover"],[30,"scald"],[30,"waterfall"],[32,"aqua-tail"],[36,"safeguard"],[40,"surf"],[44,"rain-dance"],[48,"coil"],[52,"hydro-pump"]],"g":false,"m":false},"351":{"n":"飘浮泡泡","t":["normal"],"s":[70,70,70,70,70,70],"l":[[1,"tackle"],[10,"ember"],[10,"powder-snow"],[10,"water-gun"],[15,"headbutt"],[20,"hail"],[20,"rain-dance"],[20,"sunny-day"],[25,"weather-ball"],[35,"blizzard"],[35,"fire-blast"],[35,"hydro-pump"],[45,"hurricane"]],"g":false,"m":false},"352":{"n":"变隐龙","t":["normal"],"s":[60,90,70,60,120,40],"l":[[1,"astonish"],[1,"lick"],[1,"scratch"],[1,"tail-whip"],[1,"thief"],[4,"bind"],[7,"shadow-sneak"],[10,"feint"],[13,"fury-swipes"],[16,"disable"],[18,"psybeam"],[21,"ancient-power"],[25,"slash"],[30,"camouflage"],[30,"detect"],[30,"strength"],[33,"shadow-claw"],[38,"screech"],[42,"substitute"],[46,"sucker-punch"],[50,"foul-play"],[50,"synchronoise"]],"g":false,"m":false},"353":{"n":"怨影娃娃","t":["ghost"],"s":[44,75,35,63,33,45],"l":[[1,"astonish"],[1,"knock-off"],[4,"screech"],[7,"night-shade"],[10,"spite"],[16,"will-o-wisp"],[19,"pain-split"],[19,"shadow-sneak"],[22,"hex"],[26,"curse"],[30,"shadow-ball"],[34,"embargo"],[34,"role-play"],[38,"sucker-punch"],[42,"snatch"],[42,"trick"],[46,"grudge"],[48,"phantom-force"],[65,"poltergeist"]],"g":false,"m":false},"354":{"n":"诅咒娃娃","t":["ghost"],"s":[64,115,65,83,63,65],"l":[[0,"knock-off"],[1,"astonish"],[4,"screech"],[7,"night-shade"],[10,"spite"],[16,"will-o-wisp"],[19,"pain-split"],[19,"shadow-sneak"],[22,"hex"],[26,"curse"],[30,"shadow-ball"],[30,"shadow-claw"],[34,"embargo"],[34,"role-play"],[40,"sucker-punch"],[42,"snatch"],[46,"grudge"],[46,"trick"],[53,"phantom-force"],[65,"poltergeist"]],"g":false,"m":false},"355":{"n":"夜巡灵","t":["ghost"],"s":[20,40,90,30,90,25],"l":[[1,"astonish"],[1,"leer"],[4,"disable"],[8,"shadow-sneak"],[12,"confuse-ray"],[14,"foresight"],[16,"night-shade"],[20,"payback"],[24,"will-o-wisp"],[28,"mean-look"],[32,"hex"],[36,"curse"],[40,"shadow-ball"],[44,"future-sight"],[45,"phantom-force"],[65,"poltergeist"]],"g":false,"m":false},"356":{"n":"彷徨夜灵","t":["ghost"],"s":[40,70,130,60,130,25],"l":[[0,"shadow-punch"],[1,"astonish"],[1,"leer"],[4,"disable"],[8,"shadow-sneak"],[12,"confuse-ray"],[14,"foresight"],[16,"night-shade"],[20,"payback"],[24,"will-o-wisp"],[28,"mean-look"],[32,"hex"],[36,"curse"],[42,"shadow-ball"],[45,"phantom-force"],[48,"future-sight"],[65,"poltergeist"]],"g":false,"m":false},"357":{"n":"热带龙","t":["grass","flying"],"s":[99,68,83,72,87,51],"l":[[1,"growth"],[1,"gust"],[1,"leaf-storm"],[1,"leer"],[1,"razor-leaf"],[6,"sweet-scent"],[10,"stomp"],[15,"air-cutter"],[16,"magical-leaf"],[21,"whirlwind"],[30,"dragon-dance"],[30,"dual-wingbeat"],[30,"natural-gift"],[30,"wide-guard"],[36,"air-slash"],[41,"body-slam"],[45,"fly"],[46,"bestow"],[46,"outrage"],[50,"synthesis"],[56,"solar-beam"],[65,"hurricane"]],"g":false,"m":false},"358":{"n":"风铃铃","t":["psychic"],"s":[75,50,80,95,90,65],"l":[[1,"astonish"],[1,"confusion"],[1,"growl"],[1,"healing-wish"],[1,"wrap"],[13,"yawn"],[15,"psybeam"],[16,"last-resort"],[16,"light-screen"],[16,"stored-power"],[19,"entrainment"],[19,"take-down"],[22,"extrasensory"],[27,"heal-bell"],[30,"psychic-noise"],[30,"psyshock"],[32,"uproar"],[37,"safeguard"],[42,"double-edge"],[45,"psychic"],[47,"heal-pulse"],[52,"synchronoise"],[85,"future-sight"]],"g":false,"m":false},"359":{"n":"阿勃梭鲁","t":["dark"],"s":[65,130,60,75,60,75],"l":[[1,"leer"],[1,"quick-attack"],[5,"double-team"],[10,"knock-off"],[15,"detect"],[20,"taunt"],[25,"slash"],[30,"night-slash"],[30,"throat-chop"],[35,"focus-energy"],[37,"psycho-cut"],[40,"sucker-punch"],[41,"me-first"],[45,"foul-play"],[45,"swords-dance"],[50,"future-sight"],[55,"perish-song"]],"g":false,"m":false},"360":{"n":"小果然","t":["psychic"],"s":[95,23,48,23,48,23],"l":[[1,"amnesia"],[1,"charm"],[1,"counter"],[1,"destiny-bond"],[1,"encore"],[1,"mirror-coat"],[1,"safeguard"],[1,"splash"]],"g":false,"m":false},"361":{"n":"雪童子","t":["ice"],"s":[50,50,50,50,50,50],"l":[[1,"astonish"],[1,"headbutt"],[1,"powder-snow"],[5,"leer"],[10,"double-team"],[15,"avalanche"],[15,"ice-shard"],[20,"protect"],[25,"icy-wind"],[30,"frost-breath"],[30,"ice-spinner"],[30,"icicle-spear"],[34,"ice-beam"],[35,"bite"],[40,"ice-fang"],[45,"hail"],[45,"snowscape"],[50,"weather-ball"],[55,"crunch"],[60,"blizzard"]],"g":false,"m":false},"362":{"n":"冰鬼护","t":["ice"],"s":[80,80,80,80,80,80],"l":[[0,"freeze-dry"],[1,"astonish"],[1,"headbutt"],[1,"powder-snow"],[5,"leer"],[10,"double-team"],[15,"avalanche"],[15,"ice-shard"],[20,"protect"],[25,"icy-wind"],[30,"frost-breath"],[30,"ice-spinner"],[30,"icicle-spear"],[34,"ice-beam"],[35,"bite"],[40,"ice-fang"],[45,"hail"],[47,"snowscape"],[54,"weather-ball"],[61,"crunch"],[61,"sheer-cold"],[68,"blizzard"]],"g":false,"m":false},"363":{"n":"海豹球","t":["ice","water"],"s":[70,40,50,55,50,25],"l":[[1,"defense-curl"],[1,"rollout"],[4,"growl"],[8,"water-gun"],[12,"powder-snow"],[15,"frost-breath"],[15,"icy-wind"],[15,"water-pulse"],[16,"rest"],[20,"snore"],[24,"brine"],[28,"aurora-beam"],[33,"encore"],[36,"body-slam"],[40,"surf"],[44,"blizzard"],[48,"hail"],[52,"sheer-cold"]],"g":false,"m":false},"364":{"n":"海魔狮","t":["ice","water"],"s":[90,60,70,75,70,45],"l":[[0,"swagger"],[1,"defense-curl"],[1,"rollout"],[4,"growl"],[8,"water-gun"],[12,"powder-snow"],[15,"frost-breath"],[15,"icy-wind"],[15,"water-pulse"],[16,"rest"],[20,"snore"],[24,"brine"],[28,"aurora-beam"],[35,"encore"],[40,"body-slam"],[46,"surf"],[52,"blizzard"],[58,"hail"],[64,"sheer-cold"]],"g":false,"m":false},"365":{"n":"帝牙海狮","t":["ice","water"],"s":[110,80,90,95,90,65],"l":[[0,"ice-fang"],[0,"swagger"],[1,"defense-curl"],[1,"rollout"],[4,"growl"],[8,"water-gun"],[12,"powder-snow"],[15,"frost-breath"],[15,"icy-wind"],[15,"water-pulse"],[16,"rest"],[20,"snore"],[24,"brine"],[28,"aurora-beam"],[30,"icicle-spear"],[30,"waterfall"],[35,"encore"],[40,"body-slam"],[48,"surf"],[56,"blizzard"],[64,"hail"],[65,"hydro-pump"],[72,"sheer-cold"]],"g":false,"m":false},"366":{"n":"珍珠贝","t":["water"],"s":[35,64,85,74,55,32],"l":[[1,"iron-defense"],[1,"water-gun"],[1,"whirlpool"],[15,"brine"],[15,"water-pulse"],[30,"scald"],[30,"waterfall"],[45,"surf"],[50,"shell-smash"]],"g":false,"m":false},"367":{"n":"猎斑鱼","t":["water"],"s":[55,104,105,94,75,52],"l":[[1,"iron-defense"],[1,"water-gun"],[1,"whirlpool"],[5,"screech"],[6,"bite"],[9,"scary-face"],[11,"rain-dance"],[14,"water-pulse"],[16,"ice-fang"],[19,"brine"],[23,"sucker-punch"],[26,"dive"],[29,"baton-pass"],[30,"scald"],[30,"waterfall"],[34,"crunch"],[39,"aqua-tail"],[45,"coil"],[45,"surf"],[50,"hydro-pump"],[50,"shell-smash"]],"g":false,"m":false},"368":{"n":"樱花鱼","t":["water"],"s":[55,84,105,114,75,52],"l":[[1,"iron-defense"],[1,"water-gun"],[1,"whirlpool"],[5,"rain-dance"],[5,"water-sport"],[6,"confusion"],[9,"agility"],[11,"draining-kiss"],[14,"water-pulse"],[15,"brine"],[16,"amnesia"],[19,"aqua-ring"],[23,"captivate"],[23,"safeguard"],[26,"dive"],[29,"baton-pass"],[30,"scald"],[30,"waterfall"],[34,"psychic"],[39,"aqua-tail"],[45,"coil"],[45,"surf"],[50,"hydro-pump"],[50,"shell-smash"]],"g":false,"m":false},"369":{"n":"古空棘鱼","t":["water","rock"],"s":[100,90,130,45,65,55],"l":[[1,"harden"],[1,"mud-sport"],[1,"tackle"],[5,"water-gun"],[10,"ancient-power"],[15,"brine"],[15,"rock-tomb"],[15,"water-pulse"],[15,"yawn"],[20,"dive"],[25,"take-down"],[30,"aqua-tail"],[30,"rock-blast"],[30,"rock-slide"],[35,"rest"],[40,"flail"],[45,"hydro-pump"],[50,"double-edge"],[55,"head-smash"]],"g":false,"m":false},"370":{"n":"爱心鱼","t":["water"],"s":[43,30,55,40,65,97],"l":[[1,"charm"],[1,"tackle"],[4,"water-gun"],[7,"agility"],[13,"lucky-chant"],[13,"tearful-look"],[13,"wish"],[15,"flip-turn"],[17,"water-pulse"],[20,"attract"],[22,"brine"],[22,"draining-kiss"],[22,"heart-stamp"],[26,"flail"],[30,"scald"],[31,"sweet-kiss"],[34,"take-down"],[37,"baby-doll-eyes"],[37,"captivate"],[40,"aqua-ring"],[42,"soak"],[45,"surf"],[46,"hydro-pump"],[49,"safeguard"]],"g":false,"m":false},"371":{"n":"宝贝龙","t":["dragon"],"s":[45,75,60,40,30,50],"l":[[1,"ember"],[1,"leer"],[1,"rage"],[5,"bite"],[10,"dragon-breath"],[15,"dragon-tail"],[15,"headbutt"],[20,"scary-face"],[25,"crunch"],[31,"dragon-claw"],[35,"zen-headbutt"],[40,"focus-energy"],[45,"flamethrower"],[50,"outrage"],[55,"double-edge"]],"g":false,"m":false},"372":{"n":"甲壳龙","t":["dragon"],"s":[65,95,100,60,50,50],"l":[[0,"protect"],[1,"ember"],[1,"leer"],[1,"rage"],[5,"bite"],[10,"dragon-breath"],[15,"dragon-tail"],[15,"headbutt"],[20,"scary-face"],[25,"crunch"],[33,"dragon-claw"],[39,"zen-headbutt"],[46,"focus-energy"],[53,"flamethrower"],[60,"outrage"],[67,"double-edge"]],"g":false,"m":false},"373":{"n":"暴飞龙","t":["dragon","flying"],"s":[95,135,80,110,80,100],"l":[[0,"fly"],[0,"protect"],[1,"ember"],[1,"leer"],[1,"rage"],[5,"bite"],[10,"dragon-breath"],[15,"dragon-tail"],[15,"headbutt"],[20,"scary-face"],[25,"crunch"],[33,"dragon-claw"],[39,"zen-headbutt"],[46,"focus-energy"],[55,"flamethrower"],[60,"outrage"],[73,"double-edge"]],"g":false,"m":false},"374":{"n":"铁哑铃","t":["steel","psychic"],"s":[40,55,80,35,60,30],"l":[[1,"tackle"],[1,"take-down"],[30,"iron-head"],[30,"zen-headbutt"]],"g":false,"m":false},"375":{"n":"金属怪","t":["steel","psychic"],"s":[60,75,100,55,80,50],"l":[[0,"confusion"],[0,"metal-claw"],[1,"tackle"],[6,"zen-headbutt"],[12,"magnet-rise"],[15,"gyro-ball"],[18,"flash-cannon"],[23,"pursuit"],[26,"take-down"],[29,"miracle-eye"],[30,"iron-head"],[34,"psychic"],[42,"scary-face"],[50,"meteor-mash"],[58,"iron-defense"],[66,"agility"],[74,"hyper-beam"],[85,"future-sight"]],"g":false,"m":false},"376":{"n":"巨金怪","t":["steel","psychic"],"s":[80,135,130,95,90,70],"l":[[0,"confusion"],[0,"hammer-arm"],[0,"metal-claw"],[1,"tackle"],[6,"zen-headbutt"],[12,"magnet-rise"],[15,"gyro-ball"],[16,"flash-cannon"],[23,"pursuit"],[26,"take-down"],[29,"miracle-eye"],[30,"iron-head"],[34,"psychic"],[42,"scary-face"],[45,"psychic-fangs"],[52,"meteor-mash"],[62,"iron-defense"],[72,"agility"],[82,"hyper-beam"],[85,"future-sight"]],"g":false,"m":false},"377":{"n":"雷吉洛克","t":["rock"],"s":[80,100,200,50,100,50],"l":[[1,"charge-beam"],[1,"rock-throw"],[6,"bulldoze"],[12,"ancient-power"],[15,"rock-tomb"],[18,"stomp"],[24,"rock-slide"],[30,"curse"],[30,"rock-blast"],[36,"iron-defense"],[42,"hammer-arm"],[48,"stone-edge"],[54,"superpower"],[60,"lock-on"],[66,"zap-cannon"],[72,"hyper-beam"],[78,"explosion"]],"g":true,"m":false},"378":{"n":"雷吉艾斯","t":["ice"],"s":[80,50,100,100,200,50],"l":[[1,"charge-beam"],[1,"icy-wind"],[6,"bulldoze"],[12,"ancient-power"],[15,"frost-breath"],[18,"stomp"],[24,"ice-beam"],[30,"curse"],[36,"amnesia"],[42,"hammer-arm"],[48,"blizzard"],[54,"superpower"],[60,"lock-on"],[66,"zap-cannon"],[72,"hyper-beam"],[78,"explosion"]],"g":true,"m":false},"379":{"n":"雷吉斯奇鲁","t":["steel"],"s":[80,75,150,75,150,50],"l":[[1,"charge-beam"],[1,"metal-claw"],[6,"bulldoze"],[12,"ancient-power"],[18,"stomp"],[24,"flash-cannon"],[24,"iron-head"],[30,"curse"],[36,"amnesia"],[36,"iron-defense"],[42,"hammer-arm"],[48,"heavy-slam"],[54,"superpower"],[60,"lock-on"],[66,"zap-cannon"],[72,"hyper-beam"],[78,"explosion"]],"g":true,"m":false},"380":{"n":"拉帝亚斯","t":["dragon","psychic"],"s":[80,80,90,110,130,110],"l":[[1,"charm"],[1,"psywave"],[1,"safeguard"],[1,"stored-power"],[4,"water-sport"],[5,"helping-hand"],[10,"recover"],[13,"refresh"],[15,"breaking-swipe"],[15,"confusion"],[20,"tailwind"],[25,"dragon-breath"],[30,"psycho-cut"],[30,"psyshock"],[30,"wish"],[35,"mist-ball"],[40,"zen-headbutt"],[45,"dragon-pulse"],[50,"heal-pulse"],[55,"reflect-type"],[60,"psychic"],[65,"guard-split"],[70,"healing-wish"],[75,"psycho-shift"],[85,"draco-meteor"],[85,"future-sight"],[85,"outrage"]],"g":true,"m":false},"381":{"n":"拉帝欧斯","t":["dragon","psychic"],"s":[80,90,80,130,110,110],"l":[[1,"dragon-dance"],[1,"heal-block"],[1,"psywave"],[1,"safeguard"],[1,"stored-power"],[4,"protect"],[5,"helping-hand"],[10,"recover"],[13,"refresh"],[15,"breaking-swipe"],[15,"confusion"],[20,"tailwind"],[25,"dragon-breath"],[30,"ally-switch"],[30,"psychic-noise"],[30,"psyshock"],[35,"luster-purge"],[36,"telekinesis"],[40,"zen-headbutt"],[45,"dragon-pulse"],[50,"heal-pulse"],[55,"simple-beam"],[60,"psychic"],[65,"power-split"],[70,"memento"],[75,"psycho-shift"],[85,"draco-meteor"],[85,"future-sight"]],"g":true,"m":false},"382":{"n":"盖欧卡","t":["water"],"s":[100,100,90,150,140,90],"l":[[1,"ancient-power"],[1,"body-slam"],[1,"origin-pulse"],[1,"scary-face"],[1,"water-pulse"],[9,"aqua-tail"],[18,"calm-mind"],[27,"muddy-water"],[36,"ice-beam"],[45,"sheer-cold"],[50,"rest"],[54,"aqua-ring"],[72,"hydro-pump"],[81,"double-edge"],[90,"water-spout"]],"g":true,"m":false},"383":{"n":"固拉多","t":["ground"],"s":[100,150,140,100,90,90],"l":[[1,"ancient-power"],[1,"lava-plume"],[1,"mud-shot"],[1,"precipice-blades"],[1,"scary-face"],[9,"earth-power"],[18,"bulk-up"],[20,"slash"],[27,"earthquake"],[36,"hammer-arm"],[45,"fissure"],[54,"rest"],[72,"fire-blast"],[81,"solar-beam"],[90,"eruption"]],"g":true,"m":false},"384":{"n":"烈空坐","t":["dragon","flying"],"s":[105,150,90,150,90,95],"l":[[1,"air-slash"],[1,"ancient-power"],[1,"dragon-ascent"],[1,"scary-face"],[1,"twister"],[9,"crunch"],[15,"dragon-tail"],[18,"dragon-dance"],[20,"dragon-claw"],[27,"extreme-speed"],[36,"dragon-pulse"],[45,"hyper-voice"],[54,"rest"],[63,"fly"],[72,"hurricane"],[81,"outrage"],[85,"draco-meteor"],[90,"hyper-beam"]],"g":true,"m":false},"385":{"n":"基拉祈","t":["steel","psychic"],"s":[100,100,100,100,100,100],"l":[[1,"confusion"],[1,"wish"],[7,"swift"],[14,"helping-hand"],[15,"psybeam"],[21,"life-dew"],[25,"refresh"],[28,"zen-headbutt"],[30,"flash-cannon"],[30,"lucky-chant"],[35,"gravity"],[42,"psychic"],[49,"meteor-mash"],[56,"healing-wish"],[63,"rest"],[70,"future-sight"],[77,"double-edge"],[84,"cosmic-power"],[91,"last-resort"],[98,"doom-desire"]],"g":false,"m":true},"386":{"n":"代欧奇希斯","t":["psychic"],"s":[50,150,50,150,50,150],"l":[[1,"leer"],[1,"wrap"],[7,"night-shade"],[13,"teleport"],[15,"psybeam"],[15,"stored-power"],[19,"knock-off"],[25,"psyshock"],[31,"psychic"],[37,"gravity"],[37,"snatch"],[43,"psycho-shift"],[43,"skill-swap"],[49,"zen-headbutt"],[55,"cosmic-power"],[61,"recover"],[67,"psycho-boost"],[73,"hyper-beam"]],"g":false,"m":true,"u":386},"387":{"n":"草苗龟","t":["grass"],"s":[55,68,64,45,55,31],"l":[[1,"tackle"],[5,"withdraw"],[6,"leafage"],[9,"absorb"],[10,"growth"],[13,"razor-leaf"],[17,"curse"],[21,"bite"],[25,"mega-drain"],[29,"leech-seed"],[30,"bullet-seed"],[30,"seed-bomb"],[33,"synthesis"],[37,"crunch"],[41,"giga-drain"],[45,"leaf-storm"]],"g":false,"m":false},"388":{"n":"树林龟","t":["grass"],"s":[75,89,85,55,65,36],"l":[[1,"tackle"],[5,"withdraw"],[6,"leafage"],[9,"absorb"],[10,"growth"],[13,"razor-leaf"],[17,"curse"],[22,"bite"],[27,"mega-drain"],[30,"bullet-seed"],[30,"seed-bomb"],[32,"leech-seed"],[37,"synthesis"],[42,"crunch"],[47,"giga-drain"],[52,"leaf-storm"]],"g":false,"m":false},"389":{"n":"土台龟","t":["grass","ground"],"s":[95,109,105,75,85,56],"l":[[0,"earthquake"],[1,"tackle"],[5,"withdraw"],[6,"leafage"],[9,"absorb"],[10,"growth"],[13,"razor-leaf"],[17,"curse"],[22,"bite"],[27,"mega-drain"],[30,"bullet-seed"],[30,"seed-bomb"],[33,"leech-seed"],[39,"synthesis"],[45,"crunch"],[51,"giga-drain"],[57,"leaf-storm"],[63,"headlong-rush"]],"g":false,"m":false},"390":{"n":"小火焰猴","t":["fire"],"s":[44,58,44,58,44,61],"l":[[1,"leer"],[1,"scratch"],[7,"ember"],[9,"taunt"],[12,"power-up-punch"],[15,"flame-charge"],[15,"fury-swipes"],[15,"incinerate"],[17,"flame-wheel"],[23,"nasty-plot"],[25,"torment"],[30,"burning-jealousy"],[30,"fire-pledge"],[30,"fire-punch"],[31,"facade"],[33,"fire-spin"],[39,"acrobatics"],[41,"slack-off"],[45,"heat-wave"],[47,"flamethrower"],[65,"fire-blast"],[85,"flare-blitz"],[85,"overheat"]],"g":false,"m":false},"391":{"n":"猛火猴","t":["fire","fighting"],"s":[64,78,52,78,52,81],"l":[[0,"mach-punch"],[1,"leer"],[1,"scratch"],[7,"ember"],[9,"taunt"],[12,"power-up-punch"],[15,"flame-charge"],[15,"incinerate"],[15,"low-kick"],[15,"low-sweep"],[16,"fury-swipes"],[19,"flame-wheel"],[23,"nasty-plot"],[26,"feint"],[29,"torment"],[30,"brick-break"],[30,"burning-jealousy"],[30,"fire-pledge"],[30,"fire-punch"],[31,"facade"],[36,"close-combat"],[39,"fire-spin"],[45,"heat-wave"],[46,"acrobatics"],[47,"flamethrower"],[49,"slack-off"],[56,"flare-blitz"],[65,"fire-blast"],[85,"overheat"]],"g":false,"m":false},"392":{"n":"烈焰猴","t":["fire","fighting"],"s":[76,104,71,104,71,108],"l":[[0,"close-combat"],[0,"mach-punch"],[1,"leer"],[1,"scratch"],[7,"ember"],[9,"taunt"],[12,"power-up-punch"],[15,"flame-charge"],[15,"incinerate"],[15,"low-kick"],[15,"low-sweep"],[16,"fury-swipes"],[19,"flame-wheel"],[23,"nasty-plot"],[26,"feint"],[29,"punishment"],[29,"torment"],[29,"u-turn"],[30,"brick-break"],[30,"burning-jealousy"],[30,"fire-pledge"],[30,"fire-punch"],[31,"facade"],[42,"fire-spin"],[45,"heat-wave"],[47,"flamethrower"],[47,"flare-blitz"],[49,"slack-off"],[52,"acrobatics"],[58,"calm-mind"],[65,"fire-blast"],[65,"raging-fury"],[85,"overheat"]],"g":false,"m":false},"393":{"n":"波加曼","t":["water"],"s":[53,51,53,61,56,40],"l":[[1,"pound"],[4,"growl"],[8,"water-gun"],[11,"charm"],[11,"water-sport"],[15,"chilling-water"],[15,"peck"],[15,"water-pulse"],[18,"bubble-beam"],[22,"bide"],[22,"swagger"],[25,"fury-attack"],[29,"brine"],[30,"scald"],[30,"waterfall"],[32,"whirlpool"],[36,"mist"],[39,"drill-peck"],[43,"hydro-pump"]],"g":false,"m":false},"394":{"n":"波皇子","t":["water"],"s":[64,66,68,81,76,50],"l":[[0,"metal-claw"],[1,"pound"],[4,"growl"],[8,"water-gun"],[11,"charm"],[11,"water-sport"],[15,"chilling-water"],[15,"peck"],[15,"water-pulse"],[19,"bubble-beam"],[22,"bide"],[24,"swagger"],[28,"fury-attack"],[30,"scald"],[30,"waterfall"],[33,"brine"],[37,"whirlpool"],[42,"mist"],[46,"drill-peck"],[50,"hydro-pump"]],"g":false,"m":false},"395":{"n":"帝王拿波","t":["water","steel"],"s":[84,86,88,111,101,60],"l":[[0,"aqua-jet"],[0,"metal-claw"],[1,"pound"],[4,"growl"],[8,"water-gun"],[11,"charm"],[11,"swords-dance"],[11,"water-sport"],[15,"chilling-water"],[15,"peck"],[15,"water-pulse"],[19,"bubble-beam"],[22,"bide"],[24,"swagger"],[28,"fury-attack"],[30,"flash-cannon"],[30,"scald"],[30,"steel-wing"],[30,"waterfall"],[33,"brine"],[39,"whirlpool"],[46,"mist"],[52,"drill-peck"],[59,"hydro-pump"],[66,"wave-crash"]],"g":false,"m":false},"396":{"n":"姆克儿","t":["normal","flying"],"s":[40,55,30,30,30,60],"l":[[1,"growl"],[1,"tackle"],[5,"quick-attack"],[9,"wing-attack"],[13,"double-team"],[17,"endeavor"],[21,"whirlwind"],[25,"aerial-ace"],[29,"take-down"],[30,"dual-wingbeat"],[33,"agility"],[37,"brave-bird"],[41,"final-gambit"],[85,"double-edge"]],"g":false,"m":false},"397":{"n":"姆克鸟","t":["normal","flying"],"s":[55,75,50,40,40,80],"l":[[1,"growl"],[1,"tackle"],[5,"quick-attack"],[9,"wing-attack"],[13,"double-team"],[18,"endeavor"],[23,"whirlwind"],[28,"aerial-ace"],[30,"dual-wingbeat"],[33,"take-down"],[38,"agility"],[43,"brave-bird"],[48,"final-gambit"],[85,"double-edge"]],"g":false,"m":false},"398":{"n":"姆克鹰","t":["normal","flying"],"s":[85,120,70,50,60,100],"l":[[0,"close-combat"],[1,"growl"],[1,"tackle"],[5,"quick-attack"],[9,"wing-attack"],[13,"double-team"],[18,"endeavor"],[23,"whirlwind"],[28,"aerial-ace"],[30,"dual-wingbeat"],[33,"take-down"],[41,"agility"],[49,"brave-bird"],[57,"final-gambit"],[85,"double-edge"]],"g":false,"m":false},"399":{"n":"大牙狸","t":["normal"],"s":[59,45,40,35,40,31],"l":[[1,"growl"],[1,"tackle"],[5,"defense-curl"],[9,"rollout"],[13,"headbutt"],[17,"hyper-fang"],[17,"taunt"],[21,"yawn"],[25,"crunch"],[29,"take-down"],[33,"super-fang"],[37,"swords-dance"],[41,"amnesia"],[45,"superpower"],[49,"curse"]],"g":false,"m":false},"400":{"n":"大尾狸","t":["normal","water"],"s":[79,85,60,55,60,71],"l":[[0,"water-gun"],[1,"growl"],[1,"tackle"],[5,"defense-curl"],[9,"rollout"],[13,"headbutt"],[15,"water-pulse"],[17,"hyper-fang"],[18,"taunt"],[23,"yawn"],[28,"crunch"],[30,"waterfall"],[33,"take-down"],[38,"super-fang"],[43,"swords-dance"],[48,"amnesia"],[53,"superpower"],[58,"curse"]],"g":false,"m":false},"401":{"n":"圆法师","t":["bug"],"s":[37,25,41,25,41,25],"l":[[1,"bide"],[1,"growl"],[1,"tackle"],[6,"struggle-bug"],[16,"bug-bite"],[30,"lunge"],[30,"skitter-smack"]],"g":false,"m":false},"402":{"n":"音箱蟀","t":["bug"],"s":[77,85,51,55,51,65],"l":[[0,"fury-cutter"],[1,"bide"],[1,"growl"],[1,"tackle"],[6,"struggle-bug"],[14,"absorb"],[14,"leech-life"],[16,"bug-bite"],[18,"sing"],[22,"focus-energy"],[26,"slash"],[30,"lunge"],[30,"skitter-smack"],[30,"x-scissor"],[34,"screech"],[36,"fell-stinger"],[38,"taunt"],[42,"night-slash"],[44,"sticky-web"],[46,"bug-buzz"],[50,"perish-song"]],"g":false,"m":false},"403":{"n":"小猫怪","t":["electric"],"s":[45,65,34,40,34,45],"l":[[1,"leer"],[1,"tackle"],[4,"thunder-shock"],[8,"charge"],[11,"baby-doll-eyes"],[12,"bite"],[15,"charge-beam"],[15,"electroweb"],[15,"shock-wave"],[15,"thunder-fang"],[16,"spark"],[20,"roar"],[24,"volt-switch"],[28,"scary-face"],[32,"thunder-wave"],[36,"crunch"],[40,"discharge"],[44,"swagger"],[48,"wild-charge"]],"g":false,"m":false},"404":{"n":"勒克猫","t":["electric"],"s":[60,85,49,60,49,60],"l":[[1,"leer"],[1,"tackle"],[4,"thunder-shock"],[8,"charge"],[11,"baby-doll-eyes"],[12,"bite"],[15,"charge-beam"],[15,"electroweb"],[15,"shock-wave"],[15,"thunder-fang"],[18,"spark"],[24,"roar"],[31,"volt-switch"],[36,"scary-face"],[42,"thunder-wave"],[48,"crunch"],[54,"discharge"],[60,"swagger"],[68,"wild-charge"]],"g":false,"m":false},"405":{"n":"伦琴猫","t":["electric"],"s":[80,120,79,95,79,70],"l":[[1,"leer"],[1,"tackle"],[4,"thunder-shock"],[8,"charge"],[11,"baby-doll-eyes"],[12,"bite"],[15,"charge-beam"],[15,"electroweb"],[15,"shock-wave"],[15,"thunder-fang"],[18,"spark"],[24,"roar"],[33,"volt-switch"],[40,"scary-face"],[45,"thunderbolt"],[48,"thunder-wave"],[56,"crunch"],[64,"discharge"],[65,"supercell-slam"],[67,"electric-terrain"],[72,"swagger"],[80,"wild-charge"]],"g":false,"m":false},"406":{"n":"含羞苞","t":["grass","poison"],"s":[40,30,35,50,70,55],"l":[[1,"absorb"],[1,"growth"],[1,"stun-spore"],[1,"worry-seed"],[7,"water-sport"],[13,"mega-drain"],[15,"grass-knot"],[15,"venoshock"],[30,"giga-drain"],[45,"energy-ball"],[45,"sludge-bomb"],[85,"leaf-storm"],[85,"solar-beam"]],"g":false,"m":false},"407":{"n":"罗丝雷朵","t":["grass","poison"],"s":[60,70,65,125,105,90],"l":[[0,"poison-sting"],[1,"absorb"],[1,"growth"],[1,"stun-spore"],[1,"worry-seed"],[5,"mega-drain"],[7,"water-sport"],[10,"leech-seed"],[15,"grass-knot"],[15,"magical-leaf"],[15,"venoshock"],[20,"toxic-spikes"],[22,"grass-whistle"],[25,"sweet-scent"],[30,"giga-drain"],[35,"synthesis"],[40,"toxic"],[45,"energy-ball"],[45,"petal-blizzard"],[45,"sludge-bomb"],[50,"aromatherapy"],[55,"ingrain"],[60,"petal-dance"],[85,"leaf-storm"],[85,"solar-beam"]],"g":false,"m":false},"408":{"n":"头盖龙","t":["rock"],"s":[67,125,40,30,30,58],"l":[[1,"headbutt"],[1,"leer"],[6,"focus-energy"],[10,"pursuit"],[10,"rock-polish"],[10,"rock-smash"],[15,"rock-tomb"],[15,"smack-down"],[15,"take-down"],[19,"scary-face"],[24,"assurance"],[28,"slam"],[28,"swords-dance"],[30,"rock-blast"],[30,"rock-slide"],[33,"ancient-power"],[37,"zen-headbutt"],[42,"screech"],[46,"head-smash"]],"g":false,"m":false},"409":{"n":"战槌龙","t":["rock"],"s":[97,165,60,65,50,58],"l":[[0,"endeavor"],[1,"headbutt"],[1,"leer"],[6,"focus-energy"],[10,"pursuit"],[10,"rock-polish"],[10,"rock-smash"],[15,"rock-tomb"],[15,"smack-down"],[15,"take-down"],[19,"scary-face"],[24,"assurance"],[28,"slam"],[28,"swords-dance"],[30,"rock-blast"],[30,"rock-slide"],[36,"ancient-power"],[43,"zen-headbutt"],[51,"screech"],[58,"head-smash"]],"g":false,"m":false},"410":{"n":"盾甲龙","t":["rock","steel"],"s":[30,42,118,42,88,30],"l":[[1,"protect"],[1,"tackle"],[6,"taunt"],[10,"metal-sound"],[15,"rock-tomb"],[15,"smack-down"],[15,"take-down"],[19,"iron-defense"],[24,"swagger"],[28,"ancient-power"],[30,"flash-cannon"],[30,"power-gem"],[30,"rock-blast"],[30,"rock-slide"],[33,"endure"],[37,"metal-burst"],[42,"iron-head"],[46,"heavy-slam"],[65,"iron-tail"],[65,"stone-edge"]],"g":false,"m":false},"411":{"n":"护城龙","t":["rock","steel"],"s":[60,52,168,47,138,30],"l":[[0,"block"],[1,"protect"],[1,"tackle"],[6,"taunt"],[10,"metal-sound"],[15,"rock-tomb"],[15,"smack-down"],[15,"take-down"],[19,"iron-defense"],[24,"swagger"],[28,"ancient-power"],[30,"flash-cannon"],[30,"power-gem"],[30,"rock-blast"],[30,"rock-slide"],[36,"endure"],[43,"metal-burst"],[51,"iron-head"],[58,"heavy-slam"],[65,"iron-tail"],[65,"stone-edge"],[85,"meteor-beam"]],"g":false,"m":false},"412":{"n":"结草儿","t":["bug"],"s":[40,29,45,29,45,36],"l":[[1,"protect"],[10,"tackle"],[15,"bug-bite"],[20,"hidden-power"],[20,"string-shot"]],"g":false,"m":false},"413":{"n":"结草贵妇","t":["bug","grass"],"s":[60,59,85,79,105,36],"l":[[0,"quiver-dance"],[1,"protect"],[10,"tackle"],[15,"bug-bite"],[15,"grass-knot"],[15,"struggle-bug"],[20,"hidden-power"],[20,"string-shot"],[23,"confusion"],[26,"razor-leaf"],[29,"growth"],[30,"giga-drain"],[32,"psybeam"],[35,"captivate"],[35,"infestation"],[38,"flail"],[41,"attract"],[44,"psychic"],[45,"energy-ball"],[47,"leaf-storm"],[50,"bug-buzz"]],"g":false,"m":false},"414":{"n":"绅士蛾","t":["bug","flying"],"s":[70,94,50,94,50,66],"l":[[0,"quiver-dance"],[1,"protect"],[10,"tackle"],[15,"acrobatics"],[15,"aerial-ace"],[15,"bug-bite"],[20,"hidden-power"],[20,"string-shot"],[23,"confusion"],[26,"gust"],[29,"poison-powder"],[30,"u-turn"],[32,"psybeam"],[35,"camouflage"],[35,"roost"],[38,"struggle-bug"],[41,"air-slash"],[44,"psychic"],[47,"lunge"],[50,"bug-buzz"]],"g":false,"m":false},"415":{"n":"三蜜蜂","t":["bug","flying"],"s":[30,30,42,30,42,70],"l":[[1,"bug-bite"],[1,"gust"],[1,"struggle-bug"],[1,"sweet-scent"],[29,"bug-buzz"]],"g":false,"m":false},"416":{"n":"蜂女王","t":["bug","flying"],"s":[70,80,102,80,102,40],"l":[[0,"slash"],[1,"bug-bite"],[1,"gust"],[1,"struggle-bug"],[1,"sweet-scent"],[3,"poison-sting"],[4,"fury-cutter"],[7,"confuse-ray"],[8,"aromatic-mist"],[9,"pursuit"],[12,"fell-stinger"],[15,"acrobatics"],[15,"aerial-ace"],[16,"fury-swipes"],[20,"swagger"],[24,"aromatherapy"],[24,"roost"],[28,"air-slash"],[29,"bug-buzz"],[29,"heal-order"],[30,"dual-wingbeat"],[32,"power-gem"],[36,"toxic"],[40,"attack-order"],[40,"defend-order"],[41,"captivate"],[44,"destiny-bond"],[65,"hurricane"]],"g":false,"m":false},"417":{"n":"帕奇利兹","t":["electric"],"s":[60,45,70,45,90,95],"l":[[1,"baby-doll-eyes"],[1,"bide"],[1,"growl"],[1,"thunder-shock"],[5,"quick-attack"],[9,"charm"],[13,"spark"],[17,"endure"],[19,"nuzzle"],[21,"swift"],[25,"electro-ball"],[29,"sweet-kiss"],[30,"thunder-punch"],[30,"volt-switch"],[33,"thunder-wave"],[37,"super-fang"],[41,"discharge"],[45,"last-resort"],[45,"thunderbolt"],[49,"hyper-fang"],[49,"thunder"]],"g":false,"m":false},"418":{"n":"泳圈鼬","t":["water"],"s":[55,65,35,60,30,85],"l":[[1,"tackle"],[4,"growl"],[7,"soak"],[7,"tail-whip"],[7,"water-sport"],[11,"quick-attack"],[15,"chilling-water"],[15,"flip-turn"],[15,"water-gun"],[15,"water-pulse"],[18,"bite"],[21,"swift"],[24,"aqua-jet"],[27,"double-hit"],[30,"waterfall"],[31,"whirlpool"],[35,"liquidation"],[35,"razor-wind"],[38,"aqua-tail"],[41,"agility"],[45,"hydro-pump"],[49,"wave-crash"]],"g":false,"m":false},"419":{"n":"浮潜鼬","t":["water"],"s":[85,105,55,85,50,115],"l":[[1,"tackle"],[4,"growl"],[7,"soak"],[7,"tail-whip"],[7,"water-sport"],[11,"quick-attack"],[15,"chilling-water"],[15,"flip-turn"],[15,"water-gun"],[15,"water-pulse"],[18,"bite"],[21,"swift"],[24,"aqua-jet"],[26,"crunch"],[29,"double-hit"],[30,"waterfall"],[35,"razor-wind"],[35,"whirlpool"],[41,"liquidation"],[46,"aqua-tail"],[51,"agility"],[57,"hydro-pump"],[62,"wave-crash"]],"g":false,"m":false},"420":{"n":"樱花宝","t":["grass"],"s":[45,35,45,62,53,35],"l":[[1,"morning-sun"],[1,"tackle"],[5,"leafage"],[10,"growth"],[15,"grass-knot"],[15,"helping-hand"],[20,"magical-leaf"],[22,"sunny-day"],[26,"leech-seed"],[30,"giga-drain"],[30,"take-down"],[35,"petal-blizzard"],[40,"lucky-chant"],[40,"worry-seed"],[45,"solar-beam"]],"g":false,"m":false},"421":{"n":"樱花儿","t":["grass"],"s":[70,60,70,87,78,85],"l":[[0,"sunny-day"],[1,"morning-sun"],[1,"tackle"],[5,"leafage"],[10,"growth"],[15,"grass-knot"],[15,"helping-hand"],[20,"magical-leaf"],[28,"leech-seed"],[30,"giga-drain"],[34,"take-down"],[40,"lucky-chant"],[41,"petal-blizzard"],[48,"worry-seed"],[55,"solar-beam"],[62,"petal-dance"]],"g":false,"m":false},"422":{"n":"无壳海兔","t":["water"],"s":[76,48,48,57,62,34],"l":[[1,"mud-slap"],[1,"water-gun"],[2,"mud-sport"],[5,"harden"],[10,"recover"],[11,"mud-bomb"],[15,"brine"],[15,"water-pulse"],[16,"hidden-power"],[20,"ancient-power"],[25,"body-slam"],[30,"scald"],[30,"waterfall"],[31,"muddy-water"],[35,"earth-power"],[40,"rain-dance"],[45,"memento"],[65,"hydro-pump"]],"g":false,"m":false},"423":{"n":"海兔兽","t":["water","ground"],"s":[111,83,68,92,82,39],"l":[[1,"mud-slap"],[1,"water-gun"],[2,"mud-sport"],[5,"harden"],[10,"recover"],[11,"mud-bomb"],[15,"brine"],[15,"water-pulse"],[16,"hidden-power"],[20,"ancient-power"],[25,"body-slam"],[30,"dig"],[30,"scald"],[30,"stomping-tantrum"],[30,"waterfall"],[33,"muddy-water"],[39,"earth-power"],[46,"rain-dance"],[53,"memento"],[65,"earthquake"],[65,"hydro-pump"]],"g":false,"m":false},"424":{"n":"双尾怪手","t":["normal"],"s":[75,100,66,60,66,115],"l":[[1,"scratch"],[1,"tail-whip"],[4,"sand-attack"],[8,"astonish"],[11,"baton-pass"],[15,"cut"],[15,"tickle"],[18,"fury-swipes"],[22,"swift"],[25,"screech"],[29,"agility"],[30,"headbutt"],[30,"strength"],[32,"double-hit"],[36,"fling"],[39,"nasty-plot"],[43,"last-resort"],[45,"take-down"],[85,"double-edge"]],"g":false,"m":false},"425":{"n":"飘飘球","t":["ghost","flying"],"s":[90,50,34,60,44,70],"l":[[1,"astonish"],[1,"constrict"],[1,"minimize"],[4,"gust"],[8,"focus-energy"],[12,"payback"],[15,"acrobatics"],[15,"air-cutter"],[15,"night-shade"],[16,"hex"],[20,"shadow-ball"],[24,"spit-up"],[24,"stockpile"],[24,"swallow"],[29,"self-destruct"],[32,"destiny-bond"],[36,"baton-pass"],[40,"amnesia"],[40,"tailwind"],[44,"explosion"],[45,"fly"]],"g":false,"m":false},"426":{"n":"随风球","t":["ghost","flying"],"s":[150,80,44,90,54,80],"l":[[0,"phantom-force"],[1,"astonish"],[1,"constrict"],[1,"minimize"],[4,"gust"],[8,"focus-energy"],[12,"payback"],[15,"acrobatics"],[15,"air-cutter"],[15,"night-shade"],[16,"hex"],[20,"shadow-ball"],[24,"spit-up"],[24,"stockpile"],[24,"swallow"],[30,"air-slash"],[31,"self-destruct"],[36,"destiny-bond"],[40,"amnesia"],[42,"baton-pass"],[45,"fly"],[48,"tailwind"],[54,"explosion"]],"g":false,"m":false},"427":{"n":"卷卷耳","t":["normal"],"s":[55,66,44,44,56,85],"l":[[1,"foresight"],[1,"frustration"],[1,"pound"],[1,"splash"],[4,"defense-curl"],[6,"endure"],[8,"baby-doll-eyes"],[12,"after-you"],[15,"cut"],[16,"quick-attack"],[20,"double-kick"],[23,"jump-kick"],[24,"charm"],[28,"baton-pass"],[30,"facade"],[30,"mega-punch"],[32,"headbutt"],[36,"agility"],[40,"entrainment"],[44,"flatter"],[48,"bounce"],[52,"healing-wish"],[85,"mega-kick"]],"g":false,"m":false},"428":{"n":"长耳兔","t":["normal"],"s":[65,76,84,54,96,105],"l":[[0,"return"],[1,"foresight"],[1,"frustration"],[1,"pound"],[1,"splash"],[4,"defense-curl"],[6,"endure"],[8,"baby-doll-eyes"],[12,"after-you"],[15,"cut"],[16,"quick-attack"],[20,"double-kick"],[23,"jump-kick"],[24,"charm"],[28,"baton-pass"],[30,"facade"],[30,"mega-punch"],[32,"headbutt"],[36,"agility"],[40,"entrainment"],[44,"flatter"],[48,"bounce"],[52,"healing-wish"],[56,"high-jump-kick"],[85,"mega-kick"]],"g":false,"m":false},"429":{"n":"梦妖魔","t":["ghost"],"s":[60,60,60,105,105,105],"l":[[1,"confusion"],[1,"growl"],[5,"spite"],[10,"astonish"],[14,"confuse-ray"],[15,"hex"],[15,"night-shade"],[19,"mean-look"],[28,"psybeam"],[30,"shadow-ball"],[32,"pain-split"],[37,"payback"],[46,"perish-song"],[50,"grudge"],[50,"power-gem"]],"g":false,"m":false},"430":{"n":"乌鸦头头","t":["dark","flying"],"s":[100,125,52,105,52,71],"l":[[1,"astonish"],[1,"peck"],[5,"gust"],[5,"pursuit"],[11,"haze"],[15,"payback"],[15,"snarl"],[15,"thief"],[15,"wing-attack"],[21,"night-shade"],[25,"assurance"],[25,"swagger"],[30,"air-slash"],[30,"dual-wingbeat"],[30,"lash-out"],[31,"taunt"],[35,"mean-look"],[35,"nasty-plot"],[45,"fly"],[45,"foul-play"],[50,"sucker-punch"],[50,"tailwind"],[55,"dark-pulse"],[55,"torment"],[60,"quash"],[65,"comeuppance"],[65,"hurricane"],[85,"brave-bird"]],"g":false,"m":false},"431":{"n":"魅力喵","t":["normal"],"s":[49,55,42,42,37,85],"l":[[1,"fake-out"],[5,"scratch"],[8,"growl"],[13,"hypnosis"],[15,"cut"],[17,"aerial-ace"],[17,"feint-attack"],[20,"fury-swipes"],[25,"charm"],[29,"assist"],[29,"taunt"],[30,"facade"],[32,"captivate"],[32,"retaliate"],[37,"slash"],[41,"sucker-punch"],[44,"attract"],[48,"hone-claws"],[50,"play-rough"]],"g":false,"m":false},"432":{"n":"东施喵","t":["normal"],"s":[71,82,64,64,59,112],"l":[[0,"swagger"],[1,"fake-out"],[5,"scratch"],[8,"growl"],[13,"hypnosis"],[15,"cut"],[17,"aerial-ace"],[17,"feint-attack"],[20,"fury-swipes"],[25,"charm"],[29,"assist"],[29,"taunt"],[30,"facade"],[32,"captivate"],[32,"retaliate"],[37,"slash"],[41,"sucker-punch"],[45,"body-slam"],[50,"play-rough"],[52,"attract"],[60,"hone-claws"]],"g":false,"m":false},"433":{"n":"铃铛响","t":["psychic"],"s":[45,30,50,65,50,45],"l":[[1,"wrap"],[4,"growl"],[7,"astonish"],[10,"confusion"],[13,"yawn"],[16,"last-resort"],[19,"entrainment"],[30,"psychic-noise"],[30,"psyshock"],[32,"uproar"],[45,"psychic"],[85,"future-sight"]],"g":false,"m":false},"434":{"n":"臭鼬噗","t":["poison","dark"],"s":[63,63,47,41,41,74],"l":[[1,"poison-gas"],[1,"scratch"],[3,"feint"],[6,"smokescreen"],[9,"acid-spray"],[12,"fury-swipes"],[15,"focus-energy"],[15,"knock-off"],[15,"payback"],[15,"poison-tail"],[15,"thief"],[18,"bite"],[21,"venoshock"],[24,"screech"],[25,"slash"],[27,"toxic"],[30,"crunch"],[30,"lash-out"],[30,"poison-jab"],[30,"sucker-punch"],[33,"memento"],[36,"night-slash"],[39,"belch"],[42,"explosion"],[42,"venom-drench"],[45,"foul-play"],[85,"gunk-shot"]],"g":false,"m":false},"435":{"n":"坦克臭鼬","t":["poison","dark"],"s":[103,93,67,71,61,84],"l":[[0,"flamethrower"],[1,"poison-gas"],[1,"scratch"],[3,"feint"],[6,"smokescreen"],[9,"acid-spray"],[12,"fury-swipes"],[15,"focus-energy"],[15,"knock-off"],[15,"payback"],[15,"poison-tail"],[15,"thief"],[18,"bite"],[21,"venoshock"],[24,"screech"],[25,"slash"],[27,"toxic"],[30,"crunch"],[30,"lash-out"],[30,"poison-jab"],[30,"sucker-punch"],[33,"memento"],[38,"night-slash"],[42,"venom-drench"],[43,"belch"],[45,"foul-play"],[48,"explosion"],[85,"gunk-shot"]],"g":false,"m":false},"436":{"n":"铜镜怪","t":["steel","psychic"],"s":[57,24,86,24,86,23],"l":[[1,"confusion"],[1,"tackle"],[4,"confuse-ray"],[8,"payback"],[12,"imprison"],[16,"gyro-ball"],[20,"hypnosis"],[21,"feint-attack"],[24,"safeguard"],[28,"extrasensory"],[30,"flash-cannon"],[32,"heavy-slam"],[36,"iron-defense"],[40,"metal-sound"],[44,"future-sight"],[45,"heal-block"]],"g":false,"m":false},"437":{"n":"青铜钟","t":["steel","psychic"],"s":[67,89,116,79,116,33],"l":[[0,"block"],[1,"confusion"],[1,"tackle"],[4,"confuse-ray"],[8,"payback"],[12,"imprison"],[15,"psybeam"],[16,"gyro-ball"],[20,"hypnosis"],[21,"feint-attack"],[24,"safeguard"],[28,"extrasensory"],[30,"flash-cannon"],[30,"iron-head"],[30,"zen-headbutt"],[32,"heavy-slam"],[38,"iron-defense"],[44,"metal-sound"],[45,"heal-block"],[50,"future-sight"],[56,"rain-dance"]],"g":false,"m":false},"438":{"n":"盆才怪","t":["rock"],"s":[50,80,95,10,45,10],"l":[[1,"copycat"],[1,"fake-tears"],[4,"flail"],[8,"rock-throw"],[12,"block"],[15,"slam"],[16,"mimic"],[19,"feint-attack"],[20,"rock-tomb"],[24,"tearful-look"],[28,"sucker-punch"],[30,"rock-blast"],[32,"rock-slide"],[36,"low-kick"],[40,"counter"],[44,"double-edge"],[65,"stone-edge"]],"g":false,"m":false},"439":{"n":"魔尼尼","t":["psychic","fairy"],"s":[20,25,45,70,90,60],"l":[[1,"barrier"],[1,"copycat"],[1,"pound"],[1,"tickle"],[4,"baton-pass"],[8,"encore"],[8,"meditate"],[11,"double-slap"],[12,"confusion"],[16,"role-play"],[20,"protect"],[24,"recycle"],[28,"psybeam"],[29,"substitute"],[30,"psyshock"],[32,"mimic"],[36,"light-screen"],[36,"reflect"],[36,"safeguard"],[36,"trick"],[40,"sucker-punch"],[44,"dazzling-gleam"],[48,"psychic"],[52,"teeter-dance"],[85,"future-sight"]],"g":false,"m":false},"440":{"n":"小福蛋","t":["normal"],"s":[100,5,5,15,65,30],"l":[[1,"copycat"],[1,"minimize"],[1,"pound"],[4,"defense-curl"],[8,"sweet-kiss"],[9,"refresh"],[12,"disarming-voice"],[15,"echoed-voice"],[15,"hidden-power"],[16,"covet"],[20,"charm"],[30,"tera-blast"],[45,"uproar"]],"g":false,"m":false},"441":{"n":"聒噪鸟","t":["normal","flying"],"s":[76,65,45,92,42,91],"l":[[1,"chatter"],[1,"confide"],[1,"hyper-voice"],[1,"taunt"],[5,"peck"],[9,"growl"],[9,"mirror-move"],[13,"sing"],[17,"fury-attack"],[29,"round"],[33,"mimic"],[37,"echoed-voice"],[41,"roost"],[45,"uproar"],[49,"parting-shot"],[49,"synchronoise"],[50,"feather-dance"]],"g":false,"m":false},"442":{"n":"花岩怪","t":["ghost","dark"],"s":[50,92,108,92,108,35],"l":[[1,"confuse-ray"],[1,"night-shade"],[1,"pursuit"],[5,"shadow-sneak"],[7,"feint-attack"],[10,"spite"],[15,"payback"],[20,"nasty-plot"],[25,"hex"],[30,"lash-out"],[30,"memento"],[35,"sucker-punch"],[40,"curse"],[45,"foul-play"],[45,"phantom-force"],[45,"shadow-ball"],[50,"dark-pulse"],[55,"hypnosis"],[60,"dream-eater"],[65,"poltergeist"]],"g":false,"m":false},"443":{"n":"圆陆鲨","t":["dragon","ground"],"s":[58,70,45,40,45,42],"l":[[1,"sand-tomb"],[1,"tackle"],[6,"sand-attack"],[7,"dragon-rage"],[12,"dragon-breath"],[15,"dragon-tail"],[18,"bulldoze"],[25,"bite"],[30,"scale-shot"],[30,"slash"],[36,"dragon-claw"],[42,"dig"],[48,"sandstorm"],[54,"take-down"],[60,"dragon-rush"],[65,"earthquake"],[85,"outrage"]],"g":false,"m":false},"444":{"n":"尖牙陆鲨","t":["dragon","ground"],"s":[68,90,65,50,55,82],"l":[[0,"dual-chop"],[1,"sand-tomb"],[1,"tackle"],[6,"sand-attack"],[7,"dragon-rage"],[12,"dragon-breath"],[15,"dragon-tail"],[18,"bulldoze"],[27,"bite"],[30,"scale-shot"],[34,"slash"],[42,"dragon-claw"],[50,"dig"],[58,"sandstorm"],[65,"earthquake"],[66,"take-down"],[74,"dragon-rush"],[85,"outrage"]],"g":false,"m":false},"445":{"n":"烈咬陆鲨","t":["dragon","ground"],"s":[108,130,95,80,85,102],"l":[[0,"crunch"],[0,"dual-chop"],[1,"sand-tomb"],[1,"tackle"],[6,"sand-attack"],[7,"dragon-rage"],[12,"dragon-breath"],[15,"dragon-tail"],[18,"bulldoze"],[27,"bite"],[30,"scale-shot"],[30,"stomping-tantrum"],[34,"slash"],[42,"dragon-claw"],[52,"dig"],[62,"sandstorm"],[65,"earthquake"],[72,"take-down"],[82,"dragon-rush"],[85,"outrage"]],"g":false,"m":false},"446":{"n":"小卡比兽","t":["normal"],"s":[135,85,40,40,85,5],"l":[[1,"lick"],[1,"odor-sleuth"],[1,"tackle"],[4,"defense-curl"],[8,"recycle"],[12,"covet"],[16,"bite"],[17,"chip-away"],[20,"stockpile"],[20,"swallow"],[24,"screech"],[28,"body-slam"],[32,"fling"],[36,"amnesia"],[36,"rollout"],[40,"metronome"],[44,"flail"],[45,"take-down"],[48,"belly-drum"],[49,"natural-gift"],[50,"snatch"],[52,"last-resort"],[85,"mega-kick"]],"g":false,"m":false},"447":{"n":"利欧路","t":["fighting"],"s":[40,70,40,35,40,60],"l":[[1,"endure"],[1,"foresight"],[1,"quick-attack"],[4,"feint"],[8,"metal-claw"],[12,"counter"],[15,"low-kick"],[15,"low-sweep"],[15,"power-up-punch"],[16,"work-up"],[20,"rock-smash"],[24,"nasty-plot"],[24,"vacuum-wave"],[28,"screech"],[30,"brick-break"],[32,"quick-guard"],[36,"force-palm"],[40,"swords-dance"],[44,"helping-hand"],[48,"copycat"],[52,"final-gambit"],[56,"reversal"],[85,"close-combat"]],"g":false,"m":false},"448":{"n":"路卡利欧","t":["fighting","steel"],"s":[70,110,70,115,70,90],"l":[[0,"aura-sphere"],[1,"endure"],[1,"foresight"],[1,"quick-attack"],[4,"feint"],[8,"metal-claw"],[12,"counter"],[15,"low-kick"],[15,"low-sweep"],[15,"power-up-punch"],[16,"laser-focus"],[16,"work-up"],[20,"force-palm"],[20,"rock-smash"],[24,"calm-mind"],[24,"nasty-plot"],[24,"vacuum-wave"],[28,"metal-sound"],[28,"screech"],[30,"brick-break"],[30,"flash-cannon"],[32,"quick-guard"],[36,"bone-rush"],[37,"me-first"],[40,"swords-dance"],[44,"heal-pulse"],[44,"helping-hand"],[48,"copycat"],[48,"meteor-mash"],[52,"dragon-pulse"],[52,"final-gambit"],[56,"extreme-speed"],[56,"reversal"],[60,"close-combat"],[65,"iron-tail"],[85,"focus-blast"]],"g":false,"m":false},"449":{"n":"沙河马","t":["ground"],"s":[68,72,78,38,42,32],"l":[[1,"sand-attack"],[1,"tackle"],[4,"bite"],[8,"yawn"],[12,"sand-tomb"],[15,"bulldoze"],[16,"dig"],[20,"crunch"],[24,"sandstorm"],[28,"take-down"],[32,"roar"],[36,"rest"],[40,"earthquake"],[44,"double-edge"],[48,"fissure"],[52,"slack-off"]],"g":false,"m":false},"450":{"n":"河马兽","t":["ground"],"s":[108,112,118,68,72,47],"l":[[1,"sand-attack"],[1,"tackle"],[4,"bite"],[8,"yawn"],[12,"sand-tomb"],[15,"bulldoze"],[16,"dig"],[20,"crunch"],[24,"sandstorm"],[28,"take-down"],[32,"roar"],[38,"rest"],[44,"earthquake"],[50,"double-edge"],[56,"fissure"],[62,"slack-off"]],"g":false,"m":false},"451":{"n":"钳尾蝎","t":["poison","bug"],"s":[40,50,90,30,55,65],"l":[[1,"leer"],[1,"poison-sting"],[3,"hone-claws"],[6,"fell-stinger"],[9,"poison-fang"],[12,"bite"],[15,"toxic-spikes"],[18,"bug-bite"],[21,"venoshock"],[24,"knock-off"],[27,"scary-face"],[30,"pin-missile"],[30,"poison-jab"],[33,"toxic"],[36,"night-slash"],[39,"cross-poison"],[42,"x-scissor"],[45,"acupressure"],[48,"crunch"]],"g":false,"m":false},"452":{"n":"龙王蝎","t":["poison","dark"],"s":[70,90,110,60,75,95],"l":[[1,"leer"],[1,"poison-sting"],[3,"hone-claws"],[6,"fell-stinger"],[9,"poison-fang"],[12,"bite"],[15,"toxic-spikes"],[18,"bug-bite"],[21,"venoshock"],[24,"knock-off"],[27,"scary-face"],[30,"pin-missile"],[30,"poison-jab"],[30,"throat-chop"],[33,"toxic"],[36,"night-slash"],[39,"cross-poison"],[44,"x-scissor"],[49,"acupressure"],[54,"crunch"]],"g":false,"m":false},"453":{"n":"不良蛙","t":["poison","fighting"],"s":[48,61,40,61,40,50],"l":[[1,"mud-slap"],[1,"poison-sting"],[4,"astonish"],[8,"taunt"],[12,"flatter"],[15,"acid-spray"],[15,"low-sweep"],[15,"pursuit"],[15,"revenge"],[15,"reversal"],[16,"low-kick"],[17,"feint-attack"],[20,"venoshock"],[24,"sucker-punch"],[28,"swagger"],[29,"mud-bomb"],[30,"brick-break"],[32,"poison-jab"],[36,"toxic"],[40,"nasty-plot"],[44,"sludge-bomb"],[45,"sludge-wave"],[48,"belch"],[85,"focus-blast"],[85,"gunk-shot"]],"g":false,"m":false},"454":{"n":"毒骷蛙","t":["poison","fighting"],"s":[83,106,65,86,65,85],"l":[[1,"mud-slap"],[1,"poison-sting"],[4,"astonish"],[8,"taunt"],[12,"flatter"],[15,"acid-spray"],[15,"low-sweep"],[15,"pursuit"],[15,"revenge"],[15,"reversal"],[16,"low-kick"],[17,"feint-attack"],[20,"venoshock"],[24,"sucker-punch"],[28,"swagger"],[29,"mud-bomb"],[30,"brick-break"],[30,"cross-poison"],[32,"poison-jab"],[36,"toxic"],[42,"nasty-plot"],[45,"sludge-wave"],[48,"sludge-bomb"],[54,"belch"],[85,"close-combat"],[85,"focus-blast"],[85,"gunk-shot"]],"g":false,"m":false},"455":{"n":"尖牙笼","t":["grass"],"s":[74,100,72,90,72,46],"l":[[1,"bind"],[1,"growth"],[7,"bite"],[11,"vine-whip"],[17,"sweet-scent"],[21,"ingrain"],[27,"grass-knot"],[30,"bullet-seed"],[30,"giga-drain"],[31,"leaf-tornado"],[37,"spit-up"],[37,"stockpile"],[37,"swallow"],[41,"crunch"],[45,"energy-ball"],[47,"seed-bomb"],[47,"wring-out"],[50,"power-whip"]],"g":false,"m":false},"456":{"n":"荧光鱼","t":["water"],"s":[49,49,56,49,61,66],"l":[[1,"pound"],[6,"water-gun"],[13,"rain-dance"],[15,"brine"],[15,"chilling-water"],[15,"flip-turn"],[17,"gust"],[22,"water-pulse"],[26,"attract"],[26,"captivate"],[29,"safeguard"],[30,"waterfall"],[33,"aqua-ring"],[38,"whirlpool"],[42,"u-turn"],[45,"bounce"],[45,"surf"],[49,"tailwind"],[54,"soak"],[65,"hydro-pump"]],"g":false,"m":false},"457":{"n":"霓虹鱼","t":["water"],"s":[69,69,76,69,86,91],"l":[[1,"pound"],[6,"water-gun"],[13,"rain-dance"],[15,"brine"],[15,"chilling-water"],[15,"flip-turn"],[17,"gust"],[22,"water-pulse"],[26,"attract"],[26,"captivate"],[29,"safeguard"],[30,"waterfall"],[35,"aqua-ring"],[42,"whirlpool"],[45,"surf"],[48,"u-turn"],[53,"bounce"],[54,"soak"],[59,"tailwind"],[65,"hydro-pump"]],"g":false,"m":false},"458":{"n":"小球飞鱼","t":["water","flying"],"s":[45,20,50,60,120,50],"l":[[1,"tackle"],[1,"water-gun"],[4,"supersonic"],[8,"wing-attack"],[11,"confuse-ray"],[12,"water-pulse"],[16,"wide-guard"],[20,"agility"],[24,"bubble-beam"],[28,"headbutt"],[30,"scald"],[32,"air-slash"],[36,"aqua-ring"],[40,"bounce"],[44,"take-down"],[45,"surf"],[48,"hydro-pump"]],"g":false,"m":false},"459":{"n":"雪笠怪","t":["grass","ice"],"s":[60,62,50,62,60,40],"l":[[1,"leer"],[1,"powder-snow"],[5,"leafage"],[10,"mist"],[13,"grass-whistle"],[15,"avalanche"],[15,"grassy-glide"],[15,"ice-shard"],[15,"magical-leaf"],[15,"trailblaze"],[20,"razor-leaf"],[25,"icy-wind"],[30,"bullet-seed"],[30,"giga-drain"],[30,"ice-punch"],[30,"ice-spinner"],[30,"icicle-spear"],[30,"seed-bomb"],[30,"swagger"],[35,"ingrain"],[41,"wood-hammer"],[45,"blizzard"],[50,"sheer-cold"],[85,"leaf-storm"]],"g":false,"m":false},"460":{"n":"暴雪王","t":["grass","ice"],"s":[90,92,75,92,85,60],"l":[[0,"ice-punch"],[1,"leer"],[1,"powder-snow"],[5,"leafage"],[10,"mist"],[13,"grass-whistle"],[15,"avalanche"],[15,"grassy-glide"],[15,"ice-shard"],[15,"magical-leaf"],[15,"trailblaze"],[20,"razor-leaf"],[25,"icy-wind"],[30,"bullet-seed"],[30,"giga-drain"],[30,"ice-spinner"],[30,"icicle-spear"],[30,"seed-bomb"],[30,"swagger"],[35,"ingrain"],[43,"wood-hammer"],[49,"blizzard"],[56,"sheer-cold"],[85,"leaf-storm"]],"g":false,"m":false},"461":{"n":"玛狃拉","t":["dark","ice"],"s":[70,120,65,45,85,125],"l":[[1,"leer"],[1,"scratch"],[6,"taunt"],[10,"feint-attack"],[12,"quick-attack"],[15,"avalanche"],[15,"knock-off"],[18,"metal-claw"],[24,"icy-wind"],[30,"fury-swipes"],[30,"ice-punch"],[30,"ice-spinner"],[30,"icicle-spear"],[30,"lash-out"],[30,"throat-chop"],[36,"hone-claws"],[40,"snatch"],[42,"beat-up"],[42,"fling"],[44,"punishment"],[45,"foul-play"],[47,"ice-shard"],[48,"agility"],[48,"nasty-plot"],[54,"screech"],[60,"night-slash"],[60,"slash"],[66,"dark-pulse"],[85,"triple-axel"]],"g":false,"m":false},"462":{"n":"自爆磁怪","t":["electric","steel"],"s":[70,70,115,130,90,60],"l":[[0,"tri-attack"],[1,"tackle"],[1,"thunder-shock"],[4,"supersonic"],[8,"thunder-wave"],[11,"electric-terrain"],[11,"magnet-bomb"],[12,"electro-ball"],[15,"sonic-boom"],[16,"gyro-ball"],[20,"spark"],[23,"mirror-shot"],[24,"screech"],[26,"thunderbolt"],[28,"magnet-rise"],[34,"flash-cannon"],[38,"swift"],[40,"discharge"],[44,"thunder"],[46,"metal-sound"],[52,"light-screen"],[58,"lock-on"],[64,"zap-cannon"]],"g":false,"m":false},"463":{"n":"大舌舔","t":["normal"],"s":[110,85,95,80,95,50],"l":[[1,"defense-curl"],[1,"lick"],[6,"rollout"],[10,"acid"],[12,"supersonic"],[15,"cut"],[15,"hidden-power"],[15,"rage"],[18,"wrap"],[24,"disable"],[30,"headbutt"],[30,"mega-punch"],[30,"stomp"],[36,"knock-off"],[37,"chip-away"],[40,"thrash"],[41,"me-first"],[42,"screech"],[45,"refresh"],[48,"slam"],[54,"power-whip"],[57,"wring-out"],[60,"belly-drum"],[61,"gyro-ball"],[85,"skull-bash"]],"g":false,"m":false},"464":{"n":"超甲狂犀","t":["ground","rock"],"s":[115,140,130,55,55,40],"l":[[0,"hammer-arm"],[1,"sand-attack"],[1,"tackle"],[1,"tail-whip"],[5,"smack-down"],[7,"fury-attack"],[10,"bulldoze"],[15,"horn-attack"],[15,"rock-tomb"],[20,"scary-face"],[25,"chip-away"],[25,"stomp"],[30,"dig"],[30,"rock-blast"],[30,"stomping-tantrum"],[35,"drill-run"],[40,"take-down"],[47,"earthquake"],[50,"leer"],[54,"stone-edge"],[61,"megahorn"],[68,"horn-drill"],[75,"rock-wrecker"]],"g":false,"m":false},"465":{"n":"巨蔓藤","t":["grass"],"s":[100,100,125,110,50,50],"l":[[1,"absorb"],[1,"bind"],[4,"stun-spore"],[8,"growth"],[10,"confusion"],[12,"mega-drain"],[15,"grass-knot"],[16,"vine-whip"],[20,"poison-powder"],[24,"ancient-power"],[28,"knock-off"],[30,"bullet-seed"],[30,"seed-bomb"],[32,"giga-drain"],[33,"natural-gift"],[36,"sleep-powder"],[39,"leech-seed"],[40,"slam"],[44,"tickle"],[45,"energy-ball"],[46,"wring-out"],[48,"power-whip"],[49,"amnesia"],[52,"ingrain"],[56,"block"],[56,"grassy-terrain"],[85,"leaf-storm"],[85,"solar-beam"]],"g":false,"m":false},"466":{"n":"电击魔兽","t":["electric"],"s":[75,123,67,95,85,95],"l":[[1,"leer"],[1,"quick-attack"],[4,"thunder-shock"],[8,"charge"],[12,"swift"],[15,"charge-beam"],[15,"electro-ball"],[15,"electroweb"],[16,"shock-wave"],[20,"thunder-wave"],[24,"screech"],[28,"thunder-punch"],[30,"volt-switch"],[34,"discharge"],[40,"low-kick"],[45,"wild-charge"],[46,"thunderbolt"],[52,"light-screen"],[58,"thunder"],[64,"giga-impact"],[65,"electric-terrain"],[65,"supercell-slam"],[85,"zap-cannon"]],"g":false,"m":false},"467":{"n":"鸭嘴炎兽","t":["fire"],"s":[75,95,67,125,95,83],"l":[[1,"leer"],[1,"smog"],[4,"ember"],[8,"smokescreen"],[12,"clear-smog"],[12,"feint-attack"],[15,"flame-charge"],[15,"incinerate"],[16,"flame-wheel"],[20,"confuse-ray"],[22,"flame-burst"],[24,"scary-face"],[28,"fire-punch"],[30,"mystical-fire"],[34,"lava-plume"],[40,"low-kick"],[45,"heat-wave"],[46,"flamethrower"],[52,"sunny-day"],[58,"fire-blast"],[64,"hyper-beam"],[85,"flare-blitz"],[85,"overheat"]],"g":false,"m":false},"468":{"n":"波克基斯","t":["fairy","flying"],"s":[85,50,95,120,115,80],"l":[[0,"air-slash"],[0,"fairy-wind"],[1,"growl"],[1,"pound"],[4,"sweet-kiss"],[8,"life-dew"],[12,"charm"],[15,"aerial-ace"],[15,"draining-kiss"],[16,"ancient-power"],[17,"encore"],[20,"yawn"],[24,"metronome"],[25,"bestow"],[28,"after-you"],[30,"dazzling-gleam"],[32,"double-edge"],[36,"safeguard"],[40,"follow-me"],[44,"baton-pass"],[45,"fly"],[48,"last-resort"],[52,"wish"]],"g":false,"m":false},"469":{"n":"远古巨蜓","t":["bug","flying"],"s":[86,76,86,116,56,95],"l":[[1,"foresight"],[1,"gust"],[1,"tackle"],[11,"double-team"],[14,"air-cutter"],[14,"quick-attack"],[14,"sonic-boom"],[15,"silver-wind"],[15,"struggle-bug"],[17,"detect"],[22,"supersonic"],[27,"uproar"],[30,"air-slash"],[30,"bug-bite"],[30,"leech-life"],[30,"pursuit"],[30,"skitter-smack"],[30,"string-shot"],[33,"ancient-power"],[38,"feint"],[38,"hypnosis"],[43,"slash"],[43,"wing-attack"],[45,"bug-buzz"],[46,"screech"],[49,"u-turn"]],"g":false,"m":false},"470":{"n":"叶伊布","t":["grass"],"s":[65,110,130,60,65,95],"l":[[0,"razor-leaf"],[1,"covet"],[1,"growl"],[1,"helping-hand"],[1,"tackle"],[1,"tail-whip"],[5,"sand-attack"],[10,"double-kick"],[10,"quick-attack"],[15,"baby-doll-eyes"],[17,"grass-whistle"],[20,"leech-seed"],[20,"refresh"],[20,"swift"],[25,"bite"],[25,"magical-leaf"],[30,"bullet-seed"],[30,"copycat"],[30,"headbutt"],[30,"seed-bomb"],[30,"synthesis"],[35,"baton-pass"],[35,"sunny-day"],[36,"focus-energy"],[40,"giga-drain"],[40,"take-down"],[45,"charm"],[45,"swords-dance"],[45,"trump-card"],[50,"double-edge"],[50,"leaf-blade"],[55,"last-resort"],[85,"skull-bash"],[85,"solar-blade"]],"g":false,"m":false},"471":{"n":"冰伊布","t":["ice"],"s":[65,60,110,130,95,65],"l":[[0,"icy-wind"],[1,"covet"],[1,"growl"],[1,"helping-hand"],[1,"tackle"],[1,"tail-whip"],[5,"sand-attack"],[10,"double-kick"],[10,"quick-attack"],[15,"baby-doll-eyes"],[15,"frost-breath"],[20,"ice-shard"],[20,"refresh"],[20,"swift"],[25,"bite"],[29,"barrier"],[30,"copycat"],[30,"headbutt"],[30,"ice-fang"],[35,"baton-pass"],[35,"hail"],[35,"snowscape"],[36,"focus-energy"],[40,"freeze-dry"],[40,"take-down"],[45,"charm"],[45,"ice-beam"],[45,"mirror-coat"],[45,"trump-card"],[50,"blizzard"],[50,"double-edge"],[55,"last-resort"],[85,"skull-bash"]],"g":false,"m":false},"472":{"n":"天蝎王","t":["ground","flying"],"s":[75,95,125,45,75,95],"l":[[1,"poison-sting"],[4,"sand-attack"],[7,"harden"],[13,"quick-attack"],[15,"aerial-ace"],[15,"bulldoze"],[15,"sand-tomb"],[16,"fury-cutter"],[19,"knock-off"],[19,"mud-slap"],[19,"poison-tail"],[22,"acrobatics"],[27,"night-slash"],[27,"slash"],[30,"dig"],[30,"dual-wingbeat"],[30,"u-turn"],[35,"screech"],[40,"x-scissor"],[45,"crabhammer"],[45,"earthquake"],[45,"sky-uppercut"],[50,"swords-dance"],[55,"guillotine"]],"g":false,"m":false},"473":{"n":"象牙猪","t":["ice","ground"],"s":[110,130,80,70,60,80],"l":[[0,"double-hit"],[0,"fury-attack"],[0,"ice-fang"],[1,"mud-slap"],[1,"odor-sleuth"],[1,"tackle"],[5,"mud-sport"],[5,"powder-snow"],[10,"flail"],[15,"avalanche"],[15,"bulldoze"],[15,"ice-shard"],[15,"sand-tomb"],[18,"mud-bomb"],[20,"mist"],[21,"hail"],[25,"endure"],[30,"dig"],[30,"icicle-spear"],[30,"icy-wind"],[30,"stomping-tantrum"],[37,"amnesia"],[44,"take-down"],[51,"earthquake"],[58,"blizzard"],[58,"scary-face"],[65,"thrash"]],"g":false,"m":false},"474":{"n":"多边兽乙型","t":["normal"],"s":[85,80,70,135,75,90],"l":[[1,"conversion"],[1,"defense-curl"],[1,"magnet-rise"],[1,"nasty-plot"],[1,"recycle"],[1,"tackle"],[1,"trick-room"],[15,"swift"],[15,"thunder-shock"],[20,"psybeam"],[25,"conversion-2"],[29,"signal-beam"],[30,"agility"],[30,"tera-blast"],[34,"embargo"],[35,"recover"],[40,"discharge"],[45,"tri-attack"],[45,"uproar"],[50,"double-edge"],[50,"magic-coat"],[55,"lock-on"],[60,"zap-cannon"],[65,"hyper-beam"]],"g":false,"m":false},"475":{"n":"艾路雷朵","t":["psychic","fighting"],"s":[68,125,65,65,115,80],"l":[[0,"slash"],[1,"disarming-voice"],[1,"growl"],[3,"double-team"],[6,"confusion"],[9,"helping-hand"],[9,"hypnosis"],[12,"draining-kiss"],[12,"feint"],[14,"fury-cutter"],[14,"lucky-chant"],[15,"low-kick"],[15,"low-sweep"],[15,"psybeam"],[15,"reversal"],[15,"teleport"],[17,"magical-leaf"],[18,"aerial-ace"],[23,"false-swipe"],[23,"life-dew"],[28,"charm"],[28,"protect"],[29,"imprison"],[30,"brick-break"],[30,"dazzling-gleam"],[30,"zen-headbutt"],[33,"calm-mind"],[35,"swords-dance"],[38,"psychic"],[42,"psycho-cut"],[48,"dream-eater"],[49,"heal-pulse"],[53,"future-sight"],[56,"quick-guard"],[56,"wide-guard"],[63,"close-combat"]],"g":false,"m":false},"476":{"n":"大朝北鼻","t":["rock","steel"],"s":[60,55,145,75,150,40],"l":[[0,"tri-attack"],[1,"tackle"],[4,"harden"],[4,"iron-defense"],[7,"block"],[10,"magnet-bomb"],[10,"rock-throw"],[13,"thunder-wave"],[15,"rock-tomb"],[16,"rest"],[19,"spark"],[22,"rock-slide"],[25,"power-gem"],[28,"rock-blast"],[30,"flash-cannon"],[31,"discharge"],[34,"sandstorm"],[37,"earth-power"],[40,"stone-edge"],[43,"lock-on"],[43,"zap-cannon"],[50,"body-press"],[85,"meteor-beam"]],"g":false,"m":false},"477":{"n":"黑夜魔灵","t":["ghost"],"s":[45,100,135,65,135,45],"l":[[0,"shadow-punch"],[1,"astonish"],[1,"leer"],[4,"disable"],[8,"shadow-sneak"],[12,"confuse-ray"],[14,"foresight"],[16,"night-shade"],[20,"payback"],[24,"will-o-wisp"],[28,"mean-look"],[32,"hex"],[36,"curse"],[42,"shadow-ball"],[45,"phantom-force"],[48,"future-sight"],[54,"destiny-bond"],[65,"poltergeist"]],"g":false,"m":false},"478":{"n":"雪妖女","t":["ice","ghost"],"s":[70,80,70,80,70,110],"l":[[0,"hex"],[1,"astonish"],[1,"headbutt"],[1,"powder-snow"],[5,"leer"],[10,"double-team"],[15,"avalanche"],[15,"ice-fang"],[15,"ice-shard"],[20,"draining-kiss"],[20,"protect"],[25,"icy-wind"],[30,"frost-breath"],[30,"ice-spinner"],[30,"icicle-spear"],[34,"ice-beam"],[35,"bite"],[35,"confuse-ray"],[37,"wake-up-slap"],[40,"snowscape"],[41,"captivate"],[45,"hail"],[47,"will-o-wisp"],[50,"weather-ball"],[54,"aurora-veil"],[55,"crunch"],[61,"destiny-bond"],[61,"shadow-ball"],[65,"poltergeist"],[68,"blizzard"],[85,"triple-axel"]],"g":false,"m":false},"479":{"n":"洛托姆","t":["electric","ghost"],"s":[50,50,77,95,77,91],"l":[[1,"astonish"],[1,"double-team"],[5,"thunder-shock"],[10,"confuse-ray"],[15,"charge"],[15,"charge-beam"],[15,"electroweb"],[15,"night-shade"],[20,"electro-ball"],[25,"thunder-wave"],[29,"ominous-wind"],[30,"shadow-ball"],[30,"shock-wave"],[30,"volt-switch"],[35,"hex"],[40,"substitute"],[45,"thunderbolt"],[45,"trick"],[50,"discharge"],[55,"uproar"],[65,"thunder"]],"g":false,"m":false,"u":479},"480":{"n":"由克希","t":["psychic"],"s":[75,75,130,75,130,95],"l":[[1,"confusion"],[1,"natural-gift"],[1,"rest"],[7,"swift"],[14,"endure"],[21,"psybeam"],[28,"imprison"],[30,"psychic-noise"],[30,"psycho-cut"],[30,"zen-headbutt"],[35,"extrasensory"],[42,"amnesia"],[49,"psychic"],[56,"yawn"],[63,"future-sight"],[70,"flail"],[77,"memento"],[84,"mystical-power"]],"g":true,"m":false},"481":{"n":"艾姆利多","t":["psychic"],"s":[80,105,105,105,105,80],"l":[[1,"confusion"],[1,"natural-gift"],[1,"rest"],[7,"swift"],[14,"protect"],[21,"psybeam"],[28,"imprison"],[30,"psychic-noise"],[30,"psycho-cut"],[30,"zen-headbutt"],[31,"lucky-chant"],[35,"extrasensory"],[42,"charm"],[49,"psychic"],[56,"flatter"],[63,"future-sight"],[70,"copycat"],[77,"healing-wish"],[84,"mystical-power"]],"g":true,"m":false},"482":{"n":"亚克诺姆","t":["psychic"],"s":[75,125,70,125,70,115],"l":[[1,"confusion"],[1,"natural-gift"],[1,"rest"],[7,"swift"],[14,"detect"],[21,"psybeam"],[28,"imprison"],[30,"psycho-cut"],[30,"zen-headbutt"],[35,"extrasensory"],[42,"nasty-plot"],[49,"psychic"],[56,"uproar"],[63,"future-sight"],[70,"last-resort"],[77,"explosion"],[84,"mystical-power"]],"g":true,"m":false},"483":{"n":"帝牙卢卡","t":["steel","dragon"],"s":[100,120,120,150,100,90],"l":[[1,"metal-claw"],[1,"scary-face"],[8,"dragon-breath"],[16,"ancient-power"],[24,"slash"],[30,"iron-head"],[30,"scale-shot"],[32,"flash-cannon"],[40,"dragon-claw"],[45,"dragon-pulse"],[48,"aura-sphere"],[50,"heal-block"],[56,"power-gem"],[64,"metal-burst"],[72,"earth-power"],[80,"iron-tail"],[85,"draco-meteor"],[85,"outrage"],[88,"roar-of-time"]],"g":true,"m":false},"484":{"n":"帕路奇亚","t":["water","dragon"],"s":[90,120,100,150,120,100],"l":[[1,"scary-face"],[1,"water-pulse"],[8,"dragon-breath"],[15,"brine"],[16,"ancient-power"],[24,"slash"],[30,"scale-shot"],[32,"aqua-ring"],[45,"dragon-pulse"],[45,"liquidation"],[45,"surf"],[48,"aura-sphere"],[48,"dragon-claw"],[50,"heal-block"],[56,"power-gem"],[64,"aqua-tail"],[72,"earth-power"],[80,"spacial-rend"],[85,"draco-meteor"],[88,"hydro-pump"]],"g":true,"m":false},"485":{"n":"席多蓝恩","t":["fire","steel"],"s":[91,90,106,130,106,77],"l":[[1,"fire-spin"],[1,"leer"],[6,"metal-claw"],[12,"ancient-power"],[15,"incinerate"],[18,"fire-fang"],[24,"scary-face"],[30,"burning-jealousy"],[30,"flash-cannon"],[30,"iron-head"],[36,"crunch"],[42,"lava-plume"],[45,"flamethrower"],[48,"metal-sound"],[54,"earth-power"],[60,"heat-wave"],[65,"fire-blast"],[66,"stone-edge"],[72,"magma-storm"],[85,"overheat"]],"g":true,"m":false},"486":{"n":"雷吉奇卡斯","t":["normal"],"s":[110,160,110,80,110,100],"l":[[1,"confuse-ray"],[1,"dizzy-punch"],[1,"fire-punch"],[1,"foresight"],[1,"ice-punch"],[1,"pound"],[1,"thunder-punch"],[6,"payback"],[12,"facade"],[12,"revenge"],[18,"stomp"],[24,"protect"],[25,"superpower"],[30,"knock-off"],[30,"strength"],[36,"mega-punch"],[42,"body-press"],[45,"body-slam"],[45,"rock-climb"],[48,"wide-guard"],[54,"zen-headbutt"],[60,"heavy-slam"],[66,"hammer-arm"],[72,"giga-impact"],[78,"crush-grip"]],"g":true,"m":false},"487":{"n":"骑拉帝纳","t":["ghost","dragon"],"s":[150,100,120,100,120,90],"l":[[1,"defog"],[1,"shadow-sneak"],[6,"ominous-wind"],[7,"dragon-breath"],[14,"ancient-power"],[21,"hex"],[28,"slash"],[30,"shadow-ball"],[35,"scary-face"],[42,"shadow-claw"],[45,"dragon-pulse"],[45,"phantom-force"],[49,"pain-split"],[50,"heal-block"],[56,"aura-sphere"],[63,"dragon-claw"],[65,"poltergeist"],[70,"earth-power"],[77,"shadow-force"],[84,"destiny-bond"],[85,"draco-meteor"],[85,"outrage"]],"g":true,"m":false,"u":487},"488":{"n":"克雷色利亚","t":["psychic"],"s":[120,70,110,75,120,85],"l":[[1,"confusion"],[1,"double-team"],[6,"mist"],[12,"aurora-beam"],[18,"psybeam"],[24,"ally-switch"],[24,"psycho-shift"],[30,"psyshock"],[30,"slash"],[30,"zen-headbutt"],[36,"psycho-cut"],[42,"moonlight"],[48,"safeguard"],[54,"psychic"],[60,"moonblast"],[66,"future-sight"],[72,"lunar-blessing"],[72,"lunar-dance"]],"g":true,"m":false},"489":{"n":"霏欧纳","t":["water"],"s":[80,80,80,80,80,80],"l":[[1,"water-gun"],[1,"water-sport"],[9,"charm"],[15,"brine"],[15,"chilling-water"],[15,"flip-turn"],[16,"supersonic"],[24,"bubble-beam"],[30,"waterfall"],[31,"acid-armor"],[39,"whirlpool"],[45,"liquidation"],[45,"surf"],[46,"water-pulse"],[54,"aqua-ring"],[61,"dive"],[65,"hydro-pump"],[69,"rain-dance"],[75,"take-heart"]],"g":false,"m":true},"490":{"n":"玛纳霏","t":["water"],"s":[100,100,100,100,100,100],"l":[[1,"heart-swap"],[1,"tail-glow"],[1,"water-gun"],[1,"water-sport"],[9,"charm"],[15,"brine"],[15,"chilling-water"],[15,"flip-turn"],[16,"supersonic"],[24,"bubble-beam"],[30,"waterfall"],[31,"acid-armor"],[39,"whirlpool"],[45,"liquidation"],[45,"surf"],[46,"water-pulse"],[54,"aqua-ring"],[61,"dive"],[65,"hydro-pump"],[69,"rain-dance"],[76,"take-heart"]],"g":false,"m":true},"491":{"n":"达克莱伊","t":["dark"],"s":[70,90,90,135,90,125],"l":[[1,"disable"],[1,"ominous-wind"],[11,"quick-attack"],[15,"fling"],[15,"payback"],[15,"snarl"],[20,"hypnosis"],[29,"sucker-punch"],[38,"night-shade"],[38,"nightmare"],[45,"foul-play"],[47,"double-team"],[57,"haze"],[66,"dark-void"],[75,"embargo"],[75,"nasty-plot"],[84,"dream-eater"],[93,"dark-pulse"]],"g":false,"m":true},"492":{"n":"谢米","t":["grass"],"s":[100,100,100,100,100,100],"l":[[1,"defense-curl"],[1,"growth"],[10,"magical-leaf"],[19,"leech-seed"],[28,"synthesis"],[30,"bullet-seed"],[30,"giga-drain"],[30,"seed-bomb"],[37,"sweet-scent"],[45,"petal-blizzard"],[46,"natural-gift"],[46,"play-rough"],[55,"worry-seed"],[64,"aromatherapy"],[64,"grassy-terrain"],[73,"energy-ball"],[82,"grass-whistle"],[82,"sweet-kiss"],[85,"leaf-storm"],[85,"solar-beam"],[91,"healing-wish"],[91,"lucky-chant"],[100,"seed-flare"]],"g":false,"m":true,"u":492},"493":{"n":"阿尔宙斯","t":["normal"],"s":[120,120,120,120,120,120],"l":[[1,"cosmic-power"],[1,"natural-gift"],[1,"punishment"],[1,"seismic-toss"],[10,"gravity"],[15,"cut"],[15,"echoed-voice"],[15,"swift"],[20,"earth-power"],[30,"hyper-voice"],[40,"extreme-speed"],[50,"healing-wish"],[50,"refresh"],[60,"future-sight"],[70,"recover"],[80,"hyper-beam"],[90,"perish-song"],[100,"judgment"]],"g":false,"m":true,"u":493},"494":{"n":"比克提尼","t":["psychic","fire"],"s":[100,100,100,100,100,100],"l":[[1,"confusion"],[1,"flame-charge"],[1,"focus-energy"],[1,"quick-attack"],[1,"v-create"],[7,"work-up"],[14,"incinerate"],[21,"stored-power"],[28,"headbutt"],[30,"psyshock"],[35,"endure"],[42,"zen-headbutt"],[45,"psychic"],[49,"inferno"],[56,"reversal"],[63,"searing-shot"],[70,"double-edge"],[77,"flare-blitz"],[84,"overheat"],[85,"future-sight"],[91,"final-gambit"]],"g":false,"m":true},"495":{"n":"藤藤蛇","t":["grass"],"s":[45,45,55,45,55,63],"l":[[1,"tackle"],[4,"leer"],[7,"vine-whip"],[10,"wrap"],[13,"growth"],[15,"grass-knot"],[15,"grassy-glide"],[15,"trailblaze"],[16,"leaf-tornado"],[16,"magical-leaf"],[19,"leech-seed"],[22,"mega-drain"],[25,"slam"],[28,"leaf-blade"],[31,"coil"],[34,"giga-drain"],[37,"gastro-acid"],[37,"wring-out"],[40,"leaf-storm"]],"g":false,"m":false},"496":{"n":"青藤蛇","t":["grass"],"s":[60,60,75,60,75,83],"l":[[1,"tackle"],[4,"leer"],[7,"vine-whip"],[10,"wrap"],[13,"growth"],[15,"grass-knot"],[15,"grassy-glide"],[15,"trailblaze"],[16,"leaf-tornado"],[16,"magical-leaf"],[20,"leech-seed"],[24,"mega-drain"],[28,"slam"],[32,"leaf-blade"],[36,"coil"],[37,"wring-out"],[40,"giga-drain"],[44,"gastro-acid"],[48,"leaf-storm"]],"g":false,"m":false},"497":{"n":"君主蛇","t":["grass"],"s":[75,75,95,75,95,113],"l":[[1,"tackle"],[4,"leer"],[7,"vine-whip"],[10,"wrap"],[13,"growth"],[15,"grass-knot"],[15,"grassy-glide"],[15,"trailblaze"],[16,"leaf-tornado"],[16,"magical-leaf"],[20,"leech-seed"],[24,"mega-drain"],[28,"slam"],[32,"leaf-blade"],[37,"wring-out"],[38,"coil"],[44,"giga-drain"],[50,"gastro-acid"],[56,"leaf-storm"]],"g":false,"m":false},"498":{"n":"暖暖猪","t":["fire"],"s":[65,63,45,45,45,45],"l":[[1,"tackle"],[3,"tail-whip"],[7,"ember"],[9,"endure"],[9,"odor-sleuth"],[13,"defense-curl"],[15,"flame-charge"],[19,"smog"],[21,"rollout"],[25,"take-down"],[27,"heat-crash"],[30,"fire-punch"],[31,"assurance"],[33,"flamethrower"],[37,"head-smash"],[39,"roar"],[43,"flare-blitz"]],"g":false,"m":false},"499":{"n":"炒炒猪","t":["fire","fighting"],"s":[90,93,55,70,55,55],"l":[[0,"arm-thrust"],[1,"tackle"],[3,"tail-whip"],[7,"ember"],[9,"endure"],[9,"odor-sleuth"],[13,"defense-curl"],[15,"flame-charge"],[15,"low-kick"],[15,"low-sweep"],[20,"smog"],[23,"rollout"],[28,"take-down"],[30,"brick-break"],[30,"fire-punch"],[31,"heat-crash"],[36,"assurance"],[39,"flamethrower"],[44,"head-smash"],[47,"roar"],[52,"flare-blitz"],[85,"close-combat"]],"g":false,"m":false},"500":{"n":"炎武王","t":["fire","fighting"],"s":[110,123,65,100,65,65],"l":[[0,"arm-thrust"],[1,"tackle"],[3,"tail-whip"],[7,"ember"],[9,"endure"],[9,"odor-sleuth"],[13,"defense-curl"],[15,"flame-charge"],[15,"low-kick"],[15,"low-sweep"],[20,"smog"],[23,"rollout"],[28,"take-down"],[30,"body-press"],[30,"brick-break"],[30,"fire-punch"],[31,"heat-crash"],[38,"assurance"],[43,"flamethrower"],[50,"head-smash"],[55,"roar"],[62,"flare-blitz"],[85,"close-combat"]],"g":false,"m":false},"501":{"n":"水水獭","t":["water"],"s":[55,55,45,63,45,45],"l":[[1,"tackle"],[5,"tail-whip"],[7,"water-gun"],[11,"soak"],[11,"water-sport"],[13,"focus-energy"],[15,"chilling-water"],[15,"flip-turn"],[17,"razor-shell"],[19,"fury-cutter"],[23,"water-pulse"],[25,"aerial-ace"],[25,"revenge"],[29,"aqua-jet"],[30,"scald"],[30,"waterfall"],[31,"encore"],[35,"aqua-tail"],[37,"retaliate"],[41,"swords-dance"],[43,"hydro-pump"]],"g":false,"m":false},"502":{"n":"双刃丸","t":["water"],"s":[75,75,60,83,60,60],"l":[[1,"tackle"],[5,"tail-whip"],[7,"water-gun"],[11,"soak"],[11,"water-sport"],[13,"focus-energy"],[15,"chilling-water"],[15,"flip-turn"],[18,"razor-shell"],[21,"fury-cutter"],[25,"revenge"],[26,"water-pulse"],[29,"aerial-ace"],[30,"scald"],[30,"waterfall"],[34,"aqua-jet"],[37,"encore"],[42,"aqua-tail"],[45,"retaliate"],[50,"swords-dance"],[53,"hydro-pump"]],"g":false,"m":false},"503":{"n":"大剑鬼","t":["water"],"s":[95,100,85,108,70,70],"l":[[0,"slash"],[1,"tackle"],[5,"tail-whip"],[7,"water-gun"],[11,"soak"],[11,"water-sport"],[13,"focus-energy"],[15,"chilling-water"],[15,"flip-turn"],[18,"razor-shell"],[21,"fury-cutter"],[25,"revenge"],[25,"water-pulse"],[29,"aerial-ace"],[30,"scald"],[30,"waterfall"],[34,"aqua-jet"],[39,"encore"],[46,"aqua-tail"],[51,"retaliate"],[58,"swords-dance"],[63,"hydro-pump"]],"g":false,"m":false},"504":{"n":"探探鼠","t":["normal"],"s":[45,55,39,35,39,42],"l":[[1,"tackle"],[3,"leer"],[6,"bite"],[8,"bide"],[11,"detect"],[13,"sand-attack"],[15,"cut"],[16,"crunch"],[18,"hypnosis"],[21,"super-fang"],[23,"after-you"],[26,"focus-energy"],[28,"work-up"],[30,"facade"],[31,"hyper-fang"],[33,"nasty-plot"],[36,"mean-look"],[38,"baton-pass"],[41,"slam"]],"g":false,"m":false},"505":{"n":"步哨鼠","t":["normal"],"s":[60,85,69,60,69,77],"l":[[0,"confuse-ray"],[1,"tackle"],[3,"leer"],[6,"bite"],[8,"bide"],[11,"detect"],[13,"sand-attack"],[15,"cut"],[16,"crunch"],[18,"hypnosis"],[22,"super-fang"],[25,"after-you"],[28,"work-up"],[29,"focus-energy"],[30,"facade"],[30,"strength"],[32,"psych-up"],[36,"hyper-fang"],[39,"nasty-plot"],[43,"mean-look"],[46,"baton-pass"],[50,"slam"]],"g":false,"m":false},"506":{"n":"小约克","t":["normal"],"s":[45,60,45,25,45,55],"l":[[1,"leer"],[1,"tackle"],[4,"work-up"],[5,"odor-sleuth"],[8,"bite"],[12,"retaliate"],[17,"baby-doll-eyes"],[20,"play-rough"],[24,"crunch"],[28,"take-down"],[32,"helping-hand"],[36,"reversal"],[40,"roar"],[44,"last-resort"],[48,"giga-impact"]],"g":false,"m":false},"507":{"n":"哈约克","t":["normal"],"s":[65,80,65,35,65,60],"l":[[1,"leer"],[1,"tackle"],[4,"work-up"],[5,"odor-sleuth"],[8,"bite"],[12,"retaliate"],[19,"baby-doll-eyes"],[24,"play-rough"],[30,"crunch"],[36,"take-down"],[42,"helping-hand"],[48,"reversal"],[54,"roar"],[60,"last-resort"],[66,"giga-impact"]],"g":false,"m":false},"508":{"n":"长毛狗","t":["normal"],"s":[85,110,90,45,90,80],"l":[[1,"leer"],[1,"tackle"],[4,"work-up"],[5,"odor-sleuth"],[8,"bite"],[12,"retaliate"],[19,"baby-doll-eyes"],[24,"play-rough"],[30,"crunch"],[38,"take-down"],[46,"helping-hand"],[54,"reversal"],[62,"roar"],[70,"last-resort"],[78,"giga-impact"]],"g":false,"m":false},"509":{"n":"扒手猫","t":["dark"],"s":[41,50,37,50,37,66],"l":[[1,"growl"],[1,"scratch"],[4,"sand-attack"],[5,"fake-out"],[6,"assist"],[12,"fury-swipes"],[15,"payback"],[15,"pursuit"],[15,"snarl"],[15,"thief"],[16,"torment"],[21,"assurance"],[24,"hone-claws"],[28,"sucker-punch"],[30,"dark-pulse"],[30,"slash"],[32,"nasty-plot"],[33,"captivate"],[36,"night-slash"],[39,"snatch"],[40,"play-rough"],[45,"foul-play"]],"g":false,"m":false},"510":{"n":"酷豹","t":["dark"],"s":[64,88,50,88,50,106],"l":[[1,"growl"],[1,"scratch"],[4,"sand-attack"],[5,"fake-out"],[6,"assist"],[12,"fury-swipes"],[15,"payback"],[15,"pursuit"],[15,"snarl"],[15,"thief"],[16,"torment"],[23,"assurance"],[28,"hone-claws"],[30,"dark-pulse"],[30,"slash"],[33,"captivate"],[34,"sucker-punch"],[38,"taunt"],[39,"snatch"],[40,"nasty-plot"],[45,"foul-play"],[46,"night-slash"],[52,"play-rough"]],"g":false,"m":false},"511":{"n":"花椰猴","t":["grass"],"s":[50,53,48,53,48,64],"l":[[1,"play-nice"],[1,"scratch"],[4,"leer"],[7,"lick"],[10,"vine-whip"],[13,"fury-swipes"],[16,"leech-seed"],[19,"bite"],[22,"seed-bomb"],[25,"torment"],[28,"fling"],[31,"acrobatics"],[34,"grass-knot"],[37,"recycle"],[40,"natural-gift"],[43,"crunch"],[45,"energy-ball"],[85,"solar-beam"]],"g":false,"m":false},"512":{"n":"花椰猿","t":["grass"],"s":[75,98,63,98,63,101],"l":[[1,"play-nice"],[1,"scratch"],[4,"leer"],[7,"lick"],[10,"vine-whip"],[13,"fury-swipes"],[15,"grass-knot"],[16,"leech-seed"],[19,"bite"],[22,"seed-bomb"],[25,"torment"],[28,"fling"],[31,"acrobatics"],[37,"recycle"],[40,"natural-gift"],[43,"crunch"],[45,"energy-ball"],[85,"solar-beam"]],"g":false,"m":false},"513":{"n":"爆香猴","t":["fire"],"s":[50,53,48,53,48,64],"l":[[1,"play-nice"],[1,"scratch"],[4,"leer"],[7,"lick"],[10,"incinerate"],[13,"fury-swipes"],[16,"yawn"],[19,"bite"],[22,"flame-burst"],[25,"amnesia"],[28,"fling"],[31,"acrobatics"],[34,"fire-blast"],[37,"recycle"],[40,"natural-gift"],[43,"crunch"],[85,"overheat"]],"g":false,"m":false},"514":{"n":"爆香猿","t":["fire"],"s":[75,98,63,98,63,101],"l":[[1,"play-nice"],[1,"scratch"],[4,"leer"],[7,"lick"],[10,"incinerate"],[13,"fury-swipes"],[16,"yawn"],[19,"bite"],[22,"flame-burst"],[25,"amnesia"],[28,"fling"],[31,"acrobatics"],[34,"fire-blast"],[37,"recycle"],[40,"natural-gift"],[43,"crunch"],[85,"overheat"]],"g":false,"m":false},"515":{"n":"冷水猴","t":["water"],"s":[50,53,48,53,48,64],"l":[[1,"play-nice"],[1,"scratch"],[4,"leer"],[7,"lick"],[10,"water-gun"],[13,"fury-swipes"],[16,"water-sport"],[19,"bite"],[22,"scald"],[25,"taunt"],[28,"fling"],[31,"acrobatics"],[34,"brine"],[37,"recycle"],[40,"natural-gift"],[43,"crunch"],[45,"surf"]],"g":false,"m":false},"516":{"n":"冷水猿","t":["water"],"s":[75,98,63,98,63,101],"l":[[1,"play-nice"],[1,"scratch"],[4,"leer"],[7,"lick"],[10,"water-gun"],[13,"fury-swipes"],[16,"water-sport"],[19,"bite"],[22,"scald"],[25,"taunt"],[28,"fling"],[31,"acrobatics"],[34,"brine"],[37,"recycle"],[40,"natural-gift"],[43,"crunch"],[45,"surf"]],"g":false,"m":false},"517":{"n":"食梦梦","t":["psychic"],"s":[76,25,45,67,55,24],"l":[[1,"defense-curl"],[1,"psywave"],[1,"stored-power"],[4,"hypnosis"],[5,"lucky-chant"],[8,"psybeam"],[12,"imprison"],[16,"moonlight"],[20,"magic-coat"],[24,"zen-headbutt"],[25,"synchronoise"],[28,"calm-mind"],[29,"nightmare"],[30,"psyshock"],[32,"yawn"],[36,"psychic"],[40,"moonblast"],[43,"telekinesis"],[44,"dream-eater"],[48,"future-sight"],[52,"wonder-room"]],"g":false,"m":false},"518":{"n":"梦梦蚀","t":["psychic"],"s":[116,55,85,107,95,29],"l":[[1,"defense-curl"],[1,"psywave"],[1,"stored-power"],[4,"hypnosis"],[5,"lucky-chant"],[8,"psybeam"],[12,"imprison"],[16,"moonlight"],[20,"magic-coat"],[24,"zen-headbutt"],[25,"synchronoise"],[28,"calm-mind"],[29,"nightmare"],[30,"psyshock"],[32,"yawn"],[36,"psychic"],[40,"moonblast"],[43,"telekinesis"],[44,"dream-eater"],[48,"future-sight"],[52,"wonder-room"]],"g":false,"m":false},"519":{"n":"豆豆鸽","t":["normal","flying"],"s":[50,55,50,36,30,43],"l":[[1,"growl"],[1,"gust"],[4,"leer"],[8,"quick-attack"],[12,"taunt"],[15,"aerial-ace"],[16,"air-cutter"],[20,"swagger"],[24,"feather-dance"],[28,"detect"],[30,"secret-power"],[32,"air-slash"],[32,"razor-wind"],[36,"roost"],[40,"tailwind"],[43,"facade"],[44,"sky-attack"]],"g":false,"m":false},"520":{"n":"咕咕鸽","t":["normal","flying"],"s":[62,77,62,50,42,65],"l":[[1,"growl"],[1,"gust"],[4,"leer"],[8,"quick-attack"],[12,"taunt"],[15,"aerial-ace"],[16,"air-cutter"],[20,"swagger"],[26,"feather-dance"],[30,"secret-power"],[32,"razor-wind"],[34,"detect"],[38,"air-slash"],[43,"facade"],[44,"roost"],[50,"tailwind"],[56,"sky-attack"]],"g":false,"m":false},"521":{"n":"高傲雉鸡","t":["normal","flying"],"s":[80,115,80,65,55,93],"l":[[1,"growl"],[1,"gust"],[4,"leer"],[8,"quick-attack"],[12,"taunt"],[15,"aerial-ace"],[16,"air-cutter"],[20,"swagger"],[26,"feather-dance"],[30,"secret-power"],[32,"razor-wind"],[36,"detect"],[42,"air-slash"],[43,"facade"],[50,"roost"],[58,"tailwind"],[66,"sky-attack"]],"g":false,"m":false},"522":{"n":"斑斑马","t":["electric"],"s":[45,60,32,50,32,76],"l":[[1,"quick-attack"],[4,"tail-whip"],[8,"charge"],[11,"shock-wave"],[15,"thunder-wave"],[18,"flame-charge"],[22,"pursuit"],[22,"spark"],[25,"stomp"],[29,"discharge"],[33,"agility"],[35,"wild-charge"],[40,"thrash"],[65,"supercell-slam"]],"g":false,"m":false},"523":{"n":"雷电斑马","t":["electric"],"s":[75,100,63,80,63,116],"l":[[1,"quick-attack"],[4,"tail-whip"],[8,"charge"],[11,"shock-wave"],[15,"thunder-wave"],[18,"flame-charge"],[22,"pursuit"],[25,"spark"],[31,"stomp"],[36,"discharge"],[42,"agility"],[47,"wild-charge"],[53,"thrash"],[58,"ion-deluge"],[65,"supercell-slam"]],"g":false,"m":false},"524":{"n":"石丸子","t":["rock"],"s":[55,75,85,25,25,15],"l":[[1,"sand-attack"],[1,"tackle"],[4,"harden"],[8,"stealth-rock"],[12,"mud-slap"],[15,"rock-tomb"],[16,"smack-down"],[20,"iron-defense"],[24,"headbutt"],[28,"rock-slide"],[32,"rock-blast"],[36,"sandstorm"],[40,"stone-edge"],[44,"explosion"]],"g":false,"m":false},"525":{"n":"地幔岩","t":["rock"],"s":[70,105,105,50,40,20],"l":[[0,"power-gem"],[1,"sand-attack"],[1,"tackle"],[4,"harden"],[8,"stealth-rock"],[12,"mud-slap"],[15,"rock-tomb"],[16,"smack-down"],[20,"iron-defense"],[24,"headbutt"],[30,"rock-slide"],[36,"rock-blast"],[42,"sandstorm"],[48,"stone-edge"],[54,"explosion"]],"g":false,"m":false},"526":{"n":"庞岩怪","t":["rock"],"s":[85,135,130,60,80,25],"l":[[0,"power-gem"],[1,"sand-attack"],[1,"tackle"],[4,"harden"],[8,"stealth-rock"],[12,"mud-slap"],[15,"rock-tomb"],[16,"smack-down"],[20,"iron-defense"],[24,"headbutt"],[30,"rock-slide"],[36,"rock-blast"],[42,"sandstorm"],[48,"stone-edge"],[54,"explosion"]],"g":false,"m":false},"527":{"n":"滚滚蝙蝠","t":["psychic","flying"],"s":[65,45,43,55,43,72],"l":[[1,"attract"],[1,"gust"],[4,"odor-sleuth"],[5,"confusion"],[10,"endeavor"],[15,"air-cutter"],[20,"imprison"],[25,"assurance"],[30,"amnesia"],[30,"psycho-cut"],[30,"psyshock"],[30,"zen-headbutt"],[35,"air-slash"],[40,"psychic"],[45,"calm-mind"],[50,"future-sight"],[55,"simple-beam"]],"g":false,"m":false},"528":{"n":"心蝙蝠","t":["psychic","flying"],"s":[67,57,55,77,55,114],"l":[[1,"attract"],[1,"gust"],[4,"odor-sleuth"],[5,"confusion"],[10,"endeavor"],[15,"air-cutter"],[20,"imprison"],[25,"assurance"],[30,"amnesia"],[30,"psycho-cut"],[30,"psyshock"],[30,"zen-headbutt"],[35,"air-slash"],[40,"psychic"],[45,"calm-mind"],[50,"future-sight"],[55,"simple-beam"]],"g":false,"m":false},"529":{"n":"螺钉地鼠","t":["ground"],"s":[60,85,40,30,45,68],"l":[[1,"mud-slap"],[1,"mud-sport"],[1,"rapid-spin"],[4,"scratch"],[8,"hone-claws"],[12,"fury-swipes"],[15,"bulldoze"],[15,"sand-tomb"],[16,"metal-claw"],[20,"sandstorm"],[24,"crush-claw"],[28,"rock-slide"],[30,"stomping-tantrum"],[32,"dig"],[36,"swords-dance"],[40,"drill-run"],[44,"earthquake"],[48,"fissure"]],"g":false,"m":false},"530":{"n":"龙头地鼠","t":["ground","steel"],"s":[110,135,60,50,65,88],"l":[[0,"horn-drill"],[1,"mud-slap"],[1,"mud-sport"],[1,"rapid-spin"],[4,"scratch"],[8,"hone-claws"],[12,"fury-swipes"],[15,"bulldoze"],[15,"sand-tomb"],[16,"metal-claw"],[20,"sandstorm"],[24,"crush-claw"],[28,"rock-slide"],[30,"iron-head"],[30,"smart-strike"],[30,"stomping-tantrum"],[34,"dig"],[40,"swords-dance"],[46,"drill-run"],[52,"earthquake"],[58,"fissure"]],"g":false,"m":false},"531":{"n":"差不多娃娃","t":["normal"],"s":[103,60,86,60,86,50],"l":[[1,"play-nice"],[1,"pound"],[4,"disarming-voice"],[9,"baby-doll-eyes"],[9,"refresh"],[12,"helping-hand"],[15,"hidden-power"],[16,"growl"],[17,"double-slap"],[20,"zen-headbutt"],[21,"attract"],[24,"life-dew"],[25,"secret-power"],[28,"after-you"],[30,"mega-punch"],[32,"take-down"],[36,"simple-beam"],[40,"hyper-voice"],[44,"heal-pulse"],[48,"double-edge"],[52,"entrainment"],[56,"misty-terrain"],[60,"last-resort"]],"g":false,"m":false},"532":{"n":"搬运小匠","t":["fighting"],"s":[75,80,55,25,35,35],"l":[[1,"leer"],[1,"pound"],[4,"low-kick"],[8,"bide"],[8,"rock-throw"],[12,"focus-energy"],[15,"low-sweep"],[16,"bulk-up"],[20,"rock-slide"],[20,"wake-up-slap"],[24,"slam"],[28,"scary-face"],[30,"brick-break"],[32,"dynamic-punch"],[36,"hammer-arm"],[40,"stone-edge"],[44,"superpower"],[48,"focus-punch"]],"g":false,"m":false},"533":{"n":"铁骨土人","t":["fighting"],"s":[85,105,85,40,50,40],"l":[[1,"leer"],[1,"pound"],[4,"low-kick"],[8,"bide"],[8,"rock-throw"],[12,"focus-energy"],[15,"low-sweep"],[16,"bulk-up"],[20,"rock-slide"],[20,"wake-up-slap"],[24,"slam"],[30,"brick-break"],[30,"scary-face"],[36,"dynamic-punch"],[42,"hammer-arm"],[48,"stone-edge"],[54,"superpower"],[60,"focus-punch"]],"g":false,"m":false},"534":{"n":"修建老匠","t":["fighting"],"s":[105,140,95,55,65,45],"l":[[1,"leer"],[1,"pound"],[4,"low-kick"],[8,"bide"],[8,"rock-throw"],[12,"focus-energy"],[15,"low-sweep"],[16,"bulk-up"],[20,"rock-slide"],[20,"wake-up-slap"],[24,"slam"],[30,"brick-break"],[30,"scary-face"],[36,"dynamic-punch"],[42,"hammer-arm"],[48,"stone-edge"],[54,"superpower"],[60,"focus-punch"]],"g":false,"m":false},"535":{"n":"圆蝌蚪","t":["water"],"s":[50,50,40,50,40,64],"l":[[1,"bubble"],[1,"echoed-voice"],[1,"growl"],[4,"acid"],[8,"supersonic"],[12,"mud-shot"],[16,"round"],[20,"bubble-beam"],[24,"flail"],[28,"uproar"],[30,"scald"],[32,"aqua-ring"],[36,"hyper-voice"],[40,"muddy-water"],[44,"rain-dance"],[48,"hydro-pump"]],"g":false,"m":false},"536":{"n":"蓝蟾蜍","t":["water","ground"],"s":[75,65,55,65,55,69],"l":[[1,"bubble"],[1,"echoed-voice"],[1,"growl"],[4,"acid"],[8,"supersonic"],[12,"mud-shot"],[15,"bulldoze"],[16,"round"],[20,"bubble-beam"],[24,"flail"],[30,"scald"],[30,"uproar"],[37,"aqua-ring"],[42,"hyper-voice"],[45,"earth-power"],[48,"muddy-water"],[54,"rain-dance"],[60,"hydro-pump"]],"g":false,"m":false},"537":{"n":"蟾蜍王","t":["water","ground"],"s":[105,95,75,85,75,74],"l":[[0,"drain-punch"],[1,"bubble"],[1,"echoed-voice"],[1,"growl"],[4,"acid"],[8,"supersonic"],[12,"mud-shot"],[15,"bulldoze"],[16,"round"],[20,"bubble-beam"],[24,"flail"],[30,"dig"],[30,"dive"],[30,"scald"],[30,"stomping-tantrum"],[30,"uproar"],[39,"aqua-ring"],[45,"earth-power"],[45,"liquidation"],[46,"hyper-voice"],[54,"muddy-water"],[62,"rain-dance"],[65,"earthquake"],[70,"hydro-pump"]],"g":false,"m":false},"538":{"n":"投摔鬼","t":["fighting"],"s":[120,100,85,30,85,45],"l":[[1,"bide"],[1,"bind"],[1,"leer"],[1,"mat-block"],[5,"focus-energy"],[10,"circle-throw"],[15,"low-sweep"],[15,"wide-guard"],[20,"revenge"],[21,"body-slam"],[25,"bulk-up"],[30,"brick-break"],[30,"storm-throw"],[35,"vital-throw"],[40,"seismic-toss"],[45,"endure"],[50,"reversal"],[55,"superpower"]],"g":false,"m":false},"539":{"n":"打击鬼","t":["fighting"],"s":[75,125,75,30,75,85],"l":[[1,"bide"],[1,"leer"],[1,"rock-smash"],[5,"focus-energy"],[10,"double-kick"],[15,"quick-guard"],[20,"low-sweep"],[25,"bulk-up"],[30,"retaliate"],[35,"brick-break"],[40,"counter"],[45,"endure"],[50,"reversal"],[55,"close-combat"]],"g":false,"m":false},"540":{"n":"虫宝包","t":["bug","grass"],"s":[45,53,70,40,60,42],"l":[[1,"string-shot"],[1,"tackle"],[8,"bug-bite"],[15,"razor-leaf"],[22,"struggle-bug"],[29,"endure"],[30,"giga-drain"],[30,"lunge"],[30,"seed-bomb"],[30,"skitter-smack"],[31,"sticky-web"],[36,"bug-buzz"],[43,"flail"],[85,"solar-beam"]],"g":false,"m":false},"541":{"n":"宝包茧","t":["bug","grass"],"s":[55,63,90,50,80,42],"l":[[0,"protect"],[1,"string-shot"],[1,"tackle"],[8,"bug-bite"],[15,"razor-leaf"],[22,"struggle-bug"],[29,"endure"],[30,"giga-drain"],[30,"lunge"],[30,"seed-bomb"],[30,"skitter-smack"],[31,"sticky-web"],[36,"bug-buzz"],[43,"flail"],[85,"solar-beam"]],"g":false,"m":false},"542":{"n":"保姆虫","t":["bug","grass"],"s":[75,103,80,70,80,92],"l":[[0,"protect"],[0,"slash"],[1,"string-shot"],[1,"tackle"],[8,"bug-bite"],[15,"razor-leaf"],[22,"struggle-bug"],[29,"endure"],[29,"fell-stinger"],[30,"giga-drain"],[30,"lunge"],[30,"seed-bomb"],[30,"skitter-smack"],[31,"sticky-web"],[32,"helping-hand"],[36,"bug-buzz"],[36,"leaf-blade"],[39,"x-scissor"],[43,"entrainment"],[43,"flail"],[46,"swords-dance"],[50,"leaf-storm"],[85,"solar-beam"]],"g":false,"m":false},"543":{"n":"百足蜈蚣","t":["bug","poison"],"s":[30,45,59,30,39,57],"l":[[1,"defense-curl"],[1,"poison-sting"],[4,"rollout"],[8,"protect"],[12,"poison-tail"],[12,"pursuit"],[15,"infestation"],[15,"struggle-bug"],[16,"screech"],[20,"bug-bite"],[24,"venoshock"],[28,"take-down"],[30,"pin-missile"],[30,"poison-jab"],[32,"agility"],[33,"steamroller"],[36,"toxic"],[40,"venom-drench"],[44,"double-edge"]],"g":false,"m":false},"544":{"n":"车轮球","t":["bug","poison"],"s":[40,55,99,40,79,47],"l":[[0,"iron-defense"],[1,"defense-curl"],[1,"poison-sting"],[4,"rollout"],[8,"protect"],[12,"poison-tail"],[12,"pursuit"],[15,"infestation"],[15,"struggle-bug"],[16,"screech"],[20,"bug-bite"],[26,"venoshock"],[30,"pin-missile"],[30,"poison-jab"],[32,"take-down"],[33,"steamroller"],[38,"agility"],[44,"toxic"],[50,"venom-drench"],[56,"double-edge"]],"g":false,"m":false},"545":{"n":"蜈蚣王","t":["bug","poison"],"s":[60,100,89,55,69,112],"l":[[0,"baton-pass"],[0,"iron-defense"],[1,"defense-curl"],[1,"poison-sting"],[4,"rollout"],[8,"protect"],[12,"poison-tail"],[12,"pursuit"],[15,"infestation"],[15,"struggle-bug"],[16,"screech"],[20,"bug-bite"],[26,"venoshock"],[30,"pin-missile"],[30,"poison-jab"],[30,"x-scissor"],[33,"steamroller"],[34,"take-down"],[42,"agility"],[50,"toxic"],[58,"venom-drench"],[66,"double-edge"],[74,"megahorn"]],"g":false,"m":false},"546":{"n":"木棉球","t":["grass","fairy"],"s":[40,27,60,37,50,66],"l":[[1,"absorb"],[1,"helping-hand"],[3,"fairy-wind"],[6,"stun-spore"],[12,"mega-drain"],[15,"grass-knot"],[15,"razor-leaf"],[18,"growth"],[21,"poison-powder"],[24,"giga-drain"],[27,"charm"],[30,"dazzling-gleam"],[30,"leech-seed"],[33,"cotton-spore"],[36,"energy-ball"],[39,"sunny-day"],[42,"endeavor"],[45,"cotton-guard"],[48,"solar-beam"]],"g":false,"m":false},"547":{"n":"风妖精","t":["grass","fairy"],"s":[60,67,85,77,75,116],"l":[[1,"absorb"],[1,"helping-hand"],[3,"fairy-wind"],[6,"stun-spore"],[10,"gust"],[12,"mega-drain"],[15,"grass-knot"],[15,"razor-leaf"],[18,"growth"],[21,"poison-powder"],[24,"giga-drain"],[27,"charm"],[28,"tailwind"],[30,"dazzling-gleam"],[30,"leech-seed"],[33,"cotton-spore"],[36,"energy-ball"],[39,"sunny-day"],[42,"endeavor"],[45,"cotton-guard"],[46,"hurricane"],[48,"solar-beam"],[50,"moonblast"]],"g":false,"m":false},"548":{"n":"百合根娃娃","t":["grass"],"s":[45,35,50,70,50,30],"l":[[1,"absorb"],[1,"growth"],[3,"helping-hand"],[6,"stun-spore"],[9,"mega-drain"],[12,"aromatherapy"],[12,"charm"],[15,"magical-leaf"],[18,"sleep-powder"],[21,"giga-drain"],[24,"leech-seed"],[27,"after-you"],[30,"energy-ball"],[33,"synthesis"],[36,"sunny-day"],[39,"entrainment"],[42,"leaf-storm"]],"g":false,"m":false},"549":{"n":"裙儿小姐","t":["grass"],"s":[70,60,75,110,75,90],"l":[[0,"petal-dance"],[1,"absorb"],[1,"growth"],[3,"helping-hand"],[5,"magical-leaf"],[6,"stun-spore"],[9,"mega-drain"],[10,"teeter-dance"],[12,"aromatherapy"],[12,"charm"],[18,"sleep-powder"],[21,"giga-drain"],[24,"leech-seed"],[27,"after-you"],[28,"quiver-dance"],[30,"energy-ball"],[33,"synthesis"],[36,"sunny-day"],[39,"entrainment"],[42,"leaf-storm"]],"g":false,"m":false},"550":{"n":"野蛮鲈鱼","t":["water"],"s":[70,92,65,80,55,98],"l":[[1,"tail-whip"],[1,"water-gun"],[3,"uproar"],[4,"tackle"],[8,"flail"],[12,"aqua-jet"],[15,"chilling-water"],[15,"flip-turn"],[15,"water-pulse"],[16,"bite"],[20,"scary-face"],[24,"headbutt"],[28,"soak"],[30,"waterfall"],[32,"crunch"],[36,"take-down"],[40,"final-gambit"],[44,"wave-crash"],[48,"thrash"],[52,"double-edge"],[56,"head-smash"]],"g":false,"m":false},"551":{"n":"黑眼鳄","t":["ground","dark"],"s":[50,72,35,35,35,65],"l":[[1,"leer"],[1,"power-trip"],[1,"rage"],[3,"sand-attack"],[6,"hone-claws"],[9,"sand-tomb"],[12,"scary-face"],[15,"bite"],[15,"bulldoze"],[18,"torment"],[21,"dig"],[22,"embargo"],[24,"swagger"],[27,"crunch"],[30,"sandstorm"],[33,"foul-play"],[36,"earthquake"],[39,"thrash"]],"g":false,"m":false},"552":{"n":"混混鳄","t":["ground","dark"],"s":[60,82,45,45,45,74],"l":[[1,"leer"],[1,"power-trip"],[1,"rage"],[3,"sand-attack"],[6,"hone-claws"],[9,"sand-tomb"],[12,"scary-face"],[15,"bite"],[15,"bulldoze"],[15,"knock-off"],[18,"torment"],[21,"dig"],[22,"embargo"],[24,"swagger"],[27,"crunch"],[32,"sandstorm"],[35,"foul-play"],[42,"earthquake"],[47,"thrash"]],"g":false,"m":false},"553":{"n":"流氓鳄","t":["ground","dark"],"s":[95,117,80,65,70,92],"l":[[1,"leer"],[1,"power-trip"],[1,"rage"],[3,"sand-attack"],[6,"hone-claws"],[9,"sand-tomb"],[12,"scary-face"],[15,"bite"],[15,"bulldoze"],[15,"knock-off"],[18,"torment"],[21,"dig"],[22,"embargo"],[24,"swagger"],[27,"crunch"],[32,"sandstorm"],[35,"foul-play"],[44,"earthquake"],[51,"thrash"],[58,"outrage"]],"g":false,"m":false},"554":{"n":"火红不倒翁","t":["fire"],"s":[70,90,45,15,45,50],"l":[[1,"ember"],[1,"tackle"],[3,"rollout"],[4,"taunt"],[8,"bite"],[12,"incinerate"],[15,"flame-charge"],[16,"work-up"],[19,"facade"],[20,"fire-fang"],[24,"headbutt"],[28,"fire-punch"],[32,"uproar"],[36,"belly-drum"],[40,"flare-blitz"],[44,"thrash"],[48,"superpower"]],"g":false,"m":false},"555":{"n":"达摩狒狒","t":["fire"],"s":[105,140,55,30,55,95],"l":[[0,"hammer-arm"],[1,"ember"],[1,"tackle"],[3,"rollout"],[4,"taunt"],[8,"bite"],[12,"incinerate"],[15,"flame-charge"],[16,"work-up"],[17,"swagger"],[19,"facade"],[20,"fire-fang"],[24,"headbutt"],[28,"fire-punch"],[32,"uproar"],[38,"belly-drum"],[44,"flare-blitz"],[50,"thrash"],[56,"superpower"]],"g":false,"m":false},"556":{"n":"沙铃仙人掌","t":["grass"],"s":[75,86,67,106,67,60],"l":[[1,"absorb"],[1,"after-you"],[1,"ingrain"],[1,"peck"],[1,"spiky-shield"],[4,"growth"],[8,"mega-drain"],[12,"leech-seed"],[15,"grass-knot"],[16,"sucker-punch"],[20,"pin-missile"],[22,"needle-arm"],[24,"giga-drain"],[28,"sweet-scent"],[32,"synthesis"],[36,"petal-blizzard"],[40,"cotton-spore"],[44,"sunny-day"],[45,"energy-ball"],[48,"solar-beam"],[52,"acupressure"],[56,"petal-dance"],[60,"cotton-guard"],[85,"leaf-storm"]],"g":false,"m":false},"557":{"n":"石居蟹","t":["bug","rock"],"s":[50,65,85,35,35,55],"l":[[1,"fury-cutter"],[1,"sand-attack"],[4,"withdraw"],[8,"smack-down"],[12,"bug-bite"],[13,"feint-attack"],[15,"rock-tomb"],[16,"flail"],[20,"slash"],[24,"rock-slide"],[28,"stealth-rock"],[32,"rock-blast"],[36,"x-scissor"],[40,"rock-polish"],[44,"shell-smash"],[48,"rock-wrecker"]],"g":false,"m":false},"558":{"n":"岩殿居蟹","t":["bug","rock"],"s":[70,105,125,65,75,45],"l":[[1,"fury-cutter"],[1,"sand-attack"],[4,"withdraw"],[8,"smack-down"],[12,"bug-bite"],[13,"feint-attack"],[15,"rock-tomb"],[16,"flail"],[20,"slash"],[24,"rock-slide"],[28,"stealth-rock"],[32,"rock-blast"],[38,"x-scissor"],[44,"rock-polish"],[50,"shell-smash"],[56,"rock-wrecker"]],"g":false,"m":false},"559":{"n":"滑滑小子","t":["dark","fighting"],"s":[50,75,70,35,70,48],"l":[[1,"leer"],[1,"low-kick"],[4,"payback"],[8,"headbutt"],[9,"feint-attack"],[12,"sand-attack"],[15,"knock-off"],[15,"low-sweep"],[16,"facade"],[20,"protect"],[20,"torment"],[24,"beat-up"],[28,"scary-face"],[30,"drain-punch"],[30,"lash-out"],[30,"throat-chop"],[32,"brick-break"],[36,"swagger"],[40,"crunch"],[44,"high-jump-kick"],[45,"foul-play"],[45,"rock-climb"],[48,"focus-punch"],[52,"head-smash"]],"g":false,"m":false},"560":{"n":"头巾混混","t":["dark","fighting"],"s":[65,90,115,45,115,58],"l":[[1,"leer"],[1,"low-kick"],[4,"payback"],[8,"headbutt"],[9,"feint-attack"],[12,"sand-attack"],[15,"knock-off"],[15,"low-sweep"],[16,"facade"],[20,"protect"],[20,"torment"],[24,"beat-up"],[28,"scary-face"],[30,"drain-punch"],[30,"lash-out"],[30,"throat-chop"],[32,"brick-break"],[36,"swagger"],[42,"crunch"],[45,"foul-play"],[45,"rock-climb"],[48,"high-jump-kick"],[54,"focus-punch"],[60,"head-smash"]],"g":false,"m":false},"561":{"n":"象征鸟","t":["psychic","flying"],"s":[72,58,80,103,80,97],"l":[[1,"confusion"],[1,"gust"],[1,"miracle-eye"],[5,"gravity"],[10,"hypnosis"],[15,"air-cutter"],[20,"psybeam"],[25,"whirlwind"],[30,"cosmic-power"],[30,"psyshock"],[31,"synchronoise"],[34,"mirror-move"],[35,"air-slash"],[40,"psychic"],[45,"tailwind"],[50,"light-screen"],[50,"reflect"],[55,"sky-attack"],[60,"skill-swap"],[85,"future-sight"]],"g":false,"m":false},"562":{"n":"哭哭面具","t":["ghost"],"s":[38,30,85,55,65,30],"l":[[1,"astonish"],[1,"protect"],[4,"haze"],[8,"night-shade"],[12,"disable"],[16,"will-o-wisp"],[20,"crafty-shield"],[24,"hex"],[28,"mean-look"],[32,"grudge"],[36,"curse"],[40,"shadow-ball"],[44,"dark-pulse"],[48,"guard-split"],[48,"power-split"],[52,"destiny-bond"]],"g":false,"m":false},"563":{"n":"迭失棺","t":["ghost"],"s":[58,50,145,95,105,30],"l":[[0,"scary-face"],[0,"shadow-claw"],[1,"astonish"],[1,"protect"],[4,"haze"],[8,"night-shade"],[12,"disable"],[16,"will-o-wisp"],[20,"crafty-shield"],[24,"hex"],[28,"mean-look"],[32,"grudge"],[38,"curse"],[44,"shadow-ball"],[50,"dark-pulse"],[56,"guard-split"],[56,"power-split"],[62,"destiny-bond"]],"g":false,"m":false},"564":{"n":"原盖海龟","t":["water","rock"],"s":[54,78,103,53,45,22],"l":[[1,"bide"],[1,"water-gun"],[1,"withdraw"],[3,"protect"],[5,"rollout"],[6,"aqua-jet"],[9,"smack-down"],[12,"ancient-power"],[15,"bite"],[15,"rock-tomb"],[18,"wide-guard"],[21,"brine"],[24,"rock-slide"],[27,"crunch"],[30,"curse"],[30,"rock-blast"],[30,"waterfall"],[33,"iron-defense"],[36,"aqua-tail"],[39,"rain-dance"],[42,"hydro-pump"],[45,"shell-smash"],[65,"stone-edge"]],"g":false,"m":false},"565":{"n":"肋骨海龟","t":["water","rock"],"s":[74,108,133,83,65,32],"l":[[1,"bide"],[1,"water-gun"],[1,"withdraw"],[3,"protect"],[5,"rollout"],[6,"aqua-jet"],[9,"smack-down"],[12,"ancient-power"],[15,"bite"],[15,"rock-tomb"],[18,"wide-guard"],[21,"brine"],[24,"rock-slide"],[27,"crunch"],[30,"curse"],[30,"rock-blast"],[30,"waterfall"],[33,"iron-defense"],[36,"aqua-tail"],[41,"rain-dance"],[46,"hydro-pump"],[51,"shell-smash"],[65,"stone-edge"]],"g":false,"m":false},"566":{"n":"始祖小鸟","t":["rock","flying"],"s":[55,112,45,74,45,70],"l":[[1,"leer"],[1,"quick-attack"],[3,"rock-throw"],[6,"wing-attack"],[8,"double-team"],[9,"dragon-breath"],[12,"ancient-power"],[15,"pluck"],[15,"rock-tomb"],[18,"quick-guard"],[21,"u-turn"],[24,"rock-slide"],[27,"scary-face"],[30,"crunch"],[30,"rock-blast"],[33,"agility"],[36,"tailwind"],[39,"dragon-claw"],[42,"thrash"],[45,"bounce"],[45,"endeavor"],[65,"stone-edge"]],"g":false,"m":false},"567":{"n":"始祖大鸟","t":["rock","flying"],"s":[75,140,65,112,65,110],"l":[[1,"leer"],[1,"quick-attack"],[3,"rock-throw"],[6,"wing-attack"],[8,"double-team"],[9,"dragon-breath"],[12,"ancient-power"],[15,"pluck"],[15,"rock-tomb"],[18,"quick-guard"],[21,"u-turn"],[24,"rock-slide"],[27,"scary-face"],[30,"crunch"],[30,"rock-blast"],[33,"agility"],[36,"tailwind"],[41,"dragon-claw"],[45,"bounce"],[45,"fly"],[46,"thrash"],[51,"endeavor"],[65,"stone-edge"]],"g":false,"m":false},"568":{"n":"破破袋","t":["poison"],"s":[50,50,62,40,62,65],"l":[[1,"poison-gas"],[1,"pound"],[3,"recycle"],[6,"acid-spray"],[9,"amnesia"],[12,"clear-smog"],[14,"double-slap"],[15,"toxic-spikes"],[15,"venoshock"],[18,"sludge"],[21,"stockpile"],[21,"swallow"],[24,"take-down"],[27,"sludge-bomb"],[30,"toxic"],[33,"belch"],[37,"pain-split"],[39,"gunk-shot"],[42,"explosion"]],"g":false,"m":false},"569":{"n":"灰尘山","t":["poison"],"s":[80,95,82,60,82,75],"l":[[1,"poison-gas"],[1,"pound"],[3,"recycle"],[6,"acid-spray"],[9,"amnesia"],[12,"clear-smog"],[14,"double-slap"],[15,"toxic-spikes"],[15,"venoshock"],[18,"sludge"],[21,"stockpile"],[21,"swallow"],[24,"body-slam"],[24,"take-down"],[27,"sludge-bomb"],[30,"cross-poison"],[30,"toxic"],[33,"belch"],[39,"pain-split"],[43,"gunk-shot"],[48,"explosion"]],"g":false,"m":false},"570":{"n":"索罗亚","t":["dark"],"s":[40,65,40,80,40,65],"l":[[1,"leer"],[1,"scratch"],[4,"torment"],[5,"pursuit"],[8,"hone-claws"],[12,"fury-swipes"],[15,"payback"],[15,"snarl"],[16,"scary-face"],[17,"feint-attack"],[20,"taunt"],[24,"knock-off"],[28,"fake-tears"],[30,"dark-pulse"],[30,"lash-out"],[32,"agility"],[36,"imprison"],[40,"night-daze"],[41,"embargo"],[44,"nasty-plot"],[45,"punishment"],[48,"foul-play"]],"g":false,"m":false},"571":{"n":"索罗亚克","t":["dark"],"s":[60,105,60,120,60,105],"l":[[0,"night-slash"],[1,"leer"],[1,"scratch"],[4,"torment"],[5,"pursuit"],[8,"hone-claws"],[12,"fury-swipes"],[15,"payback"],[15,"snarl"],[16,"scary-face"],[17,"feint-attack"],[20,"taunt"],[24,"knock-off"],[28,"fake-tears"],[30,"dark-pulse"],[30,"lash-out"],[34,"agility"],[40,"imprison"],[41,"embargo"],[45,"punishment"],[46,"night-daze"],[52,"nasty-plot"],[58,"foul-play"]],"g":false,"m":false},"572":{"n":"泡沫栗鼠","t":["normal"],"s":[55,50,40,40,40,75],"l":[[1,"baby-doll-eyes"],[1,"pound"],[3,"growl"],[4,"helping-hand"],[8,"echoed-voice"],[12,"sing"],[13,"double-slap"],[15,"super-fang"],[16,"charm"],[20,"swift"],[24,"encore"],[28,"after-you"],[30,"facade"],[31,"wake-up-slap"],[32,"tail-slap"],[36,"tickle"],[39,"captivate"],[40,"slam"],[44,"hyper-voice"],[45,"take-down"],[48,"last-resort"]],"g":false,"m":false},"573":{"n":"奇诺栗鼠","t":["normal"],"s":[75,95,60,65,60,115],"l":[[0,"tail-slap"],[1,"baby-doll-eyes"],[1,"pound"],[3,"growl"],[4,"helping-hand"],[8,"echoed-voice"],[12,"sing"],[13,"double-slap"],[15,"super-fang"],[16,"charm"],[20,"swift"],[24,"encore"],[28,"after-you"],[30,"facade"],[31,"wake-up-slap"],[36,"tickle"],[39,"captivate"],[40,"slam"],[44,"hyper-voice"],[45,"take-down"],[48,"last-resort"],[85,"double-edge"]],"g":false,"m":false},"574":{"n":"哥德宝宝","t":["psychic"],"s":[45,30,50,55,65,45],"l":[[1,"confusion"],[1,"pound"],[4,"play-nice"],[8,"tickle"],[12,"psybeam"],[14,"double-slap"],[16,"charm"],[19,"embargo"],[20,"psyshock"],[24,"feint-attack"],[24,"hypnosis"],[28,"fake-tears"],[33,"heal-block"],[33,"psych-up"],[36,"psychic"],[40,"flatter"],[40,"telekinesis"],[44,"future-sight"],[48,"magic-room"]],"g":false,"m":false},"575":{"n":"哥德小童","t":["psychic"],"s":[60,45,70,75,85,55],"l":[[1,"confusion"],[1,"pound"],[4,"play-nice"],[8,"tickle"],[12,"psybeam"],[14,"double-slap"],[16,"charm"],[19,"embargo"],[20,"psyshock"],[24,"feint-attack"],[24,"hypnosis"],[28,"fake-tears"],[33,"heal-block"],[35,"psych-up"],[36,"psychic"],[40,"telekinesis"],[46,"flatter"],[52,"future-sight"],[58,"magic-room"]],"g":false,"m":false},"576":{"n":"哥德小姐","t":["psychic"],"s":[70,55,95,95,110,65],"l":[[1,"confusion"],[1,"pound"],[4,"play-nice"],[8,"tickle"],[12,"psybeam"],[14,"double-slap"],[16,"charm"],[19,"embargo"],[20,"psyshock"],[24,"feint-attack"],[24,"hypnosis"],[28,"fake-tears"],[33,"heal-block"],[35,"psych-up"],[40,"psychic"],[40,"telekinesis"],[48,"flatter"],[56,"future-sight"],[64,"magic-room"]],"g":false,"m":false},"577":{"n":"单卵细胞球","t":["psychic"],"s":[45,30,40,105,50,20],"l":[[1,"confusion"],[1,"protect"],[4,"recover"],[7,"rollout"],[8,"endeavor"],[10,"snatch"],[12,"psybeam"],[14,"hidden-power"],[16,"charm"],[20,"psyshock"],[24,"light-screen"],[24,"reflect"],[28,"ally-switch"],[33,"pain-split"],[36,"psychic"],[40,"skill-swap"],[44,"future-sight"],[46,"heal-block"],[48,"wonder-room"]],"g":false,"m":false},"578":{"n":"双卵细胞球","t":["psychic"],"s":[65,40,50,125,60,30],"l":[[1,"confusion"],[1,"protect"],[4,"recover"],[7,"rollout"],[8,"endeavor"],[10,"snatch"],[12,"psybeam"],[14,"hidden-power"],[16,"charm"],[20,"psyshock"],[24,"light-screen"],[24,"reflect"],[28,"ally-switch"],[35,"pain-split"],[40,"psychic"],[46,"heal-block"],[46,"skill-swap"],[52,"future-sight"],[58,"wonder-room"]],"g":false,"m":false},"579":{"n":"人造细胞卵","t":["psychic"],"s":[110,65,75,125,85,30],"l":[[0,"dizzy-punch"],[0,"hammer-arm"],[1,"confusion"],[1,"protect"],[4,"recover"],[7,"rollout"],[8,"endeavor"],[10,"snatch"],[12,"psybeam"],[14,"hidden-power"],[16,"charm"],[20,"psyshock"],[24,"light-screen"],[24,"reflect"],[28,"ally-switch"],[35,"pain-split"],[40,"psychic"],[46,"heal-block"],[48,"skill-swap"],[56,"future-sight"],[64,"wonder-room"]],"g":false,"m":false},"580":{"n":"鸭宝宝","t":["water","flying"],"s":[62,44,50,44,50,55],"l":[[1,"water-gun"],[3,"water-sport"],[6,"defog"],[9,"wing-attack"],[13,"water-pulse"],[15,"aerial-ace"],[19,"bubble-beam"],[21,"feather-dance"],[24,"aqua-ring"],[27,"air-slash"],[30,"dive"],[30,"roost"],[34,"rain-dance"],[37,"tailwind"],[41,"brave-bird"],[45,"liquidation"],[45,"surf"],[46,"hurricane"]],"g":false,"m":false},"581":{"n":"舞天鹅","t":["water","flying"],"s":[75,87,63,87,63,98],"l":[[1,"water-gun"],[3,"water-sport"],[6,"defog"],[9,"wing-attack"],[13,"water-pulse"],[15,"aerial-ace"],[19,"bubble-beam"],[21,"feather-dance"],[24,"aqua-ring"],[27,"air-slash"],[30,"dive"],[30,"roost"],[34,"rain-dance"],[40,"tailwind"],[45,"liquidation"],[45,"surf"],[47,"brave-bird"],[55,"hurricane"],[65,"hydro-pump"]],"g":false,"m":false},"582":{"n":"迷你冰","t":["ice"],"s":[36,50,50,65,60,44],"l":[[1,"astonish"],[1,"harden"],[4,"taunt"],[8,"mist"],[12,"icy-wind"],[15,"frost-breath"],[16,"avalanche"],[20,"hail"],[24,"icicle-spear"],[26,"mirror-shot"],[28,"uproar"],[32,"acid-armor"],[36,"mirror-coat"],[40,"ice-beam"],[44,"blizzard"],[48,"sheer-cold"]],"g":false,"m":false},"583":{"n":"多多冰","t":["ice"],"s":[51,65,65,80,75,59],"l":[[1,"astonish"],[1,"harden"],[4,"taunt"],[8,"mist"],[12,"icy-wind"],[15,"frost-breath"],[16,"avalanche"],[20,"hail"],[24,"icicle-spear"],[26,"mirror-shot"],[28,"uproar"],[32,"acid-armor"],[38,"mirror-coat"],[44,"ice-beam"],[50,"blizzard"],[56,"sheer-cold"]],"g":false,"m":false},"584":{"n":"双倍多多冰","t":["ice"],"s":[71,95,85,110,95,79],"l":[[1,"astonish"],[1,"harden"],[4,"taunt"],[8,"mist"],[12,"icy-wind"],[15,"frost-breath"],[16,"avalanche"],[20,"hail"],[24,"icicle-spear"],[26,"mirror-shot"],[28,"uproar"],[32,"acid-armor"],[38,"mirror-coat"],[44,"ice-beam"],[52,"blizzard"],[60,"sheer-cold"]],"g":false,"m":false},"585":{"n":"四季鹿","t":["normal","grass"],"s":[60,60,50,40,50,75],"l":[[1,"camouflage"],[1,"tackle"],[4,"growl"],[7,"sand-attack"],[10,"double-kick"],[13,"leech-seed"],[15,"grassy-glide"],[15,"trailblaze"],[16,"bullet-seed"],[16,"feint-attack"],[20,"take-down"],[24,"jump-kick"],[24,"zen-headbutt"],[28,"aromatherapy"],[28,"energy-ball"],[30,"seed-bomb"],[32,"charm"],[37,"double-edge"],[41,"nature-power"],[42,"solar-beam"],[85,"leaf-storm"]],"g":false,"m":false},"586":{"n":"萌芽鹿","t":["normal","grass"],"s":[80,100,70,60,70,95],"l":[[0,"horn-leech"],[1,"camouflage"],[1,"tackle"],[4,"growl"],[7,"sand-attack"],[10,"double-kick"],[13,"leech-seed"],[15,"cut"],[15,"grassy-glide"],[15,"trailblaze"],[16,"bullet-seed"],[16,"feint-attack"],[20,"take-down"],[24,"jump-kick"],[24,"zen-headbutt"],[28,"aromatherapy"],[28,"energy-ball"],[30,"seed-bomb"],[36,"charm"],[41,"nature-power"],[44,"double-edge"],[45,"petal-blizzard"],[52,"solar-beam"],[85,"leaf-storm"]],"g":false,"m":false},"587":{"n":"电飞鼠","t":["electric","flying"],"s":[55,75,60,75,60,103],"l":[[1,"nuzzle"],[1,"tail-whip"],[5,"double-team"],[10,"quick-attack"],[15,"aerial-ace"],[15,"charge-beam"],[15,"electro-ball"],[15,"electroweb"],[15,"thunder-shock"],[16,"pursuit"],[20,"charge"],[22,"shock-wave"],[25,"acrobatics"],[30,"air-slash"],[30,"spark"],[35,"encore"],[40,"volt-switch"],[45,"light-screen"],[45,"thunderbolt"],[50,"discharge"],[55,"agility"],[65,"thunder"]],"g":false,"m":false},"588":{"n":"盖盖虫","t":["bug"],"s":[50,75,45,40,45,60],"l":[[1,"leer"],[1,"peck"],[4,"fury-cutter"],[8,"endure"],[12,"false-swipe"],[16,"acid-spray"],[16,"fury-attack"],[20,"headbutt"],[24,"flail"],[28,"scary-face"],[32,"x-scissor"],[36,"swords-dance"],[40,"take-down"],[44,"bug-buzz"],[48,"double-edge"],[85,"megahorn"]],"g":false,"m":false},"589":{"n":"骑士蜗牛","t":["bug","steel"],"s":[70,135,105,60,105,20],"l":[[1,"leer"],[1,"peck"],[4,"fury-cutter"],[8,"endure"],[8,"quick-guard"],[12,"false-swipe"],[13,"twineedle"],[16,"acid-spray"],[16,"fury-attack"],[20,"headbutt"],[24,"flail"],[24,"reversal"],[28,"iron-defense"],[28,"scary-face"],[30,"smart-strike"],[32,"x-scissor"],[36,"swords-dance"],[40,"iron-head"],[40,"take-down"],[44,"bug-buzz"],[48,"double-edge"],[48,"giga-impact"],[52,"metal-burst"],[85,"megahorn"]],"g":false,"m":false},"590":{"n":"哎呀球菇","t":["grass","poison"],"s":[69,55,45,55,55,15],"l":[[1,"absorb"],[1,"astonish"],[4,"growth"],[8,"stun-spore"],[12,"bide"],[12,"mega-drain"],[15,"magical-leaf"],[15,"venoshock"],[16,"synthesis"],[20,"clear-smog"],[20,"feint-attack"],[24,"sweet-scent"],[28,"giga-drain"],[30,"bullet-seed"],[30,"seed-bomb"],[32,"ingrain"],[36,"toxic"],[40,"rage-powder"],[44,"solar-beam"],[45,"sludge-bomb"],[48,"spore"],[85,"leaf-storm"]],"g":false,"m":false},"591":{"n":"败露球菇","t":["grass","poison"],"s":[114,85,70,85,80,30],"l":[[1,"absorb"],[1,"astonish"],[4,"growth"],[8,"stun-spore"],[12,"bide"],[12,"mega-drain"],[15,"magical-leaf"],[15,"venoshock"],[16,"synthesis"],[20,"clear-smog"],[20,"feint-attack"],[24,"sweet-scent"],[28,"giga-drain"],[30,"bullet-seed"],[30,"seed-bomb"],[32,"ingrain"],[36,"toxic"],[42,"rage-powder"],[45,"sludge-bomb"],[48,"solar-beam"],[54,"spore"],[85,"leaf-storm"]],"g":false,"m":false},"592":{"n":"轻飘飘","t":["water","ghost"],"s":[55,40,50,65,85,40],"l":[[1,"absorb"],[1,"water-gun"],[1,"water-sport"],[4,"poison-sting"],[8,"night-shade"],[12,"water-pulse"],[13,"bubble-beam"],[16,"rain-dance"],[20,"hex"],[24,"brine"],[28,"recover"],[30,"scald"],[32,"shadow-ball"],[36,"whirlpool"],[41,"hydro-pump"],[44,"destiny-bond"],[48,"water-spout"],[55,"wring-out"]],"g":false,"m":false},"593":{"n":"胖嘟嘟","t":["water","ghost"],"s":[100,60,70,85,105,60],"l":[[1,"absorb"],[1,"water-gun"],[1,"water-sport"],[4,"poison-sting"],[8,"night-shade"],[12,"water-pulse"],[13,"bubble-beam"],[16,"rain-dance"],[20,"hex"],[24,"brine"],[28,"recover"],[30,"scald"],[32,"shadow-ball"],[36,"whirlpool"],[43,"hydro-pump"],[48,"destiny-bond"],[54,"water-spout"],[55,"wring-out"]],"g":false,"m":false},"594":{"n":"保姆曼波","t":["water"],"s":[165,75,80,40,45,65],"l":[[1,"play-nice"],[1,"pound"],[1,"water-sport"],[5,"aqua-ring"],[9,"aqua-jet"],[13,"double-slap"],[13,"helping-hand"],[13,"wide-guard"],[15,"flip-turn"],[17,"heal-pulse"],[21,"protect"],[25,"water-pulse"],[29,"healing-wish"],[29,"wake-up-slap"],[30,"waterfall"],[33,"soak"],[37,"wish"],[41,"brine"],[45,"liquidation"],[45,"safeguard"],[49,"whirlpool"],[55,"hydro-pump"]],"g":false,"m":false},"595":{"n":"电电虫","t":["bug","electric"],"s":[50,47,50,57,50,65],"l":[[1,"absorb"],[1,"fury-cutter"],[1,"leech-life"],[1,"spider-web"],[4,"electroweb"],[8,"bug-bite"],[12,"string-shot"],[16,"thunder-wave"],[20,"electro-ball"],[24,"agility"],[28,"sucker-punch"],[30,"volt-switch"],[32,"slash"],[34,"signal-beam"],[37,"discharge"],[40,"screech"],[44,"gastro-acid"],[45,"thunderbolt"],[48,"bug-buzz"],[65,"thunder"]],"g":false,"m":false},"596":{"n":"电蜘蛛","t":["bug","electric"],"s":[70,77,60,97,60,108],"l":[[0,"sticky-web"],[1,"absorb"],[1,"fury-cutter"],[1,"leech-life"],[1,"spider-web"],[4,"electroweb"],[8,"bug-bite"],[12,"string-shot"],[16,"thunder-wave"],[20,"electro-ball"],[24,"agility"],[28,"sucker-punch"],[30,"volt-switch"],[32,"slash"],[34,"signal-beam"],[39,"discharge"],[44,"screech"],[45,"thunderbolt"],[50,"gastro-acid"],[56,"bug-buzz"],[65,"thunder"]],"g":false,"m":false},"597":{"n":"种子铁球","t":["grass","steel"],"s":[44,50,91,24,86,10],"l":[[1,"harden"],[1,"tackle"],[5,"metal-claw"],[6,"rollout"],[10,"pin-missile"],[15,"ingrain"],[20,"flash-cannon"],[25,"iron-head"],[30,"bullet-seed"],[30,"giga-drain"],[30,"seed-bomb"],[30,"self-destruct"],[35,"iron-defense"],[41,"curse"],[45,"gyro-ball"],[47,"payback"],[50,"explosion"]],"g":false,"m":false},"598":{"n":"坚果哑铃","t":["grass","steel"],"s":[74,94,131,54,116,20],"l":[[0,"power-whip"],[1,"harden"],[1,"tackle"],[5,"metal-claw"],[6,"rollout"],[10,"pin-missile"],[15,"ingrain"],[20,"flash-cannon"],[25,"iron-head"],[30,"bullet-seed"],[30,"giga-drain"],[30,"seed-bomb"],[30,"self-destruct"],[35,"iron-defense"],[43,"curse"],[47,"payback"],[49,"gyro-ball"],[56,"explosion"]],"g":false,"m":false},"599":{"n":"齿轮儿","t":["steel"],"s":[40,55,70,45,60,30],"l":[[1,"thunder-shock"],[1,"vice-grip"],[4,"bind"],[8,"charge"],[12,"charge-beam"],[16,"metal-sound"],[20,"autotomize"],[24,"discharge"],[28,"screech"],[30,"flash-cannon"],[32,"gear-grind"],[36,"lock-on"],[40,"shift-gear"],[44,"zap-cannon"],[48,"hyper-beam"]],"g":false,"m":false},"600":{"n":"齿轮组","t":["steel"],"s":[60,80,95,70,85,50],"l":[[1,"thunder-shock"],[1,"vice-grip"],[4,"bind"],[8,"charge"],[12,"charge-beam"],[16,"metal-sound"],[20,"autotomize"],[24,"discharge"],[28,"screech"],[30,"flash-cannon"],[32,"gear-grind"],[36,"lock-on"],[42,"shift-gear"],[48,"zap-cannon"],[54,"hyper-beam"]],"g":false,"m":false},"601":{"n":"齿轮怪","t":["steel"],"s":[60,100,115,70,85,90],"l":[[0,"magnetic-flux"],[1,"thunder-shock"],[1,"vice-grip"],[4,"bind"],[8,"charge"],[12,"charge-beam"],[16,"metal-sound"],[20,"autotomize"],[24,"discharge"],[28,"screech"],[30,"flash-cannon"],[32,"gear-grind"],[36,"lock-on"],[42,"shift-gear"],[48,"zap-cannon"],[56,"hyper-beam"],[64,"electric-terrain"]],"g":false,"m":false},"602":{"n":"麻麻小鱼","t":["electric"],"s":[35,55,40,45,40,60],"l":[[1,"charge-beam"],[1,"spark"],[1,"tackle"],[1,"thunder-wave"]],"g":false,"m":false},"603":{"n":"麻麻鳗","t":["electric"],"s":[65,85,70,75,70,40],"l":[[0,"crunch"],[1,"charge-beam"],[1,"spark"],[1,"tackle"],[1,"thunder-wave"],[9,"bind"],[19,"acid"],[29,"discharge"],[44,"thunderbolt"],[49,"acid-spray"],[54,"coil"],[59,"wild-charge"],[64,"gastro-acid"],[65,"thunder"],[69,"zap-cannon"],[74,"thrash"]],"g":false,"m":false},"604":{"n":"麻麻鳗鱼王","t":["electric"],"s":[85,115,80,105,80,50],"l":[[0,"crunch"],[1,"charge-beam"],[1,"spark"],[1,"tackle"],[1,"thunder-wave"],[5,"wild-charge"],[9,"bind"],[19,"acid"],[29,"discharge"],[44,"thunderbolt"],[49,"acid-spray"],[54,"coil"],[64,"gastro-acid"],[65,"thunder"],[69,"zap-cannon"],[74,"thrash"]],"g":false,"m":false},"605":{"n":"小灰怪","t":["psychic"],"s":[55,55,55,85,55,30],"l":[[1,"confusion"],[1,"growl"],[6,"imprison"],[8,"heal-block"],[11,"miracle-eye"],[12,"teleport"],[18,"psybeam"],[22,"hidden-power"],[24,"guard-split"],[24,"power-split"],[29,"simple-beam"],[30,"headbutt"],[30,"psyshock"],[36,"psych-up"],[36,"zen-headbutt"],[43,"recover"],[48,"calm-mind"],[53,"synchronoise"],[54,"wonder-room"],[60,"psychic"]],"g":false,"m":false},"606":{"n":"大宇怪","t":["psychic"],"s":[75,75,75,125,95,40],"l":[[1,"confusion"],[1,"growl"],[6,"imprison"],[8,"heal-block"],[11,"miracle-eye"],[12,"teleport"],[18,"psybeam"],[22,"hidden-power"],[24,"guard-split"],[24,"power-split"],[29,"simple-beam"],[30,"headbutt"],[30,"psyshock"],[36,"psych-up"],[36,"zen-headbutt"],[45,"recover"],[52,"calm-mind"],[53,"synchronoise"],[60,"wonder-room"],[68,"psychic"],[85,"future-sight"]],"g":false,"m":false},"607":{"n":"烛光灵","t":["ghost","fire"],"s":[50,30,55,65,55,20],"l":[[1,"astonish"],[1,"smog"],[4,"ember"],[8,"minimize"],[12,"confuse-ray"],[15,"incinerate"],[16,"hex"],[20,"flame-burst"],[20,"will-o-wisp"],[24,"fire-spin"],[28,"night-shade"],[30,"mystical-fire"],[32,"curse"],[36,"shadow-ball"],[40,"inferno"],[44,"imprison"],[48,"pain-split"],[52,"overheat"],[56,"memento"]],"g":false,"m":false},"608":{"n":"灯火幽灵","t":["ghost","fire"],"s":[60,40,60,95,60,55],"l":[[1,"astonish"],[1,"smog"],[4,"ember"],[8,"minimize"],[12,"confuse-ray"],[15,"incinerate"],[16,"hex"],[20,"flame-burst"],[20,"will-o-wisp"],[24,"fire-spin"],[28,"night-shade"],[30,"mystical-fire"],[32,"curse"],[36,"shadow-ball"],[40,"inferno"],[46,"imprison"],[52,"pain-split"],[58,"overheat"],[64,"memento"]],"g":false,"m":false},"609":{"n":"水晶灯火灵","t":["ghost","fire"],"s":[60,55,90,145,90,80],"l":[[1,"astonish"],[1,"smog"],[4,"ember"],[8,"minimize"],[12,"confuse-ray"],[15,"hex"],[15,"incinerate"],[15,"night-shade"],[20,"flame-burst"],[20,"will-o-wisp"],[24,"fire-spin"],[30,"mystical-fire"],[30,"shadow-ball"],[32,"curse"],[40,"inferno"],[46,"imprison"],[52,"pain-split"],[58,"overheat"],[64,"memento"]],"g":false,"m":false},"610":{"n":"牙牙","t":["dragon"],"s":[46,87,60,30,40,57],"l":[[1,"leer"],[1,"scratch"],[3,"bite"],[6,"false-swipe"],[9,"assurance"],[10,"dragon-rage"],[12,"taunt"],[15,"dragon-tail"],[15,"slash"],[18,"dragon-claw"],[21,"scary-face"],[24,"crunch"],[27,"dragon-dance"],[30,"breaking-swipe"],[33,"focus-energy"],[33,"laser-focus"],[36,"dragon-pulse"],[39,"swords-dance"],[42,"outrage"],[45,"guillotine"],[48,"giga-impact"]],"g":false,"m":false},"611":{"n":"斧牙龙","t":["dragon"],"s":[66,117,70,40,50,67],"l":[[1,"leer"],[1,"scratch"],[3,"bite"],[6,"false-swipe"],[9,"assurance"],[10,"dragon-rage"],[12,"taunt"],[15,"dragon-tail"],[15,"slash"],[18,"dragon-claw"],[21,"scary-face"],[24,"crunch"],[27,"dragon-dance"],[30,"breaking-swipe"],[33,"focus-energy"],[33,"laser-focus"],[36,"dragon-pulse"],[41,"swords-dance"],[46,"outrage"],[51,"guillotine"],[56,"giga-impact"]],"g":false,"m":false},"612":{"n":"双斧战龙","t":["dragon"],"s":[76,147,90,60,70,97],"l":[[1,"leer"],[1,"scratch"],[3,"bite"],[6,"false-swipe"],[9,"assurance"],[10,"dragon-rage"],[12,"taunt"],[15,"dragon-tail"],[15,"slash"],[18,"dragon-claw"],[21,"scary-face"],[24,"crunch"],[27,"dragon-dance"],[30,"breaking-swipe"],[33,"focus-energy"],[33,"laser-focus"],[36,"dragon-pulse"],[41,"swords-dance"],[46,"outrage"],[53,"guillotine"],[60,"giga-impact"]],"g":false,"m":false},"613":{"n":"喷嚏熊","t":["ice"],"s":[55,70,40,60,40,40],"l":[[1,"growl"],[1,"powder-snow"],[3,"endure"],[6,"fury-swipes"],[9,"bide"],[9,"icy-wind"],[12,"play-nice"],[15,"avalanche"],[15,"brine"],[15,"ice-fang"],[18,"frost-breath"],[21,"slash"],[24,"flail"],[27,"charm"],[30,"hail"],[30,"ice-punch"],[30,"icicle-spear"],[30,"snowscape"],[33,"thrash"],[36,"rest"],[39,"blizzard"],[42,"sheer-cold"]],"g":false,"m":false},"614":{"n":"冻原熊","t":["ice"],"s":[95,130,80,70,80,50],"l":[[0,"icicle-crash"],[1,"growl"],[1,"powder-snow"],[3,"endure"],[6,"fury-swipes"],[9,"bide"],[9,"icy-wind"],[12,"play-nice"],[15,"avalanche"],[15,"brine"],[15,"ice-fang"],[18,"frost-breath"],[21,"slash"],[24,"flail"],[27,"charm"],[27,"swagger"],[30,"hail"],[30,"ice-punch"],[30,"icicle-spear"],[30,"snowscape"],[33,"thrash"],[36,"rest"],[41,"blizzard"],[46,"sheer-cold"],[51,"superpower"]],"g":false,"m":false},"615":{"n":"几何雪花","t":["ice"],"s":[80,50,50,95,135,105],"l":[[1,"bind"],[1,"ice-shard"],[1,"sharpen"],[4,"confuse-ray"],[8,"rapid-spin"],[12,"icy-wind"],[12,"laser-focus"],[15,"frost-breath"],[16,"haze"],[16,"mist"],[20,"ancient-power"],[24,"aurora-beam"],[28,"slash"],[32,"night-slash"],[36,"freeze-dry"],[40,"light-screen"],[40,"reflect"],[44,"recover"],[48,"ice-beam"],[52,"acid-armor"],[56,"solar-beam"],[60,"sheer-cold"],[65,"blizzard"]],"g":false,"m":false},"616":{"n":"小嘴蜗","t":["bug"],"s":[50,40,85,40,65,25],"l":[[1,"absorb"],[1,"leech-life"],[1,"protect"],[4,"acid"],[8,"bide"],[8,"curse"],[12,"mega-drain"],[16,"struggle-bug"],[20,"yawn"],[24,"acid-armor"],[28,"giga-drain"],[32,"guard-swap"],[36,"body-slam"],[40,"recover"],[44,"bug-buzz"],[48,"final-gambit"]],"g":false,"m":false},"617":{"n":"敏捷虫","t":["bug"],"s":[80,70,40,100,60,145],"l":[[1,"absorb"],[1,"leech-life"],[1,"protect"],[4,"acid"],[8,"bide"],[8,"curse"],[8,"double-team"],[12,"mega-drain"],[13,"quick-attack"],[16,"struggle-bug"],[20,"swift"],[20,"yawn"],[24,"acid-armor"],[24,"agility"],[28,"giga-drain"],[28,"me-first"],[32,"guard-swap"],[32,"power-swap"],[36,"body-slam"],[36,"u-turn"],[40,"recover"],[44,"bug-buzz"],[48,"final-gambit"],[52,"toxic"]],"g":false,"m":false},"618":{"n":"泥巴鱼","t":["ground","electric"],"s":[109,66,84,81,99,32],"l":[[1,"mud-slap"],[1,"mud-sport"],[1,"tackle"],[1,"thunder-shock"],[1,"water-gun"],[5,"bide"],[5,"endure"],[10,"mud-shot"],[15,"electroweb"],[15,"revenge"],[17,"camouflage"],[20,"charge"],[21,"mud-bomb"],[25,"sucker-punch"],[30,"dig"],[30,"electric-terrain"],[35,"bounce"],[40,"muddy-water"],[45,"discharge"],[45,"earth-power"],[45,"thunderbolt"],[50,"flail"],[55,"fissure"],[65,"thunder"]],"g":false,"m":false},"619":{"n":"功夫鼬","t":["fighting"],"s":[45,85,50,55,50,65],"l":[[1,"detect"],[1,"pound"],[5,"fake-out"],[5,"meditate"],[10,"reversal"],[15,"fury-swipes"],[15,"low-kick"],[15,"low-sweep"],[20,"quick-guard"],[25,"force-palm"],[30,"brick-break"],[30,"u-turn"],[35,"drain-punch"],[37,"jump-kick"],[40,"hone-claws"],[45,"aura-sphere"],[51,"bounce"],[55,"calm-mind"],[60,"high-jump-kick"]],"g":false,"m":false},"620":{"n":"师父鼬","t":["fighting"],"s":[65,125,60,95,60,105],"l":[[1,"detect"],[1,"pound"],[5,"fake-out"],[5,"meditate"],[10,"reversal"],[15,"fury-swipes"],[15,"low-kick"],[15,"low-sweep"],[20,"quick-guard"],[20,"wide-guard"],[25,"force-palm"],[30,"brick-break"],[30,"u-turn"],[35,"drain-punch"],[37,"jump-kick"],[40,"hone-claws"],[45,"aura-sphere"],[53,"bounce"],[59,"calm-mind"],[66,"high-jump-kick"]],"g":false,"m":false},"621":{"n":"赤面龙","t":["dragon"],"s":[77,120,90,60,90,48],"l":[[1,"leer"],[1,"scratch"],[5,"bite"],[10,"dragon-tail"],[15,"metal-claw"],[20,"scary-face"],[25,"slash"],[30,"dragon-claw"],[35,"hone-claws"],[35,"revenge"],[40,"crunch"],[45,"iron-head"],[49,"rock-climb"],[50,"outrage"],[55,"superpower"]],"g":false,"m":false},"622":{"n":"泥偶小人","t":["ground","ghost"],"s":[59,74,50,35,50,35],"l":[[1,"astonish"],[1,"mud-slap"],[4,"defense-curl"],[8,"pound"],[9,"rollout"],[12,"shadow-punch"],[15,"bulldoze"],[16,"curse"],[20,"night-shade"],[24,"stomping-tantrum"],[28,"iron-defense"],[30,"dig"],[32,"mega-punch"],[36,"shadow-ball"],[40,"heavy-slam"],[44,"phantom-force"],[48,"hammer-arm"],[52,"earthquake"],[56,"dynamic-punch"],[61,"focus-punch"],[65,"poltergeist"]],"g":false,"m":false},"623":{"n":"泥偶巨人","t":["ground","ghost"],"s":[89,124,80,55,80,55],"l":[[1,"astonish"],[1,"mud-slap"],[4,"defense-curl"],[8,"pound"],[9,"rollout"],[12,"shadow-punch"],[15,"bulldoze"],[16,"curse"],[20,"night-shade"],[24,"stomping-tantrum"],[28,"iron-defense"],[30,"dig"],[32,"mega-punch"],[36,"shadow-ball"],[40,"heavy-slam"],[45,"high-horsepower"],[46,"phantom-force"],[52,"hammer-arm"],[58,"earthquake"],[61,"focus-punch"],[64,"dynamic-punch"],[65,"poltergeist"]],"g":false,"m":false},"624":{"n":"驹刀小兵","t":["dark","steel"],"s":[45,85,70,40,40,60],"l":[[1,"leer"],[1,"scratch"],[5,"fury-cutter"],[10,"metal-claw"],[15,"beat-up"],[15,"fling"],[15,"payback"],[15,"thief"],[15,"torment"],[17,"feint-attack"],[20,"scary-face"],[25,"assurance"],[30,"lash-out"],[30,"metal-sound"],[35,"slash"],[40,"night-slash"],[41,"embargo"],[45,"foul-play"],[45,"iron-defense"],[50,"laser-focus"],[50,"retaliate"],[55,"iron-head"],[60,"swords-dance"],[65,"guillotine"]],"g":false,"m":false},"625":{"n":"劈斩司令","t":["dark","steel"],"s":[65,125,100,60,70,70],"l":[[1,"leer"],[1,"scratch"],[5,"fury-cutter"],[10,"metal-claw"],[15,"beat-up"],[15,"fling"],[15,"payback"],[15,"thief"],[15,"torment"],[17,"feint-attack"],[20,"scary-face"],[25,"assurance"],[30,"lash-out"],[30,"metal-sound"],[30,"throat-chop"],[35,"slash"],[40,"night-slash"],[41,"embargo"],[45,"foul-play"],[45,"iron-defense"],[50,"laser-focus"],[50,"retaliate"],[57,"iron-head"],[64,"swords-dance"],[71,"guillotine"]],"g":false,"m":false},"626":{"n":"爆炸头水牛","t":["normal"],"s":[95,110,95,40,95,55],"l":[[1,"leer"],[1,"pursuit"],[1,"tackle"],[5,"focus-energy"],[10,"fury-attack"],[15,"cut"],[15,"revenge"],[20,"scary-face"],[25,"horn-attack"],[30,"facade"],[30,"reversal"],[30,"strength"],[35,"throat-chop"],[40,"head-charge"],[45,"swords-dance"],[50,"megahorn"],[55,"giga-impact"]],"g":false,"m":false},"627":{"n":"毛头小鹰","t":["normal","flying"],"s":[70,83,50,37,50,60],"l":[[1,"leer"],[1,"peck"],[5,"fury-attack"],[6,"hone-claws"],[12,"wing-attack"],[15,"cut"],[18,"tailwind"],[24,"scary-face"],[30,"aerial-ace"],[30,"dual-wingbeat"],[30,"facade"],[30,"strength"],[36,"slash"],[42,"whirlwind"],[45,"body-slam"],[45,"fly"],[45,"take-down"],[48,"crush-claw"],[55,"air-slash"],[60,"defog"],[66,"thrash"],[72,"brave-bird"]],"g":false,"m":false},"628":{"n":"勇士雄鹰","t":["normal","flying"],"s":[100,123,75,57,75,80],"l":[[0,"superpower"],[1,"leer"],[1,"peck"],[5,"fury-attack"],[6,"hone-claws"],[12,"wing-attack"],[15,"cut"],[18,"tailwind"],[24,"scary-face"],[30,"aerial-ace"],[30,"dual-wingbeat"],[30,"facade"],[30,"strength"],[36,"slash"],[42,"whirlwind"],[45,"body-slam"],[45,"fly"],[45,"take-down"],[48,"crush-claw"],[57,"air-slash"],[64,"defog"],[72,"brave-bird"],[72,"thrash"]],"g":false,"m":false},"629":{"n":"秃鹰丫头","t":["dark","flying"],"s":[70,55,75,45,65,60],"l":[[1,"gust"],[1,"leer"],[5,"fury-attack"],[6,"flatter"],[12,"pluck"],[15,"payback"],[15,"thief"],[18,"tailwind"],[23,"feint-attack"],[24,"knock-off"],[28,"punishment"],[30,"dual-wingbeat"],[30,"iron-defense"],[30,"lash-out"],[30,"throat-chop"],[36,"whirlwind"],[42,"air-slash"],[45,"fly"],[45,"foul-play"],[48,"dark-pulse"],[50,"embargo"],[54,"nasty-plot"],[60,"defog"],[64,"mirror-move"],[66,"attract"],[72,"brave-bird"]],"g":false,"m":false},"630":{"n":"秃鹰娜","t":["dark","flying"],"s":[110,65,105,55,95,80],"l":[[0,"bone-rush"],[1,"gust"],[1,"leer"],[5,"fury-attack"],[6,"flatter"],[12,"pluck"],[15,"payback"],[15,"thief"],[18,"tailwind"],[23,"feint-attack"],[24,"knock-off"],[28,"punishment"],[30,"dual-wingbeat"],[30,"iron-defense"],[30,"lash-out"],[30,"throat-chop"],[36,"whirlwind"],[42,"air-slash"],[45,"fly"],[45,"foul-play"],[48,"dark-pulse"],[50,"embargo"],[57,"nasty-plot"],[64,"defog"],[64,"mirror-move"],[65,"hurricane"],[72,"attract"],[80,"brave-bird"]],"g":false,"m":false},"631":{"n":"熔蚁兽","t":["fire"],"s":[85,97,66,105,66,65],"l":[[1,"lick"],[1,"tackle"],[5,"fury-swipes"],[6,"odor-sleuth"],[10,"incinerate"],[15,"bug-bite"],[20,"spit-up"],[20,"stockpile"],[20,"swallow"],[25,"slash"],[26,"snatch"],[30,"bind"],[30,"fire-punch"],[31,"flame-burst"],[35,"fire-lash"],[40,"hone-claws"],[45,"amnesia"],[45,"heat-wave"],[50,"fire-spin"],[50,"flamethrower"],[55,"inferno"],[60,"flare-blitz"],[85,"overheat"]],"g":false,"m":false},"632":{"n":"铁蚁","t":["bug","steel"],"s":[58,109,112,48,48,109],"l":[[1,"fury-cutter"],[1,"sand-attack"],[4,"vice-grip"],[8,"metal-claw"],[12,"beat-up"],[16,"bug-bite"],[20,"bite"],[24,"agility"],[28,"dig"],[32,"x-scissor"],[36,"crunch"],[40,"metal-sound"],[44,"iron-head"],[48,"entrainment"],[52,"iron-defense"],[56,"guillotine"]],"g":false,"m":false},"633":{"n":"单首龙","t":["dark","dragon"],"s":[52,65,50,45,50,38],"l":[[1,"dragon-rage"],[1,"focus-energy"],[1,"tackle"],[4,"dragon-breath"],[8,"bite"],[12,"roar"],[15,"dragon-tail"],[16,"assurance"],[20,"headbutt"],[24,"work-up"],[28,"slam"],[32,"crunch"],[36,"scary-face"],[40,"dragon-pulse"],[44,"body-slam"],[48,"hyper-voice"],[52,"dragon-rush"],[56,"nasty-plot"],[60,"outrage"]],"g":false,"m":false},"634":{"n":"双首暴龙","t":["dark","dragon"],"s":[72,85,70,65,70,58],"l":[[1,"dragon-rage"],[1,"focus-energy"],[1,"tackle"],[4,"dragon-breath"],[8,"bite"],[12,"roar"],[15,"dragon-tail"],[16,"assurance"],[20,"headbutt"],[24,"work-up"],[28,"slam"],[30,"lash-out"],[32,"crunch"],[36,"scary-face"],[40,"dragon-pulse"],[44,"body-slam"],[48,"hyper-voice"],[54,"dragon-rush"],[60,"nasty-plot"],[66,"outrage"]],"g":false,"m":false},"635":{"n":"三首恶龙","t":["dark","dragon"],"s":[92,105,90,125,90,98],"l":[[1,"dragon-rage"],[1,"focus-energy"],[1,"tackle"],[4,"dragon-breath"],[8,"bite"],[12,"roar"],[15,"dragon-tail"],[15,"snarl"],[16,"assurance"],[20,"headbutt"],[24,"work-up"],[28,"slam"],[30,"dark-pulse"],[30,"lash-out"],[30,"scale-shot"],[32,"crunch"],[36,"scary-face"],[40,"dragon-pulse"],[44,"body-slam"],[48,"hyper-voice"],[54,"dragon-rush"],[60,"nasty-plot"],[68,"outrage"],[76,"hyper-beam"],[85,"draco-meteor"]],"g":false,"m":false},"636":{"n":"燃烧虫","t":["bug","fire"],"s":[55,85,55,50,55,60],"l":[[1,"ember"],[1,"string-shot"],[6,"flame-charge"],[10,"absorb"],[12,"struggle-bug"],[15,"pounce"],[18,"flame-wheel"],[24,"bug-bite"],[30,"lunge"],[30,"screech"],[30,"u-turn"],[36,"leech-life"],[42,"bug-buzz"],[48,"take-down"],[54,"amnesia"],[60,"double-edge"],[65,"fire-blast"],[66,"flare-blitz"]],"g":false,"m":false},"637":{"n":"火神蛾","t":["bug","fire"],"s":[85,60,65,135,105,100],"l":[[0,"quiver-dance"],[1,"ember"],[1,"string-shot"],[6,"flame-charge"],[10,"absorb"],[12,"struggle-bug"],[15,"incinerate"],[15,"pounce"],[18,"flame-wheel"],[20,"gust"],[24,"bug-bite"],[30,"lunge"],[30,"mystical-fire"],[30,"screech"],[30,"u-turn"],[36,"leech-life"],[40,"whirlwind"],[42,"bug-buzz"],[45,"flamethrower"],[48,"heat-wave"],[48,"take-down"],[54,"amnesia"],[60,"double-edge"],[62,"hurricane"],[66,"flare-blitz"],[70,"fire-blast"],[78,"rage-powder"],[85,"overheat"]],"g":false,"m":false},"638":{"n":"勾帕路翁","t":["steel","fighting"],"s":[91,90,129,90,72,108],"l":[[1,"helping-hand"],[1,"leer"],[1,"quick-attack"],[1,"work-up"],[7,"metal-claw"],[14,"quick-guard"],[15,"revenge"],[15,"reversal"],[21,"double-kick"],[28,"retaliate"],[30,"aura-sphere"],[30,"brick-break"],[30,"flash-cannon"],[30,"smart-strike"],[35,"metal-burst"],[42,"take-down"],[49,"sacred-sword"],[56,"swords-dance"],[63,"iron-head"],[70,"close-combat"]],"g":true,"m":false},"639":{"n":"代拉基翁","t":["rock","fighting"],"s":[91,129,90,72,90,108],"l":[[1,"helping-hand"],[1,"leer"],[1,"quick-attack"],[1,"work-up"],[7,"smack-down"],[14,"quick-guard"],[15,"revenge"],[15,"reversal"],[15,"rock-tomb"],[21,"double-kick"],[28,"retaliate"],[30,"brick-break"],[30,"rock-blast"],[35,"rock-slide"],[42,"take-down"],[49,"sacred-sword"],[56,"swords-dance"],[63,"stone-edge"],[70,"close-combat"]],"g":true,"m":false},"640":{"n":"毕力吉翁","t":["grass","fighting"],"s":[91,90,72,90,129,108],"l":[[1,"helping-hand"],[1,"leer"],[1,"quick-attack"],[1,"work-up"],[7,"magical-leaf"],[14,"quick-guard"],[15,"revenge"],[15,"reversal"],[21,"double-kick"],[28,"retaliate"],[30,"aura-sphere"],[30,"brick-break"],[30,"bullet-seed"],[30,"seed-bomb"],[35,"giga-drain"],[42,"synthesis"],[42,"take-down"],[45,"energy-ball"],[49,"sacred-sword"],[56,"swords-dance"],[63,"leaf-blade"],[70,"close-combat"],[85,"leaf-storm"],[85,"solar-beam"],[85,"solar-blade"]],"g":true,"m":false},"641":{"n":"龙卷云","t":["flying"],"s":[79,115,70,125,80,111],"l":[[1,"astonish"],[1,"gust"],[5,"leer"],[10,"swagger"],[13,"revenge"],[15,"acrobatics"],[15,"aerial-ace"],[15,"bite"],[20,"air-cutter"],[25,"agility"],[30,"tailwind"],[35,"air-slash"],[40,"crunch"],[45,"extrasensory"],[45,"fly"],[50,"uproar"],[55,"hammer-arm"],[60,"rain-dance"],[65,"hurricane"],[67,"dark-pulse"],[70,"thrash"],[77,"bleakwind-storm"]],"g":true,"m":false,"u":641},"642":{"n":"雷电云","t":["electric","flying"],"s":[79,115,70,125,80,111],"l":[[1,"astonish"],[1,"nasty-plot"],[1,"thunder-shock"],[5,"leer"],[10,"swagger"],[13,"revenge"],[15,"acrobatics"],[15,"bite"],[15,"charge-beam"],[15,"electro-ball"],[15,"electroweb"],[15,"sky-drop"],[20,"shock-wave"],[25,"agility"],[25,"heal-block"],[30,"charge"],[30,"thunder-punch"],[35,"volt-switch"],[40,"crunch"],[45,"discharge"],[45,"fly"],[45,"thunderbolt"],[50,"uproar"],[55,"hammer-arm"],[60,"rain-dance"],[65,"thunder"],[67,"dark-pulse"],[70,"thrash"],[75,"wildbolt-storm"]],"g":true,"m":false,"u":642},"643":{"n":"莱希拉姆","t":["dragon","fire"],"s":[100,120,100,150,120,90],"l":[[1,"ancient-power"],[1,"dragon-breath"],[1,"fire-fang"],[1,"noble-roar"],[8,"slash"],[15,"incinerate"],[16,"crunch"],[24,"extrasensory"],[30,"dragon-claw"],[30,"mystical-fire"],[30,"scale-shot"],[32,"dragon-pulse"],[40,"flamethrower"],[45,"heat-wave"],[48,"fusion-flare"],[56,"hyper-voice"],[64,"fire-blast"],[72,"imprison"],[80,"outrage"],[85,"draco-meteor"],[85,"overheat"],[88,"blue-flare"]],"g":true,"m":false},"644":{"n":"捷克罗姆","t":["dragon","electric"],"s":[100,150,120,120,100,90],"l":[[1,"ancient-power"],[1,"dragon-breath"],[1,"noble-roar"],[1,"thunder-fang"],[8,"slash"],[15,"dragon-tail"],[16,"crunch"],[24,"zen-headbutt"],[30,"scale-shot"],[30,"thunder-punch"],[32,"dragon-claw"],[40,"thunderbolt"],[45,"wild-charge"],[48,"fusion-bolt"],[56,"hyper-voice"],[64,"thunder"],[72,"imprison"],[80,"outrage"],[88,"bolt-strike"]],"g":true,"m":false},"645":{"n":"土地云","t":["ground","flying"],"s":[89,125,90,115,80,101],"l":[[1,"mud-shot"],[1,"sand-tomb"],[1,"smack-down"],[5,"leer"],[7,"punishment"],[10,"block"],[15,"bulldoze"],[20,"rock-tomb"],[25,"swords-dance"],[30,"dig"],[30,"imprison"],[30,"scorching-sands"],[30,"stomping-tantrum"],[35,"rock-slide"],[40,"earth-power"],[45,"extrasensory"],[45,"fly"],[50,"stone-edge"],[55,"hammer-arm"],[60,"sandstorm"],[65,"earthquake"],[70,"outrage"],[75,"fissure"],[80,"sandsear-storm"]],"g":true,"m":false,"u":645},"646":{"n":"酋雷姆","t":["dragon","ice"],"s":[125,130,90,130,90,95],"l":[[1,"ancient-power"],[1,"dragon-breath"],[1,"freeze-dry"],[1,"noble-roar"],[8,"slash"],[16,"endeavor"],[24,"dragon-pulse"],[30,"icicle-spear"],[32,"ice-beam"],[40,"hyper-voice"],[48,"scary-face"],[56,"blizzard"],[64,"imprison"],[72,"outrage"],[80,"glaciate"],[85,"draco-meteor"],[88,"sheer-cold"]],"g":true,"m":false,"u":646},"647":{"n":"凯路迪欧","t":["water","fighting"],"s":[91,72,90,129,90,108],"l":[[1,"aqua-jet"],[1,"helping-hand"],[1,"leer"],[1,"secret-sword"],[1,"work-up"],[7,"bubble-beam"],[14,"quick-guard"],[21,"double-kick"],[28,"retaliate"],[30,"scald"],[35,"aqua-tail"],[42,"take-down"],[45,"surf"],[49,"sacred-sword"],[56,"swords-dance"],[63,"hydro-pump"],[70,"close-combat"],[85,"focus-blast"]],"g":false,"m":true},"648":{"n":"美洛耶塔","t":["normal","psychic"],"s":[100,77,77,128,128,90],"l":[[1,"confusion"],[1,"quick-attack"],[1,"round"],[1,"sing"],[21,"teeter-dance"],[26,"acrobatics"],[30,"psyshock"],[30,"tera-blast"],[31,"psybeam"],[36,"echoed-voice"],[43,"u-turn"],[50,"relic-song"],[50,"wake-up-slap"],[57,"psychic"],[64,"hyper-voice"],[71,"role-play"],[78,"close-combat"],[85,"perish-song"]],"g":false,"m":true,"u":648},"649":{"n":"盖诺赛克特","t":["bug","steel"],"s":[71,120,95,120,95,99],"l":[[1,"fury-cutter"],[1,"quick-attack"],[7,"screech"],[14,"metal-claw"],[15,"struggle-bug"],[21,"fell-stinger"],[22,"magnet-bomb"],[28,"flame-charge"],[29,"slash"],[30,"flash-cannon"],[30,"leech-life"],[30,"u-turn"],[35,"metal-sound"],[40,"signal-beam"],[42,"x-scissor"],[44,"tri-attack"],[49,"magnet-rise"],[56,"bug-buzz"],[63,"simple-beam"],[70,"zap-cannon"],[73,"hyper-beam"],[77,"lock-on"],[84,"techno-blast"],[91,"self-destruct"]],"g":false,"m":true,"u":649},"20101":{"n":"未知图腾 B","t":["psychic"],"s":[48,72,48,72,48,48],"l":[[1,"hidden-power"]],"g":false,"m":false,"d":"201-B"},"20102":{"n":"未知图腾 C","t":["psychic"],"s":[48,72,48,72,48,48],"l":[[1,"hidden-power"]],"g":false,"m":false,"d":"201-C"},"20103":{"n":"未知图腾 D","t":["psychic"],"s":[48,72,48,72,48,48],"l":[[1,"hidden-power"]],"g":false,"m":false,"d":"201-D"},"20104":{"n":"未知图腾 E","t":["psychic"],"s":[48,72,48,72,48,48],"l":[[1,"hidden-power"]],"g":false,"m":false,"d":"201-E"},"20105":{"n":"未知图腾 F","t":["psychic"],"s":[48,72,48,72,48,48],"l":[[1,"hidden-power"]],"g":false,"m":false,"d":"201-F"},"20106":{"n":"未知图腾 G","t":["psychic"],"s":[48,72,48,72,48,48],"l":[[1,"hidden-power"]],"g":false,"m":false,"d":"201-G"},"20107":{"n":"未知图腾 H","t":["psychic"],"s":[48,72,48,72,48,48],"l":[[1,"hidden-power"]],"g":false,"m":false,"d":"201-H"},"20108":{"n":"未知图腾 I","t":["psychic"],"s":[48,72,48,72,48,48],"l":[[1,"hidden-power"]],"g":false,"m":false,"d":"201-I"},"20109":{"n":"未知图腾 J","t":["psychic"],"s":[48,72,48,72,48,48],"l":[[1,"hidden-power"]],"g":false,"m":false,"d":"201-J"},"20110":{"n":"未知图腾 K","t":["psychic"],"s":[48,72,48,72,48,48],"l":[[1,"hidden-power"]],"g":false,"m":false,"d":"201-K"},"20111":{"n":"未知图腾 L","t":["psychic"],"s":[48,72,48,72,48,48],"l":[[1,"hidden-power"]],"g":false,"m":false,"d":"201-L"},"20112":{"n":"未知图腾 M","t":["psychic"],"s":[48,72,48,72,48,48],"l":[[1,"hidden-power"]],"g":false,"m":false,"d":"201-M"},"20113":{"n":"未知图腾 N","t":["psychic"],"s":[48,72,48,72,48,48],"l":[[1,"hidden-power"]],"g":false,"m":false,"d":"201-N"},"20114":{"n":"未知图腾 O","t":["psychic"],"s":[48,72,48,72,48,48],"l":[[1,"hidden-power"]],"g":false,"m":false,"d":"201-O"},"20115":{"n":"未知图腾 P","t":["psychic"],"s":[48,72,48,72,48,48],"l":[[1,"hidden-power"]],"g":false,"m":false,"d":"201-P"},"20116":{"n":"未知图腾 Q","t":["psychic"],"s":[48,72,48,72,48,48],"l":[[1,"hidden-power"]],"g":false,"m":false,"d":"201-Q"},"20117":{"n":"未知图腾 R","t":["psychic"],"s":[48,72,48,72,48,48],"l":[[1,"hidden-power"]],"g":false,"m":false,"d":"201-R"},"20118":{"n":"未知图腾 S","t":["psychic"],"s":[48,72,48,72,48,48],"l":[[1,"hidden-power"]],"g":false,"m":false,"d":"201-S"},"20119":{"n":"未知图腾 T","t":["psychic"],"s":[48,72,48,72,48,48],"l":[[1,"hidden-power"]],"g":false,"m":false,"d":"201-T"},"20120":{"n":"未知图腾 U","t":["psychic"],"s":[48,72,48,72,48,48],"l":[[1,"hidden-power"]],"g":false,"m":false,"d":"201-U"},"20121":{"n":"未知图腾 V","t":["psychic"],"s":[48,72,48,72,48,48],"l":[[1,"hidden-power"]],"g":false,"m":false,"d":"201-V"},"20122":{"n":"未知图腾 W","t":["psychic"],"s":[48,72,48,72,48,48],"l":[[1,"hidden-power"]],"g":false,"m":false,"d":"201-W"},"20123":{"n":"未知图腾 X","t":["psychic"],"s":[48,72,48,72,48,48],"l":[[1,"hidden-power"]],"g":false,"m":false,"d":"201-X"},"20124":{"n":"未知图腾 Y","t":["psychic"],"s":[48,72,48,72,48,48],"l":[[1,"hidden-power"]],"g":false,"m":false,"d":"201-Y"},"20125":{"n":"未知图腾 Z","t":["psychic"],"s":[48,72,48,72,48,48],"l":[[1,"hidden-power"]],"g":false,"m":false,"d":"201-Z"},"20126":{"n":"未知图腾 !","t":["psychic"],"s":[48,72,48,72,48,48],"l":[[1,"hidden-power"]],"g":false,"m":false,"d":"201-!"},"20127":{"n":"未知图腾 ?","t":["psychic"],"s":[48,72,48,72,48,48],"l":[[1,"hidden-power"]],"g":false,"m":false,"d":"201-?"},"35101":{"n":"飘浮泡泡 (太阳的样子)","t":["fire"],"s":[70,70,70,70,70,70],"l":[[1,"tackle"],[10,"ember"],[10,"powder-snow"],[10,"water-gun"],[15,"headbutt"],[20,"hail"],[20,"rain-dance"],[20,"sunny-day"],[25,"weather-ball"],[35,"blizzard"],[35,"fire-blast"],[35,"hydro-pump"],[45,"hurricane"]],"g":false,"m":false,"d":"351-A"},"35102":{"n":"飘浮泡泡 (雨水的样子)","t":["water"],"s":[70,70,70,70,70,70],"l":[[1,"tackle"],[10,"ember"],[10,"powder-snow"],[10,"water-gun"],[15,"headbutt"],[20,"hail"],[20,"rain-dance"],[20,"sunny-day"],[25,"weather-ball"],[35,"blizzard"],[35,"fire-blast"],[35,"hydro-pump"],[45,"hurricane"]],"g":false,"m":false,"d":"351-B"},"35103":{"n":"飘浮泡泡 (雪云的样子)","t":["ice"],"s":[70,70,70,70,70,70],"l":[[1,"tackle"],[10,"ember"],[10,"powder-snow"],[10,"water-gun"],[15,"headbutt"],[20,"hail"],[20,"rain-dance"],[20,"sunny-day"],[25,"weather-ball"],[35,"blizzard"],[35,"fire-blast"],[35,"hydro-pump"],[45,"hurricane"]],"g":false,"m":false,"d":"351-C"},"38601":{"n":"代欧奇希斯 (攻击形态)","t":["psychic"],"s":[50,180,20,180,20,150],"l":[[1,"leer"],[1,"wrap"],[7,"night-shade"],[13,"teleport"],[15,"psybeam"],[15,"stored-power"],[19,"knock-off"],[25,"psyshock"],[31,"psychic"],[37,"gravity"],[37,"snatch"],[43,"psycho-shift"],[43,"skill-swap"],[49,"zen-headbutt"],[55,"cosmic-power"],[61,"recover"],[67,"psycho-boost"],[73,"hyper-beam"]],"g":false,"m":true,"u":386,"d":"386-A"},"38602":{"n":"代欧奇希斯 (防御形态)","t":["psychic"],"s":[50,70,160,70,160,90],"l":[[1,"leer"],[1,"wrap"],[7,"night-shade"],[13,"teleport"],[15,"psybeam"],[15,"stored-power"],[19,"knock-off"],[25,"psyshock"],[31,"psychic"],[37,"gravity"],[37,"snatch"],[43,"psycho-shift"],[43,"skill-swap"],[49,"zen-headbutt"],[55,"cosmic-power"],[61,"recover"],[67,"psycho-boost"],[73,"hyper-beam"]],"g":false,"m":true,"u":386,"d":"386-B"},"38603":{"n":"代欧奇希斯 (速度形态)","t":["psychic"],"s":[50,95,90,95,90,180],"l":[[1,"leer"],[1,"wrap"],[7,"night-shade"],[13,"teleport"],[15,"psybeam"],[15,"stored-power"],[19,"knock-off"],[25,"psyshock"],[31,"psychic"],[37,"gravity"],[37,"snatch"],[43,"psycho-shift"],[43,"skill-swap"],[49,"zen-headbutt"],[55,"cosmic-power"],[61,"recover"],[67,"psycho-boost"],[73,"hyper-beam"]],"g":false,"m":true,"u":386,"d":"386-C"},"41201":{"n":"结草儿 (砂土蓑衣)","t":["bug"],"s":[40,29,45,29,45,36],"l":[[1,"protect"],[10,"tackle"],[15,"bug-bite"],[20,"hidden-power"],[20,"string-shot"]],"g":false,"m":false,"d":"412-A"},"41202":{"n":"结草儿 (垃圾蓑衣)","t":["bug"],"s":[40,29,45,29,45,36],"l":[[1,"protect"],[10,"tackle"],[15,"bug-bite"],[20,"hidden-power"],[20,"string-shot"]],"g":false,"m":false,"d":"412-B"},"41301":{"n":"结草贵妇 (砂土蓑衣)","t":["bug","ground"],"s":[60,79,105,59,85,36],"l":[[0,"quiver-dance"],[1,"protect"],[10,"tackle"],[15,"bug-bite"],[15,"grass-knot"],[15,"struggle-bug"],[20,"hidden-power"],[20,"string-shot"],[23,"confusion"],[26,"razor-leaf"],[29,"growth"],[30,"giga-drain"],[32,"psybeam"],[35,"captivate"],[35,"infestation"],[38,"flail"],[41,"attract"],[44,"psychic"],[45,"energy-ball"],[47,"leaf-storm"],[50,"bug-buzz"]],"g":false,"m":false,"d":"413-A"},"41302":{"n":"结草贵妇 (垃圾蓑衣)","t":["bug","steel"],"s":[60,69,95,69,95,36],"l":[[0,"quiver-dance"],[1,"protect"],[10,"tackle"],[15,"bug-bite"],[15,"grass-knot"],[15,"struggle-bug"],[20,"hidden-power"],[20,"string-shot"],[23,"confusion"],[26,"razor-leaf"],[29,"growth"],[30,"giga-drain"],[32,"psybeam"],[35,"captivate"],[35,"infestation"],[38,"flail"],[41,"attract"],[44,"psychic"],[45,"energy-ball"],[47,"leaf-storm"],[50,"bug-buzz"]],"g":false,"m":false,"d":"413-B"},"42201":{"n":"无壳海兔 (东海)","t":["water"],"s":[76,48,48,57,62,34],"l":[[1,"mud-slap"],[1,"water-gun"],[2,"mud-sport"],[5,"harden"],[10,"recover"],[11,"mud-bomb"],[15,"brine"],[15,"water-pulse"],[16,"hidden-power"],[20,"ancient-power"],[25,"body-slam"],[30,"scald"],[30,"waterfall"],[31,"muddy-water"],[35,"earth-power"],[40,"rain-dance"],[45,"memento"],[65,"hydro-pump"]],"g":false,"m":false,"d":"422-A"},"42301":{"n":"海兔兽 (东海)","t":["water","ground"],"s":[111,83,68,92,82,39],"l":[[1,"mud-slap"],[1,"water-gun"],[2,"mud-sport"],[5,"harden"],[10,"recover"],[11,"mud-bomb"],[15,"brine"],[15,"water-pulse"],[16,"hidden-power"],[20,"ancient-power"],[25,"body-slam"],[30,"dig"],[30,"scald"],[30,"stomping-tantrum"],[30,"waterfall"],[33,"muddy-water"],[39,"earth-power"],[46,"rain-dance"],[53,"memento"],[65,"earthquake"],[65,"hydro-pump"]],"g":false,"m":false,"d":"423-A"},"47901":{"n":"洛托姆 (加热形态)","t":["electric","fire"],"s":[50,65,107,105,107,86],"l":[[1,"astonish"],[1,"double-team"],[5,"thunder-shock"],[10,"confuse-ray"],[15,"charge"],[15,"charge-beam"],[15,"electroweb"],[15,"night-shade"],[20,"electro-ball"],[25,"thunder-wave"],[29,"ominous-wind"],[30,"shadow-ball"],[30,"shock-wave"],[30,"volt-switch"],[35,"hex"],[40,"substitute"],[45,"thunderbolt"],[45,"trick"],[50,"discharge"],[55,"uproar"],[65,"thunder"],[50,"overheat"]],"g":false,"m":false,"u":479,"d":"479-A"},"47902":{"n":"洛托姆 (清洗形态)","t":["electric","water"],"s":[50,65,107,105,107,86],"l":[[1,"astonish"],[1,"double-team"],[5,"thunder-shock"],[10,"confuse-ray"],[15,"charge"],[15,"charge-beam"],[15,"electroweb"],[15,"night-shade"],[20,"electro-ball"],[25,"thunder-wave"],[29,"ominous-wind"],[30,"shadow-ball"],[30,"shock-wave"],[30,"volt-switch"],[35,"hex"],[40,"substitute"],[45,"thunderbolt"],[45,"trick"],[50,"discharge"],[55,"uproar"],[65,"thunder"],[50,"hydro-pump"]],"g":false,"m":false,"u":479,"d":"479-B"},"47903":{"n":"洛托姆 (结冰形态)","t":["electric","ice"],"s":[50,65,107,105,107,86],"l":[[1,"astonish"],[1,"double-team"],[5,"thunder-shock"],[10,"confuse-ray"],[15,"charge"],[15,"charge-beam"],[15,"electroweb"],[15,"night-shade"],[20,"electro-ball"],[25,"thunder-wave"],[29,"ominous-wind"],[30,"shadow-ball"],[30,"shock-wave"],[30,"volt-switch"],[35,"hex"],[40,"substitute"],[45,"thunderbolt"],[45,"trick"],[50,"discharge"],[55,"uproar"],[65,"thunder"],[50,"blizzard"]],"g":false,"m":false,"u":479,"d":"479-C"},"47904":{"n":"洛托姆 (旋转形态)","t":["electric","flying"],"s":[50,65,107,105,107,86],"l":[[1,"astonish"],[1,"double-team"],[5,"thunder-shock"],[10,"confuse-ray"],[15,"charge"],[15,"charge-beam"],[15,"electroweb"],[15,"night-shade"],[20,"electro-ball"],[25,"thunder-wave"],[29,"ominous-wind"],[30,"shadow-ball"],[30,"shock-wave"],[30,"volt-switch"],[35,"hex"],[40,"substitute"],[45,"thunderbolt"],[45,"trick"],[50,"discharge"],[55,"uproar"],[65,"thunder"],[50,"air-slash"]],"g":false,"m":false,"u":479,"d":"479-D"},"47905":{"n":"洛托姆 (切割形态)","t":["electric","grass"],"s":[50,65,107,105,107,86],"l":[[1,"astonish"],[1,"double-team"],[5,"thunder-shock"],[10,"confuse-ray"],[15,"charge"],[15,"charge-beam"],[15,"electroweb"],[15,"night-shade"],[20,"electro-ball"],[25,"thunder-wave"],[29,"ominous-wind"],[30,"shadow-ball"],[30,"shock-wave"],[30,"volt-switch"],[35,"hex"],[40,"substitute"],[45,"thunderbolt"],[45,"trick"],[50,"discharge"],[55,"uproar"],[65,"thunder"],[50,"leaf-storm"]],"g":false,"m":false,"u":479,"d":"479-E"},"48701":{"n":"骑拉帝纳 (起源形态)","t":["ghost","dragon"],"s":[150,120,100,120,100,90],"l":[[1,"defog"],[1,"shadow-sneak"],[6,"ominous-wind"],[7,"dragon-breath"],[14,"ancient-power"],[21,"hex"],[28,"slash"],[30,"shadow-ball"],[35,"scary-face"],[42,"shadow-claw"],[45,"dragon-pulse"],[45,"phantom-force"],[49,"pain-split"],[50,"heal-block"],[56,"aura-sphere"],[63,"dragon-claw"],[65,"poltergeist"],[70,"earth-power"],[77,"shadow-force"],[84,"destiny-bond"],[85,"draco-meteor"],[85,"outrage"]],"g":true,"m":false,"u":487,"d":"487-A"},"49201":{"n":"谢米 (天空形态)","t":["grass","flying"],"s":[100,103,75,120,75,127],"l":[[1,"defense-curl"],[1,"growth"],[10,"magical-leaf"],[19,"leech-seed"],[28,"synthesis"],[30,"bullet-seed"],[30,"giga-drain"],[30,"seed-bomb"],[37,"sweet-scent"],[45,"petal-blizzard"],[46,"natural-gift"],[46,"play-rough"],[55,"worry-seed"],[64,"aromatherapy"],[64,"grassy-terrain"],[73,"energy-ball"],[82,"grass-whistle"],[82,"sweet-kiss"],[85,"leaf-storm"],[85,"solar-beam"],[91,"healing-wish"],[91,"lucky-chant"],[100,"seed-flare"],[50,"air-slash"]],"g":false,"m":true,"u":492,"d":"492-A"},"49301":{"n":"阿尔宙斯 (火)","t":["fire"],"s":[120,120,120,120,120,120],"l":[[1,"cosmic-power"],[1,"natural-gift"],[1,"punishment"],[1,"seismic-toss"],[10,"gravity"],[15,"cut"],[15,"echoed-voice"],[15,"swift"],[20,"earth-power"],[30,"hyper-voice"],[40,"extreme-speed"],[50,"healing-wish"],[50,"refresh"],[60,"future-sight"],[70,"recover"],[80,"hyper-beam"],[90,"perish-song"],[100,"judgment"]],"g":false,"m":true,"u":493,"d":"493-A"},"49302":{"n":"阿尔宙斯 (水)","t":["water"],"s":[120,120,120,120,120,120],"l":[[1,"cosmic-power"],[1,"natural-gift"],[1,"punishment"],[1,"seismic-toss"],[10,"gravity"],[15,"cut"],[15,"echoed-voice"],[15,"swift"],[20,"earth-power"],[30,"hyper-voice"],[40,"extreme-speed"],[50,"healing-wish"],[50,"refresh"],[60,"future-sight"],[70,"recover"],[80,"hyper-beam"],[90,"perish-song"],[100,"judgment"]],"g":false,"m":true,"u":493,"d":"493-B"},"49303":{"n":"阿尔宙斯 (草)","t":["grass"],"s":[120,120,120,120,120,120],"l":[[1,"cosmic-power"],[1,"natural-gift"],[1,"punishment"],[1,"seismic-toss"],[10,"gravity"],[15,"cut"],[15,"echoed-voice"],[15,"swift"],[20,"earth-power"],[30,"hyper-voice"],[40,"extreme-speed"],[50,"healing-wish"],[50,"refresh"],[60,"future-sight"],[70,"recover"],[80,"hyper-beam"],[90,"perish-song"],[100,"judgment"]],"g":false,"m":true,"u":493,"d":"493-C"},"49304":{"n":"阿尔宙斯 (电)","t":["electric"],"s":[120,120,120,120,120,120],"l":[[1,"cosmic-power"],[1,"natural-gift"],[1,"punishment"],[1,"seismic-toss"],[10,"gravity"],[15,"cut"],[15,"echoed-voice"],[15,"swift"],[20,"earth-power"],[30,"hyper-voice"],[40,"extreme-speed"],[50,"healing-wish"],[50,"refresh"],[60,"future-sight"],[70,"recover"],[80,"hyper-beam"],[90,"perish-song"],[100,"judgment"]],"g":false,"m":true,"u":493,"d":"493-D"},"49305":{"n":"阿尔宙斯 (冰)","t":["ice"],"s":[120,120,120,120,120,120],"l":[[1,"cosmic-power"],[1,"natural-gift"],[1,"punishment"],[1,"seismic-toss"],[10,"gravity"],[15,"cut"],[15,"echoed-voice"],[15,"swift"],[20,"earth-power"],[30,"hyper-voice"],[40,"extreme-speed"],[50,"healing-wish"],[50,"refresh"],[60,"future-sight"],[70,"recover"],[80,"hyper-beam"],[90,"perish-song"],[100,"judgment"]],"g":false,"m":true,"u":493,"d":"493-E"},"49306":{"n":"阿尔宙斯 (格斗)","t":["fighting"],"s":[120,120,120,120,120,120],"l":[[1,"cosmic-power"],[1,"natural-gift"],[1,"punishment"],[1,"seismic-toss"],[10,"gravity"],[15,"cut"],[15,"echoed-voice"],[15,"swift"],[20,"earth-power"],[30,"hyper-voice"],[40,"extreme-speed"],[50,"healing-wish"],[50,"refresh"],[60,"future-sight"],[70,"recover"],[80,"hyper-beam"],[90,"perish-song"],[100,"judgment"]],"g":false,"m":true,"u":493,"d":"493-F"},"49307":{"n":"阿尔宙斯 (中毒)","t":["poison"],"s":[120,120,120,120,120,120],"l":[[1,"cosmic-power"],[1,"natural-gift"],[1,"punishment"],[1,"seismic-toss"],[10,"gravity"],[15,"cut"],[15,"echoed-voice"],[15,"swift"],[20,"earth-power"],[30,"hyper-voice"],[40,"extreme-speed"],[50,"healing-wish"],[50,"refresh"],[60,"future-sight"],[70,"recover"],[80,"hyper-beam"],[90,"perish-song"],[100,"judgment"]],"g":false,"m":true,"u":493,"d":"493-G"},"49308":{"n":"阿尔宙斯 (地面)","t":["ground"],"s":[120,120,120,120,120,120],"l":[[1,"cosmic-power"],[1,"natural-gift"],[1,"punishment"],[1,"seismic-toss"],[10,"gravity"],[15,"cut"],[15,"echoed-voice"],[15,"swift"],[20,"earth-power"],[30,"hyper-voice"],[40,"extreme-speed"],[50,"healing-wish"],[50,"refresh"],[60,"future-sight"],[70,"recover"],[80,"hyper-beam"],[90,"perish-song"],[100,"judgment"]],"g":false,"m":true,"u":493,"d":"493-H"},"49309":{"n":"阿尔宙斯 (飞行)","t":["flying"],"s":[120,120,120,120,120,120],"l":[[1,"cosmic-power"],[1,"natural-gift"],[1,"punishment"],[1,"seismic-toss"],[10,"gravity"],[15,"cut"],[15,"echoed-voice"],[15,"swift"],[20,"earth-power"],[30,"hyper-voice"],[40,"extreme-speed"],[50,"healing-wish"],[50,"refresh"],[60,"future-sight"],[70,"recover"],[80,"hyper-beam"],[90,"perish-song"],[100,"judgment"]],"g":false,"m":true,"u":493,"d":"493-I"},"49310":{"n":"阿尔宙斯 (超能力)","t":["psychic"],"s":[120,120,120,120,120,120],"l":[[1,"cosmic-power"],[1,"natural-gift"],[1,"punishment"],[1,"seismic-toss"],[10,"gravity"],[15,"cut"],[15,"echoed-voice"],[15,"swift"],[20,"earth-power"],[30,"hyper-voice"],[40,"extreme-speed"],[50,"healing-wish"],[50,"refresh"],[60,"future-sight"],[70,"recover"],[80,"hyper-beam"],[90,"perish-song"],[100,"judgment"]],"g":false,"m":true,"u":493,"d":"493-J"},"49311":{"n":"阿尔宙斯 (虫)","t":["bug"],"s":[120,120,120,120,120,120],"l":[[1,"cosmic-power"],[1,"natural-gift"],[1,"punishment"],[1,"seismic-toss"],[10,"gravity"],[15,"cut"],[15,"echoed-voice"],[15,"swift"],[20,"earth-power"],[30,"hyper-voice"],[40,"extreme-speed"],[50,"healing-wish"],[50,"refresh"],[60,"future-sight"],[70,"recover"],[80,"hyper-beam"],[90,"perish-song"],[100,"judgment"]],"g":false,"m":true,"u":493,"d":"493-K"},"49312":{"n":"阿尔宙斯 (灰色)","t":["rock"],"s":[120,120,120,120,120,120],"l":[[1,"cosmic-power"],[1,"natural-gift"],[1,"punishment"],[1,"seismic-toss"],[10,"gravity"],[15,"cut"],[15,"echoed-voice"],[15,"swift"],[20,"earth-power"],[30,"hyper-voice"],[40,"extreme-speed"],[50,"healing-wish"],[50,"refresh"],[60,"future-sight"],[70,"recover"],[80,"hyper-beam"],[90,"perish-song"],[100,"judgment"]],"g":false,"m":true,"u":493,"d":"493-L"},"49313":{"n":"阿尔宙斯 (幽灵)","t":["ghost"],"s":[120,120,120,120,120,120],"l":[[1,"cosmic-power"],[1,"natural-gift"],[1,"punishment"],[1,"seismic-toss"],[10,"gravity"],[15,"cut"],[15,"echoed-voice"],[15,"swift"],[20,"earth-power"],[30,"hyper-voice"],[40,"extreme-speed"],[50,"healing-wish"],[50,"refresh"],[60,"future-sight"],[70,"recover"],[80,"hyper-beam"],[90,"perish-song"],[100,"judgment"]],"g":false,"m":true,"u":493,"d":"493-M"},"49314":{"n":"阿尔宙斯 (龙)","t":["dragon"],"s":[120,120,120,120,120,120],"l":[[1,"cosmic-power"],[1,"natural-gift"],[1,"punishment"],[1,"seismic-toss"],[10,"gravity"],[15,"cut"],[15,"echoed-voice"],[15,"swift"],[20,"earth-power"],[30,"hyper-voice"],[40,"extreme-speed"],[50,"healing-wish"],[50,"refresh"],[60,"future-sight"],[70,"recover"],[80,"hyper-beam"],[90,"perish-song"],[100,"judgment"]],"g":false,"m":true,"u":493,"d":"493-N"},"49315":{"n":"阿尔宙斯 (恶)","t":["dark"],"s":[120,120,120,120,120,120],"l":[[1,"cosmic-power"],[1,"natural-gift"],[1,"punishment"],[1,"seismic-toss"],[10,"gravity"],[15,"cut"],[15,"echoed-voice"],[15,"swift"],[20,"earth-power"],[30,"hyper-voice"],[40,"extreme-speed"],[50,"healing-wish"],[50,"refresh"],[60,"future-sight"],[70,"recover"],[80,"hyper-beam"],[90,"perish-song"],[100,"judgment"]],"g":false,"m":true,"u":493,"d":"493-O"},"49316":{"n":"阿尔宙斯 (钢)","t":["steel"],"s":[120,120,120,120,120,120],"l":[[1,"cosmic-power"],[1,"natural-gift"],[1,"punishment"],[1,"seismic-toss"],[10,"gravity"],[15,"cut"],[15,"echoed-voice"],[15,"swift"],[20,"earth-power"],[30,"hyper-voice"],[40,"extreme-speed"],[50,"healing-wish"],[50,"refresh"],[60,"future-sight"],[70,"recover"],[80,"hyper-beam"],[90,"perish-song"],[100,"judgment"]],"g":false,"m":true,"u":493,"d":"493-P"},"64101":{"n":"龙卷云 (灵兽形态)","t":["flying"],"s":[79,100,80,110,90,121],"l":[[1,"astonish"],[1,"gust"],[5,"leer"],[10,"swagger"],[13,"revenge"],[15,"acrobatics"],[15,"aerial-ace"],[15,"bite"],[20,"air-cutter"],[25,"agility"],[30,"tailwind"],[35,"air-slash"],[40,"crunch"],[45,"extrasensory"],[45,"fly"],[50,"uproar"],[55,"hammer-arm"],[60,"rain-dance"],[65,"hurricane"],[67,"dark-pulse"],[70,"thrash"],[77,"bleakwind-storm"]],"g":true,"m":false,"u":641,"d":"641-A"},"64201":{"n":"雷电云 (灵兽形态)","t":["electric","flying"],"s":[79,105,70,145,80,101],"l":[[1,"astonish"],[1,"nasty-plot"],[1,"thunder-shock"],[5,"leer"],[10,"swagger"],[13,"revenge"],[15,"acrobatics"],[15,"bite"],[15,"charge-beam"],[15,"electro-ball"],[15,"electroweb"],[15,"sky-drop"],[20,"shock-wave"],[25,"agility"],[25,"heal-block"],[30,"charge"],[30,"thunder-punch"],[35,"volt-switch"],[40,"crunch"],[45,"discharge"],[45,"fly"],[45,"thunderbolt"],[50,"uproar"],[55,"hammer-arm"],[60,"rain-dance"],[65,"thunder"],[67,"dark-pulse"],[70,"thrash"],[75,"wildbolt-storm"]],"g":true,"m":false,"u":642,"d":"642-A"},"64501":{"n":"土地云 (灵兽形态)","t":["ground","flying"],"s":[89,145,90,105,80,91],"l":[[1,"mud-shot"],[1,"sand-tomb"],[1,"smack-down"],[5,"leer"],[7,"punishment"],[10,"block"],[15,"bulldoze"],[20,"rock-tomb"],[25,"swords-dance"],[30,"dig"],[30,"imprison"],[30,"scorching-sands"],[30,"stomping-tantrum"],[35,"rock-slide"],[40,"earth-power"],[45,"extrasensory"],[45,"fly"],[50,"stone-edge"],[55,"hammer-arm"],[60,"sandstorm"],[65,"earthquake"],[70,"outrage"],[75,"fissure"],[80,"sandsear-storm"]],"g":true,"m":false,"u":645,"d":"645-A"},"64601":{"n":"酋雷姆 (暗黑酋雷姆)","t":["dragon","ice"],"s":[125,170,100,120,90,95],"l":[[1,"ancient-power"],[1,"dragon-breath"],[1,"freeze-dry"],[1,"noble-roar"],[8,"slash"],[16,"endeavor"],[24,"dragon-pulse"],[30,"icicle-spear"],[32,"ice-beam"],[40,"hyper-voice"],[48,"scary-face"],[56,"blizzard"],[64,"imprison"],[72,"outrage"],[80,"glaciate"],[85,"draco-meteor"],[88,"sheer-cold"],[50,"freeze-shock"],[50,"fusion-bolt"]],"g":true,"m":false,"u":646,"d":"646-A"},"64602":{"n":"酋雷姆 (焰白酋雷姆)","t":["dragon","ice"],"s":[125,120,90,170,100,95],"l":[[1,"ancient-power"],[1,"dragon-breath"],[1,"freeze-dry"],[1,"noble-roar"],[8,"slash"],[16,"endeavor"],[24,"dragon-pulse"],[30,"icicle-spear"],[32,"ice-beam"],[40,"hyper-voice"],[48,"scary-face"],[56,"blizzard"],[64,"imprison"],[72,"outrage"],[80,"glaciate"],[85,"draco-meteor"],[88,"sheer-cold"],[50,"ice-burn"],[50,"fusion-flare"]],"g":true,"m":false,"u":646,"d":"646-B"},"64801":{"n":"美洛耶塔 (舞步形态)","t":["normal","fighting"],"s":[100,128,90,77,77,128],"l":[[1,"confusion"],[1,"quick-attack"],[1,"round"],[1,"sing"],[21,"teeter-dance"],[26,"acrobatics"],[30,"psyshock"],[30,"tera-blast"],[31,"psybeam"],[36,"echoed-voice"],[43,"u-turn"],[50,"relic-song"],[50,"wake-up-slap"],[57,"psychic"],[64,"hyper-voice"],[71,"role-play"],[78,"close-combat"],[85,"perish-song"]],"g":false,"m":true,"u":648,"d":"648-A"},"64901":{"n":"盖诺赛克特 (水流卡带)","t":["bug","steel"],"s":[71,120,95,120,95,99],"l":[[1,"fury-cutter"],[1,"quick-attack"],[7,"screech"],[14,"metal-claw"],[15,"struggle-bug"],[21,"fell-stinger"],[22,"magnet-bomb"],[28,"flame-charge"],[29,"slash"],[30,"flash-cannon"],[30,"leech-life"],[30,"u-turn"],[35,"metal-sound"],[40,"signal-beam"],[42,"x-scissor"],[44,"tri-attack"],[49,"magnet-rise"],[56,"bug-buzz"],[63,"simple-beam"],[70,"zap-cannon"],[73,"hyper-beam"],[77,"lock-on"],[84,"techno-blast"],[91,"self-destruct"]],"g":false,"m":true,"u":649,"d":"649-A"},"64902":{"n":"盖诺赛克特 (闪电卡带)","t":["bug","steel"],"s":[71,120,95,120,95,99],"l":[[1,"fury-cutter"],[1,"quick-attack"],[7,"screech"],[14,"metal-claw"],[15,"struggle-bug"],[21,"fell-stinger"],[22,"magnet-bomb"],[28,"flame-charge"],[29,"slash"],[30,"flash-cannon"],[30,"leech-life"],[30,"u-turn"],[35,"metal-sound"],[40,"signal-beam"],[42,"x-scissor"],[44,"tri-attack"],[49,"magnet-rise"],[56,"bug-buzz"],[63,"simple-beam"],[70,"zap-cannon"],[73,"hyper-beam"],[77,"lock-on"],[84,"techno-blast"],[91,"self-destruct"]],"g":false,"m":true,"u":649,"d":"649-B"},"64903":{"n":"盖诺赛克特 (火焰卡带)","t":["bug","steel"],"s":[71,120,95,120,95,99],"l":[[1,"fury-cutter"],[1,"quick-attack"],[7,"screech"],[14,"metal-claw"],[15,"struggle-bug"],[21,"fell-stinger"],[22,"magnet-bomb"],[28,"flame-charge"],[29,"slash"],[30,"flash-cannon"],[30,"leech-life"],[30,"u-turn"],[35,"metal-sound"],[40,"signal-beam"],[42,"x-scissor"],[44,"tri-attack"],[49,"magnet-rise"],[56,"bug-buzz"],[63,"simple-beam"],[70,"zap-cannon"],[73,"hyper-beam"],[77,"lock-on"],[84,"techno-blast"],[91,"self-destruct"]],"g":false,"m":true,"u":649,"d":"649-C"},"64904":{"n":"盖诺赛克特 (冰冻卡带)","t":["bug","steel"],"s":[71,120,95,120,95,99],"l":[[1,"fury-cutter"],[1,"quick-attack"],[7,"screech"],[14,"metal-claw"],[15,"struggle-bug"],[21,"fell-stinger"],[22,"magnet-bomb"],[28,"flame-charge"],[29,"slash"],[30,"flash-cannon"],[30,"leech-life"],[30,"u-turn"],[35,"metal-sound"],[40,"signal-beam"],[42,"x-scissor"],[44,"tri-attack"],[49,"magnet-rise"],[56,"bug-buzz"],[63,"simple-beam"],[70,"zap-cannon"],[73,"hyper-beam"],[77,"lock-on"],[84,"techno-blast"],[91,"self-destruct"]],"g":false,"m":true,"u":649,"d":"649-D"}},"moves":{"flame-charge":["fire",50,100,"phys"],"focus-energy":["normal",0,100,"status"],"inferno":["fire",100,50,"spec"],"confusion":["psychic",50,100,"spec"],"work-up":["normal",0,100,"status"],"stored-power":["psychic",20,100,"spec"],"zen-headbutt":["psychic",80,90,"phys"],"quick-attack":["normal",40,100,"phys"],"incinerate":["fire",60,100,"spec"],"endure":["normal",0,100,"status"],"headbutt":["normal",70,100,"phys"],"reversal":["fighting",0,100,"phys"],"double-edge":["normal",120,100,"phys"],"final-gambit":["fighting",0,100,"spec"],"vine-whip":["grass",45,100,"phys"],"growth":["normal",0,100,"status"],"overheat":["fire",130,90,"spec"],"flare-blitz":["fire",120,100,"phys"],"wrap":["normal",15,90,"phys"],"leer":["normal",0,100,"status"],"tackle":["normal",40,100,"phys"],"magical-leaf":["grass",60,100,"spec"],"leech-seed":["grass",0,90,"status"],"giga-drain":["grass",75,100,"spec"],"coil":["poison",0,100,"status"],"leaf-blade":["grass",90,100,"phys"],"slam":["normal",80,75,"phys"],"mega-drain":["grass",40,100,"spec"],"gastro-acid":["poison",0,100,"status"],"tail-whip":["normal",0,100,"status"],"leaf-storm":["grass",130,90,"spec"],"defense-curl":["normal",0,100,"status"],"smog":["poison",30,70,"spec"],"ember":["fire",40,100,"spec"],"rollout":["rock",30,90,"phys"],"take-down":["normal",90,85,"phys"],"head-smash":["rock",150,80,"phys"],"heat-crash":["fire",0,100,"phys"],"flamethrower":["fire",90,100,"spec"],"arm-thrust":["fighting",15,100,"phys"],"soak":["water",0,100,"status"],"assurance":["dark",60,100,"phys"],"roar":["normal",0,100,"status"],"water-gun":["water",40,100,"spec"],"fury-cutter":["bug",40,95,"phys"],"razor-shell":["water",75,95,"phys"],"water-pulse":["water",60,100,"spec"],"encore":["normal",0,100,"status"],"swords-dance":["normal",0,100,"status"],"aqua-jet":["water",40,100,"phys"],"hydro-pump":["water",110,80,"spec"],"aerial-ace":["flying",60,100,"phys"],"slash":["normal",70,100,"phys"],"detect":["fighting",0,100,"status"],"bite":["dark",60,100,"phys"],"sand-attack":["ground",0,100,"status"],"hypnosis":["psychic",0,60,"status"],"bide":["normal",0,100,"phys"],"crunch":["dark",80,100,"phys"],"super-fang":["normal",0,90,"phys"],"v-create":["fire",180,95,"phys"],"searing-shot":["fire",100,100,"spec"],"after-you":["normal",0,100,"status"],"nasty-plot":["dark",0,100,"status"],"hyper-fang":["normal",80,90,"phys"],"psych-up":["normal",0,100,"status"],"baby-doll-eyes":["fairy",0,100,"status"],"baton-pass":["normal",0,100,"status"],"confuse-ray":["ghost",0,100,"status"],"play-rough":["fairy",90,90,"phys"],"helping-hand":["normal",0,100,"status"],"last-resort":["normal",140,100,"phys"],"giga-impact":["normal",150,90,"phys"],"scratch":["normal",40,100,"phys"],"fury-swipes":["normal",18,80,"phys"],"fake-out":["normal",40,100,"phys"],"sucker-punch":["dark",70,100,"phys"],"torment":["dark",0,100,"status"],"growl":["normal",0,100,"status"],"hone-claws":["dark",0,100,"status"],"night-slash":["dark",70,100,"phys"],"play-nice":["normal",0,100,"status"],"lick":["ghost",30,100,"phys"],"seed-bomb":["grass",80,100,"phys"],"recycle":["normal",0,100,"status"],"acrobatics":["flying",55,100,"phys"],"yawn":["normal",0,100,"status"],"grass-knot":["grass",0,100,"spec"],"natural-gift":["normal",0,100,"phys"],"flame-burst":["fire",70,100,"spec"],"amnesia":["psychic",0,100,"status"],"fire-blast":["fire",110,85,"spec"],"water-sport":["water",0,100,"status"],"scald":["water",80,100,"spec"],"moonlight":["fairy",0,100,"status"],"magic-coat":["psychic",0,100,"status"],"taunt":["dark",0,100,"status"],"aqua-tail":["water",90,90,"phys"],"imprison":["psychic",0,100,"status"],"psybeam":["psychic",65,100,"spec"],"psychic":["psychic",90,100,"spec"],"calm-mind":["psychic",0,100,"status"],"moonblast":["fairy",95,100,"spec"],"future-sight":["psychic",120,100,"spec"],"wonder-room":["psychic",0,100,"status"],"dream-eater":["psychic",100,100,"spec"],"gust":["flying",40,100,"spec"],"air-cutter":["flying",60,95,"spec"],"swagger":["normal",0,85,"status"],"feather-dance":["flying",0,100,"status"],"tailwind":["flying",0,100,"status"],"air-slash":["flying",75,95,"spec"],"mean-look":["normal",0,100,"status"],"roost":["flying",0,100,"status"],"sky-attack":["flying",140,90,"phys"],"shock-wave":["electric",60,100,"spec"],"thunder-wave":["electric",0,90,"status"],"spark":["electric",65,100,"phys"],"stomp":["normal",65,100,"phys"],"thrash":["normal",120,100,"phys"],"wild-charge":["electric",90,100,"phys"],"agility":["psychic",0,100,"status"],"discharge":["electric",80,100,"spec"],"harden":["normal",0,100,"status"],"fling":["dark",0,100,"phys"],"smack-down":["rock",50,100,"phys"],"rock-slide":["rock",75,90,"phys"],"rock-blast":["rock",25,90,"phys"],"iron-defense":["steel",0,100,"status"],"stone-edge":["rock",100,80,"phys"],"explosion":["normal",250,100,"phys"],"power-gem":["rock",80,100,"spec"],"attract":["normal",0,100,"status"],"simple-beam":["normal",0,100,"status"],"endeavor":["normal",0,100,"phys"],"rapid-spin":["normal",50,100,"phys"],"brine":["water",65,100,"spec"],"crush-claw":["normal",75,95,"phys"],"drill-run":["ground",80,95,"phys"],"dig":["ground",80,100,"phys"],"metal-claw":["steel",50,95,"phys"],"earthquake":["ground",100,100,"phys"],"fissure":["ground",0,30,"phys"],"horn-drill":["normal",0,30,"phys"],"disarming-voice":["fairy",40,100,"spec"],"pound":["normal",40,100,"phys"],"heal-pulse":["psychic",0,100,"status"],"hyper-voice":["normal",90,100,"spec"],"entrainment":["normal",0,100,"status"],"low-kick":["fighting",0,100,"phys"],"misty-terrain":["fairy",0,100,"status"],"rock-throw":["rock",50,90,"phys"],"bulk-up":["fighting",0,100,"status"],"scary-face":["normal",0,100,"status"],"dynamic-punch":["fighting",100,50,"phys"],"superpower":["fighting",120,100,"phys"],"echoed-voice":["normal",40,100,"spec"],"mud-slap":["ground",20,100,"spec"],"supersonic":["normal",0,55,"status"],"acid":["poison",40,100,"spec"],"stealth-rock":["rock",0,100,"status"],"mud-shot":["ground",55,95,"spec"],"bubble-beam":["water",65,100,"spec"],"round":["normal",60,100,"spec"],"aqua-ring":["water",0,100,"status"],"flail":["normal",0,100,"phys"],"sandstorm":["rock",0,100,"status"],"uproar":["normal",90,100,"spec"],"life-dew":["water",0,100,"status"],"hammer-arm":["fighting",100,90,"phys"],"muddy-water":["water",90,85,"spec"],"drain-punch":["fighting",75,100,"phys"],"focus-punch":["fighting",150,100,"phys"],"rain-dance":["water",0,100,"status"],"bind":["normal",15,85,"phys"],"wide-guard":["rock",0,100,"status"],"circle-throw":["fighting",60,90,"phys"],"revenge":["fighting",60,100,"phys"],"storm-throw":["fighting",60,100,"phys"],"quick-guard":["fighting",0,100,"status"],"seismic-toss":["fighting",0,100,"phys"],"rock-smash":["fighting",40,100,"phys"],"double-kick":["fighting",30,100,"phys"],"low-sweep":["fighting",65,100,"phys"],"counter":["fighting",0,100,"phys"],"close-combat":["fighting",120,100,"phys"],"string-shot":["bug",0,95,"status"],"razor-leaf":["grass",55,95,"phys"],"bug-bite":["bug",60,100,"phys"],"sticky-web":["bug",0,100,"status"],"bug-buzz":["bug",90,100,"spec"],"protect":["normal",0,100,"status"],"fell-stinger":["bug",50,100,"phys"],"poison-sting":["poison",15,100,"phys"],"poison-tail":["poison",50,100,"phys"],"screech":["normal",0,85,"status"],"venoshock":["poison",65,100,"spec"],"toxic":["poison",0,90,"status"],"venom-drench":["poison",0,100,"status"],"absorb":["grass",20,100,"spec"],"megahorn":["bug",120,85,"phys"],"fairy-wind":["fairy",40,100,"spec"],"stun-spore":["grass",0,75,"status"],"poison-powder":["poison",0,75,"status"],"charm":["fairy",0,100,"status"],"cotton-guard":["grass",0,100,"status"],"energy-ball":["grass",90,100,"spec"],"solar-beam":["grass",120,100,"spec"],"sleep-powder":["grass",0,75,"status"],"sunny-day":["fire",0,100,"status"],"synthesis":["grass",0,100,"status"],"petal-dance":["grass",120,100,"spec"],"wave-crash":["water",120,100,"phys"],"vital-throw":["fighting",70,100,"phys"],"sand-tomb":["ground",35,85,"phys"],"foul-play":["dark",95,100,"phys"],"fire-fang":["fire",65,95,"phys"],"brick-break":["fighting",75,100,"phys"],"struggle-bug":["bug",50,100,"spec"],"outrage":["dragon",120,100,"phys"],"belly-drum":["normal",0,100,"status"],"fire-punch":["fire",75,100,"phys"],"x-scissor":["bug",80,100,"phys"],"peck":["flying",35,100,"phys"],"ingrain":["grass",0,100,"status"],"sweet-scent":["normal",0,100,"status"],"petal-blizzard":["grass",90,100,"phys"],"acupressure":["normal",0,100,"status"],"charge":["electric",0,100,"status"],"pin-missile":["bug",25,95,"phys"],"spiky-shield":["grass",0,100,"status"],"rock-polish":["rock",0,100,"status"],"withdraw":["water",0,100,"status"],"shell-smash":["normal",0,100,"status"],"rock-wrecker":["rock",150,90,"phys"],"beat-up":["dark",0,100,"phys"],"payback":["dark",50,100,"phys"],"high-jump-kick":["fighting",130,90,"phys"],"whirlwind":["normal",0,100,"status"],"cosmic-power":["psychic",0,100,"status"],"gravity":["psychic",0,100,"status"],"facade":["normal",70,100,"phys"],"cotton-spore":["grass",0,100,"status"],"light-screen":["psychic",0,100,"status"],"reflect":["psychic",0,100,"status"],"disable":["normal",0,100,"status"],"skill-swap":["psychic",0,100,"status"],"haze":["ice",0,100,"status"],"night-shade":["ghost",0,100,"spec"],"crafty-shield":["fairy",0,100,"status"],"will-o-wisp":["fire",0,85,"status"],"hex":["ghost",65,100,"spec"],"dark-pulse":["dark",80,100,"spec"],"guard-split":["psychic",0,100,"status"],"shadow-ball":["ghost",80,100,"spec"],"power-split":["psychic",0,100,"status"],"power-trip":["dark",20,100,"phys"],"destiny-bond":["ghost",0,100,"status"],"shadow-claw":["ghost",70,100,"phys"],"wing-attack":["flying",60,100,"phys"],"dragon-claw":["dragon",80,100,"phys"],"ancient-power":["rock",60,100,"spec"],"dragon-breath":["dragon",60,100,"spec"],"pluck":["flying",60,100,"phys"],"u-turn":["bug",70,100,"phys"],"poison-gas":["poison",0,90,"status"],"stockpile":["normal",0,100,"status"],"toxic-spikes":["poison",0,100,"status"],"acid-spray":["poison",40,100,"spec"],"swallow":["normal",0,100,"status"],"sludge":["poison",65,100,"spec"],"sludge-bomb":["poison",90,100,"spec"],"belch":["poison",120,90,"spec"],"gunk-shot":["poison",120,80,"phys"],"night-daze":["dark",85,95,"spec"],"pain-split":["normal",0,100,"status"],"fake-tears":["dark",0,100,"status"],"retaliate":["normal",70,100,"phys"],"body-slam":["normal",85,100,"phys"],"knock-off":["dark",65,100,"phys"],"sing":["normal",0,55,"status"],"swift":["normal",60,100,"spec"],"recover":["normal",0,100,"status"],"tail-slap":["normal",25,85,"phys"],"flatter":["dark",0,100,"status"],"magic-room":["psychic",0,100,"status"],"psyshock":["psychic",80,100,"spec"],"ally-switch":["psychic",0,100,"status"],"astonish":["ghost",30,100,"phys"],"tickle":["normal",0,100,"status"],"defog":["flying",0,100,"status"],"brave-bird":["flying",120,100,"phys"],"mist":["ice",0,100,"status"],"hail":["ice",0,100,"status"],"grudge":["ghost",0,100,"status"],"acid-armor":["poison",0,100,"status"],"curse":["ghost",0,100,"status"],"avalanche":["ice",60,100,"phys"],"icy-wind":["ice",55,95,"spec"],"hurricane":["flying",110,70,"spec"],"mirror-coat":["psychic",0,100,"spec"],"bullet-seed":["grass",25,100,"phys"],"ice-beam":["ice",90,100,"spec"],"horn-leech":["grass",75,100,"phys"],"thunder-shock":["electric",40,100,"spec"],"double-team":["normal",0,100,"status"],"nuzzle":["electric",20,100,"phys"],"metal-burst":["steel",0,100,"phys"],"clear-smog":["poison",50,100,"spec"],"false-swipe":["normal",40,100,"phys"],"rage-powder":["bug",0,100,"status"],"iron-head":["steel",80,100,"phys"],"spore":["grass",0,100,"status"],"water-spout":["water",150,100,"spec"],"whirlpool":["water",35,85,"spec"],"wish":["normal",0,100,"status"],"healing-wish":["psychic",0,100,"status"],"electro-ball":["electric",0,100,"spec"],"safeguard":["normal",0,100,"status"],"electroweb":["electric",55,95,"spec"],"flash-cannon":["steel",80,100,"spec"],"self-destruct":["normal",200,100,"phys"],"gyro-ball":["steel",0,100,"phys"],"vice-grip":["normal",55,100,"phys"],"power-whip":["grass",120,85,"phys"],"charge-beam":["electric",50,90,"spec"],"gear-grind":["steel",50,85,"phys"],"shift-gear":["steel",0,100,"status"],"lock-on":["normal",0,100,"status"],"zap-cannon":["electric",120,50,"spec"],"hyper-beam":["normal",150,90,"spec"],"teleport":["psychic",0,100,"status"],"thunderbolt":["electric",90,100,"spec"],"minimize":["normal",0,100,"status"],"fire-spin":["fire",35,85,"spec"],"icicle-spear":["ice",25,100,"phys"],"breaking-swipe":["dragon",60,100,"phys"],"dragon-dance":["dragon",0,100,"status"],"sheer-cold":["ice",0,30,"spec"],"guillotine":["normal",0,30,"phys"],"volt-switch":["electric",70,100,"spec"],"metal-sound":["steel",0,85,"status"],"autotomize":["steel",0,100,"status"],"electric-terrain":["electric",0,100,"status"],"blizzard":["ice",110,70,"spec"],"memento":["dark",0,100,"status"],"snowscape":["ice",0,100,"status"],"powder-snow":["ice",40,100,"spec"],"dragon-pulse":["dragon",85,100,"spec"],"icicle-crash":["ice",85,90,"phys"],"aurora-beam":["ice",65,100,"spec"],"guard-swap":["psychic",0,100,"status"],"rest":["psychic",0,100,"status"],"ice-shard":["ice",40,100,"phys"],"freeze-dry":["ice",70,100,"spec"],"power-swap":["psychic",0,100,"status"],"bounce":["flying",85,85,"phys"],"shadow-punch":["ghost",60,100,"phys"],"mega-punch":["normal",80,85,"phys"],"fury-attack":["normal",15,85,"phys"],"phantom-force":["ghost",90,100,"phys"],"throat-chop":["dark",80,100,"phys"],"horn-attack":["normal",65,100,"phys"],"dragon-tail":["dragon",60,90,"phys"],"heavy-slam":["steel",0,100,"phys"],"bone-rush":["ground",25,90,"phys"],"fire-lash":["fire",80,100,"phys"],"dragon-rush":["dragon",100,75,"phys"],"spit-up":["normal",0,100,"spec"],"flame-wheel":["fire",60,100,"phys"],"leech-life":["bug",80,100,"phys"],"quiver-dance":["bug",0,100,"status"],"heat-wave":["fire",95,90,"spec"],"sacred-sword":["fighting",90,100,"phys"],"extrasensory":["psychic",80,100,"spec"],"wildbolt-storm":["electric",100,80,"spec"],"thunder":["electric",110,70,"spec"],"blue-flare":["fire",130,85,"spec"],"thunder-fang":["electric",65,95,"phys"],"freeze-shock":["ice",140,90,"phys"],"ice-burn":["ice",140,90,"spec"],"fusion-bolt":["electric",100,100,"phys"],"block":["normal",0,100,"status"],"frost-breath":["ice",60,90,"spec"],"bulldoze":["ground",60,100,"phys"],"rock-tomb":["rock",60,95,"phys"],"aura-sphere":["fighting",80,100,"spec"],"force-palm":["fighting",60,100,"phys"],"stomping-tantrum":["ground",75,100,"phys"],"secret-sword":["fighting",85,100,"spec"],"glaciate":["ice",65,95,"spec"],"teeter-dance":["normal",0,100,"status"],"head-charge":["normal",120,100,"phys"],"role-play":["psychic",0,100,"status"],"magnet-rise":["electric",0,100,"status"],"fusion-flare":["fire",100,100,"spec"],"noble-roar":["normal",0,100,"status"],"bolt-strike":["electric",130,85,"phys"],"earth-power":["ground",90,100,"spec"],"sandsear-storm":["ground",100,80,"spec"],"perish-song":["normal",0,100,"status"],"bleakwind-storm":["flying",100,80,"spec"],"relic-song":["normal",75,100,"spec"],"techno-blast":["normal",120,100,"spec"],"struggle":["normal",50,100,"phys"],"headlong-rush":["ground",120,100,"phys"],"mach-punch":["fighting",40,100,"phys"],"slack-off":["normal",0,100,"status"],"raging-fury":["fire",120,100,"phys"],"feint":["normal",30,100,"phys"],"drill-peck":["flying",80,100,"phys"],"worry-seed":["grass",0,100,"status"],"infestation":["bug",20,100,"spec"],"lunge":["bug",80,100,"phys"],"defend-order":["bug",0,100,"status"],"aromatic-mist":["fairy",0,100,"status"],"attack-order":["bug",90,100,"phys"],"sweet-kiss":["fairy",0,75,"status"],"leafage":["grass",40,100,"phys"],"morning-sun":["normal",0,100,"status"],"liquidation":["water",85,100,"phys"],"double-hit":["normal",35,90,"phys"],"splash":["normal",0,100,"status"],"comeuppance":["dark",1,100,"phys"],"smokescreen":["normal",0,100,"status"],"tearful-look":["normal",0,100,"status"],"mimic":["normal",0,100,"status"],"copycat":["normal",0,100,"status"],"dazzling-gleam":["fairy",80,100,"spec"],"covet":["normal",60,100,"phys"],"chatter":["flying",65,100,"spec"],"parting-shot":["dark",0,100,"status"],"shadow-sneak":["ghost",40,100,"phys"],"spite":["ghost",0,100,"status"],"confide":["normal",0,100,"status"],"metronome":["normal",0,100,"status"],"vacuum-wave":["fighting",40,100,"spec"],"extreme-speed":["normal",80,100,"phys"],"meteor-mash":["steel",90,90,"phys"],"poison-fang":["poison",50,100,"phys"],"cross-poison":["poison",70,100,"phys"],"poison-jab":["poison",80,100,"phys"],"leaf-tornado":["grass",65,90,"spec"],"wood-hammer":["grass",120,100,"phys"],"ice-punch":["ice",75,100,"phys"],"grassy-terrain":["grass",0,100,"status"],"thunder-punch":["electric",75,100,"phys"],"lava-plume":["fire",80,100,"spec"],"ice-fang":["ice",65,95,"phys"],"crabhammer":["water",100,90,"phys"],"conversion":["normal",0,100,"status"],"psycho-cut":["psychic",70,100,"phys"],"conversion-2":["normal",0,100,"status"],"tri-attack":["normal",80,100,"spec"],"trick-room":["psychic",0,100,"status"],"aurora-veil":["ice",0,100,"status"],"draining-kiss":["fairy",50,100,"spec"],"substitute":["normal",0,100,"status"],"mystical-power":["psychic",70,90,"spec"],"iron-tail":["steel",100,75,"phys"],"spacial-rend":["dragon",100,95,"spec"],"roar-of-time":["dragon",150,90,"spec"],"magma-storm":["fire",100,75,"spec"],"trick":["psychic",0,100,"status"],"body-press":["fighting",80,100,"phys"],"crush-grip":["normal",0,100,"phys"],"lunar-blessing":["psychic",0,100,"status"],"lunar-dance":["psychic",0,100,"status"],"shadow-force":["ghost",120,100,"phys"],"dive":["water",80,100,"phys"],"take-heart":["psychic",0,100,"status"],"tail-glow":["bug",0,100,"status"],"dark-void":["dark",0,50,"status"],"seed-flare":["grass",120,85,"spec"],"judgment":["normal",100,100,"spec"],"heart-swap":["psychic",0,100,"status"],"laser-focus":["normal",0,100,"status"],"twister":["dragon",40,100,"spec"],"glare":["normal",0,100,"status"],"follow-me":["normal",0,100,"status"],"aromatherapy":["grass",0,100,"status"],"pay-day":["normal",40,100,"phys"],"rage-fist":["ghost",50,100,"phys"],"howl":["normal",0,100,"status"],"cross-chop":["fighting",100,80,"phys"],"strength":["normal",80,100,"phys"],"dual-chop":["dragon",40,90,"phys"],"surf":["water",90,100,"spec"],"sludge-wave":["poison",95,100,"spec"],"smart-strike":["steel",70,100,"phys"],"cut":["normal",50,95,"phys"],"eerie-impulse":["electric",0,100,"status"],"bonemerang":["ground",50,90,"phys"],"axe-kick":["fighting",120,90,"phys"],"blaze-kick":["fire",85,90,"phys"],"mega-kick":["normal",120,75,"phys"],"bullet-punch":["steel",40,100,"phys"],"soft-boiled":["normal",0,100,"status"],"waterfall":["water",80,100,"phys"],"lovely-kiss":["normal",0,75,"status"],"submission":["fighting",80,80,"phys"],"raging-bull":["normal",90,100,"phys"],"transform":["normal",0,100,"status"],"snore":["normal",50,100,"spec"],"high-horsepower":["ground",95,95,"phys"],"sleep-talk":["normal",0,100,"status"],"magnetic-flux":["electric",0,100,"status"],"reflect-type":["normal",0,100,"status"],"psystrike":["psychic",100,100,"spec"],"eruption":["fire",150,100,"spec"],"toxic-thread":["poison",0,100,"status"],"psycho-shift":["psychic",0,100,"status"],"snarl":["dark",55,95,"spec"],"twin-beam":["psychic",40,100,"spec"],"quash":["dark",0,100,"status"],"spikes":["ground",0,100,"status"],"hyper-drill":["normal",100,100,"phys"],"power-trick":["psychic",0,100,"status"],"hidden-power":["normal",60,100,"spec"],"octazooka":["water",65,85,"spec"],"steel-wing":["steel",70,90,"phys"],"present":["normal",0,90,"phys"],"sketch":["normal",0,100,"status"],"milk-drink":["normal",0,100,"status"],"triple-kick":["fighting",10,90,"phys"],"heal-bell":["normal",0,100,"status"],"aeroblast":["flying",100,95,"spec"],"weather-ball":["normal",50,100,"spec"],"mind-reader":["normal",0,100,"status"],"sacred-fire":["fire",100,95,"phys"],"boomburst":["normal",140,100,"spec"],"switcheroo":["dark",0,100,"status"],"mist-ball":["psychic",95,100,"spec"],"luster-purge":["psychic",95,100,"spec"],"fly":["flying",90,95,"phys"],"origin-pulse":["water",110,85,"spec"],"thief":["dark",60,100,"phys"],"precipice-blades":["ground",120,85,"phys"],"dragon-ascent":["flying",120,100,"phys"],"psycho-boost":["psychic",140,90,"spec"],"doom-desire":["steel",140,100,"spec"],"alluring-voice":["fairy",80,100,"spec"],"assist":["normal",0,100,"status"],"barrage":["normal",15,85,"phys"],"barrier":["psychic",0,100,"status"],"bestow":["normal",0,100,"status"],"bone-club":["ground",65,85,"phys"],"bubble":["water",40,100,"spec"],"burning-jealousy":["fire",70,100,"spec"],"camouflage":["normal",0,100,"status"],"captivate":["normal",0,100,"status"],"chilling-water":["water",50,100,"spec"],"chip-away":["normal",70,100,"phys"],"clamp":["water",35,85,"phys"],"comet-punch":["normal",18,85,"phys"],"constrict":["normal",10,100,"phys"],"dizzy-punch":["normal",70,100,"phys"],"double-slap":["normal",15,85,"phys"],"draco-meteor":["dragon",130,90,"spec"],"dragon-rage":["dragon",0,100,"spec"],"dual-wingbeat":["flying",40,90,"phys"],"egg-bomb":["normal",100,75,"phys"],"embargo":["dark",0,100,"status"],"expanding-force":["psychic",80,100,"spec"],"feint-attack":["dark",60,100,"phys"],"fire-pledge":["fire",80,100,"spec"],"flash":["normal",0,100,"status"],"flip-turn":["water",60,100,"phys"],"focus-blast":["fighting",120,70,"spec"],"foresight":["normal",0,100,"status"],"frustration":["normal",0,100,"phys"],"grass-pledge":["grass",80,100,"spec"],"grass-whistle":["grass",0,55,"status"],"grassy-glide":["grass",55,100,"phys"],"heal-block":["psychic",0,100,"status"],"heal-order":["bug",0,100,"status"],"heart-stamp":["psychic",60,100,"phys"],"ice-spinner":["ice",80,100,"phys"],"ion-deluge":["electric",0,100,"status"],"jump-kick":["fighting",100,95,"phys"],"kinesis":["psychic",0,80,"status"],"lash-out":["dark",75,100,"phys"],"lucky-chant":["normal",0,100,"status"],"magnet-bomb":["steel",60,100,"phys"],"magnitude":["ground",0,100,"phys"],"mat-block":["fighting",0,100,"status"],"me-first":["normal",0,100,"status"],"meditate":["psychic",0,100,"status"],"meteor-beam":["rock",120,90,"spec"],"miracle-eye":["psychic",0,100,"status"],"mirror-move":["flying",0,100,"status"],"mirror-shot":["steel",65,85,"spec"],"mud-bomb":["ground",65,85,"spec"],"mud-sport":["ground",0,100,"status"],"mystical-fire":["fire",75,100,"spec"],"nature-power":["normal",0,100,"status"],"needle-arm":["grass",60,100,"phys"],"nightmare":["ghost",0,100,"status"],"odor-sleuth":["normal",0,100,"status"],"ominous-wind":["ghost",60,100,"spec"],"poltergeist":["ghost",110,90,"phys"],"pounce":["bug",50,100,"phys"],"power-up-punch":["fighting",40,100,"phys"],"psychic-fangs":["psychic",85,100,"phys"],"psychic-noise":["psychic",75,100,"spec"],"psywave":["psychic",0,100,"spec"],"punishment":["dark",0,100,"phys"],"pursuit":["dark",40,100,"phys"],"rage":["normal",20,100,"phys"],"razor-wind":["normal",80,100,"spec"],"refresh":["normal",0,100,"status"],"return":["normal",0,100,"phys"],"rock-climb":["normal",90,85,"phys"],"scale-shot":["dragon",25,90,"phys"],"scorching-sands":["ground",70,100,"spec"],"secret-power":["normal",70,100,"phys"],"sharpen":["normal",0,100,"status"],"signal-beam":["bug",75,100,"spec"],"silver-wind":["bug",60,100,"spec"],"skitter-smack":["bug",70,90,"phys"],"skull-bash":["normal",130,100,"phys"],"sky-drop":["flying",60,100,"phys"],"sky-uppercut":["fighting",85,90,"phys"],"smelling-salts":["normal",70,100,"phys"],"snatch":["dark",0,100,"status"],"solar-blade":["grass",125,100,"phys"],"sonic-boom":["normal",0,90,"spec"],"spider-web":["bug",0,100,"status"],"spike-cannon":["normal",20,100,"phys"],"steamroller":["bug",65,100,"phys"],"supercell-slam":["electric",100,95,"phys"],"synchronoise":["psychic",120,100,"spec"],"telekinesis":["psychic",0,100,"status"],"temper-flare":["fire",75,100,"phys"],"tera-blast":["normal",80,100,"spec"],"trailblaze":["grass",50,100,"phys"],"triple-axel":["ice",20,90,"phys"],"trump-card":["normal",0,100,"spec"],"twineedle":["bug",25,100,"phys"],"wake-up-slap":["fighting",70,100,"phys"],"wring-out":["normal",0,100,"spec"]},"statusMoves":{"ember":["burn",10],"fire-punch":["burn",10],"flamethrower":["burn",10],"fire-blast":["burn",10],"flame-wheel":["burn",10],"sacred-fire":["burn",50],"fire-fang":["burn",10],"lava-plume":["burn",30],"heat-wave":["burn",10],"flare-blitz":["burn",10],"blaze-kick":["burn",10],"inferno":["burn",100],"will-o-wisp":["burn",85],"thunder-fang":["paralysis",10],"discharge":["paralysis",30],"nuzzle":["paralysis",100],"bounce":["paralysis",30],"dragon-breath":["paralysis",30],"scald":["burn",30],"searing-shot":["burn",30],"scorching-sands":["burn",30],"ice-burn":["burn",30],"blue-flare":["burn",20],"sandsear-storm":["burn",20],"freeze-shock":["paralysis",30],"bolt-strike":["paralysis",20],"force-palm":["paralysis",30],"wildbolt-storm":["paralysis",20],"relic-song":["sleep",10],"chatter":["confusion",100],"rock-climb":["confusion",20],"signal-beam":["confusion",10],"axe-kick":["confusion",30],"poison-jab":["poison",30],"poison-fang":["poison",50],"cross-poison":["poison",10],"gunk-shot":["poison",30],"sludge-wave":["poison",10],"poison-tail":["poison",10],"toxic":["poison",90],"ice-fang":["freeze",10],"freeze-dry":["freeze",10],"dynamic-punch":["confusion",100],"hurricane":["confusion",30],"water-pulse":["confusion",20],"thunder-shock":["paralysis",10],"thunder-punch":["paralysis",10],"thunderbolt":["paralysis",10],"thunder":["paralysis",30],"spark":["paralysis",30],"zap-cannon":["paralysis",100],"body-slam":["paralysis",30],"lick":["paralysis",30],"poison-sting":["poison",30],"sludge":["poison",30],"sludge-bomb":["poison",30],"smog":["poison",40],"twineedle":["poison",20],"ice-beam":["freeze",10],"ice-punch":["freeze",10],"blizzard":["freeze",10],"powder-snow":["freeze",10],"confusion":["confusion",10],"psybeam":["confusion",10],"dizzy-punch":["confusion",20],"tri-attack":["tri",20],"sleep-powder":["sleep",75],"spore":["sleep",100],"hypnosis":["sleep",60],"sing":["sleep",55],"lovely-kiss":["sleep",75],"stun-spore":["paralysis",75],"thunder-wave":["paralysis",100],"glare":["paralysis",75],"poison-powder":["poison",75],"poison-gas":["poison",55],"confuse-ray":["confusion",100],"supersonic":["confusion",55],"sweet-kiss":["confusion",75]},"evolutions":{"1":[{"to":2,"level":16}],"2":[{"to":3,"level":32}],"4":[{"to":5,"level":16}],"5":[{"to":6,"level":36}],"7":[{"to":8,"level":16}],"8":[{"to":9,"level":36}],"10":[{"to":11,"level":7}],"11":[{"to":12,"level":10}],"13":[{"to":14,"level":7}],"14":[{"to":15,"level":10}],"16":[{"to":17,"level":18}],"17":[{"to":18,"level":36}],"19":[{"to":20,"level":20}],"21":[{"to":22,"level":20}],"23":[{"to":24,"level":22}],"25":[{"to":26,"item":"thunder-stone"}],"27":[{"to":28,"level":22}],"29":[{"to":30,"level":16}],"30":[{"to":31,"item":"moon-stone"}],"32":[{"to":33,"level":16}],"33":[{"to":34,"item":"moon-stone"}],"35":[{"to":36,"item":"moon-stone"}],"37":[{"to":38,"item":"fire-stone"}],"39":[{"to":40,"item":"moon-stone"}],"41":[{"to":42,"level":22}],"42":[{"to":169,"item":"soothe-bell"}],"43":[{"to":44,"level":21}],"44":[{"to":45,"item":"leaf-stone"},{"to":182,"item":"sun-stone"}],"46":[{"to":47,"level":24}],"48":[{"to":49,"level":31}],"50":[{"to":51,"level":26}],"52":[{"to":53,"level":28}],"54":[{"to":55,"level":33}],"56":[{"to":57,"level":28}],"58":[{"to":59,"item":"fire-stone"}],"60":[{"to":61,"level":25}],"61":[{"to":62,"item":"water-stone"},{"to":186,"item":"kings-rock"}],"63":[{"to":64,"level":16}],"64":[{"to":65,"item":"link-cable"}],"66":[{"to":67,"level":28}],"67":[{"to":68,"item":"link-cable"}],"69":[{"to":70,"level":21}],"70":[{"to":71,"item":"leaf-stone"}],"72":[{"to":73,"level":30}],"74":[{"to":75,"level":25}],"75":[{"to":76,"item":"link-cable"}],"77":[{"to":78,"level":40}],"79":[{"to":80,"level":37},{"to":199,"item":"kings-rock"}],"81":[{"to":82,"level":30}],"82":[{"to":462,"item":"thunder-stone"}],"84":[{"to":85,"level":31}],"86":[{"to":87,"level":34}],"88":[{"to":89,"level":38}],"90":[{"to":91,"item":"water-stone"}],"92":[{"to":93,"level":25}],"93":[{"to":94,"item":"link-cable"}],"95":[{"to":208,"item":"metal-coat"}],"96":[{"to":97,"level":26}],"98":[{"to":99,"level":28}],"100":[{"to":101,"level":30}],"102":[{"to":103,"item":"leaf-stone"}],"104":[{"to":105,"level":28}],"108":[{"to":463,"level":33}],"109":[{"to":110,"level":35}],"111":[{"to":112,"level":42}],"112":[{"to":464,"item":"protector"}],"113":[{"to":242,"item":"soothe-bell"}],"114":[{"to":465,"level":33}],"116":[{"to":117,"level":32}],"117":[{"to":230,"item":"dragon-scale"}],"118":[{"to":119,"level":33}],"120":[{"to":121,"item":"water-stone"}],"123":[{"to":212,"item":"metal-coat"}],"125":[{"to":466,"item":"electirizer"}],"126":[{"to":467,"item":"magmarizer"}],"129":[{"to":130,"level":20}],"133":[{"to":134,"item":"water-stone"},{"to":135,"item":"thunder-stone"},{"to":136,"item":"fire-stone"},{"to":196,"item":"soothe-bell"},{"to":197,"item":"soothe-bell"},{"to":470,"item":"leaf-stone"},{"to":471,"item":"ice-stone"}],"137":[{"to":233,"item":"up-grade"}],"138":[{"to":139,"level":40}],"140":[{"to":141,"level":40}],"147":[{"to":148,"level":30}],"148":[{"to":149,"level":55}],"152":[{"to":153,"level":16}],"153":[{"to":154,"level":32}],"155":[{"to":156,"level":14}],"156":[{"to":157,"level":36}],"158":[{"to":159,"level":18}],"159":[{"to":160,"level":30}],"161":[{"to":162,"level":15}],"163":[{"to":164,"level":20}],"165":[{"to":166,"level":18}],"167":[{"to":168,"level":22}],"170":[{"to":171,"level":27}],"172":[{"to":25,"item":"soothe-bell"}],"173":[{"to":35,"item":"soothe-bell"}],"174":[{"to":39,"item":"soothe-bell"}],"175":[{"to":176,"item":"soothe-bell"}],"176":[{"to":468,"item":"shiny-stone"}],"177":[{"to":178,"level":25}],"179":[{"to":180,"level":15}],"180":[{"to":181,"level":30}],"183":[{"to":184,"level":18}],"187":[{"to":188,"level":18}],"188":[{"to":189,"level":27}],"190":[{"to":424,"level":32}],"191":[{"to":192,"item":"sun-stone"}],"193":[{"to":469,"level":33}],"194":[{"to":195,"level":20}],"198":[{"to":430,"item":"dusk-stone"}],"200":[{"to":429,"item":"dusk-stone"}],"204":[{"to":205,"level":31}],"207":[{"to":472,"item":"razor-fang"}],"209":[{"to":210,"level":23}],"215":[{"to":461,"item":"razor-claw"}],"216":[{"to":217,"level":30}],"218":[{"to":219,"level":38}],"220":[{"to":221,"level":33}],"221":[{"to":473,"level":40}],"223":[{"to":224,"level":25}],"228":[{"to":229,"level":24}],"231":[{"to":232,"level":25}],"236":[{"to":106,"level":20},{"to":107,"level":20},{"to":237,"level":20}],"238":[{"to":124,"level":30}],"239":[{"to":125,"level":30}],"240":[{"to":126,"level":30}],"246":[{"to":247,"level":30}],"247":[{"to":248,"level":55}],"252":[{"to":253,"level":16}],"253":[{"to":254,"level":36}],"255":[{"to":256,"level":16}],"256":[{"to":257,"level":36}],"258":[{"to":259,"level":16}],"259":[{"to":260,"level":36}],"261":[{"to":262,"level":18}],"263":[{"to":264,"level":20}],"265":[{"to":266,"level":7},{"to":268,"level":7}],"266":[{"to":267,"level":10}],"268":[{"to":269,"level":10}],"270":[{"to":271,"level":14}],"271":[{"to":272,"item":"water-stone"}],"273":[{"to":274,"level":14}],"274":[{"to":275,"item":"leaf-stone"}],"276":[{"to":277,"level":22}],"278":[{"to":279,"level":25}],"280":[{"to":281,"level":20}],"281":[{"to":282,"level":30},{"to":475,"item":"dawn-stone"}],"283":[{"to":284,"level":22}],"285":[{"to":286,"level":23}],"287":[{"to":288,"level":18}],"288":[{"to":289,"level":36}],"290":[{"to":291,"level":20},{"to":292,"item":"shed-shell"}],"293":[{"to":294,"level":20}],"294":[{"to":295,"level":40}],"296":[{"to":297,"level":24}],"298":[{"to":183,"item":"soothe-bell"}],"299":[{"to":476,"item":"thunder-stone"}],"300":[{"to":301,"item":"moon-stone"}],"304":[{"to":305,"level":32}],"305":[{"to":306,"level":42}],"307":[{"to":308,"level":37}],"309":[{"to":310,"level":26}],"315":[{"to":407,"item":"shiny-stone"}],"316":[{"to":317,"level":26}],"318":[{"to":319,"level":30}],"320":[{"to":321,"level":40}],"322":[{"to":323,"level":33}],"325":[{"to":326,"level":32}],"328":[{"to":329,"level":35}],"329":[{"to":330,"level":45}],"331":[{"to":332,"level":32}],"333":[{"to":334,"level":35}],"339":[{"to":340,"level":30}],"341":[{"to":342,"level":30}],"343":[{"to":344,"level":36}],"345":[{"to":346,"level":40}],"347":[{"to":348,"level":40}],"349":[{"to":350,"item":"prism-scale"}],"353":[{"to":354,"level":37}],"355":[{"to":356,"level":37}],"356":[{"to":477,"item":"reaper-cloth"}],"360":[{"to":202,"level":15}],"361":[{"to":362,"level":42},{"to":478,"item":"dawn-stone"}],"363":[{"to":364,"level":32}],"364":[{"to":365,"level":44}],"366":[{"to":367,"item":"deep-sea-tooth"},{"to":368,"item":"deep-sea-scale"}],"371":[{"to":372,"level":30}],"372":[{"to":373,"level":50}],"374":[{"to":375,"level":20}],"375":[{"to":376,"level":45}],"387":[{"to":388,"level":18}],"388":[{"to":389,"level":32}],"390":[{"to":391,"level":14}],"391":[{"to":392,"level":36}],"393":[{"to":394,"level":16}],"394":[{"to":395,"level":36}],"396":[{"to":397,"level":14}],"397":[{"to":398,"level":34}],"399":[{"to":400,"level":15}],"401":[{"to":402,"level":10}],"403":[{"to":404,"level":15}],"404":[{"to":405,"level":30}],"406":[{"to":315,"item":"soothe-bell"}],"408":[{"to":409,"level":30}],"410":[{"to":411,"level":30}],"412":[{"to":413,"level":20},{"to":414,"level":20}],"415":[{"to":416,"level":21}],"418":[{"to":419,"level":26}],"420":[{"to":421,"level":25}],"422":[{"to":423,"level":30}],"425":[{"to":426,"level":28}],"427":[{"to":428,"item":"soothe-bell"}],"431":[{"to":432,"level":38}],"433":[{"to":358,"item":"soothe-bell"}],"434":[{"to":435,"level":34}],"436":[{"to":437,"level":33}],"438":[{"to":185,"level":17}],"439":[{"to":122,"level":18}],"440":[{"to":113,"item":"oval-stone"}],"443":[{"to":444,"level":24}],"444":[{"to":445,"level":48}],"446":[{"to":143,"item":"soothe-bell"}],"447":[{"to":448,"item":"soothe-bell"}],"449":[{"to":450,"level":34}],"451":[{"to":452,"level":40}],"453":[{"to":454,"level":37}],"456":[{"to":457,"level":31}],"458":[{"to":226,"level":1}],"459":[{"to":460,"level":40}],"495":[{"to":496,"level":17}],"496":[{"to":497,"level":36}],"498":[{"to":499,"level":17}],"499":[{"to":500,"level":36}],"501":[{"to":502,"level":17}],"502":[{"to":503,"level":36}],"504":[{"to":505,"level":20}],"506":[{"to":507,"level":16}],"507":[{"to":508,"level":32}],"509":[{"to":510,"level":20}],"511":[{"to":512,"item":"leaf-stone"}],"513":[{"to":514,"item":"fire-stone"}],"515":[{"to":516,"item":"water-stone"}],"517":[{"to":518,"item":"moon-stone"}],"519":[{"to":520,"level":21}],"520":[{"to":521,"level":32}],"522":[{"to":523,"level":27}],"524":[{"to":525,"level":25}],"525":[{"to":526,"item":"link-cable"}],"527":[{"to":528,"item":"soothe-bell"}],"529":[{"to":530,"level":31}],"532":[{"to":533,"level":25}],"533":[{"to":534,"item":"link-cable"}],"535":[{"to":536,"level":25}],"536":[{"to":537,"level":36}],"540":[{"to":541,"level":20}],"541":[{"to":542,"item":"soothe-bell"}],"543":[{"to":544,"level":22}],"544":[{"to":545,"level":30}],"546":[{"to":547,"item":"sun-stone"}],"548":[{"to":549,"item":"sun-stone"}],"551":[{"to":552,"level":29}],"552":[{"to":553,"level":40}],"554":[{"to":555,"level":35}],"557":[{"to":558,"level":34}],"559":[{"to":560,"level":39}],"562":[{"to":563,"level":34}],"564":[{"to":565,"level":37}],"566":[{"to":567,"level":37}],"568":[{"to":569,"level":36}],"570":[{"to":571,"level":30}],"572":[{"to":573,"item":"shiny-stone"}],"574":[{"to":575,"level":32}],"575":[{"to":576,"level":41}],"577":[{"to":578,"level":32}],"578":[{"to":579,"level":41}],"580":[{"to":581,"level":35}],"582":[{"to":583,"level":35}],"583":[{"to":584,"level":47}],"585":[{"to":586,"level":34}],"588":[{"to":589,"level":1}],"590":[{"to":591,"level":39}],"592":[{"to":593,"level":40}],"595":[{"to":596,"level":36}],"597":[{"to":598,"level":40}],"599":[{"to":600,"level":38}],"600":[{"to":601,"level":49}],"602":[{"to":603,"level":39}],"603":[{"to":604,"item":"thunder-stone"}],"605":[{"to":606,"level":42}],"607":[{"to":608,"level":41}],"608":[{"to":609,"item":"dusk-stone"}],"610":[{"to":611,"level":38}],"611":[{"to":612,"level":48}],"613":[{"to":614,"level":37}],"616":[{"to":617,"level":1}],"619":[{"to":620,"level":50}],"622":[{"to":623,"level":43}],"624":[{"to":625,"level":52}],"627":[{"to":628,"level":54}],"629":[{"to":630,"level":54}],"633":[{"to":634,"level":50}],"634":[{"to":635,"level":64}],"636":[{"to":637,"level":59}]},"typeChart":{"normal":{"rock":0.5,"ghost":0,"steel":0.5},"fire":{"fire":0.5,"water":0.5,"grass":2,"ice":2,"bug":2,"rock":0.5,"dragon":0.5,"steel":2},"water":{"fire":2,"water":0.5,"grass":0.5,"ground":2,"rock":2,"dragon":0.5},"electric":{"water":2,"electric":0.5,"grass":0.5,"ground":0,"flying":2,"dragon":0.5},"grass":{"fire":0.5,"water":2,"grass":0.5,"poison":0.5,"ground":2,"flying":0.5,"bug":0.5,"rock":2,"dragon":0.5,"steel":0.5},"ice":{"fire":0.5,"water":0.5,"grass":2,"ice":0.5,"ground":2,"flying":2,"dragon":2,"steel":0.5},"fighting":{"normal":2,"ice":2,"poison":0.5,"flying":0.5,"psychic":0.5,"bug":0.5,"rock":2,"ghost":0,"dark":2,"steel":2,"fairy":0.5},"poison":{"grass":2,"poison":0.5,"ground":0.5,"rock":0.5,"ghost":0.5,"steel":0,"fairy":2},"ground":{"fire":2,"electric":2,"grass":0.5,"poison":2,"flying":0,"bug":0.5,"rock":2,"steel":2},"flying":{"electric":0.5,"grass":2,"fighting":2,"bug":2,"rock":0.5,"steel":0.5},"psychic":{"fighting":2,"poison":2,"psychic":0.5,"dark":0,"steel":0.5},"bug":{"fire":0.5,"grass":2,"fighting":0.5,"poison":0.5,"flying":0.5,"psychic":2,"ghost":0.5,"dark":2,"steel":0.5,"fairy":0.5},"rock":{"fire":2,"ice":2,"fighting":0.5,"ground":0.5,"flying":2,"bug":2,"steel":0.5},"ghost":{"normal":0,"psychic":2,"ghost":2,"dark":0.5},"dragon":{"dragon":2,"steel":0.5,"fairy":0},"dark":{"fighting":0.5,"psychic":2,"ghost":2,"dark":0.5,"fairy":0.5},"steel":{"fire":0.5,"water":0.5,"electric":0.5,"ice":2,"rock":2,"steel":0.5,"fairy":2},"fairy":{"fire":0.5,"fighting":2,"poison":0.5,"dragon":2,"dark":2,"steel":0.5}},"chapters":[{"index":0,"name":"灰色徽章","sourceName":"Badge Roche","region":"kanto","league":false,"day":true,"ace":15,"gym":true,"champion":false,"levelCap":20,"steps":[{"stepIndex":0,"kind":"gift","name":"大木博士的研究所","sourceName":"Labo du Prof. Chen"},{"stepIndex":1,"kind":"route","name":"1号道路","sourceName":"Route 1","wild":3,"trainers":0,"areas":["kanto-route-1-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[2,3]},{"stepIndex":2,"kind":"heal","name":"常青市","sourceName":"Jadielle"},{"stepIndex":3,"kind":"route","name":"2号道路","sourceName":"Route 2","wild":2,"trainers":0,"areas":["kanto-route-2-south-towards-viridian-city"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[4,7]},{"stepIndex":4,"kind":"route","name":"常青森林","sourceName":"Forêt de Jade","wild":4,"trainers":2,"areas":["viridian-forest-area"],"species":[],"habitat":null,"bg":"forest","climate":null,"levelBand":[11,15]},{"stepIndex":5,"kind":"heal","name":"深灰市","sourceName":"Argenta"},{"stepIndex":6,"kind":"find","name":"深灰博物馆","sourceName":"Musée d'Argenta"},{"stepIndex":7,"kind":"gym","name":"深灰道馆","sourceName":"Arène d'Argenta","team":[[74,14],[95,15]],"ace":15,"aceOffset":0,"power":1.22,"double":false,"badge":"Roche","champion":false,"type":"rock"}],"routes":[{"stepIndex":1,"kind":"route","name":"1号道路","sourceName":"Route 1","habitat":null,"bg":"prairie","wild":3,"trainers":0,"areas":["kanto-route-1-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[2,3]},{"stepIndex":3,"kind":"route","name":"2号道路","sourceName":"Route 2","habitat":null,"bg":"prairie","wild":2,"trainers":0,"areas":["kanto-route-2-south-towards-viridian-city"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[4,7]},{"stepIndex":4,"kind":"route","name":"常青森林","sourceName":"Forêt de Jade","habitat":null,"bg":"forest","wild":4,"trainers":2,"areas":["viridian-forest-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[11,15]}],"staticEncounters":[],"boss":{"name":"小刚","type":"rock","team":[[74,14],[95,15]],"badge":"Roche","champion":false,"ace":15,"aceOffset":0,"power":1.22,"double":false}},{"index":1,"name":"蓝色徽章","sourceName":"Badge Cascade","region":"kanto","league":false,"day":false,"ace":21,"gym":true,"champion":false,"levelCap":24,"steps":[{"stepIndex":0,"kind":"route","name":"3号道路","sourceName":"Route 3","wild":2,"trainers":3,"areas":["kanto-route-3-area"],"species":[],"habitat":null,"bg":"mountain","climate":null,"levelBand":[16,18]},{"stepIndex":1,"kind":"gift","name":"宝可梦中心（4号道路）","sourceName":"Centre Pokémon (Route 4)"},{"stepIndex":2,"kind":"route","name":"月见山","sourceName":"Mont Sélénite","wild":4,"trainers":2,"areas":["mt-moon-1f","mt-moon-b1f","mt-moon-b2f"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[18,20]},{"stepIndex":3,"kind":"gift","name":"月见山","sourceName":"Mont Sélénite"},{"stepIndex":4,"kind":"route","name":"4号道路","sourceName":"Route 4","wild":3,"trainers":2,"areas":["kanto-route-4-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[20,21]},{"stepIndex":5,"kind":"heal","name":"华蓝市","sourceName":"Azuria"},{"stepIndex":6,"kind":"route","name":"金球大桥","sourceName":"Pont Pépite","wild":4,"trainers":5,"areas":["kanto-route-24-area","kanto-route-25-area"],"species":[],"habitat":null,"bg":"lake","climate":null,"levelBand":[21,23]},{"stepIndex":7,"kind":"heal","name":"华蓝市","sourceName":"Azuria"},{"stepIndex":8,"kind":"gym","name":"华蓝道馆","sourceName":"Arène d'Azuria","team":[[120,18],[54,19],[121,21]],"ace":null,"aceOffset":0,"power":1.06,"double":false,"badge":"Cascade","champion":false,"type":"water"}],"routes":[{"stepIndex":0,"kind":"route","name":"3号道路","sourceName":"Route 3","habitat":null,"bg":"mountain","wild":2,"trainers":3,"areas":["kanto-route-3-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[16,18]},{"stepIndex":2,"kind":"route","name":"月见山","sourceName":"Mont Sélénite","habitat":null,"bg":"cave","wild":4,"trainers":2,"areas":["mt-moon-1f","mt-moon-b1f","mt-moon-b2f"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[18,20]},{"stepIndex":4,"kind":"route","name":"4号道路","sourceName":"Route 4","habitat":null,"bg":"prairie","wild":3,"trainers":2,"areas":["kanto-route-4-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[20,21]},{"stepIndex":6,"kind":"route","name":"金球大桥","sourceName":"Pont Pépite","habitat":null,"bg":"lake","wild":4,"trainers":5,"areas":["kanto-route-24-area","kanto-route-25-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[21,23]}],"staticEncounters":[],"boss":{"name":"小霞","type":"water","team":[[120,18],[54,19],[121,21]],"badge":"Cascade","champion":false,"ace":null,"aceOffset":0,"power":1.06,"double":false}},{"index":2,"name":"橙色徽章","sourceName":"Badge Foudre","region":"kanto","league":false,"day":false,"ace":24,"gym":true,"champion":false,"levelCap":30,"steps":[{"stepIndex":0,"kind":"route","name":"5号道路","sourceName":"Route 5","wild":3,"trainers":2,"areas":["kanto-route-5-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[24,25]},{"stepIndex":1,"kind":"route","name":"6号道路","sourceName":"Route 6","wild":3,"trainers":2,"areas":["kanto-route-6-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[25,26]},{"stepIndex":2,"kind":"heal","name":"枯叶市","sourceName":"Carmin sur Mer"},{"stepIndex":3,"kind":"route","name":"圣特安努号","sourceName":"Océane","wild":0,"trainers":3,"areas":["kanto-route-6-area"],"species":[],"habitat":null,"bg":"pier","climate":null,"levelBand":[26,27]},{"stepIndex":4,"kind":"route","name":"11号道路","sourceName":"Route 11","wild":4,"trainers":3,"areas":["kanto-route-11-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[27,28]},{"stepIndex":5,"kind":"route","name":"地鼠洞穴","sourceName":"Grotte Taupiqueur","wild":4,"trainers":1,"areas":["digletts-cave-area"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[28,29]},{"stepIndex":6,"kind":"heal","name":"枯叶市","sourceName":"Carmin sur Mer"},{"stepIndex":7,"kind":"gym","name":"枯叶道馆","sourceName":"Arène de Carmin","team":[[100,21],[25,18],[82,22],[26,24]],"ace":null,"aceOffset":0,"power":1.15,"double":false,"badge":"Foudre","champion":false,"type":"electric"}],"routes":[{"stepIndex":0,"kind":"route","name":"5号道路","sourceName":"Route 5","habitat":null,"bg":"prairie","wild":3,"trainers":2,"areas":["kanto-route-5-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[24,25]},{"stepIndex":1,"kind":"route","name":"6号道路","sourceName":"Route 6","habitat":null,"bg":"prairie","wild":3,"trainers":2,"areas":["kanto-route-6-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[25,26]},{"stepIndex":4,"kind":"route","name":"11号道路","sourceName":"Route 11","habitat":null,"bg":"prairie","wild":4,"trainers":3,"areas":["kanto-route-11-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[27,28]},{"stepIndex":5,"kind":"route","name":"地鼠洞穴","sourceName":"Grotte Taupiqueur","habitat":null,"bg":"cave","wild":4,"trainers":1,"areas":["digletts-cave-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[28,29]}],"staticEncounters":[],"boss":{"name":"马志士","type":"electric","team":[[100,21],[25,18],[82,22],[26,24]],"badge":"Foudre","champion":false,"ace":null,"aceOffset":0,"power":1.15,"double":false}},{"index":3,"name":"彩虹徽章","sourceName":"Badge Prisme","region":"kanto","league":false,"day":false,"ace":29,"gym":true,"champion":false,"levelCap":38,"steps":[{"stepIndex":0,"kind":"route","name":"9号道路","sourceName":"Route 9","wild":2,"trainers":2,"areas":["kanto-route-9-area"],"species":[],"habitat":null,"bg":"mountain","climate":null,"levelBand":[30,31]},{"stepIndex":1,"kind":"route","name":"10号道路","sourceName":"Route 10","wild":2,"trainers":0,"areas":["kanto-route-10-area"],"species":[],"habitat":null,"bg":"mountain","climate":null,"levelBand":[31,33]},{"stepIndex":2,"kind":"route","name":"洞窟","sourceName":"Grotte","wild":4,"trainers":3,"areas":["rock-tunnel-b1f","rock-tunnel-b2f"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[33,34]},{"stepIndex":3,"kind":"heal","name":"紫苑镇","sourceName":"Lavanville"},{"stepIndex":4,"kind":"route","name":"8号道路","sourceName":"Route 8","wild":3,"trainers":2,"areas":["kanto-route-8-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[34,36]},{"stepIndex":5,"kind":"route","name":"7号道路","sourceName":"Route 7","wild":2,"trainers":0,"areas":["kanto-route-7-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[36,37]},{"stepIndex":6,"kind":"heal","name":"玉虹市","sourceName":"Céladopole"},{"stepIndex":7,"kind":"gift","name":"玉虹公寓","sourceName":"Manoir Céladon"},{"stepIndex":8,"kind":"gym","name":"玉虹道馆","sourceName":"Arène de Céladopole","team":[[114,24],[47,27],[103,26],[71,29],[45,29]],"ace":null,"aceOffset":0,"power":1.1,"double":false,"badge":"Prisme","champion":false,"type":"grass"}],"routes":[{"stepIndex":0,"kind":"route","name":"9号道路","sourceName":"Route 9","habitat":null,"bg":"mountain","wild":2,"trainers":2,"areas":["kanto-route-9-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[30,31]},{"stepIndex":1,"kind":"route","name":"10号道路","sourceName":"Route 10","habitat":null,"bg":"mountain","wild":2,"trainers":0,"areas":["kanto-route-10-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[31,33]},{"stepIndex":2,"kind":"route","name":"洞窟","sourceName":"Grotte","habitat":null,"bg":"cave","wild":4,"trainers":3,"areas":["rock-tunnel-b1f","rock-tunnel-b2f"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[33,34]},{"stepIndex":4,"kind":"route","name":"8号道路","sourceName":"Route 8","habitat":null,"bg":"prairie","wild":3,"trainers":2,"areas":["kanto-route-8-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[34,36]},{"stepIndex":5,"kind":"route","name":"7号道路","sourceName":"Route 7","habitat":null,"bg":"prairie","wild":2,"trainers":0,"areas":["kanto-route-7-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[36,37]}],"staticEncounters":[],"boss":{"name":"莉佳","type":"grass","team":[[114,24],[47,27],[103,26],[71,29],[45,29]],"badge":"Prisme","champion":false,"ace":null,"aceOffset":0,"power":1.1,"double":false}},{"index":4,"name":"粉红徽章","sourceName":"Badge Âme","region":"kanto","league":false,"day":false,"ace":43,"gym":true,"champion":false,"levelCap":46,"steps":[{"stepIndex":0,"kind":"route","name":"宝可梦塔","sourceName":"Tour Pokémon","wild":4,"trainers":2,"areas":["pokemon-tower-3f","pokemon-tower-4f","pokemon-tower-5f","pokemon-tower-6f","pokemon-tower-7f"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[38,40]},{"stepIndex":1,"kind":"static","name":"宝可梦塔","sourceName":"Tour Pokémon","id":105,"level":45,"power":1},{"stepIndex":2,"kind":"heal","name":"紫苑镇","sourceName":"Lavanville"},{"stepIndex":3,"kind":"static","name":"12号道路","sourceName":"Route 12","id":143,"level":38,"power":1},{"stepIndex":4,"kind":"route","name":"12-13号道路","sourceName":"Route 12-13","wild":3,"trainers":3,"areas":["kanto-route-12-area","kanto-route-13-area"],"species":[],"habitat":null,"bg":"lake","climate":null,"levelBand":[40,42]},{"stepIndex":5,"kind":"route","name":"14-15号道路","sourceName":"Route 14-15","wild":3,"trainers":2,"areas":["kanto-route-14-area","kanto-route-15-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[42,43]},{"stepIndex":6,"kind":"heal","name":"浅红市","sourceName":"Parmanie"},{"stepIndex":7,"kind":"route","name":"狩猎地带","sourceName":"Parc Safari","wild":5,"trainers":0,"areas":["kanto-safari-zone-middle","kanto-safari-zone-area-1-east","kanto-safari-zone-area-2-north","kanto-safari-zone-area-3-west"],"species":[],"habitat":null,"bg":"forest","climate":null,"levelBand":[43,45]},{"stepIndex":8,"kind":"heal","name":"浅红市","sourceName":"Parmanie"},{"stepIndex":9,"kind":"gym","name":"浅红道馆","sourceName":"Arène de Parmanie","team":[[109,37],[42,38],[89,39],[49,38],[109,37],[110,43]],"ace":null,"aceOffset":0,"power":1.2,"double":false,"badge":"Âme","champion":false,"type":"poison"}],"routes":[{"stepIndex":0,"kind":"route","name":"宝可梦塔","sourceName":"Tour Pokémon","habitat":null,"bg":"cave","wild":4,"trainers":2,"areas":["pokemon-tower-3f","pokemon-tower-4f","pokemon-tower-5f","pokemon-tower-6f","pokemon-tower-7f"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[38,40]},{"stepIndex":4,"kind":"route","name":"12-13号道路","sourceName":"Route 12-13","habitat":null,"bg":"lake","wild":3,"trainers":3,"areas":["kanto-route-12-area","kanto-route-13-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[40,42]},{"stepIndex":5,"kind":"route","name":"14-15号道路","sourceName":"Route 14-15","habitat":null,"bg":"prairie","wild":3,"trainers":2,"areas":["kanto-route-14-area","kanto-route-15-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[42,43]},{"stepIndex":7,"kind":"route","name":"狩猎地带","sourceName":"Parc Safari","habitat":null,"bg":"forest","wild":5,"trainers":0,"areas":["kanto-safari-zone-middle","kanto-safari-zone-area-1-east","kanto-safari-zone-area-2-north","kanto-safari-zone-area-3-west"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[43,45]}],"staticEncounters":[],"boss":{"name":"阿桔","type":"poison","team":[[109,37],[42,38],[89,39],[49,38],[109,37],[110,43]],"badge":"Âme","champion":false,"ace":null,"aceOffset":0,"power":1.2,"double":false}},{"index":5,"name":"金色徽章","sourceName":"Badge Marais","region":"kanto","league":false,"day":false,"ace":43,"gym":true,"champion":false,"levelCap":54,"steps":[{"stepIndex":0,"kind":"route","name":"自行车道","sourceName":"Piste Cyclable","wild":4,"trainers":2,"areas":["kanto-route-16-area","kanto-route-17-area","kanto-route-18-area"],"species":[],"habitat":null,"bg":"pier","climate":null,"levelBand":[46,48]},{"stepIndex":1,"kind":"heal","name":"玉虹市","sourceName":"Céladopole"},{"stepIndex":2,"kind":"route","name":"火箭队基地","sourceName":"Repaire Rocket","wild":0,"trainers":3,"areas":["kanto-route-7-area","kanto-route-8-area"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[48,50]},{"stepIndex":3,"kind":"unlock","name":"火箭队基地","sourceName":"Repaire Rocket"},{"stepIndex":4,"kind":"route","name":"7-8号道路","sourceName":"Routes 7-8","wild":4,"trainers":1,"areas":["kanto-route-7-area","kanto-route-8-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[50,51]},{"stepIndex":5,"kind":"heal","name":"金黄市","sourceName":"Safrania"},{"stepIndex":6,"kind":"gift","name":"格斗道场","sourceName":"Dojo de Safrania"},{"stepIndex":7,"kind":"route","name":"西尔佛公司","sourceName":"Sylphe SARL","wild":0,"trainers":3,"areas":["saffron-city-silph-co-7f"],"species":[],"habitat":null,"bg":"town","climate":null,"levelBand":[51,53]},{"stepIndex":8,"kind":"find","name":"西尔佛公司7楼","sourceName":"Sylphe SARL 7e"},{"stepIndex":9,"kind":"heal","name":"金黄市","sourceName":"Safrania"},{"stepIndex":10,"kind":"gym","name":"金黄道馆","sourceName":"Arène de Safrania","team":[[64,38],[122,37],[97,38],[121,38],[49,38],[65,43]],"ace":null,"aceOffset":0,"power":0.79,"double":false,"badge":"Marais","champion":false,"type":"psychic"}],"routes":[{"stepIndex":0,"kind":"route","name":"自行车道","sourceName":"Piste Cyclable","habitat":null,"bg":"pier","wild":4,"trainers":2,"areas":["kanto-route-16-area","kanto-route-17-area","kanto-route-18-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[46,48]},{"stepIndex":4,"kind":"route","name":"7-8号道路","sourceName":"Routes 7-8","habitat":null,"bg":"prairie","wild":4,"trainers":1,"areas":["kanto-route-7-area","kanto-route-8-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[50,51]}],"staticEncounters":[],"boss":{"name":"娜姿","type":"psychic","team":[[64,38],[122,37],[97,38],[121,38],[49,38],[65,43]],"badge":"Marais","champion":false,"ace":null,"aceOffset":0,"power":0.79,"double":false}},{"index":6,"name":"深红徽章","sourceName":"Badge Volcan","region":"kanto","league":false,"day":false,"ace":47,"gym":true,"champion":false,"levelCap":62,"steps":[{"stepIndex":0,"kind":"route","name":"19-20号道路","sourceName":"Routes 19-20","wild":2,"trainers":3,"areas":["kanto-sea-route-19-area","kanto-sea-route-20-area"],"species":[],"habitat":null,"bg":"pier","climate":null,"levelBand":[54,56]},{"stepIndex":1,"kind":"route","name":"无人发电厂","sourceName":"Centrale","wild":2,"trainers":2,"areas":["kanto-power-plant-area"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[56,58]},{"stepIndex":2,"kind":"heal","name":"无人发电厂","sourceName":"Centrale"},{"stepIndex":3,"kind":"route","name":"双子岛","sourceName":"Îles Écume","wild":3,"trainers":3,"areas":["seafoam-islands-1f","seafoam-islands-b1f","seafoam-islands-b2f","seafoam-islands-b3f","seafoam-islands-b4f"],"species":[],"habitat":null,"bg":"cave","climate":{"rain":3,"storm":1},"levelBand":[58,59]},{"stepIndex":4,"kind":"heal","name":"红莲岛","sourceName":"Cramois'Île"},{"stepIndex":5,"kind":"trade","name":"红莲岛研究所","sourceName":"Labo de Cramois'Île"},{"stepIndex":6,"kind":"route","name":"宝可梦屋","sourceName":"Manoir Pokémon","wild":3,"trainers":3,"areas":["pokemon-mansion-1f","pokemon-mansion-2f","pokemon-mansion-3f","pokemon-mansion-b1f"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[59,61]},{"stepIndex":7,"kind":"heal","name":"红莲岛","sourceName":"Cramois'Île"},{"stepIndex":8,"kind":"gym","name":"红莲道馆","sourceName":"Arène de Cramois'Île","team":[[58,42],[77,40],[126,43],[38,42],[78,42],[59,47]],"ace":null,"aceOffset":0,"power":1.14,"double":false,"badge":"Volcan","champion":false,"type":"fire"}],"routes":[{"stepIndex":0,"kind":"route","name":"19-20号道路","sourceName":"Routes 19-20","habitat":null,"bg":"pier","wild":2,"trainers":3,"areas":["kanto-sea-route-19-area","kanto-sea-route-20-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[54,56]},{"stepIndex":1,"kind":"route","name":"无人发电厂","sourceName":"Centrale","habitat":null,"bg":"cave","wild":2,"trainers":2,"areas":["kanto-power-plant-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[56,58]},{"stepIndex":3,"kind":"route","name":"双子岛","sourceName":"Îles Écume","habitat":null,"bg":"cave","wild":3,"trainers":3,"areas":["seafoam-islands-1f","seafoam-islands-b1f","seafoam-islands-b2f","seafoam-islands-b3f","seafoam-islands-b4f"],"species":[],"day":false,"night":false,"skies":[],"climate":{"rain":3,"storm":1},"levelBand":[58,59]},{"stepIndex":6,"kind":"route","name":"宝可梦屋","sourceName":"Manoir Pokémon","habitat":null,"bg":"cave","wild":3,"trainers":3,"areas":["pokemon-mansion-1f","pokemon-mansion-2f","pokemon-mansion-3f","pokemon-mansion-b1f"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[59,61]}],"staticEncounters":[],"boss":{"name":"夏伯","type":"fire","team":[[58,42],[77,40],[126,43],[38,42],[78,42],[59,47]],"badge":"Volcan","champion":false,"ace":null,"aceOffset":0,"power":1.14,"double":false}},{"index":7,"name":"绿色徽章","sourceName":"Badge Terre","region":"kanto","league":false,"day":false,"ace":50,"gym":true,"champion":false,"levelCap":70,"steps":[{"stepIndex":0,"kind":"route","name":"21号道路","sourceName":"Route 21","wild":3,"trainers":3,"areas":["kanto-sea-route-21-area"],"species":[],"habitat":null,"bg":"pier","climate":null,"levelBand":[62,64]},{"stepIndex":1,"kind":"heal","name":"真新镇","sourceName":"Bourg Palette"},{"stepIndex":2,"kind":"route","name":"1号道路","sourceName":"Route 1","wild":3,"trainers":2,"areas":["kanto-route-1-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[64,66]},{"stepIndex":3,"kind":"route","name":"常青森林","sourceName":"Forêt de Jade","wild":3,"trainers":2,"areas":["viridian-forest-area"],"species":[],"habitat":null,"bg":"forest","climate":null,"levelBand":[66,67]},{"stepIndex":4,"kind":"heal","name":"常青市","sourceName":"Jadielle"},{"stepIndex":5,"kind":"route","name":"22号道路","sourceName":"Route 22","wild":3,"trainers":1,"areas":["kanto-route-22-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[67,69]},{"stepIndex":6,"kind":"heal","name":"常青市","sourceName":"Jadielle"},{"stepIndex":7,"kind":"gym","name":"常青道馆","sourceName":"Arène de Jadielle","team":[[111,45],[51,42],[53,44],[31,44],[34,45],[112,50]],"ace":null,"aceOffset":0,"power":1.27,"double":false,"badge":"Terre","champion":false,"type":"ground"}],"routes":[{"stepIndex":0,"kind":"route","name":"21号道路","sourceName":"Route 21","habitat":null,"bg":"pier","wild":3,"trainers":3,"areas":["kanto-sea-route-21-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[62,64]},{"stepIndex":2,"kind":"route","name":"1号道路","sourceName":"Route 1","habitat":null,"bg":"prairie","wild":3,"trainers":2,"areas":["kanto-route-1-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[64,66]},{"stepIndex":3,"kind":"route","name":"常青森林","sourceName":"Forêt de Jade","habitat":null,"bg":"forest","wild":3,"trainers":2,"areas":["viridian-forest-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[66,67]},{"stepIndex":5,"kind":"route","name":"22号道路","sourceName":"Route 22","habitat":null,"bg":"prairie","wild":3,"trainers":1,"areas":["kanto-route-22-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[67,69]}],"staticEncounters":[],"boss":{"name":"坂木","type":"ground","team":[[111,45],[51,42],[53,44],[31,44],[34,45],[112,50]],"badge":"Terre","champion":false,"ace":null,"aceOffset":0,"power":1.27,"double":false}},{"index":8,"name":"冠军之路","sourceName":"Route Victoire","region":"kanto","league":false,"day":false,"ace":75,"gym":true,"champion":false,"levelCap":75,"steps":[{"stepIndex":0,"kind":"route","name":"23号道路","sourceName":"Route 23","wild":3,"trainers":4,"areas":["kanto-route-23-area"],"species":[],"habitat":null,"bg":"mountain","climate":null,"levelBand":[70,72]},{"stepIndex":1,"kind":"heal","name":"冠军之路","sourceName":"Route Victoire"},{"stepIndex":2,"kind":"route","name":"冠军之路","sourceName":"Route Victoire","wild":3,"trainers":5,"areas":["kanto-victory-road-2-1f","kanto-victory-road-2-2f","kanto-victory-road-2-3f"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[72,74]},{"stepIndex":3,"kind":"heal","name":"冠军之路","sourceName":"Route Victoire"},{"stepIndex":4,"kind":"gym","name":"冠军之路","sourceName":"Route Victoire","team":[[18,47],[65,47],[112,45],[103,45],[59,45],[9,53]],"ace":null,"aceOffset":0,"power":1.43,"double":false,"badge":null,"champion":false,"type":"normal"}],"routes":[{"stepIndex":0,"kind":"route","name":"23号道路","sourceName":"Route 23","habitat":null,"bg":"mountain","wild":3,"trainers":4,"areas":["kanto-route-23-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[70,72]},{"stepIndex":2,"kind":"route","name":"冠军之路","sourceName":"Route Victoire","habitat":null,"bg":"cave","wild":3,"trainers":5,"areas":["kanto-victory-road-2-1f","kanto-victory-road-2-2f","kanto-victory-road-2-3f"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[72,74]}],"staticEncounters":[],"boss":{"name":"青绿","type":"normal","team":[[18,47],[65,47],[112,45],[103,45],[59,45],[9,53]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":1.43,"double":false}},{"index":9,"name":"四天王：科拿","sourceName":"Conseil 4 : Olga","region":"kanto","league":true,"day":false,"ace":80,"gym":true,"champion":false,"levelCap":83,"steps":[{"stepIndex":0,"kind":"heal","name":"石英高原","sourceName":"Plateau Indigo"},{"stepIndex":1,"kind":"route","name":"房间","sourceName":"Salle","wild":0,"trainers":4,"areas":["seafoam-islands-1f","seafoam-islands-b1f","seafoam-islands-b2f","seafoam-islands-b3f","seafoam-islands-b4f"],"species":[],"habitat":null,"bg":"gym-water","climate":null,"levelBand":[75,79]},{"stepIndex":2,"kind":"gym","name":"第4房间","sourceName":"Salle 4","team":[[87,54],[91,53],[73,55],[80,54],[124,56],[131,56]],"ace":null,"aceOffset":0,"power":0.36,"double":false,"badge":null,"champion":false,"type":"ice"}],"routes":[],"staticEncounters":[],"boss":{"name":"科拿","type":"ice","team":[[87,54],[91,53],[73,55],[80,54],[124,56],[131,56]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":0.36,"double":false}},{"index":10,"name":"四天王：希巴","sourceName":"Conseil 4 : Aldo","region":"kanto","league":true,"day":false,"ace":85,"gym":true,"champion":false,"levelCap":88,"steps":[{"stepIndex":0,"kind":"heal","name":"石英高原","sourceName":"Plateau Indigo"},{"stepIndex":1,"kind":"route","name":"房间","sourceName":"Salle","wild":0,"trainers":4,"areas":["digletts-cave-area","kanto-victory-road-2-1f","kanto-victory-road-2-2f","kanto-victory-road-2-3f"],"species":[],"habitat":null,"bg":"gym-rock","climate":null,"levelBand":[80,84]},{"stepIndex":2,"kind":"gym","name":"第4房间","sourceName":"Salle 4","team":[[95,53],[107,55],[57,56],[106,55],[95,56],[68,58]],"ace":null,"aceOffset":0,"power":0.48,"double":false,"badge":null,"champion":false,"type":"fighting"}],"routes":[],"staticEncounters":[],"boss":{"name":"希巴","type":"fighting","team":[[95,53],[107,55],[57,56],[106,55],[95,56],[68,58]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":0.48,"double":false}},{"index":11,"name":"四天王：菊子","sourceName":"Conseil 4 : Agatha","region":"kanto","league":true,"day":false,"ace":90,"gym":true,"champion":false,"levelCap":93,"steps":[{"stepIndex":0,"kind":"heal","name":"石英高原","sourceName":"Plateau Indigo"},{"stepIndex":1,"kind":"route","name":"房间","sourceName":"Salle","wild":0,"trainers":4,"areas":["pokemon-tower-3f","pokemon-tower-4f","pokemon-tower-5f","pokemon-tower-6f","pokemon-tower-7f","pokemon-mansion-1f","pokemon-mansion-b1f"],"species":[],"habitat":null,"bg":"gym-poison","climate":null,"levelBand":[85,89]},{"stepIndex":2,"kind":"gym","name":"第4房间","sourceName":"Salle 4","team":[[94,56],[42,56],[110,56],[93,55],[24,58],[94,60]],"ace":null,"aceOffset":0,"power":0.73,"double":false,"badge":null,"champion":false,"type":"ghost"}],"routes":[],"staticEncounters":[],"boss":{"name":"菊子","type":"ghost","team":[[94,56],[42,56],[110,56],[93,55],[24,58],[94,60]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":0.73,"double":false}},{"index":12,"name":"四天王：阿渡","sourceName":"Conseil 4 : Peter","region":"kanto","league":true,"day":false,"ace":95,"gym":true,"champion":false,"levelCap":95,"steps":[{"stepIndex":0,"kind":"heal","name":"石英高原","sourceName":"Plateau Indigo"},{"stepIndex":1,"kind":"route","name":"房间","sourceName":"Salle","wild":0,"trainers":4,"areas":["kanto-safari-zone-middle","kanto-safari-zone-area-1-east","kanto-safari-zone-area-2-north","kanto-safari-zone-area-3-west","kanto-sea-route-19-area","kanto-sea-route-20-area"],"species":[],"habitat":null,"bg":"gym-psychic","climate":null,"levelBand":[90,94]},{"stepIndex":2,"kind":"gym","name":"第4房间","sourceName":"Salle 4","team":[[130,58],[148,56],[117,58],[148,56],[142,60],[149,62]],"ace":null,"aceOffset":0,"power":0.57,"double":false,"badge":null,"champion":false,"type":"dragon"}],"routes":[],"staticEncounters":[],"boss":{"name":"阿渡","type":"dragon","team":[[130,58],[148,56],[117,58],[148,56],[142,60],[149,62]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":0.57,"double":false}},{"index":13,"name":"联盟冠军","sourceName":"Maître de la Ligue","region":"kanto","league":true,"day":false,"ace":95,"gym":true,"champion":true,"levelCap":100,"steps":[{"stepIndex":0,"kind":"heal","name":"石英高原","sourceName":"Plateau Indigo"},{"stepIndex":1,"kind":"route","name":"房间","sourceName":"Salle","wild":0,"trainers":4,"areas":["kanto-route-22-area","kanto-route-23-area","kanto-victory-road-2-3f"],"species":[],"habitat":null,"bg":"gym-psychic","climate":null,"levelBand":[95,96]},{"stepIndex":2,"kind":"gym","name":"第4房间","sourceName":"Salle 4","team":[[18,59],[65,57],[112,59],[103,61],[59,61],[9,65]],"ace":null,"aceOffset":0,"power":1.72,"double":false,"badge":"Maître","champion":true,"type":"normal"}],"routes":[],"staticEncounters":[],"boss":{"name":"青绿","type":"normal","team":[[18,59],[65,57],[112,59],[103,61],[59,61],[9,65]],"badge":"Maître","champion":true,"ace":null,"aceOffset":0,"power":1.72,"double":false}},{"index":14,"name":"飞翼徽章","sourceName":"Badge Zéphyr","region":"johto","league":false,"day":false,"ace":9,"gym":true,"champion":false,"levelCap":18,"steps":[{"stepIndex":0,"kind":"gift","name":"空木博士的研究所","sourceName":"Labo du Prof. Orme"},{"stepIndex":1,"kind":"heal","name":"若叶镇","sourceName":"Bourg Geon"},{"stepIndex":2,"kind":"route","name":"29号道路","sourceName":"Route 29","wild":3,"trainers":0,"areas":["gsc:johto-route-29-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[2,3]},{"stepIndex":3,"kind":"heal","name":"吉花市","sourceName":"Ville Griotte"},{"stepIndex":4,"kind":"route","name":"30-31号道路","sourceName":"Routes 30-31","wild":5,"trainers":1,"areas":["gsc:johto-route-30-area","gsc:johto-route-31-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[4,7]},{"stepIndex":5,"kind":"heal","name":"桔梗市","sourceName":"Mauville"},{"stepIndex":6,"kind":"egg","name":"空木博士的助手","sourceName":"Assistant du Prof. Orme"},{"stepIndex":7,"kind":"route","name":"喇叭芽之塔","sourceName":"Tour Chétiflor","wild":3,"trainers":2,"areas":["gsc:sprout-tower-2f","gsc:sprout-tower-3f"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[11,15]},{"stepIndex":8,"kind":"heal","name":"桔梗市","sourceName":"Mauville"},{"stepIndex":9,"kind":"gym","name":"桔梗道馆","sourceName":"Arène de Mauville","team":[[16,7],[17,9]],"ace":null,"aceOffset":0,"power":1.27,"double":false,"badge":"Zéphyr","champion":false,"type":"flying"}],"routes":[{"stepIndex":2,"kind":"route","name":"29号道路","sourceName":"Route 29","habitat":null,"bg":"prairie","wild":3,"trainers":0,"areas":["gsc:johto-route-29-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[2,3]},{"stepIndex":4,"kind":"route","name":"30-31号道路","sourceName":"Routes 30-31","habitat":null,"bg":"prairie","wild":5,"trainers":1,"areas":["gsc:johto-route-30-area","gsc:johto-route-31-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[4,7]},{"stepIndex":7,"kind":"route","name":"喇叭芽之塔","sourceName":"Tour Chétiflor","habitat":null,"bg":"cave","wild":3,"trainers":2,"areas":["gsc:sprout-tower-2f","gsc:sprout-tower-3f"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[11,15]}],"staticEncounters":[],"boss":{"name":"阿速","type":"flying","team":[[16,7],[17,9]],"badge":"Zéphyr","champion":false,"ace":null,"aceOffset":0,"power":1.27,"double":false}},{"index":15,"name":"昆虫徽章","sourceName":"Badge Essaim","region":"johto","league":false,"day":false,"ace":16,"gym":true,"champion":false,"levelCap":24,"steps":[{"stepIndex":0,"kind":"route","name":"32号道路","sourceName":"Route 32","wild":3,"trainers":2,"areas":["gsc:johto-route-32-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[16,17]},{"stepIndex":1,"kind":"route","name":"阿露福遗迹","sourceName":"Ruines d'Alpha","wild":4,"trainers":0,"areas":[],"species":[201,20101,20102,20103,20104,20105,20106,20107,20108,20109,20110,20111,20112,20113,20114,20115,20116,20117,20118,20119,20120,20121,20122,20123,20124,20125,20126,20127,177,235],"habitat":null,"bg":"cave","indoor":false,"climate":"prairie","levelBand":[17,19]},{"stepIndex":2,"kind":"route","name":"连接洞窟","sourceName":"Caves Jumelles","wild":4,"trainers":2,"areas":["gsc:union-cave-1f","gsc:union-cave-b1f"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[19,20]},{"stepIndex":3,"kind":"route","name":"33号道路","sourceName":"Route 33","wild":2,"trainers":0,"areas":["gsc:johto-route-33-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[20,22]},{"stepIndex":4,"kind":"heal","name":"桧皮镇","sourceName":"Écorcia"},{"stepIndex":5,"kind":"route","name":"呆呆兽之井","sourceName":"Puits Ramoloss","wild":3,"trainers":3,"areas":["gsc:slowpoke-well-1f","gsc:slowpoke-well-b1f"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[22,23]},{"stepIndex":6,"kind":"find","name":"呆呆兽之井","sourceName":"Puits Ramoloss"},{"stepIndex":7,"kind":"heal","name":"桧皮镇","sourceName":"Écorcia"},{"stepIndex":8,"kind":"gym","name":"桧皮道馆","sourceName":"Arène d'Écorcia","team":[[11,14],[14,14],[123,16]],"ace":null,"aceOffset":0,"power":0.94,"double":false,"badge":"Essaim","champion":false,"type":"bug"}],"routes":[{"stepIndex":0,"kind":"route","name":"32号道路","sourceName":"Route 32","habitat":null,"bg":"prairie","wild":3,"trainers":2,"areas":["gsc:johto-route-32-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[16,17]},{"stepIndex":1,"kind":"route","name":"阿露福遗迹","sourceName":"Ruines d'Alpha","habitat":null,"bg":"cave","indoor":false,"wild":4,"trainers":0,"areas":[],"species":[201,20101,20102,20103,20104,20105,20106,20107,20108,20109,20110,20111,20112,20113,20114,20115,20116,20117,20118,20119,20120,20121,20122,20123,20124,20125,20126,20127,177,235],"day":false,"night":false,"skies":[],"climate":"prairie","levelBand":[17,19]},{"stepIndex":2,"kind":"route","name":"连接洞窟","sourceName":"Caves Jumelles","habitat":null,"bg":"cave","wild":4,"trainers":2,"areas":["gsc:union-cave-1f","gsc:union-cave-b1f"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[19,20]},{"stepIndex":3,"kind":"route","name":"33号道路","sourceName":"Route 33","habitat":null,"bg":"prairie","wild":2,"trainers":0,"areas":["gsc:johto-route-33-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[20,22]},{"stepIndex":5,"kind":"route","name":"呆呆兽之井","sourceName":"Puits Ramoloss","habitat":null,"bg":"cave","wild":3,"trainers":3,"areas":["gsc:slowpoke-well-1f","gsc:slowpoke-well-b1f"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[22,23]}],"staticEncounters":[],"boss":{"name":"阿笔","type":"bug","team":[[11,14],[14,14],[123,16]],"badge":"Essaim","champion":false,"ace":null,"aceOffset":0,"power":0.94,"double":false}},{"index":16,"name":"平原徽章","sourceName":"Badge Plaine","region":"johto","league":false,"day":false,"ace":20,"gym":true,"champion":false,"levelCap":30,"steps":[{"stepIndex":0,"kind":"route","name":"桐树林","sourceName":"Bois aux Chênes","wild":4,"trainers":2,"areas":["gsc:ilex-forest-area"],"species":[],"habitat":null,"bg":"forest","climate":null,"levelBand":[24,26]},{"stepIndex":1,"kind":"route","name":"34号道路","sourceName":"Route 34","wild":3,"trainers":3,"areas":["gsc:johto-route-34-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[26,27]},{"stepIndex":2,"kind":"egg","name":"34号道路培育屋","sourceName":"Pension de la Route 34"},{"stepIndex":3,"kind":"heal","name":"满金市","sourceName":"Doublonville"},{"stepIndex":4,"kind":"gift","name":"正辉的家","sourceName":"Maison de Léo"},{"stepIndex":5,"kind":"find","name":"满金市","sourceName":"Doublonville"},{"stepIndex":6,"kind":"route","name":"35号道路","sourceName":"Route 35","wild":4,"trainers":3,"areas":["gsc:johto-route-35-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[27,29]},{"stepIndex":7,"kind":"heal","name":"满金市","sourceName":"Doublonville"},{"stepIndex":8,"kind":"gym","name":"满金道馆","sourceName":"Arène de Doublonville","team":[[35,18],[162,18],[203,19],[241,20]],"ace":null,"aceOffset":0,"power":0.8,"double":false,"badge":"Plaine","champion":false,"type":"normal"}],"routes":[{"stepIndex":0,"kind":"route","name":"桐树林","sourceName":"Bois aux Chênes","habitat":null,"bg":"forest","wild":4,"trainers":2,"areas":["gsc:ilex-forest-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[24,26]},{"stepIndex":1,"kind":"route","name":"34号道路","sourceName":"Route 34","habitat":null,"bg":"prairie","wild":3,"trainers":3,"areas":["gsc:johto-route-34-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[26,27]},{"stepIndex":6,"kind":"route","name":"35号道路","sourceName":"Route 35","habitat":null,"bg":"prairie","wild":4,"trainers":3,"areas":["gsc:johto-route-35-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[27,29]}],"staticEncounters":[],"boss":{"name":"小茜","type":"normal","team":[[35,18],[162,18],[203,19],[241,20]],"badge":"Plaine","champion":false,"ace":null,"aceOffset":0,"power":0.8,"double":false}},{"index":17,"name":"雾徽章","sourceName":"Badge Brume","region":"johto","league":false,"day":false,"ace":25,"gym":true,"champion":false,"levelCap":38,"steps":[{"stepIndex":0,"kind":"route","name":"自然公园","sourceName":"Parc Naturel","wild":4,"trainers":2,"areas":["gsc:national-park-area"],"species":[],"habitat":null,"bg":"forest","climate":null,"levelBand":[30,32]},{"stepIndex":1,"kind":"find","name":"自然公园","sourceName":"Parc Naturel"},{"stepIndex":2,"kind":"static","name":"36号道路","sourceName":"Route 36","id":185,"level":30,"power":1},{"stepIndex":3,"kind":"route","name":"36号道路","sourceName":"Route 36","wild":2,"trainers":1,"areas":["gsc:johto-route-36-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[32,34]},{"stepIndex":4,"kind":"route","name":"37号道路","sourceName":"Route 37","wild":3,"trainers":2,"areas":["gsc:johto-route-37-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[34,35]},{"stepIndex":5,"kind":"heal","name":"圆朱市","sourceName":"Rosalia"},{"stepIndex":6,"kind":"route","name":"烧焦塔","sourceName":"Tour Cendrée","wild":4,"trainers":2,"areas":["gsc:burned-tower-1f","gsc:burned-tower-b1f"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[35,37]},{"stepIndex":7,"kind":"trainer","name":"圆朱歌舞练场","sourceName":"Théâtre de Rosalia","team":[[134,33]],"scale":false,"below":null,"double":false},{"stepIndex":8,"kind":"trainer","name":"圆朱歌舞练场","sourceName":"Théâtre de Rosalia","team":[[135,34]],"scale":false,"below":null,"double":false},{"stepIndex":9,"kind":"trainer","name":"圆朱歌舞练场","sourceName":"Théâtre de Rosalia","team":[[136,35]],"scale":false,"below":null,"double":false},{"stepIndex":10,"kind":"trainer","name":"圆朱歌舞练场","sourceName":"Théâtre de Rosalia","team":[[196,36]],"scale":false,"below":null,"double":false},{"stepIndex":11,"kind":"trainer","name":"圆朱歌舞练场","sourceName":"Théâtre de Rosalia","team":[[197,37]],"scale":false,"below":null,"double":false},{"stepIndex":12,"kind":"heal","name":"圆朱市","sourceName":"Rosalia"},{"stepIndex":13,"kind":"gym","name":"圆朱道馆","sourceName":"Arène de Rosalia","team":[[92,21],[93,21],[200,22],[93,23],[94,25]],"ace":null,"aceOffset":0,"power":1.29,"double":false,"badge":"Brume","champion":false,"type":"ghost"}],"routes":[{"stepIndex":0,"kind":"route","name":"自然公园","sourceName":"Parc Naturel","habitat":null,"bg":"forest","wild":4,"trainers":2,"areas":["gsc:national-park-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[30,32]},{"stepIndex":3,"kind":"route","name":"36号道路","sourceName":"Route 36","habitat":null,"bg":"prairie","wild":2,"trainers":1,"areas":["gsc:johto-route-36-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[32,34]},{"stepIndex":4,"kind":"route","name":"37号道路","sourceName":"Route 37","habitat":null,"bg":"prairie","wild":3,"trainers":2,"areas":["gsc:johto-route-37-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[34,35]},{"stepIndex":6,"kind":"route","name":"烧焦塔","sourceName":"Tour Cendrée","habitat":null,"bg":"cave","wild":4,"trainers":2,"areas":["gsc:burned-tower-1f","gsc:burned-tower-b1f"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[35,37]}],"staticEncounters":[],"boss":{"name":"松叶","type":"ghost","team":[[92,21],[93,21],[200,22],[93,23],[94,25]],"badge":"Brume","champion":false,"ace":null,"aceOffset":0,"power":1.29,"double":false}},{"index":18,"name":"冲击徽章","sourceName":"Badge Choc","region":"johto","league":false,"day":false,"ace":30,"gym":true,"champion":false,"levelCap":46,"steps":[{"stepIndex":0,"kind":"route","name":"38号道路","sourceName":"Route 38","wild":4,"trainers":2,"areas":["gsc:johto-route-38-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[38,40]},{"stepIndex":1,"kind":"route","name":"39号道路","sourceName":"Route 39","wild":4,"trainers":3,"areas":["gsc:johto-route-39-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[40,43]},{"stepIndex":2,"kind":"heal","name":"浅葱市","sourceName":"Oliville"},{"stepIndex":3,"kind":"route","name":"40-41号道路","sourceName":"Routes 40-41","wild":4,"trainers":3,"areas":["gsc:johto-sea-route-40-area","gsc:johto-sea-route-41-area"],"species":[],"habitat":null,"bg":"pier","climate":null,"levelBand":[43,45]},{"stepIndex":4,"kind":"heal","name":"湛蓝市","sourceName":"Irisia"},{"stepIndex":5,"kind":"gift","name":"湛蓝市的民宅","sourceName":"Maison d'Irisia"},{"stepIndex":6,"kind":"gym","name":"湛蓝道馆","sourceName":"Arène d'Irisia","team":[[57,27],[67,27],[237,28],[106,28],[107,28],[62,30]],"ace":null,"aceOffset":0,"power":0.8,"double":false,"badge":"Choc","champion":false,"type":"fighting"}],"routes":[{"stepIndex":0,"kind":"route","name":"38号道路","sourceName":"Route 38","habitat":null,"bg":"prairie","wild":4,"trainers":2,"areas":["gsc:johto-route-38-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[38,40]},{"stepIndex":1,"kind":"route","name":"39号道路","sourceName":"Route 39","habitat":null,"bg":"prairie","wild":4,"trainers":3,"areas":["gsc:johto-route-39-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[40,43]},{"stepIndex":3,"kind":"route","name":"40-41号道路","sourceName":"Routes 40-41","habitat":null,"bg":"pier","wild":4,"trainers":3,"areas":["gsc:johto-sea-route-40-area","gsc:johto-sea-route-41-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[43,45]}],"staticEncounters":[],"boss":{"name":"阿四","type":"fighting","team":[[57,27],[67,27],[237,28],[106,28],[107,28],[62,30]],"badge":"Choc","champion":false,"ace":null,"aceOffset":0,"power":0.8,"double":false}},{"index":19,"name":"钢铁徽章","sourceName":"Badge Minéral","region":"johto","league":false,"day":false,"ace":35,"gym":true,"champion":false,"levelCap":54,"steps":[{"stepIndex":0,"kind":"route","name":"漩涡列岛","sourceName":"Îles Tourbillon","wild":4,"trainers":2,"areas":["gsc:whirl-islands-1f","gsc:whirl-islands-b1f","gsc:whirl-islands-b2f","gsc:whirl-islands-b3f"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[46,48]},{"stepIndex":1,"kind":"heal","name":"浅葱市","sourceName":"Oliville"},{"stepIndex":2,"kind":"route","name":"39号道路","sourceName":"Route 39","wild":4,"trainers":2,"areas":["gsc:johto-route-39-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[48,51]},{"stepIndex":3,"kind":"route","name":"浅葱灯塔","sourceName":"Phare d'Oliville","wild":3,"trainers":4,"areas":[],"species":[81,82,179,180,72,98,17,164],"habitat":null,"bg":"town","indoor":true,"climate":null,"levelBand":[51,53]},{"stepIndex":4,"kind":"find","name":"浅葱灯塔","sourceName":"Phare d'Oliville"},{"stepIndex":5,"kind":"heal","name":"浅葱市","sourceName":"Oliville"},{"stepIndex":6,"kind":"gym","name":"浅葱道馆","sourceName":"Arène d'Oliville","team":[[81,30],[81,30],[227,32],[205,32],[82,33],[208,35]],"ace":null,"aceOffset":0,"power":1.07,"double":false,"badge":"Minéral","champion":false,"type":"steel"}],"routes":[{"stepIndex":0,"kind":"route","name":"漩涡列岛","sourceName":"Îles Tourbillon","habitat":null,"bg":"cave","wild":4,"trainers":2,"areas":["gsc:whirl-islands-1f","gsc:whirl-islands-b1f","gsc:whirl-islands-b2f","gsc:whirl-islands-b3f"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[46,48]},{"stepIndex":2,"kind":"route","name":"39号道路","sourceName":"Route 39","habitat":null,"bg":"prairie","wild":4,"trainers":2,"areas":["gsc:johto-route-39-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[48,51]},{"stepIndex":3,"kind":"route","name":"浅葱灯塔","sourceName":"Phare d'Oliville","habitat":null,"bg":"town","indoor":true,"wild":3,"trainers":4,"areas":[],"species":[81,82,179,180,72,98,17,164],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[51,53]}],"staticEncounters":[],"boss":{"name":"阿蜜","type":"steel","team":[[81,30],[81,30],[227,32],[205,32],[82,33],[208,35]],"badge":"Minéral","champion":false,"ace":null,"aceOffset":0,"power":1.07,"double":false}},{"index":20,"name":"愤怒之湖","sourceName":"Lac Colère","region":"johto","league":false,"day":false,"ace":58,"gym":false,"champion":false,"levelCap":58,"steps":[{"stepIndex":0,"kind":"route","name":"42号道路","sourceName":"Route 42","wild":3,"trainers":2,"areas":["gsc:johto-route-42-area"],"species":[],"habitat":null,"bg":"mountain","climate":null,"levelBand":[54,55]},{"stepIndex":1,"kind":"heal","name":"擂钵山","sourceName":"Mont Creuset"},{"stepIndex":2,"kind":"route","name":"擂钵山","sourceName":"Mont Creuset","wild":4,"trainers":3,"areas":["gsc:mt-mortar-1f","gsc:mt-mortar-b1f","gsc:mt-mortar-lower-cave","gsc:mt-mortar-upper-cave"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[55,56]},{"stepIndex":3,"kind":"find","name":"擂钵山","sourceName":"Mont Creuset"},{"stepIndex":4,"kind":"gift","name":"擂钵山","sourceName":"Mont Creuset"},{"stepIndex":5,"kind":"heal","name":"卡吉镇","sourceName":"Acajou"},{"stepIndex":6,"kind":"route","name":"43号道路","sourceName":"Route 43","wild":3,"trainers":2,"areas":["gsc:johto-route-43-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[56,57]},{"stepIndex":7,"kind":"heal","name":"愤怒之湖","sourceName":"Lac Colère"},{"stepIndex":8,"kind":"route","name":"愤怒之湖","sourceName":"Lac Colère","wild":3,"trainers":2,"areas":["gsc:lake-of-rage-area"],"species":[],"habitat":null,"bg":"lake","climate":null,"levelBand":[56,57]},{"stepIndex":9,"kind":"static","name":"愤怒之湖","sourceName":"Lac Colère","id":130,"level":58,"power":1}],"routes":[{"stepIndex":0,"kind":"route","name":"42号道路","sourceName":"Route 42","habitat":null,"bg":"mountain","wild":3,"trainers":2,"areas":["gsc:johto-route-42-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[54,55]},{"stepIndex":2,"kind":"route","name":"擂钵山","sourceName":"Mont Creuset","habitat":null,"bg":"cave","wild":4,"trainers":3,"areas":["gsc:mt-mortar-1f","gsc:mt-mortar-b1f","gsc:mt-mortar-lower-cave","gsc:mt-mortar-upper-cave"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[55,56]},{"stepIndex":6,"kind":"route","name":"43号道路","sourceName":"Route 43","habitat":null,"bg":"prairie","wild":3,"trainers":2,"areas":["gsc:johto-route-43-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[56,57]},{"stepIndex":8,"kind":"route","name":"愤怒之湖","sourceName":"Lac Colère","habitat":null,"bg":"lake","wild":3,"trainers":2,"areas":["gsc:lake-of-rage-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[56,57]}],"staticEncounters":[],"boss":null},{"index":21,"name":"冰河徽章","sourceName":"Badge Glacier","region":"johto","league":false,"day":false,"ace":31,"gym":true,"champion":false,"levelCap":62,"steps":[{"stepIndex":0,"kind":"route","name":"43号道路","sourceName":"Route 43","wild":4,"trainers":2,"areas":["gsc:johto-route-43-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[58,59]},{"stepIndex":1,"kind":"heal","name":"卡吉镇","sourceName":"Acajou"},{"stepIndex":2,"kind":"route","name":"火箭队基地","sourceName":"Repaire Rocket","wild":3,"trainers":4,"areas":["gsc:team-rocket-hq-area"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[59,60]},{"stepIndex":3,"kind":"route","name":"火箭队基地B2","sourceName":"Repaire Rocket B2","wild":3,"trainers":3,"areas":["gsc:team-rocket-hq-area"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[60,61]},{"stepIndex":4,"kind":"static","name":"火箭队基地","sourceName":"Repaire Rocket","id":101,"level":56,"power":1},{"stepIndex":5,"kind":"heal","name":"卡吉镇","sourceName":"Acajou"},{"stepIndex":6,"kind":"gym","name":"卡吉道馆","sourceName":"Arène d'Acajou","team":[[86,27],[87,29],[215,29],[124,29],[91,30],[221,31]],"ace":null,"aceOffset":0,"power":1.12,"double":false,"badge":"Glacier","champion":false,"type":"ice"}],"routes":[{"stepIndex":0,"kind":"route","name":"43号道路","sourceName":"Route 43","habitat":null,"bg":"prairie","wild":4,"trainers":2,"areas":["gsc:johto-route-43-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[58,59]},{"stepIndex":2,"kind":"route","name":"火箭队基地","sourceName":"Repaire Rocket","habitat":null,"bg":"cave","wild":3,"trainers":4,"areas":["gsc:team-rocket-hq-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[59,60]},{"stepIndex":3,"kind":"route","name":"火箭队基地B2","sourceName":"Repaire Rocket B2","habitat":null,"bg":"cave","wild":3,"trainers":3,"areas":["gsc:team-rocket-hq-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[60,61]}],"staticEncounters":[],"boss":{"name":"柳伯","type":"ice","team":[[86,27],[87,29],[215,29],[124,29],[91,30],[221,31]],"badge":"Glacier","champion":false,"ace":null,"aceOffset":0,"power":1.12,"double":false}},{"index":22,"name":"广播塔","sourceName":"Tour Radio","region":"johto","league":false,"day":false,"ace":66,"gym":true,"champion":false,"levelCap":66,"steps":[{"stepIndex":0,"kind":"route","name":"满金市","sourceName":"Doublonville","wild":3,"trainers":2,"areas":[],"species":[19,20,52,53,88,89,109,110,81,82,100,101,198],"habitat":null,"bg":"town","climate":null,"levelBand":[62,63]},{"stepIndex":1,"kind":"route","name":"地下室","sourceName":"Sous-sol","wild":3,"trainers":3,"areas":[],"species":[19,20,52,53,88,89,109,110,81,82,100,101,198,228],"habitat":null,"bg":"cave","climate":null,"levelBand":[63,64]},{"stepIndex":2,"kind":"route","name":"广播塔","sourceName":"Tour Radio","wild":3,"trainers":3,"areas":[],"species":[19,20,52,53,88,89,109,110,81,82,100,101,198,228],"habitat":null,"bg":"town","indoor":true,"climate":null,"levelBand":[64,65]},{"stepIndex":3,"kind":"heal","name":"满金市","sourceName":"Doublonville"},{"stepIndex":4,"kind":"gym","name":"广播塔5楼","sourceName":"Tour Radio 5F","team":[[228,38],[109,38],[24,39],[110,40],[42,41],[229,42]],"ace":null,"aceOffset":0,"power":1.09,"double":false,"badge":null,"champion":false,"type":"dark"}],"routes":[{"stepIndex":0,"kind":"route","name":"满金市","sourceName":"Doublonville","habitat":null,"bg":"town","wild":3,"trainers":2,"areas":[],"species":[19,20,52,53,88,89,109,110,81,82,100,101,198],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[62,63]},{"stepIndex":1,"kind":"route","name":"地下室","sourceName":"Sous-sol","habitat":null,"bg":"cave","wild":3,"trainers":3,"areas":[],"species":[19,20,52,53,88,89,109,110,81,82,100,101,198,228],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[63,64]},{"stepIndex":2,"kind":"route","name":"广播塔","sourceName":"Tour Radio","habitat":null,"bg":"town","indoor":true,"wild":3,"trainers":3,"areas":[],"species":[19,20,52,53,88,89,109,110,81,82,100,101,198,228],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[64,65]}],"staticEncounters":[],"boss":{"name":"火箭队干部","type":"dark","team":[[228,38],[109,38],[24,39],[110,40],[42,41],[229,42]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":1.09,"double":false}},{"index":23,"name":"升龙徽章","sourceName":"Badge Lever","region":"johto","league":false,"day":false,"ace":40,"gym":true,"champion":false,"levelCap":70,"steps":[{"stepIndex":0,"kind":"route","name":"44号道路","sourceName":"Route 44","wild":3,"trainers":2,"areas":["gsc:johto-route-44-area"],"species":[],"habitat":null,"bg":"mountain","climate":null,"levelBand":[66,67]},{"stepIndex":1,"kind":"route","name":"冰之小径","sourceName":"Route de Glace","wild":3,"trainers":2,"areas":["gsc:ice-path-1f","gsc:ice-path-b1f","gsc:ice-path-b2f","gsc:ice-path-b3f"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[67,68]},{"stepIndex":2,"kind":"heal","name":"烟墨市","sourceName":"Ébènelle"},{"stepIndex":3,"kind":"route","name":"45-46号道路","sourceName":"Routes 45-46","wild":3,"trainers":2,"areas":["gsc:johto-route-45-area","gsc:johto-route-46-area"],"species":[],"habitat":null,"bg":"mountain","climate":null,"levelBand":[68,69]},{"stepIndex":4,"kind":"route","name":"龙之洞","sourceName":"Antre du Dragon","wild":3,"trainers":2,"areas":["gsc:dragons-den-area"],"species":[],"habitat":null,"bg":"lake","climate":null,"levelBand":[68,69]},{"stepIndex":5,"kind":"gift","name":"龙之洞","sourceName":"Antre du Dragon"},{"stepIndex":6,"kind":"heal","name":"烟墨市","sourceName":"Ébènelle"},{"stepIndex":7,"kind":"gym","name":"烟墨道馆","sourceName":"Arène d'Ébènelle","team":[[130,37],[148,37],[148,37],[148,37],[117,38],[230,40]],"ace":null,"aceOffset":0,"power":0.89,"double":false,"badge":"Lever","champion":false,"type":"dragon"}],"routes":[{"stepIndex":0,"kind":"route","name":"44号道路","sourceName":"Route 44","habitat":null,"bg":"mountain","wild":3,"trainers":2,"areas":["gsc:johto-route-44-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[66,67]},{"stepIndex":1,"kind":"route","name":"冰之小径","sourceName":"Route de Glace","habitat":null,"bg":"cave","wild":3,"trainers":2,"areas":["gsc:ice-path-1f","gsc:ice-path-b1f","gsc:ice-path-b2f","gsc:ice-path-b3f"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[67,68]},{"stepIndex":3,"kind":"route","name":"45-46号道路","sourceName":"Routes 45-46","habitat":null,"bg":"mountain","wild":3,"trainers":2,"areas":["gsc:johto-route-45-area","gsc:johto-route-46-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[68,69]},{"stepIndex":4,"kind":"route","name":"龙之洞","sourceName":"Antre du Dragon","habitat":null,"bg":"lake","wild":3,"trainers":2,"areas":["gsc:dragons-den-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[68,69]}],"staticEncounters":[],"boss":{"name":"小椿","type":"dragon","team":[[130,37],[148,37],[148,37],[148,37],[117,38],[230,40]],"badge":"Lever","champion":false,"ace":null,"aceOffset":0,"power":0.89,"double":false}},{"index":24,"name":"冠军之路","sourceName":"Route Victoire","region":"johto","league":false,"day":false,"ace":75,"gym":true,"champion":false,"levelCap":75,"steps":[{"stepIndex":0,"kind":"route","name":"26号道路","sourceName":"Route 26","wild":3,"trainers":3,"areas":["gsc:kanto-route-26-area"],"species":[],"habitat":null,"bg":"mountain","climate":null,"levelBand":[70,71]},{"stepIndex":1,"kind":"route","name":"27号道路","sourceName":"Route 27","wild":3,"trainers":2,"areas":["gsc:kanto-route-27-area"],"species":[],"habitat":null,"bg":"mountain","climate":null,"levelBand":[71,73]},{"stepIndex":2,"kind":"heal","name":"冠军之路","sourceName":"Route Victoire"},{"stepIndex":3,"kind":"route","name":"冠军之路","sourceName":"Route Victoire","wild":4,"trainers":3,"areas":["gsc:kanto-victory-road-1-1f","gsc:kanto-victory-road-1-2f","gsc:kanto-victory-road-1-3f"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[73,74]},{"stepIndex":4,"kind":"heal","name":"冠军之路","sourceName":"Route Victoire"},{"stepIndex":5,"kind":"gym","name":"冠军之路","sourceName":"Route Victoire","team":[[215,34],[169,36],[82,35],[94,35],[65,35],[160,38]],"ace":null,"aceOffset":0,"power":1.1,"double":false,"badge":null,"champion":false,"type":"dark"}],"routes":[{"stepIndex":0,"kind":"route","name":"26号道路","sourceName":"Route 26","habitat":null,"bg":"mountain","wild":3,"trainers":3,"areas":["gsc:kanto-route-26-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[70,71]},{"stepIndex":1,"kind":"route","name":"27号道路","sourceName":"Route 27","habitat":null,"bg":"mountain","wild":3,"trainers":2,"areas":["gsc:kanto-route-27-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[71,73]},{"stepIndex":3,"kind":"route","name":"冠军之路","sourceName":"Route Victoire","habitat":null,"bg":"cave","wild":4,"trainers":3,"areas":["gsc:kanto-victory-road-1-1f","gsc:kanto-victory-road-1-2f","gsc:kanto-victory-road-1-3f"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[73,74]}],"staticEncounters":[],"boss":{"name":"银","type":"dark","team":[[215,34],[169,36],[82,35],[94,35],[65,35],[160,38]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":1.1,"double":false}},{"index":25,"name":"四天王：一树","sourceName":"Conseil 4 : Clément","region":"johto","league":true,"day":false,"ace":80,"gym":true,"champion":false,"levelCap":83,"steps":[{"stepIndex":0,"kind":"heal","name":"石英高原","sourceName":"Plateau Indigo"},{"stepIndex":1,"kind":"route","name":"房间","sourceName":"Salle","wild":0,"trainers":4,"areas":["gsc:ruins-of-alph-outside","gsc:johto-route-36-area","gsc:johto-route-37-area"],"species":[],"habitat":null,"bg":"gym-psychic","climate":null,"levelBand":[75,79]},{"stepIndex":2,"kind":"gym","name":"第4房间","sourceName":"Salle 4","team":[[178,40],[203,41],[124,41],[103,41],[80,41],[178,42]],"ace":null,"aceOffset":0,"power":0.4,"double":false,"badge":null,"champion":false,"type":"psychic"}],"routes":[],"staticEncounters":[],"boss":{"name":"一树","type":"psychic","team":[[178,40],[203,41],[124,41],[103,41],[80,41],[178,42]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":0.4,"double":false}},{"index":26,"name":"四天王：阿桔","sourceName":"Conseil 4 : Koga","region":"johto","league":true,"day":false,"ace":85,"gym":true,"champion":false,"levelCap":88,"steps":[{"stepIndex":0,"kind":"heal","name":"石英高原","sourceName":"Plateau Indigo"},{"stepIndex":1,"kind":"route","name":"房间","sourceName":"Salle","wild":0,"trainers":4,"areas":["gsc:johto-route-43-area","gsc:ilex-forest-area","gsc:johto-route-34-area"],"species":[],"habitat":null,"bg":"gym-poison","climate":null,"levelBand":[80,84]},{"stepIndex":2,"kind":"gym","name":"第4房间","sourceName":"Salle 4","team":[[168,40],[49,41],[73,42],[205,43],[89,42],[169,44]],"ace":null,"aceOffset":0,"power":0.57,"double":false,"badge":null,"champion":false,"type":"poison"}],"routes":[],"staticEncounters":[],"boss":{"name":"阿桔","type":"poison","team":[[168,40],[49,41],[73,42],[205,43],[89,42],[169,44]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":0.57,"double":false}},{"index":27,"name":"四天王：希巴","sourceName":"Conseil 4 : Aldo","region":"johto","league":true,"day":false,"ace":90,"gym":true,"champion":false,"levelCap":93,"steps":[{"stepIndex":0,"kind":"heal","name":"石英高原","sourceName":"Plateau Indigo"},{"stepIndex":1,"kind":"route","name":"房间","sourceName":"Salle","wild":0,"trainers":4,"areas":["gsc:mt-mortar-1f","gsc:union-cave-1f","gsc:johto-route-42-area"],"species":[],"habitat":null,"bg":"gym-rock","climate":null,"levelBand":[85,89]},{"stepIndex":2,"kind":"gym","name":"第4房间","sourceName":"Salle 4","team":[[237,42],[106,42],[107,42],[95,43],[214,43],[68,46]],"ace":null,"aceOffset":0,"power":0.75,"double":false,"badge":null,"champion":false,"type":"fighting"}],"routes":[],"staticEncounters":[],"boss":{"name":"希巴","type":"fighting","team":[[237,42],[106,42],[107,42],[95,43],[214,43],[68,46]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":0.75,"double":false}},{"index":28,"name":"四天王：梨花","sourceName":"Conseil 4 : Marion","region":"johto","league":true,"day":false,"ace":95,"gym":true,"champion":false,"levelCap":95,"steps":[{"stepIndex":0,"kind":"heal","name":"石英高原","sourceName":"Plateau Indigo"},{"stepIndex":1,"kind":"route","name":"房间","sourceName":"Salle","wild":0,"trainers":4,"areas":["gsc:burned-tower-1f","gsc:johto-route-37-area","gsc:ilex-forest-area"],"species":[],"habitat":null,"bg":"gym-ghost","climate":null,"levelBand":[90,94]},{"stepIndex":2,"kind":"gym","name":"第4房间","sourceName":"Salle 4","team":[[197,42],[45,42],[215,43],[198,44],[94,45],[229,47]],"ace":null,"aceOffset":0,"power":0.82,"double":false,"badge":null,"champion":false,"type":"dark"}],"routes":[],"staticEncounters":[],"boss":{"name":"梨花","type":"dark","team":[[197,42],[45,42],[215,43],[198,44],[94,45],[229,47]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":0.82,"double":false}},{"index":29,"name":"联盟冠军","sourceName":"Maître de la Ligue","region":"johto","league":true,"day":false,"ace":95,"gym":true,"champion":true,"levelCap":100,"steps":[{"stepIndex":0,"kind":"heal","name":"石英高原","sourceName":"Plateau Indigo"},{"stepIndex":1,"kind":"route","name":"房间","sourceName":"Salle","wild":0,"trainers":4,"areas":["gsc:dragons-den-area","gsc:ice-path-1f","gsc:kanto-victory-road-1-1f"],"species":[],"habitat":null,"bg":"gym-psychic","climate":null,"levelBand":[95,96]},{"stepIndex":2,"kind":"gym","name":"第4房间","sourceName":"Salle 4","team":[[130,44],[149,47],[149,47],[142,46],[6,46],[149,50]],"ace":null,"aceOffset":0,"power":1.2,"double":false,"badge":"Maître Johto","champion":true,"type":"dragon"}],"routes":[],"staticEncounters":[],"boss":{"name":"阿渡","type":"dragon","team":[[130,44],[149,47],[149,47],[142,46],[6,46],[149,50]],"badge":"Maître Johto","champion":true,"ace":null,"aceOffset":0,"power":1.2,"double":false}},{"index":30,"name":"白银山","sourceName":"Mont Argenté","region":"johto","league":false,"day":false,"ace":100,"gym":true,"champion":true,"levelCap":100,"steps":[{"stepIndex":0,"kind":"gift","name":"大木博士的研究所","sourceName":"Labo du Prof. Chen"},{"stepIndex":1,"kind":"route","name":"22号道路","sourceName":"Route 22","wild":3,"trainers":2,"areas":["gsc:kanto-route-22-area"],"species":[],"habitat":"k2:Route 22","bg":"prairie","climate":null,"levelBand":[95,96]},{"stepIndex":2,"kind":"route","name":"28号道路","sourceName":"Route 28","wild":4,"trainers":3,"areas":["gsc:kanto-route-28-area"],"species":[],"habitat":"k2:Route 28","bg":"mountain","climate":null,"levelBand":[96,97]},{"stepIndex":3,"kind":"heal","name":"白银山","sourceName":"Mont Argenté"},{"stepIndex":4,"kind":"route","name":"白银山","sourceName":"Mont Argenté","wild":5,"trainers":2,"areas":["gsc:mt-silver-outside","gsc:mt-silver-1f","gsc:mt-silver-2f"],"species":[],"habitat":"k2:Mont Argenté","bg":"cave","climate":null,"levelBand":[97,98]},{"stepIndex":5,"kind":"route","name":"山顶","sourceName":"Sommet","wild":3,"trainers":0,"areas":["gsc:mt-silver-top"],"species":[],"habitat":"k2:Sommet","bg":"mountain","climate":{"snow":3,"storm":0.5},"levelBand":[98,99]},{"stepIndex":6,"kind":"gym","name":"白银山山顶","sourceName":"Sommet du Mont Argenté","team":[[25,100],[196,100],[143,100],[3,100],[6,100],[9,100]],"ace":null,"aceOffset":0,"power":0.95,"double":false,"badge":"Légende","champion":true,"type":"normal"}],"routes":[{"stepIndex":1,"kind":"route","name":"22号道路","sourceName":"Route 22","habitat":"k2:Route 22","bg":"prairie","wild":3,"trainers":2,"areas":["gsc:kanto-route-22-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[95,96]},{"stepIndex":2,"kind":"route","name":"28号道路","sourceName":"Route 28","habitat":"k2:Route 28","bg":"mountain","wild":4,"trainers":3,"areas":["gsc:kanto-route-28-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[96,97]},{"stepIndex":4,"kind":"route","name":"白银山","sourceName":"Mont Argenté","habitat":"k2:Mont Argenté","bg":"cave","wild":5,"trainers":2,"areas":["gsc:mt-silver-outside","gsc:mt-silver-1f","gsc:mt-silver-2f"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[97,98]},{"stepIndex":5,"kind":"route","name":"山顶","sourceName":"Sommet","habitat":"k2:Sommet","bg":"mountain","wild":3,"trainers":0,"areas":["gsc:mt-silver-top"],"species":[],"day":false,"night":false,"skies":[],"climate":{"snow":3,"storm":0.5},"levelBand":[98,99]}],"staticEncounters":[],"boss":{"name":"赤红","type":"normal","team":[[25,100],[196,100],[143,100],[3,100],[6,100],[9,100]],"badge":"Légende","champion":true,"ace":null,"aceOffset":0,"power":0.95,"double":false}},{"index":31,"name":"原石徽章","sourceName":"Badge Roche (Hoenn)","region":"hoenn","league":false,"day":false,"ace":16,"gym":true,"champion":false,"levelCap":18,"steps":[{"stepIndex":0,"kind":"gift","name":"小田卷博士的研究所","sourceName":"Labo du Prof. Seko"},{"stepIndex":1,"kind":"heal","name":"未白镇","sourceName":"Bourg-en-Vol"},{"stepIndex":2,"kind":"route","name":"101号道路","sourceName":"Route 101","wild":3,"trainers":0,"areas":["rse:hoenn-route-101-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[2,3]},{"stepIndex":3,"kind":"heal","name":"古辰镇","sourceName":"Rosyères"},{"stepIndex":4,"kind":"route","name":"102-103号道路","sourceName":"Routes 102-103","wild":5,"trainers":1,"areas":["rse:hoenn-route-102-area","rse:hoenn-route-103-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[4,7]},{"stepIndex":5,"kind":"heal","name":"橙华市","sourceName":"Clémenti-Ville"},{"stepIndex":6,"kind":"route","name":"104号道路","sourceName":"Route 104","wild":3,"trainers":1,"areas":["rse:hoenn-route-104-area"],"species":[],"habitat":null,"bg":"beach","climate":null,"levelBand":[9,12]},{"stepIndex":7,"kind":"route","name":"橙华森林","sourceName":"Bois Clémenti","wild":4,"trainers":2,"areas":["rse:petalburg-woods-area"],"species":[],"habitat":null,"bg":"forest","climate":null,"levelBand":[12,15]},{"stepIndex":8,"kind":"heal","name":"卡那兹市","sourceName":"Mérouville"},{"stepIndex":9,"kind":"gym","name":"卡那兹道馆","sourceName":"Arène de Mérouville","team":[[74,12],[299,15]],"ace":null,"aceOffset":0,"power":1.85,"double":false,"badge":"Roche (Hoenn)","champion":false,"type":"rock"}],"routes":[{"stepIndex":2,"kind":"route","name":"101号道路","sourceName":"Route 101","habitat":null,"bg":"prairie","wild":3,"trainers":0,"areas":["rse:hoenn-route-101-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[2,3]},{"stepIndex":4,"kind":"route","name":"102-103号道路","sourceName":"Routes 102-103","habitat":null,"bg":"prairie","wild":5,"trainers":1,"areas":["rse:hoenn-route-102-area","rse:hoenn-route-103-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[4,7]},{"stepIndex":6,"kind":"route","name":"104号道路","sourceName":"Route 104","habitat":null,"bg":"beach","wild":3,"trainers":1,"areas":["rse:hoenn-route-104-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[9,12]},{"stepIndex":7,"kind":"route","name":"橙华森林","sourceName":"Bois Clémenti","habitat":null,"bg":"forest","wild":4,"trainers":2,"areas":["rse:petalburg-woods-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[12,15]}],"staticEncounters":[],"boss":{"name":"杜娟","type":"rock","team":[[74,12],[299,15]],"badge":"Roche (Hoenn)","champion":false,"ace":null,"aceOffset":0,"power":1.85,"double":false}},{"index":32,"name":"拳头徽章","sourceName":"Badge Poing","region":"hoenn","league":false,"day":false,"ace":22,"gym":true,"champion":false,"levelCap":22,"steps":[{"stepIndex":0,"kind":"route","name":"116号道路","sourceName":"Route 116","wild":3,"trainers":2,"areas":["rse:hoenn-route-116-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[16,17]},{"stepIndex":1,"kind":"route","name":"卡绿隧道","sourceName":"Tunnel Mérazon","wild":3,"trainers":1,"areas":["rse:rusturf-tunnel-area"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[17,19]},{"stepIndex":2,"kind":"route","name":"105-106号道路","sourceName":"Routes 105-106","wild":3,"trainers":2,"areas":["rse:hoenn-route-105-area","rse:hoenn-route-106-area"],"species":[],"habitat":null,"bg":"pier","climate":null,"levelBand":[19,20]},{"stepIndex":3,"kind":"heal","name":"武斗镇","sourceName":"Myokara"},{"stepIndex":4,"kind":"route","name":"石之洞窟","sourceName":"Grotte Granite","wild":4,"trainers":1,"areas":["rse:granite-cave-1f","rse:granite-cave-1fsmall-room","rse:granite-cave-b1f","rse:granite-cave-b2f"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[20,21]},{"stepIndex":5,"kind":"heal","name":"武斗镇","sourceName":"Myokara"},{"stepIndex":6,"kind":"gym","name":"武斗道馆","sourceName":"Arène de Myokara","team":[[66,16],[307,16],[296,19]],"ace":null,"aceOffset":0,"power":1.63,"double":false,"badge":"Poing","champion":false,"type":"fighting"}],"routes":[{"stepIndex":0,"kind":"route","name":"116号道路","sourceName":"Route 116","habitat":null,"bg":"prairie","wild":3,"trainers":2,"areas":["rse:hoenn-route-116-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[16,17]},{"stepIndex":1,"kind":"route","name":"卡绿隧道","sourceName":"Tunnel Mérazon","habitat":null,"bg":"cave","wild":3,"trainers":1,"areas":["rse:rusturf-tunnel-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[17,19]},{"stepIndex":2,"kind":"route","name":"105-106号道路","sourceName":"Routes 105-106","habitat":null,"bg":"pier","wild":3,"trainers":2,"areas":["rse:hoenn-route-105-area","rse:hoenn-route-106-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[19,20]},{"stepIndex":4,"kind":"route","name":"石之洞窟","sourceName":"Grotte Granite","habitat":null,"bg":"cave","wild":4,"trainers":1,"areas":["rse:granite-cave-1f","rse:granite-cave-1fsmall-room","rse:granite-cave-b1f","rse:granite-cave-b2f"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[20,21]}],"staticEncounters":[],"boss":{"name":"藤树","type":"fighting","team":[[66,16],[307,16],[296,19]],"badge":"Poing","champion":false,"ace":null,"aceOffset":0,"power":1.63,"double":false}},{"index":33,"name":"发电徽章","sourceName":"Badge Dynamo","region":"hoenn","league":false,"day":false,"ace":27,"gym":true,"champion":false,"levelCap":27,"steps":[{"stepIndex":0,"kind":"route","name":"107-108号道路","sourceName":"Routes 107-108","wild":3,"trainers":2,"areas":["rse:hoenn-route-107-area","rse:hoenn-route-108-area"],"species":[],"habitat":null,"bg":"pier","climate":null,"levelBand":[22,23]},{"stepIndex":1,"kind":"route","name":"弃船","sourceName":"Épave","wild":3,"trainers":1,"areas":["rse:abandoned-ship-area"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[23,24]},{"stepIndex":2,"kind":"route","name":"109号道路","sourceName":"Route 109","wild":3,"trainers":3,"areas":["rse:hoenn-route-109-area"],"species":[],"habitat":null,"bg":"beach","climate":null,"levelBand":[24,25]},{"stepIndex":3,"kind":"heal","name":"凯那市","sourceName":"Poivressel"},{"stepIndex":4,"kind":"trainer","name":"海洋博物馆","sourceName":"Musée Océanographique","team":[[261,16],[318,17]],"scale":true,"below":null,"double":false},{"stepIndex":5,"kind":"route","name":"110号道路","sourceName":"Route 110","wild":4,"trainers":3,"areas":["rse:hoenn-route-110-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[25,26]},{"stepIndex":6,"kind":"heal","name":"紫堇市","sourceName":"Lavandia"},{"stepIndex":7,"kind":"gym","name":"紫堇道馆","sourceName":"Arène de Lavandia","team":[[100,20],[309,20],[82,22],[310,24]],"ace":null,"aceOffset":0,"power":0.98,"double":false,"badge":"Dynamo","champion":false,"type":"electric"}],"routes":[{"stepIndex":0,"kind":"route","name":"107-108号道路","sourceName":"Routes 107-108","habitat":null,"bg":"pier","wild":3,"trainers":2,"areas":["rse:hoenn-route-107-area","rse:hoenn-route-108-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[22,23]},{"stepIndex":1,"kind":"route","name":"弃船","sourceName":"Épave","habitat":null,"bg":"cave","wild":3,"trainers":1,"areas":["rse:abandoned-ship-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[23,24]},{"stepIndex":2,"kind":"route","name":"109号道路","sourceName":"Route 109","habitat":null,"bg":"beach","wild":3,"trainers":3,"areas":["rse:hoenn-route-109-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[24,25]},{"stepIndex":5,"kind":"route","name":"110号道路","sourceName":"Route 110","habitat":null,"bg":"prairie","wild":4,"trainers":3,"areas":["rse:hoenn-route-110-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[25,26]}],"staticEncounters":[],"boss":{"name":"铁旋","type":"electric","team":[[100,20],[309,20],[82,22],[310,24]],"badge":"Dynamo","champion":false,"ace":null,"aceOffset":0,"power":0.98,"double":false}},{"index":34,"name":"热量徽章","sourceName":"Badge Chaleur","region":"hoenn","league":false,"day":false,"ace":32,"gym":true,"champion":false,"levelCap":32,"steps":[{"stepIndex":0,"kind":"route","name":"117号道路","sourceName":"Route 117","wild":3,"trainers":2,"areas":["rse:hoenn-route-117-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[27,28]},{"stepIndex":1,"kind":"heal","name":"绿荫镇","sourceName":"Vergazon"},{"stepIndex":2,"kind":"route","name":"112号道路","sourceName":"Route 112","wild":3,"trainers":2,"areas":["rse:hoenn-route-112-area"],"species":[],"habitat":null,"bg":"mountain","climate":{"sun":2,"rain":1,"storm":0.5},"levelBand":[28,29]},{"stepIndex":3,"kind":"route","name":"火焰小径","sourceName":"Chemin Ardent","wild":4,"trainers":0,"areas":["rse:fiery-path-area"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[29,30]},{"stepIndex":4,"kind":"route","name":"113号道路","sourceName":"Route 113","wild":3,"trainers":3,"areas":["rse:hoenn-route-113-area"],"species":[],"habitat":null,"bg":"mountain","climate":{"ash":4,"sun":1},"levelBand":[29,30]},{"stepIndex":5,"kind":"heal","name":"秋叶镇","sourceName":"Autéquia"},{"stepIndex":6,"kind":"route","name":"凹凸山道","sourceName":"Sentier Sinuroc","wild":3,"trainers":2,"areas":["rse:jagged-pass-area"],"species":[],"habitat":null,"bg":"mountain","climate":{"sun":2,"rain":1,"storm":0.5},"levelBand":[30,31]},{"stepIndex":7,"kind":"heal","name":"釜炎镇","sourceName":"Vermilava"},{"stepIndex":8,"kind":"gym","name":"釜炎道馆","sourceName":"Arène de Vermilava","team":[[322,24],[218,24],[323,26],[219,27],[324,29]],"ace":null,"aceOffset":0,"power":1.26,"double":false,"badge":"Chaleur","champion":false,"type":"fire"}],"routes":[{"stepIndex":0,"kind":"route","name":"117号道路","sourceName":"Route 117","habitat":null,"bg":"prairie","wild":3,"trainers":2,"areas":["rse:hoenn-route-117-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[27,28]},{"stepIndex":2,"kind":"route","name":"112号道路","sourceName":"Route 112","habitat":null,"bg":"mountain","wild":3,"trainers":2,"areas":["rse:hoenn-route-112-area"],"species":[],"day":false,"night":false,"skies":[],"climate":{"sun":2,"rain":1,"storm":0.5},"levelBand":[28,29]},{"stepIndex":3,"kind":"route","name":"火焰小径","sourceName":"Chemin Ardent","habitat":null,"bg":"cave","wild":4,"trainers":0,"areas":["rse:fiery-path-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[29,30]},{"stepIndex":4,"kind":"route","name":"113号道路","sourceName":"Route 113","habitat":null,"bg":"mountain","wild":3,"trainers":3,"areas":["rse:hoenn-route-113-area"],"species":[],"day":false,"night":false,"skies":[],"climate":{"ash":4,"sun":1},"levelBand":[29,30]},{"stepIndex":6,"kind":"route","name":"凹凸山道","sourceName":"Sentier Sinuroc","habitat":null,"bg":"mountain","wild":3,"trainers":2,"areas":["rse:jagged-pass-area"],"species":[],"day":false,"night":false,"skies":[],"climate":{"sun":2,"rain":1,"storm":0.5},"levelBand":[30,31]}],"staticEncounters":[],"boss":{"name":"亚莎","type":"fire","team":[[322,24],[218,24],[323,26],[219,27],[324,29]],"badge":"Chaleur","champion":false,"ace":null,"aceOffset":0,"power":1.26,"double":false}},{"index":35,"name":"烟囱山","sourceName":"Mont Chimnée","region":"hoenn","league":false,"day":false,"ace":37,"gym":true,"champion":false,"levelCap":37,"steps":[{"stepIndex":0,"kind":"route","name":"114号道路","sourceName":"Route 114","wild":3,"trainers":2,"areas":["rse:hoenn-route-114-area"],"species":[],"habitat":null,"bg":"mountain","climate":{"sun":1,"rain":2,"storm":0.5},"levelBand":[32,33]},{"stepIndex":1,"kind":"route","name":"流星瀑布","sourceName":"Chutes Météore","wild":4,"trainers":1,"areas":["rse:meteor-falls-area","rse:meteor-falls-b1f"],"species":[],"habitat":null,"bg":"cave","indoor":false,"climate":{"rain":3,"storm":0.5},"levelBand":[33,35]},{"stepIndex":2,"kind":"heal","name":"秋叶镇","sourceName":"Autéquia"},{"stepIndex":3,"kind":"route","name":"烟囱山","sourceName":"Mont Chimnée","wild":0,"trainers":3,"areas":[],"species":[261,262,41,42,322,323],"habitat":null,"bg":"mountain","climate":{"sun":2,"storm":0.5},"levelBand":[35,36]},{"stepIndex":4,"kind":"gym","name":"烟囱山","sourceName":"Mont Chimnée","team":[[262,24],[42,24],[323,25]],"ace":null,"aceOffset":0,"power":0.96,"double":false,"badge":null,"champion":false,"type":"fire"}],"routes":[{"stepIndex":0,"kind":"route","name":"114号道路","sourceName":"Route 114","habitat":null,"bg":"mountain","wild":3,"trainers":2,"areas":["rse:hoenn-route-114-area"],"species":[],"day":false,"night":false,"skies":[],"climate":{"sun":1,"rain":2,"storm":0.5},"levelBand":[32,33]},{"stepIndex":1,"kind":"route","name":"流星瀑布","sourceName":"Chutes Météore","habitat":null,"bg":"cave","indoor":false,"wild":4,"trainers":1,"areas":["rse:meteor-falls-area","rse:meteor-falls-b1f"],"species":[],"day":false,"night":false,"skies":[],"climate":{"rain":3,"storm":0.5},"levelBand":[33,35]}],"staticEncounters":[],"boss":{"name":"首领赤焰松","type":"fire","team":[[262,24],[42,24],[323,25]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":0.96,"double":false}},{"index":36,"name":"平衡徽章","sourceName":"Badge Balance","region":"hoenn","league":false,"day":false,"ace":42,"gym":true,"champion":false,"levelCap":42,"steps":[{"stepIndex":0,"kind":"route","name":"111号道路沙漠","sourceName":"Désert de la Route 111","wild":4,"trainers":2,"areas":["rse:hoenn-route-111-area"],"species":[],"habitat":null,"bg":"mountain","climate":{"sand":3,"sun":2},"levelBand":[37,38]},{"stepIndex":1,"kind":"route","name":"幻影之塔","sourceName":"Tour Mirage","wild":3,"trainers":0,"areas":["rse:mirage-tower-area"],"species":[],"habitat":null,"bg":"mountain","climate":{"sand":3,"sun":2},"levelBand":[38,39]},{"stepIndex":2,"kind":"gift","name":"幻影之塔","sourceName":"Tour Mirage"},{"stepIndex":3,"kind":"heal","name":"紫堇市","sourceName":"Lavandia"},{"stepIndex":4,"kind":"route","name":"新紫堇","sourceName":"New Lavandia","wild":3,"trainers":0,"areas":["rse:new-mauville-entrance","rse:new-mauville-area"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[39,40]},{"stepIndex":5,"kind":"route","name":"卡绿隧道","sourceName":"Tunnel Mérazon","wild":3,"trainers":2,"areas":["rse:rusturf-tunnel-area"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[39,40]},{"stepIndex":6,"kind":"heal","name":"卡那兹市","sourceName":"Mérouville"},{"stepIndex":7,"kind":"trade","name":"得文公司","sourceName":"Devon SARL"},{"stepIndex":8,"kind":"route","name":"104号道路","sourceName":"Route 104","wild":3,"trainers":2,"areas":["rse:hoenn-route-104-area"],"species":[],"habitat":null,"bg":"beach","climate":null,"levelBand":[40,41]},{"stepIndex":9,"kind":"heal","name":"橙华市","sourceName":"Clémenti-Ville"},{"stepIndex":10,"kind":"gym","name":"橙华道馆","sourceName":"Arène de Clémenti-Ville","team":[[327,27],[288,27],[335,28],[277,28],[264,29],[289,31]],"ace":null,"aceOffset":0,"power":0.84,"double":false,"badge":"Balance","champion":false,"type":"normal"}],"routes":[{"stepIndex":0,"kind":"route","name":"111号道路沙漠","sourceName":"Désert de la Route 111","habitat":null,"bg":"mountain","wild":4,"trainers":2,"areas":["rse:hoenn-route-111-area"],"species":[],"day":false,"night":false,"skies":[],"climate":{"sand":3,"sun":2},"levelBand":[37,38]},{"stepIndex":1,"kind":"route","name":"幻影之塔","sourceName":"Tour Mirage","habitat":null,"bg":"mountain","wild":3,"trainers":0,"areas":["rse:mirage-tower-area"],"species":[],"day":false,"night":false,"skies":[],"climate":{"sand":3,"sun":2},"levelBand":[38,39]},{"stepIndex":4,"kind":"route","name":"新紫堇","sourceName":"New Lavandia","habitat":null,"bg":"cave","wild":3,"trainers":0,"areas":["rse:new-mauville-entrance","rse:new-mauville-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[39,40]},{"stepIndex":5,"kind":"route","name":"卡绿隧道","sourceName":"Tunnel Mérazon","habitat":null,"bg":"cave","wild":3,"trainers":2,"areas":["rse:rusturf-tunnel-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[39,40]},{"stepIndex":8,"kind":"route","name":"104号道路","sourceName":"Route 104","habitat":null,"bg":"beach","wild":3,"trainers":2,"areas":["rse:hoenn-route-104-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[40,41]}],"staticEncounters":[],"boss":{"name":"千里","type":"normal","team":[[327,27],[288,27],[335,28],[277,28],[264,29],[289,31]],"badge":"Balance","champion":false,"ace":null,"aceOffset":0,"power":0.84,"double":false}},{"index":37,"name":"羽毛徽章","sourceName":"Badge Plume","region":"hoenn","league":false,"day":false,"ace":47,"gym":true,"champion":false,"levelCap":47,"steps":[{"stepIndex":0,"kind":"route","name":"118号道路","sourceName":"Route 118","wild":3,"trainers":2,"areas":["rse:hoenn-route-118-area"],"species":[],"habitat":null,"bg":"lake","climate":null,"levelBand":[42,43]},{"stepIndex":1,"kind":"route","name":"123号道路","sourceName":"Route 123","wild":3,"trainers":3,"areas":["rse:hoenn-route-123-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[43,44]},{"stepIndex":2,"kind":"route","name":"119号道路","sourceName":"Route 119","wild":4,"trainers":3,"areas":["rse:hoenn-route-119-area"],"species":[],"habitat":null,"bg":"forest","climate":{"rain":4,"storm":1.5,"sun":0.5},"levelBand":[44,45]},{"stepIndex":3,"kind":"route","name":"天气研究所","sourceName":"Institut Météo","wild":0,"trainers":2,"areas":[],"species":[41,42,261,262,318,319],"habitat":null,"bg":"town","climate":null,"levelBand":[44,45]},{"stepIndex":4,"kind":"gift","name":"天气研究所","sourceName":"Institut Météo"},{"stepIndex":5,"kind":"unlock","name":"120号道路","sourceName":"Route 120"},{"stepIndex":6,"kind":"route","name":"120号道路","sourceName":"Route 120","wild":4,"trainers":2,"areas":["rse:hoenn-route-120-area"],"species":[],"habitat":null,"bg":"forest","climate":{"rain":4,"storm":1.5,"sun":0.5},"levelBand":[45,46]},{"stepIndex":7,"kind":"heal","name":"茵郁市","sourceName":"Cimetronelle"},{"stepIndex":8,"kind":"gym","name":"茵郁道馆","sourceName":"Arène de Cimetronelle","team":[[333,29],[357,29],[279,30],[227,31],[277,31],[334,33]],"ace":null,"aceOffset":0,"power":1.07,"double":false,"badge":"Plume","champion":false,"type":"flying"}],"routes":[{"stepIndex":0,"kind":"route","name":"118号道路","sourceName":"Route 118","habitat":null,"bg":"lake","wild":3,"trainers":2,"areas":["rse:hoenn-route-118-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[42,43]},{"stepIndex":1,"kind":"route","name":"123号道路","sourceName":"Route 123","habitat":null,"bg":"prairie","wild":3,"trainers":3,"areas":["rse:hoenn-route-123-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[43,44]},{"stepIndex":2,"kind":"route","name":"119号道路","sourceName":"Route 119","habitat":null,"bg":"forest","wild":4,"trainers":3,"areas":["rse:hoenn-route-119-area"],"species":[],"day":false,"night":false,"skies":[],"climate":{"rain":4,"storm":1.5,"sun":0.5},"levelBand":[44,45]},{"stepIndex":6,"kind":"route","name":"120号道路","sourceName":"Route 120","habitat":null,"bg":"forest","wild":4,"trainers":2,"areas":["rse:hoenn-route-120-area"],"species":[],"day":false,"night":false,"skies":[],"climate":{"rain":4,"storm":1.5,"sun":0.5},"levelBand":[45,46]}],"staticEncounters":[],"boss":{"name":"娜琪","type":"flying","team":[[333,29],[357,29],[279,30],[227,31],[277,31],[334,33]],"badge":"Plume","champion":false,"ace":null,"aceOffset":0,"power":1.07,"double":false}},{"index":38,"name":"送神山","sourceName":"Mont Mémoria","region":"hoenn","league":false,"day":false,"ace":52,"gym":true,"champion":false,"levelCap":52,"steps":[{"stepIndex":0,"kind":"route","name":"121号道路","sourceName":"Route 121","wild":3,"trainers":2,"areas":["rse:hoenn-route-121-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[47,48]},{"stepIndex":1,"kind":"route","name":"狩猎地带","sourceName":"Parc Safari","wild":4,"trainers":0,"areas":["rse:hoenn-safari-zone-se","rse:hoenn-safari-zone-sw","rse:hoenn-safari-zone-neacro-bike-area","rse:hoenn-safari-zone-nwmach-bike-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[48,49]},{"stepIndex":2,"kind":"heal","name":"水静市","sourceName":"Nénucrique"},{"stepIndex":3,"kind":"route","name":"122号道路","sourceName":"Route 122","wild":3,"trainers":2,"areas":["rse:hoenn-route-122-area"],"species":[],"habitat":null,"bg":"pier","climate":null,"levelBand":[48,49]},{"stepIndex":4,"kind":"route","name":"送神山","sourceName":"Mont Mémoria","wild":4,"trainers":2,"areas":["rse:mt-pyre-1f","rse:mt-pyre-2f","rse:mt-pyre-3f","rse:mt-pyre-4f","rse:mt-pyre-5f","rse:mt-pyre-6f"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[49,50]},{"stepIndex":5,"kind":"route","name":"送神山山顶","sourceName":"Sommet du Mont Mémoria","wild":3,"trainers":2,"areas":["rse:mt-pyre-outside","rse:mt-pyre-summit"],"species":[],"habitat":null,"bg":"mountain","climate":{"fog":3,"rain":1,"snow":1},"levelBand":[50,51]},{"stepIndex":6,"kind":"route","name":"海洋队基地","sourceName":"Planque Aqua","wild":2,"trainers":3,"areas":["rse:team-aqua-hideout-area"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[50,51]},{"stepIndex":7,"kind":"heal","name":"水静市","sourceName":"Nénucrique"},{"stepIndex":8,"kind":"gym","name":"海洋队基地","sourceName":"Planque Aqua","team":[[262,34],[42,34],[319,36]],"ace":null,"aceOffset":0,"power":1.19,"double":false,"badge":null,"champion":false,"type":"water"}],"routes":[{"stepIndex":0,"kind":"route","name":"121号道路","sourceName":"Route 121","habitat":null,"bg":"prairie","wild":3,"trainers":2,"areas":["rse:hoenn-route-121-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[47,48]},{"stepIndex":1,"kind":"route","name":"狩猎地带","sourceName":"Parc Safari","habitat":null,"bg":"prairie","wild":4,"trainers":0,"areas":["rse:hoenn-safari-zone-se","rse:hoenn-safari-zone-sw","rse:hoenn-safari-zone-neacro-bike-area","rse:hoenn-safari-zone-nwmach-bike-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[48,49]},{"stepIndex":3,"kind":"route","name":"122号道路","sourceName":"Route 122","habitat":null,"bg":"pier","wild":3,"trainers":2,"areas":["rse:hoenn-route-122-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[48,49]},{"stepIndex":4,"kind":"route","name":"送神山","sourceName":"Mont Mémoria","habitat":null,"bg":"cave","wild":4,"trainers":2,"areas":["rse:mt-pyre-1f","rse:mt-pyre-2f","rse:mt-pyre-3f","rse:mt-pyre-4f","rse:mt-pyre-5f","rse:mt-pyre-6f"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[49,50]},{"stepIndex":5,"kind":"route","name":"送神山山顶","sourceName":"Sommet du Mont Mémoria","habitat":null,"bg":"mountain","wild":3,"trainers":2,"areas":["rse:mt-pyre-outside","rse:mt-pyre-summit"],"species":[],"day":false,"night":false,"skies":[],"climate":{"fog":3,"rain":1,"snow":1},"levelBand":[50,51]},{"stepIndex":6,"kind":"route","name":"海洋队基地","sourceName":"Planque Aqua","habitat":null,"bg":"cave","wild":2,"trainers":3,"areas":["rse:team-aqua-hideout-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[50,51]}],"staticEncounters":[],"boss":{"name":"海洋队干部","type":"water","team":[[262,34],[42,34],[319,36]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":1.19,"double":false}},{"index":39,"name":"心灵徽章","sourceName":"Badge Esprit","region":"hoenn","league":false,"day":false,"ace":57,"gym":true,"champion":false,"levelCap":57,"steps":[{"stepIndex":0,"kind":"route","name":"124号道路","sourceName":"Route 124","wild":5,"trainers":4,"areas":["rse:hoenn-route-124-area"],"species":[],"habitat":null,"bg":"pier","climate":null,"levelBand":[52,53]},{"stepIndex":1,"kind":"heal","name":"绿岭市","sourceName":"Algatia"},{"stepIndex":2,"kind":"gift","name":"大吾的家","sourceName":"Maison de Pierre Rochard"},{"stepIndex":3,"kind":"route","name":"125号道路","sourceName":"Route 125","wild":4,"trainers":3,"areas":["rse:hoenn-route-125-area"],"species":[],"habitat":null,"bg":"beach","climate":null,"levelBand":[53,54]},{"stepIndex":4,"kind":"route","name":"浅滩洞穴","sourceName":"Grotte Tréfonds","wild":5,"trainers":2,"areas":["rse:shoal-cave-high-tide","rse:shoal-cave-low-tide"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[54,55]},{"stepIndex":5,"kind":"route","name":"冰之间","sourceName":"Salle de glace","wild":4,"trainers":0,"areas":["rse:shoal-cave-b1f","rse:shoal-cave-b2f","rse:shoal-cave-b3f"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[54,55]},{"stepIndex":6,"kind":"route","name":"宇宙中心","sourceName":"Centre Spatial","wild":0,"trainers":4,"areas":[],"species":[261,262,41,42,322,323],"habitat":null,"bg":"town","climate":null,"levelBand":[55,56]},{"stepIndex":7,"kind":"heal","name":"绿岭市","sourceName":"Algatia"},{"stepIndex":8,"kind":"gym","name":"绿岭道馆","sourceName":"Arène d'Algatia","team":[[344,41],[178,41],[337,42],[338,42],[358,41],[282,42]],"ace":null,"aceOffset":0,"power":0.83,"double":true,"badge":"Esprit","champion":false,"type":"psychic"}],"routes":[{"stepIndex":0,"kind":"route","name":"124号道路","sourceName":"Route 124","habitat":null,"bg":"pier","wild":5,"trainers":4,"areas":["rse:hoenn-route-124-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[52,53]},{"stepIndex":3,"kind":"route","name":"125号道路","sourceName":"Route 125","habitat":null,"bg":"beach","wild":4,"trainers":3,"areas":["rse:hoenn-route-125-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[53,54]},{"stepIndex":4,"kind":"route","name":"浅滩洞穴","sourceName":"Grotte Tréfonds","habitat":null,"bg":"cave","wild":5,"trainers":2,"areas":["rse:shoal-cave-high-tide","rse:shoal-cave-low-tide"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[54,55]},{"stepIndex":5,"kind":"route","name":"冰之间","sourceName":"Salle de glace","habitat":null,"bg":"cave","wild":4,"trainers":0,"areas":["rse:shoal-cave-b1f","rse:shoal-cave-b2f","rse:shoal-cave-b3f"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[54,55]}],"staticEncounters":[],"boss":{"name":"小枫与小南","type":"psychic","team":[[344,41],[178,41],[337,42],[338,42],[358,41],[282,42]],"badge":"Esprit","champion":false,"ace":null,"aceOffset":0,"power":0.83,"double":true}},{"index":40,"name":"危机","sourceName":"La crise","region":"hoenn","league":false,"day":false,"weather":["storm","sun"],"ace":62,"gym":true,"champion":false,"levelCap":62,"steps":[{"stepIndex":0,"kind":"route","name":"熔岩队基地","sourceName":"Planque Magma","wild":3,"trainers":3,"areas":["rse:magma-hideout-area"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[57,58]},{"stepIndex":1,"kind":"trainer","name":"熔岩队基地","sourceName":"Planque Magma","team":[[262,37],[169,38],[323,39]],"scale":true,"below":null,"double":false},{"stepIndex":2,"kind":"route","name":"128号道路","sourceName":"Route 128","wild":4,"trainers":3,"areas":["rse:hoenn-route-128-area"],"species":[],"habitat":null,"bg":"pier","climate":null,"levelBand":[58,59]},{"stepIndex":3,"kind":"route","name":"海底","sourceName":"Fonds marins","wild":3,"trainers":0,"areas":["rse:hoenn-route-124-underwater","rse:hoenn-route-126-underwater"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[59,60]},{"stepIndex":4,"kind":"route","name":"海底洞窟","sourceName":"Caverne Fondmer","wild":3,"trainers":3,"areas":["rse:seafloor-cavern-area"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[60,61]},{"stepIndex":5,"kind":"heal","name":"绿岭市","sourceName":"Algatia"},{"stepIndex":6,"kind":"gym","name":"海底洞窟","sourceName":"Caverne Fondmer","team":[[262,41],[169,41],[319,43]],"ace":null,"aceOffset":0,"power":1.19,"double":false,"badge":null,"champion":false,"type":"water"}],"routes":[{"stepIndex":0,"kind":"route","name":"熔岩队基地","sourceName":"Planque Magma","habitat":null,"bg":"cave","wild":3,"trainers":3,"areas":["rse:magma-hideout-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[57,58]},{"stepIndex":2,"kind":"route","name":"128号道路","sourceName":"Route 128","habitat":null,"bg":"pier","wild":4,"trainers":3,"areas":["rse:hoenn-route-128-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[58,59]},{"stepIndex":3,"kind":"route","name":"海底","sourceName":"Fonds marins","habitat":null,"bg":"cave","wild":3,"trainers":0,"areas":["rse:hoenn-route-124-underwater","rse:hoenn-route-126-underwater"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[59,60]},{"stepIndex":4,"kind":"route","name":"海底洞窟","sourceName":"Caverne Fondmer","habitat":null,"bg":"cave","wild":3,"trainers":3,"areas":["rse:seafloor-cavern-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[60,61]}],"staticEncounters":[],"boss":{"name":"首领水梧桐","type":"water","team":[[262,41],[169,41],[319,43]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":1.19,"double":false}},{"index":41,"name":"雨滴徽章","sourceName":"Badge Pluie","region":"hoenn","league":false,"day":false,"ace":67,"gym":true,"champion":false,"levelCap":67,"steps":[{"stepIndex":0,"kind":"route","name":"126号道路","sourceName":"Route 126","wild":3,"trainers":2,"areas":["rse:hoenn-route-126-area"],"species":[],"habitat":null,"bg":"pier","climate":null,"levelBand":[62,63]},{"stepIndex":1,"kind":"route","name":"觉醒祠堂","sourceName":"Grotte Origine","wild":3,"trainers":0,"areas":["rse:cave-of-origin-entrance","rse:cave-of-origin-1f","rse:cave-of-origin-b1f","rse:cave-of-origin-b2f","rse:cave-of-origin-b3f","rse:cave-of-origin-b4f"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[63,64]},{"stepIndex":2,"kind":"route","name":"127号道路","sourceName":"Route 127","wild":3,"trainers":2,"areas":["rse:hoenn-route-127-area"],"species":[],"habitat":null,"bg":"pier","climate":null,"levelBand":[64,65]},{"stepIndex":3,"kind":"route","name":"129-131号道路","sourceName":"Routes 129-131","wild":4,"trainers":3,"areas":["rse:hoenn-route-129-area","rse:hoenn-route-130-area","rse:hoenn-route-131-area"],"species":[],"habitat":null,"bg":"pier","climate":null,"levelBand":[64,65]},{"stepIndex":4,"kind":"heal","name":"暮水镇","sourceName":"Pacifiville"},{"stepIndex":5,"kind":"route","name":"132-134号道路","sourceName":"Routes 132-134","wild":4,"trainers":3,"areas":["rse:hoenn-route-132-area","rse:hoenn-route-133-area","rse:hoenn-route-134-area"],"species":[],"habitat":null,"bg":"pier","climate":null,"levelBand":[65,66]},{"stepIndex":6,"kind":"heal","name":"琉璃市","sourceName":"Atalanopolis"},{"stepIndex":7,"kind":"gym","name":"琉璃道馆","sourceName":"Arène d'Atalanopolis","team":[[370,41],[340,41],[364,43],[342,43],[350,44],[230,46]],"ace":null,"aceOffset":0,"power":0.91,"double":false,"badge":"Pluie","champion":false,"type":"water"}],"routes":[{"stepIndex":0,"kind":"route","name":"126号道路","sourceName":"Route 126","habitat":null,"bg":"pier","wild":3,"trainers":2,"areas":["rse:hoenn-route-126-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[62,63]},{"stepIndex":1,"kind":"route","name":"觉醒祠堂","sourceName":"Grotte Origine","habitat":null,"bg":"cave","wild":3,"trainers":0,"areas":["rse:cave-of-origin-entrance","rse:cave-of-origin-1f","rse:cave-of-origin-b1f","rse:cave-of-origin-b2f","rse:cave-of-origin-b3f","rse:cave-of-origin-b4f"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[63,64]},{"stepIndex":2,"kind":"route","name":"127号道路","sourceName":"Route 127","habitat":null,"bg":"pier","wild":3,"trainers":2,"areas":["rse:hoenn-route-127-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[64,65]},{"stepIndex":3,"kind":"route","name":"129-131号道路","sourceName":"Routes 129-131","habitat":null,"bg":"pier","wild":4,"trainers":3,"areas":["rse:hoenn-route-129-area","rse:hoenn-route-130-area","rse:hoenn-route-131-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[64,65]},{"stepIndex":5,"kind":"route","name":"132-134号道路","sourceName":"Routes 132-134","habitat":null,"bg":"pier","wild":4,"trainers":3,"areas":["rse:hoenn-route-132-area","rse:hoenn-route-133-area","rse:hoenn-route-134-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[65,66]}],"staticEncounters":[],"boss":{"name":"亚当","type":"water","team":[[370,41],[340,41],[364,43],[342,43],[350,44],[230,46]],"badge":"Pluie","champion":false,"ace":null,"aceOffset":0,"power":0.91,"double":false}},{"index":42,"name":"冠军之路","sourceName":"Route Victoire","region":"hoenn","league":false,"day":false,"ace":72,"gym":true,"champion":false,"levelCap":72,"steps":[{"stepIndex":0,"kind":"route","name":"彩幽市","sourceName":"Éternara","wild":4,"trainers":3,"areas":["rse:ever-grande-city-area"],"species":[],"habitat":null,"bg":"beach","climate":null,"levelBand":[67,69]},{"stepIndex":1,"kind":"heal","name":"彩幽市","sourceName":"Éternara"},{"stepIndex":2,"kind":"route","name":"冠军之路","sourceName":"Route Victoire","wild":6,"trainers":5,"areas":["rse:hoenn-victory-road-1f","rse:hoenn-victory-road-b1f","rse:hoenn-victory-road-b2f"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[69,71]},{"stepIndex":3,"kind":"heal","name":"冠军之路","sourceName":"Route Victoire"},{"stepIndex":4,"kind":"gym","name":"冠军之路","sourceName":"Route Victoire","team":[[334,44],[301,43],[315,44],[82,41],[282,45]],"ace":null,"aceOffset":0,"power":1.19,"double":false,"badge":null,"champion":false,"type":"psychic"}],"routes":[{"stepIndex":0,"kind":"route","name":"彩幽市","sourceName":"Éternara","habitat":null,"bg":"beach","wild":4,"trainers":3,"areas":["rse:ever-grande-city-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[67,69]},{"stepIndex":2,"kind":"route","name":"冠军之路","sourceName":"Route Victoire","habitat":null,"bg":"cave","wild":6,"trainers":5,"areas":["rse:hoenn-victory-road-1f","rse:hoenn-victory-road-b1f","rse:hoenn-victory-road-b2f"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[69,71]}],"staticEncounters":[],"boss":{"name":"满充","type":"psychic","team":[[334,44],[301,43],[315,44],[82,41],[282,45]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":1.19,"double":false}},{"index":43,"name":"四天王：花月","sourceName":"Conseil 4 : Damien","region":"hoenn","league":true,"day":false,"ace":80,"gym":true,"champion":false,"levelCap":83,"steps":[{"stepIndex":0,"kind":"heal","name":"宝可梦联盟","sourceName":"Ligue Pokémon"},{"stepIndex":1,"kind":"route","name":"房间","sourceName":"Salle","wild":0,"trainers":4,"areas":["rse:hoenn-route-120-area","rse:hoenn-route-119-area","rse:petalburg-woods-area"],"species":[],"habitat":null,"bg":"gym-psychic","climate":null,"levelBand":[72,79]},{"stepIndex":2,"kind":"gym","name":"第4房间","sourceName":"Salle 4","team":[[262,46],[275,48],[332,46],[342,48],[302,47],[359,49]],"ace":null,"aceOffset":0,"power":0.42,"double":false,"badge":null,"champion":false,"type":"dark"}],"routes":[],"staticEncounters":[],"boss":{"name":"花月","type":"dark","team":[[262,46],[275,48],[332,46],[342,48],[302,47],[359,49]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":0.42,"double":false}},{"index":44,"name":"四天王：芙蓉","sourceName":"Conseil 4 : Spectra","region":"hoenn","league":true,"day":false,"ace":85,"gym":true,"champion":false,"levelCap":88,"steps":[{"stepIndex":0,"kind":"heal","name":"宝可梦联盟","sourceName":"Ligue Pokémon"},{"stepIndex":1,"kind":"route","name":"房间","sourceName":"Salle","wild":0,"trainers":4,"areas":["rse:mt-pyre-1f","rse:mt-pyre-6f","rse:mt-pyre-summit"],"species":[],"habitat":null,"bg":"gym-ghost","climate":null,"levelBand":[80,84]},{"stepIndex":2,"kind":"gym","name":"第4房间","sourceName":"Salle 4","team":[[356,48],[354,49],[302,50],[355,48],[354,49],[356,51]],"ace":null,"aceOffset":0,"power":0.47,"double":false,"badge":null,"champion":false,"type":"ghost"}],"routes":[],"staticEncounters":[],"boss":{"name":"芙蓉","type":"ghost","team":[[356,48],[354,49],[302,50],[355,48],[354,49],[356,51]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":0.47,"double":false}},{"index":45,"name":"四天王：波妮","sourceName":"Conseil 4 : Glacia","region":"hoenn","league":true,"day":false,"ace":90,"gym":true,"champion":false,"levelCap":93,"steps":[{"stepIndex":0,"kind":"heal","name":"宝可梦联盟","sourceName":"Ligue Pokémon"},{"stepIndex":1,"kind":"route","name":"房间","sourceName":"Salle","wild":0,"trainers":4,"areas":["rse:shoal-cave-low-tide","rse:shoal-cave-b3f","rse:hoenn-route-125-area"],"species":[],"habitat":null,"bg":"gym-ice","climate":null,"levelBand":[85,89]},{"stepIndex":2,"kind":"gym","name":"第4房间","sourceName":"Salle 4","team":[[364,50],[362,50],[364,52],[362,52],[365,51],[365,53]],"ace":null,"aceOffset":0,"power":0.63,"double":false,"badge":null,"champion":false,"type":"ice"}],"routes":[],"staticEncounters":[],"boss":{"name":"波妮","type":"ice","team":[[364,50],[362,50],[364,52],[362,52],[365,51],[365,53]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":0.63,"double":false}},{"index":46,"name":"四天王：源治","sourceName":"Conseil 4 : Aragon","region":"hoenn","league":true,"day":false,"ace":95,"gym":true,"champion":false,"levelCap":95,"steps":[{"stepIndex":0,"kind":"heal","name":"宝可梦联盟","sourceName":"Ligue Pokémon"},{"stepIndex":1,"kind":"route","name":"房间","sourceName":"Salle","wild":0,"trainers":4,"areas":["rse:meteor-falls-back","rse:hoenn-victory-road-b2f","rse:hoenn-route-114-area"],"species":[],"habitat":null,"bg":"gym-dragon","climate":null,"levelBand":[90,94]},{"stepIndex":2,"kind":"gym","name":"第4房间","sourceName":"Salle 4","team":[[372,52],[334,54],[330,53],[230,53],[330,53],[373,55]],"ace":null,"aceOffset":0,"power":0.52,"double":false,"badge":null,"champion":false,"type":"dragon"}],"routes":[],"staticEncounters":[],"boss":{"name":"源治","type":"dragon","team":[[372,52],[334,54],[330,53],[230,53],[330,53],[373,55]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":0.52,"double":false}},{"index":47,"name":"联盟冠军","sourceName":"Maître de la Ligue","region":"hoenn","league":true,"day":false,"ace":95,"gym":true,"champion":true,"levelCap":100,"steps":[{"stepIndex":0,"kind":"heal","name":"宝可梦联盟","sourceName":"Ligue Pokémon"},{"stepIndex":1,"kind":"route","name":"房间","sourceName":"Salle","wild":0,"trainers":4,"areas":["rse:granite-cave-b2f","rse:hoenn-victory-road-1f","rse:desert-ruins-area"],"species":[],"habitat":null,"bg":"gym-steel","climate":null,"levelBand":[95,96]},{"stepIndex":2,"kind":"gym","name":"第4房间","sourceName":"Salle 4","team":[[227,57],[344,55],[306,56],[346,56],[348,56],[376,58]],"ace":null,"aceOffset":0,"power":1.11,"double":false,"badge":"Maître Hoenn","champion":true,"type":"steel"}],"routes":[],"staticEncounters":[],"boss":{"name":"大吾","type":"steel","team":[[227,57],[344,55],[306,56],[346,56],[348,56],[376,58]],"badge":"Maître Hoenn","champion":true,"ace":null,"aceOffset":0,"power":1.11,"double":false}},{"index":48,"name":"煤炭徽章","sourceName":"Badge Charbon","region":"sinnoh","league":false,"day":false,"ace":16,"gym":true,"champion":false,"levelCap":18,"steps":[{"stepIndex":0,"kind":"gift","name":"心齐湖","sourceName":"Lac Vérité"},{"stepIndex":1,"kind":"heal","name":"双叶镇","sourceName":"Bonaugure"},{"stepIndex":2,"kind":"route","name":"201号道路","sourceName":"Route 201","wild":3,"trainers":0,"areas":["dppt:sinnoh-route-201-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[2,3]},{"stepIndex":3,"kind":"trainer","name":"201号道路","sourceName":"Route 201","team":[[396,4],[390,5]],"scale":true,"below":null,"double":false},{"stepIndex":4,"kind":"route","name":"心齐湖","sourceName":"Lac Vérité","wild":3,"trainers":0,"areas":["dppt:lake-verity-before-galactic-intervention"],"species":[],"habitat":null,"bg":"lake","climate":null,"levelBand":[4,6]},{"stepIndex":5,"kind":"heal","name":"真砂镇","sourceName":"Littorella"},{"stepIndex":6,"kind":"route","name":"202号道路","sourceName":"Route 202","wild":4,"trainers":1,"areas":["dppt:sinnoh-route-202-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[3,5]},{"stepIndex":7,"kind":"heal","name":"祝庆市","sourceName":"Féli-Cité"},{"stepIndex":8,"kind":"route","name":"203号道路","sourceName":"Route 203","wild":3,"trainers":2,"areas":["dppt:sinnoh-route-203-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[9,11]},{"stepIndex":9,"kind":"route","name":"黑金闸口","sourceName":"Entrée de Charbourg","wild":3,"trainers":0,"areas":["dppt:oreburgh-gate-1f"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[11,13]},{"stepIndex":10,"kind":"heal","name":"黑金市","sourceName":"Charbourg"},{"stepIndex":11,"kind":"route","name":"黑金炭坑","sourceName":"Mine de Charbourg","wild":3,"trainers":2,"areas":["dppt:oreburgh-mine-1f","dppt:oreburgh-mine-b1f"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[13,15]},{"stepIndex":12,"kind":"gift","name":"黑金炭坑博物馆","sourceName":"Musée Minier de Charbourg"},{"stepIndex":13,"kind":"trade","name":"黑金炭坑博物馆","sourceName":"Musée Minier de Charbourg"},{"stepIndex":14,"kind":"gym","name":"黑金道馆","sourceName":"Arène de Charbourg","team":[[74,12],[95,12],[408,14]],"ace":null,"aceOffset":0,"power":1.41,"double":false,"badge":"Charbon","champion":false,"type":"rock"}],"routes":[{"stepIndex":2,"kind":"route","name":"201号道路","sourceName":"Route 201","habitat":null,"bg":"prairie","wild":3,"trainers":0,"areas":["dppt:sinnoh-route-201-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[2,3]},{"stepIndex":4,"kind":"route","name":"心齐湖","sourceName":"Lac Vérité","habitat":null,"bg":"lake","wild":3,"trainers":0,"areas":["dppt:lake-verity-before-galactic-intervention"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[4,6]},{"stepIndex":6,"kind":"route","name":"202号道路","sourceName":"Route 202","habitat":null,"bg":"prairie","wild":4,"trainers":1,"areas":["dppt:sinnoh-route-202-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[3,5]},{"stepIndex":8,"kind":"route","name":"203号道路","sourceName":"Route 203","habitat":null,"bg":"prairie","wild":3,"trainers":2,"areas":["dppt:sinnoh-route-203-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[9,11]},{"stepIndex":9,"kind":"route","name":"黑金闸口","sourceName":"Entrée de Charbourg","habitat":null,"bg":"cave","wild":3,"trainers":0,"areas":["dppt:oreburgh-gate-1f"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[11,13]},{"stepIndex":11,"kind":"route","name":"黑金炭坑","sourceName":"Mine de Charbourg","habitat":null,"bg":"cave","wild":3,"trainers":2,"areas":["dppt:oreburgh-mine-1f","dppt:oreburgh-mine-b1f"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[13,15]}],"staticEncounters":[],"boss":{"name":"瓢太","type":"rock","team":[[74,12],[95,12],[408,14]],"badge":"Charbon","champion":false,"ace":null,"aceOffset":0,"power":1.41,"double":false}},{"index":49,"name":"森林徽章","sourceName":"Badge Forêt","region":"sinnoh","league":false,"day":false,"ace":22,"gym":true,"champion":false,"levelCap":22,"steps":[{"stepIndex":0,"kind":"route","name":"204号道路","sourceName":"Route 204","wild":3,"trainers":2,"areas":["dppt:sinnoh-route-204-south-towards-jubilife-city","dppt:sinnoh-route-204-north-towards-floaroma-town"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[16,17]},{"stepIndex":1,"kind":"heal","name":"花苑镇","sourceName":"Floraville"},{"stepIndex":2,"kind":"route","name":"花苑花田","sourceName":"Pré de Floraville","wild":3,"trainers":1,"areas":["dppt:floaroma-meadow-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[17,18]},{"stepIndex":3,"kind":"route","name":"205号道路（南）","sourceName":"Route 205 (sud)","wild":3,"trainers":2,"areas":["dppt:sinnoh-route-205-south-towards-floaroma-town"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[17,18]},{"stepIndex":4,"kind":"route","name":"山谷发电厂","sourceName":"Les Éoliennes","wild":3,"trainers":2,"areas":["dppt:valley-windworks-area"],"species":[],"habitat":null,"bg":"prairie","climate":{"storm":2,"rain":2,"sun":0.5},"levelBand":[18,19]},{"stepIndex":5,"kind":"static","name":"山谷发电厂","sourceName":"Les Éoliennes","id":47904,"level":null,"power":1},{"stepIndex":6,"kind":"trainer","name":"山谷发电厂","sourceName":"Les Éoliennes","team":[[41,14],[431,16]],"scale":true,"below":null,"double":false},{"stepIndex":7,"kind":"route","name":"百代森林","sourceName":"Forêt Vestigion","wild":4,"trainers":2,"areas":["dppt:eterna-forest-area"],"species":[],"habitat":null,"bg":"forest","climate":null,"levelBand":[19,20]},{"stepIndex":8,"kind":"route","name":"森之洋馆","sourceName":"Vieux Château","wild":3,"trainers":0,"areas":["dppt:old-chateau-entrance","dppt:old-chateau-dining-room","dppt:old-chateau-2f"],"species":[],"habitat":null,"bg":"cave","indoor":false,"climate":null,"levelBand":[19,20]},{"stepIndex":9,"kind":"static","name":"森之洋馆的电视","sourceName":"Télé du Vieux Château","id":479,"level":20,"power":1},{"stepIndex":10,"kind":"route","name":"205号道路（东）","sourceName":"Route 205 (est)","wild":3,"trainers":2,"areas":["dppt:sinnoh-route-205-east-towards-eterna-city"],"species":[],"habitat":null,"bg":"lake","climate":null,"levelBand":[20,21]},{"stepIndex":11,"kind":"heal","name":"百代市","sourceName":"Vestigion"},{"stepIndex":12,"kind":"route","name":"银河百代大楼","sourceName":"Bâtiment Galaxie de Vestigion","wild":0,"trainers":3,"areas":[],"species":[41,42,434,435,431],"habitat":null,"bg":"town","climate":null,"levelBand":[20,21]},{"stepIndex":13,"kind":"trainer","name":"银河百代大楼","sourceName":"Bâtiment Galaxie de Vestigion","team":[[41,18],[434,20]],"scale":true,"below":null,"double":false},{"stepIndex":14,"kind":"egg","name":"百代市","sourceName":"Vestigion"},{"stepIndex":15,"kind":"gym","name":"百代道馆","sourceName":"Arène de Vestigion","team":[[420,19],[387,19],[407,22]],"ace":null,"aceOffset":0,"power":1.05,"double":false,"badge":"Forêt","champion":false,"type":"grass"}],"routes":[{"stepIndex":0,"kind":"route","name":"204号道路","sourceName":"Route 204","habitat":null,"bg":"prairie","wild":3,"trainers":2,"areas":["dppt:sinnoh-route-204-south-towards-jubilife-city","dppt:sinnoh-route-204-north-towards-floaroma-town"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[16,17]},{"stepIndex":2,"kind":"route","name":"花苑花田","sourceName":"Pré de Floraville","habitat":null,"bg":"prairie","wild":3,"trainers":1,"areas":["dppt:floaroma-meadow-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[17,18]},{"stepIndex":3,"kind":"route","name":"205号道路（南）","sourceName":"Route 205 (sud)","habitat":null,"bg":"prairie","wild":3,"trainers":2,"areas":["dppt:sinnoh-route-205-south-towards-floaroma-town"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[17,18]},{"stepIndex":4,"kind":"route","name":"山谷发电厂","sourceName":"Les Éoliennes","habitat":null,"bg":"prairie","wild":3,"trainers":2,"areas":["dppt:valley-windworks-area"],"species":[],"day":false,"night":false,"skies":[],"climate":{"storm":2,"rain":2,"sun":0.5},"levelBand":[18,19]},{"stepIndex":7,"kind":"route","name":"百代森林","sourceName":"Forêt Vestigion","habitat":null,"bg":"forest","wild":4,"trainers":2,"areas":["dppt:eterna-forest-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[19,20]},{"stepIndex":8,"kind":"route","name":"森之洋馆","sourceName":"Vieux Château","habitat":null,"bg":"cave","indoor":false,"wild":3,"trainers":0,"areas":["dppt:old-chateau-entrance","dppt:old-chateau-dining-room","dppt:old-chateau-2f"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[19,20]},{"stepIndex":10,"kind":"route","name":"205号道路（东）","sourceName":"Route 205 (est)","habitat":null,"bg":"lake","wild":3,"trainers":2,"areas":["dppt:sinnoh-route-205-east-towards-eterna-city"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[20,21]}],"staticEncounters":[{"stepIndex":5,"kind":"static","id":47904,"name":"山谷发电厂","sourceName":"Les Éoliennes","bg":"prairie","climate":{"storm":2,"rain":2,"sun":0.5},"skies":["storm"],"day":false,"night":false,"chance":0.25,"caught":[479],"once":"rotom-fan","level":null,"rate":13}],"boss":{"name":"菜种","type":"grass","team":[[420,19],[387,19],[407,22]],"badge":"Forêt","champion":false,"ace":null,"aceOffset":0,"power":1.05,"double":false}},{"index":50,"name":"遗迹徽章","sourceName":"Badge Fantôme","region":"sinnoh","league":false,"day":false,"ace":27,"gym":true,"champion":false,"levelCap":27,"steps":[{"stepIndex":0,"kind":"route","name":"206号道路","sourceName":"Route 206","wild":3,"trainers":3,"areas":["dppt:sinnoh-route-206-area"],"species":[],"habitat":null,"bg":"mountain","climate":null,"levelBand":[22,23]},{"stepIndex":1,"kind":"route","name":"迷幻洞窟","sourceName":"Grotte Revêche","wild":3,"trainers":0,"areas":["dppt:wayward-cave-1f","dppt:wayward-cave-b1f"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[23,24]},{"stepIndex":2,"kind":"route","name":"207号道路","sourceName":"Route 207","wild":3,"trainers":2,"areas":["dppt:sinnoh-route-207-area"],"species":[],"habitat":null,"bg":"mountain","climate":null,"levelBand":[23,24]},{"stepIndex":3,"kind":"route","name":"天冠山","sourceName":"Mont Couronné","wild":4,"trainers":1,"areas":["dppt:mt-coronet-1f-route-207","dppt:mt-coronet-b1f"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[24,25]},{"stepIndex":4,"kind":"route","name":"208号道路","sourceName":"Route 208","wild":3,"trainers":3,"areas":["dppt:sinnoh-route-208-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[25,26]},{"stepIndex":5,"kind":"heal","name":"家缘市","sourceName":"Unionpolis"},{"stepIndex":6,"kind":"gift","name":"家缘市","sourceName":"Unionpolis"},{"stepIndex":7,"kind":"route","name":"互动广场","sourceName":"Square Paisible","wild":2,"trainers":0,"areas":[],"species":[25,35,54,417,425,427],"habitat":null,"bg":"town","climate":null,"levelBand":[25,26]},{"stepIndex":8,"kind":"trainer","name":"互动广场","sourceName":"Square Paisible","team":[[397,25],[418,23],[391,27]],"scale":true,"below":null,"double":false},{"stepIndex":9,"kind":"gym","name":"家缘道馆","sourceName":"Arène d'Unionpolis","team":[[355,24],[93,24],[429,26]],"ace":null,"aceOffset":0,"power":0.89,"double":false,"badge":"Fantôme","champion":false,"type":"ghost"}],"routes":[{"stepIndex":0,"kind":"route","name":"206号道路","sourceName":"Route 206","habitat":null,"bg":"mountain","wild":3,"trainers":3,"areas":["dppt:sinnoh-route-206-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[22,23]},{"stepIndex":1,"kind":"route","name":"迷幻洞窟","sourceName":"Grotte Revêche","habitat":null,"bg":"cave","wild":3,"trainers":0,"areas":["dppt:wayward-cave-1f","dppt:wayward-cave-b1f"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[23,24]},{"stepIndex":2,"kind":"route","name":"207号道路","sourceName":"Route 207","habitat":null,"bg":"mountain","wild":3,"trainers":2,"areas":["dppt:sinnoh-route-207-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[23,24]},{"stepIndex":3,"kind":"route","name":"天冠山","sourceName":"Mont Couronné","habitat":null,"bg":"cave","wild":4,"trainers":1,"areas":["dppt:mt-coronet-1f-route-207","dppt:mt-coronet-b1f"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[24,25]},{"stepIndex":4,"kind":"route","name":"208号道路","sourceName":"Route 208","habitat":null,"bg":"prairie","wild":3,"trainers":3,"areas":["dppt:sinnoh-route-208-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[25,26]},{"stepIndex":7,"kind":"route","name":"互动广场","sourceName":"Square Paisible","habitat":null,"bg":"town","wild":2,"trainers":0,"areas":[],"species":[25,35,54,417,425,427],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[25,26]}],"staticEncounters":[],"boss":{"name":"梅丽莎","type":"ghost","team":[[355,24],[93,24],[429,26]],"badge":"Fantôme","champion":false,"ace":null,"aceOffset":0,"power":0.89,"double":false}},{"index":51,"name":"铺石徽章","sourceName":"Badge Pavé","region":"sinnoh","league":false,"day":false,"ace":32,"gym":true,"champion":false,"levelCap":32,"steps":[{"stepIndex":0,"kind":"route","name":"209号道路","sourceName":"Route 209","wild":3,"trainers":3,"areas":["dppt:sinnoh-route-209-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[27,28]},{"stepIndex":1,"kind":"route","name":"迷失塔","sourceName":"Tour Perdue","wild":3,"trainers":2,"areas":["dppt:lost-tower-1f","dppt:lost-tower-2f","dppt:lost-tower-3f","dppt:lost-tower-4f","dppt:lost-tower-5f"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[28,29]},{"stepIndex":2,"kind":"static","name":"灵魂之塔","sourceName":"Tour Sacrée","id":442,"level":30,"power":1},{"stepIndex":3,"kind":"heal","name":"随意镇","sourceName":"Bonville"},{"stepIndex":4,"kind":"route","name":"随意遗迹","sourceName":"Ruines de Bonville","wild":3,"trainers":0,"areas":["dppt:solaceon-ruins-1f","dppt:solaceon-ruins-2f","dppt:solaceon-ruins-b1f-a","dppt:solaceon-ruins-b2f-a","dppt:solaceon-ruins-b3f-a","dppt:solaceon-ruins-b4f-a","dppt:solaceon-ruins-b5f"],"species":[201,20101,20102,20103,20104,20105,20106,20107,20108,20109,20110,20111,20112,20113,20114,20115,20116,20117,20118,20119,20120,20121,20122,20123,20124,20125,20126,20127,436,41,63],"habitat":null,"bg":"cave","indoor":false,"climate":"prairie","levelBand":[29,30]},{"stepIndex":5,"kind":"route","name":"210号道路（南）","sourceName":"Route 210 (sud)","wild":3,"trainers":3,"areas":["dppt:sinnoh-route-210-south-towards-solaceon-town"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[29,30]},{"stepIndex":6,"kind":"route","name":"215号道路","sourceName":"Route 215","wild":3,"trainers":3,"areas":["dppt:sinnoh-route-215-area"],"species":[],"habitat":null,"bg":"prairie","climate":{"rain":6,"fog":1},"levelBand":[30,31]},{"stepIndex":7,"kind":"heal","name":"帷幕市","sourceName":"Voilaroc"},{"stepIndex":8,"kind":"gift","name":"帷幕市","sourceName":"Voilaroc"},{"stepIndex":9,"kind":"gym","name":"帷幕道馆","sourceName":"Arène de Voilaroc","team":[[307,28],[67,29],[448,32]],"ace":null,"aceOffset":0,"power":0.85,"double":false,"badge":"Pavé","champion":false,"type":"fighting"}],"routes":[{"stepIndex":0,"kind":"route","name":"209号道路","sourceName":"Route 209","habitat":null,"bg":"prairie","wild":3,"trainers":3,"areas":["dppt:sinnoh-route-209-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[27,28]},{"stepIndex":1,"kind":"route","name":"迷失塔","sourceName":"Tour Perdue","habitat":null,"bg":"cave","wild":3,"trainers":2,"areas":["dppt:lost-tower-1f","dppt:lost-tower-2f","dppt:lost-tower-3f","dppt:lost-tower-4f","dppt:lost-tower-5f"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[28,29]},{"stepIndex":4,"kind":"route","name":"随意遗迹","sourceName":"Ruines de Bonville","habitat":null,"bg":"cave","indoor":false,"wild":3,"trainers":0,"areas":["dppt:solaceon-ruins-1f","dppt:solaceon-ruins-2f","dppt:solaceon-ruins-b1f-a","dppt:solaceon-ruins-b2f-a","dppt:solaceon-ruins-b3f-a","dppt:solaceon-ruins-b4f-a","dppt:solaceon-ruins-b5f"],"species":[201,20101,20102,20103,20104,20105,20106,20107,20108,20109,20110,20111,20112,20113,20114,20115,20116,20117,20118,20119,20120,20121,20122,20123,20124,20125,20126,20127,436,41,63],"day":false,"night":false,"skies":[],"climate":"prairie","levelBand":[29,30]},{"stepIndex":5,"kind":"route","name":"210号道路（南）","sourceName":"Route 210 (sud)","habitat":null,"bg":"prairie","wild":3,"trainers":3,"areas":["dppt:sinnoh-route-210-south-towards-solaceon-town"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[29,30]},{"stepIndex":6,"kind":"route","name":"215号道路","sourceName":"Route 215","habitat":null,"bg":"prairie","wild":3,"trainers":3,"areas":["dppt:sinnoh-route-215-area"],"species":[],"day":false,"night":false,"skies":[],"climate":{"rain":6,"fog":1},"levelBand":[30,31]}],"staticEncounters":[],"boss":{"name":"阿李","type":"fighting","team":[[307,28],[67,29],[448,32]],"badge":"Pavé","champion":false,"ace":null,"aceOffset":0,"power":0.85,"double":false}},{"index":52,"name":"湿地徽章","sourceName":"Badge Palustre","region":"sinnoh","league":false,"day":false,"ace":37,"gym":true,"champion":false,"levelCap":37,"steps":[{"stepIndex":0,"kind":"route","name":"银河仓库","sourceName":"Hangar Galaxie","wild":0,"trainers":3,"areas":[],"species":[41,42,434,435,431,436],"habitat":null,"bg":"town","climate":null,"levelBand":[32,33]},{"stepIndex":1,"kind":"route","name":"214号道路","sourceName":"Route 214","wild":3,"trainers":2,"areas":["dppt:sinnoh-route-214-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[32,33]},{"stepIndex":2,"kind":"route","name":"遗迹迷隧道","sourceName":"Tunnel du Ruinemaniac","wild":3,"trainers":0,"areas":["dppt:ruin-maniac-cave-0-9-different-unown-caught"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[33,34]},{"stepIndex":3,"kind":"heal","name":"湖畔大饭店","sourceName":"Hôtel Grand Lac"},{"stepIndex":4,"kind":"route","name":"立志湖畔","sourceName":"Rive du Lac Courage","wild":3,"trainers":2,"areas":["dppt:valor-lakefront-area"],"species":[],"habitat":null,"bg":"lake","climate":null,"levelBand":[33,34]},{"stepIndex":5,"kind":"route","name":"213号道路","sourceName":"Route 213","wild":3,"trainers":2,"areas":["dppt:sinnoh-route-213-area"],"species":[],"habitat":null,"bg":"beach","climate":null,"levelBand":[34,35]},{"stepIndex":6,"kind":"static","name":"213号道路","sourceName":"Route 213","id":47902,"level":null,"power":1},{"stepIndex":7,"kind":"heal","name":"野原市","sourceName":"Verchamps"},{"stepIndex":8,"kind":"route","name":"大湿地","sourceName":"Grand Marais","wild":4,"trainers":0,"areas":["dppt:great-marsh-area-1","dppt:great-marsh-area-2","dppt:great-marsh-area-3","dppt:great-marsh-area-4","dppt:great-marsh-area-5","dppt:great-marsh-area-6"],"species":[],"habitat":null,"bg":"lake","climate":{"rain":4,"fog":1},"levelBand":[34,35]},{"stepIndex":9,"kind":"route","name":"212号道路（南）","sourceName":"Route 212 (sud)","wild":3,"trainers":3,"areas":["dppt:sinnoh-route-212-east-towards-pastoria-city"],"species":[],"habitat":null,"bg":"lake","climate":{"rain":4,"fog":1},"levelBand":[35,36]},{"stepIndex":10,"kind":"route","name":"自豪的后院","sourceName":"Jardin Trophée","wild":3,"trainers":0,"areas":["dppt:trophy-garden-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[35,36]},{"stepIndex":11,"kind":"static","name":"自豪的后院","sourceName":"Jardin Trophée","id":47905,"level":null,"power":1},{"stepIndex":12,"kind":"route","name":"212号道路（北）","sourceName":"Route 212 (nord)","wild":3,"trainers":2,"areas":["dppt:sinnoh-route-212-north-towards-hearthome-city"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[36,37]},{"stepIndex":13,"kind":"heal","name":"野原市","sourceName":"Verchamps"},{"stepIndex":14,"kind":"gym","name":"野原道馆","sourceName":"Arène de Verchamps","team":[[130,33],[195,34],[419,37]],"ace":null,"aceOffset":0,"power":0.82,"double":false,"badge":"Palustre","champion":false,"type":"water"}],"routes":[{"stepIndex":1,"kind":"route","name":"214号道路","sourceName":"Route 214","habitat":null,"bg":"prairie","wild":3,"trainers":2,"areas":["dppt:sinnoh-route-214-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[32,33]},{"stepIndex":2,"kind":"route","name":"遗迹迷隧道","sourceName":"Tunnel du Ruinemaniac","habitat":null,"bg":"cave","wild":3,"trainers":0,"areas":["dppt:ruin-maniac-cave-0-9-different-unown-caught"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[33,34]},{"stepIndex":4,"kind":"route","name":"立志湖畔","sourceName":"Rive du Lac Courage","habitat":null,"bg":"lake","wild":3,"trainers":2,"areas":["dppt:valor-lakefront-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[33,34]},{"stepIndex":5,"kind":"route","name":"213号道路","sourceName":"Route 213","habitat":null,"bg":"beach","wild":3,"trainers":2,"areas":["dppt:sinnoh-route-213-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[34,35]},{"stepIndex":8,"kind":"route","name":"大湿地","sourceName":"Grand Marais","habitat":null,"bg":"lake","wild":4,"trainers":0,"areas":["dppt:great-marsh-area-1","dppt:great-marsh-area-2","dppt:great-marsh-area-3","dppt:great-marsh-area-4","dppt:great-marsh-area-5","dppt:great-marsh-area-6"],"species":[],"day":false,"night":false,"skies":[],"climate":{"rain":4,"fog":1},"levelBand":[34,35]},{"stepIndex":9,"kind":"route","name":"212号道路（南）","sourceName":"Route 212 (sud)","habitat":null,"bg":"lake","wild":3,"trainers":3,"areas":["dppt:sinnoh-route-212-east-towards-pastoria-city"],"species":[],"day":false,"night":false,"skies":[],"climate":{"rain":4,"fog":1},"levelBand":[35,36]},{"stepIndex":10,"kind":"route","name":"自豪的后院","sourceName":"Jardin Trophée","habitat":null,"bg":"prairie","wild":3,"trainers":0,"areas":["dppt:trophy-garden-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[35,36]},{"stepIndex":12,"kind":"route","name":"212号道路（北）","sourceName":"Route 212 (nord)","habitat":null,"bg":"prairie","wild":3,"trainers":2,"areas":["dppt:sinnoh-route-212-north-towards-hearthome-city"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[36,37]}],"staticEncounters":[{"stepIndex":6,"kind":"static","id":47902,"name":"213号道路","sourceName":"Route 213","bg":"beach","climate":null,"skies":["rain","storm"],"day":false,"night":false,"chance":0.25,"caught":[479],"once":"rotom-wash","level":null,"rate":13},{"stepIndex":11,"kind":"static","id":47905,"name":"自豪的后院","sourceName":"Jardin Trophée","bg":"prairie","climate":null,"skies":[],"day":true,"night":false,"chance":0.25,"caught":[479],"once":"rotom-mow","level":null,"rate":13}],"boss":{"name":"吉宪","type":"water","team":[[130,33],[195,34],[419,37]],"badge":"Palustre","champion":false,"ace":null,"aceOffset":0,"power":0.82,"double":false}},{"index":53,"name":"矿山徽章","sourceName":"Badge Mine","region":"sinnoh","league":false,"day":false,"ace":42,"gym":true,"champion":false,"levelCap":42,"steps":[{"stepIndex":0,"kind":"route","name":"210号道路（北）","sourceName":"Route 210 (nord)","wild":3,"trainers":3,"areas":["dppt:sinnoh-route-210-west-towards-celestic-town"],"species":[],"habitat":null,"bg":"mountain","climate":{"fog":6,"rain":1},"levelBand":[37,38]},{"stepIndex":1,"kind":"heal","name":"神和镇","sourceName":"Célestia"},{"stepIndex":2,"kind":"route","name":"211号道路","sourceName":"Route 211","wild":3,"trainers":3,"areas":["dppt:sinnoh-route-211-east-towards-celestic-town","dppt:sinnoh-route-211-west-towards-eterna-city"],"species":[],"habitat":null,"bg":"mountain","climate":null,"levelBand":[38,39]},{"stepIndex":3,"kind":"route","name":"天冠山（211号道路）","sourceName":"Mont Couronné (Route 211)","wild":3,"trainers":2,"areas":["dppt:mt-coronet-1f-route-211"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[39,40]},{"stepIndex":4,"kind":"route","name":"218号道路","sourceName":"Route 218","wild":3,"trainers":3,"areas":["dppt:sinnoh-route-218-area"],"species":[],"habitat":null,"bg":"pier","climate":null,"levelBand":[40,41]},{"stepIndex":5,"kind":"heal","name":"水脉市","sourceName":"Joliberges"},{"stepIndex":6,"kind":"trainer","name":"水脉市","sourceName":"Joliberges","team":[[398,35],[419,33],[407,35],[392,38]],"scale":true,"below":null,"double":false},{"stepIndex":7,"kind":"gym","name":"水脉道馆","sourceName":"Arène de Joliberges","team":[[82,37],[208,38],[411,41]],"ace":null,"aceOffset":0,"power":1.06,"double":false,"badge":"Mine","champion":false,"type":"steel"}],"routes":[{"stepIndex":0,"kind":"route","name":"210号道路（北）","sourceName":"Route 210 (nord)","habitat":null,"bg":"mountain","wild":3,"trainers":3,"areas":["dppt:sinnoh-route-210-west-towards-celestic-town"],"species":[],"day":false,"night":false,"skies":[],"climate":{"fog":6,"rain":1},"levelBand":[37,38]},{"stepIndex":2,"kind":"route","name":"211号道路","sourceName":"Route 211","habitat":null,"bg":"mountain","wild":3,"trainers":3,"areas":["dppt:sinnoh-route-211-east-towards-celestic-town","dppt:sinnoh-route-211-west-towards-eterna-city"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[38,39]},{"stepIndex":3,"kind":"route","name":"天冠山（211号道路）","sourceName":"Mont Couronné (Route 211)","habitat":null,"bg":"cave","wild":3,"trainers":2,"areas":["dppt:mt-coronet-1f-route-211"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[39,40]},{"stepIndex":4,"kind":"route","name":"218号道路","sourceName":"Route 218","habitat":null,"bg":"pier","wild":3,"trainers":3,"areas":["dppt:sinnoh-route-218-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[40,41]}],"staticEncounters":[],"boss":{"name":"东瓜","type":"steel","team":[[82,37],[208,38],[411,41]],"badge":"Mine","champion":false,"ace":null,"aceOffset":0,"power":1.06,"double":false}},{"index":54,"name":"三座湖","sourceName":"Les Lacs","region":"sinnoh","league":false,"day":false,"ace":47,"gym":true,"champion":false,"levelCap":47,"steps":[{"stepIndex":0,"kind":"heal","name":"水脉市","sourceName":"Joliberges"},{"stepIndex":1,"kind":"route","name":"钢铁岛海岸","sourceName":"Rivage de l'Île de Fer","wild":3,"trainers":3,"areas":["dppt:iron-island-area"],"species":[],"habitat":null,"bg":"beach","climate":null,"levelBand":[42,43]},{"stepIndex":2,"kind":"route","name":"钢铁岛","sourceName":"Île de Fer","wild":4,"trainers":3,"areas":["dppt:iron-island-1f","dppt:iron-island-b1f-left","dppt:iron-island-b2f-left","dppt:iron-island-b3f"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[43,44]},{"stepIndex":3,"kind":"egg","name":"钢铁岛","sourceName":"Île de Fer"},{"stepIndex":4,"kind":"heal","name":"湖畔大饭店","sourceName":"Hôtel Grand Lac"},{"stepIndex":5,"kind":"route","name":"干涸的立志湖","sourceName":"Lac Courage asséché","wild":2,"trainers":3,"areas":["dppt:lake-valor-area"],"species":[],"habitat":null,"bg":"lake","climate":null,"levelBand":[44,45]},{"stepIndex":6,"kind":"route","name":"心齐湖","sourceName":"Lac Vérité","wild":3,"trainers":3,"areas":["dppt:lake-verity-after-galactic-intervention"],"species":[],"habitat":null,"bg":"lake","climate":null,"levelBand":[45,46]},{"stepIndex":7,"kind":"heal","name":"双叶镇","sourceName":"Bonaugure"},{"stepIndex":8,"kind":"gym","name":"心齐湖","sourceName":"Lac Vérité","team":[[42,37],[436,37],[432,39]],"ace":null,"aceOffset":0,"power":1.15,"double":false,"badge":null,"champion":false,"type":"poison"}],"routes":[{"stepIndex":1,"kind":"route","name":"钢铁岛海岸","sourceName":"Rivage de l'Île de Fer","habitat":null,"bg":"beach","wild":3,"trainers":3,"areas":["dppt:iron-island-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[42,43]},{"stepIndex":2,"kind":"route","name":"钢铁岛","sourceName":"Île de Fer","habitat":null,"bg":"cave","wild":4,"trainers":3,"areas":["dppt:iron-island-1f","dppt:iron-island-b1f-left","dppt:iron-island-b2f-left","dppt:iron-island-b3f"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[43,44]},{"stepIndex":5,"kind":"route","name":"干涸的立志湖","sourceName":"Lac Courage asséché","habitat":null,"bg":"lake","wild":2,"trainers":3,"areas":["dppt:lake-valor-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[44,45]},{"stepIndex":6,"kind":"route","name":"心齐湖","sourceName":"Lac Vérité","habitat":null,"bg":"lake","wild":3,"trainers":3,"areas":["dppt:lake-verity-after-galactic-intervention"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[45,46]}],"staticEncounters":[],"boss":{"name":"伙星","type":"poison","team":[[42,37],[436,37],[432,39]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":1.15,"double":false}},{"index":55,"name":"冰河徽章","sourceName":"Badge Glaçon","region":"sinnoh","league":false,"day":false,"ace":52,"gym":true,"champion":false,"levelCap":52,"steps":[{"stepIndex":0,"kind":"route","name":"天冠山（216号道路）","sourceName":"Mont Couronné (Route 216)","wild":3,"trainers":2,"areas":["dppt:mt-coronet-1f-route-216"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[47,48]},{"stepIndex":1,"kind":"route","name":"216号道路","sourceName":"Route 216","wild":3,"trainers":3,"areas":["dppt:sinnoh-route-216-area"],"species":[],"habitat":null,"bg":"mountain","climate":{"snow":4,"blizzard":1},"levelBand":[48,49]},{"stepIndex":2,"kind":"route","name":"217号道路","sourceName":"Route 217","wild":4,"trainers":3,"areas":["dppt:sinnoh-route-217-area"],"species":[],"habitat":null,"bg":"mountain","climate":{"blizzard":6,"snow":1},"levelBand":[49,50]},{"stepIndex":3,"kind":"static","name":"217号道路","sourceName":"Route 217","id":47903,"level":null,"power":1},{"stepIndex":4,"kind":"heal","name":"雪峰市","sourceName":"Frimapic"},{"stepIndex":5,"kind":"route","name":"睿智湖畔","sourceName":"Rive du Lac Savoir","wild":3,"trainers":2,"areas":["dppt:acuity-lakefront-area"],"species":[],"habitat":null,"bg":"mountain","climate":{"blizzard":4,"snow":2},"levelBand":[49,50]},{"stepIndex":6,"kind":"route","name":"睿智湖","sourceName":"Lac Savoir","wild":3,"trainers":2,"areas":["dppt:lake-acuity-area"],"species":[],"habitat":null,"bg":"mountain","climate":{"blizzard":6,"snow":1},"levelBand":[50,51]},{"stepIndex":7,"kind":"trainer","name":"睿智湖","sourceName":"Lac Savoir","team":[[42,40],[436,40],[435,42]],"scale":true,"below":null,"double":false},{"stepIndex":8,"kind":"heal","name":"雪峰市","sourceName":"Frimapic"},{"stepIndex":9,"kind":"gym","name":"雪峰道馆","sourceName":"Arène de Frimapic","team":[[215,40],[221,40],[460,42],[478,44]],"ace":null,"aceOffset":0,"power":0.97,"double":false,"badge":"Glaçon","champion":false,"type":"ice"}],"routes":[{"stepIndex":0,"kind":"route","name":"天冠山（216号道路）","sourceName":"Mont Couronné (Route 216)","habitat":null,"bg":"cave","wild":3,"trainers":2,"areas":["dppt:mt-coronet-1f-route-216"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[47,48]},{"stepIndex":1,"kind":"route","name":"216号道路","sourceName":"Route 216","habitat":null,"bg":"mountain","wild":3,"trainers":3,"areas":["dppt:sinnoh-route-216-area"],"species":[],"day":false,"night":false,"skies":[],"climate":{"snow":4,"blizzard":1},"levelBand":[48,49]},{"stepIndex":2,"kind":"route","name":"217号道路","sourceName":"Route 217","habitat":null,"bg":"mountain","wild":4,"trainers":3,"areas":["dppt:sinnoh-route-217-area"],"species":[],"day":false,"night":false,"skies":[],"climate":{"blizzard":6,"snow":1},"levelBand":[49,50]},{"stepIndex":5,"kind":"route","name":"睿智湖畔","sourceName":"Rive du Lac Savoir","habitat":null,"bg":"mountain","wild":3,"trainers":2,"areas":["dppt:acuity-lakefront-area"],"species":[],"day":false,"night":false,"skies":[],"climate":{"blizzard":4,"snow":2},"levelBand":[49,50]},{"stepIndex":6,"kind":"route","name":"睿智湖","sourceName":"Lac Savoir","habitat":null,"bg":"mountain","wild":3,"trainers":2,"areas":["dppt:lake-acuity-area"],"species":[],"day":false,"night":false,"skies":[],"climate":{"blizzard":6,"snow":1},"levelBand":[50,51]}],"staticEncounters":[{"stepIndex":3,"kind":"static","id":47903,"name":"217号道路","sourceName":"Route 217","bg":"mountain","climate":{"blizzard":6,"snow":1},"skies":["blizzard"],"day":false,"night":true,"chance":0.25,"caught":[479],"once":"rotom-frost","level":null,"rate":13}],"boss":{"name":"小菘","type":"ice","team":[[215,40],[221,40],[460,42],[478,44]],"badge":"Glaçon","champion":false,"ace":null,"aceOffset":0,"power":0.97,"double":false}},{"index":56,"name":"银河队基地","sourceName":"QG Galaxie","region":"sinnoh","league":false,"day":false,"ace":57,"gym":true,"champion":false,"levelCap":57,"steps":[{"stepIndex":0,"kind":"heal","name":"帷幕市","sourceName":"Voilaroc"},{"stepIndex":1,"kind":"route","name":"银河队基地","sourceName":"QG Galaxie","wild":0,"trainers":6,"areas":[],"species":[41,42,169,434,435,431,432,436,437,453,454],"habitat":null,"bg":"town","climate":null,"levelBand":[52,56]},{"stepIndex":2,"kind":"trainer","name":"银河队基地","sourceName":"QG Galaxie","team":[[215,40],[169,40],[430,43]],"scale":true,"below":null,"double":false},{"stepIndex":3,"kind":"gym","name":"银河队基地","sourceName":"QG Galaxie","team":[[64,38],[436,38],[454,40]],"ace":null,"aceOffset":0,"power":0.95,"double":false,"badge":null,"champion":false,"type":"poison"}],"routes":[],"staticEncounters":[],"boss":{"name":"镇星","type":"poison","team":[[64,38],[436,38],[454,40]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":0.95,"double":false}},{"index":57,"name":"毁坏的世界","sourceName":"Monde Distorsion","region":"sinnoh","league":false,"day":false,"ace":62,"gym":true,"champion":false,"levelCap":62,"steps":[{"stepIndex":0,"kind":"route","name":"天冠山","sourceName":"Mont Couronné","wild":4,"trainers":2,"areas":["dppt:mt-coronet-2f","dppt:mt-coronet-3f","dppt:mt-coronet-4f","dppt:mt-coronet-5f","dppt:mt-coronet-6f"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[57,58]},{"stepIndex":1,"kind":"route","name":"积雪的天冠山","sourceName":"Mont Couronné enneigé","wild":3,"trainers":1,"areas":["dppt:mt-coronet-exterior-snowfall","dppt:mt-coronet-exterior-blizzard"],"species":[],"habitat":null,"bg":"mountain","climate":{"snow":4,"blizzard":1,"fog":1},"levelBand":[58,60]},{"stepIndex":2,"kind":"heal","name":"神和镇","sourceName":"Célestia"},{"stepIndex":3,"kind":"trainer","name":"枪之柱","sourceName":"Colonnes Lances","team":[[436,46],[42,46],[432,48]],"scale":true,"below":null,"double":false},{"stepIndex":4,"kind":"trainer","name":"枪之柱","sourceName":"Colonnes Lances","team":[[436,46],[42,46],[435,48]],"scale":true,"below":null,"double":false},{"stepIndex":5,"kind":"route","name":"送行之泉","sourceName":"Source Adieu","wild":4,"trainers":1,"areas":["dppt:sendoff-spring-area"],"species":[],"habitat":null,"bg":"lake","climate":null,"levelBand":[60,61]},{"stepIndex":6,"kind":"heal","name":"神和镇","sourceName":"Célestia"},{"stepIndex":7,"kind":"gym","name":"毁坏的世界","sourceName":"Monde Distorsion","team":[[229,45],[430,48],[169,46],[130,46],[461,47]],"ace":null,"aceOffset":0,"power":0.73,"double":false,"badge":null,"champion":false,"type":"dark"}],"routes":[{"stepIndex":0,"kind":"route","name":"天冠山","sourceName":"Mont Couronné","habitat":null,"bg":"cave","wild":4,"trainers":2,"areas":["dppt:mt-coronet-2f","dppt:mt-coronet-3f","dppt:mt-coronet-4f","dppt:mt-coronet-5f","dppt:mt-coronet-6f"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[57,58]},{"stepIndex":1,"kind":"route","name":"积雪的天冠山","sourceName":"Mont Couronné enneigé","habitat":null,"bg":"mountain","wild":3,"trainers":1,"areas":["dppt:mt-coronet-exterior-snowfall","dppt:mt-coronet-exterior-blizzard"],"species":[],"day":false,"night":false,"skies":[],"climate":{"snow":4,"blizzard":1,"fog":1},"levelBand":[58,60]},{"stepIndex":5,"kind":"route","name":"送行之泉","sourceName":"Source Adieu","habitat":null,"bg":"lake","wild":4,"trainers":1,"areas":["dppt:sendoff-spring-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[60,61]}],"staticEncounters":[],"boss":{"name":"赤日","type":"dark","team":[[229,45],[430,48],[169,46],[130,46],[461,47]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":0.73,"double":false}},{"index":58,"name":"灯塔徽章","sourceName":"Badge Phare","region":"sinnoh","league":false,"day":false,"ace":67,"gym":true,"champion":false,"levelCap":67,"steps":[{"stepIndex":0,"kind":"heal","name":"真砂镇","sourceName":"Littorella"},{"stepIndex":1,"kind":"route","name":"219号道路","sourceName":"Route 219","wild":3,"trainers":1,"areas":["dppt:sinnoh-route-219-area"],"species":[],"habitat":null,"bg":"beach","climate":null,"levelBand":[62,63]},{"stepIndex":2,"kind":"route","name":"220号水路","sourceName":"Chenal 220","wild":3,"trainers":2,"areas":["dppt:sinnoh-sea-route-220-area"],"species":[],"habitat":null,"bg":"pier","climate":null,"levelBand":[63,64]},{"stepIndex":3,"kind":"route","name":"221号道路","sourceName":"Route 221","wild":3,"trainers":2,"areas":["dppt:sinnoh-route-221-area"],"species":[],"habitat":null,"bg":"beach","climate":null,"levelBand":[64,65]},{"stepIndex":4,"kind":"heal","name":"湖畔大饭店","sourceName":"Hôtel Grand Lac"},{"stepIndex":5,"kind":"route","name":"222号道路","sourceName":"Route 222","wild":3,"trainers":3,"areas":["dppt:sinnoh-route-222-area"],"species":[],"habitat":null,"bg":"beach","climate":null,"levelBand":[65,66]},{"stepIndex":6,"kind":"heal","name":"滨海市","sourceName":"Rivamar"},{"stepIndex":7,"kind":"gym","name":"滨海道馆","sourceName":"Arène de Rivamar","team":[[135,46],[26,46],[405,48],[466,50]],"ace":null,"aceOffset":0,"power":0.84,"double":false,"badge":"Phare","champion":false,"type":"electric"}],"routes":[{"stepIndex":1,"kind":"route","name":"219号道路","sourceName":"Route 219","habitat":null,"bg":"beach","wild":3,"trainers":1,"areas":["dppt:sinnoh-route-219-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[62,63]},{"stepIndex":2,"kind":"route","name":"220号水路","sourceName":"Chenal 220","habitat":null,"bg":"pier","wild":3,"trainers":2,"areas":["dppt:sinnoh-sea-route-220-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[63,64]},{"stepIndex":3,"kind":"route","name":"221号道路","sourceName":"Route 221","habitat":null,"bg":"beach","wild":3,"trainers":2,"areas":["dppt:sinnoh-route-221-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[64,65]},{"stepIndex":5,"kind":"route","name":"222号道路","sourceName":"Route 222","habitat":null,"bg":"beach","wild":3,"trainers":3,"areas":["dppt:sinnoh-route-222-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[65,66]}],"staticEncounters":[],"boss":{"name":"电次","type":"electric","team":[[135,46],[26,46],[405,48],[466,50]],"badge":"Phare","champion":false,"ace":null,"aceOffset":0,"power":0.84,"double":false}},{"index":59,"name":"冠军之路","sourceName":"Route Victoire","region":"sinnoh","league":false,"day":false,"ace":72,"gym":true,"champion":false,"levelCap":72,"steps":[{"stepIndex":0,"kind":"route","name":"223号水路","sourceName":"Chenal 223","wild":4,"trainers":2,"areas":["dppt:sinnoh-sea-route-223-area"],"species":[],"habitat":null,"bg":"pier","climate":null,"levelBand":[67,69]},{"stepIndex":1,"kind":"heal","name":"宝可梦联盟","sourceName":"Ligue Pokémon"},{"stepIndex":2,"kind":"route","name":"冠军之路","sourceName":"Route Victoire","wild":6,"trainers":4,"areas":["dppt:sinnoh-victory-road-1f","dppt:sinnoh-victory-road-2f","dppt:sinnoh-victory-road-b1f","dppt:sinnoh-victory-road-inside"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[69,71]},{"stepIndex":3,"kind":"heal","name":"冠军之路","sourceName":"Route Victoire"},{"stepIndex":4,"kind":"gym","name":"冠军之路","sourceName":"Route Victoire","team":[[398,48],[419,47],[407,48],[143,51],[214,49],[392,53]],"ace":null,"aceOffset":0,"power":0.93,"double":false,"badge":null,"champion":false,"type":"normal"}],"routes":[{"stepIndex":0,"kind":"route","name":"223号水路","sourceName":"Chenal 223","habitat":null,"bg":"pier","wild":4,"trainers":2,"areas":["dppt:sinnoh-sea-route-223-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[67,69]},{"stepIndex":2,"kind":"route","name":"冠军之路","sourceName":"Route Victoire","habitat":null,"bg":"cave","wild":6,"trainers":4,"areas":["dppt:sinnoh-victory-road-1f","dppt:sinnoh-victory-road-2f","dppt:sinnoh-victory-road-b1f","dppt:sinnoh-victory-road-inside"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[69,71]}],"staticEncounters":[],"boss":{"name":"阿驯","type":"normal","team":[[398,48],[419,47],[407,48],[143,51],[214,49],[392,53]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":0.93,"double":false}},{"index":60,"name":"四天王：阿柳","sourceName":"Conseil 4 : Aaron","region":"sinnoh","league":true,"day":false,"ace":80,"gym":true,"champion":false,"levelCap":83,"steps":[{"stepIndex":0,"kind":"heal","name":"宝可梦联盟","sourceName":"Ligue Pokémon"},{"stepIndex":1,"kind":"route","name":"房间","sourceName":"Salle","wild":0,"trainers":4,"areas":["dppt:eterna-forest-area","dppt:sinnoh-route-205-south-towards-floaroma-town","dppt:great-marsh-area-1"],"species":[],"habitat":null,"bg":"gym-bug","climate":null,"levelBand":[72,79]},{"stepIndex":2,"kind":"gym","name":"第4房间","sourceName":"Salle 4","team":[[269,53],[267,53],[416,54],[214,54],[452,57]],"ace":null,"aceOffset":0,"power":0.48,"double":false,"badge":null,"champion":false,"type":"bug"}],"routes":[],"staticEncounters":[],"boss":{"name":"阿柳","type":"bug","team":[[269,53],[267,53],[416,54],[214,54],[452,57]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":0.48,"double":false}},{"index":61,"name":"四天王：菊野","sourceName":"Conseil 4 : Terry","region":"sinnoh","league":true,"day":false,"ace":85,"gym":true,"champion":false,"levelCap":88,"steps":[{"stepIndex":0,"kind":"heal","name":"宝可梦联盟","sourceName":"Ligue Pokémon"},{"stepIndex":1,"kind":"route","name":"房间","sourceName":"Salle","wild":0,"trainers":4,"areas":["dppt:sinnoh-route-228-area","dppt:wayward-cave-1f","dppt:iron-island-b1f-left"],"species":[],"habitat":null,"bg":"gym-ground","climate":null,"levelBand":[80,84]},{"stepIndex":2,"kind":"gym","name":"第4房间","sourceName":"Salle 4","team":[[340,55],[472,56],[76,56],[464,57],[450,59]],"ace":null,"aceOffset":0,"power":0.72,"double":false,"badge":null,"champion":false,"type":"ground"}],"routes":[],"staticEncounters":[],"boss":{"name":"菊野","type":"ground","team":[[340,55],[472,56],[76,56],[464,57],[450,59]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":0.72,"double":false}},{"index":62,"name":"四天王：大叶","sourceName":"Conseil 4 : Adrien","region":"sinnoh","league":true,"day":false,"ace":90,"gym":true,"champion":false,"levelCap":93,"steps":[{"stepIndex":0,"kind":"heal","name":"宝可梦联盟","sourceName":"Ligue Pokémon"},{"stepIndex":1,"kind":"route","name":"房间","sourceName":"Salle","wild":0,"trainers":4,"areas":["dppt:stark-mountain-area","dppt:fuego-ironworks-area","dppt:sinnoh-route-227-area"],"species":[],"habitat":null,"bg":"gym-fire","climate":null,"levelBand":[85,89]},{"stepIndex":2,"kind":"gym","name":"第4房间","sourceName":"Salle 4","team":[[229,58],[136,57],[78,58],[392,61],[467,57]],"ace":null,"aceOffset":0,"power":0.8,"double":false,"badge":null,"champion":false,"type":"fire"}],"routes":[],"staticEncounters":[],"boss":{"name":"大叶","type":"fire","team":[[229,58],[136,57],[78,58],[392,61],[467,57]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":0.8,"double":false}},{"index":63,"name":"四天王：悟松","sourceName":"Conseil 4 : Lucio","region":"sinnoh","league":true,"day":false,"ace":95,"gym":true,"champion":false,"levelCap":95,"steps":[{"stepIndex":0,"kind":"heal","name":"宝可梦联盟","sourceName":"Ligue Pokémon"},{"stepIndex":1,"kind":"route","name":"房间","sourceName":"Salle","wild":0,"trainers":4,"areas":["dppt:sinnoh-route-210-west-towards-celestic-town","dppt:mt-coronet-4f","dppt:lost-tower-5f"],"species":[],"habitat":null,"bg":"gym-psychic","climate":null,"levelBand":[90,94]},{"stepIndex":2,"kind":"gym","name":"第4房间","sourceName":"Salle 4","team":[[122,59],[203,59],[308,60],[65,60],[437,63]],"ace":null,"aceOffset":0,"power":0.85,"double":false,"badge":null,"champion":false,"type":"psychic"}],"routes":[],"staticEncounters":[],"boss":{"name":"悟松","type":"psychic","team":[[122,59],[203,59],[308,60],[65,60],[437,63]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":0.85,"double":false}},{"index":64,"name":"联盟冠军","sourceName":"Maître de la Ligue","region":"sinnoh","league":true,"day":false,"ace":95,"gym":true,"champion":true,"levelCap":100,"steps":[{"stepIndex":0,"kind":"heal","name":"宝可梦联盟","sourceName":"Ligue Pokémon"},{"stepIndex":1,"kind":"route","name":"房间","sourceName":"Salle","wild":0,"trainers":4,"areas":["dppt:wayward-cave-b1f","dppt:sinnoh-victory-road-inside","dppt:sinnoh-route-217-area"],"species":[],"habitat":null,"bg":"gym-dragon","climate":null,"levelBand":[95,96]},{"stepIndex":2,"kind":"gym","name":"第4房间","sourceName":"Salle 4","team":[[442,91],[407,92],[468,93],[448,93],[350,94],[445,95]],"ace":null,"aceOffset":0,"power":1.15,"double":false,"badge":"Maître Sinnoh","champion":true,"type":"dragon"}],"routes":[],"staticEncounters":[],"boss":{"name":"竹兰","type":"dragon","team":[[442,91],[407,92],[468,93],[448,93],[350,94],[445,95]],"badge":"Maître Sinnoh","champion":true,"ace":null,"aceOffset":0,"power":1.15,"double":false}},{"index":65,"name":"严酷山","sourceName":"Mont Abrupt","region":"sinnoh","league":false,"day":false,"ace":100,"gym":true,"champion":false,"levelCap":100,"steps":[{"stepIndex":0,"kind":"heal","name":"战斗区","sourceName":"Aire de Combat"},{"stepIndex":1,"kind":"route","name":"225号道路","sourceName":"Route 225","wild":3,"trainers":3,"areas":["dppt:sinnoh-route-225-area"],"species":[],"habitat":null,"bg":"mountain","climate":null,"levelBand":[95,96]},{"stepIndex":2,"kind":"route","name":"226号水路","sourceName":"Chenal 226","wild":3,"trainers":3,"areas":["dppt:sinnoh-sea-route-226-area"],"species":[],"habitat":null,"bg":"pier","climate":null,"levelBand":[96,97]},{"stepIndex":3,"kind":"route","name":"227号道路","sourceName":"Route 227","wild":3,"trainers":3,"areas":["dppt:sinnoh-route-227-area"],"species":[],"habitat":null,"bg":"mountain","climate":{"ash":3,"sun":1},"levelBand":[97,98]},{"stepIndex":4,"kind":"static","name":"227号道路","sourceName":"Route 227","id":47901,"level":null,"power":1},{"stepIndex":5,"kind":"heal","name":"生存区","sourceName":"Aire de Survie"},{"stepIndex":6,"kind":"route","name":"228号道路","sourceName":"Route 228","wild":4,"trainers":2,"areas":["dppt:sinnoh-route-228-area"],"species":[],"habitat":null,"bg":"mountain","climate":{"sand":4,"sun":2},"levelBand":[97,98]},{"stepIndex":7,"kind":"route","name":"严酷山","sourceName":"Mont Abrupt","wild":4,"trainers":2,"areas":["dppt:stark-mountain-entrance","dppt:stark-mountain-area","dppt:stark-mountain-inside"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[98,99]},{"stepIndex":8,"kind":"heal","name":"战斗区","sourceName":"Aire de Combat"},{"stepIndex":9,"kind":"gym","name":"严酷山","sourceName":"Mont Abrupt","team":[[101,63],[437,63],[435,63],[454,64],[462,65],[479,66]],"ace":null,"aceOffset":0,"power":1.1,"double":false,"badge":null,"champion":false,"type":"electric"}],"routes":[{"stepIndex":1,"kind":"route","name":"225号道路","sourceName":"Route 225","habitat":null,"bg":"mountain","wild":3,"trainers":3,"areas":["dppt:sinnoh-route-225-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[95,96]},{"stepIndex":2,"kind":"route","name":"226号水路","sourceName":"Chenal 226","habitat":null,"bg":"pier","wild":3,"trainers":3,"areas":["dppt:sinnoh-sea-route-226-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[96,97]},{"stepIndex":3,"kind":"route","name":"227号道路","sourceName":"Route 227","habitat":null,"bg":"mountain","wild":3,"trainers":3,"areas":["dppt:sinnoh-route-227-area"],"species":[],"day":false,"night":false,"skies":[],"climate":{"ash":3,"sun":1},"levelBand":[97,98]},{"stepIndex":6,"kind":"route","name":"228号道路","sourceName":"Route 228","habitat":null,"bg":"mountain","wild":4,"trainers":2,"areas":["dppt:sinnoh-route-228-area"],"species":[],"day":false,"night":false,"skies":[],"climate":{"sand":4,"sun":2},"levelBand":[97,98]},{"stepIndex":7,"kind":"route","name":"严酷山","sourceName":"Mont Abrupt","habitat":null,"bg":"cave","wild":4,"trainers":2,"areas":["dppt:stark-mountain-entrance","dppt:stark-mountain-area","dppt:stark-mountain-inside"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[98,99]}],"staticEncounters":[{"stepIndex":4,"kind":"static","id":47901,"name":"227号道路","sourceName":"Route 227","bg":"mountain","climate":{"ash":3,"sun":1},"skies":["ash","sun"],"day":false,"night":false,"chance":0.25,"caught":[479],"once":"rotom-heat","level":null,"rate":13}],"boss":{"name":"冥王","type":"electric","team":[[101,63],[437,63],[435,63],[454,64],[462,65],[479,66]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":1.1,"double":false}},{"index":66,"name":"三元徽章","sourceName":"Badge Triple","region":"unova","league":false,"day":false,"ace":16,"gym":true,"champion":false,"levelCap":18,"steps":[{"stepIndex":0,"kind":"gift","name":"鹿子镇","sourceName":"Renouet"},{"stepIndex":1,"kind":"route","name":"1号道路","sourceName":"Route 1","wild":3,"trainers":0,"areas":["bw:unova-route-1-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[2,4]},{"stepIndex":2,"kind":"heal","name":"唐草镇","sourceName":"Arabelle"},{"stepIndex":3,"kind":"find","name":"唐草镇","sourceName":"Arabelle"},{"stepIndex":4,"kind":"trainer","name":"唐草镇","sourceName":"Arabelle","team":[[509,7]],"scale":true,"below":null,"double":false},{"stepIndex":5,"kind":"route","name":"2号道路","sourceName":"Route 2","wild":3,"trainers":2,"areas":["bw:unova-route-2-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[4,7]},{"stepIndex":6,"kind":"heal","name":"三曜市","sourceName":"Ogoesse"},{"stepIndex":7,"kind":"gift","name":"三曜市","sourceName":"Ogoesse"},{"stepIndex":8,"kind":"route","name":"三曜市","sourceName":"Ogoesse","wild":0,"trainers":3,"areas":[],"species":[],"habitat":null,"bg":"town","climate":null,"levelBand":[7,10]},{"stepIndex":9,"kind":"route","name":"梦的遗址","sourceName":"Vestiges du Rêve","wild":3,"trainers":2,"areas":["bw:dreamyard-area"],"species":[],"habitat":null,"bg":"forest","climate":{"fog":4,"rain":1,"sun":1},"levelBand":[12,15]},{"stepIndex":10,"kind":"gym","name":"三曜道馆","sourceName":"Arène d'Ogoesse","team":[[506,14],[511,16]],"ace":null,"aceOffset":0,"power":1.21,"double":false,"badge":"Triple","champion":false,"type":"grass"}],"routes":[{"stepIndex":1,"kind":"route","name":"1号道路","sourceName":"Route 1","habitat":null,"bg":"prairie","wild":3,"trainers":0,"areas":["bw:unova-route-1-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[2,4]},{"stepIndex":5,"kind":"route","name":"2号道路","sourceName":"Route 2","habitat":null,"bg":"prairie","wild":3,"trainers":2,"areas":["bw:unova-route-2-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[4,7]},{"stepIndex":9,"kind":"route","name":"梦的遗址","sourceName":"Vestiges du Rêve","habitat":null,"bg":"forest","wild":3,"trainers":2,"areas":["bw:dreamyard-area"],"species":[],"day":false,"night":false,"skies":[],"climate":{"fog":4,"rain":1,"sun":1},"levelBand":[12,15]}],"staticEncounters":[],"boss":{"name":"天桐","type":"grass","team":[[506,14],[511,16]],"badge":"Triple","champion":false,"ace":null,"aceOffset":0,"power":1.21,"double":false}},{"index":67,"name":"基础徽章","sourceName":"Badge Basique","region":"unova","league":false,"day":false,"ace":22,"gym":true,"champion":false,"levelCap":22,"steps":[{"stepIndex":0,"kind":"route","name":"3号道路","sourceName":"Route 3","wild":3,"trainers":3,"areas":["bw:unova-route-3-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[16,17]},{"stepIndex":1,"kind":"route","name":"泉源洞穴","sourceName":"Veine Souterraine","wild":4,"trainers":2,"areas":["bw:wellspring-cave-area"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[17,19]},{"stepIndex":2,"kind":"heal","name":"3号道路","sourceName":"Route 3"},{"stepIndex":3,"kind":"route","name":"3号道路（东）","sourceName":"Route 3 (est)","wild":3,"trainers":3,"areas":["bw:unova-route-3-area"],"species":[],"habitat":"Route 3|bw:unova-route-3-area","bg":"prairie","climate":null,"levelBand":[19,20]},{"stepIndex":4,"kind":"heal","name":"七宝市","sourceName":"Maillard"},{"stepIndex":5,"kind":"route","name":"七宝市","sourceName":"Maillard","wild":0,"trainers":3,"areas":[],"species":[],"habitat":null,"bg":"town","climate":null,"levelBand":[20,21]},{"stepIndex":6,"kind":"trade","name":"七宝博物馆","sourceName":"Musée de Maillard"},{"stepIndex":7,"kind":"trainer","name":"七宝市","sourceName":"Maillard","team":[[519,13],[535,13],[532,13]],"scale":true,"below":4,"double":false},{"stepIndex":8,"kind":"gym","name":"七宝道馆","sourceName":"Arène de Maillard","team":[[507,20],[505,22]],"ace":null,"aceOffset":0,"power":0.91,"double":false,"badge":"Basique","champion":false,"type":"normal"}],"routes":[{"stepIndex":0,"kind":"route","name":"3号道路","sourceName":"Route 3","habitat":null,"bg":"prairie","wild":3,"trainers":3,"areas":["bw:unova-route-3-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[16,17]},{"stepIndex":1,"kind":"route","name":"泉源洞穴","sourceName":"Veine Souterraine","habitat":null,"bg":"cave","wild":4,"trainers":2,"areas":["bw:wellspring-cave-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[17,19]},{"stepIndex":3,"kind":"route","name":"3号道路（东）","sourceName":"Route 3 (est)","habitat":"Route 3|bw:unova-route-3-area","bg":"prairie","wild":3,"trainers":3,"areas":["bw:unova-route-3-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[19,20]}],"staticEncounters":[],"boss":{"name":"芦荟","type":"normal","team":[[507,20],[505,22]],"badge":"Basique","champion":false,"ace":null,"aceOffset":0,"power":0.91,"double":false}},{"index":68,"name":"甲虫徽章","sourceName":"Badge Élytre","region":"unova","league":false,"day":false,"ace":27,"gym":true,"champion":false,"levelCap":27,"steps":[{"stepIndex":0,"kind":"route","name":"矢车森林","sourceName":"Forêt d'Empoigne","wild":4,"trainers":3,"areas":["bw:pinwheel-forest-outside","bw:pinwheel-forest-inside"],"species":[],"habitat":null,"bg":"forest","climate":null,"levelBand":[22,23]},{"stepIndex":1,"kind":"heal","name":"矢车森林","sourceName":"Forêt d'Empoigne"},{"stepIndex":2,"kind":"route","name":"矢车森林（东）","sourceName":"Forêt d'Empoigne (est)","wild":3,"trainers":3,"areas":["bw:pinwheel-forest-outside","bw:pinwheel-forest-inside"],"species":[],"habitat":"Forêt d'Empoigne|bw:pinwheel-forest-outside+bw:pinwheel-forest-inside","bg":"forest","climate":null,"levelBand":[23,24]},{"stepIndex":3,"kind":"route","name":"天箭桥","sourceName":"Pont Sagiciel","wild":0,"trainers":3,"areas":[],"species":[519,520,580],"habitat":null,"bg":"pier","climate":{"rain":2,"storm":1},"levelBand":[24,25]},{"stepIndex":4,"kind":"heal","name":"飞云市","sourceName":"Volucité"},{"stepIndex":5,"kind":"route","name":"飞云市","sourceName":"Volucité","wild":0,"trainers":4,"areas":[],"species":[],"habitat":null,"bg":"town","climate":null,"levelBand":[25,26]},{"stepIndex":6,"kind":"gym","name":"飞云道馆","sourceName":"Arène de Volucité","team":[[544,25],[557,25],[542,27]],"ace":null,"aceOffset":0,"power":1.1,"double":false,"badge":"Élytre","champion":false,"type":"bug"}],"routes":[{"stepIndex":0,"kind":"route","name":"矢车森林","sourceName":"Forêt d'Empoigne","habitat":null,"bg":"forest","wild":4,"trainers":3,"areas":["bw:pinwheel-forest-outside","bw:pinwheel-forest-inside"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[22,23]},{"stepIndex":2,"kind":"route","name":"矢车森林（东）","sourceName":"Forêt d'Empoigne (est)","habitat":"Forêt d'Empoigne|bw:pinwheel-forest-outside+bw:pinwheel-forest-inside","bg":"forest","wild":3,"trainers":3,"areas":["bw:pinwheel-forest-outside","bw:pinwheel-forest-inside"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[23,24]}],"staticEncounters":[],"boss":{"name":"亚堤","type":"bug","team":[[544,25],[557,25],[542,27]],"badge":"Élytre","champion":false,"ace":null,"aceOffset":0,"power":1.1,"double":false}},{"index":69,"name":"古代城","sourceName":"Château Enfoui","region":"unova","league":false,"day":false,"ace":32,"gym":true,"champion":false,"levelCap":32,"steps":[{"stepIndex":0,"kind":"route","name":"4号道路","sourceName":"Route 4","wild":3,"trainers":3,"areas":["bw:unova-route-4-area"],"species":[],"habitat":null,"bg":"prairie","climate":{"sand":4,"sun":1},"levelBand":[27,28]},{"stepIndex":1,"kind":"gift","name":"荒野名胜区","sourceName":"Désert Délassant"},{"stepIndex":2,"kind":"route","name":"荒野名胜区","sourceName":"Désert Délassant","wild":4,"trainers":3,"areas":["bw:desert-resort-entrance","bw:desert-resort-area"],"species":[],"habitat":null,"bg":"prairie","climate":{"sand":5,"sun":1},"levelBand":[28,30]},{"stepIndex":3,"kind":"heal","name":"荒野名胜区","sourceName":"Désert Délassant"},{"stepIndex":4,"kind":"route","name":"古代城","sourceName":"Château Enfoui","wild":4,"trainers":3,"areas":["bw:relic-castle-a","bw:relic-castle-b","bw:relic-castle-c","bw:relic-castle-d"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[30,31]},{"stepIndex":5,"kind":"heal","name":"古代城","sourceName":"Château Enfoui"},{"stepIndex":6,"kind":"gym","name":"古代城","sourceName":"Château Enfoui","team":[[505,30],[520,30],[522,32]],"ace":null,"aceOffset":0,"power":1.4,"double":false,"badge":null,"champion":false,"type":"normal"}],"routes":[{"stepIndex":0,"kind":"route","name":"4号道路","sourceName":"Route 4","habitat":null,"bg":"prairie","wild":3,"trainers":3,"areas":["bw:unova-route-4-area"],"species":[],"day":false,"night":false,"skies":[],"climate":{"sand":4,"sun":1},"levelBand":[27,28]},{"stepIndex":2,"kind":"route","name":"荒野名胜区","sourceName":"Désert Délassant","habitat":null,"bg":"prairie","wild":4,"trainers":3,"areas":["bw:desert-resort-entrance","bw:desert-resort-area"],"species":[],"day":false,"night":false,"skies":[],"climate":{"sand":5,"sun":1},"levelBand":[28,30]},{"stepIndex":4,"kind":"route","name":"古代城","sourceName":"Château Enfoui","habitat":null,"bg":"cave","wild":4,"trainers":3,"areas":["bw:relic-castle-a","bw:relic-castle-b","bw:relic-castle-c","bw:relic-castle-d"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[30,31]}],"staticEncounters":[],"boss":{"name":"黑连","type":"normal","team":[[505,30],[520,30],[522,32]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":1.4,"double":false}},{"index":70,"name":"伏特徽章","sourceName":"Badge Volt","region":"unova","league":false,"day":false,"ace":38,"gym":true,"champion":false,"levelCap":38,"steps":[{"stepIndex":0,"kind":"route","name":"4号道路（北）","sourceName":"Route 4 (nord)","wild":3,"trainers":2,"areas":["bw:unova-route-4-area"],"species":[],"habitat":"Route 4|bw:unova-route-4-area","bg":"prairie","climate":{"sand":4,"sun":1},"levelBand":[32,33]},{"stepIndex":1,"kind":"heal","name":"雷文市","sourceName":"Méanville"},{"stepIndex":2,"kind":"find","name":"雷文市","sourceName":"Méanville"},{"stepIndex":3,"kind":"route","name":"雷文市","sourceName":"Méanville","wild":0,"trainers":4,"areas":[],"species":[],"habitat":null,"bg":"town","climate":null,"levelBand":[33,35]},{"stepIndex":4,"kind":"trainer","name":"雷文市","sourceName":"Méanville","team":[[551,34],[554,34],[559,34],[561,34]],"scale":true,"below":4,"double":false},{"stepIndex":5,"kind":"route","name":"16号道路","sourceName":"Route 16","wild":3,"trainers":3,"areas":["bw:unova-route-16-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[35,36]},{"stepIndex":6,"kind":"heal","name":"雷文市","sourceName":"Méanville"},{"stepIndex":7,"kind":"route","name":"5号道路","sourceName":"Route 5","wild":3,"trainers":3,"areas":["bw:unova-route-5-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[36,37]},{"stepIndex":8,"kind":"gym","name":"雷文道馆","sourceName":"Arène de Méanville","team":[[587,36],[587,36],[596,36],[523,38]],"ace":null,"aceOffset":0,"power":1.1,"double":false,"badge":"Volt","champion":false,"type":"electric"}],"routes":[{"stepIndex":0,"kind":"route","name":"4号道路（北）","sourceName":"Route 4 (nord)","habitat":"Route 4|bw:unova-route-4-area","bg":"prairie","wild":3,"trainers":2,"areas":["bw:unova-route-4-area"],"species":[],"day":false,"night":false,"skies":[],"climate":{"sand":4,"sun":1},"levelBand":[32,33]},{"stepIndex":5,"kind":"route","name":"16号道路","sourceName":"Route 16","habitat":null,"bg":"prairie","wild":3,"trainers":3,"areas":["bw:unova-route-16-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[35,36]},{"stepIndex":7,"kind":"route","name":"5号道路","sourceName":"Route 5","habitat":null,"bg":"prairie","wild":3,"trainers":3,"areas":["bw:unova-route-5-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[36,37]}],"staticEncounters":[],"boss":{"name":"小菊儿","type":"electric","team":[[587,36],[587,36],[596,36],[523,38]],"badge":"Volt","champion":false,"ace":null,"aceOffset":0,"power":1.1,"double":false}},{"index":71,"name":"震动徽章","sourceName":"Badge Sismique","region":"unova","league":false,"day":false,"ace":43,"gym":true,"champion":false,"levelCap":43,"steps":[{"stepIndex":0,"kind":"route","name":"帆巴吊桥","sourceName":"Pont Yoneuve","wild":4,"trainers":3,"areas":["bw:driftveil-drawbridge-area"],"species":[],"habitat":null,"bg":"pier","climate":{"rain":2,"storm":1},"levelBand":[38,39]},{"stepIndex":1,"kind":"heal","name":"帆巴市","sourceName":"Port Yoneuve"},{"stepIndex":2,"kind":"route","name":"帆巴市","sourceName":"Port Yoneuve","wild":0,"trainers":4,"areas":[],"species":[],"habitat":null,"bg":"town","climate":null,"levelBand":[39,41]},{"stepIndex":3,"kind":"route","name":"冷冻仓库","sourceName":"Hangar Frigorifique","wild":4,"trainers":3,"areas":["bw:cold-storage-area"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[41,42]},{"stepIndex":4,"kind":"heal","name":"帆巴市","sourceName":"Port Yoneuve"},{"stepIndex":5,"kind":"gym","name":"帆巴道馆","sourceName":"Arène de Port Yoneuve","team":[[552,41],[536,41],[618,41],[530,43]],"ace":null,"aceOffset":0,"power":1.1,"double":false,"badge":"Sismique","champion":false,"type":"ground"}],"routes":[{"stepIndex":0,"kind":"route","name":"帆巴吊桥","sourceName":"Pont Yoneuve","habitat":null,"bg":"pier","wild":4,"trainers":3,"areas":["bw:driftveil-drawbridge-area"],"species":[],"day":false,"night":false,"skies":[],"climate":{"rain":2,"storm":1},"levelBand":[38,39]},{"stepIndex":3,"kind":"route","name":"冷冻仓库","sourceName":"Hangar Frigorifique","habitat":null,"bg":"cave","wild":4,"trainers":3,"areas":["bw:cold-storage-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[41,42]}],"staticEncounters":[],"boss":{"name":"菊老大","type":"ground","team":[[552,41],[536,41],[618,41],[530,43]],"badge":"Sismique","champion":false,"ace":null,"aceOffset":0,"power":1.1,"double":false}},{"index":72,"name":"喷射徽章","sourceName":"Badge Jet","region":"unova","league":false,"day":false,"ace":48,"gym":true,"champion":false,"levelCap":48,"steps":[{"stepIndex":0,"kind":"route","name":"6号道路","sourceName":"Route 6","wild":3,"trainers":2,"areas":["bw:unova-route-6-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[43,44]},{"stepIndex":1,"kind":"route","name":"6号道路（北）","sourceName":"Route 6 (nord)","wild":3,"trainers":3,"areas":["bw:unova-route-6-area"],"species":[],"habitat":"Route 6|bw:unova-route-6-area","bg":"prairie","climate":null,"levelBand":[44,45]},{"stepIndex":2,"kind":"heal","name":"6号道路","sourceName":"Route 6"},{"stepIndex":3,"kind":"route","name":"电气石洞穴","sourceName":"Grotte Électrolithe","wild":4,"trainers":2,"areas":["bw:chargestone-cave-1f","bw:chargestone-cave-b1f","bw:chargestone-cave-b2f"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[45,46]},{"stepIndex":4,"kind":"trainer","name":"电气石洞穴","sourceName":"Grotte Électrolithe","team":[[525,44],[595,44],[597,44],[599,44]],"scale":true,"below":4,"double":false},{"stepIndex":5,"kind":"route","name":"吹寄洞穴","sourceName":"Grotte Parsemille","wild":3,"trainers":2,"areas":["bw:mistralton-cave-area"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[46,47]},{"stepIndex":6,"kind":"static","name":"吹寄洞穴","sourceName":"Grotte Parsemille","id":610,"level":null,"power":1},{"stepIndex":7,"kind":"heal","name":"吹寄市","sourceName":"Parsemille"},{"stepIndex":8,"kind":"gym","name":"吹寄道馆","sourceName":"Arène de Parsemille","team":[[528,46],[521,46],[561,46],[581,48]],"ace":null,"aceOffset":0,"power":1.2,"double":false,"badge":"Jet","champion":false,"type":"flying"}],"routes":[{"stepIndex":0,"kind":"route","name":"6号道路","sourceName":"Route 6","habitat":null,"bg":"prairie","wild":3,"trainers":2,"areas":["bw:unova-route-6-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[43,44]},{"stepIndex":1,"kind":"route","name":"6号道路（北）","sourceName":"Route 6 (nord)","habitat":"Route 6|bw:unova-route-6-area","bg":"prairie","wild":3,"trainers":3,"areas":["bw:unova-route-6-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[44,45]},{"stepIndex":3,"kind":"route","name":"电气石洞穴","sourceName":"Grotte Électrolithe","habitat":null,"bg":"cave","wild":4,"trainers":2,"areas":["bw:chargestone-cave-1f","bw:chargestone-cave-b1f","bw:chargestone-cave-b2f"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[45,46]},{"stepIndex":5,"kind":"route","name":"吹寄洞穴","sourceName":"Grotte Parsemille","habitat":null,"bg":"cave","wild":3,"trainers":2,"areas":["bw:mistralton-cave-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[46,47]}],"staticEncounters":[],"boss":{"name":"风露","type":"flying","team":[[528,46],[521,46],[561,46],[581,48]],"badge":"Jet","champion":false,"ace":null,"aceOffset":0,"power":1.2,"double":false}},{"index":73,"name":"冰柱徽章","sourceName":"Badge Stalactite","region":"unova","league":false,"day":false,"ace":53,"gym":true,"champion":false,"levelCap":55,"steps":[{"stepIndex":0,"kind":"route","name":"7号道路","sourceName":"Route 7","wild":3,"trainers":2,"areas":["bw:unova-route-7-area"],"species":[],"habitat":null,"bg":"mountain","climate":{"snow":3,"rain":2,"blizzard":0.3},"levelBand":[48,49]},{"stepIndex":1,"kind":"route","name":"天堂之塔","sourceName":"Tour des Cieux","wild":3,"trainers":2,"areas":["bw:celestial-tower-2f","bw:celestial-tower-3f","bw:celestial-tower-4f","bw:celestial-tower-5f"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[49,50]},{"stepIndex":2,"kind":"heal","name":"7号道路","sourceName":"Route 7"},{"stepIndex":3,"kind":"route","name":"7号道路（北）","sourceName":"Route 7 (nord)","wild":3,"trainers":2,"areas":["bw:unova-route-7-area"],"species":[],"habitat":"Route 7|bw:unova-route-7-area","bg":"mountain","climate":{"snow":3,"rain":2,"blizzard":0.3},"levelBand":[50,51]},{"stepIndex":4,"kind":"route","name":"罗斯山","sourceName":"Mont Foré","wild":4,"trainers":2,"areas":["bw:twist-mountain-b1f-3f"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[50,51]},{"stepIndex":5,"kind":"heal","name":"雪花市","sourceName":"Flocombe"},{"stepIndex":6,"kind":"route","name":"雪花市","sourceName":"Flocombe","wild":0,"trainers":3,"areas":[],"species":[],"habitat":null,"bg":"town","climate":null,"levelBand":[51,52]},{"stepIndex":7,"kind":"gym","name":"雪花道馆","sourceName":"Arène de Flocombe","team":[[583,51],[615,51],[584,51],[614,53]],"ace":null,"aceOffset":0,"power":1.2,"double":false,"badge":"Stalactite","champion":false,"type":"ice"}],"routes":[{"stepIndex":0,"kind":"route","name":"7号道路","sourceName":"Route 7","habitat":null,"bg":"mountain","wild":3,"trainers":2,"areas":["bw:unova-route-7-area"],"species":[],"day":false,"night":false,"skies":[],"climate":{"snow":3,"rain":2,"blizzard":0.3},"levelBand":[48,49]},{"stepIndex":1,"kind":"route","name":"天堂之塔","sourceName":"Tour des Cieux","habitat":null,"bg":"cave","wild":3,"trainers":2,"areas":["bw:celestial-tower-2f","bw:celestial-tower-3f","bw:celestial-tower-4f","bw:celestial-tower-5f"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[49,50]},{"stepIndex":3,"kind":"route","name":"7号道路（北）","sourceName":"Route 7 (nord)","habitat":"Route 7|bw:unova-route-7-area","bg":"mountain","wild":3,"trainers":2,"areas":["bw:unova-route-7-area"],"species":[],"day":false,"night":false,"skies":[],"climate":{"snow":3,"rain":2,"blizzard":0.3},"levelBand":[50,51]},{"stepIndex":4,"kind":"route","name":"罗斯山","sourceName":"Mont Foré","habitat":null,"bg":"cave","wild":4,"trainers":2,"areas":["bw:twist-mountain-b1f-3f"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[50,51]}],"staticEncounters":[],"boss":{"name":"哈奇库","type":"ice","team":[[583,51],[615,51],[584,51],[614,53]],"badge":"Stalactite","champion":false,"ace":null,"aceOffset":0,"power":1.2,"double":false}},{"index":74,"name":"龙螺旋之塔","sourceName":"Tour Dragospire","region":"unova","league":false,"day":false,"ace":58,"gym":true,"champion":false,"levelCap":58,"steps":[{"stepIndex":0,"kind":"route","name":"雪花湿地","sourceName":"Tourbière Flocombe","wild":3,"trainers":3,"areas":["bw:moor-of-icirrus-area"],"species":[],"habitat":null,"bg":"lake","climate":{"rain":5,"fog":1},"levelBand":[53,54]},{"stepIndex":1,"kind":"route","name":"8号道路","sourceName":"Route 8","wild":3,"trainers":3,"areas":["bw:unova-route-8-area"],"species":[],"habitat":null,"bg":"lake","climate":{"rain":5,"fog":1},"levelBand":[54,55]},{"stepIndex":2,"kind":"heal","name":"雪花市","sourceName":"Flocombe"},{"stepIndex":3,"kind":"route","name":"龙螺旋之塔","sourceName":"Tour Dragospire","wild":4,"trainers":2,"areas":["bw:dragonspiral-tower-outside","bw:dragonspiral-tower-entrance","bw:dragonspiral-tower-1f","bw:dragonspiral-tower-2f"],"species":[],"habitat":null,"bg":"mountain","climate":{"snow":3,"rain":2,"blizzard":0.3},"levelBand":[55,56]},{"stepIndex":4,"kind":"route","name":"龙螺旋之塔","sourceName":"Tour Dragospire","wild":0,"trainers":3,"areas":[],"species":[],"habitat":null,"bg":"mountain","climate":null,"levelBand":[56,57]},{"stepIndex":5,"kind":"heal","name":"龙螺旋之塔","sourceName":"Tour Dragospire"},{"stepIndex":6,"kind":"gym","name":"龙螺旋之塔","sourceName":"Tour Dragospire","team":[[508,56],[518,56],[512,58]],"ace":null,"aceOffset":0,"power":1.1,"double":false,"badge":null,"champion":false,"type":"psychic"}],"routes":[{"stepIndex":0,"kind":"route","name":"雪花湿地","sourceName":"Tourbière Flocombe","habitat":null,"bg":"lake","wild":3,"trainers":3,"areas":["bw:moor-of-icirrus-area"],"species":[],"day":false,"night":false,"skies":[],"climate":{"rain":5,"fog":1},"levelBand":[53,54]},{"stepIndex":1,"kind":"route","name":"8号道路","sourceName":"Route 8","habitat":null,"bg":"lake","wild":3,"trainers":3,"areas":["bw:unova-route-8-area"],"species":[],"day":false,"night":false,"skies":[],"climate":{"rain":5,"fog":1},"levelBand":[54,55]},{"stepIndex":3,"kind":"route","name":"龙螺旋之塔","sourceName":"Tour Dragospire","habitat":null,"bg":"mountain","wild":4,"trainers":2,"areas":["bw:dragonspiral-tower-outside","bw:dragonspiral-tower-entrance","bw:dragonspiral-tower-1f","bw:dragonspiral-tower-2f"],"species":[],"day":false,"night":false,"skies":[],"climate":{"snow":3,"rain":2,"blizzard":0.3},"levelBand":[55,56]}],"staticEncounters":[],"boss":{"name":"白露","type":"psychic","team":[[508,56],[518,56],[512,58]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":1.1,"double":false}},{"index":75,"name":"传说徽章","sourceName":"Badge Mythe","region":"unova","league":false,"day":false,"ace":63,"gym":true,"champion":false,"levelCap":63,"steps":[{"stepIndex":0,"kind":"route","name":"9号道路","sourceName":"Route 9","wild":4,"trainers":3,"areas":["bw:unova-route-9-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[58,59]},{"stepIndex":1,"kind":"heal","name":"9号道路","sourceName":"Route 9"},{"stepIndex":2,"kind":"route","name":"9号道路（东）","sourceName":"Route 9 (est)","wild":3,"trainers":3,"areas":["bw:unova-route-9-area"],"species":[],"habitat":"Route 9|bw:unova-route-9-area","bg":"prairie","climate":null,"levelBand":[59,61]},{"stepIndex":3,"kind":"heal","name":"双龙市","sourceName":"Janusia"},{"stepIndex":4,"kind":"find","name":"双龙市","sourceName":"Janusia"},{"stepIndex":5,"kind":"route","name":"双龙市","sourceName":"Janusia","wild":0,"trainers":4,"areas":[],"species":[],"habitat":null,"bg":"town","climate":null,"levelBand":[61,62]},{"stepIndex":6,"kind":"gym","name":"双龙道馆","sourceName":"Arène de Janusia","team":[[611,61],[621,61],[634,61],[612,63]],"ace":null,"aceOffset":0,"power":1.02,"double":false,"badge":"Mythe","champion":false,"type":"dragon"}],"routes":[{"stepIndex":0,"kind":"route","name":"9号道路","sourceName":"Route 9","habitat":null,"bg":"prairie","wild":4,"trainers":3,"areas":["bw:unova-route-9-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[58,59]},{"stepIndex":2,"kind":"route","name":"9号道路（东）","sourceName":"Route 9 (est)","habitat":"Route 9|bw:unova-route-9-area","bg":"prairie","wild":3,"trainers":3,"areas":["bw:unova-route-9-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[59,61]}],"staticEncounters":[],"boss":{"name":"夏卡","type":"dragon","team":[[611,61],[621,61],[634,61],[612,63]],"badge":"Mythe","champion":false,"ace":null,"aceOffset":0,"power":1.02,"double":false}},{"index":76,"name":"冠军之路","sourceName":"Route Victoire","region":"unova","league":false,"day":false,"ace":70,"gym":true,"champion":false,"levelCap":70,"steps":[{"stepIndex":0,"kind":"route","name":"10号道路","sourceName":"Route 10","wild":4,"trainers":3,"areas":["bw:unova-route-10-area","bw:unova-route-10-victory-road-gate"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[63,65]},{"stepIndex":1,"kind":"heal","name":"冠军之路","sourceName":"Route Victoire"},{"stepIndex":2,"kind":"route","name":"冠军之路","sourceName":"Route Victoire","wild":4,"trainers":3,"areas":["bw:unova-victory-road-outside","bw:unova-victory-road-1f-unknown-room","bw:unova-victory-road-4f-middle-room","bw:unova-victory-road-unknown-area-53"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[65,67]},{"stepIndex":3,"kind":"heal","name":"冠军之路","sourceName":"Route Victoire"},{"stepIndex":4,"kind":"route","name":"冠军之路","sourceName":"Route Victoire","wild":3,"trainers":3,"areas":["bw:unova-victory-road-outside","bw:unova-victory-road-1f-unknown-room","bw:unova-victory-road-4f-middle-room","bw:unova-victory-road-unknown-area-53"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[67,69]},{"stepIndex":5,"kind":"gym","name":"冠军之路","sourceName":"Route Victoire","team":[[505,68],[521,68],[510,70]],"ace":null,"aceOffset":0,"power":1.25,"double":false,"badge":null,"champion":false,"type":"normal"}],"routes":[{"stepIndex":0,"kind":"route","name":"10号道路","sourceName":"Route 10","habitat":null,"bg":"prairie","wild":4,"trainers":3,"areas":["bw:unova-route-10-area","bw:unova-route-10-victory-road-gate"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[63,65]},{"stepIndex":2,"kind":"route","name":"冠军之路","sourceName":"Route Victoire","habitat":null,"bg":"cave","wild":4,"trainers":3,"areas":["bw:unova-victory-road-outside","bw:unova-victory-road-1f-unknown-room","bw:unova-victory-road-4f-middle-room","bw:unova-victory-road-unknown-area-53"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[65,67]},{"stepIndex":4,"kind":"route","name":"冠军之路","sourceName":"Route Victoire","habitat":null,"bg":"cave","wild":3,"trainers":3,"areas":["bw:unova-victory-road-outside","bw:unova-victory-road-1f-unknown-room","bw:unova-victory-road-4f-middle-room","bw:unova-victory-road-unknown-area-53"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[67,69]}],"staticEncounters":[],"boss":{"name":"黑连","type":"normal","team":[[505,68],[521,68],[510,70]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":1.25,"double":false}},{"index":77,"name":"四天王：婉龙","sourceName":"Conseil 4 : Anis","region":"unova","league":true,"day":false,"ace":80,"gym":true,"champion":false,"levelCap":83,"steps":[{"stepIndex":0,"kind":"heal","name":"宝可梦联盟","sourceName":"Ligue Pokémon"},{"stepIndex":1,"kind":"route","name":"房间","sourceName":"Salle","wild":0,"trainers":4,"areas":["bw:celestial-tower-2f","bw:relic-castle-a","bw:dreamyard-area"],"species":[],"habitat":null,"bg":"gym-ghost","climate":null,"levelBand":[70,79]},{"stepIndex":2,"kind":"gym","name":"第4房间","sourceName":"Salle 4","team":[[563,78],[593,78],[623,78],[609,80]],"ace":null,"aceOffset":0,"power":0.89,"double":false,"badge":null,"champion":false,"type":"ghost"}],"routes":[],"staticEncounters":[],"boss":{"name":"婉龙","type":"ghost","team":[[563,78],[593,78],[623,78],[609,80]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":0.89,"double":false}},{"index":78,"name":"四天王：越橘","sourceName":"Conseil 4 : Pieris","region":"unova","league":true,"day":false,"ace":85,"gym":true,"champion":false,"levelCap":88,"steps":[{"stepIndex":0,"kind":"heal","name":"宝可梦联盟","sourceName":"Ligue Pokémon"},{"stepIndex":1,"kind":"route","name":"房间","sourceName":"Salle","wild":0,"trainers":4,"areas":["bw:unova-route-4-area","bw:desert-resort-area","bw:unova-route-9-area"],"species":[],"habitat":null,"bg":"gym-dark","climate":null,"levelBand":[80,84]},{"stepIndex":2,"kind":"gym","name":"第4房间","sourceName":"Salle 4","team":[[560,83],[510,83],[553,83],[625,85]],"ace":null,"aceOffset":0,"power":1,"double":false,"badge":null,"champion":false,"type":"dark"}],"routes":[],"staticEncounters":[],"boss":{"name":"越橘","type":"dark","team":[[560,83],[510,83],[553,83],[625,85]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":1,"double":false}},{"index":79,"name":"四天王：嘉德丽雅","sourceName":"Conseil 4 : Percila","region":"unova","league":true,"day":false,"ace":90,"gym":true,"champion":false,"levelCap":93,"steps":[{"stepIndex":0,"kind":"heal","name":"宝可梦联盟","sourceName":"Ligue Pokémon"},{"stepIndex":1,"kind":"route","name":"房间","sourceName":"Salle","wild":0,"trainers":4,"areas":["bw:dreamyard-area","bw:unova-route-5-area","bw:desert-resort-area"],"species":[],"habitat":null,"bg":"gym-psychic","climate":null,"levelBand":[85,89]},{"stepIndex":2,"kind":"gym","name":"第4房间","sourceName":"Salle 4","team":[[579,88],[518,88],[561,88],[576,90]],"ace":null,"aceOffset":0,"power":0.86,"double":false,"badge":null,"champion":false,"type":"psychic"}],"routes":[],"staticEncounters":[],"boss":{"name":"嘉德丽雅","type":"psychic","team":[[579,88],[518,88],[561,88],[576,90]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":0.86,"double":false}},{"index":80,"name":"四天王：连武","sourceName":"Conseil 4 : Kunz","region":"unova","league":true,"day":false,"ace":95,"gym":true,"champion":false,"levelCap":95,"steps":[{"stepIndex":0,"kind":"heal","name":"宝可梦联盟","sourceName":"Ligue Pokémon"},{"stepIndex":1,"kind":"route","name":"房间","sourceName":"Salle","wild":0,"trainers":4,"areas":["bw:pinwheel-forest-outside","bw:unova-route-10-area","bw:wellspring-cave-area"],"species":[],"habitat":null,"bg":"gym-fighting","climate":null,"levelBand":[90,94]},{"stepIndex":2,"kind":"gym","name":"第4房间","sourceName":"Salle 4","team":[[538,93],[539,93],[534,93],[620,95]],"ace":null,"aceOffset":0,"power":0.86,"double":false,"badge":null,"champion":false,"type":"fighting"}],"routes":[],"staticEncounters":[],"boss":{"name":"连武","type":"fighting","team":[[538,93],[539,93],[534,93],[620,95]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":0.86,"double":false}},{"index":81,"name":"N的城堡","sourceName":"Palais de N","region":"unova","league":true,"day":false,"ace":95,"gym":true,"champion":false,"levelCap":100,"steps":[{"stepIndex":0,"kind":"heal","name":"N的城堡","sourceName":"Palais de N"},{"stepIndex":1,"kind":"route","name":"N的城堡","sourceName":"Palais de N","wild":0,"trainers":4,"areas":["bw:relic-castle-c","bw:chargestone-cave-b1f","bw:twist-mountain-b1f-3f"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[95,96]},{"stepIndex":2,"kind":"gym","name":"N的城堡","sourceName":"Palais de N","team":[[565,93],[584,93],[567,93],[571,93],[601,93],[643,95]],"ace":null,"aceOffset":0,"power":0.78,"double":false,"badge":null,"champion":false,"type":"dragon"}],"routes":[],"staticEncounters":[],"boss":{"name":"N","type":"dragon","team":[[565,93],[584,93],[567,93],[571,93],[601,93],[643,95]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":0.78,"double":false}},{"index":82,"name":"魁奇思","sourceName":"Ghetis","region":"unova","league":true,"day":false,"ace":95,"gym":true,"champion":true,"levelCap":100,"steps":[{"stepIndex":0,"kind":"heal","name":"N的城堡","sourceName":"Palais de N"},{"stepIndex":1,"kind":"route","name":"N的城堡","sourceName":"Palais de N","wild":0,"trainers":4,"areas":["bw:relic-castle-d","bw:dragonspiral-tower-2f","bw:giant-chasm-area"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[95,96]},{"stepIndex":2,"kind":"gym","name":"N的城堡","sourceName":"Palais de N","team":[[563,93],[626,93],[537,93],[625,93],[604,93],[635,95]],"ace":null,"aceOffset":0,"power":0.83,"double":false,"badge":"Maître Unys","champion":true,"type":"dark"}],"routes":[],"staticEncounters":[],"boss":{"name":"魁奇思","type":"dark","team":[[563,93],[626,93],[537,93],[625,93],[604,93],[635,95]],"badge":"Maître Unys","champion":true,"ace":null,"aceOffset":0,"power":0.83,"double":false}},{"index":83,"name":"巨人洞窟","sourceName":"Grotte Cyclopéenne","region":"unova","league":false,"day":false,"ace":100,"gym":true,"champion":false,"levelCap":100,"steps":[{"stepIndex":0,"kind":"heal","name":"双龙市","sourceName":"Janusia"},{"stepIndex":1,"kind":"route","name":"11号道路","sourceName":"Route 11","wild":3,"trainers":3,"areas":["bw:unova-route-11-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[95,96]},{"stepIndex":2,"kind":"route","name":"村庄桥","sourceName":"Pont du Hameau","wild":3,"trainers":2,"areas":["bw:village-bridge-area"],"species":[],"habitat":null,"bg":"pier","climate":{"rain":2,"storm":1},"levelBand":[95,96]},{"stepIndex":3,"kind":"heal","name":"村庄桥","sourceName":"Pont du Hameau"},{"stepIndex":4,"kind":"route","name":"12号道路","sourceName":"Route 12","wild":3,"trainers":2,"areas":["bw:unova-route-12-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[96,97]},{"stepIndex":5,"kind":"route","name":"13号道路","sourceName":"Route 13","wild":3,"trainers":2,"areas":["bw:unova-route-13-area"],"species":[],"habitat":null,"bg":"beach","climate":null,"levelBand":[96,97]},{"stepIndex":6,"kind":"heal","name":"涟漪镇","sourceName":"Vaguelone"},{"stepIndex":7,"kind":"route","name":"涟漪湾","sourceName":"Baie Vaguelone","wild":3,"trainers":2,"areas":["bw:undella-town-area","bw:undella-bay-area"],"species":[],"habitat":null,"bg":"beach","climate":null,"levelBand":[96,97]},{"stepIndex":8,"kind":"route","name":"14号道路","sourceName":"Route 14","wild":3,"trainers":2,"areas":["bw:unova-route-14-area"],"species":[],"habitat":null,"bg":"beach","climate":null,"levelBand":[97,98]},{"stepIndex":9,"kind":"heal","name":"笼目镇","sourceName":"Entrelasque"},{"stepIndex":10,"kind":"route","name":"15号道路","sourceName":"Route 15","wild":3,"trainers":2,"areas":["bw:unova-route-15-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[97,98]},{"stepIndex":11,"kind":"route","name":"白森林","sourceName":"Forêt Blanche","wild":4,"trainers":0,"areas":[],"species":[187,191,270,285,315,43,427,114,39,183,300,333],"habitat":null,"bg":"forest","climate":null,"levelBand":[97,98]},{"stepIndex":12,"kind":"route","name":"黑色市","sourceName":"Ville Noire","wild":0,"trainers":4,"areas":[],"species":[],"habitat":null,"bg":"town","climate":null,"levelBand":[98,99]},{"stepIndex":13,"kind":"route","name":"16号道路","sourceName":"Route 16","wild":3,"trainers":2,"areas":["bw:unova-route-16-area"],"species":[],"habitat":null,"bg":"prairie","climate":null,"levelBand":[98,99]},{"stepIndex":14,"kind":"route","name":"迷幻森林","sourceName":"Bois des Illusions","wild":3,"trainers":1,"areas":["bw:lostlorn-forest-area"],"species":[],"habitat":null,"bg":"forest","climate":{"fog":4,"rain":1},"levelBand":[98,99]},{"stepIndex":15,"kind":"heal","name":"巨人洞窟","sourceName":"Grotte Cyclopéenne"},{"stepIndex":16,"kind":"route","name":"巨人洞窟","sourceName":"Grotte Cyclopéenne","wild":4,"trainers":2,"areas":["bw:giant-chasm-outside","bw:giant-chasm-area","bw:giant-chasm-forest","bw:giant-chasm-forest-cave"],"species":[],"habitat":null,"bg":"cave","climate":null,"levelBand":[99,100]},{"stepIndex":17,"kind":"gym","name":"巨人洞窟","sourceName":"Grotte Cyclopéenne","team":[[617,98],[626,98],[621,98],[584,98],[589,98],[637,100]],"ace":null,"aceOffset":0,"power":0.99,"double":false,"badge":null,"champion":false,"type":"bug"}],"routes":[{"stepIndex":1,"kind":"route","name":"11号道路","sourceName":"Route 11","habitat":null,"bg":"prairie","wild":3,"trainers":3,"areas":["bw:unova-route-11-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[95,96]},{"stepIndex":2,"kind":"route","name":"村庄桥","sourceName":"Pont du Hameau","habitat":null,"bg":"pier","wild":3,"trainers":2,"areas":["bw:village-bridge-area"],"species":[],"day":false,"night":false,"skies":[],"climate":{"rain":2,"storm":1},"levelBand":[95,96]},{"stepIndex":4,"kind":"route","name":"12号道路","sourceName":"Route 12","habitat":null,"bg":"prairie","wild":3,"trainers":2,"areas":["bw:unova-route-12-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[96,97]},{"stepIndex":5,"kind":"route","name":"13号道路","sourceName":"Route 13","habitat":null,"bg":"beach","wild":3,"trainers":2,"areas":["bw:unova-route-13-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[96,97]},{"stepIndex":7,"kind":"route","name":"涟漪湾","sourceName":"Baie Vaguelone","habitat":null,"bg":"beach","wild":3,"trainers":2,"areas":["bw:undella-town-area","bw:undella-bay-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[96,97]},{"stepIndex":8,"kind":"route","name":"14号道路","sourceName":"Route 14","habitat":null,"bg":"beach","wild":3,"trainers":2,"areas":["bw:unova-route-14-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[97,98]},{"stepIndex":10,"kind":"route","name":"15号道路","sourceName":"Route 15","habitat":null,"bg":"prairie","wild":3,"trainers":2,"areas":["bw:unova-route-15-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[97,98]},{"stepIndex":11,"kind":"route","name":"白森林","sourceName":"Forêt Blanche","habitat":null,"bg":"forest","wild":4,"trainers":0,"areas":[],"species":[187,191,270,285,315,43,427,114,39,183,300,333],"day":true,"night":false,"skies":[],"climate":null,"levelBand":[97,98]},{"stepIndex":13,"kind":"route","name":"16号道路","sourceName":"Route 16","habitat":null,"bg":"prairie","wild":3,"trainers":2,"areas":["bw:unova-route-16-area"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[98,99]},{"stepIndex":14,"kind":"route","name":"迷幻森林","sourceName":"Bois des Illusions","habitat":null,"bg":"forest","wild":3,"trainers":1,"areas":["bw:lostlorn-forest-area"],"species":[],"day":false,"night":false,"skies":[],"climate":{"fog":4,"rain":1},"levelBand":[98,99]},{"stepIndex":16,"kind":"route","name":"巨人洞窟","sourceName":"Grotte Cyclopéenne","habitat":null,"bg":"cave","wild":4,"trainers":2,"areas":["bw:giant-chasm-outside","bw:giant-chasm-area","bw:giant-chasm-forest","bw:giant-chasm-forest-cave"],"species":[],"day":false,"night":false,"skies":[],"climate":null,"levelBand":[99,100]}],"staticEncounters":[],"boss":{"name":"阿戴克","type":"bug","team":[[617,98],[626,98],[621,98],[584,98],[589,98],[637,100]],"badge":null,"champion":false,"ace":null,"aceOffset":0,"power":0.99,"double":false}}],"encounters":{"celadon-city-area":[[60,10,10,50,"good-rod"],[61,23,23,25,"super-rod"],[79,15,15,25,"super-rod"],[118,10,10,50,"good-rod"],[129,5,5,100,"old-rod"]],"celadon-city-celadon-mansion":[[133,25,25,100,"gift"]],"celadon-city-prize-corner":[[30,17,17,100,"gift"],[33,17,17,100,"gift"],[35,8,12,100,"gift"],[63,6,9,100,"gift"],[123,25,25,100,"gift"],[127,20,20,100,"gift"],[137,18,26,100,"gift"],[147,18,24,100,"gift"]],"cerulean-cave-1f":[[24,52,52,10,"walk"],[26,53,53,4,"walk"],[28,52,52,10,"walk"],[42,46,46,20,"walk"],[47,52,52,5,"walk"],[49,49,49,10,"walk"],[60,10,10,50,"good-rod"],[64,49,49,5,"walk"],[80,23,23,25,"super-rod"],[82,46,46,15,"walk"],[85,49,49,10,"walk"],[97,46,46,20,"walk"],[99,23,23,17,"super-rod"],[117,23,23,25,"super-rod"],[118,10,10,50,"good-rod"],[119,23,23,17,"super-rod"],[129,5,5,100,"old-rod"],[132,53,53,1,"walk"]],"cerulean-cave-2f":[[40,54,54,5,"walk"],[49,51,51,20,"walk"],[64,51,51,15,"walk"],[85,51,51,20,"walk"],[101,52,52,10,"walk"],[105,52,52,10,"walk"],[112,52,52,10,"walk"],[113,56,56,5,"walk"],[132,55,60,4,"walk"]],"cerulean-cave-b1f":[[24,57,57,5,"walk"],[26,64,64,10,"walk"],[28,57,57,5,"walk"],[47,64,64,10,"walk"],[60,10,10,50,"good-rod"],[80,23,23,25,"super-rod"],[99,23,23,17,"super-rod"],[101,55,55,15,"walk"],[105,55,55,20,"walk"],[112,55,55,20,"walk"],[113,64,64,10,"walk"],[117,23,23,25,"super-rod"],[118,10,10,50,"good-rod"],[119,23,23,17,"super-rod"],[129,5,5,100,"old-rod"],[132,63,67,5,"walk"],[150,70,70,100,"static"]],"cerulean-city-area":[[54,15,15,25,"super-rod"],[60,10,10,50,"good-rod"],[98,15,15,25,"super-rod"],[118,10,15,50,"good-rod|super-rod"],[124,23,100,100,"npc-trade"],[129,5,5,100,"old-rod"]],"cinnabar-island-area":[[60,10,10,50,"good-rod"],[90,15,15,17,"super-rod"],[116,15,15,17,"super-rod"],[118,10,15,50,"good-rod|super-rod"],[120,15,15,25,"super-rod"],[129,5,5,100,"old-rod"]],"cinnabar-island-cinnabar-lab":[[86,28,100,100,"npc-trade"],[101,3,100,100,"npc-trade"],[114,22,100,100,"npc-trade"],[138,30,30,100,"gift"],[140,30,30,100,"gift"],[142,30,30,100,"gift"]],"digletts-cave-area":[[50,15,22,20,"walk"],[51,29,31,4,"walk"]],"fuchsia-city-area":[[60,10,10,50,"good-rod"],[98,15,15,17,"super-rod"],[118,10,15,50,"good-rod|super-rod"],[119,23,23,25,"super-rod"],[129,5,15,100,"old-rod|super-rod"]],"kanto-power-plant-area":[[25,20,24,15,"walk"],[26,33,36,4,"walk"],[81,21,23,20,"walk"],[82,32,35,5,"walk"],[100,21,40,100,"walk|static"],[101,43,43,100,"static"],[125,33,36,4,"walk"],[145,50,50,100,"static"]],"kanto-route-1-area":[[16,2,5,20,"walk"],[19,2,4,20,"walk"]],"kanto-route-10-area":[[21,13,17,20,"walk"],[23,11,17,10,"walk"],[27,11,17,10,"walk"],[60,10,10,50,"good-rod"],[61,23,23,25,"super-rod"],[79,15,15,25,"super-rod"],[100,14,17,20,"walk"],[118,10,10,50,"good-rod"],[129,5,5,100,"old-rod"]],"kanto-route-11-area":[[21,13,17,20,"walk"],[23,12,15,20,"walk"],[27,12,15,20,"walk"],[30,16,100,100,"npc-trade"],[60,10,10,50,"good-rod"],[90,15,15,25,"super-rod"],[96,9,15,10,"walk"],[98,15,15,25,"super-rod"],[118,10,10,50,"good-rod"],[129,5,5,100,"old-rod"]],"kanto-route-12-area":[[16,23,27,20,"walk"],[43,22,26,20,"walk"],[44,28,30,4,"walk"],[48,24,26,10,"walk"],[60,10,10,50,"good-rod"],[69,22,26,20,"walk"],[70,28,30,4,"walk"],[72,5,5,25,"super-rod"],[98,15,15,17,"super-rod"],[118,10,15,50,"good-rod|super-rod"],[129,5,15,100,"old-rod|super-rod"],[143,30,30,100,"pokeflute"]],"kanto-route-13-area":[[16,25,27,20,"walk"],[43,22,26,20,"walk"],[44,28,30,4,"walk"],[48,24,26,10,"walk"],[60,10,10,50,"good-rod"],[69,22,26,20,"walk"],[70,28,30,4,"walk"],[72,5,5,25,"super-rod"],[98,15,15,17,"super-rod"],[118,10,15,50,"good-rod|super-rod"],[129,5,15,100,"old-rod|super-rod"],[132,25,25,5,"walk"]],"kanto-route-14-area":[[16,26,26,20,"walk"],[17,28,30,4,"walk"],[43,22,26,20,"walk"],[44,30,30,5,"walk"],[48,24,26,10,"walk"],[69,22,26,20,"walk"],[70,30,30,5,"walk"],[132,23,23,15,"walk"]],"kanto-route-15-area":[[16,23,23,15,"walk"],[17,28,30,4,"walk"],[43,22,26,20,"walk"],[44,30,30,5,"walk"],[48,26,28,10,"walk"],[69,22,26,20,"walk"],[70,30,30,5,"walk"],[132,26,26,20,"walk"]],"kanto-route-16-area":[[19,18,22,15,"walk"],[20,23,25,4,"walk"],[21,20,22,20,"walk"],[84,18,22,10,"walk"],[143,30,30,100,"pokeflute"]],"kanto-route-17-area":[[20,25,29,15,"walk"],[21,20,22,20,"walk"],[22,25,27,4,"walk"],[60,10,10,50,"good-rod"],[72,5,5,25,"super-rod"],[84,24,28,10,"walk"],[98,15,15,17,"super-rod"],[118,10,15,50,"good-rod|super-rod"],[129,5,15,100,"old-rod|super-rod"]],"kanto-route-18-area":[[20,25,29,15,"walk"],[21,20,22,20,"walk"],[22,25,29,10,"walk"],[60,10,10,50,"good-rod"],[72,5,5,25,"super-rod"],[84,24,28,10,"walk"],[98,15,15,17,"super-rod"],[108,23,100,100,"npc-trade"],[118,10,15,50,"good-rod|super-rod"],[129,5,15,100,"old-rod|super-rod"]],"kanto-route-2-north-towards-pewter-city":[[122,8,100,100,"npc-trade"]],"kanto-route-2-south-towards-viridian-city":[[10,3,5,10,"walk"],[13,3,5,10,"walk"],[16,3,5,20,"walk"],[19,2,5,20,"walk"]],"kanto-route-22-area":[[19,2,4,20,"walk"],[21,3,5,5,"walk"],[29,2,4,20,"walk"],[32,2,4,20,"walk"],[60,10,15,50,"good-rod|super-rod"],[118,10,15,50,"good-rod|super-rod"],[129,5,5,100,"old-rod"]],"kanto-route-23-area":[[21,26,26,15,"walk"],[22,38,43,10,"walk"],[23,26,26,20,"walk"],[24,41,41,5,"walk"],[27,26,26,20,"walk"],[28,41,41,5,"walk"],[60,10,10,50,"good-rod"],[80,23,23,25,"super-rod"],[99,23,23,17,"super-rod"],[117,23,23,25,"super-rod"],[118,10,10,50,"good-rod"],[119,23,23,17,"super-rod"],[129,5,5,100,"old-rod"],[132,33,43,20,"walk"]],"kanto-route-24-area":[[10,7,7,20,"walk"],[11,8,8,20,"walk"],[13,7,7,20,"walk"],[14,8,8,20,"walk"],[16,12,13,15,"walk"],[43,12,14,10,"walk"],[54,15,15,25,"super-rod"],[60,10,10,50,"good-rod"],[63,8,12,10,"walk"],[69,12,14,10,"walk"],[98,15,15,25,"super-rod"],[118,10,15,50,"good-rod|super-rod"],[129,5,5,100,"old-rod"]],"kanto-route-25-area":[[10,8,8,20,"walk"],[11,7,9,20,"walk"],[13,8,8,20,"walk"],[14,7,9,20,"walk"],[16,13,13,15,"walk"],[43,12,14,10,"walk"],[54,15,15,25,"super-rod"],[60,10,10,50,"good-rod"],[63,10,12,10,"walk"],[69,12,14,10,"walk"],[98,15,15,25,"super-rod"],[118,10,15,50,"good-rod|super-rod"],[129,5,5,100,"old-rod"]],"kanto-route-3-area":[[16,6,8,20,"walk"],[21,5,8,20,"walk"],[39,3,7,5,"walk"]],"kanto-route-3-pokemon-center":[[129,5,5,100,"gift"]],"kanto-route-4-area":[[19,8,12,20,"walk"],[21,8,12,20,"walk"],[23,6,12,10,"walk"],[27,6,12,10,"walk"]],"kanto-route-4-pokemon-center":[[129,5,5,100,"gift"]],"kanto-route-5-area":[[16,13,16,20,"walk"],[43,13,16,20,"walk"],[52,10,16,10,"walk"],[56,10,16,10,"walk"],[69,13,16,20,"walk"]],"kanto-route-6-area":[[16,13,16,20,"walk"],[43,13,16,20,"walk"],[52,10,16,10,"walk"],[56,10,16,10,"walk"],[60,10,10,50,"good-rod"],[69,13,16,20,"walk"],[90,15,15,25,"super-rod"],[98,15,15,25,"super-rod"],[118,10,10,50,"good-rod"],[129,5,5,100,"old-rod"]],"kanto-route-7-area":[[16,19,22,20,"walk"],[37,18,20,5,"walk"],[43,19,22,20,"walk"],[52,17,20,15,"walk"],[56,17,20,15,"walk"],[58,18,20,5,"walk"],[69,19,22,20,"walk"]],"kanto-route-8-area":[[16,18,20,20,"walk"],[23,17,19,15,"walk"],[27,17,19,15,"walk"],[37,15,18,10,"walk"],[52,18,20,20,"walk"],[56,18,20,20,"walk"],[58,15,18,10,"walk"]],"kanto-route-9-area":[[19,14,17,20,"walk"],[21,13,17,20,"walk"],[23,11,17,10,"walk"],[27,11,17,10,"walk"]],"kanto-safari-zone-area-1-east":[[29,24,24,20,"walk"],[30,33,33,10,"walk"],[32,24,24,20,"walk"],[33,33,33,10,"walk"],[46,22,22,15,"walk"],[47,25,25,5,"walk"],[54,15,15,17,"super-rod"],[60,10,10,50,"good-rod"],[79,15,15,25,"super-rod"],[84,26,26,20,"walk"],[98,15,15,17,"super-rod"],[102,23,25,10,"walk"],[115,25,25,4,"walk"],[118,10,10,50,"good-rod"],[123,28,28,1,"walk"],[127,28,28,1,"walk"],[129,5,5,100,"old-rod"],[147,15,15,25,"super-rod"]],"kanto-safari-zone-area-2-north":[[29,22,22,20,"walk"],[30,30,30,10,"walk"],[32,22,22,20,"walk"],[33,30,30,10,"walk"],[46,23,23,15,"walk"],[49,32,32,5,"walk"],[54,15,15,17,"super-rod"],[60,10,10,50,"good-rod"],[79,15,15,25,"super-rod"],[98,15,15,17,"super-rod"],[102,25,27,10,"walk"],[111,26,26,20,"walk"],[113,26,26,4,"walk"],[118,10,10,50,"good-rod"],[128,28,28,1,"walk"],[129,5,5,100,"old-rod"],[147,15,15,25,"super-rod"]],"kanto-safari-zone-area-3-west":[[29,25,25,20,"walk"],[30,33,33,10,"walk"],[32,25,25,20,"walk"],[33,33,33,10,"walk"],[48,23,23,15,"walk"],[49,31,31,5,"walk"],[54,15,15,17,"super-rod"],[60,10,10,50,"good-rod"],[79,15,15,25,"super-rod"],[84,26,26,20,"walk"],[98,15,15,17,"super-rod"],[102,24,26,10,"walk"],[115,28,28,1,"walk"],[118,10,10,50,"good-rod"],[128,26,26,4,"walk"],[129,5,5,100,"old-rod"],[147,15,15,25,"super-rod"]],"kanto-safari-zone-middle":[[29,22,22,20,"walk"],[30,31,31,10,"walk"],[32,22,22,20,"walk"],[33,31,31,10,"walk"],[47,30,30,5,"walk"],[48,22,22,15,"walk"],[54,15,15,17,"super-rod"],[60,10,10,50,"good-rod"],[79,15,15,25,"super-rod"],[98,15,15,17,"super-rod"],[102,24,25,10,"walk"],[111,25,25,20,"walk"],[113,23,23,1,"walk"],[118,10,10,50,"good-rod"],[123,23,23,4,"walk"],[127,23,23,4,"walk"],[129,5,5,100,"old-rod"],[147,15,15,25,"super-rod"]],"kanto-sea-route-19-area":[[60,10,10,50,"good-rod"],[72,5,40,20,"surf"],[90,15,15,17,"super-rod"],[116,15,15,17,"super-rod"],[118,10,15,50,"good-rod|super-rod"],[120,15,15,25,"super-rod"],[129,5,5,100,"old-rod"]],"kanto-sea-route-20-area":[[60,10,10,50,"good-rod"],[72,5,40,20,"surf"],[90,15,15,17,"super-rod"],[116,15,15,17,"super-rod"],[118,10,15,50,"good-rod|super-rod"],[120,15,15,25,"super-rod"],[129,5,5,100,"old-rod"]],"kanto-sea-route-21-area":[[16,21,23,20,"walk"],[17,30,32,10,"walk"],[19,21,23,20,"walk"],[20,30,30,15,"walk"],[60,10,10,50,"good-rod"],[72,5,40,20,"surf"],[90,15,15,17,"super-rod"],[114,28,32,5,"walk"],[116,15,15,17,"super-rod"],[118,10,15,50,"good-rod|super-rod"],[120,15,15,25,"super-rod"],[129,5,5,100,"old-rod"]],"kanto-underground-path-area":[[29,2,100,100,"npc-trade"]],"kanto-victory-road-2-1f":[[41,22,22,15,"walk"],[42,41,41,5,"walk"],[66,24,24,20,"walk"],[67,42,42,4,"walk"],[74,26,26,20,"walk"],[75,41,41,5,"walk"],[95,36,42,10,"walk"],[105,43,43,1,"walk"]],"kanto-victory-road-2-2f":[[41,26,26,15,"walk"],[42,40,40,5,"walk"],[66,22,22,20,"walk"],[67,41,41,5,"walk"],[74,24,24,20,"walk"],[75,43,43,1,"walk"],[95,36,42,10,"walk"],[105,40,40,4,"walk"],[146,50,50,100,"static"]],"kanto-victory-road-2-3f":[[41,22,22,15,"walk"],[42,41,41,5,"walk"],[49,40,40,10,"walk"],[66,24,24,20,"walk"],[67,42,45,4,"walk"],[74,26,26,20,"walk"],[75,43,43,5,"walk"],[95,42,45,10,"walk"]],"mt-moon-1f":[[35,8,8,1,"walk"],[41,6,11,20,"walk"],[46,8,8,5,"walk"],[74,8,10,10,"walk"]],"mt-moon-b1f":[[35,9,9,4,"walk"],[41,7,11,20,"walk"],[46,10,10,10,"walk"],[74,7,9,15,"walk"]],"mt-moon-b2f":[[35,10,12,5,"walk"],[41,9,12,20,"walk"],[46,10,12,10,"walk"],[74,9,10,20,"walk"]],"pallet-town-area":[[1,5,5,100,"gift"],[4,5,5,100,"gift"],[7,5,5,100,"gift"],[60,10,15,50,"good-rod|super-rod"],[72,15,15,25,"super-rod"],[118,10,10,50,"good-rod"],[129,5,5,100,"old-rod"]],"pokemon-mansion-1f":[[37,34,34,10,"walk"],[58,34,34,10,"walk"],[77,28,34,15,"walk"],[88,30,32,20,"walk"],[89,37,39,4,"walk"],[109,30,32,20,"walk"],[110,37,39,4,"walk"]],"pokemon-mansion-2f":[[37,32,32,20,"walk"],[58,32,32,20,"walk"],[77,28,32,10,"walk"],[88,30,34,20,"walk"],[89,37,39,4,"walk"],[109,30,34,20,"walk"],[110,37,39,4,"walk"]],"pokemon-mansion-3f":[[37,33,33,20,"walk"],[58,33,33,20,"walk"],[77,32,36,10,"walk"],[88,31,35,20,"walk"],[89,38,42,10,"walk"],[109,31,35,20,"walk"],[110,38,42,10,"walk"],[126,34,34,10,"walk"]],"pokemon-mansion-b1f":[[37,35,35,15,"walk"],[58,35,35,15,"walk"],[77,32,34,10,"walk"],[88,31,35,20,"walk"],[89,40,42,10,"walk"],[109,31,35,20,"walk"],[110,40,42,10,"walk"],[126,38,38,4,"walk"]],"pokemon-tower-3f":[[92,18,24,20,"walk"],[93,25,25,1,"walk"],[104,20,22,5,"walk"]],"pokemon-tower-4f":[[92,18,24,20,"walk"],[93,25,25,5,"walk"],[104,20,22,5,"walk"]],"pokemon-tower-5f":[[92,18,24,20,"walk"],[93,25,25,5,"walk"],[104,20,22,5,"walk"]],"pokemon-tower-6f":[[92,19,24,20,"walk"],[93,26,28,5,"walk"],[104,22,24,5,"walk"]],"pokemon-tower-7f":[[92,20,24,20,"walk"],[93,28,30,10,"walk"],[104,22,24,5,"walk"]],"rock-tunnel-b1f":[[41,15,18,20,"walk"],[66,15,17,10,"walk"],[74,16,17,15,"walk"],[95,13,15,4,"walk"]],"rock-tunnel-b2f":[[41,16,18,20,"walk"],[66,15,17,10,"walk"],[74,16,18,15,"walk"],[95,13,17,5,"walk"]],"saffron-city-fighting-dojo":[[106,30,30,100,"gift"],[107,30,30,100,"gift"]],"saffron-city-silph-co-7f":[[131,15,15,100,"gift"]],"seafoam-islands-1f":[[41,21,21,10,"walk"],[42,29,29,5,"walk"],[54,28,30,20,"walk"],[55,38,38,1,"walk"],[79,28,30,20,"walk"],[80,38,38,1,"walk"],[86,30,30,20,"walk"],[90,28,30,15,"walk"],[98,28,30,10,"walk"],[116,28,30,10,"walk"],[120,28,30,15,"walk"]],"seafoam-islands-b1f":[[54,28,30,10,"walk"],[79,28,30,10,"walk"],[86,28,30,10,"walk"],[87,38,38,4,"walk"],[90,30,32,20,"walk"],[98,30,32,20,"walk"],[99,37,37,1,"walk"],[116,30,32,20,"walk"],[117,37,37,1,"walk"],[120,30,32,20,"walk"]],"seafoam-islands-b2f":[[42,30,30,4,"walk"],[54,30,32,20,"walk"],[55,37,37,1,"walk"],[79,30,32,20,"walk"],[80,37,37,1,"walk"],[86,30,32,20,"walk"],[90,28,30,10,"walk"],[98,28,30,10,"walk"],[116,28,30,10,"walk"],[120,28,30,10,"walk"]],"seafoam-islands-b3f":[[54,31,33,20,"walk"],[60,10,10,50,"good-rod"],[79,31,33,20,"walk"],[86,31,33,20,"walk"],[87,37,37,1,"walk"],[90,15,31,17,"walk|super-rod"],[98,29,31,10,"walk"],[99,39,39,4,"walk"],[116,15,31,17,"walk|super-rod"],[117,39,39,4,"walk"],[118,10,15,50,"good-rod|super-rod"],[120,15,31,25,"super-rod|walk"],[129,5,5,100,"old-rod"]],"seafoam-islands-b4f":[[42,32,32,1,"walk"],[54,29,31,10,"walk"],[55,39,39,4,"walk"],[60,10,10,50,"good-rod"],[79,29,31,10,"walk"],[80,39,39,4,"walk"],[86,29,31,10,"walk"],[90,15,33,20,"walk|super-rod"],[98,31,33,20,"walk"],[116,15,33,20,"walk|super-rod"],[118,10,15,50,"good-rod|super-rod"],[120,15,33,25,"super-rod|walk"],[129,5,5,100,"old-rod"],[144,50,50,100,"static"]],"vermilion-city-area":[[60,10,10,50,"good-rod"],[83,3,100,100,"npc-trade"],[90,15,15,25,"super-rod"],[98,15,15,25,"super-rod"],[118,10,10,50,"good-rod"],[129,5,5,100,"old-rod"]],"vermilion-city-ss-anne-dock":[[60,10,10,50,"good-rod"],[90,15,15,25,"super-rod"],[98,15,15,25,"super-rod"],[118,10,10,50,"good-rod"],[129,5,5,100,"old-rod"]],"viridian-city-area":[[60,10,15,50,"good-rod|super-rod"],[72,15,15,25,"super-rod"],[118,10,10,50,"good-rod"],[129,5,5,100,"old-rod"]],"viridian-forest-area":[[10,3,5,20,"walk"],[11,4,6,20,"walk"],[13,3,5,20,"walk"],[14,4,6,20,"walk"],[25,3,5,4,"walk"]]},"habitats":{"Route 29|gsc:johto-route-29-area":{"base":{"16":30,"19":15,"102":3,"161":30,"165":8,"204":5},"night":{"16":0,"19":25,"155":4,"161":0,"163":30,"165":0,"167":8},"rain":{"60":6},"storm":{"60":10}},"Routes 30-31|gsc:johto-route-30-area+gsc:johto-route-31-area":{"base":{"10":20,"13":20,"16":20,"69":8,"129":4,"152":5,"204":5,"206":3},"night":{"10":0,"13":0,"16":0,"19":20,"69":0,"152":0,"163":20,"167":15},"rain":{"60":10,"129":8,"158":5},"storm":{"60":8,"129":7}},"Tour Chétiflor|gsc:sprout-tower-2f+gsc:sprout-tower-3f":{"base":{"19":50,"92":50}},"Route 32|gsc:johto-route-32-area":{"base":{"19":10,"23":20,"69":15,"72":12,"129":4,"179":15,"187":6,"211":2},"night":{"19":25,"41":4,"69":0,"163":18,"187":0,"194":12},"rain":{"72":20,"194":10,"211":3},"storm":{"25":5,"179":25,"194":8}},"Ruines d'Alpha|species":{"base":{"177":30,"201":4,"235":8,"20101":3,"20102":3,"20103":2.5,"20104":2,"20105":2,"20106":1.5,"20107":1.5,"20108":1,"20109":1,"20110":2,"20111":1.5,"20112":1.5,"20113":1,"20114":1},"night":{"20110":0,"20111":0,"20112":0,"20113":0,"20114":0,"20115":3,"20116":2,"20117":2,"20118":1.5,"20119":1},"rain":{"20120":3,"20121":2,"20122":1.5,"20123":1},"storm":{"20120":3,"20121":2,"20122":1.5,"20123":1,"20124":2,"20125":1.5,"20126":0.8,"20127":0.5}},"Caves Jumelles|gsc:union-cave-1f+gsc:union-cave-b1f":{"base":{"27":12,"41":18,"74":22,"95":4,"118":5,"131":1,"194":20,"195":6}},"Route 33|gsc:johto-route-33-area":{"base":{"19":15,"21":15,"23":25,"187":25,"190":5,"214":4},"night":{"19":35,"21":0,"41":20,"163":10,"187":0,"214":0},"rain":{"54":6,"60":8},"storm":{"60":6,"179":8}},"Puits Ramoloss|gsc:slowpoke-well-1f+gsc:slowpoke-well-b1f":{"base":{"41":22,"79":50,"80":1.5,"118":8,"129":6}},"Bois aux Chênes|gsc:ilex-forest-area":{"base":{"10":22,"13":22,"46":12,"54":15,"129":3,"152":5,"204":5},"night":{"10":0,"13":0,"41":6,"43":18,"92":4,"152":0,"163":12,"167":6},"rain":{"54":25,"55":2,"60":8,"129":6},"storm":{"54":20,"60":6}},"Route 34|gsc:johto-route-34-area":{"base":{"19":20,"63":8,"72":15,"98":6,"102":6,"132":6,"204":5},"night":{"19":30,"96":25,"120":4,"163":15},"rain":{"72":25,"98":10,"129":6,"222":5},"storm":{"72":22,"98":8,"222":5}},"Route 35|gsc:johto-route-35-area":{"base":{"29":20,"32":20,"54":15,"63":5,"132":4,"165":5,"193":3},"night":{"96":15,"163":12,"165":0,"167":4,"193":0},"rain":{"54":25,"60":8,"129":6,"158":3},"storm":{"54":20,"60":7}},"Parc Naturel|gsc:national-park-area":{"base":{"10":14,"11":4,"12":2,"13":14,"14":4,"15":2,"46":8,"123":5,"127":5,"165":12,"191":8,"193":3},"night":{"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"46":12,"48":14,"49":3,"163":8,"165":0,"167":14,"191":0},"rain":{"54":6,"193":6},"storm":{"25":4,"54":5}},"Route 36|gsc:johto-route-36-area":{"base":{"16":12,"29":22,"32":22,"58":6,"204":4,"234":5},"night":{"16":0,"37":6,"58":0,"163":18,"167":5},"rain":{"58":2,"60":5},"storm":{"58":0,"60":5}},"Route 37|gsc:johto-route-37-area":{"base":{"16":25,"17":4,"58":8,"204":5,"234":25},"night":{"16":0,"17":0,"37":8,"58":0,"163":30,"167":20,"168":4},"rain":{"54":5,"58":2},"storm":{"58":0,"179":6}},"Tour Cendrée|gsc:burned-tower-1f+gsc:burned-tower-b1f":{"base":{"19":35,"41":10,"109":35,"126":4,"218":8}},"Route 38|gsc:johto-route-38-area":{"base":{"19":22,"81":10,"83":5,"102":10,"128":6,"209":5,"241":8},"night":{"19":30,"20":12,"52":25,"83":0,"128":0,"163":18,"209":0},"rain":{"81":14},"storm":{"81":18,"100":10}},"Route 39|gsc:johto-route-39-area":{"base":{"19":22,"81":10,"83":5,"128":6,"241":10},"night":{"19":30,"20":12,"52":25,"83":0,"128":0,"163":18},"rain":{"81":14},"storm":{"81":20,"100":10}},"Routes 40-41|gsc:johto-sea-route-40-area+gsc:johto-sea-route-41-area":{"base":{"72":45,"73":5,"90":5,"98":6,"129":10,"170":5,"222":4,"226":3},"night":{"120":6,"170":12,"211":5,"222":0},"rain":{"90":8,"98":10,"226":5},"storm":{"170":12,"171":4}},"Îles Tourbillon|gsc:whirl-islands-1f+gsc:whirl-islands-b1f+gsc:whirl-islands-b2f+gsc:whirl-islands-b3f":{"base":{"41":20,"72":10,"86":6,"98":30,"99":2,"116":12,"117":2}},"Phare d'Oliville|species":{"base":{"72":15,"81":25,"82":5,"98":15,"164":8,"179":20}},"Route 42|gsc:johto-route-42-area":{"base":{"21":20,"22":3,"56":20,"74":10,"118":15,"179":12,"190":3,"214":3},"night":{"21":0,"22":0,"41":15,"214":0},"rain":{"60":8,"118":22},"storm":{"179":22,"180":4},"snow":{"215":5,"220":8}},"Mont Creuset|gsc:mt-mortar-1f+gsc:mt-mortar-b1f+gsc:mt-mortar-lower-cave+gsc:mt-mortar-upper-cave":{"base":{"19":8,"41":18,"66":20,"67":4,"74":20,"118":12,"119":3,"183":2}},"Route 43|gsc:johto-route-43-area":{"base":{"129":15,"162":10,"179":8,"180":15,"203":20},"night":{"48":6,"49":3,"162":0,"163":15,"164":6,"203":0},"rain":{"60":8,"129":25},"storm":{"179":15,"180":20}},"Lac Colère|gsc:lake-of-rage-area":{"base":{"102":4,"129":40,"130":15,"204":5},"night":{"48":6,"163":12},"rain":{"60":8,"129":55,"130":20},"storm":{"130":25}},"Repaire Rocket|gsc:team-rocket-hq-area":{"base":{"74":24.3,"100":24.3,"101":24.3,"109":24.3}},"Repaire Rocket B2|gsc:team-rocket-hq-area":{"base":{"74":24.3,"100":24.3,"101":24.3,"109":24.3}},"Doublonville|species":{"base":{"19":25,"20":5,"81":12,"88":12,"100":10,"109":12},"night":{"19":30,"52":15,"198":8},"rain":{"88":18}},"Sous-sol|species":{"base":{"19":20,"52":15,"53":3,"88":12,"100":10,"228":5}},"Tour Radio|species":{"base":{"19":20,"88":12,"89":3,"109":15,"110":3,"198":6,"228":6}},"Route 44|gsc:johto-route-44-area":{"base":{"21":12,"69":12,"70":15,"108":4,"114":18,"152":0.5,"223":3},"night":{"21":0,"43":15,"44":4,"69":0,"70":0,"152":0,"164":8},"rain":{"60":15,"61":3,"223":6},"storm":{"60":12,"179":6},"snow":{"215":5,"220":8}},"Route de Glace|gsc:ice-path-1f+gsc:ice-path-b1f+gsc:ice-path-b2f+gsc:ice-path-b3f":{"base":{"41":15.6,"42":31.3,"124":6.3,"220":31.3,"225":15.6}},"Routes 45-46|gsc:johto-route-45-area+gsc:johto-route-46-area":{"base":{"21":15,"74":25,"75":4,"207":6,"216":5,"227":3,"231":6},"night":{"19":12,"21":0,"39":8},"rain":{"60":6,"129":15},"storm":{"60":5,"179":5},"snow":{"215":5,"220":8}},"Antre du Dragon|gsc:dragons-den-area":{"base":{"129":36.8,"148":1.8}},"Route 26|gsc:kanto-route-26-area":{"base":{"27":12,"28":4,"72":15,"74":8,"77":10,"84":15,"85":3},"night":{"19":15,"20":6,"77":0,"84":0,"85":0,"163":8},"rain":{"72":25,"77":3,"90":6,"170":6},"storm":{"170":8,"171":3},"snow":{"215":5,"220":8}},"Route 27|gsc:kanto-route-27-area":{"base":{"23":15,"24":5,"72":15,"74":6,"77":5,"84":15,"90":4},"night":{"77":0,"84":0,"163":8,"194":8,"195":6},"rain":{"72":25,"90":8,"170":6},"storm":{"170":8,"171":3},"snow":{"215":5,"220":8}},"Route Victoire|gsc:kanto-victory-road-1-1f+gsc:kanto-victory-road-1-2f+gsc:kanto-victory-road-1-3f":{"base":{"42":18,"74":8,"75":22,"95":6,"111":5,"217":10,"232":10}},"Route 1|kanto-route-1-area":{"base":{"16":55,"19":45},"night":{"16":0,"19":70},"rain":{"7":6}},"Route 2|kanto-route-2-south-towards-viridian-city":{"base":{"10":15,"13":15,"16":35,"19":30,"50":5},"night":{"10":0,"13":0,"16":0,"19":45,"43":8},"storm":{"25":4}},"Forêt de Jade|viridian-forest-area":{"base":{"1":5,"10":25,"11":15,"13":25,"14":15,"25":5},"night":{"1":0,"10":0,"11":0,"13":0,"14":0,"43":8,"48":8},"storm":{"25":14}},"Route 3|kanto-route-3-area":{"base":{"16":25,"21":35,"27":10,"39":15,"74":10},"night":{"4":4,"16":0,"21":0,"35":8,"39":30}},"Mont Sélénite|mt-moon-1f+mt-moon-b1f+mt-moon-b2f":{"base":{"35":7.1,"41":42.9,"46":17.9,"74":32.1}},"Route 4|kanto-route-4-area":{"base":{"19":25,"21":35,"23":20,"27":20},"night":{"19":40,"21":0,"43":8},"rain":{"60":6}},"Pont Pépite|kanto-route-24-area+kanto-route-25-area":{"base":{"10":10,"11":6,"13":10,"14":6,"16":12,"54":4,"63":8,"69":12,"118":6,"129":8},"night":{"10":0,"11":0,"13":0,"14":0,"16":0,"43":22,"48":6,"63":12,"69":0},"rain":{"7":5,"54":10,"60":14},"storm":{"54":8,"60":12}},"Route 5|kanto-route-5-area":{"base":{"16":30,"56":15,"63":5,"69":25},"night":{"16":0,"43":30,"52":25,"63":8,"69":0},"rain":{"60":6}},"Route 6|kanto-route-6-area":{"base":{"16":30,"56":12,"69":25,"129":10},"night":{"16":0,"43":25,"52":20,"69":0},"rain":{"54":8,"60":12,"90":4,"98":5},"storm":{"54":6,"60":10}},"Océane|kanto-route-6-area":{"base":{"54":10,"72":30,"90":10,"98":15,"118":10,"129":25}},"Route 11|kanto-route-11-area":{"base":{"21":25,"23":20,"27":20,"118":6,"129":10},"night":{"21":0,"96":25,"104":5},"rain":{"60":12,"90":5,"98":8},"storm":{"60":10,"98":6}},"Grotte Taupiqueur|digletts-cave-area":{"base":{"50":83.3,"51":16.7}},"Route 9|kanto-route-9-area":{"base":{"19":25,"21":30,"23":15,"27":15,"74":10},"night":{"4":4,"19":40,"21":0,"35":6},"storm":{"25":4,"100":10},"rain":{"100":4}},"Route 10|kanto-route-10-area":{"base":{"21":25,"23":12,"27":12,"74":8,"100":20,"118":6,"129":10},"night":{"21":0,"35":6,"92":6},"storm":{"81":8,"100":35},"rain":{"60":12,"61":4,"79":6},"snow":{"23":4,"27":4}},"Grotte|rock-tunnel-b1f+rock-tunnel-b2f":{"base":{"41":40.4,"66":20.2,"74":30.3,"95":9.1}},"Route 8|kanto-route-8-area":{"base":{"16":20,"23":12,"27":12,"56":16,"58":10,"69":16},"night":{"16":0,"37":5,"43":22,"52":28,"58":0,"69":0,"88":5,"92":6},"rain":{"58":1,"88":5}},"Route 7|kanto-route-7-area":{"base":{"16":22,"23":8,"27":8,"56":16,"58":10,"69":16},"night":{"16":0,"37":4,"43":22,"52":28,"58":0,"69":0,"88":5,"92":3},"rain":{"58":1,"88":5}},"Tour Pokémon|pokemon-tower-3f+pokemon-tower-4f+pokemon-tower-5f+pokemon-tower-6f+pokemon-tower-7f":{"base":{"92":66.2,"93":17.2,"104":16.6,"105":3},"lv":{"105":3}},"Route 12-13|kanto-route-12-area+kanto-route-13-area":{"base":{"16":20,"69":18,"70":4,"72":6,"98":4,"118":6,"129":10,"132":4},"night":{"16":0,"43":25,"44":6,"48":20,"69":0,"70":0,"92":6},"rain":{"54":8,"60":12,"72":10,"98":8},"storm":{"60":10,"72":12}},"Route 14-15|kanto-route-14-area+kanto-route-15-area":{"base":{"16":22,"17":6,"69":22,"70":6,"128":3,"132":15},"night":{"16":0,"17":0,"43":30,"44":8,"48":20,"49":4,"69":0,"70":0,"92":3,"128":0},"rain":{"60":6}},"Parc Safari|kanto-safari-zone-middle+kanto-safari-zone-area-1-east+kanto-safari-zone-area-2-north+kanto-safari-zone-area-3-west":{"base":{"29":12,"30":6,"32":12,"33":6,"46":5,"47":2,"84":8,"102":8,"111":8,"113":1,"115":1,"118":5,"123":4,"127":4,"128":2,"129":8,"147":1},"night":{"48":10,"49":4,"84":0,"92":5,"123":1,"127":1,"128":0},"rain":{"54":6,"60":10,"79":6,"98":4,"147":3},"storm":{"60":8,"147":4}},"Piste Cyclable|kanto-route-16-area+kanto-route-17-area+kanto-route-18-area":{"base":{"19":8,"20":10,"21":25,"22":6,"72":6,"84":15,"98":3,"118":6,"129":12},"night":{"19":15,"20":25,"21":0,"22":0,"84":0},"rain":{"60":10,"72":12,"90":5,"98":8},"storm":{"72":12}},"Repaire Rocket|kanto-route-7-area+kanto-route-8-area":{"base":{"19":25,"20":8,"23":20,"52":15,"88":12,"109":20}},"Routes 7-8|kanto-route-7-area+kanto-route-8-area":{"base":{"16":22,"23":8,"27":8,"56":16,"58":10,"69":16,"128":3},"night":{"16":0,"37":4,"43":22,"52":28,"58":0,"69":0,"88":5,"92":4,"128":0},"rain":{"58":1,"88":5}},"Sylphe SARL|saffron-city-silph-co-7f":{"base":{"16":13.4,"19":1.5,"20":3.4,"21":10.1,"22":2.3,"23":5,"27":5,"37":5,"43":2,"52":5.9,"56":11.7,"58":5,"69":6.7,"72":1.3,"84":5,"88":1.4,"89":4.2,"98":0.9,"118":2.5,"129":5}},"Routes 19-20|kanto-sea-route-19-area+kanto-sea-route-20-area":{"base":{"72":25,"118":12,"129":25},"night":{"120":15},"rain":{"9":0.3,"90":12,"116":12,"117":1},"storm":{"72":35,"73":3}},"Centrale|kanto-power-plant-area":{"base":{"25":10.1,"26":2.7,"81":13.4,"82":3.4,"100":67.2,"125":2.7}},"Îles Écume|seafoam-islands-1f+seafoam-islands-b1f+seafoam-islands-b2f+seafoam-islands-b3f+seafoam-islands-b4f":{"base":{"41":8,"42":2,"54":16,"55":1.5,"79":16,"80":1.5,"86":18,"87":3,"98":14,"99":1.5,"131":2}},"Manoir Pokémon|pokemon-mansion-1f+pokemon-mansion-2f+pokemon-mansion-3f+pokemon-mansion-b1f":{"base":{"4":0.2,"6":0.2,"37":16,"58":16,"77":11.1,"88":19.7,"89":6.9,"109":19.7,"110":6.9,"126":3.4}},"Route 21|kanto-sea-route-21-area":{"base":{"16":18,"17":8,"19":10,"20":6,"72":15,"90":5,"114":6,"116":5,"118":8,"129":15},"night":{"16":0,"17":0,"19":25,"20":15,"120":10},"rain":{"72":20,"90":8},"storm":{"72":22}},"Route 22|kanto-route-22-area":{"base":{"19":30,"21":15,"29":20,"32":20,"128":3,"129":8},"night":{"19":45,"21":0,"43":6,"128":0},"rain":{"54":6,"60":14}},"Route 23|kanto-route-23-area":{"base":{"21":12,"22":10,"23":10,"24":6,"27":10,"28":6,"74":8,"118":6,"129":10,"132":10},"night":{"21":0,"22":0,"35":6},"rain":{"60":12,"79":6,"80":3,"98":4,"99":3,"116":4,"117":2,"119":4},"storm":{"60":10,"79":4},"snow":{"74":4}},"Route Victoire|kanto-victory-road-2-1f+kanto-victory-road-2-2f+kanto-victory-road-2-3f":{"base":{"41":18.1,"42":6,"48":2,"49":2,"66":24.1,"67":5.2,"74":24.1,"75":4.4,"95":12,"104":0.2,"105":1.8}},"Salle 1|seafoam-islands-1f+seafoam-islands-b1f+seafoam-islands-b2f+seafoam-islands-b3f+seafoam-islands-b4f":{"base":{"41":1.5,"42":1.5,"54":11.9,"55":0.9,"60":2.2,"79":11.9,"80":0.9,"86":11.9,"87":0.7,"90":12.2,"98":10.4,"99":0.7,"116":11.5,"117":0.7,"118":2.2,"120":14.2,"129":4.5}},"Salle 2|seafoam-islands-1f+seafoam-islands-b1f+seafoam-islands-b2f+seafoam-islands-b3f+seafoam-islands-b4f":{"base":{"41":1.5,"42":1.5,"54":11.9,"55":0.9,"60":2.2,"79":11.9,"80":0.9,"86":11.9,"87":0.7,"90":12.2,"98":10.4,"99":0.7,"116":11.5,"117":0.7,"118":2.2,"120":14.2,"129":4.5}},"Salle 3|seafoam-islands-1f+seafoam-islands-b1f+seafoam-islands-b2f+seafoam-islands-b3f+seafoam-islands-b4f":{"base":{"41":1.5,"42":1.5,"54":11.9,"55":0.9,"60":2.2,"79":11.9,"80":0.9,"86":11.9,"87":0.7,"90":12.2,"98":10.4,"99":0.7,"116":11.5,"117":0.7,"118":2.2,"120":14.2,"129":4.5}},"Salle 1|digletts-cave-area+kanto-victory-road-2-1f+kanto-victory-road-2-2f+kanto-victory-road-2-3f":{"base":{"41":16.5,"42":5.5,"48":1.8,"49":1.8,"50":7.3,"51":1.5,"66":22,"67":4.8,"74":22,"75":4,"95":11,"104":0.2,"105":1.6}},"Salle 2|digletts-cave-area+kanto-victory-road-2-1f+kanto-victory-road-2-2f+kanto-victory-road-2-3f":{"base":{"41":16.5,"42":5.5,"48":1.8,"49":1.8,"50":7.3,"51":1.5,"66":22,"67":4.8,"74":22,"75":4,"95":11,"104":0.2,"105":1.6}},"Salle 3|digletts-cave-area+kanto-victory-road-2-1f+kanto-victory-road-2-2f+kanto-victory-road-2-3f":{"base":{"41":16.5,"42":5.5,"48":1.8,"49":1.8,"50":7.3,"51":1.5,"66":22,"67":4.8,"74":22,"75":4,"95":11,"104":0.2,"105":1.6}},"Salle 1|pokemon-tower-3f+pokemon-tower-4f+pokemon-tower-5f+pokemon-tower-6f+pokemon-tower-7f+pokemon-mansion-1f+pokemon-mansion-b1f":{"base":{"37":7.4,"58":7.4,"77":7.4,"88":11.8,"89":4.1,"92":29.6,"93":7.7,"104":7.4,"109":11.8,"110":4.1,"126":1.2}},"Salle 2|pokemon-tower-3f+pokemon-tower-4f+pokemon-tower-5f+pokemon-tower-6f+pokemon-tower-7f+pokemon-mansion-1f+pokemon-mansion-b1f":{"base":{"37":7.4,"58":7.4,"77":7.4,"88":11.8,"89":4.1,"92":29.6,"93":7.7,"104":7.4,"109":11.8,"110":4.1,"126":1.2}},"Salle 3|pokemon-tower-3f+pokemon-tower-4f+pokemon-tower-5f+pokemon-tower-6f+pokemon-tower-7f+pokemon-mansion-1f+pokemon-mansion-b1f":{"base":{"37":7.4,"58":7.4,"77":7.4,"88":11.8,"89":4.1,"92":29.6,"93":7.7,"104":7.4,"109":11.8,"110":4.1,"126":1.2}},"Salle 1|kanto-safari-zone-middle+kanto-safari-zone-area-1-east+kanto-safari-zone-area-2-north+kanto-safari-zone-area-3-west+kanto-sea-route-19-area+kanto-sea-route-20-area":{"base":{"7":0.2,"9":0.2,"29":11.3,"30":5.6,"32":11.3,"33":5.6,"46":4.2,"47":1.4,"48":1.3,"49":0.4,"54":1.4,"60":6.4,"72":2.8,"79":2.1,"84":5.6,"90":0.7,"98":1.4,"102":5.6,"111":5.6,"113":0.7,"115":0.7,"116":0.7,"118":6.4,"120":1.1,"123":0.7,"127":0.7,"128":0.7,"129":12.7,"147":2.1}},"Salle 2|kanto-safari-zone-middle+kanto-safari-zone-area-1-east+kanto-safari-zone-area-2-north+kanto-safari-zone-area-3-west+kanto-sea-route-19-area+kanto-sea-route-20-area":{"base":{"7":0.2,"9":0.2,"29":11.3,"30":5.6,"32":11.3,"33":5.6,"46":4.2,"47":1.4,"48":1.3,"49":0.4,"54":1.4,"60":6.4,"72":2.8,"79":2.1,"84":5.6,"90":0.7,"98":1.4,"102":5.6,"111":5.6,"113":0.7,"115":0.7,"116":0.7,"118":6.4,"120":1.1,"123":0.7,"127":0.7,"128":0.7,"129":12.7,"147":2.1}},"Salle 3|kanto-safari-zone-middle+kanto-safari-zone-area-1-east+kanto-safari-zone-area-2-north+kanto-safari-zone-area-3-west+kanto-sea-route-19-area+kanto-sea-route-20-area":{"base":{"7":0.2,"9":0.2,"29":11.3,"30":5.6,"32":11.3,"33":5.6,"46":4.2,"47":1.4,"48":1.3,"49":0.4,"54":1.4,"60":6.4,"72":2.8,"79":2.1,"84":5.6,"90":0.7,"98":1.4,"102":5.6,"111":5.6,"113":0.7,"115":0.7,"116":0.7,"118":6.4,"120":1.1,"123":0.7,"127":0.7,"128":0.7,"129":12.7,"147":2.1}},"Salle 1|kanto-route-22-area+kanto-route-23-area+kanto-victory-road-2-3f":{"base":{"19":3.8,"21":6.4,"22":3.2,"23":6.4,"24":1.6,"27":6.4,"28":1.6,"29":6.4,"32":6.4,"41":4.8,"42":1.6,"48":1.6,"49":1.6,"60":4.8,"66":6.4,"67":1.3,"74":6.4,"75":1.6,"79":0.6,"80":0.6,"95":3.2,"98":0.4,"99":0.4,"116":0.6,"117":0.6,"118":4.8,"119":0.8,"129":9.6,"132":6.4}},"Salle 2|kanto-route-22-area+kanto-route-23-area+kanto-victory-road-2-3f":{"base":{"19":3.8,"21":6.4,"22":3.2,"23":6.4,"24":1.6,"27":6.4,"28":1.6,"29":6.4,"32":6.4,"41":4.8,"42":1.6,"48":1.6,"49":1.6,"60":4.8,"66":6.4,"67":1.3,"74":6.4,"75":1.6,"79":0.6,"80":0.6,"95":3.2,"98":0.4,"99":0.4,"116":0.6,"117":0.6,"118":4.8,"119":0.8,"129":9.6,"132":6.4}},"Salle 3|kanto-route-22-area+kanto-route-23-area+kanto-victory-road-2-3f":{"base":{"19":3.8,"21":6.4,"22":3.2,"23":6.4,"24":1.6,"27":6.4,"28":1.6,"29":6.4,"32":6.4,"41":4.8,"42":1.6,"48":1.6,"49":1.6,"60":4.8,"66":6.4,"67":1.3,"74":6.4,"75":1.6,"79":0.6,"80":0.6,"95":3.2,"98":0.4,"99":0.4,"116":0.6,"117":0.6,"118":4.8,"119":0.8,"129":9.6,"132":6.4}},"k2:Route 22":{"base":{"19":25,"21":18,"29":15,"32":15,"77":4,"84":5,"129":8,"154":0.5,"182":3},"night":{"19":40,"21":0,"43":8,"84":0,"154":0,"182":0},"rain":{"54":6,"60":14}},"k2:Route 28":{"base":{"77":22,"78":5,"84":6,"114":20,"216":15,"231":10},"night":{"77":12,"84":0,"215":10,"216":0,"217":15},"rain":{"60":12,"61":3},"snow":{"77":0,"78":0,"215":15}},"k2:Mont Argenté":{"base":{"42":6,"55":8,"75":10,"95":15,"195":10,"215":6,"246":1.5}},"k2:Sommet":{"base":{"55":10,"75":10,"95":8,"195":8,"215":20,"246":1},"night":{"200":12},"snow":{"55":0,"215":35}},"Route 101|rse:hoenn-route-101-area":{"base":{"252":5,"261":25,"263":35,"265":30},"night":{"252":0,"261":45,"265":0}},"Routes 102-103|rse:hoenn-route-102-area+rse:hoenn-route-103-area":{"base":{"129":4,"183":6,"261":18,"263":25,"265":15,"270":10,"273":10,"278":10,"280":1.5},"night":{"255":4,"261":30,"265":0,"273":0,"278":0},"rain":{"183":10,"270":16,"283":6},"storm":{"183":9,"283":5},"sun":{"273":16}},"Route 104|rse:hoenn-route-104-area":{"base":{"129":6,"183":8,"261":10,"263":15,"265":10,"276":8,"278":30,"279":2},"night":{"261":25,"265":0,"276":0,"278":0,"279":0},"rain":{"183":14,"258":5,"279":6},"storm":{"183":12,"258":4}},"Bois Clémenti|rse:petalburg-woods-area":{"base":{"261":20,"263":20,"265":25,"276":8,"285":15,"287":6},"night":{"261":30,"265":0,"276":0,"285":22},"rain":{"285":25}},"Route 116|rse:hoenn-route-116-area":{"base":{"39":5,"63":6,"261":20,"263":25,"276":12,"290":10,"293":15,"300":5},"night":{"63":10,"261":30,"276":0,"300":0}},"Tunnel Mérazon|rse:rusturf-tunnel-area":{"base":{"74":20,"293":80}},"Routes 105-106|rse:hoenn-route-105-area+rse:hoenn-route-106-area":{"base":{"72":35,"129":12,"278":25,"279":4,"320":12},"night":{"72":45,"278":0,"279":0},"rain":{"279":8,"320":20},"storm":{"320":18}},"Grotte Granite|rse:granite-cave-1f+rse:granite-cave-1fsmall-room+rse:granite-cave-b1f+rse:granite-cave-b2f":{"base":{"41":30,"63":14,"74":8,"296":18,"299":4,"302":4,"303":4,"304":18}},"Routes 107-108|rse:hoenn-route-107-area+rse:hoenn-route-108-area":{"base":{"72":35,"129":12,"278":25,"279":4,"320":12},"night":{"72":45,"278":0,"279":0},"rain":{"279":8,"320":20},"storm":{"320":18}},"Épave|rse:abandoned-ship-area":{"base":{"72":70,"129":30}},"Route 109|rse:hoenn-route-109-area":{"base":{"72":20,"129":10,"278":30,"279":5,"320":10,"341":15},"night":{"278":0,"279":0,"341":25},"rain":{"279":9,"320":18},"storm":{"320":15},"sun":{"341":22}},"Route 110|rse:hoenn-route-110-area":{"base":{"72":8,"129":5,"261":12,"263":15,"278":12,"309":15,"311":6,"312":6,"316":10},"night":{"43":15,"261":20,"278":0},"rain":{"72":14},"storm":{"309":25,"311":15,"312":15}},"Route 117|rse:hoenn-route-117-area":{"base":{"118":8,"129":5,"183":15,"261":12,"263":15,"315":12,"341":6},"night":{"43":15,"313":10,"314":10,"315":0},"rain":{"183":24,"283":6},"storm":{"283":5},"sun":{"315":20}},"Route 112|rse:hoenn-route-112-area":{"base":{"66":20,"74":10,"183":15,"322":40},"rain":{"183":25},"sun":{"322":55}},"Chemin Ardent|rse:fiery-path-area":{"base":{"37":10,"66":10,"88":15,"109":15,"255":3,"322":25,"324":20}},"Route 113|rse:hoenn-route-113-area":{"base":{"27":20,"74":10,"227":8,"327":35},"night":{"37":8},"sun":{"27":26,"37":6},"ash":{"324":6,"327":45}},"Sentier Sinuroc|rse:jagged-pass-area":{"base":{"66":20,"74":10,"322":35,"325":20},"sun":{"322":50}},"Route 114|rse:hoenn-route-114-area":{"base":{"74":8,"129":5,"183":10,"270":12,"273":12,"333":15,"335":8,"336":8,"339":6},"night":{"333":0,"335":0},"day":{"336":0},"rain":{"270":18,"283":5,"339":9},"storm":{"283":4},"sun":{"273":18}},"Chutes Météore|rse:meteor-falls-area+rse:meteor-falls-b1f":{"base":{"41":30,"118":6,"129":8,"337":8,"338":8,"339":6,"371":1.5},"night":{"338":0},"day":{"337":0},"rain":{"339":10}},"Désert de la Route 111|rse:hoenn-route-111-area":{"base":{"27":20,"74":10,"328":18,"331":12,"343":15},"night":{"331":0,"343":22},"sand":{"74":16,"328":28,"343":22},"sun":{"331":20}},"Route 118|rse:hoenn-route-118-area":{"base":{"72":10,"129":8,"263":15,"278":20,"309":15,"318":8},"night":{"261":15,"278":0},"rain":{"318":14},"storm":{"309":25}},"Route 119|rse:hoenn-route-119-area":{"base":{"72":8,"129":6,"252":3,"263":20,"278":8,"318":6,"352":3,"357":4},"night":{"43":15,"252":0,"278":0,"357":0},"rain":{"72":12,"283":6},"storm":{"283":5},"sun":{"357":8}},"Route 120|rse:hoenn-route-120-area":{"base":{"118":6,"129":5,"183":15,"254":0.5,"261":15,"263":15,"339":5,"352":3},"night":{"43":12,"254":0,"261":22},"rain":{"183":22,"258":3},"storm":{"258":3,"359":6}},"Route 121|rse:hoenn-route-121-area":{"base":{"72":8,"129":5,"203":6,"261":15,"263":15,"278":12,"320":4},"night":{"43":12,"44":6,"203":0,"278":0,"353":10,"355":10},"rain":{"320":8}},"Parc Safari|rse:hoenn-safari-zone-se+rse:hoenn-safari-zone-sw+rse:hoenn-safari-zone-neacro-bike-area+rse:hoenn-safari-zone-nwmach-bike-area":{"base":{"25":4,"54":12,"74":5,"84":18,"111":10,"127":3,"177":15,"202":3,"203":12,"214":3},"night":{"43":15,"44":8,"84":0,"127":0,"214":0},"rain":{"54":20},"storm":{"25":10},"sun":{"214":6}},"Mont Mémoria|rse:mt-pyre-1f+rse:mt-pyre-2f+rse:mt-pyre-3f+rse:mt-pyre-4f+rse:mt-pyre-5f+rse:mt-pyre-6f":{"base":{"37":15,"307":15,"353":35,"355":35}},"Sommet du Mont Mémoria|rse:mt-pyre-outside+rse:mt-pyre-summit":{"base":{"37":15,"74":10,"278":15,"307":30,"358":1},"night":{"278":0,"353":20,"355":20},"snow":{"361":6},"fog":{"278":0,"353":15,"355":15,"358":3}},"Planque Aqua|rse:team-aqua-hideout-area":{"base":{"81":40,"100":60}},"Route 124|rse:hoenn-route-124-area":{"base":{"72":35,"129":12,"278":25,"279":4,"318":8,"320":12},"night":{"72":45,"170":8,"278":0,"279":0},"rain":{"279":8,"320":20},"storm":{"320":18}},"Route 125|rse:hoenn-route-125-area":{"base":{"72":30,"129":10,"278":25,"279":4,"318":6,"320":10,"341":10},"night":{"120":6,"170":8,"278":0,"279":0},"rain":{"279":8,"320":18},"storm":{"320":15}},"Grotte Tréfonds|rse:shoal-cave-high-tide+rse:shoal-cave-low-tide":{"base":{"41":40,"72":12,"129":6,"320":7,"363":35}},"Salle de glace|rse:shoal-cave-b1f+rse:shoal-cave-b2f+rse:shoal-cave-b3f":{"base":{"41":25,"361":35,"363":40}},"Planque Magma|rse:magma-hideout-area":{"base":{"74":50,"322":10,"324":40}},"Route 128|rse:hoenn-route-128-area":{"base":{"72":30,"116":5,"129":10,"278":20,"279":3,"320":10,"370":15},"night":{"170":8,"278":0,"279":0},"rain":{"320":18,"370":20},"storm":{"320":15}},"Fonds marins|rse:hoenn-route-124-underwater+rse:hoenn-route-126-underwater":{"base":{"170":30,"366":60,"369":4}},"Caverne Fondmer|rse:seafloor-cavern-area":{"base":{"41":40,"72":35,"129":13,"320":8}},"Route 126|rse:hoenn-route-126-area":{"base":{"72":35,"129":12,"278":25,"279":4,"318":8,"320":12},"night":{"72":45,"170":8,"278":0,"279":0},"rain":{"279":8,"320":20},"storm":{"320":18}},"Grotte Origine|rse:cave-of-origin-entrance+rse:cave-of-origin-1f+rse:cave-of-origin-b1f+rse:cave-of-origin-b2f+rse:cave-of-origin-b3f+rse:cave-of-origin-b4f":{"base":{"41":50,"302":20,"303":20}},"Route 127|rse:hoenn-route-127-area":{"base":{"72":35,"129":12,"278":25,"279":4,"318":8,"320":12},"night":{"72":45,"170":8,"278":0,"279":0},"rain":{"258":2,"260":0.5,"279":8,"320":20},"storm":{"320":18}},"Éternara|rse:ever-grande-city-area":{"base":{"72":30,"116":5,"129":10,"278":20,"279":3,"320":10,"370":15},"night":{"170":6,"278":0,"279":0},"rain":{"320":18},"storm":{"320":15}},"Route Victoire|rse:hoenn-victory-road-1f+rse:hoenn-victory-road-b1f+rse:hoenn-victory-road-b2f":{"base":{"41":25,"74":8,"118":3,"257":0.5,"293":8,"296":12,"302":8,"303":8,"304":10,"307":8,"339":5}},"Route 123|rse:hoenn-route-123-area":{"base":{"72":5,"129":5,"203":8,"261":15,"263":20,"278":10,"352":3},"night":{"43":12,"44":6,"203":0,"278":0,"353":10,"355":10},"sun":{"315":10}},"Route 122|rse:hoenn-route-122-area":{"base":{"72":35,"129":12,"278":25,"279":4,"318":8,"320":12},"night":{"72":45,"278":0,"279":0},"rain":{"279":8,"320":20},"storm":{"320":18}},"Routes 129-131|rse:hoenn-route-129-area+rse:hoenn-route-130-area+rse:hoenn-route-131-area":{"base":{"72":30,"129":10,"278":20,"279":4,"318":8,"320":15},"night":{"170":8,"278":0,"279":0},"rain":{"279":8,"320":24},"storm":{"320":20}},"Routes 132-134|rse:hoenn-route-132-area+rse:hoenn-route-133-area+rse:hoenn-route-134-area":{"base":{"72":30,"116":10,"129":8,"278":20,"279":4,"318":6,"320":10},"night":{"170":8,"278":0,"279":0},"rain":{"116":15,"320":16},"storm":{"320":14}},"Tour Mirage|rse:mirage-tower-area":{"base":{"27":50,"328":50},"sand":{"328":60}},"New Lavandia|rse:new-mauville-entrance+rse:new-mauville-area":{"base":{"81":45,"100":55}},"Route 201|dppt:sinnoh-route-201-area":{"base":{"387":5,"396":40,"399":40},"night":{"387":0,"390":5,"396":0,"401":30}},"Lac Vérité|dppt:lake-verity-before-galactic-intervention":{"base":{"54":25,"118":8,"129":12,"396":25,"399":25},"night":{"396":0,"401":15},"rain":{"54":35,"393":6},"storm":{"54":30,"393":5}},"Route 202|dppt:sinnoh-route-202-area":{"base":{"387":4,"396":20,"399":35,"403":30},"night":{"387":0,"396":0,"401":25},"rain":{"393":5},"storm":{"393":4,"403":45}},"Route 203|dppt:sinnoh-route-203-area":{"base":{"54":10,"63":8,"118":5,"129":5,"396":25,"399":15,"403":20},"night":{"41":12,"390":4,"396":0,"401":12},"rain":{"54":18,"393":4},"storm":{"54":15,"403":30}},"Entrée de Charbourg|dppt:oreburgh-gate-1f":{"base":{"41":35,"54":30,"74":35}},"Mine de Charbourg|dppt:oreburgh-mine-1f+dppt:oreburgh-mine-b1f":{"base":{"41":30,"74":55,"95":12}},"Route 204|dppt:sinnoh-route-204-south-towards-jubilife-city+dppt:sinnoh-route-204-north-towards-floaroma-town":{"base":{"54":8,"118":4,"129":5,"265":12,"315":12,"387":3,"396":22,"399":20,"403":10},"night":{"41":15,"265":0,"387":0,"390":3,"396":0,"401":15},"rain":{"54":16},"storm":{"403":20}},"Pré de Floraville|dppt:floaroma-meadow-area":{"base":{"265":18,"267":2,"315":22,"396":15,"399":10,"417":12,"427":12},"night":{"265":0,"267":0,"268":10,"269":3,"396":0,"401":15},"storm":{"403":8,"417":22}},"Route 205 (sud)|dppt:sinnoh-route-205-south-towards-floaroma-town":{"base":{"72":8,"278":12,"399":15,"417":8,"418":20,"422":28},"night":{"278":0,"401":12},"rain":{"129":8,"279":5,"422":38,"423":4,"456":10},"storm":{"417":16}},"Les Éoliennes|dppt:valley-windworks-area":{"base":{"72":6,"278":6,"399":12,"403":18,"417":18,"418":15,"422":25},"night":{"278":0,"425":6},"rain":{"129":6,"418":22,"422":35,"423":4,"456":8},"storm":{"403":30,"417":30,"425":10}},"Forêt Vestigion|dppt:eterna-forest-area":{"base":{"265":28,"266":8,"267":1.5,"268":12,"315":14,"399":10,"427":15},"night":{"92":6,"163":10,"198":8,"200":8,"265":0,"267":0,"269":3,"401":10},"rain":{"315":18}},"Vieux Château|dppt:old-chateau-entrance+dppt:old-chateau-dining-room+dppt:old-chateau-2f":{"base":{"92":80,"93":8},"night":{"92":60,"93":10,"200":20,"355":15}},"Route 205 (est)|dppt:sinnoh-route-205-east-towards-eterna-city":{"base":{"54":15,"129":4,"265":10,"268":6,"315":12,"339":5,"399":15,"417":5,"418":15,"422":10},"night":{"163":10,"265":0,"401":10},"rain":{"54":22,"339":9,"418":20,"422":16},"storm":{"417":12}},"Route 206|dppt:sinnoh-route-206-area":{"base":{"66":12,"74":25,"77":18,"207":12,"402":10,"436":6},"night":{"41":15,"77":10,"434":22},"rain":{"77":6},"storm":{"77":5},"sun":{"77":28},"snow":{"77":6}},"Grotte Revêche|dppt:wayward-cave-1f+dppt:wayward-cave-b1f":{"base":{"41":28,"74":28,"95":12,"436":25,"443":1.5}},"Route 207|dppt:sinnoh-route-207-area":{"base":{"66":35,"74":40,"77":18},"night":{"41":20,"401":15},"rain":{"77":7},"storm":{"77":6},"sun":{"77":28},"snow":{"77":7}},"Mont Couronné|dppt:mt-coronet-1f-route-207+dppt:mt-coronet-b1f":{"base":{"35":8,"41":25,"66":10,"74":10,"75":6,"129":4,"299":4,"307":12,"339":4,"358":2,"436":12}},"Route 208|dppt:sinnoh-route-208-area":{"base":{"54":20,"66":8,"129":4,"280":8,"307":8,"315":15,"339":4,"399":12,"400":10},"night":{"41":12},"rain":{"54":30,"118":6,"339":8,"400":16},"sun":{"315":20}},"Square Paisible|species":{"base":{"25":15,"35":15,"54":20,"417":20,"427":25},"night":{"35":25,"425":8}},"Route 209|dppt:sinnoh-route-209-area":{"base":{"54":12,"113":1.5,"118":4,"129":4,"185":4,"280":8,"315":15,"396":15,"397":6,"400":12},"night":{"41":12,"92":12,"280":4,"355":12,"396":0,"397":0},"rain":{"54":20,"118":8,"400":18},"sun":{"315":20}},"Tour Perdue|dppt:lost-tower-1f+dppt:lost-tower-2f+dppt:lost-tower-3f+dppt:lost-tower-4f+dppt:lost-tower-5f":{"base":{"41":25,"42":4,"92":30,"198":10,"200":12,"355":18}},"Ruines de Bonville|dppt:solaceon-ruins-1f+dppt:solaceon-ruins-2f+dppt:solaceon-ruins-b1f-a+dppt:solaceon-ruins-b2f-a+dppt:solaceon-ruins-b3f-a+dppt:solaceon-ruins-b4f-a+dppt:solaceon-ruins-b5f":{"base":{"41":15,"63":6,"201":4,"436":30,"20101":3,"20102":3,"20103":2.5,"20104":2,"20105":2,"20106":1.5,"20107":1.5,"20108":1,"20109":1,"20110":2,"20111":1.5,"20112":1.5,"20113":1,"20114":1},"night":{"41":25,"20110":0,"20111":0,"20112":0,"20113":0,"20114":0,"20115":3,"20116":2,"20117":2,"20118":1.5,"20119":1},"day":{"20126":0,"20127":0},"rain":{"20120":3,"20121":2,"20122":1.5,"20123":1},"storm":{"20124":2,"20125":1.5,"20126":0.5,"20127":0.5}},"Route 210 (sud)|dppt:sinnoh-route-210-south-towards-solaceon-town":{"base":{"74":18,"77":18,"113":1.5,"122":3,"123":5,"315":12,"397":15,"402":10},"night":{"163":15,"164":6,"397":0},"rain":{"77":6},"storm":{"77":5},"sun":{"77":28,"315":16}},"Route 215|dppt:sinnoh-route-215-area":{"base":{"63":8,"74":18,"77":15,"108":8,"123":6,"183":15,"397":15,"402":8},"night":{"41":12,"397":0},"rain":{"54":10,"77":4,"183":28,"194":8,"397":8},"fog":{"63":12,"64":5,"397":6}},"Route 214|dppt:sinnoh-route-214-area":{"base":{"54":10,"74":15,"75":10,"77":12,"111":8,"118":4,"129":4,"185":8,"203":12,"402":6},"night":{"41":10,"203":6,"228":15,"434":15},"rain":{"54":18,"77":4},"sun":{"77":20,"111":12}},"Tunnel du Ruinemaniac|dppt:ruin-maniac-cave-0-9-different-unown-caught":{"base":{"41":20,"74":60,"449":15}},"Rive du Lac Courage|dppt:valor-lakefront-area":{"base":{"74":15,"75":6,"203":20,"228":8,"397":12,"400":18,"402":8},"night":{"228":16,"397":0,"402":12},"rain":{"54":10,"400":26},"storm":{"400":22},"sun":{"228":12}},"Route 213|dppt:sinnoh-route-213-area":{"base":{"72":12,"223":4,"278":20,"279":4,"418":15,"419":5,"441":8,"42201":15},"night":{"72":18,"278":0,"279":0,"441":0},"rain":{"129":6,"223":10,"279":8,"42301":4},"storm":{"72":16},"sun":{"441":12}},"Grand Marais|dppt:great-marsh-area-1+dppt:great-marsh-area-2+dppt:great-marsh-area-3+dppt:great-marsh-area-4+dppt:great-marsh-area-5+dppt:great-marsh-area-6":{"base":{"54":7,"79":3,"114":4,"183":12,"193":5,"194":20,"195":5,"400":8,"453":10,"454":2,"455":6,"42301":2.5},"night":{"163":10,"164":5,"193":0,"451":12,"452":3},"rain":{"129":6,"183":16,"194":30,"339":6,"453":14,"42301":4},"fog":{"54":10,"79":6}},"Route 212 (sud)|dppt:sinnoh-route-212-east-towards-pastoria-city":{"base":{"72":4,"194":22,"195":8,"223":3,"315":8,"339":3,"400":10,"402":6,"418":8,"453":5,"42201":20},"night":{"163":8,"402":12},"rain":{"129":5,"194":30,"453":10,"42201":28,"42301":4},"fog":{"54":6}},"Jardin Trophée|dppt:trophy-garden-area":{"base":{"315":28,"396":10,"397":18,"402":14,"417":10,"427":12},"night":{"163":10,"396":0,"397":0,"402":22},"storm":{"417":18}},"Route 212 (nord)|dppt:sinnoh-route-212-north-towards-hearthome-city":{"base":{"54":12,"118":4,"129":4,"183":14,"280":8,"281":4,"315":18,"396":14,"397":8,"402":6},"night":{"280":0,"396":0,"397":0,"402":14},"rain":{"54":20,"118":8,"183":22,"194":8},"sun":{"315":22}},"Route 210 (nord)|dppt:sinnoh-route-210-west-towards-celestic-town":{"base":{"54":15,"66":10,"67":4,"123":6,"129":3,"307":12,"333":20,"339":3,"400":12},"night":{"92":8,"163":12,"164":6,"200":10,"355":10},"rain":{"54":22,"339":6,"400":16},"fog":{"54":20,"92":6,"200":8,"307":16,"333":12,"355":8}},"Route 211|dppt:sinnoh-route-211-east-towards-celestic-town+dppt:sinnoh-route-211-west-towards-eterna-city":{"base":{"66":10,"67":5,"74":10,"75":12,"77":10,"307":22,"358":2,"399":10,"436":6},"night":{"41":15,"77":0,"163":10,"164":6},"rain":{"77":6},"storm":{"77":5},"sun":{"77":20},"snow":{"77":4}},"Mont Couronné (Route 211)|dppt:mt-coronet-1f-route-211":{"base":{"41":11.8,"66":11.8,"74":23.5,"299":5.9,"307":23.5,"436":23.5}},"Route 218|dppt:sinnoh-route-218-area":{"base":{"72":8,"122":8,"129":4,"278":18,"419":12,"422":18,"423":10,"431":10,"441":6,"456":4},"night":{"72":16,"278":0,"431":0,"441":0},"rain":{"129":6,"279":6,"423":14,"456":10,"457":4},"storm":{"72":14}},"Rivage de l'Île de Fer|dppt:iron-island-area":{"base":{"72":30,"73":2.5,"90":5.7,"129":9,"130":6,"211":2.3,"278":30,"279":2.5,"456":6,"457":6},"night":{"90":0},"rain":{"72":48,"73":4,"90":9.1,"129":14.4,"130":9.6,"211":3.6,"278":48,"279":4,"456":9.6,"457":9.6},"storm":{"72":42,"73":3.5,"90":7.9,"129":12.6,"130":8.4,"211":3.2,"278":42,"279":3.5,"456":8.4,"457":8.4},"sun":{"72":21,"73":1.8,"90":4,"129":6.3,"130":4.2,"211":1.6,"278":21,"279":1.8,"456":4.2,"457":4.2}},"Île de Fer|dppt:iron-island-1f+dppt:iron-island-b1f-left+dppt:iron-island-b2f-left+dppt:iron-island-b3f":{"base":{"41":5,"42":15,"74":12,"75":30,"95":20,"208":10}},"Lac Courage asséché|dppt:lake-valor-area":{"base":{"54":22,"55":8,"118":6,"129":20,"358":3,"397":12,"400":15},"night":{"164":12,"397":0},"rain":{"54":30,"55":12,"400":20},"storm":{"54":26,"55":10}},"Lac Vérité|dppt:lake-verity-after-galactic-intervention":{"base":{"54":22,"118":8,"129":12,"396":25,"399":22},"night":{"164":8,"396":0,"401":14},"rain":{"54":32,"55":5,"118":12},"storm":{"54":28}},"Mont Couronné (Route 216)|dppt:mt-coronet-1f-route-216":{"base":{"35":10.5,"41":5.3,"42":5.3,"66":5.3,"67":5.3,"74":10.5,"75":10.5,"299":5.3,"307":21.1,"436":21.1}},"Route 216|dppt:sinnoh-route-216-area":{"base":{"67":10,"75":4,"215":28,"307":15,"459":28},"night":{"41":12,"164":10,"361":15},"snow":{"67":6,"215":35,"307":8,"459":40},"blizzard":{"215":30,"361":15,"459":40,"460":6}},"Route 217|dppt:sinnoh-route-217-area":{"base":{"67":6,"215":22,"220":22,"307":8,"308":10,"459":22},"night":{"41":10,"164":8,"307":0,"361":15},"snow":{"67":3,"215":28,"220":28,"307":4,"361":10,"459":30,"478":1.5},"blizzard":{"215":26,"220":22,"361":18,"459":30,"460":8,"478":2.5}},"Rive du Lac Savoir|dppt:acuity-lakefront-area":{"base":{"66":5.2,"67":5.2,"74":5.7,"215":21,"220":21,"307":10.5,"308":10.5,"459":21},"night":{"35":5.8,"41":10.5,"74":0,"163":5.2,"164":5.2,"200":3.5,"307":5.2,"308":5.2,"361":10.5},"snow":{"74":8.7,"215":41.9,"220":41.9,"459":29.4},"blizzard":{"74":10.1,"215":54.5,"220":54.5,"459":27.3}},"Lac Savoir|dppt:lake-acuity-area":{"base":{"54":22,"55":5,"118":5,"129":6,"215":15,"358":2,"400":10,"459":15},"night":{"164":10,"361":12},"snow":{"54":15,"215":20,"361":10,"459":22,"478":1.5},"blizzard":{"215":22,"361":18,"459":26,"460":6,"478":2.5}},"Mont Couronné|dppt:mt-coronet-2f+dppt:mt-coronet-3f+dppt:mt-coronet-4f+dppt:mt-coronet-5f+dppt:mt-coronet-6f":{"base":{"35":10,"41":5,"42":12,"67":10,"75":16,"299":6,"308":10,"358":4,"436":3,"437":18}},"Mont Couronné enneigé|dppt:mt-coronet-exterior-snowfall+dppt:mt-coronet-exterior-blizzard":{"base":{"67":12,"299":8,"308":12,"358":4,"437":3,"459":25,"460":12},"night":{"35":8,"42":12,"164":10,"359":2},"snow":{"459":35,"460":20},"blizzard":{"361":12,"459":35,"460":22},"fog":{"308":16,"359":4}},"Source Adieu|dppt:sendoff-spring-area":{"base":{"54":21,"55":21,"74":7,"75":7,"118":4.2,"119":4.2,"129":6.3,"130":4.2,"355":0.3,"356":0.3,"358":3.5,"396":3.5,"397":3.5,"399":7,"400":7},"night":{"41":3.5,"42":3.5,"163":3.5,"164":3.5,"211":6,"355":3.5,"356":3.5},"rain":{"54":33.6,"55":33.6,"118":6.7,"119":6.7,"129":10.1,"130":6.7,"400":11.2},"storm":{"54":29.4,"55":29.4,"118":5.9,"119":5.9,"129":8.8,"130":5.9,"400":9.8},"sun":{"54":14.7,"55":14.7,"118":2.9,"119":2.9,"129":4.4,"130":2.9,"400":4.9}},"Route 219|dppt:sinnoh-route-219-area":{"base":{"72":35.9,"73":3,"90":5.7,"129":10.8,"130":7.2,"278":18,"279":2.4,"366":2.7,"456":7.2,"457":7.2},"night":{"90":0,"170":4.7},"rain":{"72":57.5,"73":4.8,"90":9.1,"129":17.3,"130":11.5,"278":28.8,"279":3.8,"366":4.3,"456":11.5,"457":11.5},"storm":{"72":50.3,"73":4.2,"90":7.9,"129":15.1,"130":10.1,"278":25.2,"279":3.4,"366":3.8,"456":10.1,"457":10.1},"sun":{"72":25.2,"73":2.1,"90":4,"129":7.5,"130":5,"278":12.6,"279":1.7,"366":1.9,"456":5,"457":5}},"Chenal 220|dppt:sinnoh-sea-route-220-area":{"base":{"72":36.1,"73":3,"129":10.8,"130":7.2,"170":7.2,"171":0.7,"278":18.1,"279":2.4,"456":7.2,"457":7.2},"night":{"170":13.2,"211":5},"rain":{"72":57.8,"73":4.8,"129":17.3,"130":11.6,"170":13.9,"171":1.4,"278":28.9,"279":3.9,"456":11.6,"457":11.6},"storm":{"72":50.5,"73":4.2,"129":15.2,"130":10.1,"170":18.2,"171":1.8,"278":25.3,"279":3.4,"456":10.1,"457":10.1},"sun":{"72":25.3,"73":2.1,"129":7.6,"130":5.1,"170":5.1,"278":12.6,"279":1.7,"456":5.1,"457":5.1}},"Route 221|dppt:sinnoh-route-221-area":{"base":{"72":13.2,"73":1.1,"90":5.7,"129":4,"130":2.6,"185":4.4,"203":8.8,"278":13.2,"279":0.9,"315":4.4,"366":1,"389":0.4,"418":4.4,"419":4.4,"422":4.4,"423":8.8,"434":8.8,"435":4.4,"456":2.6,"457":2.6},"night":{"90":0,"170":4.7,"389":0},"rain":{"72":21.2,"73":1.8,"90":7.9,"129":6.4,"130":4.2,"278":21.2,"279":1.4,"366":1.6,"418":7.1,"419":7.1,"422":7.1,"423":14.1,"456":4.2,"457":4.2},"storm":{"72":18.5,"73":1.5,"90":7.2,"129":5.6,"130":3.7,"278":18.5,"366":1.4,"418":6.2,"419":6.2,"422":6.2,"423":12.4,"456":3.7,"457":3.7},"sun":{"72":9.3,"73":0.8,"90":4.6,"129":2.8,"130":1.9,"278":9.3,"279":0.6,"315":5.7,"366":0.7,"418":3.1,"419":3.1,"422":3.1,"423":6.2,"456":1.9,"457":1.9}},"Route 222|dppt:sinnoh-route-222-area":{"base":{"72":8,"81":6,"122":6,"125":10,"223":4,"278":14,"419":10,"431":10,"441":5,"42201":4,"42301":10},"night":{"72":14,"278":0,"392":0.4,"431":0,"434":12,"441":0},"rain":{"129":5,"223":10,"42301":14},"storm":{"81":14,"82":4,"125":22,"404":8},"sun":{"441":10}},"Chenal 223|dppt:sinnoh-sea-route-223-area":{"base":{"73":25,"129":8,"130":4,"223":12,"224":6,"226":5,"279":20,"456":6,"457":4},"night":{"73":30,"279":0},"rain":{"223":16,"226":8,"395":0.4},"storm":{"73":28}},"Route Victoire|dppt:sinnoh-victory-road-1f+dppt:sinnoh-victory-road-2f+dppt:sinnoh-victory-road-b1f+dppt:sinnoh-victory-road-inside":{"base":{"42":15,"64":8,"67":12,"75":12,"82":8,"95":6,"111":5,"112":4,"184":8,"208":10,"308":6,"419":8}},"Route 225|dppt:sinnoh-route-225-area":{"base":{"20":14,"22":14,"55":10,"61":8,"67":12,"75":12,"129":4,"315":8,"339":4},"night":{"20":22,"22":0,"354":14,"435":12},"rain":{"55":16,"60":16,"61":12},"storm":{"60":10}},"Chenal 226|dppt:sinnoh-sea-route-226-area":{"base":{"20":6,"22":8,"67":6,"73":5,"75":6,"86":10,"116":6,"278":15,"279":12,"363":10,"369":2},"night":{"20":14,"22":0,"278":0,"279":0,"354":10},"rain":{"86":14,"116":10,"363":14,"369":4},"storm":{"73":10}},"Route 227|dppt:sinnoh-route-227-area":{"base":{"22":10,"61":6,"75":12,"110":8,"111":6,"112":15,"227":8,"322":6,"323":14},"night":{"22":0,"42":12,"354":12},"sun":{"126":3,"323":20},"ash":{"126":4,"322":12,"323":24}},"Route 228|dppt:sinnoh-route-228-area":{"base":{"50":6,"51":15,"111":6,"112":10,"331":6,"332":14,"449":8,"450":8},"night":{"331":0,"332":20},"sun":{"331":12},"sand":{"51":22,"449":14,"450":12,"451":8,"452":3}},"Mont Abrupt|dppt:stark-mountain-entrance+dppt:stark-mountain-area+dppt:stark-mountain-inside":{"base":{"42":6,"67":6,"75":16,"95":4,"110":8,"112":15,"126":4,"218":5,"219":12,"227":5,"322":4,"323":12}},"Route 1|bw:unova-route-1-area":{"base":{"504":31.3,"506":31.3,"550":37.5}},"Route 2|bw:unova-route-2-area":{"base":{"504":40,"506":40,"509":20,"535":0},"rain":{"535":8}},"Vestiges du Rêve|bw:dreamyard-area":{"base":{"504":40,"509":40,"517":20},"fog":{"517":14},"spring":{"517":30}},"Route 3|bw:unova-route-3-area":{"base":{"501":0,"504":21.3,"506":10.6,"509":10.6,"519":21.3,"522":10.6,"535":0,"550":25.5},"rain":{"501":3.9,"535":10},"storm":{"522":12},"summer":{"522":15.9}},"Veine Souterraine|bw:wellspring-cave-area":{"base":{"524":31.3,"527":31.3,"550":37.5}},"Forêt d'Empoigne|bw:pinwheel-forest-outside+bw:pinwheel-forest-inside":{"base":{"495":0,"519":10.3,"520":5.2,"532":5.2,"535":10.3,"538":2.6,"539":2.6,"540":10.3,"541":10.3,"543":5.2,"544":5.2,"546":10.3,"548":10.3,"550":12.4,"570":0},"day":{"495":3.4,"546":0},"night":{"548":0,"570":3},"spring":{"540":15.5,"541":15.5,"543":7.8,"544":7.8}},"Route 4|bw:unova-route-4-area":{"base":{"551":27,"554":27,"559":13.5,"592":32.4},"sand":{"551":25},"sun":{"554":20},"summer":{"559":20.3}},"Désert Délassant|bw:desert-resort-entrance+bw:desert-resort-area":{"base":{"498":0,"551":30.8,"554":30.8,"557":7.7,"559":15.4,"561":15.4},"sun":{"498":3.6},"sand":{"557":12},"summer":{"557":11.6,"559":23.1,"561":23.1}},"Château Enfoui|bw:relic-castle-a+bw:relic-castle-b+bw:relic-castle-c+bw:relic-castle-d":{"base":{"551":25,"552":25,"562":25,"563":25}},"Route 5|bw:unova-route-5-area":{"base":{"510":12.5,"568":12.5,"572":25,"574":25,"577":25,"595":0},"day":{"574":0},"night":{"577":0},"storm":{"595":8},"winter":{"572":37.5}},"Hangar Frigorifique|bw:cold-storage-area":{"base":{"507":33.3,"532":16.7,"572":33.3,"582":16.7}},"Route 6|bw:unova-route-6-area":{"base":{"520":5.2,"535":0,"541":5.2,"550":12.4,"582":5.2,"585":10.3,"588":10.3,"590":51.5,"602":0},"storm":{"602":4},"rain":{"535":6},"spring":{"541":7.8},"autumn":{"588":15.5,"590":77.3},"winter":{"582":7.8}},"Grotte Électrolithe|bw:chargestone-cave-1f+bw:chargestone-cave-b1f+bw:chargestone-cave-b2f":{"base":{"525":15.6,"595":31.3,"597":15.6,"599":31.3,"602":6.3}},"Grotte Parsemille|bw:mistralton-cave-area":{"base":{"525":50,"527":50}},"Route 7|bw:unova-route-7-area":{"base":{"505":11.8,"520":23.5,"523":11.8,"582":0,"585":23.5,"590":5.9,"613":23.5},"snow":{"582":10,"613":12},"summer":{"523":17.7},"autumn":{"590":8.9},"winter":{"582":15,"613":35.3}},"Tour des Cieux|bw:celestial-tower-2f+bw:celestial-tower-3f+bw:celestial-tower-4f+bw:celestial-tower-5f":{"base":{"605":50,"607":30}},"Mont Foré|bw:twist-mountain-b1f-3f":{"base":{"525":27,"527":13.5,"533":27,"613":8,"615":5.4}},"Tourbière Flocombe|bw:moor-of-icirrus-area":{"base":{"536":20,"616":20,"618":60},"rain":{"618":12},"autumn":{"616":30}},"Route 8|bw:unova-route-8-area":{"base":{"536":20,"616":20,"618":60},"rain":{"536":10},"autumn":{"616":30}},"Tour Dragospire|bw:dragonspiral-tower-outside+bw:dragonspiral-tower-entrance+bw:dragonspiral-tower-1f+bw:dragonspiral-tower-2f":{"base":{"520":10.3,"550":12.4,"582":10.3,"583":10.3,"585":10.3,"586":10.3,"613":5.2,"614":5.2,"619":10.3,"621":5.2,"622":10.3}},"Route 9|bw:unova-route-9-area":{"base":{"510":11.1,"569":11.1,"572":22.2,"574":0,"575":22.2,"577":0,"578":22.2,"624":11.1},"day":{"575":0,"577":6},"night":{"574":6,"578":0},"winter":{"572":33.3}},"Route 10|bw:unova-route-10-area+bw:unova-route-10-victory-road-gate":{"base":{"507":7.1,"538":1.8,"539":1.8,"590":35.7,"591":35.7,"626":3.6,"627":7.1,"629":7.1},"night":{"627":0},"day":{"629":0},"autumn":{"590":53.6,"591":53.6}},"Route Victoire|bw:unova-victory-road-outside+bw:unova-victory-road-1f-unknown-room+bw:unova-victory-road-4f-middle-room+bw:unova-victory-road-unknown-area-53":{"base":{"497":0.3,"500":0.3,"503":0.3,"525":13.9,"527":6.9,"550":16.7,"619":6.9,"627":13.9,"629":13.9,"631":13.9,"632":13.9,"633":1.5}},"Route 11|bw:unova-route-11-area":{"base":{"55":9.6,"118":2.9,"207":4.8,"335":4.8,"336":4.8,"418":11.5,"550":11.5,"588":2.4,"591":4.8,"624":2.4,"625":2.4,"627":9.6,"628":9.6,"629":9.6,"630":9.6},"night":{"627":0,"628":0},"day":{"629":0,"630":0},"autumn":{"588":3.6,"591":7.2}},"Pont du Hameau|bw:village-bridge-area":{"base":{"55":15.4,"318":4.6,"335":7.7,"336":7.7,"400":15.4,"550":18.5,"627":7.7,"628":7.7,"629":7.7,"630":7.7},"night":{"627":0,"628":0},"day":{"629":0,"630":0}},"Route 12|bw:unova-route-12-area":{"base":{"11":9.6,"14":9.6,"78":9.6,"127":4.8,"191":19.2,"206":3.8,"214":4.8,"415":19.2,"421":9.6,"520":9.6},"night":{"11":0},"day":{"14":0}},"Route 13|bw:unova-route-13-area":{"base":{"42":6.5,"90":3.9,"98":3.9,"114":13.1,"120":15.7,"277":13.1,"278":15.7,"279":1.3,"337":6.5,"338":6.5,"359":3.3,"370":3.9,"426":6.5}},"Baie Vaguelone|bw:undella-town-area+bw:undella-bay-area":{"base":{"90":8.8,"223":8.8,"278":35.3,"279":2.9,"363":17.6,"370":8.8,"458":17.6}},"Route 14|bw:unova-route-14-area":{"base":{"39":13,"55":13,"118":3.9,"213":3.2,"334":6.5,"357":6.5,"418":15.6,"426":6.5,"550":15.6,"606":3.2,"619":6.5,"620":6.5}},"Route 15|bw:unova-route-15-area":{"base":{"22":22.5,"105":22.5,"115":11.2,"207":11.2,"247":5.6,"505":4.5,"538":11.2,"539":11.2}},"Route 16|bw:unova-route-16-area":{"base":{"510":12.5,"568":12.5,"572":25,"574":25,"577":25},"day":{"574":0},"night":{"577":0},"winter":{"572":37.5}},"Bois des Illusions|bw:lostlorn-forest-area":{"base":{"118":5.5,"520":9.1,"541":18.2,"543":9.1,"546":18.2,"548":18.2,"550":21.8,"571":2},"day":{"546":0},"night":{"548":0},"spring":{"541":27.3,"543":13.7}},"Grotte Cyclopéenne|bw:giant-chasm-outside+bw:giant-chasm-area+bw:giant-chasm-forest+bw:giant-chasm-forest-cave":{"base":{"35":8.3,"42":8.3,"60":2.5,"61":2.5,"86":10,"114":8.3,"124":2.1,"132":4.2,"215":4.2,"221":8.3,"225":4.2,"277":8.3,"337":4.2,"338":4.2,"359":2.1,"375":2.1,"426":4.2,"525":2.1,"550":10}}},"weather":{"slotMs":3600000,"chance":0.54,"climates":{"prairie":{"rain":2,"sun":2,"storm":0.5},"town":{"rain":2,"sun":1},"forest":{"rain":3,"sun":1,"storm":0.5},"lake":{"rain":3,"sun":1,"storm":1},"pier":{"rain":3,"sun":1,"storm":1},"beach":{"sun":3,"rain":1,"storm":0.5},"mountain":{"rain":2,"sun":1,"snow":1,"storm":0.5}},"regionOff":{"kanto":["sun"],"johto":["sun"]},"regionWeights":{"sinnoh":{"all":{"sun":0.5},"mountain":{"snow":2}}},"translate":{"rain":["snow"],"storm":["rain","snow"],"snow":["rain","blizzard"],"sun":[],"sand":[],"ash":[],"fog":[],"blizzard":["snow","rain"],"breeze":[],"gale":[]},"types":{"rain":{"name":"Pluie","icon":"🌧️","encounters":{"water":1.6,"electric":1.2,"fire":0.6},"damage":{"water":1.1,"fire":0.9}},"storm":{"name":"Orage","icon":"⛈️","encounters":{"electric":1.8,"water":1.4,"fire":0.5},"damage":{"water":1.1,"electric":1.1,"fire":0.9}},"sun":{"name":"Soleil ardent","icon":"🔆","daylight":true,"encounters":{"fire":1.6,"grass":1.3,"water":0.7},"damage":{"fire":1.1,"water":0.9}},"sand":{"name":"Tempête de sable","icon":"🌪️","encounters":{"ground":1.6,"rock":1.6,"steel":1.4,"grass":0.7}},"snow":{"name":"Neige","icon":"❄️","encounters":{"ice":2,"water":1.2,"fire":0.6,"grass":0.7}},"ash":{"name":"Cendres","icon":"🌋","encounters":{"fire":1.4,"ground":1.2,"grass":0.6,"water":0.7}},"fog":{"name":"Brouillard","icon":"🌫️","encounters":{"ghost":1.8,"psychic":1.3,"flying":0.6},"damage":{"ghost":1.1}},"blizzard":{"name":"Blizzard","icon":"🌨️","encounters":{"ice":2.6,"water":1.1,"fire":0.25,"grass":0.5,"bug":0.5},"damage":{"ice":1.1,"fire":0.9}},"breeze":{"name":"Vent léger","icon":"🍃","encounters":{"flying":1.5,"dragon":1.2}},"gale":{"name":"Bourrasque","icon":"🌬️","encounters":{"flying":1.8,"dragon":1.2,"bug":0.6},"damage":{"flying":1.1}}}},"roamingWeather":{"243":"storm","244":"sun","245":"rain","380":"breeze","381":"breeze","641":"gale","642":"storm"},"roamingGroups":[{"ids":[243,244,245],"unlock":"Maître Johto","regions":["johto"]},{"ids":[380,381],"unlock":"Maître Hoenn","regions":["hoenn"]},{"ids":[481],"unlock":"Maître Sinnoh","regions":["sinnoh"]},{"ids":[641,642],"unlock":"Maître Unys","regions":["unova"]}],"specialZones":[{"id":145,"region":"kanto","zone":"无人发电厂","sourceZone":"Centrale","areas":["kanto-power-plant-area"],"dex":[1,151],"level":100,"badge":null,"badgeName":null,"condition":{"kind":"type","type":"electric"}},{"id":144,"region":"kanto","zone":"双子岛","sourceZone":"Îles Écume","areas":["seafoam-islands-1f","seafoam-islands-b1f","seafoam-islands-b2f","seafoam-islands-b3f","seafoam-islands-b4f"],"dex":[1,151],"level":100,"badge":null,"badgeName":null,"condition":{"kind":"type","type":"ice"}},{"id":146,"region":"kanto","zone":"炽热洞窟","sourceZone":"Grotte Ardente","areas":["kanto-victory-road-2-1f","kanto-victory-road-2-2f","kanto-victory-road-2-3f"],"dex":[1,151],"level":100,"badge":null,"badgeName":null,"condition":{"kind":"type","type":"fire"}},{"id":150,"region":"kanto","zone":"华蓝洞窟","sourceZone":"Caverne Azurée","areas":["cerulean-cave-1f","cerulean-cave-2f","cerulean-cave-b1f"],"dex":[1,151],"level":100,"badge":"Cascade","badgeName":"蓝色","condition":{"kind":"league","region":"kanto"}},{"id":151,"region":"kanto","zone":"遥远的孤岛","sourceZone":"Île Lointaine","areas":[],"dex":[1,151],"level":100,"badge":null,"badgeName":null,"condition":{"kind":"dex"}},{"id":250,"region":"johto","zone":"铃铛塔","sourceZone":"Tour Carillon","areas":["gsc:bell-tower-2f","gsc:bell-tower-3f","gsc:bell-tower-4f","gsc:bell-tower-5f","gsc:bell-tower-6f","gsc:bell-tower-7f","gsc:bell-tower-8f","gsc:bell-tower-9f"],"dex":[152,251],"level":100,"badge":"Brume","badgeName":"雾","condition":{"kind":"owns","ids":[243,244,245],"text":"拥有3只传说的神兽"}},{"id":249,"region":"johto","zone":"漩涡列岛","sourceZone":"Îles Tourbillon","areas":["gsc:whirl-islands-1f","gsc:whirl-islands-b1f","gsc:whirl-islands-b2f","gsc:whirl-islands-b3f"],"dex":[152,251],"level":100,"badge":null,"badgeName":null,"condition":{"kind":"owns","ids":[144,145,146],"text":"拥有3只传说的鸟"}},{"id":251,"region":"johto","zone":"桐树林","sourceZone":"Bois aux Chênes","areas":["gsc:ilex-forest-area"],"dex":[152,251],"level":100,"badge":null,"badgeName":null,"condition":{"kind":"dex"}},{"id":377,"region":"hoenn","zone":"沙漠遗迹","sourceZone":"Ruines du Désert","areas":["rse:hoenn-route-111-area"],"dex":[252,386],"level":100,"badge":"Balance","badgeName":"平衡","condition":{"kind":"door","key":"regirock"}},{"id":378,"region":"hoenn","zone":"小岛横穴","sourceZone":"Grotte de l'Île","areas":["rse:hoenn-route-105-area","rse:hoenn-route-106-area"],"dex":[252,386],"level":100,"badge":"Poing","badgeName":"拳头","condition":{"kind":"door","key":"regice"}},{"id":379,"region":"hoenn","zone":"古代墓穴","sourceZone":"Tombeau Antique","areas":["rse:hoenn-route-120-area"],"dex":[252,386],"level":100,"badge":"Plume","badgeName":"羽毛","condition":{"kind":"door","key":"registeel"}},{"id":383,"region":"hoenn","zone":"大地洞穴","sourceZone":"Grotte Terra","areas":[],"dex":[252,386],"level":100,"badge":"Pluie","badgeName":"下雨","condition":{"kind":"types","types":["ground","fire"],"dex":[1,386]}},{"id":382,"region":"hoenn","zone":"海洋洞穴","sourceZone":"Grotte Marine","areas":[],"dex":[252,386],"level":100,"badge":"Pluie","badgeName":"下雨","condition":{"kind":"types","types":["water","ice"],"dex":[1,386]}},{"id":385,"region":"hoenn","zone":"许愿山顶","sourceZone":"Sommet des Vœux","areas":["rse:meteor-falls-area","rse:meteor-falls-b1f"],"dex":[252,386],"level":100,"badge":null,"badgeName":null,"condition":{"kind":"dex"}},{"id":386,"region":"hoenn","zone":"诞生之岛","sourceZone":"Île Aurore","areas":[],"dex":[252,386],"level":100,"badge":null,"badgeName":null,"condition":{"kind":"item","item":"auroraticket","text":"获得前往诞生之岛的船票"},"forms":[386,38601,38602,38603]},{"id":480,"region":"sinnoh","zone":"睿智洞窟","sourceZone":"Caverne Savoir","areas":["dppt:lake-acuity-area"],"dex":[387,493],"level":100,"badge":"Maître Sinnoh","badgeName":"神奥冠军","condition":{"kind":"count","need":75},"anchor":55},{"id":482,"region":"sinnoh","zone":"立志洞窟","sourceZone":"Caverne Courage","areas":["dppt:lake-valor-area"],"dex":[387,493],"level":100,"badge":"Maître Sinnoh","badgeName":"神奥冠军","condition":{"kind":"tally","need":1000,"field":"trainers","text":"在该地区打败{n}位训练家"},"anchor":52},{"id":483,"region":"sinnoh","zone":"枪之柱","sourceZone":"Colonnes Lances","areas":["dppt:mt-coronet-exterior-snowfall"],"dex":[387,493],"level":100,"badge":"Maître Sinnoh","badgeName":"神奥冠军","condition":{"kind":"all","list":[{"kind":"owns","ids":[480,481,482],"text":"拥有由克希、艾姆利多和亚克诺姆"},{"kind":"item","item":"adamant-orb","text":"在天冠山找到金刚宝珠"}]},"anchor":57,"when":"day"},{"id":484,"region":"sinnoh","zone":"枪之柱","sourceZone":"Colonnes Lances","areas":["dppt:mt-coronet-exterior-snowfall"],"dex":[387,493],"level":100,"badge":"Maître Sinnoh","badgeName":"神奥冠军","condition":{"kind":"all","list":[{"kind":"owns","ids":[480,481,482],"text":"拥有由克希、艾姆利多和亚克诺姆"},{"kind":"item","item":"lustrous-orb","text":"在天冠山找到白玉宝珠"}]},"anchor":57,"when":"night"},{"id":487,"region":"sinnoh","zone":"归途洞窟","sourceZone":"Grotte Retour","areas":[],"dex":[387,493],"level":100,"badge":"Maître Sinnoh","badgeName":"神奥冠军","condition":{"kind":"owns","ids":[483,484],"text":"拥有帝牙卢卡和帕路奇亚"},"anchor":52},{"id":48701,"region":"sinnoh","zone":"毁坏的世界","sourceZone":"Monde Distorsion","areas":[],"dex":[387,493],"level":100,"badge":"Maître Sinnoh","badgeName":"神奥冠军","condition":{"kind":"all","list":[{"kind":"owns","ids":[487],"text":"拥有骑拉帝纳（别种形态）"},{"kind":"item","item":"griseous-orb","text":"获得白金宝珠：在精英I中打败骑拉帝纳"}]},"anchor":57},{"id":485,"region":"sinnoh","zone":"严酷山深处","sourceZone":"Cœur du Mont Abrupt","areas":["dppt:stark-mountain-inside"],"dex":[387,493],"level":100,"badge":"Maître Sinnoh","badgeName":"神奥冠军","condition":{"kind":"types","types":["fire","steel"],"dex":[1,493]}},{"id":486,"region":"sinnoh","zone":"雪峰神殿","sourceZone":"Temple de Frimapic","areas":[],"dex":[387,493],"level":100,"badge":"Maître Sinnoh","badgeName":"神奥冠军","condition":{"kind":"door","key":"regigigas"},"anchor":55},{"id":643,"region":"unova","zone":"龙螺旋之塔","sourceZone":"Tour Dragospire","areas":[],"dex":[494,649],"level":100,"badge":"Maître Unys","badgeName":"合众冠军","condition":{"kind":"all","list":[{"kind":"league","region":"unova"},{"kind":"item","item":"light-stone","text":"在古代城找到光明石"}]},"anchor":74,"when":"day"},{"id":644,"region":"unova","zone":"龙螺旋之塔","sourceZone":"Tour Dragospire","areas":[],"dex":[494,649],"level":100,"badge":"Maître Unys","badgeName":"合众冠军","condition":{"kind":"all","list":[{"kind":"league","region":"unova"},{"kind":"item","item":"dark-stone","text":"在古代城找到黑暗石"}]},"anchor":74,"when":"night"},{"id":646,"region":"unova","zone":"巨人洞窟","sourceZone":"Grotte Cyclopéenne","areas":[],"dex":[494,649],"level":100,"badge":"Maître Unys","badgeName":"合众冠军","condition":{"kind":"owns","ids":[643,644],"text":"拥有莱希拉姆和捷克罗姆"},"anchor":83},{"id":64601,"region":"unova","zone":"巨人洞窟","sourceZone":"Grotte Cyclopéenne","areas":[],"dex":[494,649],"level":100,"badge":"Maître Unys","badgeName":"合众冠军","condition":{"kind":"all","list":[{"kind":"owns","ids":[646],"text":"拥有酋雷姆"},{"kind":"elite","zone":644,"tier":1}]},"anchor":83},{"id":64602,"region":"unova","zone":"巨人洞窟","sourceZone":"Grotte Cyclopéenne","areas":[],"dex":[494,649],"level":100,"badge":"Maître Unys","badgeName":"合众冠军","condition":{"kind":"all","list":[{"kind":"owns","ids":[646],"text":"拥有酋雷姆"},{"kind":"elite","zone":643,"tier":1}]},"anchor":83},{"id":638,"region":"unova","zone":"吹寄洞穴","sourceZone":"Grotte Parsemille","areas":[],"dex":[494,649],"level":100,"badge":null,"badgeName":null,"condition":{"kind":"types","types":["steel"],"dex":[1,649]},"anchor":72},{"id":639,"region":"unova","zone":"试练之室","sourceZone":"Salle Épreuve","areas":[],"dex":[494,649],"level":100,"badge":null,"badgeName":null,"condition":{"kind":"types","types":["rock"],"dex":[1,649]},"anchor":76},{"id":640,"region":"unova","zone":"矢车森林","sourceZone":"Forêt d'Empoigne","areas":[],"dex":[494,649],"level":100,"badge":null,"badgeName":null,"condition":{"kind":"types","types":["grass"],"dex":[1,649]},"anchor":68},{"id":649,"region":"unova","zone":"P2实验室","sourceZone":"Labo P2","areas":[],"dex":[494,649],"level":100,"badge":null,"badgeName":null,"condition":{"kind":"types","types":["bug"],"dex":[1,649]},"anchor":83},{"id":64901,"region":"unova","zone":"P2实验室","sourceZone":"Labo P2","areas":[],"dex":[494,649],"level":100,"badge":null,"badgeName":null,"condition":{"kind":"all","list":[{"kind":"owns","ids":[649],"text":"拥有盖诺赛克特"},{"kind":"item","item":"douse-drive","text":"获得水流卡带：在精英II中打败盖诺赛克特"}]},"anchor":83},{"id":64902,"region":"unova","zone":"P2实验室","sourceZone":"Labo P2","areas":[],"dex":[494,649],"level":100,"badge":null,"badgeName":null,"condition":{"kind":"all","list":[{"kind":"owns","ids":[649],"text":"拥有盖诺赛克特"},{"kind":"item","item":"shock-drive","text":"获得闪电卡带：在精英III中打败盖诺赛克特"}]},"anchor":83},{"id":64903,"region":"unova","zone":"P2实验室","sourceZone":"Labo P2","areas":[],"dex":[494,649],"level":100,"badge":null,"badgeName":null,"condition":{"kind":"all","list":[{"kind":"owns","ids":[649],"text":"拥有盖诺赛克特"},{"kind":"item","item":"burn-drive","text":"获得火焰卡带：在精英I中打败盖诺赛克特"}]},"anchor":83},{"id":64904,"region":"unova","zone":"P2实验室","sourceZone":"Labo P2","areas":[],"dex":[494,649],"level":100,"badge":null,"badgeName":null,"condition":{"kind":"all","list":[{"kind":"owns","ids":[649],"text":"拥有盖诺赛克特"},{"kind":"item","item":"chill-drive","text":"获得冰冻卡带：在精英IV中打败盖诺赛克特"}]},"anchor":83},{"id":494,"region":"unova","zone":"自由庭园岛","sourceZone":"Île Liberté","areas":[],"dex":[494,649],"level":100,"badge":null,"badgeName":null,"condition":{"kind":"dex"}},{"id":648,"region":"unova","zone":"雷文市音乐剧剧场","sourceZone":"Théâtre de Méanville","areas":[],"dex":[494,649],"level":100,"badge":"Maître Unys","badgeName":"合众冠军","condition":{"kind":"owns","ids":[494,647],"text":"拥有比克提尼和凯路迪欧"},"anchor":70,"when":"day"},{"id":64801,"region":"unova","zone":"雷文市音乐剧剧场","sourceZone":"Théâtre de Méanville","areas":[],"dex":[494,649],"level":100,"badge":"Maître Unys","badgeName":"合众冠军","condition":{"kind":"owns","ids":[648],"text":"拥有美洛耶塔（歌声形态）"},"anchor":70,"when":"night"},{"id":647,"region":"unova","zone":"雪花湿地","sourceZone":"Tourbière Flocombe","areas":[],"dex":[494,649],"level":100,"badge":"Maître Unys","badgeName":"合众冠军","condition":{"kind":"door","key":"keldeo"},"anchor":74},{"id":645,"region":"unova","zone":"丰饶之祠","sourceZone":"Autel Abondance","areas":[],"dex":[494,649],"level":100,"badge":"Maître Unys","badgeName":"合众冠军","condition":{"kind":"door","key":"landorus"},"anchor":83},{"id":64101,"region":"unova","zone":"丰饶之祠","sourceZone":"Autel Abondance","areas":[],"dex":[494,649],"level":100,"badge":"Maître Unys","badgeName":"合众冠军","condition":{"kind":"all","list":[{"kind":"owns","ids":[641],"text":"拥有龙卷云"},{"kind":"item","item":"reveal-glass","text":"在14号道路找到现形镜"}]},"anchor":83},{"id":64201,"region":"unova","zone":"丰饶之祠","sourceZone":"Autel Abondance","areas":[],"dex":[494,649],"level":100,"badge":"Maître Unys","badgeName":"合众冠军","condition":{"kind":"all","list":[{"kind":"owns","ids":[642],"text":"拥有雷电云"},{"kind":"item","item":"reveal-glass","text":"在14号道路找到现形镜"}]},"anchor":83},{"id":64501,"region":"unova","zone":"丰饶之祠","sourceZone":"Autel Abondance","areas":[],"dex":[494,649],"level":100,"badge":"Maître Unys","badgeName":"合众冠军","condition":{"kind":"all","list":[{"kind":"owns","ids":[645],"text":"拥有土地云"},{"kind":"item","item":"reveal-glass","text":"在14号道路找到现形镜"}]},"anchor":83},{"id":488,"region":"sinnoh","zone":"满月岛","sourceZone":"Île Pleine Lune","areas":[],"dex":[387,493],"level":100,"badge":"Maître Sinnoh","badgeName":"神奥冠军","condition":{"kind":"league","region":"sinnoh"},"anchor":53,"moon":"full"},{"id":491,"region":"sinnoh","zone":"新月岛","sourceZone":"Île Nouvellune","areas":[],"dex":[387,493],"level":100,"badge":"Maître Sinnoh","badgeName":"神奥冠军","condition":{"kind":"owns","ids":[488],"text":"拥有克雷色利亚"},"anchor":53,"moon":"new"},{"id":492,"region":"sinnoh","zone":"花之乐园","sourceZone":"Paradis Fleuri","areas":["dppt:floaroma-meadow-area"],"dex":[387,493],"level":100,"badge":null,"badgeName":null,"condition":{"kind":"dex"},"when":"night"},{"id":49201,"region":"sinnoh","zone":"花之乐园","sourceZone":"Paradis Fleuri","areas":["dppt:floaroma-meadow-area"],"dex":[387,493],"level":100,"badge":null,"badgeName":null,"condition":{"kind":"all","list":[{"kind":"owns","ids":[492],"text":"拥有谢米（陆上形态）"},{"kind":"item","item":"gracidea","text":"白天带着谢米在队伍中，在花苑花田收下葛拉西蒂亚花"}]},"when":"day"},{"id":384,"region":"hoenn","zone":"天空柱","sourceZone":"Pilier Céleste","areas":["rse:sky-pillar-1f","rse:sky-pillar-3f","rse:sky-pillar-5f"],"dex":[252,386],"level":100,"badge":"Pluie","badgeName":"下雨","condition":{"kind":"owns","ids":[383,382],"text":"拥有固拉多和盖欧卡"}}],"shinyStatBonus":0.1,"rankMax":5,"rankStatMultiplier":1.15,"battle":{"maxLevel":100,"leagueDoneCap":100,"levelGap":1.06,"damageRoll":0.85,"gymDamage":1.3,"gymHpMult":1.3,"gymTeamExp":0.7,"enemyHpPerAlly":0.7,"enemyDamage":{"wild":0.85,"trainer":0.9,"static":1},"gymTrainers":{"counts":[1,2,2,3],"below":[4,2,2],"damage":0.8},"hpLevelScale":1.5,"hpLevelMax":2.5,"hpBoost":1.1,"statusMoveChance":0.3,"fullParalysisChance":0.25,"confusionSelfHitChance":0.33,"thawChance":0.2,"statusFx":{"dotTurns":5,"paralysisTurns":3},"bossStatus":{"hurt":60,"dotTurns":4,"lockMax":2,"paralysisBlock":0.2},"trainerItemEvolutionLevel":40}};
  const SAVE_KEY = "gachamon-save-v1";
  const SETTINGS_KEY = "pca.settings.v1";
  const SESSION_KEY = "pca.session.v1";
  const PANEL_ID = "pca-panel";
  const VERSION = "0.16.2";
  const PROJECT_URL = "https://github.com/stdAri/pokecatch-assistant";
  const ISSUES_URL = `${PROJECT_URL}/issues/new`;
  const COMPATIBLE_APP_BUILDS = new Set([DATA.appBuild, "7acad22262", "021c85dbba", "6e45170313"]);
  const ROAMING_GROUPS = DATA.roamingGroups;
  const ROAMING_LEGENDARIES = ROAMING_GROUPS.flatMap(({ ids }) => ids);
  const REGION_ORDER = ["kanto", "johto", "hoenn", "sinnoh", "unova"];
  const COLLECTION_QUEUE_LIMIT = 5;
  const DEFAULT_LEVEL_WEIGHT = 0.22;
  const COLLECTION_LEVEL_WEIGHT = 1.2;
  const ROAMING_PREFERRED_LEVEL = 90;

  const BERRIES = {
    "razz-berry": { family: "capture", zh: "蔓莓果（捕获率 ×1.25）", en: "Razz Berry (catch rate ×1.25)" },
    "golden-razz-berry": { family: "capture", zh: "金色蔓莓果（捕获率 ×1.5）", en: "Golden Razz Berry (catch rate ×1.5)" },
    "nanab-berry": { family: "rare", zh: "蕉香果（区域稀有种类 ×2）", en: "Nanab Berry (regional rare species ×2)" },
    "enigma-berry": { family: "dex", zh: "谜芝果（本地区未捕获种类 ×3）", en: "Enigma Berry (uncaught regional species ×3)" },
    "pinap-berry": { family: "xp", zh: "凰梨果（战斗经验 +25%）", en: "Pinap Berry (battle XP +25%)" },
    "lansat-berry": { family: "money", zh: "兰萨果（金币 +25%）", en: "Lansat Berry (money +25%)" },
    "starf-berry": { family: "shiny", zh: "星桃果（野生异色 ×2）", en: "Starf Berry (wild shiny rate ×2)" },
    "rowap-berry": { family: "roam", zh: "雾莲果（徘徊宝可梦停留 30 分钟）", en: "Rowap Berry (roamers stay for 30 min)" },
  };

  const PENSION_BERRIES = {
    "berry-oran": { zh: "橙橙果", en: "Oran Berry", effectZh: "培育屋产蛋进度 +5 分钟", effectEn: "Day Care egg progress +5 min" },
    "berry-pecha": { zh: "桃桃果", en: "Pecha Berry", effectZh: "培育屋产蛋进度 +15 分钟", effectEn: "Day Care egg progress +15 min" },
    "berry-sitrus": { zh: "文柚果", en: "Sitrus Berry", effectZh: "培育屋产蛋进度 +30 分钟", effectEn: "Day Care egg progress +30 min" },
    "belue-berry": { zh: "靛莓果", en: "Belue Berry", effectZh: "百变怪下一颗蛋的异色率 ×2", effectEn: "Ditto's next egg Shiny rate ×2" },
  };

  const TEXT = {
    zh: {
      assistant: "PokéCatch 助手", auto: "跟随游戏", expand: "打开助手", collapse: "关闭", floatWindow: "浮动窗口", dockWindow: "回到顶部", progress: "进度",
      pushTab: "推图", collectTab: "收集", trainingTab: "培养", teamTab: "阵容", berriesTab: "果子", diagnosticsTab: "诊断",
      startPush: "开始推图", pauseResume: "暂停/继续", stop: "停止",
      pushNote: "从当前地区的剧情前沿持续推进；推图期间不会追踪神兽。",
      prioritizeDailyRaid: "每天优先完成团体战",
      prioritizeDailyRaidNote: "启动任一自动任务后，每天先完成可用的异色团体战；己方2人队使用游戏原生“优化”，两个盟友槽依次选择列表第一项，不会改动第五队。",
      dailyRaid: "每日团体战", raidTeamMissing: "请先在团体战页面配置2只宝可梦", raidAlliesMissing: "请先在团体战页面选择2名盟友",
      selectCollection: "选择收集任务", dexCollection: "普通图鉴收集", roamOnly: "神兽收集", combined: "普通 + 神兽协同",
      collectionNote: "三个入口互相独立：神兽收集只处理神兽。协同模式优先追踪已出现的徘徊神兽，再按手填顺序或固定地点收集。",
      ordinaryTargets: "普通野外目标", region: "地区", currentRegion: "当前地区", allRegions: "所有已解锁地区", customRegions: "自定义地区",
      autoPushCollection: "为全收集自动推图",
      autoPushCollectionNote: "当前没有可抓目标、但仍有目标被剧情锁定时，推进到下一次解锁后立即重新扫描；不会连续快速推图。",
      manualPlaceholder: "手动优先编号，如 214,201-H,493-A", apply: "应用",
      targetNote: "只会加入尚未捕获、且在所选范围内存在获取地点的目标；剧情未解锁时可由全收集推图逐步解锁，按填写顺序优先。",
      collectionQueue: "当前待抓队列", queueEmpty: "当前没有可立即捕获的自动目标", waitingCondition: "等待条件", moneyFarm: "刷钱等待天气",
      storyLocked: "剧情尚未解锁",
      roamers: "徘徊神兽", fixedLegendaryHeading: "固定地点与其他传说／幻兽", roamerNote: "收集遵循上方地区范围。实时徘徊目标优先，未出现时挑战满足条件的固定地点。",
      teamCopy: "阵容与队伍复制", lockTeam: "锁定第五队，不自动覆盖", team: "队伍", copy: "复制", regenerate: "重新生成当前目标阵容",
      autoBuddyTitle: "自动伙伴练级", autoBuddy: "自动选择并轮换伙伴宝可梦",
      autoBuddyScope: "伙伴候选范围", autoBuddyScopeAll: "队伍内外全部", autoBuddyScopeTeam: "仅队伍内", autoBuddyScopeBox: "仅队伍外（电脑中）",
      autoBuddyNote: "从所选范围中选择综合能力最高、且未达到该地区徽章等级上限的宝可梦；达到上限或100级后自动选择下一只。战斗和事件进行中不会切换。",
      buddyNone: "当前没有伙伴", buddyComplete: "所选范围内的宝可梦均已达到等级上限",
      trainingTitle: "培养候选池", trainingEnable: "启用候选池，自动配队优先使用已勾选的个体",
      trainingPower: "最低综合能力值", trainingPowerHelp: "综合能力值 = 当前形态六项种族值总和 × 异色加成 × 地下强化加成。它只用于筛选培养对象，不代表胜率；填 0 表示不设门槛。",
      trainingEligible: "只显示当前地区可出战成员", trainingSearch: "搜索名称或图鉴编号",
      trainingSelectVisible: "全选当前结果", trainingSelectTeam: "选入当前队伍", trainingClear: "清空选择", trainingRefresh: "刷新列表",
      trainingSave: "保存候选池", trainingReset: "撤销未保存", trainingNoSave: "进入游戏并创建存档后即可配置培养候选池。",
      trainingDisabled: "候选池未启用，自动配队仍使用全部当前可出战成员。",
      duplicateKeepTitle: "重复宝可梦保留", enableDuplicateKeeps: "全部开启", disableDuplicateKeeps: "全部关闭", cancelDuplicateKeeps: "取消批量操作",
      duplicateKeepRegions: "处理地区",
      duplicateKeepNote: "逐编号检查当前可访问、可重复获取的非传说宝可梦；已符合目标状态的编号会跳过。游戏实际按进化家族共享开关，异色与普通个体也共用设置。重复宝可梦会少一次约3级的家族经验。",
      duplicateKeepIdle: "尚未执行", duplicateKeepConfirmOn: "逐编号检查并为选中地区的宝可梦开启“保留重复”？", duplicateKeepConfirmOff: "逐编号检查并关闭选中地区宝可梦的“保留重复”？",
      berryTitle: "战斗增益果子（全部默认关闭）", reserve: "最低保留数量", berryNote: "右侧数字为最低保留量；普通与金色捕获果同时开启时优先金色。",
      stock: "库存", pensionBerryTitle: "培育屋专用果子", pensionBerryButton: "前往培育屋使用", pensionBerryNote: "这些果子只显示效果和库存，需要在培育屋满足条件时手动使用；助手不会自动消耗。",
      notifications: "通知", sound: "页面提示音", desktop: "桌面通知", diagnostic: "诊断", noError: "无异常", copyDiagnostic: "复制诊断", logs: "日志",
      projectLinks: "项目与反馈", author: "作者", githubProject: "查看 GitHub", reportIssue: "反馈问题", issueNote: "遇到问题时，建议先复制上方诊断信息，再到 GitHub 提交 Issue。",
      debugMode: "战斗调试模式", debugModeNote: "默认关闭。开启后按一次完整章节挑战记录配队决策、节点、敌我状态、伤害与结果；只存于浏览器 IndexedDB，不写入游戏存档。", debugLimit: "最多保留", debugRuns: "最近挑战", debugExport: "导出 JSON", debugClear: "清空记录", debugEmpty: "暂无调试记录", debugEnabled: "调试记录已开启", debugDisabled: "调试记录已关闭",
      statusTitle: "当前任务状态", task: "任务", target: "目标", place: "位置", attempts: "尝试", buffs: "增益", fifthTeam: "第五队", idle: "空闲", notGenerated: "未生成",
      notAppeared: "未出现", caught: "已捕获", appearing: "出现中", minutes: "分", moveUp: "上移", moveDown: "下移",
      targetPrompt: "输入编号或名称后，这里会显示对应的宝可梦。", unknownPokemon: "无对应宝可梦", available: "可加入",
      specialLocation: "特殊地点", specialRegionLocked: "地区尚未解锁", specialOutsideScope: "不在所选地区范围", specialConditionLocked: "特殊条件尚未满足",
      managedRoamer: "徘徊神兽，由下方优先级管理", caughtSkip: "已捕获，不会加入", noWildPlace: "当前范围没有可用野外地点", legendaryWild: "神兽/幻兽 · 可作为野外目标",
      kanto: "关都", johto: "城都", hoenn: "丰缘", sinnoh: "神奥", unova: "合众",
      waitingRoamers: "等待神兽出现或固定地点解锁", paused: "暂停", working: "操作中", cumulative: "累计", suggestion: "建议", game: "游戏", data: "数据",
    },
    en: {
      assistant: "PokéCatch Assistant", auto: "Follow game", expand: "Open assistant", collapse: "Close", floatWindow: "Float window", dockWindow: "Dock to top", progress: "Progress",
      pushTab: "Story", collectTab: "Collect", trainingTab: "Training", teamTab: "Team", berriesTab: "Berries", diagnosticsTab: "Diagnostics",
      startPush: "Start story", pauseResume: "Pause / Resume", stop: "Stop",
      pushNote: "Continue from the current region's story frontier; roaming legendaries are not tracked in Story mode.",
      prioritizeDailyRaid: "Prioritize the daily raid",
      prioritizeDailyRaidNote: "Before any automatic task, optimize the raid's two-Pokemon team with the game's own control, choose the first available option for each ally slot, and complete the daily Shiny raid. Team 5 is never changed.",
      dailyRaid: "Daily raid", raidTeamMissing: "Configure two Pokemon on the Raids page first", raidAlliesMissing: "Choose two allies on the Raids page first",
      selectCollection: "Choose a collection task", dexCollection: "Pokédex collection", roamOnly: "Legendary collection", combined: "Pokédex + legendaries",
      collectionNote: "Legendary collection focuses on Legendary Pokémon. Combined prioritizes active roamers, then manual targets and fixed locations.",
      ordinaryTargets: "Ordinary wild targets", region: "Region", currentRegion: "Current region", allRegions: "All unlocked regions", customRegions: "Custom regions",
      autoPushCollection: "Advance story for Pokédex completion",
      autoPushCollectionNote: "When no target is catchable but story-locked targets remain, advance only to the next unlock and rescan immediately.",
      manualPlaceholder: "Priority numbers, e.g. 214,201-H,493-A", apply: "Apply",
      targetNote: "Only uncaught targets with a location in scope are added. Story-locked locations can be unlocked by collection story advancement.",
      collectionQueue: "Current catch queue", queueEmpty: "No automatic target is immediately available", waitingCondition: "Waiting for conditions", moneyFarm: "Farming money while waiting for weather",
      storyLocked: "Story not yet unlocked",
      roamers: "Roaming legendaries", fixedLegendaryHeading: "Fixed locations and other Legendary or Mythical Pokémon", roamerNote: "Uses the selected regions. Active roamers take priority, then available fixed encounters.",
      teamCopy: "Team recommendation and copy", lockTeam: "Lock Team 5; never overwrite it", team: "Team", copy: "Copy", regenerate: "Regenerate team for current target",
      autoBuddyTitle: "Automatic Buddy training", autoBuddy: "Automatically choose and rotate the Buddy",
      autoBuddyScope: "Buddy candidate range", autoBuddyScopeAll: "Team and PC", autoBuddyScopeTeam: "Team only", autoBuddyScopeBox: "PC only (outside team)",
      autoBuddyNote: "Chooses the highest combined-stat Pokemon in the selected range that is below its regional badge level cap, then rotates at the cap or level 100. It never switches during battles or events.",
      buddyNone: "No Buddy selected", buddyComplete: "Every Pokemon in the selected range is at its level cap",
      trainingTitle: "Training candidate pool", trainingEnable: "Enable the pool; automatic teams prefer checked individuals",
      trainingPower: "Minimum combined stat value", trainingPowerHelp: "Combined stat value = the current form's six base stats × Shiny bonus × Underground rank bonus. It filters training candidates; it is not a win rate. Use 0 for no threshold.",
      trainingEligible: "Only show members usable in the current region", trainingSearch: "Search name or Pokédex number",
      trainingSelectVisible: "Select visible", trainingSelectTeam: "Add current team", trainingClear: "Clear", trainingRefresh: "Refresh",
      trainingSave: "Save candidate pool", trainingReset: "Discard draft", trainingNoSave: "Enter the game and create a save before configuring training candidates.",
      trainingDisabled: "The candidate pool is off; automatic teams use every currently available member.",
      duplicateKeepTitle: "Keep duplicates", enableDuplicateKeeps: "Enable all", disableDuplicateKeeps: "Disable all", cancelDuplicateKeeps: "Cancel bulk action",
      duplicateKeepRegions: "Regions to process",
      duplicateKeepNote: "Checks each accessible, repeatable non-Legendary Pokédex number and skips entries already in the requested state. The game shares this setting across an evolution family and between Shiny and regular Pokemon. One duplicate worth about three family levels is retained.",
      duplicateKeepIdle: "Not run", duplicateKeepConfirmOn: "Check every accessible Pokédex number in the selected regions and enable Keep duplicates?", duplicateKeepConfirmOff: "Check every accessible Pokédex number in the selected regions and disable Keep duplicates?",
      berryTitle: "Battle berries (all off by default)", reserve: "Minimum reserve", berryNote: "The number on the right is the reserve. Golden Razz is preferred when both catch berries are enabled.",
      stock: "Stock", pensionBerryTitle: "Day Care berries", pensionBerryButton: "Open Day Care", pensionBerryNote: "These berries show their effects and stock here, but must be used manually in the Day Care. The assistant never auto-consumes them.",
      notifications: "Notifications", sound: "Page sound", desktop: "Desktop notifications", diagnostic: "Diagnostics", noError: "No errors", copyDiagnostic: "Copy diagnostics", logs: "Logs",
      projectLinks: "Project & feedback", author: "Author", githubProject: "View GitHub", reportIssue: "Report an issue", issueNote: "When reporting a problem, copy the diagnostics above first and include them in the GitHub issue.",
      debugMode: "Battle debug mode", debugModeNote: "Off by default. Records team decisions, nodes, combat state, damage and outcomes for one complete chapter attempt. Data stays in browser IndexedDB and never enters the game save.", debugLimit: "Keep at most", debugRuns: "Recent attempts", debugExport: "Export JSON", debugClear: "Clear records", debugEmpty: "No debug records yet", debugEnabled: "Debug recording enabled", debugDisabled: "Debug recording disabled",
      statusTitle: "Current task", task: "Mode", target: "Target", place: "Location", attempts: "Attempts", buffs: "Buffs", fifthTeam: "Team 5", idle: "Idle", notGenerated: "Not generated",
      notAppeared: "Not active", caught: "Caught", appearing: "Active", minutes: "min", moveUp: "Move up", moveDown: "Move down",
      targetPrompt: "Enter a Pokédex number or name to preview the target.", unknownPokemon: "No matching Pokémon", available: "Available",
      specialLocation: "Special location", specialRegionLocked: "Region not unlocked", specialOutsideScope: "Outside selected regions", specialConditionLocked: "Special condition not met",
      managedRoamer: "Roaming legendary; managed by the priority list below", caughtSkip: "Already caught; will not be added", noWildPlace: "No available wild location in the current scope", legendaryWild: "Legendary/Mythical · available as a wild target",
      kanto: "Kanto", johto: "Johto", hoenn: "Hoenn", sinnoh: "Sinnoh", unova: "Unova",
      waitingRoamers: "Waiting for active roamers or open Legendary locations", paused: "Paused", working: "Working", cumulative: "Cumulative", suggestion: "Suggestion", game: "Game", data: "Data",
    },
  };

  const DEFAULT_SETTINGS = {
    collapsed: true,
    floating: false,
    floatPosition: null,
    floatSize: null,
    language: "auto",
    activeTab: "push",
    lockTeam5: false,
    autoBuddy: false,
    buddyScope: "all",
    prioritizeDailyRaid: true,
    candidatePool: { enabled: false, minPower: 500, uids: [] },
    desktopNotifications: false,
    soundNotifications: true,
    debugBattle: false,
    debugLimit: 20,
    regionScope: "current",
    customRegions: ["kanto", "johto"],
    autoPushForCollection: true,
    duplicateKeepRegions: ["kanto", "johto", "hoenn", "sinnoh", "unova"],
    manualTargets: [],
    roamingPriority: [...ROAMING_LEGENDARIES],
    berries: Object.fromEntries(Object.keys(BERRIES).map((key) => [key, { enabled: false, reserve: 0 }])),
  };

  const runtime = {
    mode: "idle",
    paused: false,
    busy: false,
    target: null,
    targetPlan: null,
    expectedChapter: null,
    pushRegion: null,
    teamStatus: "未生成",
    teamPlan: null,
    userTeamOverride: false,
    lastTeamSignature: "",
    lastTeamCheckAt: 0,
    lastBerryCheckAt: 0,
    lastBuddyCheckAt: 0,
    buddyStatus: "",
    lastRoamTries: {},
    lastDeaths: {},
    failureTeams: new Map(),
    observedEnemies: new Map(),
    lastOpponent: new Map(),
    deathSeries: new Map(),
    attempts: 0,
    logs: [],
    error: null,
    timer: null,
    chapterReset: null,
    specialEntryBlocks: new Map(),
    lastSpecialTries: 0,
    lastAutomatedActionAt: 0,
    floatResizeBound: false,
    floatSizeObserver: null,
    duplicateKeep: null,
    collectionQueue: [],
    collectionQueueSignature: "",
    waitingPlan: null,
    dailyRaidDate: null,
    dailyRaidCompletedDate: null,
    dailyRaidActiveRegion: null,
    dailyRaidRetryAt: 0,
    debugRun: null,
    debugRecent: [],
    debugObserver: null,
    debugFlushTimer: null,
  };

  let settings = loadSettings();
  let candidatePoolDraft = null;

  function language() {
    if (settings.language === "zh" || settings.language === "en") return settings.language;
    return String(localStorage.getItem("pokecatch.lang") || document.documentElement.lang || "zh-Hans").startsWith("zh") ? "zh" : "en";
  }

  function t(key) {
    return TEXT[language()]?.[key] || TEXT.zh[key] || key;
  }

  function berryLabel(info) {
    return info?.[language()] || info?.zh || "";
  }

  function pensionBerryLabel(info) {
    return info?.[language()] || info?.zh || "";
  }

  function pensionBerryEffect(info) {
    return language() === "en" ? info?.effectEn : info?.effectZh;
  }

  function mergeDeep(base, value) {
    const output = { ...base };
    for (const [key, item] of Object.entries(value || {})) {
      output[key] = item && typeof item === "object" && !Array.isArray(item)
        ? mergeDeep(base[key] || {}, item)
        : item;
    }
    return output;
  }

  function loadSettings() {
    try {
      const loaded = mergeDeep(DEFAULT_SETTINGS, JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}"));
      loaded.candidatePool = normalizeCandidatePool(loaded.candidatePool);
      if (!["all", "team", "box"].includes(loaded.buddyScope)) loaded.buddyScope = "all";
      if (![20, 50, 100].includes(Number(loaded.debugLimit))) loaded.debugLimit = 20;
      return loaded;
    } catch {
      return structuredClone(DEFAULT_SETTINGS);
    }
  }

  function saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  function readSave() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) throw new Error("找不到游戏存档");
    const save = JSON.parse(raw);
    const validTeamSets = save?.teamSets == null || Array.isArray(save.teamSets.list);
    if (!save?.adv || !Array.isArray(save.mons) || !save.dex || !Array.isArray(save.team) || !validTeamSets) {
      throw new Error("游戏存档结构不兼容");
    }
    return save;
  }

  function gameBuild() {
    const script = [...document.scripts].map((item) => item.src).find((src) => /\/app\.[^.]+\.js/.test(src));
    return script?.match(/\/app\.([^.]+)\.js/)?.[1] || "unknown";
  }

  function validateCompatibility() {
    const build = gameBuild();
    const selectors = ["#side-chapter", "#timeline", "#team-sets", "#team-slots", "#bag-panel"];
    const missing = selectors.filter((selector) => !document.querySelector(selector));
    const verified = COMPATIBLE_APP_BUILDS.has(build);
    return {
      ok: missing.length === 0,
      verified,
      build,
      expected: [...COMPATIBLE_APP_BUILDS].join(", "),
      missing,
    };
  }

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const jitter = (min = 350, max = 750) => sleep(Math.round(min + Math.random() * (max - min)));

  async function pacedAction(action, {
    beforeMin = 700,
    beforeMax = 1_700,
    afterMin = 450,
    afterMax = 1_100,
  } = {}) {
    const targetGap = Math.round(beforeMin + Math.random() * (beforeMax - beforeMin));
    const elapsed = Date.now() - runtime.lastAutomatedActionAt;
    await sleep(runtime.lastAutomatedActionAt ? Math.max(0, targetGap - elapsed) : targetGap);
    await action();
    runtime.lastAutomatedActionAt = Date.now();
    await jitter(afterMin, afterMax);
  }

  async function pacedClick(element, label, pacing) {
    if (!element) throw new Error(`找不到${label}`);
    await pacedAction(() => element.click(), pacing);
  }

  async function waitFor(getter, { timeout = 6_000, interval = 80, label = "页面状态" } = {}) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const value = getter();
      if (value) return value;
      await sleep(interval);
    }
    throw new Error(`等待${label}超时`);
  }

  async function exclusive(label, action) {
    if (runtime.busy) return false;
    runtime.busy = true;
    renderStatus();
    try {
      await action();
      return true;
    } catch (error) {
      diagnostic(label, error);
      return false;
    } finally {
      runtime.busy = false;
      renderStatus();
    }
  }

  function log(message, level = "info") {
    const item = { at: Date.now(), message, level };
    runtime.logs.unshift(item);
    runtime.logs.length = Math.min(runtime.logs.length, 80);
    console[level === "error" ? "error" : "log"](`[PCA] ${message}`);
    renderLog();
  }

  function diagnostic(phase, error, extra = {}) {
    let save = null;
    try { save = readSave(); } catch { /* ignore */ }
    runtime.error = {
      at: new Date().toISOString(),
      phase,
      target: runtime.target,
      currentChapter: save?.adv?.chapter,
      targetChapter: runtime.targetPlan?.chapter ?? runtime.expectedChapter,
      expected: extra.expected || "正常界面操作成功",
      observed: extra.observed || String(error?.message || error),
      retryCount: extra.retryCount || 0,
      gameVersion: gameBuild(),
      safeStopped: true,
      suggestion: extra.suggestion || "暂停后重新打开相应页面；若游戏刚更新，请更新助手数据。",
    };
    runtime.paused = true;
    log(`${phase}：${runtime.error.observed}`, "error");
    notifyUser("PokeCatch 助手已安全暂停", `${phase}：${runtime.error.observed}`);
    renderStatus();
  }

  const DEBUG_DB_NAME = "pokecatch-assistant-debug";
  const DEBUG_STORE = "chapter-runs";
  let debugDbPromise = null;

  function debugDb() {
    if (!debugDbPromise) {
      debugDbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DEBUG_DB_NAME, 1);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(DEBUG_STORE)) {
            const store = db.createObjectStore(DEBUG_STORE, { keyPath: "id" });
            store.createIndex("startedAt", "startedAt");
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error("IndexedDB unavailable"));
      });
    }
    return debugDbPromise;
  }

  function debugRequest(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("IndexedDB request failed"));
    });
  }

  async function readDebugRuns() {
    const db = await debugDb();
    const tx = db.transaction(DEBUG_STORE, "readonly");
    const rows = await debugRequest(tx.objectStore(DEBUG_STORE).getAll());
    return rows.sort((a, b) => b.startedAt - a.startedAt);
  }

  async function trimDebugRuns() {
    const rows = await readDebugRuns();
    const stale = rows.slice(Number(settings.debugLimit) || 20);
    if (!stale.length) return;
    const db = await debugDb();
    const tx = db.transaction(DEBUG_STORE, "readwrite");
    for (const row of stale) tx.objectStore(DEBUG_STORE).delete(row.id);
  }

  async function persistDebugRun(run = runtime.debugRun) {
    if (!run) return;
    const db = await debugDb();
    const tx = db.transaction(DEBUG_STORE, "readwrite");
    tx.objectStore(DEBUG_STORE).put(structuredClone(run));
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error || new Error("IndexedDB write failed"));
      tx.onabort = () => reject(tx.error || new Error("IndexedDB write aborted"));
    });
    await trimDebugRuns();
    await refreshDebugRecent();
  }

  function scheduleDebugFlush() {
    clearTimeout(runtime.debugFlushTimer);
    runtime.debugFlushTimer = setTimeout(() => {
      runtime.debugFlushTimer = null;
      persistDebugRun().catch((error) => log(`调试记录保存失败：${error.message}`, "error"));
    }, 400);
  }

  function debugTeamSnapshot(save) {
    return (save.teamSets?.list?.[4] || save.team || []).map((uid) => {
      const mon = save.mons.find((candidate) => candidate.uid === uid);
      return mon && { uid: String(mon.uid), id: Number(mon.id), level: Number(mon.level), shiny: !!mon.shiny, rank: Number(mon.rank || 0) };
    }).filter(Boolean);
  }

  function debugBattleSnapshot(save) {
    const battle = save.adv?.battle;
    const brief = (entry) => entry && ({
      id: Number(entry.id ?? entry.species ?? entry),
      level: Number(entry.level ?? entry.lv ?? 0) || null,
      hp: Number(entry.hp ?? entry.curHp ?? entry.currentHp ?? 0) || null,
      maxHp: Number(entry.maxHp ?? entry.max ?? 0) || null,
      status: entry.status || null,
    });
    return {
      at: Date.now(),
      chapter: Number(save.adv.chapter),
      node: Number(save.adv.node || 0),
      deaths: Number(save.adv.deaths || 0),
      kind: battle?.kind || battle?.type || null,
      enemies: [...(battle?.enemies || []), ...(battle?.foes || [])].map(brief).filter(Boolean),
      allies: (battle?.allies || battle?.team || []).map(brief).filter(Boolean),
      log: document.querySelector("#battle-log")?.textContent?.trim().slice(0, 300) || "",
    };
  }

  function appendDebugEvent(type, data = {}) {
    if (!settings.debugBattle || !runtime.debugRun) return;
    runtime.debugRun.events.push({ at: Date.now(), type, ...data });
    if (runtime.debugRun.events.length > 5_000) runtime.debugRun.events.splice(0, runtime.debugRun.events.length - 5_000);
    scheduleDebugFlush();
  }

  function startDebugRun(save, reason = "start") {
    const item = chapter(save.adv.chapter);
    runtime.debugRun = {
      id: `${Date.now()}-${save.adv.chapter}-${Math.random().toString(36).slice(2, 8)}`,
      startedAt: Date.now(),
      endedAt: null,
      chapter: Number(save.adv.chapter),
      chapterName: item?.name || String(save.adv.chapter),
      gameBuild: gameBuild(),
      dataBuild: DATA.appBuild,
      reason,
      result: "running",
      startNode: Number(save.adv.node || 0),
      lastNode: Number(save.adv.node || 0),
      startDeaths: Number(save.adv.deaths || 0),
      lastDeaths: Number(save.adv.deaths || 0),
      badgesAtStart: [...(save.adv.badges || [])],
      team: debugTeamSnapshot(save),
      decisions: [],
      events: [{ at: Date.now(), type: "challenge-start", reason, state: debugBattleSnapshot(save) }],
    };
    scheduleDebugFlush();
  }

  async function finishDebugRun(result, extra = {}) {
    const run = runtime.debugRun;
    if (!run) return;
    clearTimeout(runtime.debugFlushTimer);
    runtime.debugFlushTimer = null;
    run.endedAt = Date.now();
    run.result = result;
    run.events.push({ at: Date.now(), type: "challenge-end", result, ...extra });
    runtime.debugRun = null;
    await persistDebugRun(run);
  }

  async function captureDebugState(save) {
    if (!settings.debugBattle) {
      if (runtime.debugRun) await finishDebugRun("debug-disabled");
      return;
    }
    if (!runtime.debugRun) startDebugRun(save);
    const run = runtime.debugRun;
    if (Number(save.adv.chapter) !== run.chapter) {
      await finishDebugRun("chapter-changed", { nextChapter: Number(save.adv.chapter) });
      startDebugRun(save, "chapter-changed");
      return;
    }
    const node = Number(save.adv.node || 0);
    const deaths = Number(save.adv.deaths || 0);
    const badge = chapter(run.chapter)?.boss?.badge;
    if (badge && !run.badgesAtStart.includes(badge) && save.adv.badges?.includes(badge)) {
      await finishDebugRun("badge-earned", { badge, state: debugBattleSnapshot(save) });
      return;
    }
    if (node < run.lastNode || deaths > run.lastDeaths) {
      await finishDebugRun(deaths > run.lastDeaths ? "team-defeated" : "chapter-restarted", { state: debugBattleSnapshot(save) });
      startDebugRun(save, "retry");
      return;
    }
    const snapshot = debugBattleSnapshot(save);
    const signature = JSON.stringify([snapshot.node, snapshot.kind, snapshot.enemies, snapshot.allies, snapshot.log]);
    if (signature !== run.lastSnapshot) {
      run.events.push({ at: Date.now(), type: "state", state: snapshot });
      run.lastSnapshot = signature;
      scheduleDebugFlush();
    }
    run.lastNode = node;
    run.lastDeaths = deaths;
  }

  function recordDebugDecision(plan, save, context) {
    if (!settings.debugBattle || !runtime.debugRun || !plan) return;
    runtime.debugRun.decisions.push({
      at: Date.now(),
      context,
      team: plan.details,
      signature: plan.signature,
      simulation: plan.simulation ? {
        clear: plan.simulation.clear,
        reachedLeader: plan.simulation.reachedLeader,
        completed: plan.simulation.completed,
        total: plan.simulation.total,
        remainingHp: plan.simulation.remainingHp,
        failedAt: plan.simulation.failedAt,
      } : null,
      chapter: Number(save?.adv?.chapter),
    });
    scheduleDebugFlush();
  }

  async function refreshDebugRecent() {
    try {
      runtime.debugRecent = (await readDebugRuns()).slice(0, 5).map((run) => ({ id: run.id, chapterName: run.chapterName, startedAt: run.startedAt, result: run.result }));
    } catch {
      runtime.debugRecent = [];
    }
    const root = document.querySelector("#pca-debug-runs");
    if (root) root.innerHTML = runtime.debugRecent.length
      ? runtime.debugRecent.map((run) => `<div>${new Date(run.startedAt).toLocaleString()} · ${escapeHtml(run.chapterName)} · ${escapeHtml(run.result)}</div>`).join("")
      : t("debugEmpty");
  }

  async function exportDebugRuns() {
    const rows = await readDebugRuns();
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), version: VERSION, runs: rows }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = Object.assign(document.createElement("a"), { href: url, download: `pokecatch-debug-${new Date().toISOString().replace(/[:.]/g, "-")}.json` });
    link.dispatchEvent(new MouseEvent("click"));
    setTimeout(() => URL.revokeObjectURL(url), 1_000);
  }

  async function clearDebugRuns() {
    const db = await debugDb();
    const tx = db.transaction(DEBUG_STORE, "readwrite");
    tx.objectStore(DEBUG_STORE).clear();
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error || new Error("IndexedDB clear failed"));
      tx.onabort = () => reject(tx.error || new Error("IndexedDB clear aborted"));
    });
    runtime.debugRecent = [];
    await refreshDebugRecent();
  }

  function observeDebugBattle() {
    runtime.debugObserver?.disconnect();
    const arena = document.querySelector("#arena");
    if (!arena) return;
    runtime.debugObserver = new MutationObserver((mutations) => {
      if (!settings.debugBattle || !runtime.debugRun) return;
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes || []) {
          if (node.nodeType !== 1) continue;
          const damageNodes = node.matches?.(".dmg") ? [node] : [...(node.querySelectorAll?.(".dmg") || [])];
          for (const damage of damageNodes) appendDebugEvent("damage", { text: damage.textContent?.trim().slice(0, 40) || "", className: damage.className });
        }
        if (mutation.target?.closest?.("#battle-log")) appendDebugEvent("battle-log", { text: document.querySelector("#battle-log")?.textContent?.trim().slice(0, 300) || "" });
      }
    });
    runtime.debugObserver.observe(arena, { subtree: true, childList: true, characterData: true });
  }

  function notifyUser(title, body) {
    if (settings.soundNotifications) beep();
    if (settings.desktopNotifications && typeof GM_notification === "function") {
      GM_notification({ title, text: body, timeout: 8_000 });
    }
  }

  function beep() {
    try {
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = 740;
      gain.gain.value = 0.035;
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.16);
    } catch { /* browser may block audio */ }
  }

  function species(id) {
    return DATA.species[String(id)] || DATA.species[id] || null;
  }

  function speciesDisplayNumber(id) {
    return species(id)?.d || String(id).padStart(3, "0");
  }

  function chapter(index) {
    return DATA.chapters[index] || null;
  }

  function currentRegion(save) {
    return chapter(save.adv.chapter)?.region || chapter(save.adv.unlocked)?.region || "kanto";
  }

  function isCaught(save, id) {
    return Number(save.dex?.[id]?.caught || 0) > 0;
  }

  function activeBuffAt(save, family, now = Number(save?.lastTick) || Date.now()) {
    const buff = save?.buffs?.[family];
    return buff?.until > now ? buff : null;
  }

  function baseStatTotal(id) {
    return (species(id)?.s || []).reduce((sum, value) => sum + Number(value || 0), 0);
  }

  function undergroundRank(mon) {
    return Math.min(DATA.rankMax, Math.max(0, Math.floor(Number(mon?.rank) || 0)));
  }

  function combinedStatMultiplier(mon) {
    return (mon?.shiny ? 1 + DATA.shinyStatBonus : 1) * DATA.rankStatMultiplier ** undergroundRank(mon);
  }

  function combinedStatValue(mon) {
    return Number((baseStatTotal(mon.id) * combinedStatMultiplier(mon)).toFixed(8));
  }

  function combinedStatNote(mon) {
    const parts = [language() === "en" ? `base stats ${baseStatTotal(mon.id)}` : `六项种族值 ${baseStatTotal(mon.id)}`];
    if (mon.shiny) parts.push(language() === "en" ? `Shiny +${Math.round(DATA.shinyStatBonus * 100)}%` : `异色 +${Math.round(DATA.shinyStatBonus * 100)}%`);
    if (undergroundRank(mon)) parts.push(language() === "en" ? `Underground rank ${undergroundRank(mon)}` : `地下强化 ${undergroundRank(mon)} 档`);
    return parts.join(" · ");
  }

  function buddyLevelCap(save, mon) {
    const maxLevel = DATA.battle?.maxLevel ?? 100;
    const region = save?.link ? pokemonHomeRegion(mon) : "kanto";
    const nextGym = DATA.chapters.find((item) => (
      item.region === region
      && item.index >= Number(save?.adv?.unlocked || 0)
      && item.gym
      && !(item.champion && item.boss?.badge && save?.adv?.badges?.includes(item.boss.badge))
    ));
    return Math.min(maxLevel, Number(nextGym?.levelCap || DATA.battle?.leagueDoneCap || maxLevel));
  }

  function buddyTrainingCandidates(save, scope = settings.buddyScope) {
    const teamUids = new Set((save?.team || []).map(String));
    return availableTeamCandidates(save)
      .filter((mon) => scope === "all" || (scope === "team") === teamUids.has(String(mon.uid)))
      .map((mon) => ({ mon, cap: buddyLevelCap(save, mon), power: combinedStatValue(mon) }))
      .filter(({ mon, cap }) => mon.level < cap && mon.level < (DATA.battle?.maxLevel ?? 100))
      .sort((a, b) => (
        b.power - a.power
        || Number(String(b.mon.uid) === String(save?.buddy?.uid)) - Number(String(a.mon.uid) === String(save?.buddy?.uid))
        || b.mon.level - a.mon.level
        || String(a.mon.uid).localeCompare(String(b.mon.uid))
      ));
  }

  function bestBuddyCandidate(save, scope = settings.buddyScope) {
    return buddyTrainingCandidates(save, scope)[0] || null;
  }

  function buddyStatusText(save) {
    const current = (save?.mons || []).find((mon) => String(mon.uid) === String(save?.buddy?.uid));
    if (!current) return t("buddyNone");
    const cap = buddyLevelCap(save, current);
    return `${species(current.id)?.n || current.id} · Lv.${current.level}/${cap} · ${language() === "en" ? "combined" : "综合能力"} ${combinedStatValue(current)}`;
  }

  function normalizeCandidatePool(value) {
    if (!value || typeof value !== "object") value = {};
    const numeric = Number(value.minPower ?? value.minBst ?? 500);
    return {
      enabled: value.enabled === true,
      minPower: Number.isFinite(numeric) ? Math.max(0, Math.min(2_000, Math.trunc(numeric))) : 500,
      uids: [...new Set((Array.isArray(value.uids) ? value.uids : []).map(String).filter(Boolean))],
    };
  }

  function typeEffect(attackType, defenderTypes) {
    const row = DATA.typeChart[attackType] || {};
    return (defenderTypes || []).reduce((value, type) => value * (row[type] ?? 1), 1);
  }

  function learnedMoves(meta, level, damagingOnly = true) {
    return (meta?.l || [])
      .filter(([learnLevel, key]) => learnLevel <= level && DATA.moves[key] && (!damagingOnly || DATA.moves[key][1] > 0))
      .map(([, key]) => ({ key, type: DATA.moves[key][0], power: DATA.moves[key][1], accuracy: DATA.moves[key][2], category: DATA.moves[key][3] }));
  }

  function battleStats(mon, speciesId = mon.id, level = mon.level) {
    const meta = species(speciesId);
    if (!meta) return null;
    const normalizedLevel = Math.max(1, Number(level) || 1);
    const multiplier = combinedStatMultiplier(mon);
    const stat = (index) => Math.floor((Math.floor(2 * meta.s[index] * normalizedLevel / 100) + 5) * multiplier);
    const baseHp = Math.floor((Math.floor(2 * meta.s[0] * normalizedLevel / 100) + normalizedLevel + 10) * multiplier);
    const hpScale = Math.min(DATA.battle?.hpLevelMax ?? 2.5, 1 + (DATA.battle?.hpLevelScale ?? 1.5) * normalizedLevel / 100);
    return {
      hp: Math.floor(baseHp * hpScale * (DATA.battle?.hpBoost ?? 1.1)),
      atk: stat(1),
      def: stat(2),
      spa: stat(3),
      spd: stat(4),
      spe: stat(5),
    };
  }

  function effectiveAccuracy(accuracy) {
    const chance = Math.max(0, Math.min(1, Number(accuracy || 100) / 100));
    return chance >= 1 ? 1 : 1 / (2 - chance);
  }

  function deterministicDamage(attacker, defender, move, options) {
    const enemy = Boolean(options?.enemy);
    const attackMeta = species(attacker.id);
    const defenderMeta = species(defender.id);
    const attackStats = battleStats(attacker);
    const defenderStats = battleStats(defender);
    if (!attackMeta || !defenderMeta || !attackStats || !defenderStats || move.power <= 0) return 0;
    const physical = DATA.moves[move.key]?.[3] === "phys";
    const attackPenalty = physical && attacker.status === "burn" || !physical && attacker.status === "poison" ? 0.75 : 1;
    const defensePenalty = physical && defender.status === "sleep" || !physical && defender.status === "freeze" ? 0.75 : 1;
    const attack = (physical ? attackStats.atk : attackStats.spa) * attackPenalty;
    const defense = Math.max(1, (physical ? defenderStats.def : defenderStats.spd) * defensePenalty);
    const stab = attackMeta.t.includes(move.type) ? 1.5 : 1;
    const effectiveness = typeEffect(move.type, defenderMeta.t);
    if (effectiveness === 0) return 0;
    const base = (2 * attacker.level / 5 + 2) * move.power * attack / defense / 50 + 2;
    const levelGap = (DATA.battle?.levelGap ?? 1.06) ** (attacker.level - defender.level);
    const roll = DATA.battle?.damageRoll ?? 0.85;
    const enemyMultiplier = Number(options?.damageMultiplier)
      || (enemy ? (DATA.battle?.gymDamage ?? 1.3) : 1);
    return Math.max(1, Math.floor(base * stab * effectiveness * levelGap * roll * enemyMultiplier))
      * effectiveAccuracy(move.accuracy);
  }

  function bestDamageMove(attacker, defender, options) {
    return learnedMoves(species(attacker.id), attacker.level)
      .map((move) => ({ move, damage: deterministicDamage(attacker, defender, move, options) }))
      .sort((a, b) => b.damage - a.damage || b.move.accuracy - a.move.accuracy || b.move.power - a.move.power)[0]
      || { move: null, damage: 1 };
  }

  function evolutionAvailable(save, option, targetLevel) {
    if (option.level != null) return targetLevel >= option.level;
    if (option.item) return Number(save?.items?.[option.item] || 0) > 0;
    return false;
  }

  function projectedSpeciesId(save, mon, targetLevel) {
    let id = Number(mon.id);
    const visited = new Set([id]);
    for (let depth = 0; depth < 4; depth += 1) {
      const options = (DATA.evolutions?.[id] || [])
        .filter((option) => evolutionAvailable(save, option, targetLevel))
        .filter((option) => species(option.to) && !visited.has(Number(option.to)))
        .sort((a, b) => baseStatTotal(b.to) - baseStatTotal(a.to));
      if (!options.length) break;
      id = Number(options[0].to);
      visited.add(id);
    }
    return id;
  }

  function enemyProfiles(enemyTargets, fallbackLevel = 1) {
    return enemyTargets.map((target) => {
      const id = Number(typeof target === "object" ? target.id : target);
      const meta = species(id);
      if (!meta) return null;
      return {
        id,
        level: Math.max(1, Number(typeof target === "object" ? target.level : fallbackLevel) || fallbackLevel),
        meta,
      };
    }).filter(Boolean);
  }

  function duelEstimate(mon, enemy) {
    const foe = { id: enemy.id, level: enemy.level, shiny: false, rank: 0 };
    const allyStats = battleStats(mon);
    const enemyStats = battleStats(foe);
    const outgoing = bestDamageMove(mon, foe).damage;
    const incoming = bestDamageMove(foe, mon, { enemy: true }).damage;
    const turnsToWin = Math.ceil(enemyStats.hp / Math.max(1, outgoing));
    const turnsToLose = Math.ceil(allyStats.hp / Math.max(1, incoming));
    const movesFirst = allyStats.spe >= enemyStats.spe;
    const clears = turnsToWin < turnsToLose || (turnsToWin === turnsToLose && movesFirst);
    const tempo = turnsToLose - turnsToWin + (movesFirst ? 0.25 : 0);
    return { clears, tempo, turnsToWin, turnsToLose, outgoing, incoming };
  }

  function battleProfile(mon, enemies) {
    const duels = enemies.map((enemy) => duelEstimate(mon, enemy));
    if (!duels.length) return { score: 0, clears: 0, worstTempo: 0, duels: [] };
    const clears = duels.filter((duel) => duel.clears).length;
    const averageTempo = duels.reduce((sum, duel) => sum + duel.tempo, 0) / duels.length;
    const worstTempo = Math.min(...duels.map((duel) => duel.tempo));
    return { score: clears * 70 + averageTempo * 18 + worstTempo * 8, clears, worstTempo, duels };
  }

  function scaledBossTeam(chapterIndex) {
    const item = chapter(chapterIndex);
    const raw = item?.boss?.team || [];
    if (!raw.length) return [];
    const rawAce = Math.max(...raw.map(([, level]) => Number(level) || 1));
    const ace = Number(item.boss.ace ?? item.ace) + Number(item.boss.aceOffset || 0);
    return raw.map(([id, level]) => ({
      id: Number(id),
      level: ace > 0 ? Math.round(Number(level) * ace / rawAce) : Number(level),
    }));
  }

  function chapterGymTrainerCount(chapterIndex) {
    const item = chapter(chapterIndex);
    if (!item?.boss?.badge || item.boss.champion || item.league) return 0;
    const ordinal = DATA.chapters.filter((candidate) => (
      candidate.region === item.region && candidate.index <= chapterIndex && candidate.boss?.badge
    )).length;
    const counts = DATA.battle?.gymTrainers?.counts || [1, 2, 2, 3];
    return counts[Math.min(Math.max(ordinal, 1), counts.length) - 1] || 0;
  }

  function routeThreats(save, item, route) {
    const at = Number(save?.lastTick) || Date.now();
    const phase = currentDaytimePhase(save, item.index);
    const weather = currentWeatherForRoute(save, item, route, at, phase);
    const weights = routeWeights(route, phase, weather);
    const level = Math.max(1, Number(route.levelBand?.[1] || item.ace || 1));
    const explicit = (route.species || []).map((id) => Number(id)).filter((id) => species(id));
    const ids = explicit.length ? explicit.map((id) => projectEnemySpeciesId(id, level)) : Object.entries(weights)
      .filter(([id, weight]) => species(Number(id)) && Number(weight) > 0)
      .sort((a, b) => Number(b[1]) - Number(a[1]) || Number(a[0]) - Number(b[0]))
      .slice(0, 6)
      .map(([id]) => Number(id));
    const pool = ids.map((id) => ({ id, level }));
    if (pool.length) return pool;
    return scaledBossTeam(item.index).slice(0, 3).map((foe) => ({ ...foe, level: Math.min(foe.level, level) }));
  }

  function projectEnemySpeciesId(speciesId, level) {
    let id = Number(speciesId);
    const visited = new Set([id]);
    for (let depth = 0; depth < 4; depth += 1) {
      const options = (DATA.evolutions?.[id] || []).filter((option) => (
        option.level != null ? level >= option.level : level >= (DATA.battle?.trainerItemEvolutionLevel ?? 40)
      )).filter((option) => species(option.to) && !visited.has(Number(option.to)));
      if (!options.length) break;
      id = Number(options.sort((a, b) => baseStatTotal(b.to) - baseStatTotal(a.to))[0].to);
      visited.add(id);
    }
    return id;
  }

  function scaledFixedTrainerTeam(item, step) {
    const raw = step.team || [];
    if (!raw.length) return [];
    if (!step.scale || !item.ace) return raw.map(([id, level]) => ({ id: Number(id), level: Number(level) }));
    const rawAce = Math.max(...raw.map(([, level]) => Number(level) || 1));
    const precedingRoute = [...(item.steps || [])].slice(0, step.stepIndex).reverse().find((candidate) => candidate.kind === "route");
    const routeLevel = Number(precedingRoute?.levelBand?.[1] || item.ace);
    const target = step.below == null ? routeLevel : Math.min(routeLevel, Number(item.ace) - Number(step.below));
    return raw.map(([id, level]) => ({ id: Number(id), level: Math.round(Number(level) * target / rawAce) }));
  }

  function savedChapterBattleSequence(save, chapterIndex) {
    if (Number(save?.adv?.chapter) !== Number(chapterIndex) || !Array.isArray(save?.adv?.nodes)) return [];
    const item = chapter(chapterIndex);
    const sequence = [];
    for (const [nodeIndex, node] of save.adv.nodes.entries()) {
      if (node?.type === "heal") {
        sequence.push({ kind: "heal", stepIndex: nodeIndex, name: node.name || "Heal" });
        continue;
      }
      if (node?.type === "wild" || node?.type === "static") {
        if (species(Number(node.id))) sequence.push({
          kind: node.type,
          stepIndex: nodeIndex,
          name: node.name,
          enemies: [{ id: Number(node.id), level: Math.max(1, Number(node.level) || Number(item?.ace) || 1) }],
          boss: node.type === "static" && !!(node.raid || node.zone),
          damageMultiplier: DATA.battle?.enemyDamage?.[node.type] ?? (node.type === "wild" ? 0.85 : 1),
        });
        continue;
      }
      if (node?.type === "trainer") {
        const explicit = (node.team || []).map((entry) => Array.isArray(entry) ? { id: Number(entry[0]), level: Number(entry[1]) } : null).filter((entry) => species(entry?.id));
        const pool = (node.pool || []).map((entry) => typeof entry === "object" ? entry : { id: entry, level: item?.ace }).filter((entry) => species(Number(entry?.id)));
        const size = Math.max(1, Number(node.size) || explicit.length || Math.min(3, pool.length) || 1);
        const enemies = explicit.length ? explicit : Array.from({ length: size }, (_, index) => {
          const source = pool[index % Math.max(1, pool.length)];
          const level = Math.max(1, Number(source?.level) || Number(item?.ace) || 1);
          return { id: projectEnemySpeciesId(Number(source?.id), level), level };
        }).filter((entry) => species(entry.id));
        if (enemies.length) sequence.push({
          kind: node.gymTrainer ? "gym-trainer" : "trainer",
          stepIndex: nodeIndex,
          name: node.name || node.trainer,
          enemies,
          slots: node.double || enemies.length === 2 ? 2 : 1,
          damageMultiplier: node.gymTrainer ? DATA.battle?.gymTrainers?.damage ?? 0.8 : DATA.battle?.enemyDamage?.trainer ?? 0.9,
        });
        continue;
      }
      if (node?.type === "gym") {
        const enemies = scaledBossTeam(chapterIndex);
        if (enemies.length) sequence.push({
          kind: "leader",
          stepIndex: nodeIndex,
          name: node.gym?.leader || item?.boss?.name || node.name,
          enemies,
          slots: node.gym?.double || item?.boss?.double ? 2 : 1,
          damageMultiplier: (DATA.battle?.gymDamage ?? 1.3) * Number(node.gym?.power || item?.boss?.power || 1),
          hpMultiplier: (DATA.battle?.gymHpMult ?? 1.3) * Number(node.gym?.power || item?.boss?.power || 1) * Math.max(1, 6 / enemies.length) ** (DATA.battle?.gymTeamExp ?? 0.7),
        });
      }
    }
    return sequence;
  }

  function chapterBattleSequence(save, chapterIndex) {
    const item = chapter(chapterIndex);
    if (!item) return [];
    const saved = savedChapterBattleSequence(save, chapterIndex);
    if (saved.length) return saved;
    const sequence = [];
    for (const step of item.steps || []) {
      if (step.kind === "heal") {
        sequence.push({ kind: "heal", stepIndex: step.stepIndex, name: step.name || "Heal" });
        continue;
      }
      if (step.kind === "route") {
        const threats = routeThreats(save, item, step);
        const wildCount = Number(step.wild || 0);
        const trainerCount = Number(step.trainers || 0);
        const total = wildCount + trainerCount;
        let wildIndex = 0;
        let trainerIndex = 0;
        for (let index = 0; index < total; index += 1) {
          const trainersDue = Math.floor((index + 1) * trainerCount / Math.max(1, total));
          const kind = trainerIndex < trainersDue ? "trainer" : "wild";
          const threatIndex = kind === "trainer" ? trainerIndex + 1 : wildIndex;
          if (threats.length) sequence.push({
            kind,
            stepIndex: step.stepIndex,
            name: step.name,
            enemies: Array.from({ length: kind === "trainer" ? 1 + trainerIndex % 3 : 1 }, (_, offset) => threats[(threatIndex + offset) % threats.length]),
            slots: kind === "trainer" && trainerIndex % 2 === 0 && 1 + trainerIndex % 3 >= 2 ? 2 : 1,
            damageMultiplier: DATA.battle?.enemyDamage?.[kind] ?? (kind === "trainer" ? 0.9 : 0.85),
          });
          if (kind === "trainer") trainerIndex += 1;
          else wildIndex += 1;
        }
        continue;
      }
      if (step.kind === "trainer") {
        const enemies = scaledFixedTrainerTeam(item, step);
        if (enemies.length) sequence.push({ kind: "trainer", stepIndex: step.stepIndex, name: step.name, enemies, slots: step.double ? 2 : 1, damageMultiplier: DATA.battle?.enemyDamage?.trainer ?? 0.9 });
        continue;
      }
      if (step.kind === "static" && step.id) {
        sequence.push({ kind: "static", stepIndex: step.stepIndex, name: step.name, enemies: [{ id: Number(step.id), level: Number(step.level || item.ace || 1) }], boss: true, damageMultiplier: DATA.battle?.enemyDamage?.static ?? 1, hpMultiplier: 1 + (DATA.battle?.enemyHpPerAlly ?? 0.7) * 5 });
        continue;
      }
      if (step.kind === "gym") {
        const leader = scaledBossTeam(chapterIndex);
        const below = DATA.battle?.gymTrainers?.below || [4, 2, 2];
        const count = chapterGymTrainerCount(chapterIndex);
        for (let index = 0; index < count; index += 1) {
          const source = leader[index % Math.max(1, leader.length)];
          if (source) sequence.push({ kind: "gym-trainer", stepIndex: step.stepIndex, name: step.name, enemies: [{ id: source.id, level: Math.max(1, Number(item.ace) - below[Math.min(index, below.length - 1)]) }], damageMultiplier: DATA.battle?.gymTrainers?.damage ?? 0.8 });
        }
        if (leader.length) {
          const power = Number(step.power || item.boss?.power || 1);
          sequence.push({
            kind: "leader",
            stepIndex: step.stepIndex,
            name: item.boss?.name || step.name,
            enemies: leader,
            slots: step.double || item.boss?.double ? 2 : 1,
            damageMultiplier: (DATA.battle?.gymDamage ?? 1.3) * power,
            hpMultiplier: (DATA.battle?.gymHpMult ?? 1.3) * power * Math.max(1, 6 / leader.length) ** (DATA.battle?.gymTeamExp ?? 0.7),
          });
        }
      }
    }
    return sequence;
  }

  function freshBattleUnit(mon, hpMultiplier = 1) {
    const stats = battleStats(mon);
    const maxHp = Math.max(1, Math.floor((stats?.hp || 1) * hpMultiplier));
    return { ...mon, maxHp, hp: maxHp, status: null, statusLeft: 0, confused: 0, proc: {}, active: false };
  }

  function battleMatchup(ally, enemy, damageMultiplier) {
    const outgoing = Math.max(1, bestDamageMove(ally, enemy).damage);
    const incoming = Math.max(1, bestDamageMove(enemy, ally, { damageMultiplier }).damage);
    const allyFirst = (battleStats(ally)?.spe || 0) >= (battleStats(enemy)?.spe || 0);
    return { outgoing, incoming, allyFirst };
  }

  function pickBattleAllies(allies, enemies, slots, damageMultiplier) {
    const livingEnemies = enemies.filter((enemy) => enemy.hp > 0);
    const ranked = allies.filter((ally) => ally.hp > 0).map((ally, index) => {
      const value = livingEnemies.reduce((sum, enemy) => {
        const matchup = battleMatchup(ally, enemy, damageMultiplier);
        return sum + matchup.outgoing / matchup.incoming + (matchup.allyFirst ? 0.01 : 0);
      }, 0) / Math.max(1, livingEnemies.length);
      return { ally, index, value };
    }).sort((a, b) => b.value - a.value || a.index - b.index);
    const selected = new Set(ranked.slice(0, slots).map((entry) => entry.ally));
    for (const ally of allies) {
      if (ally.active && !selected.has(ally)) ally.confused = 0;
      ally.active = selected.has(ally);
    }
    return ranked.slice(0, slots).map((entry) => entry.ally);
  }

  function statusEffectOf(move) {
    const row = DATA.statusMoves?.[move?.key];
    if (!row) return null;
    const guaranteed = new Set(["spore", "sacred-fire", "nuzzle", "zap-cannon", "inferno", "dynamic-punch"]);
    const cap = guaranteed.has(move.key) ? 100 : move.power > 0 ? 30 : 70;
    return { status: row[0] === "tri" ? "paralysis" : row[0], chance: Math.min(Number(row[1]) || 0, cap, Number(move.accuracy) || 100) / 100 };
  }

  function canInflictStatus(unit, status) {
    if (status === "confusion") return !unit.confused;
    if (unit.status) return false;
    const types = species(unit.id)?.t || [];
    return !(status === "burn" && types.includes("fire")
      || status === "poison" && (types.includes("poison") || types.includes("steel"))
      || status === "freeze" && types.includes("ice"));
  }

  function applyBattleStatus(unit, status) {
    if (!canInflictStatus(unit, status)) return false;
    if (status === "confusion") unit.confused = 5;
    else {
      unit.status = status;
      unit.statusLeft = status === "sleep" ? (unit.boss ? DATA.battle?.bossStatus?.lockMax || 2 : 3)
        : status === "freeze" ? (unit.boss ? DATA.battle?.bossStatus?.lockMax || 2 : Math.round(1 / (DATA.battle?.thawChance || 0.2)))
          : status === "paralysis" ? (DATA.battle?.statusFx?.paralysisTurns || 3)
            : (unit.boss ? DATA.battle?.bossStatus?.dotTurns || 4 : DATA.battle?.statusFx?.dotTurns || 5);
    }
    return true;
  }

  function procBattleStatus(attacker, defender, effect, key) {
    if (!effect || !canInflictStatus(defender, effect.status)) return false;
    const meterKey = `${key}:${effect.status}:${defender.uid || defender.id}`;
    attacker.proc[meterKey] = (attacker.proc[meterKey] || 0) + effect.chance;
    if (attacker.proc[meterKey] < 1) return false;
    attacker.proc[meterKey] -= 1;
    return applyBattleStatus(defender, effect.status);
  }

  function statusMoveAgainst(attacker, defender) {
    let selected = null;
    for (const move of learnedMoves(species(attacker.id), attacker.level, false)) {
      const effect = move.power <= 0 && statusEffectOf(move);
      if (effect && canInflictStatus(defender, effect.status) && typeEffect(move.type, species(defender.id)?.t) !== 0) selected = { move, effect };
    }
    return selected;
  }

  function battleSpeed(unit) {
    return (battleStats(unit)?.spe || 1) * (unit.status === "paralysis" ? 0.25 : 1);
  }

  function beforeBattleAction(unit) {
    if (unit.status === "sleep") {
      if (unit.statusLeft > 0) {
        unit.statusLeft -= 1;
        return { skip: true };
      }
      unit.status = null;
    } else if (unit.status === "freeze") {
      if (unit.statusLeft > 0) {
        unit.statusLeft -= 1;
        return { skip: true };
      }
      unit.status = null;
    } else if (unit.status === "paralysis") {
      unit.statusLeft -= 1;
      const paralysisChance = unit.boss ? DATA.battle?.bossStatus?.paralysisBlock || 0.2 : DATA.battle?.fullParalysisChance || 0.25;
      unit.paraCycle = ((unit.paraCycle || 0) + 1) % Math.max(1, Math.round(1 / paralysisChance));
      if (unit.paraCycle === 1) return { skip: true };
      if (unit.statusLeft <= 0) unit.status = null;
    }
    if (unit.confused > 0) {
      unit.confused -= 1;
      unit.confusionCycle = ((unit.confusionCycle || 0) + 1) % Math.max(1, Math.round(1 / (DATA.battle?.confusionSelfHitChance || 1 / 3)));
      if (unit.confusionCycle === 1) {
        const stats = battleStats(unit);
        const damage = Math.max(1, Math.floor((2 * unit.level / 5 + 2) * 40 * stats.atk / Math.max(1, stats.def) / 50 + 2));
        unit.hp = Math.max(0, unit.hp - damage);
        return { skip: true, selfDamage: damage };
      }
    }
    return { skip: false };
  }

  function afterBattleAction(unit) {
    if (unit.status !== "burn" && unit.status !== "poison") return 0;
    const damage = Math.max(1, Math.floor(unit.maxHp / (unit.boss ? DATA.battle?.bossStatus?.hurt || 60 : 8)));
    unit.hp = Math.max(0, unit.hp - damage);
    unit.statusLeft -= 1;
    if (unit.statusLeft <= 0 && unit.hp > 0) unit.status = null;
    return damage;
  }

  function chooseBattleTarget(attacker, targets, allySide) {
    if (!allySide) return targets[0] || null;
    return targets.map((target, index) => {
      const move = bestDamageMove(attacker, target);
      return { target, index, value: move.damage / Math.max(1, target.hp) };
    }).sort((a, b) => b.value - a.value || a.index - b.index)[0]?.target || null;
  }

  function performBattleAction(attacker, defender, allySide, damageMultiplier) {
    const statusMove = statusMoveAgainst(attacker, defender);
    if (statusMove) {
      attacker.statusChoice = (attacker.statusChoice || 0) + (DATA.battle?.statusMoveChance || 0.3);
      if (attacker.statusChoice >= 1) {
        attacker.statusChoice -= 1;
        procBattleStatus(attacker, defender, statusMove.effect, `status:${statusMove.move.key}`);
        return 0;
      }
    }
    const selected = bestDamageMove(attacker, defender, allySide ? null : { damageMultiplier });
    const damage = Math.max(1, Math.floor(selected.damage));
    defender.hp = Math.max(0, defender.hp - damage);
    if (defender.hp > 0) {
      if (defender.status === "freeze" && selected.move?.type === "fire") defender.status = null;
      procBattleStatus(attacker, defender, statusEffectOf(selected.move), `damage:${selected.move?.key}`);
    }
    return damage;
  }

  function simulateDeterministicBattle(allies, encounter) {
    const detail = { kind: encounter.kind, name: encounter.name, enemies: [], allyKos: [] };
    for (const ally of allies) Object.assign(ally, { confused: 0, active: false });
    const enemies = (encounter.enemies || []).map((enemySpec, index) => ({
      ...freshBattleUnit({ uid: `enemy-${index}`, id: enemySpec.id, level: enemySpec.level, shiny: false, rank: 0 }, encounter.hpMultiplier || 1),
      boss: !!encounter.boss,
    }));
    const slots = Math.max(1, Math.min(Number(encounter.slots) || 1, enemies.length, allies.length));
    let rounds = 0;
    while (enemies.some((enemy) => enemy.hp > 0) && allies.some((ally) => ally.hp > 0) && rounds < 200) {
      rounds += 1;
      const activeEnemies = enemies.filter((enemy) => enemy.hp > 0).slice(0, slots);
      const activeAllies = pickBattleAllies(allies, activeEnemies, slots, encounter.damageMultiplier || 1);
      const queue = [
        ...activeAllies.map((unit) => ({ unit, allySide: true })),
        ...activeEnemies.map((unit) => ({ unit, allySide: false })),
      ].sort((a, b) => battleSpeed(b.unit) - battleSpeed(a.unit) || Number(!b.allySide) - Number(!a.allySide));
      for (const action of queue) {
        if (action.unit.hp <= 0) continue;
        const targets = (action.allySide ? activeEnemies : activeAllies).filter((unit) => unit.hp > 0);
        const target = chooseBattleTarget(action.unit, targets, action.allySide);
        if (!target) continue;
        const before = beforeBattleAction(action.unit);
        if (!before.skip) performBattleAction(action.unit, target, action.allySide, encounter.damageMultiplier || 1);
        afterBattleAction(action.unit);
        if (action.allySide && action.unit.hp <= 0 && !detail.allyKos.includes(action.unit.uid)) detail.allyKos.push(action.unit.uid);
        if (!action.allySide && target.hp <= 0 && !detail.allyKos.includes(target.uid)) detail.allyKos.push(target.uid);
      }
    }
    detail.enemies = enemies.map((enemy) => ({ id: enemy.id, level: enemy.level, maxHp: enemy.maxHp, turns: rounds, remainingHp: Math.max(0, enemy.hp), status: enemy.status }));
    return { win: !enemies.some((enemy) => enemy.hp > 0), detail };
  }

  function simulateChapterTeam(save, team, chapterIndex) {
    const allies = team.map((mon) => freshBattleUnit({ ...mon }));
    const sequence = chapterBattleSequence(save, chapterIndex);
    const details = [];
    let completed = 0;
    let reachedLeader = false;
    for (const encounter of sequence) {
      if (encounter.kind === "heal") {
        for (const ally of allies) Object.assign(ally, { hp: ally.maxHp, status: null, statusLeft: 0, confused: 0 });
        details.push({ kind: "heal", name: encounter.name });
        continue;
      }
      if (encounter.kind === "leader") reachedLeader = true;
      const result = simulateDeterministicBattle(allies, encounter);
      details.push(result.detail);
      if (!result.win) {
        const totalHp = allies.reduce((sum, ally) => sum + Math.max(0, ally.hp), 0);
        const totalMax = allies.reduce((sum, ally) => sum + ally.maxHp, 0) || 1;
        return { clear: false, reachedLeader, completed, total: sequence.filter((item) => item.kind !== "heal").length, remainingHp: totalHp / totalMax, failedAt: encounter.kind, details };
      }
      completed += 1;
    }
    const totalHp = allies.reduce((sum, ally) => sum + Math.max(0, ally.hp), 0);
    const totalMax = allies.reduce((sum, ally) => sum + ally.maxHp, 0) || 1;
    return { clear: true, reachedLeader, completed, total: completed, remainingHp: totalHp / totalMax, failedAt: null, details };
  }

  function chapterSimulationScore(result) {
    const progress = result.total ? result.completed / result.total : 0;
    return (result.clear ? 1_000_000_000 : 0) + (result.reachedLeader ? 10_000_000 : 0) + progress * 1_000_000 + result.remainingHp * 10_000;
  }

  function removeClearlyDominatedCandidates(save, candidates, enemies, targetLevel) {
    if (candidates.length <= 6 || !enemies.length) return candidates;
    const profiles = new Map(candidates.map((mon) => [mon.uid, battleProfile(mon, enemies)]));
    return candidates.filter((candidate) => !candidates.some((other) => {
      if (other.uid === candidate.uid || teamIdentity(other) === teamIdentity(candidate)) return false;
      const candidateMeta = species(candidate.id);
      const otherMeta = species(other.id);
      if (!candidateMeta || !otherMeta || !otherMeta.t.includes(candidateMeta.t[0])) return false;
      const candidatePower = combinedStatValue(candidate);
      const otherPower = combinedStatValue(other);
      if (otherPower < candidatePower * 1.25) return false;
      const candidateFuture = baseStatTotal(projectedSpeciesId(save, candidate, targetLevel));
      const otherFuture = baseStatTotal(projectedSpeciesId(save, other, targetLevel));
      if (otherFuture < candidateFuture) return false;
      const candidateDuels = profiles.get(candidate.uid).duels;
      const otherDuels = profiles.get(other.uid).duels;
      return otherDuels.every((duel, index) => (
        duel.outgoing >= candidateDuels[index].outgoing
        && duel.incoming <= candidateDuels[index].incoming * 1.1
        && Number(duel.clears) >= Number(candidateDuels[index].clears)
      ));
    }));
  }

  function roamingLevelPriorityScore(level, preferredLevel = null) {
    if (!preferredLevel) return 0;
    const normalized = Number(level) || 0;
    return normalized >= preferredLevel
      ? 1_000 + (normalized - preferredLevel) * 4
      : -(preferredLevel - normalized) * 20;
  }

  function scoreCandidate(mon, enemies, continuitySet, selected, levelWeight = DEFAULT_LEVEL_WEIGHT, preferredLevel = null, save = null, targetLevel = null) {
    const meta = species(mon.id);
    if (!meta) return { score: -Infinity, reason: "缺少资料" };
    const stats = meta.s;
    const power = combinedStatValue(mon);
    const statMultiplier = combinedStatMultiplier(mon);
    const enemyList = enemies.length ? enemies : enemyProfiles([{ id: 1, level: mon.level }]);
    const normalizedTargetLevel = Math.max(mon.level, Number(targetLevel) || mon.level);
    const projectedId = projectedSpeciesId(save, mon, normalizedTargetLevel);
    const projectedPower = baseStatTotal(projectedId) * statMultiplier;
    const battle = battleProfile(mon, enemyList);
    const moves = learnedMoves(meta, mon.level);

    const offense = enemyList.reduce((sum, enemy) => {
      const best = moves.reduce((max, move) => {
        const stab = meta.t.includes(move.type) ? 1.5 : 1;
        return Math.max(max, move.power * effectiveAccuracy(move.accuracy) * stab * typeEffect(move.type, enemy.meta.t));
      }, 20);
      return sum + best;
    }, 0) / enemyList.length;

    const defense = enemyList.reduce((sum, enemy) => {
      const danger = Math.max(...enemy.meta.t.map((type) => typeEffect(type, meta.t)), 1);
      return sum + 1 / danger;
    }, 0) / enemyList.length;

    const samePrimary = selected.filter((item) => species(item.id)?.t?.[0] === meta.t[0]).length;
    const continuity = continuitySet.has(mon.uid) ? 6 : 0;
    const levelContribution = Math.min(100, mon.level) * levelWeight;
    const preferredLevelScore = roamingLevelPriorityScore(mon.level, preferredLevel);
    const score = power * 0.28 + projectedPower * 0.12 + offense * 0.45 + defense * 18
      + stats[5] * statMultiplier * 0.05 + battle.score
      + levelContribution + preferredLevelScore + continuity - samePrimary * 10;
    return {
      score,
      reason: `${language() === "en" ? "Combined stats" : "综合能力"}${power}（${combinedStatNote(mon)}） · ${language() === "en" ? "projected" : "培养目标"}${species(projectedId)?.n || projectedId}/${projectedPower.toFixed(0)} · ${language() === "en" ? "deterministic clears" : "确定性对位"}${battle.clears}/${enemyList.length} · Lv.${mon.level}`,
    };
  }

  function optimizeChapterTeam(save, candidates, initial, chapterIndex, scoreOptions, excludedSignatures) {
    if (chapterIndex == null || initial.length < 2 || !chapter(chapterIndex)?.steps?.length) return { team: initial, simulation: null };
    const continuity = new Set(save.teamSets?.list?.[4] || save.team || []);
    const ranked = candidates.map((mon) => ({
      mon,
      score: scoreCandidate(mon, scoreOptions.enemies, continuity, [], scoreOptions.levelWeight, scoreOptions.preferredLevel, save, scoreOptions.targetLevel).score,
    })).sort((a, b) => b.score - a.score);
    const identitySeen = new Set();
    const pool = [...initial, ...ranked.map((entry) => entry.mon)].filter((mon) => {
      const key = `${teamIdentity(mon)}|${mon.uid}`;
      if (identitySeen.has(key)) return false;
      identitySeen.add(key);
      return true;
    }).slice(0, 12);
    const evaluations = new Map();
    const evaluate = (team) => {
      const signature = team.map((mon) => mon.uid).sort().join("|");
      if (excludedSignatures.has(signature)) return { score: -Infinity, result: null };
      if (evaluations.has(signature)) return evaluations.get(signature);
      const result = simulateChapterTeam(save, team, chapterIndex);
      const evaluated = { score: chapterSimulationScore(result), result };
      evaluations.set(signature, evaluated);
      return evaluated;
    };
    let bestTeam = initial.slice();
    let best = evaluate(bestTeam);
    for (let slot = 0; slot < bestTeam.length; slot += 1) {
      for (const candidate of pool) {
        if (bestTeam.some((mon, index) => index !== slot && teamIdentity(mon) === teamIdentity(candidate))) continue;
        const trial = bestTeam.slice();
        trial[slot] = candidate;
        const evaluated = evaluate(trial);
        if (evaluated.score > best.score + 1e-9) {
          bestTeam = trial;
          best = evaluated;
        }
      }
    }
    return { team: bestTeam, simulation: best.result };
  }

  async function optimizeChapterTeamCooperatively(save, candidates, initial, chapterIndex, scoreOptions, excludedSignatures) {
    if (chapterIndex == null || initial.length < 2 || !chapter(chapterIndex)?.steps?.length) return { team: initial, simulation: null };
    const continuity = new Set(save.teamSets?.list?.[4] || save.team || []);
    const ranked = candidates.map((mon) => ({
      mon,
      score: scoreCandidate(mon, scoreOptions.enemies, continuity, [], scoreOptions.levelWeight, scoreOptions.preferredLevel, save, scoreOptions.targetLevel).score,
    })).sort((a, b) => b.score - a.score);
    const seen = new Set();
    const pool = [...initial, ...ranked.map((entry) => entry.mon)].filter((mon) => {
      const key = `${teamIdentity(mon)}|${mon.uid}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 12);
    const cache = new Map();
    const evaluate = (team) => {
      const signature = team.map((mon) => mon.uid).sort().join("|");
      if (excludedSignatures.has(signature)) return { score: -Infinity, result: null };
      if (!cache.has(signature)) {
        const result = simulateChapterTeam(save, team, chapterIndex);
        cache.set(signature, { score: chapterSimulationScore(result), result });
      }
      return cache.get(signature);
    };
    let bestTeam = initial.slice();
    let best = evaluate(bestTeam);
    let evaluations = 1;
    for (let slot = 0; slot < bestTeam.length; slot += 1) {
      for (const candidate of pool) {
        if (bestTeam.some((mon, index) => index !== slot && teamIdentity(mon) === teamIdentity(candidate))) continue;
        const trial = bestTeam.slice();
        trial[slot] = candidate;
        const evaluated = evaluate(trial);
        if (evaluated.score > best.score + 1e-9) {
          bestTeam = trial;
          best = evaluated;
        }
        evaluations += 1;
        if (evaluations % 4 === 0) await sleep(0);
      }
    }
    return { team: bestTeam, simulation: best.result };
  }

  function chapterOptimizationWorker(event) {
    const { allies: allyRows, sequence, initialUids, excludedSignatures } = event.data;
    const allyByUid = new Map(allyRows.map((ally) => [ally.uid, ally]));
    const excluded = new Set(excludedSignatures);
    const simulate = (uids) => {
      const allies = uids.map((uid) => ({ ...allyByUid.get(uid), hp: allyByUid.get(uid).maxHp }));
      let completed = 0;
      let reachedLeader = false;
      const details = [];
      const total = sequence.filter((entry) => entry.kind !== "heal").length;
      for (const encounter of sequence) {
        if (encounter.kind === "heal") {
          for (const ally of allies) ally.hp = ally.maxHp;
          details.push({ kind: "heal", name: encounter.name });
          continue;
        }
        if (encounter.kind === "leader") reachedLeader = true;
        const detail = { kind: encounter.kind, name: encounter.name, enemies: [], allyKos: [] };
        for (const enemy of encounter.enemies) {
          let enemyHp = enemy.maxHp;
          let turns = 0;
          while (enemyHp > 0 && allies.some((ally) => ally.hp > 0)) {
            const matchup = allies.filter((ally) => ally.hp > 0).map((ally) => {
              const values = ally.matchups[enemy.key];
              return { ally, ...values, value: values.outgoing / values.incoming + ally.hp / ally.maxHp * 0.25 + (values.allyFirst ? 0.2 : 0) };
            }).sort((a, b) => b.value - a.value || String(a.ally.uid).localeCompare(String(b.ally.uid)))[0];
            if (!matchup) break;
            const { ally, outgoing, incoming, allyFirst } = matchup;
            const turnsToWin = Math.ceil(enemyHp / outgoing);
            const enemyHitsBeforeWin = allyFirst ? Math.max(0, turnsToWin - 1) : turnsToWin;
            const hitsToAllyKo = Math.ceil(ally.hp / incoming);
            if (enemyHitsBeforeWin < hitsToAllyKo) {
              ally.hp -= enemyHitsBeforeWin * incoming;
              enemyHp = 0;
              turns += turnsToWin;
            } else {
              const allyAttacks = allyFirst ? hitsToAllyKo : Math.max(0, hitsToAllyKo - 1);
              enemyHp -= allyAttacks * outgoing;
              ally.hp = 0;
              turns += hitsToAllyKo;
              detail.allyKos.push(ally.uid);
            }
          }
          detail.enemies.push({ id: enemy.id, level: enemy.level, maxHp: enemy.maxHp, turns, remainingHp: Math.max(0, enemyHp) });
          if (enemyHp > 0) {
            details.push(detail);
            const remainingHp = allies.reduce((sum, ally) => sum + Math.max(0, ally.hp), 0) / (allies.reduce((sum, ally) => sum + ally.maxHp, 0) || 1);
            return { clear: false, reachedLeader, completed, total, remainingHp, failedAt: encounter.kind, details };
          }
        }
        details.push(detail);
        completed += 1;
      }
      const remainingHp = allies.reduce((sum, ally) => sum + Math.max(0, ally.hp), 0) / (allies.reduce((sum, ally) => sum + ally.maxHp, 0) || 1);
      return { clear: true, reachedLeader, completed, total: completed, remainingHp, failedAt: null, details };
    };
    const score = (result) => (result.clear ? 1_000_000_000 : 0) + (result.reachedLeader ? 10_000_000 : 0)
      + (result.total ? result.completed / result.total : 0) * 1_000_000 + result.remainingHp * 10_000;
    const cache = new Map();
    const evaluate = (uids) => {
      const signature = [...uids].sort().join("|");
      if (excluded.has(signature)) return { score: -Infinity, result: null };
      if (!cache.has(signature)) {
        const result = simulate(uids);
        cache.set(signature, { score: score(result), result });
      }
      return cache.get(signature);
    };
    let bestUids = [...initialUids];
    let best = evaluate(bestUids);
    for (let slot = 0; slot < bestUids.length; slot += 1) {
      for (const candidate of allyRows) {
        if (bestUids.some((uid, index) => index !== slot && allyByUid.get(uid).identity === candidate.identity)) continue;
        const trial = [...bestUids];
        trial[slot] = candidate.uid;
        const evaluated = evaluate(trial);
        if (evaluated.score > best.score + 1e-9) {
          bestUids = trial;
          best = evaluated;
        }
      }
    }
    self.postMessage({ uids: bestUids, simulation: best.result });
  }

  async function optimizeChapterTeamAsync(save, candidates, initial, chapterIndex, scoreOptions, excludedSignatures) {
    if (chapterIndex == null || initial.length < 2 || !chapter(chapterIndex)?.steps?.length) return { team: initial, simulation: null };
    const continuity = new Set(save.teamSets?.list?.[4] || save.team || []);
    const ranked = candidates.map((mon) => ({
      mon,
      score: scoreCandidate(mon, scoreOptions.enemies, continuity, [], scoreOptions.levelWeight, scoreOptions.preferredLevel, save, scoreOptions.targetLevel).score,
    })).sort((a, b) => b.score - a.score);
    const seen = new Set();
    const pool = [...initial, ...ranked.map((entry) => entry.mon)].filter((mon) => {
      const key = `${teamIdentity(mon)}|${mon.uid}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 12);
    const sequence = chapterBattleSequence(save, chapterIndex);
    const enemyRows = new Map();
    const compactSequence = sequence.map((encounter) => ({
      kind: encounter.kind,
      name: encounter.name,
      enemies: (encounter.enemies || []).map((enemySpec) => {
        const key = `${enemySpec.id}|${enemySpec.level}|${encounter.damageMultiplier || 1}|${encounter.hpMultiplier || 1}`;
        if (!enemyRows.has(key)) {
          const enemy = freshBattleUnit({ id: enemySpec.id, level: enemySpec.level, shiny: false, rank: 0 }, encounter.hpMultiplier || 1);
          enemyRows.set(key, { key, id: enemy.id, level: enemy.level, maxHp: enemy.maxHp, damageMultiplier: encounter.damageMultiplier || 1, unit: enemy });
        }
        const { unit, damageMultiplier, ...row } = enemyRows.get(key);
        return row;
      }),
    }));
    const allies = pool.map((mon) => {
      const unit = freshBattleUnit({ ...mon });
      const matchups = Object.fromEntries([...enemyRows.values()].map((enemy) => [enemy.key, battleMatchup(unit, enemy.unit, enemy.damageMultiplier)]));
      return { uid: String(mon.uid), identity: teamIdentity(mon), maxHp: unit.maxHp, matchups };
    });
    if (typeof Worker !== "function") return optimizeChapterTeam(save, candidates, initial, chapterIndex, scoreOptions, excludedSignatures);
    const blobUrl = URL.createObjectURL(new Blob([`self.onmessage = ${chapterOptimizationWorker.toString()};`], { type: "text/javascript" }));
    try {
      const result = await new Promise((resolve, reject) => {
        const worker = new Worker(blobUrl);
        const timeout = setTimeout(() => { worker.terminate(); reject(new Error("battle worker timeout")); }, 5_000);
        worker.onmessage = (message) => { clearTimeout(timeout); worker.terminate(); resolve(message.data); };
        worker.onerror = (error) => { clearTimeout(timeout); worker.terminate(); reject(error); };
        worker.postMessage({ allies, sequence: compactSequence, initialUids: initial.map((mon) => String(mon.uid)), excludedSignatures: [...excludedSignatures] });
      });
      const byUid = new Map(pool.map((mon) => [String(mon.uid), mon]));
      const team = result.uids.map((uid) => byUid.get(uid)).filter(Boolean);
      const strictSimulation = simulateChapterTeam(save, team, chapterIndex);
      if (strictSimulation.clear) return { team, simulation: strictSimulation };
      return optimizeChapterTeamCooperatively(save, candidates, initial, chapterIndex, scoreOptions, excludedSignatures);
    } catch (error) {
      log(`后台战斗模拟不可用，改用限量计算：${error.message}`);
      return optimizeChapterTeamCooperatively(save, candidates, initial, chapterIndex, scoreOptions, excludedSignatures);
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  }

  function recommendTeam(save, enemyIds, options) {
    const {
      excludedSignatures = new Set(),
      levelWeight = DEFAULT_LEVEL_WEIGHT,
      preferredLevel = null,
      targetLevel = null,
      chapterIndex = null,
    } = options || {};
    const fallbackLevel = Math.max(1, Number(targetLevel) || 1);
    const enemies = enemyProfiles(enemyIds, fallbackLevel);
    const currentFive = new Set(save.teamSets?.list?.[4] || save.team || []);
    const rawCandidates = teamCandidatesForRecommendation(save);
    const candidates = removeClearlyDominatedCandidates(save, rawCandidates, enemies, fallbackLevel);
    const preferredUids = new Set(preferredTeamCandidates(save).map((mon) => String(mon.uid)));
    const availableIdentities = new Set(candidates.map(teamIdentity));
    const selected = [];
    const details = [];
    while (selected.length < 6 && selected.length < availableIdentities.size) {
      const selectedIdentities = new Set(selected.map(teamIdentity));
      const ranked = candidates
        .filter((mon) => !selectedIdentities.has(teamIdentity(mon)))
        .map((mon) => ({ mon, ...scoreCandidate(mon, enemies, currentFive, selected, levelWeight, preferredLevel, save, fallbackLevel) }))
        .sort((a, b) => Number(preferredUids.has(String(b.mon.uid))) - Number(preferredUids.has(String(a.mon.uid))) || b.score - a.score);
      const choice = ranked[0];
      if (!choice) break;
      selected.push(choice.mon);
      details.push({ uid: choice.mon.uid, id: choice.mon.id, name: species(choice.mon.id)?.n || choice.mon.id, score: choice.score, reason: choice.reason });
    }

    const signature = selected.map((mon) => mon.uid).sort().join("|");
    if (excludedSignatures.has(signature) && availableIdentities.size > 6) {
      const last = selected.pop();
      details.pop();
      const selectedIdentities = new Set(selected.map(teamIdentity));
      const replacement = candidates
        .filter((mon) => !selectedIdentities.has(teamIdentity(mon)) && teamIdentity(mon) !== teamIdentity(last))
        .map((mon) => ({ mon, ...scoreCandidate(mon, enemies, currentFive, selected, levelWeight, preferredLevel, save, fallbackLevel) }))
        .sort((a, b) => Number(preferredUids.has(String(b.mon.uid))) - Number(preferredUids.has(String(a.mon.uid))) || b.score - a.score)[0];
      if (replacement) {
        selected.push(replacement.mon);
        details.push({
          uid: replacement.mon.uid,
          id: replacement.mon.id,
          name: species(replacement.mon.id)?.n || replacement.mon.id,
          score: replacement.score,
          reason: replacement.reason,
        });
      }
    }
    return {
      mons: selected,
      details,
      enemyIds,
      signature: selected.map((mon) => mon.uid).sort().join("|"),
      simulation: null,
      optimization: chapterIndex == null ? null : {
        chapterIndex,
        candidates,
        enemies,
        levelWeight,
        preferredLevel,
        targetLevel: fallbackLevel,
        excludedSignatures: [...excludedSignatures],
      },
    };
  }

  function recommendRoamingTeam(save, enemyId) {
    const plan = recommendTeam(save, [enemyId], {
      levelWeight: COLLECTION_LEVEL_WEIGHT,
      preferredLevel: ROAMING_PREFERRED_LEVEL,
      targetLevel: 100,
    });
    return plan;
  }

  function targetEnemyIdsForChapter(chapterIndex) {
    const ids = chapter(chapterIndex)?.boss?.team?.map(([id]) => id) || [];
    const observed = runtime.observedEnemies.get(chapterIndex) || new Set();
    return [...new Set([...ids, ...observed])];
  }

  function targetEnemiesForChapter(chapterIndex) {
    const item = chapter(chapterIndex);
    const levels = new Map(scaledBossTeam(chapterIndex).map(({ id, level }) => [id, level]));
    const observed = runtime.observedEnemies.get(chapterIndex) || new Set();
    const observedLevel = runtime.lastOpponent.get(chapterIndex)?.maxLevel || item?.ace || 1;
    for (const id of observed) levels.set(id, Math.max(levels.get(id) || 0, observedLevel));
    return [...levels].map(([id, level]) => ({ id, level }));
  }

  async function openScreen(name) {
    const button = document.querySelector(`#tabs [data-screen="${name}"]`);
    if (!button) throw new Error(`找不到${name}页面按钮`);
    if (!button.classList.contains("active")) {
      await pacedClick(button, `${name}页面按钮`);
      await waitFor(() => button.classList.contains("active"), { label: `${name}页面` });
    }
  }

  function raidDateKey(timestamp = Date.now()) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Paris",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(timestamp);
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}`;
  }

  function raidSetupStatus(save, region) {
    const knownUids = new Set((save.mons || []).map((mon) => mon.uid));
    const team = (save.eventTeams?.[`raid:${region}`] || []).filter((uid) => knownUids.has(uid));
    const allies = (save.raids?.pick?.[region] || []).filter(Boolean);
    return {
      team,
      allies,
      ready: team.length >= 2 && allies.length >= 2,
    };
  }

  async function optimizeDailyRaidTeam(root, region) {
    const edit = await waitFor(
      () => root.querySelector(`[data-raid-edit="${region}"]`),
      { label: language() === "en" ? "raid team editor" : "团体战队伍编辑器" },
    );
    await pacedClick(edit, language() === "en" ? "raid team editor" : "团体战队伍编辑器");
    const optimize = await waitFor(
      () => document.querySelector("#evt-pick.open #evt-opt"),
      { label: language() === "en" ? "raid team optimize button" : "团体战队伍优化按钮" },
    );
    await pacedClick(optimize, language() === "en" ? "optimize raid team" : "优化团体战队伍");
    await waitFor(
      () => raidSetupStatus(readSave(), region).team.length >= 2,
      { label: language() === "en" ? "optimized raid team" : "优化后的团体战队伍" },
    );
    const close = await waitFor(
      () => document.querySelector("#evt-pick.open [data-evt-close]"),
      { label: language() === "en" ? "raid team close button" : "团体战队伍关闭按钮" },
    );
    await pacedClick(close, language() === "en" ? "close raid team editor" : "关闭团体战队伍编辑器");
    await waitFor(
      () => !document.querySelector("#evt-pick.open"),
      { label: language() === "en" ? "raid team editor close" : "团体战队伍编辑器关闭" },
    );
  }

  async function selectFirstDailyRaidAllies(root, region) {
    for (let slot = 0; slot < 2; slot += 1) {
      const slotButton = await waitFor(
        () => root.querySelector(`[data-raid-slot="${region}|${slot}"]`),
        { label: language() === "en" ? `raid ally slot ${slot + 1}` : `团体战盟友槽${slot + 1}` },
      );
      await pacedClick(slotButton, language() === "en" ? `raid ally slot ${slot + 1}` : `团体战盟友槽${slot + 1}`);
      const first = await waitFor(
        () => document.querySelector("#modal-root.open .raid-dlg [data-pick]"),
        { label: language() === "en" ? "first available raid ally" : "第一个可用团体战盟友" },
      );
      await pacedClick(first, language() === "en" ? "first available raid ally" : "第一个可用团体战盟友");
      await waitFor(
        () => Boolean(readSave().raids?.pick?.[region]?.[slot]),
        { label: language() === "en" ? `raid ally ${slot + 1} selection` : `团体战盟友${slot + 1}选择` },
      );
    }
  }

  function finishDailyRaidCheck(date, message) {
    runtime.dailyRaidCompletedDate = date;
    runtime.dailyRaidActiveRegion = null;
    if (message) log(message);
  }

  function dailyRaidEntryState(root) {
    for (const [type, selector] of [
      ["login", "[data-p]"],
      ["list", ".rc-card"],
      ["draw", "[data-raid-draw]"],
      ["page", '[data-raid-page="chroma"]'],
      ["empty", ".pg-empty"],
    ]) {
      const element = root.querySelector(selector);
      if (element) return { type, element };
    }
    return null;
  }

  function deferDailyRaidCheck(message) {
    runtime.dailyRaidRetryAt = Date.now() + 5 * 60_000;
    runtime.dailyRaidActiveRegion = null;
    log(message);
  }

  async function prioritizeDailyRaid(save) {
    if (!settings.prioritizeDailyRaid) return false;
    const date = raidDateKey(Number(save.lastTick) || Date.now());
    if (runtime.dailyRaidDate !== date) {
      runtime.dailyRaidDate = date;
      runtime.dailyRaidCompletedDate = null;
      runtime.dailyRaidActiveRegion = null;
    }

    const activeRaid = save.adv?.event?.raid ? save.adv.event : null;
    if (activeRaid) {
      runtime.dailyRaidActiveRegion = activeRaid.reg || null;
      return true;
    }
    runtime.dailyRaidActiveRegion = null;
    if (runtime.dailyRaidCompletedDate === date) return false;
    if (runtime.dailyRaidRetryAt > Date.now()) return false;

    return exclusive(language() === "en" ? "Check daily raid" : "检查每日团体战", async () => {
      await openScreen("raid");
      const root = await waitFor(() => document.querySelector("#raid-root"), { label: t("dailyRaid") });
      let entry;
      try {
        entry = await waitFor(
          () => dailyRaidEntryState(root),
          { timeout: 15_000, label: language() === "en" ? "daily raid entry" : "每日团体战入口" },
        );
      } catch {
        deferDailyRaidCheck(language() === "en"
          ? "Daily raid entry is still unavailable; retrying in five minutes"
          : "每日团体战入口暂时不可用，继续当前任务并在5分钟后重试");
        return;
      }

      if (entry.type === "login") {
        finishDailyRaidCheck(date, language() === "en" ? "Daily raid skipped: sign in to the game first" : "今日团体战已跳过：请先登录游戏账号");
        return;
      }
      if (entry.type === "empty") {
        finishDailyRaidCheck(date, language() === "en" ? "Daily raid is not available yet" : "今日没有可用团体战或尚未解锁");
        return;
      }
      if (entry.type === "draw") {
        await pacedClick(entry.element, language() === "en" ? "daily raid draw" : "抽取每日团体战");
        await waitFor(
          () => root.querySelector("[data-raid-page=\"chroma\"], .rc-card, [data-p]"),
          { timeout: 20_000, label: language() === "en" ? "daily raid draw" : "每日团体战抽取" },
        );
      }

      const raidPage = entry.type === "page" ? entry.element : root.querySelector('[data-raid-page="chroma"]');
      if (raidPage) {
        await pacedClick(raidPage, language() === "en" ? "daily raid" : "每日团体战入口");
      }
      try {
        await waitFor(
          () => root.querySelector(".rc-card, [data-p]"),
          { timeout: 15_000, label: language() === "en" ? "daily raid list" : "每日团体战列表" },
        );
      } catch {
        deferDailyRaidCheck(language() === "en"
          ? "Daily raid data is still unavailable; retrying in five minutes"
          : "团体战数据暂时不可用，5分钟后重试");
        return;
      }

      if (root.querySelector("[data-p]")) {
        finishDailyRaidCheck(date, language() === "en" ? "Daily raid skipped: sign in to the game first" : "今日团体战已跳过：请先登录游戏账号");
        return;
      }
      const available = [...root.querySelectorAll("[data-raid-go]")].find((button) => !button.disabled);
      if (!available) {
        finishDailyRaidCheck(date, language() === "en" ? "Today's available raids are complete" : "今日可用团体战已完成");
        return;
      }

      const region = available.dataset.raidGo;
      runtime.dailyRaidActiveRegion = region;
      await optimizeDailyRaidTeam(root, region);
      await selectFirstDailyRaidAllies(root, region);
      const setup = raidSetupStatus(readSave(), region);
      if (setup.team.length < 2) {
        diagnostic(t("dailyRaid"), new Error(`${t("raidTeamMissing")}（${t(region)}）`), {
          suggestion: language() === "en"
            ? "The Raids page is open. Configure its two-Pokemon team, then restart the automatic task."
            : "已停在团体战页面；配置该地区的2人团体战队伍后，重新启动自动任务。",
        });
        return;
      }
      if (setup.allies.length < 2) {
        diagnostic(t("dailyRaid"), new Error(`${t("raidAlliesMissing")}（${t(region)}）`), {
          suggestion: language() === "en"
            ? "The Raids page is open. Choose two allies there, then restart the automatic task."
            : "已停在团体战页面；选择2名盟友后，重新启动自动任务。",
        });
        return;
      }

      const go = await waitFor(
        () => [...root.querySelectorAll(`[data-raid-go="${region}"]`)].find((button) => !button.disabled),
        { label: language() === "en" ? "daily raid start button" : "每日团体战开始按钮" },
      );
      await pacedClick(go, language() === "en" ? "start daily raid" : "开始每日团体战");
      const outcome = await waitFor(
        () => readSave().adv?.event?.raid
          || document.querySelector("#modal-root.open .modal-actions .btn.primary")
          || document.querySelector("#evt-pick.open, #modal-root.open .raid-dlg"),
        { timeout: 10_000, label: language() === "en" ? "daily raid start" : "每日团体战启动" },
      );
      if (outcome instanceof Element && outcome.matches("#modal-root.open .modal-actions .btn.primary")) {
        await pacedClick(outcome, language() === "en" ? "confirm daily raid" : "确认开始团体战");
      } else if (outcome instanceof Element) {
        throw new Error(language() === "en" ? "The raid setup is no longer valid; configure it again on the Raids page" : "团体战配置已失效，请在团体战页面重新配置");
      }
      const event = await waitFor(
        () => readSave().adv?.event?.raid && readSave().adv.event,
        { timeout: 10_000, label: language() === "en" ? "enter daily raid" : "进入每日团体战" },
      );
      runtime.dailyRaidActiveRegion = event.reg || region;
      log(language() === "en" ? `Daily raid started: ${t(region)}` : `已优先开始每日团体战：${t(region)}`);
    });
  }

  function leagueChapters(chapterIndex) {
    const target = chapter(chapterIndex);
    return target?.league ? DATA.chapters.filter((item) => item.league && item.region === target.region) : [];
  }

  function actualStoryChapter(save, requestedChapter) {
    const group = leagueChapters(requestedChapter);
    if (!group.length) return requestedChapter;
    const current = group.find((item) => item.index === save.adv.chapter);
    // 联盟内部跟随真实进度；外部进入只能从第一位开始，不能跳冠军。
    return current && !save.adv.zone && !save.adv.event && !save.adv.league && !save.adv.tower
      ? current.index : group[0].index;
  }

  function normalTransitChapter(save, plan) {
    const region = chapter(plan.chapter)?.region || currentRegion(save);
    return DATA.chapters.filter((item) => item.region === region && !item.league
      && item.index <= save.adv.unlocked && item.index !== plan.chapter)
      .sort((a,b) => Math.abs(a.index-plan.chapter)-Math.abs(b.index-plan.chapter) || a.index-b.index)[0] || null;
  }

  async function switchChapter(chapterIndex, { settle = true } = {}) {
    const targetChapter = chapter(chapterIndex);
    const targetRegion = targetChapter?.region;
    if (!targetRegion) throw new Error(`找不到章节${chapterIndex}的数据`);
    const group = leagueChapters(chapterIndex);
    const initial = readSave();
    if (group.some((item) => item.index === initial.adv.chapter)
      && !initial.adv.zone && !initial.adv.event && !initial.adv.league && !initial.adv.tower) {
      runtime.expectedChapter = null;
      return initial.adv.chapter;
    }
    const mapChapter = group.length ? "L" : chapterIndex;
    runtime.expectedChapter = group.length ? group[0].index : chapterIndex;
    try {
      await openChapterMap();
      const visibleRow = document.querySelector(`.mp-row[data-ch="${mapChapter}"]`);
      if (group.length || !visibleRow) {
        const regionButton = await waitFor(() => document.querySelector(`.rg.open[data-rg="${targetRegion}"]`),
          {label:`${t(targetRegion)}地区标签`});
        await pacedClick(regionButton,`${t(targetRegion)}地区标签`);
      }
      // 地图可能保留在精英联盟页，明确选择普通联盟，不误入精英挑战。
      const normalLeague = group.length && document.querySelector('[data-lg-view="league"]');
      if (normalLeague) await pacedClick(normalLeague,"普通宝可梦联盟");
      const row = await waitFor(() => document.querySelector(`.mp-row[data-ch="${mapChapter}"]`),
        {label:group.length?`${t(targetRegion)}宝可梦联盟列表项`:`章节${chapterIndex}列表项`});
      await pacedClick(row,"选择章节");
      const go = await waitFor(() => document.querySelector(`.mp-go[data-go="${mapChapter}"]`),
        {label:group.length?"宝可梦联盟进入按钮":`章节${chapterIndex}进入按钮`});
      if (go.disabled) throw new Error(group.length?"宝可梦联盟尚未解锁":"目标章节尚未解锁");
      await pacedClick(go,"进入章节");
      await waitFor(() => {
        const save = readSave();
        return !save.adv.zone && !save.adv.event && !save.adv.league && !save.adv.tower && (group.length
          ? group.some((item) => item.index === save.adv.chapter) : save.adv.chapter === chapterIndex);
      },{timeout:10_000,label:group.length?"进入普通宝可梦联盟":`进入章节${chapterIndex}`});
      if (settle) await jitter(500,900);
      const actual = readSave().adv.chapter;
      log(`已进入：${chapter(actual)?.name || `章节${actual}`}`);
      return actual;
    } finally {
      runtime.expectedChapter = null;
    }
  }

  async function openChapterMap() {
    if (!document.querySelector("#screen-map.active")) {
      await openScreen("adventure");
      await pacedClick(document.querySelector("#side-chapter"), "打开地图");
    }
    await waitFor(() => document.querySelector("#screen-map.active #map-root"), { label: "冒险地图" });
  }

  // 特殊地点的进入按钮在详情里，必须先用地图条目打开详情。
  async function enterSpecialZone(plan) {
    const special = DATA.specialZones.find((item) => item.id === plan.speciesId);
    if (!special) throw new Error(`找不到 ${plan.speciesId} 的原生地点`);
    const alreadyInside = (save) => Number(save.adv.zone?.id) === special.id
      && !save.adv.zone.elite && !save.adv.zone.riddle;
    if (alreadyInside(readSave())) return { entered: true };

    await openChapterMap();
    const regionTab = await waitFor(
      () => document.querySelector(`#map-root .rg.open[data-rg="${special.region}"]`),
      { label: `${t(special.region)}地图标签` },
    );
    await pacedClick(regionTab, `${t(special.region)}地图标签`);

    const row = document.querySelector(`#map-root .mp-row[data-ch="Z${special.id}"]`);
    if (!row) return { entered: false, reason: language() === "en" ? "The game has not opened this location" : "游戏地图尚未开放此地点" };
    if (row.classList.contains("lz-seal")) {
      return { entered: false, reason: language() === "en" ? "Solve the inscription in the game" : "请先在游戏中解开碑文" };
    }
    await pacedClick(row, `${plan.zone}地图条目`);

    const zoneTab = document.querySelector('#map-root [data-lz-view="zone"]:not(.on)');
    if (zoneTab) await pacedClick(zoneTab, `${plan.zone}区域页`);
    const button = document.querySelector(`#map-root .mp-go[data-zone="${special.id}"]:not([data-tier])`);
    if (!button || button.disabled) {
      return { entered: false, reason: button?.textContent?.trim()
        || (language() === "en" ? "Normal encounter unavailable" : "本轮普通捕获入口未开放") };
    }
    await pacedClick(button, `${plan.zone}入口`);
    try {
      await waitFor(() => alreadyInside(readSave()), { timeout: 10_000, label: `进入${plan.zone}` });
    } catch (error) {
      if (error.message !== `等待进入${plan.zone}超时`) throw error;
      return { entered: false, reason: language() === "en" ? "The game declined entry" : "游戏未接受进入请求，请查看地图详情" };
    }
    log(`已进入特殊地点：${plan.zone}`);
    return { entered: true };
  }

  async function continueChapterReset() {
    const reset = runtime.chapterReset;
    if (!reset) return true;

    const current = readSave().adv.chapter;
    if (reset.phase === "transit") {
      if (current !== reset.transitChapter) {
        await switchChapter(reset.transitChapter);
      }
      reset.phase = "target";
      log(`中转已完成，立即返回：${chapter(reset.targetChapter)?.name || `章节${reset.targetChapter}`}`);
      return false;
    }

    if (readSave().adv.chapter !== reset.targetChapter) {
      await switchChapter(reset.targetChapter);
    }
    if (readSave().adv.chapter !== reset.targetChapter) return false;

    runtime.chapterReset = null;
    log(`章节重置完成：${chapter(reset.targetChapter)?.name || `章节${reset.targetChapter}`}`);
    return true;
  }

  async function resetChapter(plan) {
    const save = readSave();
    if (plan.roaming) {
      const transit = normalTransitChapter(save, plan);
      if (!transit) throw new Error("找不到神兽章节的中转章节");
      runtime.chapterReset = {
        phase: "transit",
        transitChapter: transit.index,
        targetChapter: plan.chapter,
      };
      await continueChapterReset();
      return;
    }
    const alternatives = plansForSpecies(save, plan.speciesId).filter((item) => item.chapter !== plan.chapter);
    if (alternatives.length) {
      const alternative = alternatives[0];
      const previousRegion = currentRegion(save);
      runtime.targetPlan = alternative;
      await switchChapter(alternative.chapter);
      const targetSave = readSave();
      if (currentRegion(targetSave) !== previousRegion) {
        const team = recommendTeam(targetSave, [alternative.speciesId], {
          levelWeight: COLLECTION_LEVEL_WEIGHT,
          targetLevel: chapter(alternative.chapter)?.ace,
          chapterIndex: alternative.chapter,
        });
        await applyRecommendedTeam(team, species(alternative.speciesId)?.n || String(alternative.speciesId));
      }
      return;
    }
    const transit = normalTransitChapter(save, plan);
    if (!transit) throw new Error("找不到可用中转章节");
    runtime.chapterReset = {
      phase: "transit",
      transitChapter: transit.index,
      targetChapter: plan.chapter,
    };
    await continueChapterReset();
  }

  async function applyRecommendedTeam(plan, reason) {
    if (plan.optimization) {
      const requested = plan.optimization;
      const snapshot = readSave();
      const snapshotChapter = Number(snapshot.adv.chapter);
      const candidateUids = new Set(snapshot.mons.map((mon) => String(mon.uid)));
      const optimized = await optimizeChapterTeamAsync(
        snapshot,
        requested.candidates,
        plan.mons,
        requested.chapterIndex,
        requested,
        new Set(requested.excludedSignatures),
      );
      const fresh = readSave();
      const stillValid = Number(fresh.adv.chapter) === snapshotChapter
        && optimized.team.every((mon) => candidateUids.has(String(mon.uid)) && fresh.mons.some((candidate) => String(candidate.uid) === String(mon.uid)));
      if (stillValid) {
        const continuity = new Set(fresh.teamSets?.list?.[4] || fresh.team || []);
        plan.mons = optimized.team;
        plan.simulation = optimized.simulation;
        plan.signature = optimized.team.map((mon) => mon.uid).sort().join("|");
        plan.details = optimized.team.map((mon, index) => {
          const scored = scoreCandidate(mon, requested.enemies, continuity, optimized.team.slice(0, index), requested.levelWeight, requested.preferredLevel, fresh, requested.targetLevel);
          return { uid: mon.uid, id: mon.id, name: species(mon.id)?.n || mon.id, score: scored.score, reason: scored.reason };
        });
      } else {
        log("后台配队期间章节或候选发生变化，已放弃过期模拟结果");
      }
      delete plan.optimization;
    }
    runtime.teamPlan = plan;
    runtime.teamStatus = `推荐完成：${reason}`;
    let save = null;
    try { save = readSave(); } catch { /* ignore */ }
    if (save) recordDebugDecision(plan, save, reason);
    if (plan.simulation) {
      const result = plan.simulation.clear
        ? `整章确定性模拟通过，剩余生命 ${(plan.simulation.remainingHp * 100).toFixed(0)}%`
        : `整章确定性模拟在${plan.simulation.failedAt || "未知节点"}失败，完成 ${plan.simulation.completed}/${plan.simulation.total}`;
      log(result, plan.simulation.clear ? "info" : "error");
    }
    renderStatus();
    if (settings.lockTeam5 || runtime.userTeamOverride) {
      log(`第五队已锁定，仅生成推荐：${plan.details.map((item) => item.name).join("、")}`);
      return;
    }
    if (plan.simulation && !plan.simulation.clear) {
      runtime.teamStatus = `未应用：没有通过整章校验的阵容（${plan.simulation.completed}/${plan.simulation.total}）`;
      log(runtime.teamStatus, "error");
      renderStatus();
      return;
    }
    await configurePreset(4, plan.mons.map((mon) => mon.uid));
    runtime.lastTeamSignature = fifthTeamSignature(readSave());
    runtime.teamStatus = `已应用：${plan.details.map((item) => item.name).join("、")}`;
    log(runtime.teamStatus);
  }

  let syntheticPointerId = 10_000;

  async function dragPokemon(source, destination, label) {
    if (!source || !destination) throw new Error(`找不到${label}的拖放位置`);
    const targetGap = Math.round(700 + Math.random() * 1_000);
    const elapsed = Date.now() - runtime.lastAutomatedActionAt;
    await sleep(runtime.lastAutomatedActionAt ? Math.max(0, targetGap - elapsed) : targetGap);
    const from = source.getBoundingClientRect();
    const to = destination.getBoundingClientRect();
    const pointerId = syntheticPointerId += 1;
    const event = (type, x, y, buttons) => new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      pointerId,
      pointerType: "mouse",
      button: 0,
      buttons,
      clientX: x,
      clientY: y,
    });
    const fromX = from.left + from.width / 2;
    const fromY = from.top + from.height / 2;
    const toX = to.left + to.width / 2;
    const toY = to.top + Math.min(to.height / 2, 24);
    source.dispatchEvent(event("pointerdown", fromX, fromY, 1));
    await jitter(35, 85);
    document.dispatchEvent(event("pointermove", fromX + Math.sign(toX - fromX || 1) * 8, fromY + Math.sign(toY - fromY || 1) * 8, 1));
    await jitter(35, 85);
    document.dispatchEvent(event("pointermove", toX, toY, 1));
    await jitter(35, 85);
    document.dispatchEvent(event("pointerup", toX, toY, 0));
    runtime.lastAutomatedActionAt = Date.now();
    await jitter(450, 1_100);
  }

  async function configurePreset(presetIndex, desiredUids) {
    if (desiredUids.length < 1) throw new Error("推荐阵容为空");
    await openScreen("team");
    const preset = await waitFor(() => document.querySelector(`#team-sets [data-set="${presetIndex}"]`), { label: `队伍${presetIndex + 1}` });
    await pacedClick(preset, `队伍${presetIndex + 1}预设`);
    await waitFor(() => readSave().teamSets?.on === presetIndex, { label: `切换到队伍${presetIndex + 1}` });

    const quickPacing = { beforeMin: 140, beforeMax: 360, afterMin: 100, afterMax: 260 };
    const evoFilter = document.querySelector("#pc-evo.on");
    if (evoFilter) await pacedClick(evoFilter, "进化筛选", quickPacing);
    const shinyFilter = document.querySelector("#pc-shiny.on");
    if (shinyFilter) await pacedClick(shinyFilter, "异色筛选", quickPacing);
    for (const filter of [...document.querySelectorAll("#pc-active button")]) {
      await pacedClick(filter, "电脑筛选按钮", quickPacing);
    }
    const search = document.querySelector("#pc-search");
    if (search) {
      search.value = "";
      await jitter(140, 360);
      search.dispatchEvent(new Event("input", { bubbles: true }));
      await jitter(180, 420);
    }

    let current = [...readSave().team];
    for (const uid of current.filter((item) => !desiredUids.includes(item))) {
      const slot = document.querySelector(`#team-slots [data-team-uid="${CSS.escape(uid)}"]`);
      const pcGrid = document.querySelector("#pc-grid");
      await dragPokemon(slot, pcGrid, "移除队伍成员");
      await waitFor(() => !readSave().team.includes(uid), { label: "移除队伍成员" });
    }

    for (const uid of desiredUids) {
      if (readSave().team.includes(uid)) continue;
      const mon = readSave().mons.find((item) => item.uid === uid);
      if (!mon) continue;
      if (search) {
        search.value = species(mon.id)?.n || "";
        await jitter(140, 360);
        search.dispatchEvent(new Event("input", { bubbles: true }));
        await jitter(180, 420);
      }
      const card = await waitFor(
        () => document.querySelector(`#pc-grid .pc-cell[data-uid="${CSS.escape(uid)}"]`),
        { label: `电脑中的${species(mon.id)?.n || mon.id}` },
      );
      const emptySlot = document.querySelector("#team-slots .slot.empty");
      await dragPokemon(card, emptySlot, `将${species(mon.id)?.n || mon.id}加入队伍`);
      await waitFor(() => readSave().team.includes(uid), { label: "加入队伍" });
    }

    current = [...readSave().team];
    for (const uid of current.filter((item) => !desiredUids.includes(item))) {
      if (readSave().team.length <= desiredUids.length) break;
      const slot = document.querySelector(`#team-slots [data-team-uid="${CSS.escape(uid)}"]`);
      const pcGrid = document.querySelector("#pc-grid");
      await dragPokemon(slot, pcGrid, "清理多余成员");
      await waitFor(() => !readSave().team.includes(uid), { label: "清理多余成员" });
    }

    if (search) {
      search.value = "";
      await jitter(140, 360);
      search.dispatchEvent(new Event("input", { bubbles: true }));
      await jitter(180, 420);
    }
    const final = readSave().team;
    if (desiredUids.some((uid) => !final.includes(uid))) throw new Error("第五队未能完整应用");
  }

  function pokemonHomeRegion(mon) {
    if (mon?.reg === "kanto2") return "johto";
    return ["kanto", "johto", "hoenn", "sinnoh", "unova"].includes(mon?.reg) ? mon.reg : "kanto";
  }

  function isMonAvailableInCurrentRegion(save, mon) {
    if (!save?.link) return true;
    const side = pokemonHomeRegion(mon) === save.link.to ? "to" : "from";
    return side === save.link.side;
  }

  function availableTeamCandidates(save) {
    return (save?.mons || []).filter((mon) => mon?.uid && mon.level > 0 && isMonAvailableInCurrentRegion(save, mon));
  }

  function teamIdentity(mon) {
    const singleFormBase = species(mon?.id)?.u;
    return singleFormBase == null ? "species:" + mon?.id : "single:" + singleFormBase;
  }

  function preferredTeamCandidates(save, config = settings.candidatePool) {
    const pool = normalizeCandidatePool(config);
    if (!pool.enabled) return [];
    const selected = new Set(pool.uids);
    return availableTeamCandidates(save).filter((mon) => selected.has(String(mon.uid)) && combinedStatValue(mon) + 1e-9 >= pool.minPower);
  }

  function teamCandidatesForRecommendation(save) {
    return availableTeamCandidates(save);
  }

  function requiredTeamSize(save) {
    return Math.min(6, new Set(teamCandidatesForRecommendation(save).map(teamIdentity)).size);
  }

  function duplicateKeepCandidates(save, regions = settings.duplicateKeepRegions) {
    const representatives = new Map();
    for (const mon of save.mons || []) {
      const meta = species(mon.id);
      if (!meta || meta.g || meta.m) continue;
      if (!regions.includes(pokemonHomeRegion(mon))) continue;
      if (representatives.has(mon.id)) continue;
      representatives.set(mon.id, mon);
    }
    return [...representatives.entries()].map(([id, mon]) => ({ id, mon }));
  }

  function renderDuplicateKeepProgress() {
    const root = document.querySelector("#pca-duplicate-keep-status");
    if (!root) return;
    const progress = runtime.duplicateKeep;
    if (!progress) {
      root.textContent = t("duplicateKeepIdle");
      return;
    }
    root.textContent = language() === "en"
      ? `${progress.done}/${progress.total} · changed ${progress.changed} · skipped ${progress.skipped}${progress.cancelled ? " · cancelled" : ""}`
      : `${progress.done}/${progress.total} · 已更改${progress.changed} · 跳过${progress.skipped}${progress.cancelled ? " · 已取消" : ""}`;
  }

  async function revealPokemonCard(mon) {
    await openScreen("team");
    const quickPacing = { beforeMin: 180, beforeMax: 420, afterMin: 120, afterMax: 300 };
    const evoFilter = document.querySelector("#pc-evo.on");
    if (evoFilter) await pacedClick(evoFilter, language() === "en" ? "Evolution filter" : "进化筛选", quickPacing);
    const shinyFilter = document.querySelector("#pc-shiny.on");
    if (shinyFilter) await pacedClick(shinyFilter, language() === "en" ? "Shiny filter" : "异色筛选", quickPacing);
    for (const filter of [...document.querySelectorAll("#pc-active button")]) {
      await pacedClick(filter, language() === "en" ? "PC filter" : "电脑筛选按钮", quickPacing);
    }
    const search = document.querySelector("#pc-search");
    let card = document.querySelector(`#team-slots [data-team-uid="${CSS.escape(String(mon.uid))}"]`);
    if (!card && search) {
      search.value = species(mon.id)?.n || "";
      search.dispatchEvent(new Event("input", { bubbles: true }));
      await jitter(180, 420);
      card = await waitFor(
        () => document.querySelector(`#pc-grid .pc-cell[data-uid="${CSS.escape(String(mon.uid))}"]`),
        { label: language() === "en" ? "Buddy candidate in the PC" : "电脑中的伙伴候选" },
      );
    }
    if (!card) throw new Error(`找不到伙伴候选：${species(mon.id)?.n || mon.id}`);
    return { card, search, quickPacing };
  }

  async function setBuddyThroughGame(mon) {
    const { card, search, quickPacing } = await revealPokemonCard(mon);
    await pacedClick(card, `${species(mon.id)?.n || mon.id}${language() === "en" ? " details" : "详情"}`, quickPacing);
    const detail = await waitFor(() => document.querySelector(".dexcard.v2"), { label: language() === "en" ? "Pokemon details" : "宝可梦详情" });
    try {
      const toggle = detail.querySelector(".dc-buddy");
      if (!toggle) throw new Error("宝可梦详情中缺少伙伴按钮");
      if (toggle.getAttribute("aria-pressed") !== "true") {
        await pacedClick(toggle, language() === "en" ? "Set Buddy" : "设置伙伴", quickPacing);
        await waitFor(
          () => String(readSave().buddy?.uid) === String(mon.uid),
          { label: language() === "en" ? "Buddy update" : "伙伴更新" },
        );
      }
    } finally {
      const close = detail.querySelector(".dc-x");
      if (close) await pacedClick(close, language() === "en" ? "close details" : "关闭详情", quickPacing);
      if (search?.value) {
        search.value = "";
        search.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
  }

  async function manageBuddy(save) {
    if (!settings.autoBuddy || save?.adv?.battle || save?.adv?.event) return false;
    if (Date.now() - runtime.lastBuddyCheckAt < 5_000) return false;
    runtime.lastBuddyCheckAt = Date.now();
    const candidate = bestBuddyCandidate(save);
    if (!candidate) {
      runtime.buddyStatus = t("buddyComplete");
      return false;
    }
    runtime.buddyStatus = buddyStatusText(save);
    if (String(save.buddy?.uid) === String(candidate.mon.uid)) return false;
    const changed = await exclusive(t("autoBuddyTitle"), () => setBuddyThroughGame(candidate.mon));
    if (!changed) return false;
    const current = readSave();
    runtime.buddyStatus = buddyStatusText(current);
    log(language() === "en"
      ? `Automatic Buddy: ${species(candidate.mon.id)?.n || candidate.mon.id} · Lv.${candidate.mon.level}/${candidate.cap} · combined ${candidate.power}`
      : `自动伙伴：${species(candidate.mon.id)?.n || candidate.mon.id} · Lv.${candidate.mon.level}/${candidate.cap} · 综合能力${candidate.power}`);
    return true;
  }

  async function setDuplicateKeepForMon(mon, enabled) {
    await openScreen("team");
    const quickPacing = { beforeMin: 250, beforeMax: 600, afterMin: 150, afterMax: 350 };
    const search = document.querySelector("#pc-search");
    let card = document.querySelector(`#team-slots [data-team-uid="${CSS.escape(mon.uid)}"]`);
    if (!card && search) {
      search.value = species(mon.id)?.n || "";
      search.dispatchEvent(new Event("input", { bubbles: true }));
      await jitter(180, 420);
      card = document.querySelector(`#pc-grid .pc-cell[data-uid="${CSS.escape(mon.uid)}"]`);
    }
    if (!card) return false;
    await pacedClick(card, `${species(mon.id)?.n || mon.id}详情`, quickPacing);
    const detail = await waitFor(() => document.querySelector(".dexcard.v2"), { label: "宝可梦详情" });
    try {
      const toggle = detail.querySelector(".keep-row");
      if (!toggle) return false;
      const current = toggle.getAttribute("aria-checked") === "true";
      if (current === enabled) return "unchanged";
      await pacedClick(toggle, t("duplicateKeepTitle"), quickPacing);
      await waitFor(
        () => detail.querySelector(".keep-row")?.getAttribute("aria-checked") === String(enabled),
        { label: t("duplicateKeepTitle") },
      );
      return "changed";
    } finally {
      const close = detail.querySelector(".dc-x");
      if (close) await pacedClick(close, language() === "en" ? "close details" : "关闭详情", quickPacing);
    }
  }

  async function bulkSetDuplicateKeeps(enabled) {
    if (runtime.duplicateKeep?.active) return;
    if (!confirm(enabled ? t("duplicateKeepConfirmOn") : t("duplicateKeepConfirmOff"))) return;
    await exclusive(t("duplicateKeepTitle"), async () => {
      const candidates = duplicateKeepCandidates(readSave(), settings.duplicateKeepRegions);
      runtime.duplicateKeep = { active: true, enabled, total: candidates.length, done: 0, changed: 0, skipped: 0, cancelled: false };
      renderDuplicateKeepProgress();
      try {
        for (const { mon } of candidates) {
          if (runtime.duplicateKeep.cancelled) break;
          try {
            const result = await setDuplicateKeepForMon(mon, enabled);
            if (result === "changed") runtime.duplicateKeep.changed += 1;
            else runtime.duplicateKeep.skipped += 1;
          } catch (error) {
            runtime.duplicateKeep.skipped += 1;
            log(`${species(mon.id)?.n || mon.id}：${error.message}`);
          }
          runtime.duplicateKeep.done += 1;
          renderDuplicateKeepProgress();
        }
      } finally {
        const search = document.querySelector("#pc-search");
        if (search?.value) {
          search.value = "";
          search.dispatchEvent(new Event("input", { bubbles: true }));
        }
        runtime.duplicateKeep.active = false;
        renderDuplicateKeepProgress();
      }
      log(language() === "en"
        ? `Keep duplicates bulk action: ${runtime.duplicateKeep.changed} changed, ${runtime.duplicateKeep.skipped} skipped`
        : `批量保留重复：已更改${runtime.duplicateKeep.changed}，跳过${runtime.duplicateKeep.skipped}`);
    });
  }

  function habitatForRoute(route) {
    if (route.habitat && DATA.habitats[route.habitat]) return DATA.habitats[route.habitat];
    const exact = `${route.sourceName}|${route.areas.join("+")}`;
    if (DATA.habitats[exact]) return DATA.habitats[exact];
    const match = Object.entries(DATA.habitats).find(([key]) => key.startsWith(`${route.sourceName}|`));
    return match?.[1] || null;
  }

  function daytimePhaseAt(timestamp, forceDay = false) {
    if (forceDay) return "day";
    const hour = new Date(timestamp).getHours();
    if (hour >= 20 || hour < 8) return "night";
    if (hour >= 10) return "day";
    return "morning";
  }

  function currentDaytimePhase(save, chapterIndex = save.adv.chapter) {
    const forcedDay = Boolean(chapter(chapterIndex)?.day && !(save.adv.unlocked > chapterIndex));
    return daytimePhaseAt(Number(save.lastTick) || Date.now(), forcedDay);
  }

  function weatherHash(value) {
    let hash = 2_166_136_261;
    for (const char of value) hash = Math.imul(hash ^ char.charCodeAt(0), 16_777_619);
    hash ^= hash >>> 16;
    hash = Math.imul(hash, 2_246_822_507);
    hash ^= hash >>> 13;
    hash = Math.imul(hash, 3_266_489_909);
    hash ^= hash >>> 16;
    return (hash >>> 0) / 4_294_967_296;
  }

  function routeClimate(route, region) {
    const config = DATA.weather;
    const source = (typeof route.climate === "string" ? config.climates[route.climate] : route.climate)
      || config.climates[route.bg];
    if (!source) return null;
    const climate = { ...source };
    for (const key of config.regionOff?.[region] || []) delete climate[key];
    for (const weights of [config.regionWeights?.[region]?.all, config.regionWeights?.[region]?.[route.bg]]) {
      for (const [key, multiplier] of Object.entries(weights || {})) {
        if (climate[key]) climate[key] *= multiplier;
      }
    }
    return Object.keys(climate).length ? climate : null;
  }

  function chapterClimate(item) {
    const climate = {};
    for (const route of item.routes) {
      if (route.indoor) continue;
      for (const [key, weight] of Object.entries(routeClimate(route, item.region) || {})) {
        climate[key] = (climate[key] || 0) + weight;
      }
    }
    return Object.keys(climate).length ? climate : null;
  }

  function generatedWeatherForRoute(item, route, timestamp, phase) {
    const ownClimate = routeClimate(route, item.region);
    if (!ownClimate || route.indoor) return null;
    const slot = Math.floor(timestamp / DATA.weather.slotMs);
    const chapterKey = `ch${item.index}`;
    let run = 0;
    while (run < 64 && weatherHash(`${chapterKey}|${slot - run}`) < DATA.weather.chance) run += 1;
    if (run % 2 === 0) return null;

    const choices = Object.entries(chapterClimate(item) || ownClimate)
      .filter(([key]) => !(phase === "night" && DATA.weather.types[key]?.daylight));
    if (!choices.length) return null;
    const total = choices.reduce((sum, [, weight]) => sum + weight, 0);
    let roll = weatherHash(`${slot}|${chapterKey}`) * total;
    let selected = choices[0][0];
    for (const [key, weight] of choices) {
      roll -= weight;
      if (roll <= 0) {
        selected = key;
        break;
      }
    }
    const supported = (key) => ownClimate[key] && !(phase === "night" && DATA.weather.types[key]?.daylight);
    if (supported(selected)) return selected;
    return (DATA.weather.translate[selected] || []).find(supported) || null;
  }

  function currentWeatherForRoute(save, item, route, timestamp, phase) {
    if (Object.hasOwn(route, "weather")) return route.weather;
    if (!routeClimate(route, item.region) || route.indoor) return null;
    const slot = Math.floor(timestamp / DATA.weather.slotMs);
    if (item.weather) return Array.isArray(item.weather) ? item.weather[slot % item.weather.length] : item.weather;
    const roamer = Object.entries(save.roam?.at || {}).find(([, value]) => (
      Number(value?.ch) === item.index && Number(value?.until) > timestamp
    ));
    if (roamer && DATA.roamingWeather[roamer[0]]) return DATA.roamingWeather[roamer[0]];
    return generatedWeatherForRoute(item, route, timestamp, phase);
  }

  function habitatWeights(habitat, phase, weather) {
    const weights = {};
    for (const table of [habitat?.base, habitat?.[phase], habitat?.[weather]]) {
      if (!table || typeof table !== "object") continue;
      for (const [id, weight] of Object.entries(table)) {
        if (Number(weight) > 0) weights[id] = Number(weight);
        else delete weights[id];
      }
    }
    return weights;
  }

  function routeWeights(route, phase, weather) {
    const habitat = habitatForRoute(route);
    const weights = habitatWeights(habitat, phase, weather);
    if (!habitat) {
      for (const id of route.species || []) weights[id] = Math.max(weights[id] || 0, 1);
      for (const area of route.areas || []) {
        for (const entry of DATA.encounters[area] || []) {
          const [id, , , weight, method] = entry;
          if (method === "gift") continue;
          weights[id] = Math.max(weights[id] || 0, Number(weight) || 1);
        }
      }
    }
    return weights;
  }

  function availableChapters(save) {
    const regions = new Set(collectionScopeRegions(save));
    return DATA.chapters.filter((item) => item.index <= save.adv.unlocked && regions.has(item.region));
  }

  function unlockedRegions(save) {
    return [...new Set(DATA.chapters
      .filter((item) => item.index <= save.adv.unlocked)
      .map((item) => item.region))];
  }

  function collectionScopeRegions(save) {
    const unlocked = unlockedRegions(save);
    if (settings.regionScope === "current") return [currentRegion(save)];
    if (settings.regionScope === "custom") return unlocked.filter((region) => settings.customRegions.includes(region));
    return unlocked;
  }

  function routeCanContainSpecies(route, speciesId) {
    const habitat = habitatForRoute(route);
    if (!habitat) return (route.species || []).includes(Number(speciesId));
    return Object.values(habitat).some((table) => Number(table?.[speciesId] || 0) > 0);
  }

  function chaptersInCollectionScope(save, options) {
    const includeStoryLocked = Boolean(options?.includeStoryLocked);
    const regions = new Set(collectionScopeRegions(save));
    return DATA.chapters.filter((item) => (
      regions.has(item.region) && (includeStoryLocked || item.index <= save.adv.unlocked)
    ));
  }

  function plansForSpecies(save, speciesId, timestamp = Number(save.lastTick) || Date.now()) {
    const plans = [];
    for (const item of availableChapters(save)) {
      for (const route of item.routes) {
        const phase = daytimePhaseAt(timestamp, Boolean(item.day && !(save.adv.unlocked > item.index)));
        const weather = currentWeatherForRoute(save, item, route, timestamp, phase);
        const weight = routeWeights(route, phase, weather)[speciesId] || 0;
        if (weight <= 0) continue;
        const dryWeight = routeWeights(route, phase, null)[speciesId] || 0;
        const weatherLimited = Boolean(weather && dryWeight <= 0);
        const prefixCost = route.stepIndex + 1;
        const score = weight * Math.max(1, route.wild) / prefixCost;
        plans.push({
          speciesId: Number(speciesId),
          chapter: item.index,
          chapterName: item.name,
          zone: route.name,
          sourceZone: route.sourceName,
          wild: route.wild,
          prefixCost,
          weight,
          score,
          phase,
          weather,
          weatherLimited,
        });
      }
      for (const encounter of item.staticEncounters || []) {
        if (Number(encounter.id) !== Number(speciesId)) continue;
        if (encounter.once && save.adv?.gifts?.[encounter.once]) continue;
        if ((encounter.caught || []).some((id) => !isCaught(save, id))) continue;
        const generated = save.adv.chapter === item.index && !save.adv.zone && !save.adv.event
          && (save.adv.nodes || []).some((node, index) => node.type === "static"
            && Number(node.id) === Number(speciesId) && index >= (save.adv.node ?? 0));
        if (!generated && encounter.needs && Number(save.items?.[encounter.needs] || 0) < Number(encounter.needN || 1)) continue;
        if (!generated && encounter.after && !save.adv.gifts?.[encounter.after]) continue;
        const phase = daytimePhaseAt(timestamp, Boolean(item.day && !(save.adv.unlocked > item.index)));
        if (!generated && encounter.night && phase !== "night") continue;
        if (!generated && encounter.day && phase === "night") continue;
        const weather = currentWeatherForRoute(save, item, encounter, timestamp, phase);
        if (!generated && encounter.skies?.length && !encounter.skies.includes(weather)) continue;
        const prefixCost = encounter.stepIndex + 1;
        const chance = Number(encounter.chance || 1);
        plans.push({
          speciesId: Number(speciesId),
          chapter: item.index,
          chapterName: item.name,
          zone: encounter.name,
          sourceZone: encounter.sourceName,
          static: true,
          staticOnce: encounter.once,
          prefixCost,
          weight: chance,
          score: chance / prefixCost,
          phase,
          weather,
          weatherLimited: Boolean(encounter.night || encounter.day || encounter.skies?.length),
          level: encounter.level || item.ace,
        });
      }
    }
    return plans.sort((a, b) => b.score - a.score || a.prefixCost - b.prefixCost);
  }

  function regionInCollectionScope(save, region) {
    if (settings.regionScope === "current") return currentRegion(save) === region;
    if (settings.regionScope === "custom") return settings.customRegions.includes(region);
    return true;
  }

  function ownsSpecialPrerequisite(save, id) {
    // 与游戏的 owns 一致：盒子、寄放屋以及地下通道远征中的实际个体。
    return (save.mons || []).some((mon) => Number(mon.id) === id)
      || (save.pension?.mons || []).some(({ mon }) => Number(mon?.id) === id)
      || (save.under?.slots || []).some((slot) => (slot.mons || []).some((mon) => Number(mon?.id) === id));
  }

  function isSpecialComplete(save, id) {
    const special = DATA.specialZones.find((item) => item.id === id);
    return special?.forms ? special.forms.every((form) => isCaught(save, form)) : isCaught(save, id);
  }

  function specialConditionStatus(save, condition, special) {
    if (!condition) return { met: true, reason: "" };
    if (condition.kind === "owns") {
      const missing = (condition.ids || []).filter((id) => !ownsSpecialPrerequisite(save, id));
      return missing.length
        ? { met: false, reason: `${language() === "en" ? "Needs" : "需要拥有"} ${missing.map((id) => species(id)?.n || id).join("、")}` }
        : { met: true, reason: "" };
    }
    if (condition.kind === "all") {
      const failed = (condition.list || [])
        .map((item) => specialConditionStatus(save, item, special))
        .find((item) => !item.met);
      return failed || { met: true, reason: "" };
    }
    if (condition.kind === "item") {
      const met = Number(save.items?.[condition.item] || 0) + Number(save.link?.stash?.items?.[condition.item] || 0) > 0;
      return { met, reason: met ? "" : (condition.text || `${language() === "en" ? "Needs item" : "需要道具"} ${condition.item}`) };
    }
    if (condition.kind === "door") {
      const met = Boolean(save.zoneDoors?.[condition.key]);
      return { met, reason: met ? "" : (condition.key === "regigigas"
        ? (language() === "en" ? "Solve the Snowpoint Temple inscription with Regirock, Regice and Registeel" : "带齐雷吉洛克、雷吉艾斯、雷吉斯奇鲁，在雪峰神殿解开碑文")
        : condition.text || t("specialConditionLocked")) };
    }
    if (condition.kind === "league") {
      const badge = DATA.chapters.find((item) => item.region === condition.region && item.boss?.champion)?.boss?.badge;
      const met = Boolean(badge && save.adv.badges?.includes(badge));
      return { met, reason: met ? "" : (condition.text || t("specialConditionLocked")) };
    }
    if (condition.kind === "dex" && special.dex) {
      const missing = Object.keys(DATA.species).map(Number).filter((id) => (
        id >= special.dex[0] && id <= special.dex[1] && !species(id)?.m && !isCaught(save, id)
      ));
      return { met: missing.length === 0, reason: missing.length ? (condition.text || t("specialConditionLocked")) : "" };
    }
    if (condition.kind === "type" && special.dex) {
      const missing = Object.keys(DATA.species).map(Number).filter((id) => (
        id >= special.dex[0] && id <= special.dex[1] && !species(id)?.g && !species(id)?.m
        && species(id)?.t?.includes(condition.type) && !isCaught(save, id)
      ));
      return { met: missing.length === 0, reason: missing.length ? (condition.text || t("specialConditionLocked")) : "" };
    }
    if (condition.kind === "types" && condition.dex) {
      const missing = Object.keys(DATA.species).map(Number).filter((id) => (
        id >= condition.dex[0] && id <= condition.dex[1]
        && id !== special.id && !species(id)?.m
        && !(species(id)?.g && id >= special.dex[0])
        && species(id)?.t?.some((type) => condition.types.includes(type))
        && !isCaught(save, id)
      ));
      return { met: missing.length === 0, reason: missing.length ? (condition.text || t("specialConditionLocked")) : "" };
    }
    if (condition.kind === "count" && special.dex) {
      const caught = Object.keys(DATA.species).map(Number).filter((id) => (
        id >= special.dex[0] && id <= special.dex[1] && !species(id)?.g && !species(id)?.m && isCaught(save, id)
      )).length;
      return { met: caught >= condition.need, reason: `${language() === "en" ? "Regional species" : "地区普通图鉴"} ${caught}/${condition.need}` };
    }
    if (condition.kind === "tally") {
      const value = Number(save.stats?.byReg?.[special.region]?.[condition.field] || 0);
      return { met: value >= condition.need, reason: `${(condition.text || "").replace("{n}", condition.need)} · ${value}/${condition.need}` };
    }
    if (condition.kind === "elite") {
      const tier = Number(save.elite?.[condition.zone]?.t || 0);
      return { met: tier >= condition.tier, reason: tier >= condition.tier ? "" : (condition.text || t("specialConditionLocked")) };
    }
    return { met: false, reason: condition.text || t("specialConditionLocked") };
  }

  function specialTargetStatus(save, speciesId) {
    const special = (DATA.specialZones || []).find((item) => item.id === Number(speciesId));
    if (!special) return null;
    const regionChapters = DATA.chapters.filter((item) => item.region === special.region && item.index <= save.adv.unlocked);
    if (!regionChapters.length) return { special, open: false, reason: t("specialRegionLocked"), chapter: null };
    if (!regionInCollectionScope(save, special.region)) return { special, open: false, reason: t("specialOutsideScope"), chapter: null };
    if (special.badge && !save.adv.badges?.includes(special.badge)) {
      return { special, open: false, reason: language() === "en"
        ? `Needs badge: ${special.badgeName || special.badge}`
        : `需要徽章：${special.badgeName || special.badge}`, chapter: null };
    }
    const normalChapters = regionChapters.filter((item) => !item.league);
    const chapterPlan = normalChapters.find((item) => item.index === special.anchor)
      || normalChapters.find((item) => item.routes.some((route) => route.areas.some((area) => special.areas.includes(area))))
      || normalChapters.at(-1);
    if (!insideNormalSpecial(save, special.id)) {
      const condition = specialConditionStatus(save, special.condition, special);
      if (!condition.met) return { special, open: false, reason: condition.reason, chapter: null };
      const reason = specialTimingStatus(save, special) || specialEntryIssue(special.id);
      if (reason) return { special, open: false, reason, chapter: null };
    }
    return { special, open: true, reason: "", chapter: chapterPlan?.index ?? null };
  }

  function specialPlansForSpecies(save, speciesId) {
    const status = specialTargetStatus(save, speciesId);
    if (!status?.open || status.chapter == null || isSpecialComplete(save, Number(speciesId))) return [];
    return [{
      speciesId: Number(speciesId),
      chapter: status.chapter,
      chapterName: chapter(status.chapter)?.name,
      zone: status.special.zone,
      sourceZone: status.special.sourceZone,
      region: status.special.region,
      special: true,
      score: 0.5,
      prefixCost: 1,
      level: status.special.level,
    }];
  }

  const moonCalendar = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit",
  });

  function specialMoonAt(timestamp) {
    // 游戏以巴黎时间 08:00 为月相分界，循环为 8 天。
    const parts = Object.fromEntries(moonCalendar.formatToParts(timestamp - 28_800_000)
      .map(({ type, value }) => [type, Number(value)]));
    const day = Date.UTC(parts.year, parts.month - 1, parts.day) / 86_400_000;
    const phase = (day % 8 + 8) % 8;
    if (phase < 2) return "full";
    if (phase === 4 || phase === 5) return "new";
    return phase < 4 ? "wane" : "wax";
  }

  function specialTimingStatus(save, special) {
    const now = Number(save.lastTick) || Date.now();
    const night = currentDaytimePhase(save) === "night";
    if (special.moon && (!night || specialMoonAt(now) !== special.moon)) {
      const full = special.moon === "full";
      return language() === "en" ? (full ? "Wait for a full-moon night" : "Wait for a new-moon night")
        : (full ? "等待满月夜" : "等待新月夜");
    }
    if (special.when && (special.when === "night") !== night) {
      return language() === "en" ? `Wait for ${special.when}` : (special.when === "night" ? "等待夜间" : "等待白天（含早晨）");
    }
    return "";
  }

  function specialEntryIssue(id) {
    const blocked = runtime.specialEntryBlocks.get(id);
    if (!blocked) return "";
    if (blocked.until > Date.now()) return blocked.reason;
    runtime.specialEntryBlocks.delete(id);
    return "";
  }

  function insideNormalSpecial(save, id) {
    return Number(save.adv.zone?.id) === id && !save.adv.zone.elite && !save.adv.zone.riddle;
  }

  function specialChoiceIds() {
    return [...new Set([...settings.manualTargets, ...DATA.specialZones.map((item) => item.id)])];
  }

  function clearCollectionTarget() {
    runtime.target = null;
    runtime.targetPlan = null;
    runtime.teamPlan = null;
    runtime.attempts = 0;
  }

  async function specialCollectionTick(save, plan) {
    const id = plan.speciesId;
    const freshTarget = runtime.target !== `special:${id}`;
    if (freshTarget) {
      runtime.target = `special:${id}`;
      runtime.targetPlan = plan;
      runtime.waitingPlan = null;
      runtime.userTeamOverride = false;
      runtime.attempts = 0;
      runtime.lastSpecialTries = Number(save.legTries?.[save.adv.zone?.foe ?? id] || 0);
    }
    const foe = insideNormalSpecial(save, id) ? Number(save.adv.zone.foe ?? id) : id;
    const tries = Number(save.legTries?.[foe] || 0);
    if (!freshTarget && tries > runtime.lastSpecialTries) {
      runtime.attempts += tries - runtime.lastSpecialTries;
    }
    runtime.lastSpecialTries = tries;
    if (insideNormalSpecial(save, id)) return;

    await exclusive("进入特殊捕获地点", async () => {
      // 只在地区不同的时候先切章节。特殊地点本身不要求玩家在关联章节。
      if (currentRegion(readSave()) !== plan.region) await switchChapter(plan.chapter);
      const local = readSave();
      const team = recommendRoamingTeam(local, id);
      await applyRecommendedTeam(team, species(id)?.n || String(id));
      const result = await enterSpecialZone(plan);
      if (result.entered) {
        const entered = readSave();
        runtime.lastSpecialTries = Number(entered.legTries?.[entered.adv.zone?.foe ?? id] || 0);
        return;
      }
      // 以游戏按钮为最终判据。临时关闭时跳过，稍后重检，其余目标继续运行。
      runtime.specialEntryBlocks.set(id, { reason: result.reason, until: Date.now() + 60_000 });
      clearCollectionTarget();
      runtime.collectionQueueSignature = "";
      runtime.teamStatus = `${plan.zone} · ${result.reason}`;
      log(runtime.teamStatus);
      await openScreen("adventure");
    });
  }

  async function legendaryCollectionTick(save, collectMissing) {
    const old = runtime.targetPlan;
    if (old?.special && isSpecialComplete(save, old.speciesId)) {
      notifyUser("神兽捕获成功", `${species(old.speciesId)?.n || old.speciesId}已登记图鉴`);
      clearCollectionTarget();
    }

    // 让已进入的普通捕获挑战自然跑完，除非前面的徘徊调度接管。
    const activeId = Number(save.adv.zone?.id);
    if (insideNormalSpecial(save, activeId)) {
      const activePlan = specialPlansForSpecies(save, activeId)[0];
      if (activePlan) {
        await specialCollectionTick(save, activePlan);
        return true;
      }
      if (old?.special && old.speciesId === activeId) return true;
    }

    // 协同模式尊重手填普通目标，例如 479-A；徘徊目标仍按原有实时优先级处理。
    for (const id of settings.manualTargets) {
      if (isCaught(save, id) || ROAMING_LEGENDARIES.includes(id)) continue;
      const plan = specialPlansForSpecies(save, id)[0];
      if (plan) {
        await specialCollectionTick(save, plan);
        return true;
      }
      if (collectMissing && plansForSpecies(save, id).length) return false;
    }

    const plan = specialChoiceIds().map((id) => specialPlansForSpecies(save, id)[0]).find(Boolean);
    if (plan) {
      await specialCollectionTick(save, plan);
      return true;
    }
    if (runtime.targetPlan?.special) clearCollectionTarget();
    return false;
  }

  function legendaryManualStatus(save, id) {
    if (id === 489) return language() === "en" ? "Day Care: hatch a Phione egg" : "寄放屋：玛纳霏或霏欧纳配合百变怪产蛋后孵化";
    if (id === 490) return language() === "en" ? "After the Sinnoh League: sea-route egg drop, then hatch" : "神奥冠军后：220／223／226号水路掉蛋后孵化";
    if (id === 493) return language() === "en" ? "World Boss: Hall of Origin, when the game opens it" : "世界首领：初始之间，开放后从游戏活动页挑战";
    if (species(id)?.u === 493) return language() === "en" ? "Arceus with the matching Underground plate" : "阿尔宙斯使用对应的地下通道石板变换形态";
    return t("waitingCondition");
  }

  function fixedLegendaryListHtml(save) {
    if (!save) return "";
    const visible = DATA.specialZones.filter((item) => regionInCollectionScope(save, item.region));
    const ids = visible.map(({ id }) => id);
    if (regionInCollectionScope(save, "sinnoh")) {
      ids.push(489, 490, 493, ...Object.keys(DATA.species).map(Number).filter((id) => species(id)?.u === 493));
    }
    return ids.map((id) => {
      const status = specialTargetStatus(save, id);
      const reason = isSpecialComplete(save, id) ? t("caught")
        : status ? `${status.special.zone} · ${status.open ? t("available") : status.reason}`
          : legendaryManualStatus(save, id);
      const label = `#${speciesDisplayNumber(id)} ${species(id)?.n || id}`;
      return `<div class="pca-target"><b>${escapeHtml(label)}</b><small>${escapeHtml(reason)}</small></div>`;
    }).join("");
  }

  function collectionPlansForSpecies(save, speciesId, timestamp = Number(save.lastTick) || Date.now()) {
    return [...plansForSpecies(save, speciesId, timestamp), ...specialPlansForSpecies(save, speciesId)]
      .sort((a, b) => compareCollectionPlans(save, a, b));
  }

  function potentialWildTarget(save, speciesId, options) {
    const includeStoryLocked = Boolean(options?.includeStoryLocked);
    for (const item of chaptersInCollectionScope(save, { includeStoryLocked })) {
      for (const route of item.routes) {
        if (routeCanContainSpecies(route, speciesId)) return true;
      }
      if ((item.staticEncounters || []).some((encounter) => Number(encounter.id) === Number(speciesId))) return true;
    }
    return false;
  }

  function storyLockedChapterForSpecies(save, speciesId) {
    return chaptersInCollectionScope(save, { includeStoryLocked: true })
      .filter((item) => item.index > save.adv.unlocked)
      .find((item) => item.routes.some((route) => routeCanContainSpecies(route, speciesId))
        || (item.staticEncounters || []).some((encounter) => Number(encounter.id) === Number(speciesId))) || null;
  }

  function conditionContainsKind(condition, kind) {
    if (!condition) return false;
    if (condition.kind === kind) return true;
    return condition.kind === "all" && (condition.list || []).some((item) => conditionContainsKind(item, kind));
  }

  function specialNeedsStoryUnlock(save, special) {
    if (special.badge && !save.adv.badges?.includes(special.badge)) return true;
    if (conditionContainsKind(special.condition, "league")) return true;
    return DATA.chapters.some((item) => (
      item.region === special.region && item.index > save.adv.unlocked
      && item.routes.some((route) => route.areas.some((area) => special.areas.includes(area)))
    ));
  }

  function collectionStoryUnlockPlan(save) {
    if (!settings.autoPushForCollection) return null;
    const scope = new Set(collectionScopeRegions(save));
    const manual = settings.manualTargets.filter((id) => !isCaught(save, id));
    const automatic = Object.keys(DATA.species).map(Number).filter((id) => !isCaught(save, id));
    const targetIds = [...manual, ...automatic.filter((id) => !manual.includes(id))];

    for (const region of scope) {
      const all = DATA.chapters.filter((item) => item.region === region);
      const unlocked = all.filter((item) => item.index <= save.adv.unlocked);
      const frontier = unlocked.at(-1);
      const final = all.at(-1);
      if (!frontier || !final) continue;
      const finalBadge = final.boss?.badge;
      if (frontier.index === final.index && finalBadge && save.adv.badges?.includes(finalBadge)) continue;

      const locked = all.filter((item) => item.index > save.adv.unlocked);
      const targetId = targetIds.find((id) => locked.some((item) => (
        item.routes.some((route) => routeCanContainSpecies(route, id))
        || (item.staticEncounters || []).some((encounter) => Number(encounter.id) === Number(id))
      )));
      const lockedSpecial = (DATA.specialZones || []).find((item) => (
        item.region === region && !isCaught(save, item.id)
        && !specialTargetStatus(save, item.id)?.open && specialNeedsStoryUnlock(save, item)
      ));
      if (!targetId && !lockedSpecial) continue;
      return {
        unlockForCollection: true,
        region,
        chapter: frontier.index,
        chapterName: frontier.name,
        targetId: targetId || lockedSpecial?.id || null,
        unlockedAtStart: save.adv.unlocked,
      };
    }
    return null;
  }

  function weatherFlexibility(save, plan) {
    const item = chapter(plan.chapter);
    const route = item?.routes.find((candidate) => candidate.name === plan.zone && candidate.sourceName === plan.sourceZone)
      || item?.routes.find((candidate) => candidate.name === plan.zone || candidate.sourceName === plan.sourceZone);
    const habitat = route && habitatForRoute(route);
    if (!habitat) return Number.POSITIVE_INFINITY;
    return Object.keys(DATA.weather.types).filter((weather) => Number(habitat[weather]?.[plan.speciesId] || 0) > 0).length || Number.POSITIVE_INFINITY;
  }

  function collectionRegionRank(save, plan) {
    const region = chapter(plan.chapter)?.region;
    const rank = collectionScopeRegions(save).indexOf(region);
    return rank >= 0 ? rank : REGION_ORDER.length;
  }

  function collectionTeamLevelForRegion(save, region) {
    const levels = (save?.mons || [])
      .filter((mon) => mon?.uid && Number(mon.level) > 0 && pokemonHomeRegion(mon) === region)
      .map((mon) => Number(mon.level))
      .sort((a, b) => b - a)
      .slice(0, 6);
    return levels.length ? levels.reduce((sum, level) => sum + level, 0) / levels.length : 0;
  }

  function collectionLevelFactor(save, plan) {
    const region = chapter(plan.chapter)?.region;
    const teamLevel = collectionTeamLevelForRegion(save, region);
    const mapLevel = Math.max(1, Number(plan.level || chapter(plan.chapter)?.ace || 1));
    if (teamLevel >= mapLevel) return 1;
    return Math.max(0.15, teamLevel / mapLevel);
  }

  function collectionPlanEfficiency(save, plan) {
    return Number(plan.score || 0) * collectionLevelFactor(save, plan);
  }

  function compareCollectionPlans(save, left, right) {
    return collectionRegionRank(save, left) - collectionRegionRank(save, right)
      || collectionPlanEfficiency(save, right) - collectionPlanEfficiency(save, left)
      || Number(left.prefixCost || 0) - Number(right.prefixCost || 0);
  }

  function planPriority(save, plan) {
    const manualIndex = settings.manualTargets.indexOf(plan.speciesId);
    const regionRank = collectionRegionRank(save, plan);
    const efficiency = collectionPlanEfficiency(save, plan);
    if (manualIndex >= 0) return [0, manualIndex, regionRank, -efficiency];
    if (plan.weatherLimited) return [1, regionRank, weatherFlexibility(save, plan), plan.weight || 0, -efficiency];
    return [2, regionRank, 0, -efficiency];
  }

  function comparePriority(left, right) {
    for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
      const difference = (left[index] || 0) - (right[index] || 0);
      if (difference) return difference;
    }
    return 0;
  }

  function buildCollectionQueue(save) {
    const bestBySpecies = new Map();
    for (const [id] of Object.entries(DATA.species)) {
      if (isSpecialComplete(save, Number(id))) continue;
      const option = collectionPlansForSpecies(save, Number(id))[0];
      if (option) bestBySpecies.set(Number(id), option);
    }
    return [...bestBySpecies.values()].sort((a, b) => comparePriority(planPriority(save, a), planPriority(save, b)));
  }

  function collectionQueueSignature(save) {
    const now = Number(save.lastTick) || Date.now();
    const caught = Object.values(save.dex || {}).reduce((total, item) => total + (Number(item?.caught || 0) > 0 ? 1 : 0), 0);
    const roamWeather = Object.entries(save.roam?.at || {})
      .map(([id, item]) => `${id}:${item?.ch}:${item?.until}:${Number(item?.until) > now ? 1 : 0}`)
      .sort().join("|");
    const unlocks = [
      save.adv.chapter,
      save.adv.unlocked,
      [...(save.adv.badges || [])].sort().join(","),
      Object.keys(save.zoneDoors || {}).filter((key) => save.zoneDoors[key]).sort().join(","),
      Object.entries(save.items || {}).filter(([, count]) => Number(count) > 0).map(([key]) => key).sort().join(","),
      JSON.stringify(save.stats?.byReg || {}),
      JSON.stringify(save.elite || {}),
    ].join("|");
    const activeSpecialBlocks = [...runtime.specialEntryBlocks.keys()].filter((id) => specialEntryIssue(id)).join(",");
    const liveStatics = save.adv.nodes?.filter((node, index) => node.type === "static" && index >= (save.adv.node ?? 0));
    const ownedLegendaries = Object.keys(DATA.species).filter((id) => {
      const mon = species(id);
      return (mon.g || mon.m) && ownsSpecialPrerequisite(save, Number(id));
    });
    const nativeCounters = [save.adv.zone?.id, save.adv.zone?.foe, specialMoonAt(now),
      liveStatics?.map((node) => node.id).join(","), activeSpecialBlocks, ownedLegendaries.join(","),
      JSON.stringify(save.link?.stash?.items || {})];
    const teamLevels = REGION_ORDER
      .map((region) => `${region}:${collectionTeamLevelForRegion(save, region).toFixed(2)}`)
      .join(",");
    return [Math.floor(now / DATA.weather.slotMs), daytimePhaseAt(now), caught, settings.regionScope,
      settings.customRegions.join(","), settings.manualTargets.join(","), roamWeather, unlocks, teamLevels, nativeCounters.join(":")].join(";");
  }

  function refreshCollectionQueue(save, force = false) {
    const signature = collectionQueueSignature(save);
    if (force || signature !== runtime.collectionQueueSignature) {
      runtime.collectionQueue = buildCollectionQueue(save);
      runtime.collectionQueueSignature = signature;
    }
    return runtime.collectionQueue;
  }

  function chooseMissingPlan(save) {
    return refreshCollectionQueue(save)[0] || null;
  }

  function nextConditionalPlan(save, hours = 168, targetIds = null) {
    const now = Number(save.lastTick) || Date.now();
    const start = Math.floor(now / DATA.weather.slotMs) * DATA.weather.slotMs;
    const automaticIds = Object.keys(DATA.species).map(Number);
    const ids = (targetIds || [...settings.manualTargets, ...automaticIds.filter((id) => !settings.manualTargets.includes(id))])
      .filter((id) => !isCaught(save, id));
    for (let offset = 1; offset <= hours; offset += 1) {
      const at = start + offset * DATA.weather.slotMs;
      const options = ids.flatMap((id) => plansForSpecies(save, id, at));
      if (options.length) {
        const plan = options.sort((a, b) => b.score - a.score || a.prefixCost - b.prefixCost)[0];
        return { ...plan, availableAt: at };
      }
    }
    return null;
  }

  function moneyFarmPlan(save) {
    const candidates = availableChapters(save)
      .map((item) => ({ item, route: [...item.routes].reverse().find((route) => route.wild > 0) }))
      .filter(({ route }) => route)
      .sort((a, b) => (b.item.ace || 0) - (a.item.ace || 0) || b.item.index - a.item.index);
    const selected = candidates[0];
    if (!selected) return null;
    return {
      moneyFarm: true,
      chapter: selected.item.index,
      chapterName: selected.item.name,
      zone: selected.route.name,
      sourceZone: selected.route.sourceName,
      score: selected.item.ace || 0,
    };
  }

  function activeRoamersFromState(roamAt, priorityIds, now = Date.now()) {
    const priority = new Map(priorityIds.map((id, index) => [id, index]));
    return Object.entries(roamAt || {})
      .map(([id, state]) => ({
        id: Number(id),
        chapter: state?.ch ?? state?.chapter,
        until: state?.until ?? state?.at ?? 0,
      }))
      .filter((item) => priority.has(item.id))
      .filter((item) => Number.isInteger(item.chapter) && Number(item.until) > now)
      .sort((a, b) => priority.get(a.id) - priority.get(b.id));
  }

  function activeRoamers(save) {
    return activeRoamersFromState(save.roam?.at, roamingPriorityIds());
  }

  function roamingCaughtStatus(save, id) {
    const roamCaught = Array.isArray(save.roam?.caught) && save.roam.caught.includes(id);
    const dexCaught = isCaught(save, id);
    return { caught: roamCaught || dexCaught, roamCaught, dexCaught };
  }

  function roamingTargetTransition(realtime, tries, previousTries, confirmCaught) {
    if (!realtime) return { type: "disappeared", caught: Boolean(confirmCaught()) };
    if (confirmCaught()) return { type: "conflict" };
    if (tries > previousTries) return { type: "failed", attempts: tries - previousTries };
    return { type: "tracking" };
  }

  function savedTimelinePlanStatus(save, plan) {
    const nodes = Array.isArray(save?.adv?.nodes) ? save.adv.nodes : [];
    const matchesZone = (node) => node?.name === plan.sourceZone || node?.name === plan.zone;
    const relevant = nodes.map((node, index) => ({ node, index })).filter(({ node }) => matchesZone(node));
    const wild = relevant.filter(({ node }) => node?.type === "wild");
    return {
      nodes,
      relevant,
      wild,
      lastWild: wild.at(-1)?.index ?? -1,
      current: Number.isInteger(save?.adv?.node) ? save.adv.node : -1,
    };
  }

  function savedStaticPlanStatus(save, plan) {
    const nodes = Array.isArray(save?.adv?.nodes) ? save.adv.nodes : [];
    const target = nodes.findIndex((node) => node?.type === "static" && Number(node?.id) === Number(plan.speciesId));
    return {
      nodes,
      target,
      current: Number.isInteger(save?.adv?.node) ? save.adv.node : -1,
    };
  }

  function timelinePlanStatus(save, plan) {
    const saved = savedTimelinePlanStatus(save, plan);
    if (saved.lastWild >= 0) return saved;

    const nodes = [...document.querySelectorAll("#timeline .tl-node")];
    const matchesZone = (node) => {
      const title = node.title || "";
      return title.startsWith(`${plan.zone} ·`) || title.startsWith(`${plan.sourceZone} ·`);
    };
    const relevant = nodes.map((node, index) => ({ node, index })).filter(({ node }) => matchesZone(node));
    const wild = relevant.filter(({ node }) => node.classList.contains("wild"));
    return {
      nodes,
      relevant,
      wild,
      lastWild: wild.at(-1)?.index ?? -1,
      current: nodes.findIndex((node) => node.classList.contains("current")),
    };
  }

  function observeBattle(save) {
    const battle = save.adv?.battle;
    if (!battle) return;
    const enemies = [
      ...(battle.enemies || []),
      ...(battle.foes || []),
    ];
    const ids = enemies.map((item) => Number(item?.id ?? item)).filter((id) => species(id));
    if (!ids.length) return;
    const set = runtime.observedEnemies.get(save.adv.chapter) || new Set();
    ids.forEach((id) => set.add(id));
    runtime.observedEnemies.set(save.adv.chapter, set);
    runtime.lastOpponent.set(save.adv.chapter, {
      signature: [...ids].sort((a, b) => a - b).join("-"),
      ids,
      maxLevel: Math.max(...enemies.map((item) => Number(item?.level || 0)), 0),
    });
  }

  async function pushTick(save) {
    const region = runtime.pushRegion || currentRegion(save);
    const regionChapters = DATA.chapters.filter((item) => item.region === region && item.index <= save.adv.unlocked);
    const frontierData = regionChapters.at(-1);
    if (!frontierData) throw new Error(`当前地区${region}没有可挑战章节`);
    const frontier = actualStoryChapter(save, frontierData.index);
    const finalRegionChapter = DATA.chapters.filter((item) => item.region === region).at(-1);
    const finalBadge = finalRegionChapter?.boss?.badge;
    if (frontier === finalRegionChapter?.index && finalBadge && save.adv.badges?.includes(finalBadge)) {
      notifyUser("当前地区推图完成", `${finalRegionChapter.name}已经通关。`);
      log(`当前地区已完成：${finalRegionChapter.name}`);
      stopMode();
      return;
    }
    if (save.adv.chapter !== frontier && !runtime.busy) {
      await exclusive("切换剧情前沿", () => switchChapter(frontier));
      return;
    }

    const targetKey = `push:${frontier}`;
    if (runtime.target !== targetKey) {
      runtime.target = targetKey;
      runtime.targetPlan = { chapter: frontier, chapterName: chapter(frontier)?.name };
      runtime.userTeamOverride = false;
      const failures = runtime.failureTeams.get(frontier) || new Set();
      const plan = recommendTeam(save, targetEnemiesForChapter(frontier), {
        excludedSignatures: failures,
        targetLevel: chapter(frontier)?.ace,
        chapterIndex: frontier,
      });
      await exclusive("生成推图阵容", () => applyRecommendedTeam(plan, chapter(frontier)?.name || `章节${frontier}`));
      return;
    }

    const deaths = Number(save.adv.deaths?.[frontier] || 0);
    const previous = Number(runtime.lastDeaths[frontier] ?? deaths);
    if (deaths > previous) {
      const delta = deaths - previous;
      runtime.attempts += delta;
      const bossLevels = chapter(frontier)?.boss?.team?.map(([, level]) => level) || [];
      const opponent = runtime.lastOpponent.get(frontier);
      const enemyMax = opponent?.maxLevel || Math.max(...bossLevels, 1);
      const teamMons = (save.teamSets?.list?.[4] || []).map((uid) => save.mons.find((mon) => mon.uid === uid)).filter(Boolean);
      const ourMin = teamMons.length ? Math.min(...teamMons.map((mon) => mon.level)) : 0;
      const signature = opponent?.signature || "unknown";
      const priorSeries = runtime.deathSeries.get(frontier);
      const series = priorSeries?.signature === signature
        ? { signature, count: priorSeries.count + delta }
        : { signature, count: delta };
      runtime.deathSeries.set(frontier, series);
      const fullTeamSize = requiredTeamSize(save);
      if (fullTeamSize > 0 && teamMons.length === fullTeamSize && ourMin >= enemyMax && series.count >= 3) {
        runtime.deathSeries.set(frontier, { signature, count: 0 });
        const failed = runtime.failureTeams.get(frontier) || new Set();
        if (runtime.teamPlan?.signature) failed.add(runtime.teamPlan.signature);
        runtime.failureTeams.set(frontier, failed);
        const plan = recommendTeam(save, targetEnemiesForChapter(frontier), {
          excludedSignatures: failed,
          targetLevel: chapter(frontier)?.ace,
          chapterIndex: frontier,
        });
        notifyUser("阵容需要调整", `同一章节连续失败，重新配置${chapter(frontier)?.name || "当前章节"}阵容。`);
        await exclusive("失败后重新配队", () => applyRecommendedTeam(plan, "连续失败后调整"));
      }
    }
    runtime.lastDeaths[frontier] = deaths;
  }

  async function collectionUnlockTick(save, plan) {
    const actual = actualStoryChapter(save, plan.frontier ?? plan.chapter);
    // 保留原剧情前沿用于判定何时重新扫描，配队则按当前联盟成员。
    const frontier = plan.frontier ?? plan.chapter;
    plan = { ...plan, frontier, chapter: actual, chapterName: chapter(actual)?.name || plan.chapterName };
    if (save.adv.chapter !== plan.chapter) {
      await exclusive("切换全收集解锁前沿", () => switchChapter(plan.chapter));
      return;
    }
    const targetKey = `unlock:${plan.region}:${plan.chapter}`;
    if (runtime.target !== targetKey || !runtime.teamPlan) {
      runtime.target = targetKey;
      runtime.targetPlan = plan;
      runtime.userTeamOverride = false;
      const fresh = readSave();
      const team = recommendTeam(fresh, targetEnemiesForChapter(plan.chapter), { targetLevel: chapter(plan.chapter)?.ace, chapterIndex: plan.chapter });
      await exclusive("配置全收集推图阵容", () => applyRecommendedTeam(team, `${plan.chapterName} · 解锁更多图鉴`));
      log(`为全收集推进${plan.chapterName}；下一次章节解锁后立即重新扫描`);
    }
  }

  async function collectTick(save, { trackRoamers, collectMissing }) {
    const roamers = trackRoamers ? activeRoamers(save).filter((item) => regionInCollectionScope(save, chapter(item.chapter)?.region)) : [];
    if (runtime.chapterReset) {
      const resettingRoamerId = runtime.targetPlan?.roaming ? runtime.targetPlan.speciesId : null;
      const resettingRoamer = resettingRoamerId ? roamers.find((item) => item.id === resettingRoamerId) : null;
      if (resettingRoamerId && !resettingRoamer) {
        runtime.chapterReset = null;
        log(`${species(resettingRoamerId)?.n || resettingRoamerId}已离开实时列表，取消未完成的章节重置`);
      } else {
        if (resettingRoamerId && roamingCaughtStatus(save, resettingRoamerId).caught) {
          diagnostic("神兽状态冲突", new Error(`${species(resettingRoamerId)?.n || resettingRoamerId}仍在实时列表，但 roam.caught 或图鉴已显示捕获`), {
            expected: "实时神兽条目与捕获状态一致",
            suggestion: "请刷新游戏确认神兽列表和图鉴；状态一致后再手动继续。",
          });
          return;
        }
        await exclusive("继续章节重置", continueChapterReset);
        return;
      }
    }

    const currentRoamerId = runtime.targetPlan?.roaming ? runtime.targetPlan.speciesId : null;
    const currentRoamer = currentRoamerId ? roamers.find((item) => item.id === currentRoamerId) : null;

    if (currentRoamerId) {
      const tries = Number(save.legTries?.[currentRoamerId] || 0);
      const previous = Number(runtime.lastRoamTries[currentRoamerId] ?? tries);
      const transition = roamingTargetTransition(
        currentRoamer,
        tries,
        previous,
        () => roamingCaughtStatus(save, currentRoamerId).caught,
      );

      if (transition.type === "conflict") {
        diagnostic("神兽状态冲突", new Error(`${species(currentRoamerId)?.n || currentRoamerId}仍在实时列表，但 roam.caught 或图鉴已显示捕获`), {
          expected: "实时神兽条目与捕获状态一致",
          suggestion: "请刷新游戏确认神兽列表和图鉴；状态一致后再手动继续。",
        });
        return;
      }

      if (transition.type === "failed") {
        runtime.attempts += transition.attempts;
        runtime.lastRoamTries[currentRoamerId] = tries;
        await exclusive("神兽捕获失败后重置", () => resetChapter(runtime.targetPlan));
        return;
      }

      if (transition.type === "tracking") {
        if (currentRoamer.chapter !== runtime.targetPlan.chapter || save.adv.chapter !== currentRoamer.chapter || save.adv.zone) {
          runtime.targetPlan = { ...runtime.targetPlan, chapter: currentRoamer.chapter, chapterName: chapter(currentRoamer.chapter)?.name, until: currentRoamer.until };
          await exclusive("跟随徘徊神兽", () => switchChapter(currentRoamer.chapter));
        }
        runtime.lastRoamTries[currentRoamerId] = tries;
        return;
      }

      const name = species(currentRoamerId)?.n || String(currentRoamerId);
      if (transition.caught) {
        notifyUser("神兽捕获成功", `${name}已从实时列表移除，并已确认捕获。`);
        log(`${name}已捕获，结束当前神兽目标并重新规划`);
      } else {
        notifyUser("神兽已离开", `${name}已从实时列表移除，未发现捕获记录。`);
        log(`${name}停留到期或已离开，结束当前神兽目标并重新规划`);
      }
      delete runtime.lastRoamTries[currentRoamerId];
      runtime.target = null;
      runtime.targetPlan = null;
      runtime.teamPlan = null;
      runtime.attempts = 0;
    }

    if (trackRoamers && roamers.length) {
      const roamer = roamers[0];
      const targetKey = `roam:${roamer.id}`;
      const tries = Number(save.legTries?.[roamer.id] || 0);
      const transition = roamingTargetTransition(
        roamer,
        tries,
        tries,
        () => roamingCaughtStatus(save, roamer.id).caught,
      );
      if (transition.type === "conflict") {
        diagnostic("神兽状态冲突", new Error(`${species(roamer.id)?.n || roamer.id}仍在实时列表，但 roam.caught 或图鉴已显示捕获`), {
          expected: "实时神兽条目与捕获状态一致",
          suggestion: "请刷新游戏确认神兽列表和图鉴；状态一致后再手动继续。",
        });
        return;
      }
      runtime.target = targetKey;
      runtime.targetPlan = {
        speciesId: roamer.id,
        chapter: roamer.chapter,
        chapterName: chapter(roamer.chapter)?.name,
        roaming: true,
        until: roamer.until,
      };
      runtime.userTeamOverride = false;
      runtime.attempts = 0;
      runtime.lastRoamTries[roamer.id] = tries;
      await exclusive("配置神兽阵容", async () => {
        const current = readSave().adv;
        if (current.chapter !== roamer.chapter || current.zone || current.event) await switchChapter(roamer.chapter);
        const plan = recommendRoamingTeam(readSave(), roamer.id);
        await applyRecommendedTeam(plan, species(roamer.id)?.n || String(roamer.id));
      });
      return;
    }

    if (trackRoamers && await legendaryCollectionTick(save, collectMissing)) return;

    if (!collectMissing) {
      if (runtime.target !== "roam:waiting") {
        runtime.target = "roam:waiting";
        runtime.targetPlan = null;
        runtime.teamPlan = null;
        runtime.teamStatus = t("waitingRoamers");
        runtime.attempts = 0;
        log(t("waitingRoamers"));
      }
      return;
    }

    if (runtime.targetPlan?.unlockForCollection) {
      const immediate = refreshCollectionQueue(save)[0] || null;
      const unlockedMore = save.adv.unlocked > runtime.targetPlan.unlockedAtStart;
      const finalBadge = chapter(runtime.targetPlan.frontier ?? runtime.targetPlan.chapter)?.boss?.badge;
      const finishedFinale = finalBadge && save.adv.badges?.includes(finalBadge);
      if (immediate || unlockedMore || finishedFinale) {
        log(immediate
          ? "出现可立即捕获的目标，暂停全收集推图并重新规划"
          : "全收集推图已产生新解锁，立即重新扫描缺失图鉴");
        runtime.target = null;
        runtime.targetPlan = null;
        runtime.teamPlan = null;
        runtime.collectionQueueSignature = "";
      } else {
        await collectionUnlockTick(save, runtime.targetPlan);
        return;
      }
    }

    const preferred = refreshCollectionQueue(save)[0] || null;
    if (runtime.targetPlan && !runtime.targetPlan.roaming && preferred && preferred.speciesId !== runtime.targetPlan.speciesId) {
      const shouldPreempt = runtime.targetPlan.moneyFarm
        || comparePriority(planPriority(save, preferred), planPriority(save, runtime.targetPlan)) < 0;
      if (shouldPreempt) {
        const oldName = runtime.targetPlan.moneyFarm ? t("moneyFarm") : species(runtime.targetPlan.speciesId)?.n;
        log(`${species(preferred.speciesId)?.n || preferred.speciesId}优先级已生效，暂停${oldName || "当前目标"}并重新规划`);
        runtime.target = null;
        runtime.targetPlan = null;
        runtime.teamPlan = null;
        runtime.chapterReset = null;
      }
    }

    if (runtime.targetPlan?.speciesId && !runtime.targetPlan.roaming && !isSpecialComplete(save, runtime.targetPlan.speciesId)) {
      const stillAvailable = collectionPlansForSpecies(save, runtime.targetPlan.speciesId).some((plan) => (
        plan.chapter === runtime.targetPlan.chapter && plan.zone === runtime.targetPlan.zone
      ));
      if (!stillAvailable) {
        log(`${species(runtime.targetPlan.speciesId)?.n || runtime.targetPlan.speciesId}当前昼夜或天气条件已变化，重新规划目标`);
        runtime.target = null;
        runtime.targetPlan = null;
        runtime.teamPlan = null;
        runtime.chapterReset = null;
      }
    }

    if (!runtime.targetPlan || (runtime.targetPlan.speciesId && isSpecialComplete(save, runtime.targetPlan.speciesId))) {
      const next = chooseMissingPlan(save);
      if (!next) {
        const unlock = collectionStoryUnlockPlan(save);
        if (unlock) {
          runtime.waitingPlan = null;
          runtime.target = null;
          runtime.targetPlan = unlock;
          runtime.teamPlan = null;
          runtime.attempts = 0;
          await collectionUnlockTick(save, unlock);
          return;
        }
        const waiting = nextConditionalPlan(save);
        if (waiting) {
          runtime.waitingPlan = waiting;
          const farm = moneyFarmPlan(save);
          const waitingKey = farm ? `farm:${farm.chapter}` : `dex:waiting:${waiting.speciesId}:${waiting.availableAt}`;
          if (runtime.target !== waitingKey) {
            const condition = [waiting.phase, waiting.weather].filter(Boolean).join(" / ");
            log(`等待${species(waiting.speciesId)?.n || waiting.speciesId}条件：${waiting.chapterName} · ${new Date(waiting.availableAt).toLocaleString()}${condition ? ` · ${condition}` : ""}`);
            if (farm) log(`等待期间前往${farm.chapterName}刷钱；天气目标出现时立即让位`);
          }
          runtime.target = waitingKey;
          runtime.targetPlan = farm;
          runtime.teamPlan = null;
          runtime.teamStatus = farm
            ? `${t("moneyFarm")}：${farm.chapterName}`
            : `${t("waitingCondition")}：${waiting.chapterName} · ${new Date(waiting.availableAt).toLocaleString()}`;
          return;
        }
        runtime.waitingPlan = null;
        if (trackRoamers) {
          clearCollectionTarget();
          runtime.target = "roam:waiting";
          runtime.teamStatus = t("waitingRoamers");
          return;
        }
        runtime.paused = true;
        notifyUser("自动捕获目标已完成", "当前范围只剩进化、孵蛋、交换、特殊事件或条件尚未满足的目标。 ");
        log("没有可自动刷取的缺失目标，已进入等待状态");
        return;
      }
      runtime.waitingPlan = null;
      runtime.targetPlan = next;
      runtime.target = `dex:${next.speciesId}`;
      runtime.userTeamOverride = false;
      runtime.attempts = 0;
      if (next.special) { await specialCollectionTick(save, next); return; }
      await exclusive("规划缺失图鉴", async () => {
        const current = readSave().adv;
        if (current.chapter !== next.chapter || current.zone || current.event) await switchChapter(next.chapter);
        const targetSave = readSave();
        const plan = recommendTeam(targetSave, [next.speciesId], {
          levelWeight: COLLECTION_LEVEL_WEIGHT,
          targetLevel: chapter(next.chapter)?.ace,
          chapterIndex: next.chapter,
        });
        await applyRecommendedTeam(plan, species(next.speciesId)?.n || String(next.speciesId));
      });
      return;
    }

    if (runtime.targetPlan.special) { await specialCollectionTick(save, runtime.targetPlan); return; }

    if (save.adv.chapter !== runtime.targetPlan.chapter || save.adv.zone) {
      const previousRegion = currentRegion(save);
      await exclusive("返回目标章节", async () => {
        await switchChapter(runtime.targetPlan.chapter);
        const targetSave = readSave();
        if (currentRegion(targetSave) !== previousRegion) {
          const plan = recommendTeam(targetSave, [runtime.targetPlan.speciesId], {
            levelWeight: COLLECTION_LEVEL_WEIGHT,
            targetLevel: chapter(runtime.targetPlan.chapter)?.ace,
            chapterIndex: runtime.targetPlan.chapter,
          });
          await applyRecommendedTeam(plan, species(runtime.targetPlan.speciesId)?.n || String(runtime.targetPlan.speciesId));
        }
      });
      return;
    }

    if (runtime.targetPlan.static) {
      const event = savedStaticPlanStatus(save, runtime.targetPlan);
      if (event.target < 0) {
        await exclusive("静态事件本轮未生成", () => resetChapter(runtime.targetPlan));
        return;
      }
      if (event.current > event.target) {
        runtime.attempts += 1;
        await exclusive("静态事件捕获未成功", () => resetChapter(runtime.targetPlan));
      }
      return;
    }

    const timeline = timelinePlanStatus(save, runtime.targetPlan);
    if (timeline.lastWild < 0) {
      await exclusive("本轮没有有效野生节点", () => resetChapter(runtime.targetPlan));
      return;
    }
    if (timeline.current > timeline.lastWild || (timeline.current < 0 && save.adv.node > timeline.lastWild)) {
      runtime.attempts += timeline.wild.length;
      await exclusive("有效节点已刷完", () => resetChapter(runtime.targetPlan));
    }
  }

  function berryUseCandidates(save, now = Number(save.lastTick) || Date.now()) {
    const choices = [];
    const enabled = Object.entries(settings.berries).filter(([, config]) => config.enabled);
    const byFamily = new Map();
    for (const [key, config] of enabled) {
      const info = BERRIES[key];
      if (!info) continue;
      const list = byFamily.get(info.family) || [];
      list.push({ key, config, info });
      byFamily.set(info.family, list);
    }

    for (const [family, options] of byFamily) {
      const active = save.buffs?.[family];
      const activeOnCurrentSide = active?.until > now && !(active.side === "from" && save.link?.side === "to");
      if (activeOnCurrentSide) continue;
      options.sort((a, b) => Number(b.key === "golden-razz-berry") - Number(a.key === "golden-razz-berry"));
      const choice = options.find(({ key, config }) => Number(save.items?.[key] || 0) > Number(config.reserve || 0));
      if (choice) choices.push({ ...choice, family });
    }
    return choices;
  }

  async function manageBerries(save) {
    if (Date.now() - runtime.lastBerryCheckAt < 5_000) return;
    runtime.lastBerryCheckAt = Date.now();
    for (const choice of berryUseCandidates(save)) {
      const button = document.querySelector(`#bag-panel .bag-cell[data-k="${choice.key}"]`);
      if (!button) {
        log(`${language() === "en" ? "Enabled" : "已启用"}${language() === "en" ? ` ${berryLabel(choice.info)}, but its page button is unavailable` : `${berryLabel(choice.info)}，但页面没有对应按钮`}`, "error");
        continue;
      }
      if (button.disabled || button.getAttribute("aria-disabled") === "true") continue;
      const countBefore = Number(save.items?.[choice.key] || 0);
      await pacedClick(button, berryLabel(choice.info));
      await waitFor(() => {
        const current = readSave();
        const buff = activeBuffAt(current, choice.family);
        return Number(current.items?.[choice.key] || 0) < countBefore && buff?.key === choice.key;
      }, { timeout: 5_000, label: language() === "en" ? `${berryLabel(choice.info)} activation` : `${berryLabel(choice.info)}生效` });
      log(language() === "en" ? `Auto-used: ${berryLabel(choice.info)}` : `自动使用：${berryLabel(choice.info)}`);
      break;
    }
  }

  function fifthTeamSignature(save) {
    const team = Number(save.teamSets?.on) === 4 ? save.team : save.teamSets?.list?.[4];
    return (team || []).join("|");
  }

  function detectManualTeamChange(save) {
    if (Date.now() - runtime.lastTeamCheckAt < 1_500 || !runtime.teamPlan || runtime.busy) return;
    runtime.lastTeamCheckAt = Date.now();
    const signature = fifthTeamSignature(save);
    if (runtime.lastTeamSignature && signature && signature !== runtime.lastTeamSignature) {
      runtime.userTeamOverride = true;
      runtime.teamStatus = "用户阵容（本目标不再覆盖）";
      runtime.lastTeamSignature = signature;
      log("检测到用户修改第五队，本目标改用用户阵容");
    }
  }

  async function tick() {
    if (runtime.busy) {
      try { await captureDebugState(readSave()); } catch (error) { log(`调试状态采集失败：${error.message}`, "error"); }
      renderStatus();
      return;
    }
    try {
      const save = readSave();
      await captureDebugState(save);
      if (save.adv?.event?.raid) {
        runtime.dailyRaidActiveRegion = save.adv.event.reg || null;
        renderStatus();
        return;
      }
      if (!settings.prioritizeDailyRaid) runtime.dailyRaidActiveRegion = null;
      if (!runtime.paused && !runtime.error && runtime.mode !== "idle" && await prioritizeDailyRaid(save)) {
        renderStatus();
        return;
      }
      if (!runtime.paused && !runtime.error && await manageBuddy(save)) {
        renderStatus();
        return;
      }
      if (!runtime.paused && !runtime.error) await manageBerries(save);
      if (runtime.mode === "idle" || runtime.paused) {
        renderStatus();
        return;
      }
      const current = readSave();
      observeBattle(current);
      detectManualTeamChange(current);
      if (current.adv.battle || current.adv.pending || current.adv.zone?.riddle || current.adv.zone?.elite || current.adv.league || current.adv.tower) {
        renderStatus();
        return;
      }
      if (runtime.mode === "push") await pushTick(current);
      else if (runtime.mode === "collect") await collectTick(current, { trackRoamers: false, collectMissing: true });
      else if (runtime.mode === "roaming") await collectTick(current, { trackRoamers: true, collectMissing: false });
      else if (runtime.mode === "combined") await collectTick(current, { trackRoamers: true, collectMissing: true });
      renderStatus();
    } catch (error) {
      diagnostic("主循环", error);
    }
  }

  function startMode(mode) {
    const compatibility = validateCompatibility();
    if (!compatibility.ok) {
      diagnostic("兼容性检查", new Error(`缺少页面节点：${compatibility.missing.join(", ")}`));
      return;
    }
    if (!compatibility.verified) {
      log(`游戏版本${compatibility.build}尚未验证；关键页面结构正常，继续运行并保留结构安全检查`);
    }
    runtime.mode = mode;
    runtime.pushRegion = mode === "push" ? currentRegion(readSave()) : null;
    runtime.paused = false;
    runtime.target = null;
    runtime.targetPlan = null;
    runtime.collectionQueue = [];
    runtime.collectionQueueSignature = "";
    runtime.waitingPlan = null;
    runtime.teamPlan = null;
    runtime.chapterReset = null;
    runtime.userTeamOverride = false;
    runtime.error = null;
    runtime.attempts = 0;
    localStorage.setItem(SESSION_KEY, JSON.stringify({ mode, running: true, at: Date.now() }));
    const labels = {
      push: "推图模式",
      collect: "普通图鉴收集",
      roaming: "神兽收集",
      combined: "普通图鉴与神兽协同收集",
    };
    log(`${labels[mode] || mode}已启动`);
    tick();
  }

  function pauseMode() {
    if (runtime.mode === "idle") return;
    runtime.paused = !runtime.paused;
    log(runtime.paused ? "任务已暂停" : "任务已继续");
    renderStatus();
  }

  function stopMode() {
    runtime.mode = "idle";
    runtime.paused = false;
    runtime.target = null;
    runtime.targetPlan = null;
    runtime.teamPlan = null;
    runtime.chapterReset = null;
    runtime.userTeamOverride = false;
    runtime.collectionQueue = [];
    runtime.collectionQueueSignature = "";
    runtime.waitingPlan = null;
    runtime.expectedChapter = null;
    runtime.pushRegion = null;
    localStorage.setItem(SESSION_KEY, JSON.stringify({ mode: "idle", running: false, at: Date.now() }));
    log("自动任务已停止");
    renderStatus();
  }

  async function copyTeam() {
    const source = Number(document.querySelector("#pca-copy-from")?.value);
    const destination = Number(document.querySelector("#pca-copy-to")?.value);
    if (source === destination) return alert("来源和目标不能相同");
    await openScreen("team");
    const save = readSave();
    const uids = save.teamSets?.list?.[source] || [];
    if (!uids.length) return alert(`队伍${source + 1}为空`);
    const target = save.teamSets?.list?.[destination] || [];
    const names = uids.map((uid) => {
      const mon = save.mons.find((item) => item.uid === uid);
      return species(mon?.id)?.n || "?";
    });
    if (target.length && !confirm(`队伍${destination + 1}非空，确定覆盖为：\n${names.join("、")}`)) return;
    await exclusive("复制队伍", () => configurePreset(destination, uids));
    log(`已将队伍${source + 1}复制到队伍${destination + 1}`);
  }

  function roamingPriorityIds() {
    return [
      ...settings.roamingPriority.filter((id) => ROAMING_LEGENDARIES.includes(id)),
      ...ROAMING_LEGENDARIES.filter((id) => !settings.roamingPriority.includes(id)),
    ];
  }

  function roamingPriorityHtml() {
    let save = null;
    try { save = readSave(); } catch { /* ignore */ }
    const now = Date.now();
    return roamingPriorityIds().map((id, index, ids) => {
      const meta = species(id);
      const state = save?.roam?.at?.[id] || {};
      const roamingChapter = state.ch ?? state.chapter;
      const until = state.until ?? state.at ?? 0;
      const group = ROAMING_GROUPS.find(({ ids }) => ids.includes(id));
      let status = t("notAppeared");
      if (save && roamingCaughtStatus(save, id).caught) status = t("caught");
      else if (save && !group.regions.some((region) => regionInCollectionScope(save, region))) status = t("specialOutsideScope");
      else if (save && !save.adv.badges?.includes(group.unlock)) {
        status = language() === "en" ? `Defeat the ${t(group.regions[0])} League` : `先通过${t(group.regions[0])}联盟`;
      }
      else if (Number.isInteger(roamingChapter) && until > now) {
        status = `${t("appearing")} · ${chapter(roamingChapter)?.name || `#${roamingChapter}`} · ${Math.ceil((until - now) / 60_000)} ${t("minutes")}`;
      }
      return `<div class="pca-priority-item"><b>${index + 1}. #${String(id).padStart(3, "0")} ${escapeHtml(meta?.n || id)}</b><span>${escapeHtml(status)}</span><button class="pca-btn" type="button" data-act="roam-up" data-roamer="${id}" ${index === 0 ? "disabled" : ""} aria-label="${t("moveUp")} ${escapeHtml(meta?.n || id)}">↑</button><button class="pca-btn" type="button" data-act="roam-down" data-roamer="${id}" ${index === ids.length - 1 ? "disabled" : ""} aria-label="${t("moveDown")} ${escapeHtml(meta?.n || id)}">↓</button></div>`;
    }).join("");
  }

  function renderRoamingPriority() {
    const root = document.querySelector("#pca-roaming-priority");
    if (root) root.innerHTML = roamingPriorityHtml();
    const fixed = document.querySelector("#pca-fixed-legendaries");
    if (fixed) {
      try { fixed.innerHTML = fixedLegendaryListHtml(readSave()); } catch { /* 游戏未就绪 */ }
    }
  }

  function moveRoamingPriority(id, offset) {
    const ids = roamingPriorityIds();
    const from = ids.indexOf(id);
    const to = from + offset;
    if (from < 0 || to < 0 || to >= ids.length) return;
    [ids[from], ids[to]] = [ids[to], ids[from]];
    settings.roamingPriority = ids;
    saveSettings();
    renderRoamingPriority();
    log(`徘徊神兽优先级：${ids.map((item) => species(item)?.n || item).join(" → ")}`);
  }

  function resolveManualTarget(token) {
    const raw = String(token || "").trim().replace(/^#/, "").replace(/^NO\.?/i, "");
    if (/^\d+$/.test(raw)) return Number(raw);
    const normalized = raw.toUpperCase().replace(/[\s_-]+/g, "");
    const entry = Object.entries(DATA.species).find(([, meta]) => (
      String(meta.d || "").toUpperCase().replace(/[\s_-]+/g, "") === normalized
      || String(meta.n || "").toUpperCase().replace(/[\s_-]+/g, "") === normalized
    ));
    return entry ? Number(entry[0]) : null;
  }

  function manualTargetsInputValue() {
    return settings.manualTargets.map(speciesDisplayNumber).join(",");
  }

  function manualTargetPreviewHtml(value) {
    const tokens = String(value || "").split(/[，,\s]+/).filter(Boolean);
    if (!tokens.length) return t("targetPrompt");
    let save = null;
    try { save = readSave(); } catch { /* ignore */ }
    return tokens.map((token) => {
      const id = resolveManualTarget(token);
      const meta = species(id);
      if (!meta) return `<span class="pca-target invalid">${escapeHtml(token)}: ${t("unknownPokemon")}</span>`;
      const labels = [`#${speciesDisplayNumber(id)} ${meta.n}`];
      let state = t("available");
      let className = "valid";
      if (ROAMING_LEGENDARIES.includes(id)) {
        state = t("managedRoamer");
        className = "warn";
      } else if (save && isCaught(save, id)) {
        state = t("caughtSkip");
        className = "warn";
      } else if (save) {
        const special = specialTargetStatus(save, id);
        if (special) {
          state = `${t("specialLocation")}：${special.special.zone} · ${special.open ? t("available") : special.reason}`;
          className = special.open ? "valid" : "warn";
        } else if (!plansForSpecies(save, id).length) {
          if (potentialWildTarget(save, id)) {
            const waiting = nextConditionalPlan(save, 168, [id]);
            state = waiting
              ? `${t("waitingCondition")}：${waiting.chapterName} · ${new Date(waiting.availableAt).toLocaleString()}`
              : t("waitingCondition");
          } else if (potentialWildTarget(save, id, { includeStoryLocked: true })) {
            const locked = storyLockedChapterForSpecies(save, id);
            state = `${t("storyLocked")}：${locked?.name || "—"}`;
          } else {
            state = t("noWildPlace");
          }
          className = "warn";
        } else if (meta.g || meta.m) {
          state = t("legendaryWild");
        }
      } else if (meta.g || meta.m) {
        state = t("legendaryWild");
      }
      return `<span class="pca-target ${className}">${escapeHtml(labels[0])}<small>${escapeHtml(state)}</small></span>`;
    }).join("");
  }

  function renderManualTargetPreview(value = document.querySelector("#pca-manual-targets")?.value) {
    const root = document.querySelector("#pca-manual-target-preview");
    if (root) root.innerHTML = manualTargetPreviewHtml(value);
  }

  function getCandidatePoolDraft() {
    if (!candidatePoolDraft) {
      const saved = normalizeCandidatePool(settings.candidatePool);
      candidatePoolDraft = { ...saved, uids: [...saved.uids], query: "", onlyEligible: true };
    }
    return candidatePoolDraft;
  }

  function candidatePoolRows(save, draft = getCandidatePoolDraft()) {
    const query = String(draft.query || "").normalize("NFKC").toLocaleLowerCase();
    const selected = new Set(draft.uids.map(String));
    return (save.mons || [])
      .filter((mon) => mon?.uid && species(mon.id) && mon.level > 0)
      .map((mon) => ({
        mon,
        uid: String(mon.uid),
        name: species(mon.id).n,
        number: speciesDisplayNumber(mon.id),
        power: combinedStatValue(mon),
        note: combinedStatNote(mon),
        eligible: isMonAvailableInCurrentRegion(save, mon),
        checked: selected.has(String(mon.uid)),
      }))
      .filter((row) => row.power + 1e-9 >= draft.minPower
        && (!draft.onlyEligible || row.eligible)
        && (!query || `${row.name} ${row.number} ${row.mon.id}`.normalize("NFKC").toLocaleLowerCase().includes(query)))
      .sort((a, b) => b.power - a.power || b.mon.level - a.mon.level || a.mon.id - b.mon.id);
  }

  function renderCandidatePool() {
    const list = document.querySelector("#pca-training-list");
    const summary = document.querySelector("#pca-training-summary");
    const active = document.querySelector("#pca-training-active");
    if (!list || !summary || !active) return;
    let save;
    try {
      save = readSave();
    } catch {
      list.innerHTML = `<div class="pca-note">${escapeHtml(t("trainingNoSave"))}</div>`;
      summary.textContent = "";
      active.textContent = t("trainingDisabled");
      return;
    }
    const draft = getCandidatePoolDraft();
    const rows = candidatePoolRows(save, draft);
    list.innerHTML = rows.length ? rows.map((row) => `<label class="pca-training-mon${row.eligible ? "" : " unavailable"}"><input type="checkbox" data-candidate-uid="${escapeHtml(row.uid)}" ${row.checked ? "checked" : ""}><span><b>${row.mon.shiny ? "★ " : ""}${escapeHtml(row.name)}</b><small>#${escapeHtml(row.number)} · Lv.${row.mon.level} · ${language() === "en" ? "combined" : "综合能力"} ${row.power}<br>${escapeHtml(row.note)}${row.eligible ? "" : `<br>${language() === "en" ? "Unavailable in current region" : "当前地区不可出战"}`}</small></span></label>`).join("") : `<div class="pca-note">${language() === "en" ? "No members match these filters." : "没有符合当前筛选条件的宝可梦。"}</div>`;
    const selected = draft.uids.length;
    const preferred = preferredTeamCandidates(save, { ...draft, enabled: true });
    const eligible = preferred.length;
    const distinct = new Set(preferred.map(teamIdentity)).size;
    summary.textContent = language() === "en"
      ? `${rows.length} shown · ${selected} selected · ${eligible} currently eligible (${distinct} distinct)${draft.enabled && distinct < 6 ? " · remaining slots are filled from other usable Pokemon" : ""}`
      : `显示${rows.length}只 · 已选${selected}只 · 当前合格${eligible}只（${distinct}种）${draft.enabled && distinct < 6 ? " · 其余位置从其他可出战宝可梦补足" : ""}`;
    const saved = normalizeCandidatePool(settings.candidatePool);
    active.textContent = saved.enabled
      ? (language() === "en" ? `Active: prefer ${saved.uids.length} checked individuals with combined stat value ≥ ${saved.minPower}.` : `当前生效：优先使用已保存的${saved.uids.length}只个体，综合能力值 ≥ ${saved.minPower}。`)
      : t("trainingDisabled");
  }

  function candidatePoolSelectionAction(action) {
    const save = readSave();
    const draft = getCandidatePoolDraft();
    if (action === "training-reset") {
      const saved = normalizeCandidatePool(settings.candidatePool);
      candidatePoolDraft = { ...saved, uids: [...saved.uids], query: "", onlyEligible: true };
    } else if (action === "training-clear") draft.uids = [];
    else if (action === "training-visible") draft.uids = [...new Set([...draft.uids, ...candidatePoolRows(save, draft).map((row) => row.uid)])];
    else if (action === "training-team") draft.uids = [...new Set([...draft.uids, ...(save.team || []).map(String)])];
    renderCandidatePool();
  }

  function saveCandidatePool() {
    if (runtime.busy) {
      log(language() === "en" ? "Wait for the current team operation before saving the candidate pool." : "正在配队，请等待当前操作结束后再保存候选池");
      return false;
    }
    settings.candidatePool = normalizeCandidatePool(getCandidatePoolDraft());
    candidatePoolDraft = { ...settings.candidatePool, uids: [...settings.candidatePool.uids], query: "", onlyEligible: true };
    saveSettings();
    runtime.teamPlan = null;
    runtime.userTeamOverride = false;
    runtime.failureTeams.clear();
    runtime.deathSeries.clear();
    log(settings.candidatePool.enabled
      ? (language() === "en" ? `Saved ${settings.candidatePool.uids.length} training candidates.` : `已保存培养候选池：${settings.candidatePool.uids.length}只个体`)
      : (language() === "en" ? "Candidate pool disabled." : "已关闭培养候选池限制"));
    renderCandidatePool();
    return true;
  }

  function renderPanel() {
    document.getElementById(PANEL_ID)?.remove();
    document.getElementById(`${PANEL_ID}-style`)?.remove();
    const style = document.createElement("style");
    style.id = `${PANEL_ID}-style`;
    style.textContent = `
      .topbar .tb-sep.pca-host{display:flex;align-items:center;justify-content:center;min-width:0}
      #${PANEL_ID}{width:min(100%,620px);min-width:0;color:#eef2ff;font:13px/1.45 system-ui,-apple-system,"PingFang SC",sans-serif}
      #${PANEL_ID} *{box-sizing:border-box}#${PANEL_ID} button,#${PANEL_ID} select,#${PANEL_ID} input{font:inherit}
      .pca-native-bar{display:grid;grid-template-columns:auto minmax(0,1fr) minmax(0,1fr) auto auto;align-items:center;gap:8px;width:100%;height:44px;padding:0 10px;border:2px solid var(--line,#343b56);border-radius:var(--r-md,12px);background:var(--panel-2,#20253a);color:var(--text,#eef2ff);cursor:pointer;transition:border-color .15s,background .15s}.pca-native-bar:hover{border-color:var(--line-hover,#536080);background:var(--panel-3,#2b3350)}.pca-native-brand{font-weight:700;white-space:nowrap}.pca-native-item{min-width:0;color:var(--muted,#8fa0c6);font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pca-native-item b{color:var(--text,#eef2ff);margin-left:4px}.pca-native-open{color:var(--muted,#8fa0c6);font-size:12px;white-space:nowrap}
      .pca-modal{display:none;position:fixed;inset:0;z-index:2147483646;align-items:flex-start;justify-content:center;padding:var(--pca-dock-top,12px) 24px 12px}.pca-modal-shade{position:absolute;inset:0;border:0;background:#050711b8;cursor:default}.pca-dialog{position:relative;width:min(620px,calc(100vw - 32px));max-height:min(calc(100vh - var(--pca-dock-top,12px) - 12px),760px);display:flex;flex-direction:column;background:#151827;border:1px solid #46506c;border-radius:14px;box-shadow:0 20px 60px #000b;overflow:hidden}#${PANEL_ID}:not(.collapsed) .pca-modal{display:flex}
      #${PANEL_ID}.floating .pca-modal{pointer-events:none;padding:0}#${PANEL_ID}.floating .pca-modal-shade{display:none}#${PANEL_ID}.floating .pca-dialog{position:fixed;pointer-events:auto;resize:both;min-width:min(360px,calc(100vw - 24px));min-height:min(240px,calc(100vh - 24px));max-width:calc(100vw - 24px);max-height:calc(100vh - 24px)}#${PANEL_ID}.floating .pca-head{cursor:move;touch-action:none}
      .pca-head{display:flex;align-items:center;gap:8px;padding:10px 12px;background:#20253a;border-bottom:1px solid #343b56;user-select:none}.pca-head b{flex:1}.pca-head button{cursor:pointer}.pca-ver{color:#8ea0ca;font-size:11px}.pca-project-icon{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border:1px solid #536080;border-radius:8px;color:#dbe5ff;background:#2b3350;text-decoration:none}.pca-project-icon:hover{background:#3a466c}.pca-project-icon svg{width:17px;height:17px;fill:currentColor}.pca-link-btn{display:inline-flex;align-items:center;justify-content:center;text-decoration:none}
      .pca-body{overflow:auto;min-height:0}.pca-summary{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px 12px;padding:8px 12px;background:#181d2d;border-bottom:1px solid #343b56}.pca-summary span{color:#8fa0c6;min-width:0}.pca-summary b{color:#eef2ff;margin-left:5px}.pca-summary-main{display:contents}.pca-summary-extra{display:contents}
      .pca-tabs{display:flex;overflow-x:auto;background:#181c2c;border-bottom:1px solid #343b56;padding:0 6px}.pca-tab{flex:0 0 auto;border:0;border-bottom:2px solid transparent;background:transparent;color:#94a3c8;padding:9px 8px;cursor:pointer}.pca-tab:hover{color:#dbe5ff}.pca-tab.active{color:#fff;border-bottom-color:#6f9cff;background:#20263a}
      .pca-tabpanel{display:none;padding:10px 12px}.pca-tabpanel.active{display:block}
      .pca-row{display:flex;gap:7px;align-items:center;margin:7px 0}.pca-row>*{min-width:0}.pca-grow{flex:1}
      .pca-btn{border:1px solid #536080;background:#2b3350;color:#fff;border-radius:8px;padding:6px 9px;cursor:pointer}.pca-btn:hover{background:#3a466c}.pca-btn.primary{background:#3668d8;border-color:#5d87e4}.pca-btn.danger{background:#7b2f3c;border-color:#a44756}.pca-btn:disabled{opacity:.5;cursor:not-allowed}
      .pca-card{background:#1d2235;border:1px solid #323a55;border-radius:10px;padding:8px 9px;margin:8px 0}.pca-card h4{margin:0 0 6px;font-size:13px;color:#a9b9e4}.pca-kv{display:grid;grid-template-columns:72px 1fr;gap:4px 8px}.pca-kv span:nth-child(odd){color:#8fa0c6}.pca-status.run{color:#7ee787}.pca-status.pause{color:#f2cc60}.pca-status.err{color:#ff7b72}
      .pca-berries{display:grid;grid-template-columns:1fr 54px;gap:4px 6px}.pca-berry{display:flex;gap:6px;align-items:center}.pca-berries input[type=number]{width:54px;background:#111524;color:#fff;border:1px solid #46506c;border-radius:6px;padding:3px}
      .pca-select{background:#111524;color:#fff;border:1px solid #46506c;border-radius:7px;padding:5px}.pca-log{max-height:120px;overflow:auto;white-space:pre-wrap;color:#aeb9d6;font-size:11px}.pca-log .error{color:#ff8a82}.pca-note{color:#8999bd;font-size:11px}.pca-team{white-space:normal;color:#d8e1ff}
      .pca-lang{max-width:92px;font-size:11px;padding:3px}
      .pca-priority-item{display:grid;grid-template-columns:1fr auto 30px 30px;gap:5px;align-items:center;margin:5px 0}.pca-priority-item span{color:#8999bd;font-size:11px;text-align:right}.pca-priority-item .pca-btn{padding:3px 0}
      .pca-targets{display:grid;gap:4px;margin-top:6px}.pca-target{display:flex;justify-content:space-between;gap:8px;border:1px solid #3b4667;border-radius:6px;padding:4px 6px;background:#171c2d}.pca-target small{color:#8fa0c6;text-align:right}.pca-target.valid{border-color:#35684c}.pca-target.warn{border-color:#766129}.pca-target.invalid{border-color:#7b3941;color:#ff9b94}
      .pca-queue-title{margin-top:10px!important}
      .pca-task-grid{display:grid;grid-template-columns:1fr;gap:7px}.pca-task-btn{width:100%;min-height:36px}.pca-controls .pca-btn{flex:1}
      .pca-region-list{flex-wrap:wrap}
      #${PANEL_ID}.training-open .pca-dialog{width:min(780px,calc(100vw - 32px))}.pca-training-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:5px;max-height:38vh;overflow:auto;margin:8px 0}.pca-training-mon{display:flex;align-items:flex-start;gap:6px;padding:7px;background:#111827;border:1px solid #3a4560;border-radius:8px;cursor:pointer}.pca-training-mon:has(input:checked){border-color:#75a2ff;background:#243556}.pca-training-mon.unavailable{opacity:.65}.pca-training-mon small{display:block;color:#a4b3d1;font-size:11px;margin-top:3px}.pca-training-min{width:82px}
      @media(max-width:900px){.pca-native-brand{display:none}.pca-native-bar{grid-template-columns:minmax(0,1fr) minmax(0,1fr) auto auto}}
      @media(max-width:640px){.topbar .tb-sep.pca-host{flex:0 1 auto}.pca-native-bar{grid-template-columns:minmax(0,1fr) auto;max-width:210px}.pca-native-target,.pca-native-progress{display:none}.pca-native-open{font-size:0}.pca-native-open:after{content:"⚙";font-size:16px}.pca-modal{padding:var(--pca-dock-top,10px) 10px 10px}.pca-dialog,#${PANEL_ID}.training-open .pca-dialog{width:calc(100vw - 20px);max-height:calc(100vh - var(--pca-dock-top,10px) - 10px)}}
    `;
    document.head.append(style);

    const panel = document.createElement("section");
    panel.id = PANEL_ID;
    panel.className = `${settings.collapsed ? "collapsed" : ""}${settings.floating ? " floating" : ""}${settings.activeTab === "training" ? " training-open" : ""}`;
    panel.innerHTML = `
      <button type="button" class="pca-native-bar" data-act="collapse" aria-expanded="${!settings.collapsed}" aria-label="${t("expand")}"><span class="pca-native-brand">PokéCatch</span><span class="pca-native-item">${t("task")}<b data-status="mode">${t("idle")}</b></span><span class="pca-native-item pca-native-target">${t("target")}<b data-status="target">—</b></span><span class="pca-native-item pca-native-progress">${t("progress")}<b data-status="attempts">0</b></span><span class="pca-native-open">${t("expand")}</span></button>
      <div class="pca-modal"><button type="button" class="pca-modal-shade" data-act="collapse" aria-label="${t("collapse")}"></button><section class="pca-dialog" role="dialog" aria-modal="${!settings.floating}" aria-label="${t("assistant")}">
      <div class="pca-head"><b>${t("assistant")}</b><select class="pca-select pca-lang" data-select-setting="language" aria-label="Language"><option value="auto" ${settings.language === "auto" ? "selected" : ""}>${t("auto")}</option><option value="zh" ${settings.language === "zh" ? "selected" : ""}>中文</option><option value="en" ${settings.language === "en" ? "selected" : ""}>English</option></select><span class="pca-ver">v${VERSION}</span><a class="pca-project-icon" href="${PROJECT_URL}" target="_blank" rel="noopener noreferrer" title="${t("author")}: stdAri · GitHub" aria-label="${t("author")}: stdAri · GitHub"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.24c-3.22.7-3.9-1.37-3.9-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.38.96.1-.75.4-1.26.74-1.55-2.57-.29-5.27-1.29-5.27-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.16 1.18a10.97 10.97 0 0 1 5.75 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.71 5.39-5.29 5.68.42.36.79 1.06.79 2.14v3.18c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z"/></svg></a><button class="pca-btn" data-act="float">${settings.floating ? t("dockWindow") : t("floatWindow")}</button><button class="pca-btn" data-act="collapse">${t("collapse")}</button></div>
      ${statusSummaryHtml()}<div class="pca-body">
        <div class="pca-tabs" role="tablist" aria-label="${t("assistant")}">
          ${[["push",t("pushTab")],["collect",t("collectTab")],["training",t("trainingTab")],["team",t("teamTab")],["berries",t("berriesTab")],["diagnostics",t("diagnosticsTab")]].map(([key,label]) => `<button class="pca-tab ${settings.activeTab === key ? "active" : ""}" type="button" role="tab" aria-selected="${settings.activeTab === key}" data-tab="${key}">${label}</button>`).join("")}
        </div>
        <div class="pca-tabpanel ${settings.activeTab === "push" ? "active" : ""}" role="tabpanel" data-tabpanel="push">
          <div class="pca-row"><button class="pca-btn primary pca-grow" data-act="push">${t("startPush")}</button><button class="pca-btn pca-grow" data-act="pause">${t("pauseResume")}</button><button class="pca-btn danger" data-act="stop">${t("stop")}</button></div>
          <div class="pca-note">${t("pushNote")}</div>
          <div class="pca-card"><label class="pca-row"><input type="checkbox" data-setting="prioritizeDailyRaid" ${settings.prioritizeDailyRaid ? "checked" : ""}>${t("prioritizeDailyRaid")}</label>
            <div class="pca-note">${t("prioritizeDailyRaidNote")}</div></div>
        </div>
        <div class="pca-tabpanel ${settings.activeTab === "collect" ? "active" : ""}" role="tabpanel" data-tabpanel="collect">
          <div class="pca-card"><h4>${t("selectCollection")}</h4>
            <div class="pca-task-grid"><button class="pca-btn primary pca-task-btn" data-act="collect">${t("dexCollection")}</button><button class="pca-btn primary pca-task-btn" data-act="roaming">${t("roamOnly")}</button><button class="pca-btn primary pca-task-btn" data-act="combined">${t("combined")}</button></div>
            <div class="pca-row pca-controls"><button class="pca-btn" data-act="pause">${t("pauseResume")}</button><button class="pca-btn danger" data-act="stop">${t("stop")}</button></div>
            <div class="pca-note">${t("collectionNote")}</div>
          </div>
          <div class="pca-card"><h4>${t("ordinaryTargets")}</h4>
            <div class="pca-row"><span>${t("region")}</span><select class="pca-select pca-grow" data-select-setting="regionScope"><option value="current" ${settings.regionScope === "current" ? "selected" : ""}>${t("currentRegion")}</option><option value="all" ${settings.regionScope === "all" ? "selected" : ""}>${t("allRegions")}</option><option value="custom" ${settings.regionScope === "custom" ? "selected" : ""}>${t("customRegions")}</option></select></div>
            <div class="pca-row pca-note">${[["kanto",t("kanto")],["johto",t("johto")],["hoenn",t("hoenn")],["sinnoh",t("sinnoh")],["unova",t("unova")]].map(([key,label])=>`<label><input type="checkbox" data-region="${key}" ${settings.customRegions.includes(key)?"checked":""}>${label}</label>`).join(" ")}</div>
            <div id="pca-scope-summary" class="pca-note"></div>
            <label class="pca-row"><input type="checkbox" data-setting="autoPushForCollection" ${settings.autoPushForCollection ? "checked" : ""}>${t("autoPushCollection")}</label>
            <div class="pca-note">${t("autoPushCollectionNote")}</div>
            <div class="pca-row"><input class="pca-select pca-grow" id="pca-manual-targets" value="${manualTargetsInputValue()}" placeholder="${t("manualPlaceholder")}"><button class="pca-btn" data-act="targets">${t("apply")}</button></div>
            <div id="pca-manual-target-preview" class="pca-targets pca-note">${manualTargetPreviewHtml(manualTargetsInputValue())}</div>
            <div class="pca-note">${t("targetNote")}</div>
            <h4 class="pca-queue-title">${t("collectionQueue")}</h4>
            <div id="pca-collection-queue" class="pca-targets"><div class="pca-note">${t("queueEmpty")}</div></div>
          </div>
          <div class="pca-card"><h4>${t("roamers")}</h4>
            <div class="pca-note">${t("roamerNote")}</div>
            <div id="pca-roaming-priority">${roamingPriorityHtml()}</div>
            <details class="pca-box" open><summary>${t("fixedLegendaryHeading")}</summary><div id="pca-fixed-legendaries"></div></details>
          </div>
        </div>
        <div class="pca-tabpanel ${settings.activeTab === "training" ? "active" : ""}" role="tabpanel" data-tabpanel="training">
          <div class="pca-card"><h4>${t("autoBuddyTitle")}</h4>
            <label class="pca-row"><input type="checkbox" data-setting="autoBuddy" ${settings.autoBuddy ? "checked" : ""}>${t("autoBuddy")}</label>
            <div class="pca-row"><label for="pca-buddy-scope">${t("autoBuddyScope")}</label><select id="pca-buddy-scope" class="pca-select pca-grow" data-select-setting="buddyScope"><option value="all" ${settings.buddyScope === "all" ? "selected" : ""}>${t("autoBuddyScopeAll")}</option><option value="team" ${settings.buddyScope === "team" ? "selected" : ""}>${t("autoBuddyScopeTeam")}</option><option value="box" ${settings.buddyScope === "box" ? "selected" : ""}>${t("autoBuddyScopeBox")}</option></select></div>
            <div id="pca-buddy-status" class="pca-note">${t("buddyNone")}</div>
            <div class="pca-note">${t("autoBuddyNote")}</div>
          </div>
          <div class="pca-card"><h4>${t("trainingTitle")}</h4>
            <label class="pca-row"><input id="pca-training-enable" type="checkbox" ${getCandidatePoolDraft().enabled ? "checked" : ""}>${t("trainingEnable")}</label>
            <div class="pca-row"><label for="pca-training-min">${t("trainingPower")}</label><input id="pca-training-min" class="pca-select pca-training-min" type="number" min="0" max="2000" step="1" value="${getCandidatePoolDraft().minPower}"></div>
            <div class="pca-note">${t("trainingPowerHelp")}</div>
            <input id="pca-training-search" class="pca-select" style="width:100%;margin-top:7px" placeholder="${t("trainingSearch")}" value="${escapeHtml(getCandidatePoolDraft().query)}">
            <label class="pca-row"><input id="pca-training-eligible" type="checkbox" ${getCandidatePoolDraft().onlyEligible ? "checked" : ""}>${t("trainingEligible")}</label>
            <div class="pca-row pca-region-list"><button class="pca-btn" data-act="training-visible">${t("trainingSelectVisible")}</button><button class="pca-btn" data-act="training-team">${t("trainingSelectTeam")}</button><button class="pca-btn" data-act="training-clear">${t("trainingClear")}</button><button class="pca-btn" data-act="training-refresh">${t("trainingRefresh")}</button></div>
            <div id="pca-training-list" class="pca-training-list"></div><div id="pca-training-summary" class="pca-note"></div>
            <div class="pca-row"><button class="pca-btn primary pca-grow" data-act="training-save">${t("trainingSave")}</button><button class="pca-btn" data-act="training-reset">${t("trainingReset")}</button></div>
          </div><div id="pca-training-active" class="pca-note"></div>
        </div>
        <div class="pca-tabpanel ${settings.activeTab === "team" ? "active" : ""}" role="tabpanel" data-tabpanel="team">
          <div class="pca-card"><h4>${t("teamCopy")}</h4>
          <label class="pca-row"><input type="checkbox" data-setting="lockTeam5" ${settings.lockTeam5 ? "checked" : ""}>${t("lockTeam")}</label>
          <div class="pca-row"><select class="pca-select pca-grow" id="pca-copy-from">${[0,1,2,3,4].map((i)=>`<option value="${i}">${t("team")} ${i+1}</option>`).join("")}</select><span>→</span><select class="pca-select pca-grow" id="pca-copy-to">${[0,1,2,3,4].map((i)=>`<option value="${i}" ${i===4?"selected":""}>${t("team")} ${i+1}</option>`).join("")}</select><button class="pca-btn" data-act="copy">${t("copy")}</button></div>
          <button class="pca-btn" data-act="reteam">${t("regenerate")}</button>
          </div>
          <div class="pca-card"><h4>${t("duplicateKeepTitle")}</h4>
          <div class="pca-note">${t("duplicateKeepRegions")}</div>
          <div class="pca-row pca-note pca-region-list">${[["kanto",t("kanto")],["johto",t("johto")],["hoenn",t("hoenn")],["sinnoh",t("sinnoh")],["unova",t("unova")]].map(([key,label])=>`<label><input type="checkbox" data-duplicate-region="${key}" ${settings.duplicateKeepRegions.includes(key)?"checked":""}>${label}</label>`).join(" ")}</div>
          <div class="pca-row pca-controls"><button class="pca-btn" data-act="dup-on">${t("enableDuplicateKeeps")}</button><button class="pca-btn" data-act="dup-off">${t("disableDuplicateKeeps")}</button><button class="pca-btn danger" data-act="dup-cancel">${t("cancelDuplicateKeeps")}</button></div>
          <div id="pca-duplicate-keep-status" class="pca-note">${t("duplicateKeepIdle")}</div><div class="pca-note">${t("duplicateKeepNote")}</div>
          </div>
        </div>
        <div class="pca-tabpanel ${settings.activeTab === "berries" ? "active" : ""}" role="tabpanel" data-tabpanel="berries">
          <div class="pca-card"><h4>${t("berryTitle")}</h4><div class="pca-berries">
          ${Object.entries(BERRIES).map(([key, info]) => `<label class="pca-berry"><input type="checkbox" data-berry="${key}" ${settings.berries[key]?.enabled ? "checked" : ""}><span>${berryLabel(info)}<small class="pca-note" style="display:block">${t("stock")} <b data-berry-stock="${key}">—</b></small></span></label><input type="number" min="0" title="${t("reserve")}" data-reserve="${key}" value="${settings.berries[key]?.reserve || 0}">`).join("")}
          </div><div class="pca-note">${t("berryNote")}</div></div>
          <div class="pca-card"><h4>${t("pensionBerryTitle")}</h4>${Object.entries(PENSION_BERRIES).map(([key, info]) => `<div class="pca-row"><span class="pca-grow">${escapeHtml(pensionBerryLabel(info))}<small class="pca-note" style="display:block">${escapeHtml(pensionBerryEffect(info))}</small></span><span>${t("stock")} <b data-berry-stock="${key}">—</b></span></div>`).join("")}<button class="pca-btn" data-act="pension-berries">${t("pensionBerryButton")}</button><div class="pca-note">${t("pensionBerryNote")}</div></div>
        </div>
        <div class="pca-tabpanel ${settings.activeTab === "diagnostics" ? "active" : ""}" role="tabpanel" data-tabpanel="diagnostics">
          <div class="pca-card"><h4>${t("notifications")}</h4><label class="pca-row"><input type="checkbox" data-setting="soundNotifications" ${settings.soundNotifications ? "checked" : ""}>${t("sound")}</label><label class="pca-row"><input type="checkbox" data-setting="desktopNotifications" ${settings.desktopNotifications ? "checked" : ""}>${t("desktop")}</label></div>
          <div class="pca-card"><h4>${t("debugMode")}</h4>
            <label class="pca-row"><input type="checkbox" data-setting="debugBattle" ${settings.debugBattle ? "checked" : ""}>${t("debugMode")}</label>
            <div class="pca-note">${t("debugModeNote")}</div>
            <div class="pca-row"><label for="pca-debug-limit">${t("debugLimit")}</label><select id="pca-debug-limit" class="pca-select pca-grow" data-select-setting="debugLimit">${[20, 50, 100].map((value) => `<option value="${value}" ${Number(settings.debugLimit) === value ? "selected" : ""}>${value}</option>`).join("")}</select></div>
            <h4>${t("debugRuns")}</h4><div id="pca-debug-runs" class="pca-note">${t("debugEmpty")}</div>
            <div class="pca-row"><button class="pca-btn" data-act="debug-export">${t("debugExport")}</button><button class="pca-btn danger" data-act="debug-clear">${t("debugClear")}</button></div>
          </div>
          <div class="pca-card"><h4>${t("diagnostic")}</h4><div id="pca-error" class="pca-note">${t("noError")}</div><div class="pca-row"><button class="pca-btn" data-act="copydiag">${t("copyDiagnostic")}</button></div></div>
          <div class="pca-card"><h4>${t("projectLinks")}</h4><div class="pca-note">${t("author")}: <b>stdAri</b></div><div class="pca-row"><a class="pca-btn pca-link-btn" href="${PROJECT_URL}" target="_blank" rel="noopener noreferrer">${t("githubProject")}</a><a class="pca-btn primary pca-link-btn" href="${ISSUES_URL}" target="_blank" rel="noopener noreferrer">${t("reportIssue")}</a></div><div class="pca-note">${t("issueNote")}</div></div>
          <div class="pca-card"><h4>${t("logs")}</h4><div id="pca-log" class="pca-log"></div></div>
        </div>
      </div></section></div>`;
    const host = document.querySelector(".topbar .tb-sep");
    if (!host) {
      setTimeout(renderPanel, 250);
      return;
    }
    host.classList.add("pca-host");
    host.append(panel);
    applyDockPosition(panel);
    applyFloatPosition(panel);
    enableFloatDragging(panel);
    observeFloatSize(panel);

    panel.addEventListener("click", (event) => {
      const tab = event.target.closest("[data-tab]")?.dataset.tab;
      if (tab) {
        selectPanelTab(panel, tab);
        if (tab === "training") renderCandidatePool();
        return;
      }
      const action = event.target.closest("[data-act]")?.dataset.act;
      if (!action) return;
      if (action === "collapse") {
        settings.collapsed = !settings.collapsed;
        saveSettings();
        panel.classList.toggle("collapsed", settings.collapsed);
        panel.querySelector(".pca-native-bar")?.setAttribute("aria-expanded", String(!settings.collapsed));
        if (!settings.collapsed) requestAnimationFrame(() => settings.floating ? applyFloatPosition(panel) : applyDockPosition(panel));
      } else if (action === "float") {
        const dialog = panel.querySelector(".pca-dialog");
        if (!settings.floating && dialog) {
          const rect = dialog.getBoundingClientRect();
          settings.floatPosition = { left: Math.round(rect.left), top: Math.round(rect.top) };
          settings.floatSize = { width: Math.round(rect.width), height: Math.round(rect.height) };
        }
        settings.floating = !settings.floating;
        saveSettings();
        panel.classList.toggle("floating", settings.floating);
        dialog?.setAttribute("aria-modal", String(!settings.floating));
        event.target.textContent = settings.floating ? t("dockWindow") : t("floatWindow");
        if (!settings.floating) applyDockPosition(panel);
        applyFloatPosition(panel);
      } else if (action === "push") startMode("push");
      else if (action === "collect") startMode("collect");
      else if (action === "roaming") startMode("roaming");
      else if (action === "combined") startMode("combined");
      else if (action === "pause") pauseMode();
      else if (action === "stop") stopMode();
      else if (action === "copy") copyTeam();
      else if (action === "reteam") regenerateTeam();
      else if (action === "pension-berries") exclusive(language() === "en" ? "Open Day Care" : "打开培育屋", () => openScreen("pension"));
      else if (action === "training-save") saveCandidatePool();
      else if (["training-reset", "training-clear", "training-visible", "training-team"].includes(action)) candidatePoolSelectionAction(action);
      else if (action === "training-refresh") renderCandidatePool();
      else if (action === "dup-on") bulkSetDuplicateKeeps(true);
      else if (action === "dup-off") bulkSetDuplicateKeeps(false);
      else if (action === "dup-cancel" && runtime.duplicateKeep?.active) runtime.duplicateKeep.cancelled = true;
      else if (action === "targets") applyManualTargets();
      else if (action === "roam-up") moveRoamingPriority(Number(event.target.closest("[data-roamer]")?.dataset.roamer), -1);
      else if (action === "roam-down") moveRoamingPriority(Number(event.target.closest("[data-roamer]")?.dataset.roamer), 1);
      else if (action === "copydiag") navigator.clipboard.writeText(JSON.stringify(runtime.error || { status: t("noError"), build: gameBuild() }, null, 2));
      else if (action === "debug-export") exportDebugRuns().catch((error) => log(`调试记录导出失败：${error.message}`, "error"));
      else if (action === "debug-clear") clearDebugRuns().catch((error) => log(`调试记录清空失败：${error.message}`, "error"));
    });

    panel.addEventListener("input", (event) => {
      if (event.target.id === "pca-manual-targets") renderManualTargetPreview(event.target.value);
      if (event.target.id === "pca-training-search") {
        getCandidatePoolDraft().query = event.target.value;
        renderCandidatePool();
      }
      if (event.target.id === "pca-training-min") {
        getCandidatePoolDraft().minPower = Math.max(0, Math.min(2_000, Math.trunc(Number(event.target.value) || 0)));
        renderCandidatePool();
      }
    });

    panel.addEventListener("change", (event) => {
      if (event.target.id === "pca-training-enable") {
        getCandidatePoolDraft().enabled = event.target.checked;
        renderCandidatePool();
      }
      if (event.target.id === "pca-training-eligible") {
        getCandidatePoolDraft().onlyEligible = event.target.checked;
        renderCandidatePool();
      }
      const candidateUid = event.target.dataset.candidateUid;
      if (candidateUid) {
        const draft = getCandidatePoolDraft();
        draft.uids = event.target.checked
          ? [...new Set([...draft.uids, candidateUid])]
          : draft.uids.filter((uid) => uid !== candidateUid);
        renderCandidatePool();
      }
      const setting = event.target.dataset.setting;
      if (setting) {
        settings[setting] = event.target.checked;
        if (setting === "autoBuddy") {
          runtime.lastBuddyCheckAt = 0;
          runtime.buddyStatus = "";
          if (settings.autoBuddy) queueMicrotask(() => tick());
        }
        if (setting === "autoPushForCollection") {
          runtime.collectionQueueSignature = "";
          if (!settings.autoPushForCollection && runtime.targetPlan?.unlockForCollection) {
            runtime.target = null;
            runtime.targetPlan = null;
            runtime.teamPlan = null;
          }
        }
        if (setting === "debugBattle") {
          log(settings.debugBattle ? t("debugEnabled") : t("debugDisabled"));
          if (settings.debugBattle) {
            try { startDebugRun(readSave(), "debug-enabled"); } catch { /* game save may not be ready yet */ }
            observeDebugBattle();
          } else if (runtime.debugRun) {
            finishDebugRun("debug-disabled").catch((error) => log(`调试记录保存失败：${error.message}`, "error"));
          }
        }
        saveSettings();
      }
      const berry = event.target.dataset.berry;
      if (berry) {
        settings.berries[berry].enabled = event.target.checked;
        saveSettings();
      }
      const reserve = event.target.dataset.reserve;
      if (reserve) {
        settings.berries[reserve].reserve = Math.max(0, Number(event.target.value) || 0);
        saveSettings();
      }
      const selectSetting = event.target.dataset.selectSetting;
      if (selectSetting === "language") {
        settings.language = event.target.value;
        saveSettings();
        renderPanel();
        return;
      }
      if (selectSetting === "regionScope") {
        settings.regionScope = event.target.value;
        runtime.collectionQueueSignature = "";
        saveSettings();
      }
      if (selectSetting === "buddyScope") {
        settings.buddyScope = ["all", "team", "box"].includes(event.target.value) ? event.target.value : "all";
        runtime.lastBuddyCheckAt = 0;
        runtime.buddyStatus = "";
        saveSettings();
        if (settings.autoBuddy) queueMicrotask(() => tick());
      }
      if (selectSetting === "debugLimit") {
        settings.debugLimit = [20, 50, 100].includes(Number(event.target.value)) ? Number(event.target.value) : 20;
        saveSettings();
        trimDebugRuns().then(refreshDebugRecent).catch((error) => log(`调试记录整理失败：${error.message}`, "error"));
      }
      const region = event.target.dataset.region;
      if (region) {
        settings.customRegions = event.target.checked
          ? [...new Set([...settings.customRegions, region])]
          : settings.customRegions.filter((item) => item !== region);
        runtime.collectionQueueSignature = "";
        saveSettings();
      }
      const duplicateRegion = event.target.dataset.duplicateRegion;
      if (duplicateRegion) {
        settings.duplicateKeepRegions = event.target.checked
          ? [...new Set([...settings.duplicateKeepRegions, duplicateRegion])]
          : settings.duplicateKeepRegions.filter((item) => item !== duplicateRegion);
        saveSettings();
      }
    });
    renderStatus();
    renderLog();
    refreshDebugRecent();
    if (settings.activeTab === "training") renderCandidatePool();
    if (!runtime.floatResizeBound) {
      window.addEventListener("resize", () => {
        const current = document.getElementById(PANEL_ID);
        if (!current) return;
        if (current.classList.contains("floating")) applyFloatPosition(current);
        else applyDockPosition(current);
      });
      runtime.floatResizeBound = true;
    }
  }

  function statusSummaryHtml() {
    return `<div class="pca-summary" aria-label="${t("statusTitle")}"><div class="pca-summary-main"><span>${t("task")}<b data-status="mode">${t("idle")}</b></span><span>${t("target")}<b data-status="target">—</b></span><span>${t("progress")}<b data-status="attempts">0</b></span></div><div class="pca-summary-extra"><span>${t("place")}<b data-status="place">—</b></span><span>${t("buffs")}<b data-status="buffs">—</b></span><span>${t("fifthTeam")}<b data-status="team" class="pca-team">${t("notGenerated")}</b></span></div></div>`;
  }

  function selectPanelTab(panel, tab) {
    const allowed = new Set(["push", "collect", "training", "team", "berries", "diagnostics"]);
    if (!allowed.has(tab)) return;
    settings.activeTab = tab;
    saveSettings();
    panel.classList.toggle("training-open", tab === "training");
    panel.querySelectorAll("[data-tab]").forEach((button) => {
      const active = button.dataset.tab === tab;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
    panel.querySelectorAll("[data-tabpanel]").forEach((tabpanel) => tabpanel.classList.toggle("active", tabpanel.dataset.tabpanel === tab));
    if (settings.floating) requestAnimationFrame(() => applyFloatPosition(panel));
  }

  function applyDockPosition(panel) {
    if (settings.floating) return;
    const topbar = document.querySelector(".topbar");
    const nativeBar = panel.querySelector(".pca-native-bar");
    const anchorBottom = Math.max(
      topbar?.getBoundingClientRect().bottom || 0,
      nativeBar?.getBoundingClientRect().bottom || 0,
    );
    const top = Math.max(8, Math.min(Math.round(anchorBottom + 8), window.innerHeight - 120));
    panel.style.setProperty("--pca-dock-top", `${top}px`);
  }

  function applyFloatPosition(panel) {
    const dialog = panel.querySelector(".pca-dialog");
    if (!dialog) return;
    if (!settings.floating) {
      dialog.style.left = "";
      dialog.style.top = "";
      dialog.style.width = "";
      dialog.style.height = "";
      return;
    }
    const initialRect = dialog.getBoundingClientRect();
    const minWidth = Math.min(360, window.innerWidth - 24);
    const minHeight = Math.min(240, window.innerHeight - 24);
    const width = Math.max(minWidth, Math.min(Number(settings.floatSize?.width) || initialRect.width || (settings.activeTab === "training" ? 780 : 620), window.innerWidth - 24));
    const height = Math.max(minHeight, Math.min(Number(settings.floatSize?.height) || initialRect.height || 760, window.innerHeight - 24));
    dialog.style.width = `${Math.round(width)}px`;
    dialog.style.height = `${Math.round(height)}px`;
    const requested = settings.floatPosition || { left: window.innerWidth - width - 14, top: 14 };
    const left = Math.max(0, Math.min(Number(requested.left) || 0, window.innerWidth - width));
    const top = Math.max(0, Math.min(Number(requested.top) || 0, window.innerHeight - height));
    dialog.style.left = `${Math.round(left)}px`;
    dialog.style.top = `${Math.round(top)}px`;
    settings.floatPosition = { left: Math.round(left), top: Math.round(top) };
    settings.floatSize = { width: Math.round(width), height: Math.round(height) };
    saveSettings();
  }

  function observeFloatSize(panel) {
    runtime.floatSizeObserver?.disconnect();
    const dialog = panel.querySelector(".pca-dialog");
    if (!dialog || typeof ResizeObserver !== "function") return;
    runtime.floatSizeObserver = new ResizeObserver(() => {
      if (!settings.floating || settings.collapsed) return;
      const rect = dialog.getBoundingClientRect();
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      if (width <= 0 || height <= 0) return;
      settings.floatSize = { width, height };
      settings.floatPosition = {
        left: Math.round(Math.max(0, Math.min(rect.left, window.innerWidth - width))),
        top: Math.round(Math.max(0, Math.min(rect.top, window.innerHeight - height))),
      };
      dialog.style.left = `${settings.floatPosition.left}px`;
      dialog.style.top = `${settings.floatPosition.top}px`;
      saveSettings();
    });
    runtime.floatSizeObserver.observe(dialog);
  }

  function enableFloatDragging(panel) {
    const handle = panel.querySelector(".pca-head");
    const dialog = panel.querySelector(".pca-dialog");
    if (!handle || !dialog) return;
    let drag = null;
    handle.addEventListener("pointerdown", (event) => {
      if (!settings.floating || event.button !== 0 || event.target.closest("a,button,select,input")) return;
      const rect = dialog.getBoundingClientRect();
      drag = { pointerId: event.pointerId, dx: event.clientX - rect.left, dy: event.clientY - rect.top };
      handle.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    handle.addEventListener("pointermove", (event) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      const left = Math.max(0, Math.min(event.clientX - drag.dx, window.innerWidth - dialog.offsetWidth));
      const top = Math.max(0, Math.min(event.clientY - drag.dy, window.innerHeight - dialog.offsetHeight));
      dialog.style.left = `${Math.round(left)}px`;
      dialog.style.top = `${Math.round(top)}px`;
    });
    const finish = (event) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      drag = null;
      if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
      const rect = dialog.getBoundingClientRect();
      settings.floatPosition = { left: Math.round(rect.left), top: Math.round(rect.top) };
      saveSettings();
    };
    handle.addEventListener("pointerup", finish);
    handle.addEventListener("pointercancel", finish);
  }

  async function regenerateTeam() {
    if (!runtime.targetPlan) return alert("当前没有目标");
    runtime.userTeamOverride = false;
    const save = readSave();
    const storyTarget = runtime.target?.startsWith("push:") || runtime.target?.startsWith("unlock:");
    const enemyIds = storyTarget
      ? targetEnemiesForChapter(save.adv.chapter)
      : [runtime.targetPlan.speciesId].filter(Boolean);
    const levelWeight = storyTarget ? DEFAULT_LEVEL_WEIGHT : COLLECTION_LEVEL_WEIGHT;
    const targetLevel = storyTarget ? chapter(save.adv.chapter)?.ace : chapter(runtime.targetPlan.chapter)?.ace;
    const plan = runtime.targetPlan.roaming || runtime.targetPlan.special
      ? recommendRoamingTeam(save, runtime.targetPlan.speciesId)
      : recommendTeam(save, enemyIds, { levelWeight, targetLevel, chapterIndex: storyTarget ? save.adv.chapter : null });
    await exclusive("手动重新生成阵容", () => applyRecommendedTeam(plan, "用户要求重新生成"));
  }

  function applyManualTargets() {
    const input = document.querySelector("#pca-manual-targets");
    const tokens = String(input?.value || "").split(/[，,\s]+/).filter(Boolean);
    const save = readSave();
    const ids = tokens
      .map(resolveManualTarget)
      .filter((id) => species(id))
      .filter((id) => !ROAMING_LEGENDARIES.includes(id))
      .filter((id) => !isCaught(save, id))
      .filter((id) => specialTargetStatus(save, id) || potentialWildTarget(save, id, { includeStoryLocked: true }));
    settings.manualTargets = [...new Set(ids)];
    if (input) input.value = manualTargetsInputValue();
    saveSettings();
    runtime.target = null;
    runtime.targetPlan = null;
    runtime.collectionQueueSignature = "";
    renderManualTargetPreview();
    log(settings.manualTargets.length ? `手动优先目标：${settings.manualTargets.map((id) => species(id).n).join("、")}` : "已恢复自动缺失图鉴排序");
  }

  function renderCollectionQueue() {
    const root = document.querySelector("#pca-collection-queue");
    if (!root) return;
    const automatic = runtime.collectionQueue
      .filter((plan) => !settings.manualTargets.includes(plan.speciesId))
      .slice(0, COLLECTION_QUEUE_LIMIT);
    if (!automatic.length) {
      const waiting = runtime.waitingPlan;
      root.innerHTML = waiting
        ? `<div class="pca-target warn"><span>${escapeHtml(t("waitingCondition"))}</span><small>${escapeHtml(`${species(waiting.speciesId)?.n || waiting.speciesId} · ${new Date(waiting.availableAt).toLocaleString()}`)}</small></div>`
        : `<div class="pca-note">${escapeHtml(t("queueEmpty"))}</div>`;
      return;
    }
    root.innerHTML = automatic.map((plan, index) => {
      const condition = [plan.phase, plan.weather].filter(Boolean).join(" / ");
      const region = chapter(plan.chapter)?.region;
      const state = `${region ? `${t(region)} · ` : ""}${plan.chapterName} · ${plan.zone}${condition ? ` · ${condition}` : ""}`;
      const active = runtime.targetPlan?.speciesId === plan.speciesId ? " valid" : "";
      return `<div class="pca-target${active}"><span>${index + 1}. #${escapeHtml(speciesDisplayNumber(plan.speciesId))} ${escapeHtml(species(plan.speciesId)?.n || plan.speciesId)}</span><small>${escapeHtml(state)}</small></div>`;
    }).join("");
  }

  function renderCollectionScope(save) {
    const root = document.querySelector("#pca-scope-summary");
    if (!root || !save) return;
    const regions = collectionScopeRegions(save).map((region) => t(region));
    root.textContent = `${t("region")}：${regions.join(language() === "en" ? ", " : "、") || (language() === "en" ? "None selected" : "未选择地区")}`;
  }

  function renderStatus() {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return;
    let save = null;
    try { save = readSave(); } catch { /* ignore */ }
    const modeLabel = {
      push: t("pushTab"),
      collect: t("dexCollection"),
      roaming: t("roamOnly"),
      combined: t("combined"),
      idle: t("idle"),
    }[runtime.mode] || t("idle");
    const modeText = `${modeLabel}${runtime.paused ? ` (${t("paused")})` : runtime.busy ? ` (${t("working")})` : ""}`;
    panel.querySelectorAll('[data-status="mode"]').forEach((node) => {
      node.textContent = modeText;
      node.className = runtime.error ? "pca-status err" : runtime.paused ? "pca-status pause" : runtime.mode !== "idle" ? "pca-status run" : "";
    });
    const raidEvent = save?.adv?.event?.raid ? save.adv.event : null;
    const targetName = runtime.dailyRaidActiveRegion || raidEvent
      ? `${t("dailyRaid")}${raidEvent?.id ? ` · ${species(raidEvent.id)?.n || raidEvent.id}` : ""}`
      : runtime.target === "roam:waiting"
        ? t("waitingRoamers")
        : runtime.targetPlan?.moneyFarm ? t("moneyFarm")
        : runtime.targetPlan?.speciesId ? species(runtime.targetPlan.speciesId)?.n : runtime.targetPlan?.chapterName;
    panel.querySelectorAll('[data-status="target"]').forEach((node) => { node.textContent = targetName || "—"; });
    panel.querySelectorAll('[data-status="place"]').forEach((node) => {
      node.textContent = runtime.dailyRaidActiveRegion || raidEvent
        ? `${t("dailyRaid")} · ${t(runtime.dailyRaidActiveRegion || raidEvent?.reg)}`
        : `${chapter(save?.adv?.chapter)?.name || "—"}${runtime.targetPlan?.zone ? ` / ${runtime.targetPlan.zone}` : ""}`;
    });
    let attemptText = String(runtime.attempts);
    if (runtime.targetPlan?.roaming && runtime.attempts > 0) {
      const captureKey = save?.buffs?.capture?.key;
      const multiplier = captureKey === "golden-razz-berry" ? 1.5 : captureKey === "razz-berry" ? 1.25 : 1;
      const probability = 1 - (1 - 0.04 * multiplier) ** runtime.attempts;
      attemptText += ` · ${t("cumulative")} ${(probability * 100).toFixed(1)}%`;
    }
    panel.querySelectorAll('[data-status="attempts"]').forEach((node) => { node.textContent = attemptText; });
    const activeBuffs = Object.values(save?.buffs || {}).filter((buff) => buff?.until > Date.now()).map((buff) => {
      const left = Math.max(0, buff.until - Date.now());
      return `${berryLabel(BERRIES[buff.key]) || buff.key} ${Math.ceil(left / 60_000)} ${t("minutes")}`;
    });
    panel.querySelectorAll('[data-status="buffs"]').forEach((node) => { node.textContent = activeBuffs.join(language() === "en" ? ", " : "、") || "—"; });
    panel.querySelectorAll('[data-status="team"]').forEach((node) => { node.textContent = runtime.teamStatus === "未生成" ? t("notGenerated") : runtime.teamStatus; });
    const buddyStatus = panel.querySelector("#pca-buddy-status");
    if (buddyStatus) buddyStatus.textContent = runtime.buddyStatus || buddyStatusText(save);
    panel.querySelectorAll("[data-berry-stock]").forEach((node) => { node.textContent = String(save?.items?.[node.dataset.berryStock] || 0); });
    panel.querySelector("#pca-error").textContent = runtime.error ? `${runtime.error.phase}: ${runtime.error.observed}\n${t("suggestion")}: ${runtime.error.suggestion}` : `${t("noError")} · ${t("game")} ${gameBuild()} · ${t("data")} ${DATA.appBuild}`;
    renderRoamingPriority();
    renderCollectionScope(save);
    renderCollectionQueue();
  }

  function renderLog() {
    const root = document.querySelector("#pca-log");
    if (!root) return;
    root.innerHTML = runtime.logs.slice(0, 25).map((item) => `<div class="${item.level === "error" ? "error" : ""}">${new Date(item.at).toLocaleTimeString()} ${escapeHtml(item.message)}</div>`).join("");
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  }

  function offerResume() {
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
      if (!session?.running || !["push", "collect", "roaming", "combined"].includes(session.mode)) return;
      const labels = { push: "推图", collect: "普通图鉴收集", roaming: "神兽收集", combined: "协同收集" };
      log(`检测到上次未结束的${labels[session.mode]}任务，请手动点击对应入口恢复`);
      notifyUser("发现未结束任务", "为安全起见没有自动恢复，请在面板中确认启动。 ");
    } catch { /* ignore */ }
  }

  function init() {
    renderPanel();
    offerResume();
    observeDebugBattle();
    refreshDebugRecent();
    runtime.timer = setInterval(tick, 900);
    const timeline = document.querySelector("#timeline");
    if (timeline) {
      let queued = false;
      runtime.timelineObserver = new MutationObserver(() => {
        if (queued || runtime.busy || runtime.paused || !["collect", "combined"].includes(runtime.mode)) return;
        queued = true;
        queueMicrotask(() => {
          queued = false;
          tick();
        });
      });
      runtime.timelineObserver.observe(timeline, { subtree: true, attributes: true, attributeFilter: ["class"] });
    }
    document.addEventListener("click", (event) => {
      if (runtime.mode === "idle" || runtime.busy || !event.isTrusted) return;
      const manualGo = event.target.closest?.(".mp-go[data-go]");
      if (!manualGo) return;
      runtime.paused = true;
      log("检测到用户手动切换章节，自动任务已暂停");
      renderStatus();
    }, true);
    window.__pokeCatchAssistant = {
      version: VERSION,
      startPush: () => startMode("push"),
      startCollect: () => startMode("collect"),
      startRoaming: () => startMode("roaming"),
      startCombined: () => startMode("combined"),
      pause: pauseMode,
      stop: stopMode,
      state: runtime,
      dataBuild: DATA.appBuild,
      previewTeam: (chapterIndex = readSave().adv.chapter) => recommendTeam(
        readSave(),
        targetEnemiesForChapter(chapterIndex),
        { targetLevel: chapter(chapterIndex)?.ace, chapterIndex },
      ).details,
      previewChapterSimulation: (chapterIndex = readSave().adv.chapter) => {
        const save = readSave();
        const team = (save.teamSets?.list?.[4] || save.team || []).map((uid) => save.mons.find((mon) => mon.uid === uid)).filter(Boolean);
        return simulateChapterTeam(save, team, chapterIndex);
      },
      previewMissing: () => chooseMissingPlan(readSave()),
    };
    log(`助手已加载，游戏数据版本 ${DATA.appBuild}`);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
