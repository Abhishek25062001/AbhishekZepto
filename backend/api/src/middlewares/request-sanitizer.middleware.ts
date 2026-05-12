import type { RequestHandler } from 'express';

const dangerousKeys = new Set(['__proto__', 'constructor', 'prototype']);

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

const sanitizeValue = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (!isPlainObject(value)) {
    return value;
  }

  return Object.entries(value).reduce<Record<string, unknown>>(
    (sanitized, [key, nestedValue]) => {
      if (dangerousKeys.has(key)) {
        return sanitized;
      }

      sanitized[key] = sanitizeValue(nestedValue);
      return sanitized;
    },
    {},
  );
};

export const sanitizeRequestMiddleware: RequestHandler = (req, _res, next) => {
  req.body = sanitizeValue(req.body);
  req.query = sanitizeValue(req.query) as typeof req.query;
  req.params = sanitizeValue(req.params) as typeof req.params;

  next();
};
