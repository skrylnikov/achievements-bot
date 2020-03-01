import { ContextMessageUpdate } from 'telegraf';

import { db } from '../db';
import { achievementList } from '../config';

export const achievementsController = async (ctx: ContextMessageUpdate) => {
  const chatId = ctx.chat?.id
  const id = ctx.from?.id;
  if (!chatId || !id || !ctx.from) {
    return;
  }

  const user = db.get(chatId)
    .get(id);
  await user
    .set('login', ctx.from.username || ctx.from.first_name || ctx.from.last_name)
    .save();


  const achievementMap: {[x: string]: number} = user.value();

  console.log(achievementMap);
  
  const achievementStr = achievementList.map((achievementConfig) => {
    if(!achievementMap[achievementConfig.id]) {
      return false;
    }
    const value = achievementMap[achievementConfig.id];

    const level = achievementConfig.levelList.reduce((acc, x, i)=> value>=x ? i + 1 : acc, 0);

    if(level === 0){
      return false;
    }

    return `${achievementConfig.id}: ${level}`;    
  }).filter((x) => typeof x === 'string').join('\r\n');

  const result = achievementStr.length=== 0? 'У тебя ещё нет ачивок': ('Вот твои ачивки:\r\n' + achievementStr);


  console.log(result);
  
  ctx.reply(result, {reply_to_message_id: ctx.message?.message_id});
};