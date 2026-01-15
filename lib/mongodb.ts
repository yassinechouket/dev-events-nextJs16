import mongoose, { Connection } from 'mongoose';

/**
 * Global interface to extend NodeJS global type with mongoose connection cache
 * This ensures type safety when accessing the cached connection
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  } | undefined;
}

/**
 * MongoDB connection URI
 * Should be set in environment variables for production
 * Falls back to a local MongoDB instance if not set
 */
const MONGODB_URI: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/dev-event';

/**
 * Cached connection object to prevent multiple connections in development
 * In Next.js, during development with hot-reload, modules can be re-imported
 * which would create multiple database connections. This cache prevents that.
 */
let cached: {
  conn: Connection | null;
  promise: Promise<Connection> | null;
} = global.mongoose || { conn: null, promise: null };

// In development, store the cache on the global object to persist across hot reloads
if (process.env.NODE_ENV !== 'production') {
  global.mongoose = cached;
}

/**
 * Connects to MongoDB using Mongoose with connection caching
 * 
 * This function implements a connection caching pattern that:
 * - Returns the existing connection if already connected
 * - Reuses the existing connection promise if a connection is in progress
 * - Creates a new connection only if none exists
 * 
 * @returns {Promise<Connection>} A promise that resolves to the Mongoose connection
 * @throws {Error} If MONGODB_URI is not defined in production
 */
async function connectDB(): Promise<Connection> {
  // Validate MongoDB URI in production
  if (!process.env.MONGODB_URI && process.env.NODE_ENV === 'production') {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local or .env.production'
    );
  }

  // Return existing connection if already connected
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection promise exists, create a new one
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false, // Disable mongoose buffering; fail fast if not connected
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
    };

    // Create connection promise
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        return mongooseInstance.connection;
      })
      .catch((error) => {
        // Reset promise on error to allow retry
        cached.promise = null;
        throw error;
      });
  }

  try {
    // Wait for the connection to be established
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset promise on error
    cached.promise = null;
    throw error;
  }

  // Return the established connection
  return cached.conn;
}

export default connectDB;
