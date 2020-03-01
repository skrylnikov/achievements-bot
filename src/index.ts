
import Telegraf from 'telegraf';

import { token } from './config';
import { processMessageController, startController, achievementsController } from './controllers';

const bot = new Telegraf(token);

bot.start(startController);
bot.command('achievements', achievementsController);


bot.on('message', processMessageController);





bot.launch();

