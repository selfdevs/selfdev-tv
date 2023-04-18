import express from "express";
import cors from "cors";
import ObsClient from "./services/ObsClient";
import multer from "multer";
import { DateTime } from "luxon";
import AppDataSource from "./data-source";
import { Media } from "./entities/Media";
import getVideoDurationInSeconds from "get-video-duration";
import { ScheduledEvent } from "./entities/ScheduledEvent";
import { MoreThan } from "typeorm";

const upload = multer({ dest: "assets/" });

const app = express();

app.use(cors());
app.use(express.json());

const TICKET_INTERVAL = 1000;

setInterval(async () => {
  const scheduledEventsRepository = AppDataSource.getRepository(ScheduledEvent);
  const queue = await scheduledEventsRepository.find({
    where: {
      startTime: MoreThan(DateTime.now().toJSDate()),
    },
    relations: ["media"],
    order: {
      startTime: "ASC",
    },
  });
  console.log(queue);
  if (
    DateTime.fromJSDate(queue[0]?.startTime).minus({
      millisecond: TICKET_INTERVAL,
    }) < DateTime.now()
  ) {
    await runMedia(queue[0].media.filename);
  }
}, TICKET_INTERVAL);

async function runMedia(filename: string) {
  console.log("run media");
  return new Promise((resolve) => {
    ObsClient.setInputSettings("scheduled_media", {
      local_file: process.env.PWD + "/assets/" + filename,
    });
    ObsClient.switchToScene("schedule");
    ObsClient.client.addEventListener("message", (message) => {
      const data = JSON.parse(message.data.toString());
      if (
        data.op === 5 &&
        data.d.eventData.inputName === "scheduled_media" &&
        data.d.eventType === "MediaInputPlaybackEnded"
      ) {
        ObsClient.switchToScene("fallback");
        return resolve("ok");
      }
    });
  });
}

app.post("/upload", upload.single("video"), async (req, res) => {
  console.log(req.file.filename);
  const mediaRepository = AppDataSource.getRepository(Media);
  const duration = await getVideoDurationInSeconds(
    `assets/${req.file.filename}`
  );
  const newMediaEntry = mediaRepository.create({
    filename: req.file.filename,
    length: Math.floor(duration),
    name: req.body.name,
  });
  await mediaRepository.save(newMediaEntry);
  res.send("ok");
});

app.get("/media", async (req, res) => {
  const mediaRepository = AppDataSource.getRepository(Media);
  const media = await mediaRepository.find();
  res.send(media);
});

app.post("/queue", async (req, res) => {
  console.log(req.body);
  const mediaRepository = AppDataSource.getRepository(Media);
  const scheduledEventRepository = AppDataSource.getRepository(ScheduledEvent);
  const mediaId = req.body.mediaId;
  const startTime = DateTime.fromISO(req.body.startTime);
  const media = await mediaRepository.findOneBy({ id: mediaId });
  const newEvent = scheduledEventRepository.create({
    media,
    startTime,
  });
  await scheduledEventRepository.save(newEvent);
  res.send("ok");
});

app.get("/schedule", async (req, res) => {
  const scheduledEventRepository = AppDataSource.getRepository(ScheduledEvent);
  const schedule = await scheduledEventRepository.find({
    relations: ["media"],
    where: {
      startTime: MoreThan(DateTime.now().toJSDate()),
    },
    order: {
      startTime: "ASC",
    },
  });
  res.send(schedule);
});

ObsClient.connect().then(() => {
  console.log("Connected to OBS");
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
