import {ContextMessageUpdate} from 'telegraf';

import { achievementList } from '../config';
import { db } from '../db';

const sendAchievement = (ctx: ContextMessageUpdate, achievement: string, level: number) => {
  ctx.reply(`${ctx.from?.username ? ('@' + ctx.from?.username) : ctx.from?.first_name} получает '${achievement}' ${level}го уровня`,
  {
    reply_to_message_id: ctx.message?.message_id,
  });
};

export const processMessageController = async (ctx: ContextMessageUpdate)=> {
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
        case 'animation': {
          if(message.animation){
            changed = true;
          }
          break;
        }
        case 'photo': {
          if(message.photo){
            changed = true;
          }
          break;
        }
        case 'voice': {
          if(message.voice){
            changed = true;
          }
          break;
        }
        case 'text': {
          if(!message.text){
            break;
          } 
          const text = message.text.toLowerCase();
          const forwardFrom = message.forward_from_chat?.username;
          
          const wordList = text.split(/\s|\.|,|!|\?|[0-9]/).filter((x)=> x.length!==0);
          if('customCheck' in achievementConfig){
            changed = achievementConfig.customCheck({text, wordList, message, forwardFrom})
          } else
          if('word' in achievementConfig){
            changed = achievementConfig.word.some((x) => wordList.includes(x));
          } else
          if('text' in achievementConfig){
            changed = achievementConfig.text.some((x) => text === x);
          } else {
            changed = text.length !== 0;
          }

          break;
        }
      
        default:{
          const text = '';
          const forwardFrom = message.forward_from_chat?.username;
          const wordList = text.split(/\s|\.|,|!|\?|[0-9]/).filter((x)=> x.length!==0);
          
          if('customCheck' in achievementConfig){
            changed = achievementConfig.customCheck({text, wordList, message, forwardFrom})
          }
          break;
        }
      }
      if(changed) {
        changedList.push(achievementConfig.id);
        return user.set(achievementConfig.id, value + 1).save();
      }
    }));
  console.log(`${chatId}: ${ctx.from.username || ctx.from.first_name || ctx.from.last_name} ${ctx.updateSubTypes.join(',')}`);
    
  changedList.forEach((id)=> {
    const achievementConfig = achievementList.find((x)=> x.id === id);
    if(!achievementConfig){
      return;
    }
    const value = user.get(achievementConfig.id).value();
    const level = achievementConfig.levelList.indexOf(value) + 1;
    if(level !== 0 ){
      sendAchievement(ctx, achievementConfig.id, level);
      console.log(`send ${achievementConfig.id} ${value} ${level}`);
    }
  });
    
}