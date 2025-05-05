
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://exfsaxzpwqfxsxinrkbz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4ZnNheHpwd3FmeHN4aW5ya2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0OTA3MTYsImV4cCI6MjA2MTA2NjcxNn0.u_a0KplU2mueKCJXbSsAOc5kjBjWEQmvSpmDPCXNktU';

// Creating a client with storage options
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Helper function to get public URL for images
export const getPublicImageUrl = (path: string) => {
  if (!path) return '';
  
  // If path is already a full URL, return it as is
  if (path.startsWith('http')) return path;
  
  // Extract the bucket name from the path if it's there
  let bucket = 'news';
  let cleanPath = path;
  
  if (path.includes('/products/')) {
    bucket = 'products';
    // Extract just the filename part if it's a product path
    cleanPath = path.split('/products/')[1] || path;
  } else {
    // If path starts with "/", remove it as Supabase doesn't expect leading slash
    cleanPath = path.startsWith('/') ? path.substring(1) : path;
  }
  
  const { data } = supabase.storage.from(bucket).getPublicUrl(cleanPath);
  return data?.publicUrl || '';
};

// Function to create buckets if they don't exist
export const ensureStorageBuckets = async (): Promise<void> => {
  try {
    // First, try to check if buckets exist
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    const createBucket = async (name: string) => {
      const exists = buckets?.some(bucket => bucket.name === name);
      if (!exists) {
        console.log(`Creating bucket: ${name}`);
        const { error: createError } = await supabase.storage.createBucket(name, {
          public: true,
          fileSizeLimit: 10485760, // 10MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
        });

        if (createError) {
          console.error(`Error creating ${name} bucket:`, createError);
          return false;
        }
        
        // Set public bucket policy using SQL
        const { error: policyError } = await supabase.rpc('pgSQL', {
          query: `
            BEGIN;
            -- Enable RLS on storage.objects
            ALTER TABLE IF EXISTS storage.objects ENABLE ROW LEVEL SECURITY;
            
            -- Create policies for the bucket
            DROP POLICY IF EXISTS "Allow public access to ${name}" ON storage.objects;
            CREATE POLICY "Allow public access to ${name}" 
                ON storage.objects FOR SELECT 
                USING (bucket_id = '${name}');
                
            DROP POLICY IF EXISTS "Allow insert access to ${name}" ON storage.objects;
            CREATE POLICY "Allow insert access to ${name}" 
                ON storage.objects FOR INSERT 
                WITH CHECK (bucket_id = '${name}');
                
            DROP POLICY IF EXISTS "Allow update access to ${name}" ON storage.objects;
            CREATE POLICY "Allow update access to ${name}" 
                ON storage.objects FOR UPDATE 
                USING (bucket_id = '${name}');
                
            DROP POLICY IF EXISTS "Allow delete access to ${name}" ON storage.objects;
            CREATE POLICY "Allow delete access to ${name}" 
                ON storage.objects FOR DELETE 
                USING (bucket_id = '${name}');
            COMMIT;
          `
        });
        
        if (policyError) {
          console.error(`Error setting policies for ${name}:`, policyError);
        }
      }
    };
    
    // Create standard buckets
    await createBucket('news');
    await createBucket('products');
    
    return;
  } catch (error) {
    console.error('Error ensuring storage buckets:', error);
  }
};

// Helper function to upload an image
export const uploadImage = async (file: File, fileName?: string): Promise<string | null> => {
  try {
    // Ensure buckets exist
    await ensureStorageBuckets();
    
    // Generate a unique file name if not provided
    const uniqueFileName = fileName || `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    
    // Determine which bucket to use based on the fileName
    let bucket = 'news';
    let cleanFileName = uniqueFileName;
    
    if (uniqueFileName.includes('products/')) {
      bucket = 'products';
      // Extract just the filename part
      cleanFileName = uniqueFileName.split('/products/')[1] || uniqueFileName;
    }
    
    // For better debugging
    console.log(`Uploading ${file.name} to ${bucket} as ${cleanFileName}`);
    
    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(cleanFileName, file, {
        upsert: true,
        contentType: file.type
      });
    
    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }
    
    console.log('Upload successful:', data);
    
    // Get the public URL for the uploaded file
    const publicUrl = getPublicImageUrl(data.path);
    console.log('Public URL:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error in uploadImage:', error);
    return null;
  }
};

// Helper function to delete an image
export const deleteImage = async (path: string): Promise<boolean> => {
  if (!path) return false;
  
  try {
    // Determine which bucket the image is in
    let bucket = 'news';
    let filePath = path;
    
    // Extract the file path from the URL if it's a public URL
    if (path.includes(supabaseUrl)) {
      if (path.includes('/products/')) {
        bucket = 'products';
        // Extract just the filename part
        filePath = path.split('/').pop() || '';
      } else {
        filePath = path.split('/').pop() || '';
      }
    } else if (path.includes('/products/')) {
      bucket = 'products';
      // Extract just the filename part
      filePath = path.split('/products/')[1] || path;
    }
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);
    
    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteImage:', error);
    return false;
  }
};
