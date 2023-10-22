const express = require("express");
const https = require("https");
const url = "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/all.json";
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true}));

app.engine("ejs", require("ejs").renderFile);
app.use(express.static("public"));
app.set("view engine", "ejs");


app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/html/index.html");
  });

app.get('/index', (req, res) => {
    https.get(url, (response) => {
        if(response.statusCode == 200){
            let tempJSON = "";
            response.on("data", (data) => {
                tempJSON += data;
            }).on("end", (data) => {
                let jsonfile = JSON.parse(tempJSON);
                res.setHeader("Content-Type", "text/html");
                const a = [];
                jsonfile.forEach((hero) =>{
                    a.push({
                        id: hero.id,
                        name: hero.name,
                        image: hero.images.md,
                      });
                });
                res.render('index', {a});
            });
        }
    });
});

app.get('/search', (req, res) => {
    res.setHeader("Content-Type", "text/html");
    https.get(url, (response) => {
        if(response.statusCode == 200){
            let tempJSON3 = "";
            response.on("data", (data) => {
                tempJSON3 += data;
            }).on("end", (data) => {
                let jsonfile3 = JSON.parse(tempJSON3);
                const c = [];
                jsonfile3.forEach((hero) => {
                    c.push({
                        id: hero.id,
                        name: hero.name,
                        image: hero.images.md,
                        biography: hero.biography.fullName,
                        power1: hero.powerstats.intelligence,
                        power2: hero.powerstats.strength,
                        power3: hero.powerstats.speed,
                        power4: hero.powerstats.durability,
                        power5: hero.powerstats.power,
                        power6: hero.powerstats.combat,
                        birth: hero.biography.placeOfBirth,
                        first: hero.biography.firstAppearance,
                        aliases: hero.biography.aliases,
                        gender: hero.appearance.gender,
                        race: hero.appearance.race,
                        height: hero.appearance.height,
                        weight: hero.appearance.weight,
                        eyeColor: hero.appearance.eyeColor,
                        hairColor: hero.appearance.hairColor,
                        affiliation: hero.connections.groupAffiliation,
                    });
                });
                const name = req.query.name.toLowerCase();
                const matchingHero = c.find((hero) => hero.name.toLowerCase() == name);
                if (matchingHero) {
                const id = matchingHero.id;
                var idprev;
                var idpost;
                if (id === 731) {
                    idprev = id - 1;
                    idpost = 1;
                } else if (id === 1) {
                    idprev = 731;
                    idpost = id + 1;
                } else {
                    idprev = id - 1;
                    idpost = id + 1;
                }
                res.render('cards', { idprev, idpost, hero: matchingHero });
                } else {
                res.render('error2');
                }
            });
        }
    });
});

app.get('/cards', (req, res) => {
    res.setHeader("Content-Type", "text/html");
    https.get(url, (response) => {
        let tempJSON2 = "";
        response.on("data", (data) => {
            tempJSON2 += data;
        }).on("end", (data) => {
            let jsonfile2 = JSON.parse(tempJSON2);
            const b = [];
            jsonfile2.forEach((hero) => {
                b.push({
                    id: hero.id,
                    name: hero.name,
                    image: hero.images.md,
                    biography: hero.biography.fullName,
                    power1: hero.powerstats.intelligence,
                    power2: hero.powerstats.strength,
                    power3: hero.powerstats.speed,
                    power4: hero.powerstats.durability,
                    power5: hero.powerstats.power,
                    power6: hero.powerstats.combat,
                    birth: hero.biography.placeOfBirth,
                    first: hero.biography.firstAppearance,
                    aliases: hero.biography.aliases,
                    gender: hero.appearance.gender,
                    race: hero.appearance.race,
                    height: hero.appearance.height,
                    weight: hero.appearance.weight,
                    eyeColor: hero.appearance.eyeColor,
                    hairColor: hero.appearance.hairColor,
                    affiliation: hero.connections.groupAffiliation,
                });
            });
                const id = parseInt(req.query.id);
                var idprev;
                var idpost;
                if (id === 731) {
                    idprev = id - 1;
                    idpost = 1;
                } else if (id === 1) {
                    idprev = 731;
                    idpost = id + 1;
                } else {
                    idprev = id - 1;
                    idpost = id + 1;
                }
                const image = req.query.image;
                const matchingHero = b.find((hero) => hero.id === id);
                if(matchingHero) {
                    res.render('cards', { id, image, idprev, idpost, hero: matchingHero });
                }else {
                    res.render('error');
                }
        });
    });
});



//guardar en el cache la información necesaria para mostrar lo que yo quiero. 
//De que forma: conteniendo los atributos de heroes como images, stats o biography en variables globales.


app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(500).send("There was an error in the app"); 
  });

app.listen(3000, () => {
    console.log("Listening to port 3000");
});