# This template uses Automatically Copying Traced Files feature
# so you need to setup your Next Config file to use `output: 'standalone'`
# Please read this for more information https://nextjs.org/docs/pages/api-reference/next-config-js/output

# Production image, copy all the files and run next
FROM docker.io/node:lts AS runner
#RUN apk add --no-cache dumb-init
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /usr/src/app
COPY apps/pp-mini-app/next.config.js ./
COPY apps/pp-mini-app/.next/standalone/apps/pp-mini-app ./
COPY apps/pp-mini-app/.next/standalone/package.json ./
COPY apps/pp-mini-app/.next/standalone/libs ./
COPY apps/pp-mini-app/.next/standalone/node_modules ./node_modules
COPY apps/pp-mini-app/public ./public
COPY apps/pp-mini-app/.next/static ./.next/static


# RUN npm i sharp
RUN chown -R node:node .
USER node
EXPOSE 3000
# COPY --chown=node:node ./tools/scripts/entrypoints/api.sh /usr/local/bin/docker-entrypoint.sh
# ENTRYPOINT [ "docker-entrypoint.sh" ]
# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED=1
CMD ["node", "server.js"]
#CMD ["dumb-init", "node", "server.js"]
