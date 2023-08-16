'use strict'
const { BullMonitorExpress } = require('@bull-monitor/express');
const { BullAdapter } = require('@bull-monitor/root/dist/bull-adapter');
const Queue = require('bull');

const redisConnection = {
  host: process.env.REDIS_SERVER,
  port: +process.env.REDIS_PORT,
  password: process.env.REDIS_PASS
}

const shardQue = new Queue('shardQue', { redis: redisConnection })
const discord = new Queue('discord', { redis: redisConnection })
const discordPrivate = new Queue('discordPrivate', { redis: redisConnection })
const oauth = new Queue('oauth', { redis: redisConnection })
const oauthPrivate = new Queue('oauthPrivate', { redis: redisConnection })
const swgoh = new Queue('swgoh', { redis: redisConnection })
const swgohPrivate = new Queue('swgohPrivate', { redis: redisConnection })
const guildQue = new Queue('guildQue', { redis: redisConnection })

const Ques = [
  new BullAdapter(shardQue),
  new BullAdapter(discord),
  new BullAdapter(discordPrivate),
  new BullAdapter(oauth),
  new BullAdapter(oauthPrivate),
  new BullAdapter(swgoh),
  new BullAdapter(swgohPrivate),
  new BullAdapter(guildQue)
]

const monitor = new BullMonitorExpress({
  queues: Ques,
  // enables graphql introspection query. false by default if NODE_ENV == production, true otherwise
  gqlIntrospection: true,
  metrics: {
    // collect metrics every X
    // where X is any value supported by https://github.com/kibertoad/toad-scheduler
    collectInterval: { hours: 1 },
    maxMetrics: 100
  }
})
module.exports = monitor
module.exports.start = async()=>{
  try{
    await monitor.init()
  }catch(e){
    throw(e)
  }
}
