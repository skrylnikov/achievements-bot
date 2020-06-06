import {IncomingMessage} from 'telegraf/typings/telegram-types';

type CustomCheckProps = {
  wordList: string[];
  text: string;
  message: IncomingMessage;
  forwardFrom?: string;
}

type CustomCheck = (props: CustomCheckProps) => boolean;

type BaseAchievement = {
 id: string;
 levelList: [number, number, number, number];
};

type StickerAchievement = BaseAchievement & {
  type: 'sticker',
};

type AnimationAchievement = BaseAchievement & {
  type: 'animation',
}

type PhotoAchievement = BaseAchievement & {
  type: 'photo',
}

type VoiceAchievement = BaseAchievement & {
  type: 'voice',
}

type TextAchievement = BaseAchievement & {
  type: 'text',
} & ({
  customCheck: CustomCheck;
} | {
  word: string[];
} | {
  text: string[];
} | {});

type AnyAchievement = BaseAchievement & {
  type: 'any',
} & ({
  customCheck: CustomCheck;
});

export type AllAchievement = StickerAchievement 
  | TextAchievement 
  | AnimationAchievement 
  | PhotoAchievement
  | VoiceAchievement
  | AnyAchievement
  ;