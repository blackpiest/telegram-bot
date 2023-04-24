const TelegramBot = require('node-telegram-bot-api');

const token = process.env.T_TOKEN;
const bot = new TelegramBot(token, { polling: true });

function randomInteger(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

const resultArray = [
  'Бот',
  'Не бот'
];



// AWS event handler syntax (https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html)
exports.handler = async event => {
  try {
    bot.on('message', (msg) => {
      const chatId = msg.chat.id;

      if (msg.text.includes('/start')) {
        bot.sendMessage(chatId, 'Привет! Я готов работать');
      }

      if (msg.text.includes('/cat')) {
        bot.sendMessage(chatId, `${msg.from.first_name}, сегодня котиков не будет. Бот расширяет базу.`);
      }
      if (msg.text.includes('/who')) {
        bot.sendMessage(chatId, `${msg.from.first_name}, сегодня ты – ${resultArray[randomInteger(0, resultArray.length - 1)]}`);
      }
      // send a message to the chat acknowledging receipt of their message
      bot.sendMessage(chatId, 'Received your message');
    });
    return { statusCode: 200, body: "" }
  } catch (e) {
    console.error("error in handler:", e)
    return { statusCode: 400, body: "This endpoint is meant for bot and telegram communication" }
  }
}