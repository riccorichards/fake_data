const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
mongo_uri =
  "mongodb+srv://trriccorichards:14dEn8ymHvN2OH4q@cluster0.ojuvf.mongodb.net/fakedataforpdf?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(mongo_uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

///////////////////////////////////////////////////////////////
const SearchTerm = new mongoose.Schema({
  term: { type: String, required: true },
});
const SearchTermModel = mongoose.model("SearchTerm", SearchTerm);

const RelativeSum = new mongoose.Schema({
  searchedTerm: { type: String, required: true },
  summary: { type: String, required: true },
});
const RelativeSumModel = mongoose.model("RelativeSum", RelativeSum);

const RelativeWeb = new mongoose.Schema({
  term: { type: String, required: true },
  webs: [
    {
      title: { type: String },
      link: { type: String },
      snippet: { type: String },
      favicon: { type: String },
      domain: { type: String },
    },
  ],
});
const RelativeWebModel = mongoose.model("RelativeWeb", RelativeWeb);

const ChatWithWeb = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  conversation: [
    {
      author: { type: String },
      message: { type: String },
    },
  ],
});

const ChatWithWebModel = mongoose.model("ChatWithWeb", ChatWithWeb);

//////////////////////////////////////////////////////////////////////////
app.post("/searchTerm", async (req, res) => {
  try {
    const searchTerm = new SearchTermModel(req.body);
    await searchTerm.save();
    res.status(201).json(searchTerm);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/searchTerm", async (req, res) => {
  try {
    const searchTerm = await SearchTermModel.find();
    res.json(searchTerm);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/summary/:searchedTerm", async (req, res) => {
  try {
    const searchedTerm = req.params.searchedTerm;
    const summary = await RelativeSumModel.findOne({ searchedTerm });
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/summary", async (req, res) => {
  try {
    const summary = await RelativeSumModel.create(req.body);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/web", async (req, res) => {
  try {
    const web = await RelativeWebModel.create(req.body);
    res.json(web);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/web/:link", async (req, res) => {
  try {
    const webs = await RelativeWebModel.find({ term: req.params.link });

    res.json(webs);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/chat", async (req, res) => {
  try {
    const chat = await ChatWithWebModel.create(req.body);
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/chat/:email", async (req, res) => {
  try {
    const link = req.params.link;

    const webs = await ChatWithWebModel.find({ link });
    res.json(webs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
