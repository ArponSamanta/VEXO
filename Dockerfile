FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm turbo

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy package.json of all workspace packages to leverage Docker caching
COPY apps/server/package.json ./apps/server/
COPY apps/admin/package.json ./apps/admin/
COPY apps/client/package.json ./apps/client/
COPY apps/super-admin/package.json ./apps/super-admin/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/validators/package.json ./packages/validators/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the monorepo code
COPY . .

# Set environment variables for production
ENV NODE_ENV="production"
ENV PORT=8080
ENV MONGODB_URI="mongodb+srv://arponsamanta1234_db_user:QQ63B461lmBdDGQt@vexocluster.gorbxxk.mongodb.net/vexo?appName=vexoCluster"
ENV JWT_SECRET="vexo-secure-prod-secret-9941a3d"
ENV JWT_REFRESH_SECRET="vexo-refresh-prod-secret-b841f"

# Build the server package (and its dependencies)
RUN npx turbo run build --filter=@vexo/server

# Expose port
EXPOSE 8080

# Start the server
CMD ["pnpm", "--filter", "@vexo/server", "start"]
