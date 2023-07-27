const express = require("express");
const path = require("path");
const fs = require("fs");
const {v4: uuidv4} = require("uuid")
const PORT = process.env.PORT || 3001
const app = express()
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static("public"))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"))
});

app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", (err, data) => {
        if(err) throw err;
        let dbData = JSON.parse(data)
        res.json(dbData)
    })
})
app.post("/api/notes", (req, res) => {
    const dbData = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"))
    const freshNote = {
        title: req.body.title,
        text: req.body.text,
        id: uuidv4()
    }
    dbData.push(freshNote)
    fs.writeFileSync("./db/db.json", JSON.stringify(dbData))
    res.json(dbData)
})

app.delete("/api/notes/:id", (req, res) => {
    let data = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"))
    const filterNotes = data.filter((note) => {
        return note.id !== req.params.id

    })

    fs.writeFileSync("./db/db.json", JSON.stringify(filterNotes))
    res.json("noteDeleted")
    
})

app.listen(PORT, () => {
    console.log(`app.listening: ${PORT}`)
})

