const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const server = require("http").Server(app);
const hbs = require("hbs");
const path = require("path");
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "templates/views");
const script_file = path.join(__dirname, "/inside");
const { v4: uuidv4 } = require("uuid");

const bodyParser = require("body-parser");

const translate = require("@vitalets/google-translate-api");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("view engine", "hbs");
app.set("views", template_path);
app.use(express.static(static_path));
app.use(express.static(__dirname + "../public"));
app.use(express.static("public"));

app.use("/public", express.static(__dirname + "/public"));
async function translateString(str, translateTo) {
  translate.engine = "libre";
  const translateted_string = await translate(str, translateTo);
  console.log(translateted_string);
}

app.get("/", async (req, res) => {
  res.render("index");
});
// app.post("/", async (req, res) => {
//   try {
//     import translate from "translate";

//     translate.engine = "google"; // Or "yandex", "libre", "deepl"
//     translate.key = process.env.GOOGLE_KEY;

//     const text = await translate("Hello world", "es");
//     console.log("Hola mundo");
//   } catch (error) {
//     console.log(error);
//   }
// });
app.get("/speechtranslator", (req, res) => {
  res.render("speechtranslator", {
    title: "Speech Translator Online to Multiple Languages - Free Media Tools",
    translated: "",
  });
});

app.post("/speechtranslator", (req, res) => {
  console.log(req.body.speech);

  translate(req.body.speech, { to: req.body.language })
    .then((response) => {
      res.render("speechtranslator", {
        title:
          "Speech Translator Online to Multiple Languages - Free Media Tools",
        translated: response.text,
      });
    })
    .catch((err) => {
      console.error(err);
    });
});
app.listen(port, () => {
  console.log(`is listening at port ${port}`);
  console.log(__dirname);
});
