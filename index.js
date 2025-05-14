import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "project",
    password: "password",
    port: 5432,
});
db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to database");
    }
});

let items = [];

app.get("/", async (req, res) => {
    try {
        const itemList = await db.query("SELECT * FROM inventory");
        items = itemList.rows;       
        res.render("index.ejs", { items: items  });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.post("/post", async (req, res) => {
    const name = req.body.itemName;
    const quantity = req.body.quantity;
    // console.log(name);
    try {
        const result = await db.query("INSERT INTO inventory (item_name, quantity) VALUES ($1, $2)", [name, quantity]);
    } catch (error) {
        console.log(error);
    }
    res.redirect("/");
});

app.post("/delete", async (req, res) => {
    const id = req.body.del;
    try {
        const result = await db.query("DELETE FROM inventory WHERE id = $1", [id]);
        console.log(result.rows);
    } catch {
        console.log("couldn't find the ID in database!");
    }
    
    res.redirect("/");
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
}
);
