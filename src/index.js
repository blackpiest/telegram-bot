const fs = require('fs');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const { randomInteger } = require('./helpers/randomInteger');
require('dotenv').config();
const token = process.env.T_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const whoIAmVariants = require('./database/whoIAm/variants.json');
const { start } = require('./functions/start');
const moment = require('moment/moment');

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const filePath = path.resolve(__dirname, `../src/database/whoIAm/chats/${chatId}.json`);
  const currentDate = moment().startOf('day').utc(true).unix();

  const whoIAmTemplate = [
    {
      date: currentDate,
      users: [],
    }
  ];

  fs.access(filePath, function (error) {
    if (error) {
      if (msg.text.includes('/start')) {
        const jsonString = JSON.stringify(whoIAmTemplate);
        fs.writeFileSync(filePath, jsonString, { flag: 'w', encoding: 'utf8' });
        bot.sendMessage(chatId, 'Привет! Я готов работать');
      }
    } else {
      if (msg.text.includes('/who')) {
        const result = whoIAmVariants[randomInteger(0, whoIAmVariants.length - 1)];
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            console.error(err);
            return;
          }
          const fileParse = JSON.parse(data);

          for (let i = 0; i < fileParse.length; i++) {
            if (fileParse[i].date === currentDate && fileParse[i].users?.find(user => user.id === msg.from.id)) {
              const currentUserResult = fileParse[i].users.find(user => user.id === msg.from.id).result;
              bot.sendMessage(chatId, `${msg.from.first_name}, напоминаю, сегодня ты – ${currentUserResult}!`);
              break;
            }
            if (fileParse[i].date === currentDate && !fileParse[i].users?.find(user => user.id === msg.from.id)) {
              if (fileParse[i].users) {
                fileParse[i].users.push({ id: msg.from.id, result });
              } else {
                fileParse[i].users = [{ id: msg.from.id, result }];
              }
              bot.sendMessage(chatId, `${msg.from.first_name}, сегодня ты – ${result}`);
              break;
            } else {
              fileParse.push({
                date: currentDate,
                users: [{
                  id: msg.from.id,
                  result: result
                }],
              });
            }
          }

          const newFile = JSON.stringify(fileParse);
          fs.writeFile(filePath, newFile, error => console.log("Done"));
        });
      }

      if (msg.text.includes('/botday')) {
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            console.error(err);
            return;
          };

          const fileParse = JSON.parse(data);

          for (let i = 0; i < fileParse.length; i++) {
            if (fileParse[i].date === currentDate && fileParse[i].users && fileParse[i].users.length > 0) {
              const currentUsers = fileParse[i].users;
              // const users = currentUsers.map(u => bot.chat.currentUsers);

              const requests = currentUsers.map(u => bot.getChatMember(chatId, u.id));
              let resultString = '';
              Promise.all(requests)
                .then(response => {
                  console.log('hello')

                  for (let i = 0; i < response.length; i++) {
                    for (let j = 0; j < currentUsers.length; i++) {
                      if (response[i]?.user?.id === currentUsers[j].id) {
                        resultString = `${resultString}\n${response[i]?.user?.first_name} – ${currentUsers[j].result}`;
                      }

                    }
                  }
                })
            }
          }
        })
      }
    }
  });
});
