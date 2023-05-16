import express, { Request } from 'express';
import cors from 'cors';
import multer from 'multer';
import { DateTime } from 'luxon';
import AppDataSource from './data-source';
import { Media } from './entities/Media';
import getVideoDurationInSeconds from 'get-video-duration';
import { ScheduledEvent } from './entities/ScheduledEvent';
import { MoreThan } from 'typeorm';
import { getConnectedClient } from './utils/obs';
import { getEnvOrThrow } from './utils/env';
import { Server } from 'socket.io';
import http from 'http';
import { Epg } from './entities/Epg';

const upload = multer({ dest: 'assets/' });

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

const TICKER_INTERVAL = 1000;

function startTicker() {
  setInterval(async () => {
    const now = DateTime.now();
    if (now.hour === 23 && now.minute === 0 && now.second === 0) {
      const obs = await getConnectedClient();
      await obs.call('StopStream');
      setTimeout(() => {
        obs.call('StartStream');
      }, 10000);
    }
    const scheduledEventsRepository =
      AppDataSource.getRepository(ScheduledEvent);
    const queue = await scheduledEventsRepository.find({
      where: {
        startTime: MoreThan(DateTime.now().toJSDate()),
      },
      relations: ['media'],
      order: {
        startTime: 'ASC',
      },
    });
    if (
      DateTime.fromJSDate(queue[0]?.startTime).minus({
        millisecond: TICKER_INTERVAL,
      }) < DateTime.now() &&
      queue[0].media
    ) {
      console.log('Found scheduled media to play');
      await runMedia(queue[0].media.filename);
    }
  }, TICKER_INTERVAL);
}

async function runMedia(filename: string) {
  console.log('Play scheduled media');
  const obs = await getConnectedClient();
  await obs.call('SetInputSettings', {
    inputName: 'scheduled_media',
    inputSettings: {
      local_file: getEnvOrThrow('ASSETS_BASE_PATH') + filename,
    },
  });
  await obs.call('SetCurrentProgramScene', {
    sceneName: 'schedule',
  });

  return new Promise((resolve) => {
    obs.on('MediaInputPlaybackEnded', async ({ inputName }) => {
      if (inputName !== 'scheduled_media') return;
      console.log('Scheduled media ended');
      await obs.call('SetCurrentProgramScene', {
        sceneName: 'fallback',
      });
      return resolve('ok');
    });
  });
}

app.post('/upload', upload.single('video'), async (req, res) => {
  if (!req.file?.filename) return res.status(400).send('No file uploaded');
  console.log(req.file.filename);
  const mediaRepository = AppDataSource.getRepository(Media);
  const duration = await getVideoDurationInSeconds(
    `assets/${req.file.filename}`,
  );
  const newMediaEntry = mediaRepository.create({
    filename: req.file.filename,
    length: Math.floor(duration),
    name: req.body.name,
  });
  await mediaRepository.save(newMediaEntry);
  res.send('ok');
});

app.get('/media', async (req, res) => {
  const mediaRepository = AppDataSource.getRepository(Media);
  const media = await mediaRepository.find();
  res.send(media);
});

app.post('/queue', async (req, res) => {
  console.log(req.body);
  const mediaRepository = AppDataSource.getRepository(Media);
  const scheduledEventRepository = AppDataSource.getRepository(ScheduledEvent);
  const epgRepository = AppDataSource.getRepository(Epg);
  const startTime = DateTime.fromISO(req.body.startTime);
  const title = req.body.title;
  const description = req.body.description;
  let epg;
  if (title && description) {
    epg = epgRepository.create({
      title,
      description,
    });
    await epgRepository.save(epg);
  }
  const newEvent = scheduledEventRepository.create({
    startTime,
    epg: epg,
  });
  const mediaId = req.body.mediaId;
  if (mediaId) {
    const media = await mediaRepository.findOneBy({ id: mediaId });
    if (!media) return res.status(400).send('Media not found');
    newEvent.media = media;
  }
  await scheduledEventRepository.save(newEvent);
  io.emit('scheduleUpdate');
  res.send('ok');
});

app.get('/schedule', async (req: Request, res) => {
  const scheduledEventRepository = AppDataSource.getRepository(ScheduledEvent);
  const schedule = await scheduledEventRepository.find({
    relations: ['media', 'epg'],
    where: {
      startTime: MoreThan(DateTime.now().toJSDate()),
    },
    order: {
      startTime: 'ASC',
    },
  });
  res.send(schedule);
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    void AppDataSource.runMigrations()
      .then(() => {
        console.log('Migrations have been run!');
        startTicker();
      })
      .catch((err) => {
        console.error('Error during migration', err);
      });
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
