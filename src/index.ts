import express, { Request, Response } from "express";
import cors from "cors";
import ytdl from "ytdl-core";

const app = express();

app.use(cors());

app.listen(3000, () => console.log("lintening on port 3000"));

app.get("/", async (req: Request, res: Response) => {
  const { id } = req.query;
  res.send(await ytdl.getInfo(id as string));
});
