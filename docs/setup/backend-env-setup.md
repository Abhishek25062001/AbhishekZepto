# Backend Environment Setup

## Purpose

This document describes backend environment variables for the Phase 1 Backend
Core Foundation and Database Foundation.

## Environment Files

Example files:

- `backend/api/.env.example`
- `backend/api/.env.development.example`
- `backend/api/.env.staging.example`
- `backend/api/.env.production.example`

Real `.env` files must remain local and must not be committed.

## Required Variables

| Variable | Required | Description |
| --- | --- | --- |
| `APP_ENV` | Yes | Runtime environment. Allowed values: `development`, `staging`, `production`, `test`. |
| `APP_PORT` | Yes | Backend HTTP port. Default project value is `5000`. |
| `APP_VERSION` | Yes | Backend application version returned by version APIs. |
| `DB_MONGO_URI` | Yes | MongoDB connection string required for backend startup after Database Foundation. |

## Optional Foundation Variables

| Variable | Required | Description |
| --- | --- | --- |
| `REDIS_URL` | No | Redis connection string. Real Redis usage is implemented later. |
| `JWT_ACCESS_SECRET` | No | Access token secret placeholder for Authentication Foundation. |
| `JWT_REFRESH_SECRET` | No | Refresh token secret placeholder for Authentication Foundation. |

## Validation Rule

The backend validates environment variables during startup. Missing or invalid
required values should fail startup early.

## Secret Rule

Staging and production examples must contain placeholders only. Real secrets
must be managed outside the repository.
