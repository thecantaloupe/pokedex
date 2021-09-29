////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
require("dotenv").config() // Load ENV Variables
const express = require("express") // import express
const methodOverride = require("method-override")
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


// Show
// GET /pokemon/:id

// New
// GET /pokemon/new
app.get("/pokemon/new", (req,res) => {
    var pokeNames = []
    var pokeIdx = []
    var pokeImg = []
    for (poke of pokemon) {
        if (poke.name.indexOf('\'') >=0){
            poke.name = poke.name.replace("'","")
        }
        pokeNames.push(poke.name)
        pokeIdx.push(poke.id)
        pokeImg.push(poke.img)
    }
    res.render("new.ejs", { data: pokemon, title: "Pokemon", pokename: pokeNames, index: pokeIdx, img: pokeImg})
})
// Edit
// GET /pokemon/:id/edit

// Create
// POST /pokemon
app.post("/pokemon", (req,res) => {
    // use id to get pokemon from main array
    let bod = pokemon.find(el => el.id === req.body.id)
    // push bod into the array of myPoke
    myPoke.push(bod)
    console.log(bod)
    // redirect (get) to /pokemon
    res.redirect("/pokemon")
});

// Update
// PUT /pokemon/:id

// Destroy
// DELETE /pokemon/:id


//////////////////////////////////////////////
// Server Listener
//////////////////////////////////////////////
app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`))