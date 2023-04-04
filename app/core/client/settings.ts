import LZString from "lz-string";

import { RoomMode } from "~/core/server/room";

export type IKey = string;

export interface IKeys {
  move: IKey[],
  selectHome: IKey,
  selectTopLeft: IKey,
  splitArmy: IKey,
  clearMovements: IKey
}

export interface ISettings {
  game: {
    keys: {
      [RoomMode.Hexagon]: IKeys
    }
  };
}

function merge(from: any, to: any) {
  let target: any = {};

  for (const prop in from) {
    if (from.hasOwnProperty(prop)) {
      if (!to.hasOwnProperty(prop)) {
        target[prop] = from[prop];
      } else if (Object.prototype.toString.call(from[prop]) === "[object Object]") {
        target[prop] = merge(from[prop], to[prop]);
      } else {
        target[prop] = to[prop];
      }
    }
  }

  return target;
}

export class Settings {
  private readonly settings: Partial<ISettings>;
  private defaultSettings: ISettings = {
    game: {
      keys: {
        [RoomMode.Hexagon]: {
          move: ["W", "E", "D", "S", "A", "Q"],
          clearMovements: "F",
          splitArmy: "R",
          selectHome: "G",
          selectTopLeft: "Space"
        }
      }
    }
  };

  constructor(settings: Partial<ISettings>) {
    this.settings = settings;
  }

  merge() {
    return merge(this.defaultSettings, this.settings) as ISettings;
  }
}

export const SETTINGS_KEY = "settings";

export function getSettings() {
  const s = localStorage.getItem(SETTINGS_KEY) as string;

  try {
    return new Settings(JSON.parse(LZString.decompressFromUTF16(s))).merge();
  } catch (_) {
    return new Settings({}).merge();
  }
}

export function saveSettings(settings: ISettings) {
  localStorage.setItem(SETTINGS_KEY, LZString.compressToUTF16(JSON.stringify(settings)));
}