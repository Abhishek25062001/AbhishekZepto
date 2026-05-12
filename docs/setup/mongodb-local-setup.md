# MongoDB Local Setup

## Purpose

This document records the local MongoDB setup expected by Database Foundation.

## Local MongoDB

Start MongoDB locally using your installed MongoDB service, then use this backend
connection string:

```text
mongodb://localhost:27017/zepto_like_dev
```

The backend reads this value from:

```text
DB_MONGO_URI=mongodb://localhost:27017/zepto_like_dev
```

## MongoDB Compass

Use this connection string in MongoDB Compass:

```text
mongodb://localhost:27017/zepto_like_dev
```

## Docker MongoDB

When MongoDB runs through Docker on the default mapped port, host-machine tools
such as MongoDB Compass can use:

```text
mongodb://localhost:27017/zepto_like_dev
```

When the backend runs inside Docker on the same Compose network as the MongoDB
container, use:

```text
mongodb://mongodb:27017/zepto_like_dev
```

The current local Compose service stores MongoDB data in the `mongodb_data`
volume. Remove it only when you intentionally want to delete local Docker
database data:

```bash
docker compose down -v
```

Real production MongoDB credentials must not be committed to the repository.
