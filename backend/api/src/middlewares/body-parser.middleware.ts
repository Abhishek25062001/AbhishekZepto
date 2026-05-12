import express from 'express';

export const bodyParserMiddleware = [
  express.json({ limit: '1mb' }),
  express.urlencoded({ extended: true, limit: '1mb' }),
];
