////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
require("dotenv").config() // Load ENV Variables
const express = require("express") // import express
const methodOverride = require("method-override")
const ColorThief = require('colorthief');

////////////////////////////////////////////////
// Variables
////////////////////////////////////////////////
const PORT = process.env.PORT || 3003
const myPoke = []

////////////////////////////////////////////////
// Import Data
////////////////////////////////////////////////
// Import fruits data
const pokemon = require("./models/pokemon.js")

const pokecolor = () => {
    for (let i = 0; i < pokemon.length; i++){
        let img = pokemon[i].img
        ColorThief.getColor(img)
            .then(color => { 
                pokemon[i].imgcolor = color })
            .catch(err => { console.log(err) })
    }
}
pokecolor()


/////////////////////////////////////////////////
// Create our Express Application Object
/////////////////////////////////////////////////
const app = express()

/////////////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////////////
app.use(methodOverride("_method")) // override for put and delete requests from forms
app.use(express.urlencoded({extended: false})) // parse urlencoded request bodies
app.use(express.static("public")) // serve files from public statically
// serve files statically from the public folder
app.use(express.static(__dirname + "public"));

////////////////////////////////////////////
// Routes
////////////////////////////////////////////
app.get("/", (req, res) => {
    res.send("your server is running... better catch it.")
})



// Index
// GET /pokemon
app.get("/pokemon/", (req, res) => {
    res.render("index.ejs", { data: pokemon, title: "Pokemon", pokemon: myPoke });
});

// New
// GET /pokemon/new
app.get("/pokemon/new", (req,res) => {
    var pokeNames = []
    var pokeIdx = []
    var pokeImg = []
    var pokeClr = []
    for (poke of pokemon) {
        if (poke.name.indexOf('\'') >=0){
            poke.name = poke.name.replace("'","")
        }
        pokeNames.push(poke.name)
        pokeIdx.push(poke.id)
        pokeImg.push(poke.img)
        pokeClr.push(poke.imgcolor)
    }
    res.render("new.ejs", { data: pokemon, title: "Pokemon", pokename: pokeNames, index: pokeIdx, img: pokeImg, imgclr: pokeClr})
})
// Destroy
// DELETE /pokemon/:id
app.delete("/pokemon/:id", (req,res) => {
    myPoke.splice(req.params.id,1)
    res.redirect("/pokemon")
})

// Update
// PUT /pokemon/:id
app.put("/pokemon/:id", (req, res) => {
        //update mypoke
        let oldpoke = myPoke[req.params.id]
        let oldpokem = myPoke[req.params.id].misc
        let oldpokes = myPoke[req.params.id].stats
        let updates = req.body
        console.log(updates)
        oldpoke.name = updates.name
        oldpokem.height = updates.height
        oldpokem.classification = updates.classification
        oldpokes.hp = updates.hp
        oldpokes.attack = updates.attack
        oldpokes.defense = updates.defense
        oldpokes.spattack = updates.spattack
        oldpokes.spdefense = updates.spdefense
        oldpokes.speed = updates.speed
        // REDIRECT THEM BACK TO INDEX
        res.redirect("/pokemon")
})

// Create
// POST /pokemon
app.post("/pokemon", (req,res) => {
    // use id to get pokemon from main array
    let bod = pokemon.find(el => el.id === req.body.id)
    // push bod into the array of myPoke
    myPoke.push(bod)
    // redirect (get) to /pokemon
    res.redirect("/pokemon")
});

// Edit
// GET /pokemon/:id/edit
app.get("/pokemon/:id/edit", (req, res) => {
    res.render("edit.ejs", {
        data: myPoke[req.params.id],
        index: req.params.id,
        title: "Pokedex - Edit Page",
        color: myPoke[req.params.id].imgcolor,
    })
})

// SHOW ROUTES - GETS ONE POKEMON
app.get("/pokemon/:id", (req, res) => {
    res.render("show.ejs", { data: myPoke[req.params.id], title: "First - Show Page", color: myPoke[req.params.id].imgcolor, });
  });

//////////////////////////////////////////////
// Server Listener
//////////////////////////////////////////////
app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`))