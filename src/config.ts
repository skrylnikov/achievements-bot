import {config} from 'dotenv';

import { AllAchievement } from './types';

config();

const showError = (msg: string) => {
  throw new Error(msg)
};


export const token = process.env.TOKEN || showError('token not found in .env');

export const achievementList: AllAchievement[] = [
  {
    id: 'Стикер-спаммер',
    type: 'sticker',
    levelList: [10, 50, 200, 1000],
  },
  {
    id: 'Флудер',
    type: 'text',
    levelList: [100, 1000, 10000, 100000],
  },
  {
    id: 'Паникёр',
    type: 'text',
    levelList: [1, 10, 100, 1000],
    customCheck: ({wordList}) => wordList.some((x)=> x.length > 3 && x.match(/а/g)?.length ===x.length),
  },
  {
    id: 'Девственник',
    type: 'text',
    levelList: [1, 5, 20, 100],
    word: ['тнн'],
  },
  {
    id: 'Лiлка',
    type: 'text',
    levelList: [2, 15, 50, 500],
    word: ['лол', 'охлол', 'lol', 'лал']
  },
  {
    id: "Люитель движущихся картинок",
    type: 'animation',
    levelList: [1, 20, 100, 1000],
  },
  {
    id: 'Быстрая рука',
    type: 'text',
    levelList: [1, 10, 100, 1000],
    customCheck: ({message}) => 
      message.reply_to_message ? (message.date - message.reply_to_message.date <=5) : false,
  },
  {
    id: 'Я у мамы аметист',
    type: 'text',
    levelList: [5, 20, 100, 1000],
    word: ['бог', 'бога', ' богу', 'богом'],
  },
  {
    id: 'Фоторепортер',
    type: 'photo',
    levelList: [5, 50, 500, 2000],
  },
  {
    id: 'Нигилист',
    type: 'text',
    levelList: [5, 20, 100, 1000],
    text: ['нет', 'no'],
  },
  {
    id: 'Зомби',
    type: 'text',
    levelList: [1, 3, 10, 100],
    customCheck: ({message}) => 
      message.reply_to_message ? (message.date - message.reply_to_message.date >= 60*60*24) : false,
  },
  {
    id: 'Калькулятор',
    type: 'text',
    levelList: [3, 15, 50, 500],
    text: [
      '+', '++', '+++', '++++', '+++++', 
      '-', '--', '---', '----', '-----',
      '=', '==', '===', '====', '=====',
      '*', '**', '***', '****', '*****',
      '/', '//', '///', '////', '/////', 
    ],
  },
  {
    id: 'Птица говорун',
    type: 'voice',
    levelList: [5, 20, 100, 1000],
  },
  {
    id: 'Двачер',
    type: 'any',
    levelList: [1, 3, 10, 100],
    customCheck: ({forwardFrom}) => 
      forwardFrom  === 'ru4chan' || forwardFrom === 'dvachannel',
  },
  {
    id: 'Фронтендер',
    type: 'text',
    levelList: [1, 3, 10, 100],
    text: ['js', 'ts', 'css', 'html'],
  },
  {
    id: 'Криптоанархист',
    type: 'text',
    levelList: [1, 3, 10, 100],
    text: ['биткоин', 'блокчейн', 'блокчеин', 'bitcoin', 'blockhain'],
  },
];