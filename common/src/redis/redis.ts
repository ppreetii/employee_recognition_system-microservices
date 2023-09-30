import { createClient } from "redis";

import { config } from "../configs/config";

class Redis {
  private _client?: any;
  protected redisURL: string = `redis://${config.redisHost}:${config.redisPort}`;
  get client() {
    if (!this._client) {
      throw new Error("Cannot Access Redis before connecting");
    }
    return this._client;
  }

  async connect() {
    try {
      this._client = createClient({ url: this.redisURL });
      await this._client.connect();
      
    } catch (error) {
      console.log(error);
      throw new Error("Failed to connect to Redis");
    }
  }

  async disconnect() {
    try {
      await this._client.quit();
    } catch (error) {
      console.log(error);
      throw new Error("Failed to Disconnect Redis");
    }
  }

  async clearCache() {
    try {
      await this._client.sendCommand(["FLUSHALL"], (err: Error) => {
        if (err) {
          throw err;
        }
      });
    } catch (error) {
      console.log(error);
      throw new Error("Failed to Clear Cache");
    }
  }

  //redis operation
  async exists(key: any) {
    try {
      const reply = await this._client.exists(key);
      return !!reply;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to Clear Cache");
    }
  }

  async set(key: any, value: string | Object, ttl: number) {
    try {
      await this._client.set(
        key,
        typeof value === "string" ? value : JSON.stringify(value)
      );
    } catch (error) {
      console.log(error);
      throw new Error("Failed to Set Value in Cache");
    }
  }

  async get(key: any) {
    try {
      const record = await this._client.get(key);
      return record;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to Get Value from Cache");
    }
  }

  async setMultiple(keyProp: string, arr: Object[], ttl: number): Promise<void> {
    try {

      arr.forEach(async (item: any) => {
        const key = item[`${keyProp}`] as unknown as string;
        await this._client.set(key, JSON.stringify(item), ttl);
      });

    } catch (error) {
      console.log(error);
      throw new Error("Failed to set multiple values in Cache")
    }
  }

  async getMultiple(keys: any[]) {
    try {
      const length = keys.length;
      const result = [];
      for (let i = 0; i < length; ++i) {
        result[i] = await this._client.get(keys[i]);
      }

      return result;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get multiple values from Cache");
    }
  }

  async delete(key: any) {
    try {
      await this._client.del(key);
    } catch (error) {
      console.log(error);
      throw new Error("Failed to delete key from Cache");
    }
  }

  async deleteMultiple(key: any[]) {
    try {
      const len = key.length;
      const promises = [];
      for (let i = 0; i < len; ++i) {
        promises.push(
          new Promise((resolve, reject) => {
            this._client.del(key[i], (err: Error, reply: any) => {
              if (err) {
                reject(err);
              } else {
                resolve(reply);
              }
            });
          })
        );
      }

      Promise.allSettled(promises);
    } catch (error) {
      console.log(error);
      throw new Error("Failed to delete key from Cache");
    }
  }
}

export const redis = new Redis();
