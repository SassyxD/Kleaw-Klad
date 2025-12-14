FROM oven/bun:1 AS base

WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

EXPOSE 3001

CMD ["bun", "run", "index.ts"]
