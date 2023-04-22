// const axios = require("axios").default;
// const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

function randomInteger(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

function getDate() {
  return `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} ${new Date().getDate()}.${new Date().getMonth()}.${new Date().getFullYear()}`
}

const token = process.env.T_TOKEN;
const bot = new TelegramBot(token, { polling: true });


// let resultContent = fs.readFileSync('./../result.txt', 'utf8');
// let textContent = fs.readFileSync('./../text.txt', 'utf8');
// const resultArray = resultContent.split('\n');
// const textArray = textContent.split('\n');

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
];
const textArray = [
  'петух',
  'чёрт',
  'стас',
  'говно',
  'олень',
  'лох',
  'неудачник',
  'козёл',
  'мудак',
  'нехороший человек',
  'придурок',
  'душа компании',
  'душнила',
  'сучка',
];

exports.handler = async (event) => {
  console.log("Received an update from Telegram!", event.body);

  // await axios.post(`https://api.telegram.org/bot${process.env.T_TOKEN}/sendMessage`, {
  //   chat_id: JSON.parse(event.body).message.chat.id,
  //   text: "I got your message!",
  // });

  bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (msg.text.includes('/who')) {
      const result = `${msg.from.first_name}, сегодня ты – ${resultArray[randomInteger(0, resultArray.length - 1)]}`
      bot.sendMessage(chatId, result);
      console.log(`${getDate()} :: Chat: ${msg.chat.id} :: User: ${msg.from.id} ${msg.from.username} :: использует команду: /who`)
    }

    if (msg.text.includes('/cat')) {
      fetch('https://api.thecatapi.com/v1/images/search')
        .then(res => res.json())
        .then(json => {
          bot.sendMessage(chatId, `Это кот, а ${msg.from.first_name} – ${textArray[randomInteger(0, textArray.length - 1)]}`);
          bot.sendPhoto(chatId, json[0].url);
          console.log(`${getDate()} :: Chat: ${msg.chat.id} :: User: ${msg.from.id} ${msg.from.username} :: использует команду: /cat`)

        })
    }
  });

  // return { statusCode: 200 };
};