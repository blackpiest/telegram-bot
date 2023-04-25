const fs = require('fs');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const { randomInteger } = require('./helpers/randomInteger');
require('dotenv').config();
const token = process.env.T_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const whoIAmVariants = require('./database/whoIAm/variants.json');
const moment = require('moment/moment');

bot.onText(/\/today/, (msg) => {
  const chatId = msg.chat.id;
  const filePath = path.resolve(__dirname, `../src/database/whoIAm/chats/${chatId}.json`);
  const currentDate = moment().startOf('day').valueOf();


  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    };

    const fileParse = JSON.parse(data);
    let resultArray = [];
    // console.log(data);
    if (fileParse.find(item => item.date === currentDate)) {
      resultArray = fileParse.find(item => item.date === currentDate).users.map(item => ({ name: item.user.first_name, username: item.user.username, result: item.result }));
      console.log(resultArray)
    }
    // console.log('resultArray', fileParse.users);

    let result = `📊 Статистика дня: \n\n`;

    if (resultArray.length > 0) {
      resultArray.forEach(item => {
        result = result + `${item.name}(@${item.username}) – ${item.result}\n`;
      });
    } else {
      result = result + `отсутсвует`
    }

    bot.sendMessage(chatId, result);
  })
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const filePath = path.resolve(__dirname, `../src/database/whoIAm/chats/${chatId}.json`);
  const currentDate = moment().startOf('day').valueOf();

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
      if (msg.text.includes('/who')) {
        bot.sendMessage(chatId, 'Сначала необходимо ввести команду /start');

      }
    } else {
      if (msg.text.includes('/start')) {
        bot.sendMessage(chatId, 'Лол, я уже запущен и готов к работе!');
      }

      if (msg.text.includes('/who')) {
        const result = whoIAmVariants[randomInteger(0, whoIAmVariants.length - 1)];
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            console.error(err);
            return;
          }
          const fileParse = JSON.parse(data);
          let isNewRequest = false;

          for (let i = 0; i < fileParse.length; i++) {
            if (fileParse[i].date === currentDate && fileParse[i].users?.find(item => item.user.id === msg.from.id)) {
              const currentUserResult = fileParse[i].users.find(item => item.user.id === msg.from.id).result;
              bot.sendMessage(chatId, `${msg.from.first_name}, напоминаю, сегодня ты – ${currentUserResult}`);
              break;
            }
            if (fileParse[i].date === currentDate && !fileParse[i].users?.find(item => item.user.id === msg.from.id)) {
              if (fileParse[i].users) {
                fileParse[i].users.push({ user: msg.from, result });
              } else {
                fileParse[i].users = [{ user: msg.from, result }];
              }
              bot.sendMessage(chatId, `${msg.from.first_name}, сегодня ты – ${result}`);
              isNewRequest = true;
              break;
            } else {
              fileParse.push({
                date: currentDate,
                users: [{
                  user: msg.from,
                  result: result
                }],
              });
              isNewRequest = true;
            }
          }
          if (isNewRequest) {
            const newFile = JSON.stringify(fileParse);
            fs.writeFileSync(filePath, newFile);
            console.log('Файл перезаписан!')
          }
        });
      }

      // if (msg.text.includes('/today')) {
      //   fs.readFile(filePath, 'utf8', (err, data) => {
      //     if (err) {
      //       console.error(err);
      //       return;
      //     };

      //     const fileParse = JSON.parse(data);

      //     for (let i = 0; i < fileParse.length; i++) {
      //       if (fileParse[i].date === currentDate && fileParse[i].users && fileParse[i].users.length > 0) {
      //         const currentUsers = fileParse[i].users;
      //         // const users = currentUsers.map(u => bot.chat.currentUsers);

      //         const requests = currentUsers.map(u => bot.getChatMember(chatId, u.id));
      //         let resultString = '';
      //         Promise.all(requests)
      //           .then(response => {
      //             console.log(response)

      //             for (let i = 0; i < response.length; i++) {
      //               for (let j = 0; j < currentUsers.length; i++) {
      //                 if (response[i]?.user?.id === currentUsers[j].id) {
      //                   resultString = `${resultString}\n${response[i]?.user?.first_name} – ${currentUsers[j].result}`;
      //                 }

      //               }
      //             }
      //           })
      //       }
      //     }
      //   })
      // }
    }
  });
});
