import {ContextMessageUpdate} from 'telegraf';

export const startController = (ctx: ContextMessageUpdate) => ctx.reply('Я жив')
