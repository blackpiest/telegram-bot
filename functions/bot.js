const { Telegraf } = require("telegraf")
const bot = new Telegraf(process.env.T_TOKEN);

function randomInteger(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

const resultArray = [
  'Супермен',
  'Флэш',
  'Джокер',
  'Железный-человек',
  'Человек-паук',
  'Халк',
  'Тор',
  'Чёрная пантера',
  'Чёрная вдова',
  'Человек-муравей',
  'Бэтмен',
  'Росомаха',
  'Циклоп',
  'Вижн',
  'Алая ведьма',
  'Соколиный глаз',
  'Оса',
  'Зелёный фонарь',
  'Чёрный Адам',
  'Шазам',
  'пидор'
]

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
    ctx.telegram.sendMessage(chatId, `${ctx.message.from.first_name}, сегодня котиков не будет. Бот уехал в Балашиху.`);
  }

  if (ctx.message.text.includes('/who')) {
    ctx.telegram.sendMessage(chatId, `${ctx.message.from.first_name}, сегодня ты – ${resultArray[randomInteger(0, resultArray.length - 1)]}`);
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