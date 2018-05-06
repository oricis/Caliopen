/* eslint-disable import/no-extraneous-dependencies, no-restricted-globals */
import 'babel-polyfill';
import getClient from '../../../services/api-client';

const THROTTLE_DURATION = 50 * 1000;

class Poller {
  client = getClient();
  intervalId = undefined

  stop = () => {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  start = () => {
    self.postMessage({ status: 'active' });
    this.intervalId = setInterval(async () => {
      const now = new Date();
      try {
        const { data: results } = await this.client.get('/api/v2/notifications');

        if (results.total > 0) {
          this.client.delete('/api/v2/notifications', {
            params: {
              until: now.toISOString(),
            },
          });
        }

        self.postMessage({ results });
      } catch (err) {
        if (err.response.status >= 400) {
          this.stop();
          self.postMessage({ status: 'terminated' });

          return;
        }
        throw err;
      }
    }, THROTTLE_DURATION);
  }


  handleStart = (message) => {
    if (message.action === 'start') {
      this.start();
    }
  };

  handleStop = (message) => {
    if (message.action === 'stop') {
      this.stop();
    }
  };

  handleEvent = (event) => {
    this.handleStart(event.data);
    this.handleStop(event.data);
  }
}

const poller = new Poller();

self.addEventListener('message', (event) => {
  poller.handleEvent(event);
});
