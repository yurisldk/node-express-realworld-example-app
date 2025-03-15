import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import routes from './app/routes/routes';
import HttpException from './app/models/http-exception.model';

const app = express();

/**
 * App Configuration
 */

if (process.env.NODE_ENV === "development") {
  app.use((req, _res, next) => {
    const minDelay = parseInt(process.env.MIN_REQUEST_DELAY_MS || "700", 10);
    const maxDelay = parseInt(process.env.MAX_REQUEST_DELAY_MS || "3000", 10);

    const delayTime =
      Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

    const timeout = setTimeout(() => {
      if (!req.destroyed) {
        next();
      }
    }, delayTime);

    req.on("close", () => {
      clearTimeout(timeout);
    });
  });
}

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

// Serves images
app.use(express.static(__dirname + '/assets'));

app.get('/', (req: express.Request, res: express.Response) => {
  res.json({ status: 'API is running on /api' });
});

/* eslint-disable */
app.use(
  (
    err: Error | HttpException,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    // @ts-ignore
    if (err && err.name === 'UnauthorizedError') {
      return res.status(401).json({
        status: 'error',
        message: 'missing authorization credentials',
      });
      // @ts-ignore
    } else if (err && err.errorCode) {
      // @ts-ignore
      res.status(err.errorCode).json(err.message);
    } else if (err) {
      res.status(500).json(err.message);
    }
  },
);

/**
 * Server activation
 */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.info(`server up on port ${PORT}`);
});
