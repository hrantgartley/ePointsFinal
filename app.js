// Express app to handle api endpoints for our gaming data server

// eslint-disable
const express = require("express")
const app = express()
const port = 3000
const { MongoClient } = require("mongodb")
const url = "mongodb://localhost:27017/Game"
const client = new MongoClient(url)
app.use(express.json())
const dbname = "gamingData"
const db = client.db(dbname)
const collection = db.collection("character")
const connect = async () => {
    try {
        await client.connect()
        console.log("Connected to database")
    } catch (err) {
        console.log("Failed to connect to database", err)
    }
}

connect()

// an enpoint that returns the character
app.get("/api/character/:tag", (req, res) => {
    const gamerTag = req.params.tag
    res.writeHead(200)
    console.log(`The client sent us: ${gamerTag} as the gamerTag`)
    res.end(`{"characterTag": "${gamerTag}"}`)
})

// an endpoint that updates the character
app.put("/api/character/:tag", async (req, res) => {
    const gamerTag = req.params.tag
    const character = db.collection("character")
    const startingTime = Date.now()
    try {
        const updateResult = await character.updateOne(
            { gamerTag: gamerTag },
            {
                $set: {
                    look: { skin: "batman" },
                    alive: true,
                    protection: {
                        health: 100,
                        armor: 100,
                        shield: 100,
                        overshield: 100,
                    },
                },
            },
        )
        if (updateResult.modifiedCount === 1) {
            res.status(200).send({ message: "Document updated" })
        } else {
            res.status(404).send({ message: "Document not found" })
        }
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: "Internal Server Error" })
    }
    console.log("The client has sent the following data: ", req.body)
    const endingTime = Date.now()
    console.log(`The request took ${endingTime - startingTime}ms to complete`)
})

app.post("/api/character/post/:tag", async (req, res) => {
    const charData = req.params.tag
    const character = db.collection("character")
    try {
        const insertRes = await character.insertOne({
            tag: charData,
            look: { skin: "batman" },
            alive: true,
            protection: {
                health: 100,
                armor: 100,
                shield: 100,
                overshield: 100,
            },
        })
        if (insertRes.insertedCount === 1) {
            res.status(200).send({ message: "Document inserted" })
        }
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: "Internal Server Error" })
    }
})

//TODO: make a database on local machine to test

app.delete("/api/character/:tag", async (req, res) => {
    const gamerTag = req.params.tag
    try {
        const deleteOne = await collection.deleteOne({
            gamerTag: gamerTag,
        })
        if (deleteOne.deletedCount === 1) {
            res.status(200).send(`Deleted ${gamerTag} from the database`)
            console.log(`Deleted ${gamerTag} from the database`)
        } else {
            res.status(404).send(`Could not find ${gamerTag} in the database`)
            console.log(`Could not find ${gamerTag} in the database`)
        }
    } catch (err) {
        console.error(err)
        res.status(500).send(`Error deleting ${gamerTag} from the database`)
        console.log(`Error deleting ${gamerTag} from the database`)
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}`))

module.exports = app
