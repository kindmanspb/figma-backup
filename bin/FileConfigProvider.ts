import { promises as fs } from "fs";
import type { IBotOptions, IFileConfigProvider } from "./Bot";
import { CONFIG_PATH } from "./constants";

export default class FileConfigProvider implements IFileConfigProvider {
  private _path: string;

  constructor(path = CONFIG_PATH) {
    this._path = path;
  }

  async getConfig(): Promise<IBotOptions | null> {
    try {
      const configBuffer = await fs.readFile(this._path);
      return JSON.parse(configBuffer.toString()) as IBotOptions;
    } catch {
      return null;
    }
  }

  async setConfig(fileConfig: IBotOptions): Promise<void> {
    await fs.writeFile(this._path, JSON.stringify(fileConfig));
  }
}
