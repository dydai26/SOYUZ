import dotenv from 'dotenv';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';

// Initialize environment variables
dotenv.config();

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PostgreSQL connection string
const connectionString = 'postgresql://postgres.exfsaxzpwqfxsxinrkbz:DYDIUIHOR13021987@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';

// Supabase credentials for storage operations
const supabaseUrl = 'https://exfsaxzpwqfxsxinrkbz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4ZnNheHpwd3FmeHN4aW5ya2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0OTA3MTYsImV4cCI6MjA2MTA2NjcxNn0.u_a0KplU2mueKCJXbSsAOc5kjBjWEQmvSpmDPCXNktU';

// Initialize Supabase client for storage operations
const supabase = createClient(supabaseUrl, supabaseKey);

// Create a connection pool
const { Pool } = pg;
const pool = new Pool({ 
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

// Function to create tables and set up the database
async function setupDatabase() {
  console.log('Setting up PostgreSQL database...');
  
  try {
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'create_news_table.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = sqlContent
      .split(';')
      .filter(statement => statement.trim() !== '')
      .map(statement => statement.trim() + ';');
    
    // Get a client from the pool
    const client = await pool.connect();
    
    try {
      // Start a transaction
      await client.query('BEGIN');
      
      // Execute each statement
      for (const statement of statements) {
        console.log(`Executing SQL statement: ${statement.substring(0, 50)}...`);
        await client.query(statement);
      }
      
      // Commit the transaction
      await client.query('COMMIT');
      console.log('Database setup complete!');
      
      // Verify the table was created
      const result = await client.query('SELECT COUNT(*) FROM news');
      console.log('News table created successfully. Row count:', result.rows[0].count);
      
    } catch (err) {
      // Rollback in case of error
      await client.query('ROLLBACK');
      throw err;
    } finally {
      // Release the client back to the pool
      client.release();
    }
    
    // Create storage bucket for news images if it doesn't exist
    await setupStorage();
    
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    // End the pool
    await pool.end();
  }
}

// Function to set up storage bucket for news images
async function setupStorage() {
  try {
    console.log('Setting up storage for news images...');
    
    // Create a bucket for news images
    const { data, error } = await supabase.storage.createBucket('news', {
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
    });
    
    if (error) {
      // If the bucket already exists, this is fine
      if (error.code === '23505') {
        console.log('News storage bucket already exists');
      } else {
        console.error('Error creating storage bucket:', error);
      }
    } else {
      console.log('Storage bucket created successfully:', data);
    }
    
  } catch (error) {
    console.error('Error setting up storage:', error);
  }
}

// Run the setup
setupDatabase()
  .then(() => {
    console.log('Setup completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Setup failed:', error);
    process.exit(1);
  }); 