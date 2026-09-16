FROM --platform=linux/amd64 public.ecr.aws/docker/library/node:26-alpine

ARG POSTGRES_URL=""
ENV POSTGRES_URL=$POSTGRES_URL

WORKDIR /street-food

RUN npm install -g corepack@latest && \
    corepack enable && \
    corepack prepare pnpm@11.18.0 --activate
ENV PNPM_HOME="/usr/local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

COPY next.config.ts .
COPY package.json .
COPY pnpm-lock.yaml .
COPY src ./src
COPY package-lock.json .
COPY public ./public
COPY pnpm-workspace.yaml .
COPY tsconfig.json .
COPY postcss.config.mjs .
COPY eslint.config.mjs .

RUN pnpm install
RUN pnpm run test
RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start"]