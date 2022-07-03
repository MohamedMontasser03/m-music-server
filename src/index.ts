import express, { Request, Response } from "express";
import cors from "cors";
import ytdl from "ytdl-core";
import dotenv from "dotenv";
import { getVideoSearchResults } from "./utils/youtube-utils";
dotenv.config();

const app = express();

app.use(cors());

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

app.get("/v0/", (req: Request, res: Response) => res.send("M Music API"));

app.get("/v0/healthcheck", (req: Request, res: Response) =>
  res.sendStatus(200)
);

app.get("/v0/search", async (req: Request, res: Response) => {
  try {
    const { q: query } = req.query as { q: string };

    res.send(await getVideoSearchResults(query));
  } catch (err) {
    console.log(err);
    res.status(500).send("failed to fetch videos");
  }
});

app.get("/v0/watch", async (req: Request, res: Response) => {
  const { id } = req.query as { id: string };
  const vidInfo = await ytdl.getInfo(id);
  res.send({
    id: vidInfo.videoDetails.videoId,
    title: vidInfo.videoDetails.title,
    authorId: vidInfo.videoDetails.author.id,
    author: vidInfo.videoDetails.author.name,
    thumbnails: vidInfo.videoDetails.thumbnails,
    duration: vidInfo.videoDetails.lengthSeconds,
    audioFormats: vidInfo.formats.filter((f) => f.hasAudio && !f.hasVideo),
    videoFormats: vidInfo.formats.filter((f) => f.hasVideo && !f.hasAudio),
    videoAudioFormats: vidInfo.formats.filter((f) => f.hasVideo && f.hasAudio),
  });
});
