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
# Secrets are supplied at runtime by the host (Render dashboard, docker run -e,
# or an env file). Never bake them into the image.
# Required at runtime: MONGODB_URI, JWT_SECRET, JWT_REFRESH_SECRET,
# RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET,
# CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET,
# CLIENT_URL, ADMIN_URL

# Build the server package (and its dependencies)
RUN npx turbo run build --filter=@vexo/server

# Expose port
# The host supplies PORT at runtime (Render injects it); the server reads process.env.PORT.
EXPOSE 8080

# Start the server
CMD ["pnpm", "--filter", "@vexo/server", "start"]
