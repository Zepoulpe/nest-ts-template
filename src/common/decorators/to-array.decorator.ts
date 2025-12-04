import { Transform } from 'class-transformer';

export const ToArray = <T = any>(type: any = (v: any) => v as T) =>
  Transform(({ value }) => {
    if (value == null) return undefined;

    const convert = (val: any) => {
      if (typeof type === 'function') {
        if (type === String) return String(val);
        if (type === Number) return Number(val);
        if (type === Boolean) return val === 'true' || val === true;
      }

      if (typeof type === 'object' && val in type) {
        return type[val];
      }

      return val;
    };

    if (Array.isArray(value)) return value.map(convert);

    if (typeof value === 'object') return Object.values(value).map(convert);

    return [convert(value)];
  });
