import express from "express";

const app = express();
app.use(express.json());

app.post("/count", (req, res) => {
  const { text, word } = req.body;

  if (
    typeof text !== "string" ||
    typeof word !== "string"
  ) {
    return res.status(400).send();
  }

  const lowerText = text.toLowerCase();
  const lowerWord = word.toLowerCase();
  const regex = new RegExp(`\\b${escapeRegex(lowerWord)}\\b`, "g");
  const matches = lowerText.match(regex);
  const count = matches ? matches.length : 0;

  return res.json({ count });
});

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default app;
