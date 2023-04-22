const { Telegraf } = require("telegraf")
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const bot = new Telegraf(process.env.T_TOKEN)

bot.start(ctx => {
  console.log("Received /start command")
  try {
    return ctx.reply("Hi")
  } catch (e) {
    console.error("error in start action:", e)
    return ctx.reply("Error occured")
  }
})

bot.on('message', (ctx) => {
  const chatId = ctx.message.chat.id;
  if (ctx.message.text.includes('/cat')) {
    fetch('https://api.thecatapi.com/v1/images/search')
      .then(res => res.json())
      .then(json => {
        ctx.telegram.sendMessage(chatId, `Это кот, а ${msg.from.first_name} – хороший человек.`);
        ctx.telegram.sendPhoto(chatId, json[0].url);
        console.log(`${getDate()} :: Chat: ${msg.chat.id} :: User: ${msg.from.id} ${msg.from.username} :: использует команду: /cat`)
      })
  }
});

// AWS event handler syntax (https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html)
exports.handler = async event => {
  try {
    await bot.handleUpdate(JSON.parse(event.body))
    return { statusCode: 200, body: "" }
  } catch (e) {
    console.error("error in handler:", e)
    return { statusCode: 400, body: "This endpoint is meant for bot and telegram communication" }
  }
}