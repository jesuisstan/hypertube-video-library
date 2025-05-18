// TO RUN USE: node scripts/create-tables-activity.js
// This script creates the necessary tables for the Activity module of the Hypertube and Matcha project.

// Load environment variables from .env.local
require('dotenv').config({ path: './.env.local' });

// Import the PostgreSQL client from Vercel
const { db } = require('@vercel/postgres');

async function createActivityTables() {
  // Connect to the database
  const client = await db.connect();

  try {
    // Begin a transaction
    await client.query('BEGIN');

    // Create the 'visits' table (MATCHA PROJECT)
    await client.query(`
      CREATE TABLE IF NOT EXISTS visits (
        id SERIAL PRIMARY KEY,
        visitor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        visited_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        visit_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE (visitor_id, visited_user_id)
      );
    `);

    // Create the 'likes' table (MATCHA PROJECT)
    await client.query(`
      CREATE TABLE IF NOT EXISTS likes (
        id SERIAL PRIMARY KEY,
        liker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        liked_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE (liker_id, liked_user_id)
      );
    `);

    // Create the 'matches' table (MATCHA PROJECT)
    await client.query(`
      CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        user_one_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        user_two_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE (user_one_id, user_two_id)
      );
    `);

    // Create the 'blocked_users' table (MATCHA PROJECT)
    await client.query(`
      CREATE TABLE IF NOT EXISTS blocked_users (
        id SERIAL PRIMARY KEY,
        blocker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        blocked_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        blocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE (blocker_id, blocked_user_id)
      );
    `);

    // Create the 'notifications' table (MATCHA PROJECT)
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL CHECK (type IN ('visit', 'like', 'unlike', 'match', 'unmatch', 'block', 'unblock')),
        from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        notification_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        viewed BOOLEAN DEFAULT false,
        liker_rating INTEGER CHECK (liker_rating >= 0 AND liker_rating <= 100),
        liked_user_rating INTEGER CHECK (liked_user_rating >= 0 AND liked_user_rating <= 100)
      );
    `);

    // Create the 'chat' table (MATCHA PROJECT)
    await client.query(`
      CREATE TABLE IF NOT EXISTS chat (
        id SERIAL PRIMARY KEY,
        match_id INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
        sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        seen BOOLEAN DEFAULT false
      );
    `);

    // Create the 'movies_bookmarks' table (HYPERTUBE PROJECT)
    await client.query(`
      CREATE TABLE IF NOT EXISTS movies_bookmarks (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        movie_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        poster_path TEXT NOT NULL,
        release_date TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create the 'movies_watchlist' table (HYPERTUBE PROJECT)
    await client.query(`
      CREATE TABLE IF NOT EXISTS movies_watchlist (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        movie_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        poster_path TEXT NOT NULL,
        release_date TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Commit the transaction
    await client.query('COMMIT');

    console.log(
      'Tables "notifications", "blocked_users", "matches", "likes", "visits", "chat", "movies_bookmarks", "movies_watchlist" created successfully'
    );
  } catch (error) {
    // Rollback the transaction in case of an error
    await client.query('ROLLBACK');
    console.error('Failed to create Activity tables', error);
  } finally {
    // Release the client and exit
    await client.release();
    process.exit(); // Ensure the script exits properly
  }
}

// Execute the function and handle any errors
createActivityTables().catch((error) => {
  console.error('Error in createActivityTables:', error);
  process.exit(1); // Ensure the script exits with an error code
});
