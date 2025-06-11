/* eslint-disable @typescript-eslint/no-explicit-any */
export class JsonHelper {
  public static setJsonValueByKey(sourceObj: any, key: string, value: any): void {
    const props = key.split('.');
    let obj = sourceObj;
    let prop;
    while ((prop = props.shift())) {
      if (obj[prop] !== undefined) {
        if (typeof obj[prop] === 'object') {
          obj = obj[prop];
        } else {
          obj[prop] = value;
        }
      }
    }
  }

  public static parseJsonKeysToArray(keys: string[], json: any, parent: string = ''): void {
    Object.entries(json).forEach(([key, val]: [string, any]) => {
      if (val !== null && typeof val === 'object') {
        const newparent = parent ? `${parent}.${key}` : key;
        JsonHelper.parseJsonKeysToArray(keys, val, newparent);
      } else {
        keys.push(parent ? `${parent}.${key}` : key);
      }
    });
  }

  public static parseJsonKeysValueToObject(obj: any, json: any, parent: string = ''): void {
    Object.entries(json).forEach(([key, val]: [string, any]) => {
      if (val !== null && typeof val === 'object') {
        const newparent = parent ? `${parent}.${key}` : key;
        JsonHelper.parseJsonKeysValueToObject(obj, val, newparent);
      } else {
        obj[parent ? `${parent}.${key}` : key] = val;
      }
    });
  }
}
