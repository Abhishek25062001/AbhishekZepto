FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/api/package.json backend/api/package.json
COPY apps/customer-app/package.json apps/customer-app/package.json
COPY apps/delivery-agent-app/package.json apps/delivery-agent-app/package.json
COPY apps/vendor-panel/package.json apps/vendor-panel/package.json
COPY apps/admin-dashboard/package.json apps/admin-dashboard/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN npm ci

COPY tsconfig.base.json ./
COPY backend/api backend/api
COPY packages/shared packages/shared

EXPOSE 5000

CMD ["npm", "run", "dev", "-w", "backend/api"]
