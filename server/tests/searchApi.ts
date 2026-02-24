import express, { Request, Response } from "express";
import { countOccurrences } from "./countOccurrences";

const app = express();
app.use(express.json());

/**
 * POST /count
 * Body: { text: string, word: string }
 * Réponse: { count: number } — nombre d'occurrences du mot dans le texte
 */
app.post("/count", (req: Request, res: Response) => {
  const { text, word } = req.body ?? {};
  if (typeof text !== "string" || typeof word !== "string") {
    return res.status(400).json({
      error: "Body must contain 'text' and 'word' as strings",
    });
  }
  const count = countOccurrences(text, word);
  return res.status(200).json({ count });
});

export default app;
