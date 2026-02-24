import app from "./searchApi";

const port = process.env.PORT ? Number(process.env.PORT) : 3001;

app.listen(port, () => {
  console.log(`Mini API (POST /count) on http://localhost:${port}`);
});
