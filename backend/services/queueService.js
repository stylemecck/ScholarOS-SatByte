const { Queue, Worker } = require('bullmq');
const IORedis = require('ioredis');

class QueueService {
  constructor() {
    this.redisConfig = {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      maxRetriesPerRequest: null,
    };

    this.connection = null;
    this.isRedisAvailable = false;
    this.queues = {};

    // Attempt to connect to Redis
    this.init();
  }

  async init() {
    try {
      this.connection = new IORedis(this.redisConfig);
      this.connection.on('error', (err) => {
        console.warn('QueueService: Redis connection failed. Falling back to immediate processing.');
        this.isRedisAvailable = false;
      });
      this.connection.on('connect', () => {
        console.log('✅ QueueService: Connected to Redis.');
        this.isRedisAvailable = true;
      });
    } catch (err) {
      console.warn('QueueService: Redis init failed.');
    }
  }

  /**
   * Add a job to the queue, or process immediately if Redis is unavailable
   * @param {string} queueName - Name of the queue
   * @param {string} jobName - Name of the job
   * @param {object} data - Job data
   * @param {function} immediateHandler - Function to call if processing immediately
   */
  async addJob(queueName, jobName, data, immediateHandler) {
    if (this.isRedisAvailable) {
      if (!this.queues[queueName]) {
        this.queues[queueName] = new Queue(queueName, { connection: this.connection });
      }
      const job = await this.queues[queueName].add(jobName, data);
      return { type: 'queued', jobId: job.id };
    } else {
      // Fallback: Process immediately
      console.log(`QueueService: Immediate processing for ${jobName}`);
      const result = await immediateHandler(data);
      return { type: 'immediate', result };
    }
  }

  /**
   * Setup a worker for a queue
   */
  setupWorker(queueName, processor) {
    if (this.isRedisAvailable) {
      new Worker(queueName, processor, { connection: this.connection });
      console.log(`✅ QueueService: Worker started for ${queueName}`);
    }
  }
}

module.exports = new QueueService();
