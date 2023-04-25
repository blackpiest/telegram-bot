const fs = require('fs');
const path = require('path');

module.exports.start = (chatId, sendMessage) => {
  const filePath = path.resolve(__dirname, `../database/whoIAm/chats/${chatId}.json`);

  const whoIAmTemplate = [
    {
      date: new Date().getDate(),
      result: [],
    }
  ];

  const jsonString = JSON.stringify(whoIAmTemplate);

  fs.access(filePath, function (error) {
    if (error) {
      fs.writeFileSync(filePath, jsonString, { flag: 'w', encoding: 'utf8' });
      sendMessage(chatId, 'Привет! Я готов работать');
    } else {
      console.log(`Чат ${chatId} уже существует.`);
    }
  });
}