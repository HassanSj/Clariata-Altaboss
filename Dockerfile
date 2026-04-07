# Install dependencies only when needed
FROM nikolaik/python-nodejs AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
COPY . ./
ENV NEXT_PUBLIC_DOMAIN=https://clariataweb.azurewebsites.net/
ENV NEXT_PUBLIC_API_URL=https://clariatawebapi.azurewebsites.net

RUN yarn install
RUN yarn build
#RUN addgroup -g 1001 -S nodejs
#RUN adduser -S nextjs -u 1001
#USER nextjs

EXPOSE 3000

CMD ["yarn", "start"]