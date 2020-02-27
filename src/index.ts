import StormDB from "stormdb";
import Telegraf, {ContextMessageUpdate} from 'telegraf';

import { token } from './config';
const engine = new StormDB.localFileEngine("./db.stormdb");
const db = new StormDB(engine);

const bot = new Telegraf(token);

bot.start((ctx) => ctx.reply('Welcome'));

const sendAchievement = (ctx: ContextMessageUpdate, achievement: string, level: number) => {
  ctx.reply(`${ctx.from?.username ? ('@' + ctx.from?.username) : ctx.from?.first_name} получает '${achievement}' ${level}го уровня`,
  {
    reply_to_message_id: ctx.message?.message_id,
  });
};

type CustomCheckProps = {
  wordList: string[];
  text: string;
}

type CustomCheck = (props: CustomCheckProps) => boolean;

type BaseAchievement = {
 id: string;
 levelList: [number, number, number, number];
};

type StickerAchievement = BaseAchievement & {
  type: 'sticker',
};

type TextAchievement = BaseAchievement & {
  type: 'text',
} & ({
  customCheck: CustomCheck;
} | {
  word: string[];
} | {
  text: string[];
} | {});

type AllAchievement = StickerAchievement | TextAchievement;

const achievementList: AllAchievement[] = [
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
  }
];

bot.on('message', async (ctx)=> {
  if(!ctx.from || !ctx.from.id || !ctx.chat || !ctx.chat.id || !ctx.message || ctx.message.forward_from) {
    return;
  }
  const chatId = ctx.chat.id
  const id = ctx.from.id;
  const message = ctx.message;

  const user = db.get(chatId)
    .get(id);
  await user
    .set('login', ctx.from.username || ctx.from.first_name || ctx.from.last_name)
    .save();
  const changedList: string[] = [];
  await Promise.all(achievementList.map((achievementConfig) => {
      const value = user.get(achievementConfig.id).value() || 0;
      let changed = false;
      switch (achievementConfig.type) {
        case 'sticker':{
          if(message.sticker){
            changed = true;
          }
          break;
        }
        case 'text': {
          if(!message.text){
            return;
          } 
          const text = message.text.toLowerCase();

          const wordList = text.split(/\s|\.|,|!|\?|[0-9]/).filter((x)=> x.length!==0);
          if('customCheck' in achievementConfig){
            changed = achievementConfig.customCheck({text, wordList})
          } else
          if('word' in achievementConfig){
            changed = achievementConfig.word.some((x) => wordList.includes(x));
          } else {
            changed = text.length !== 0;
          }

          break;
        }
      
        default:
          break;
      }
      if(changed) {
        changedList.push(achievementConfig.id);
        return user.set(achievementConfig.id, value + 1).save();
      }
    }));

  changedList.forEach((id)=> {
    const achievementConfig = achievementList.find((x)=> x.id === id);
    if(!achievementConfig){
      return;
    }
    const value = user.get(achievementConfig.id).value();
    const level = achievementConfig.levelList.indexOf(value) + 1;
    if(level !== 0 ){
      sendAchievement(ctx, achievementConfig.id, level);
    }
  });
    
});







bot.launch();

