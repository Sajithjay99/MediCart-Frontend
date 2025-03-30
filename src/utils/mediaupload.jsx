import { createClient } from "@supabase/supabase-js"

//annon public
const annon_key= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjdGN4d2FuaXRqY3pka2djd3RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwODYzOTcsImV4cCI6MjA1ODY2MjM5N30.Y_TaKBJ1DvC2Sx6aN4rNCsB_VjelopC5yRtlRNwBnXY"


//project url
const supabase_url = "https://qctcxwanitjczdkgcwti.supabase.co"


const supabase = createClient(supabase_url, annon_key)

export default function mediaUpload(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        return resolve({ error: true, message: "No file selected" });
      }
  
      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name}`;
  
      supabase.storage.from("products").upload(filename, file, {
        cacheControl: "3600",
        upsert: false,
      })
      .then((response) => {
        if (response.error) {
          return resolve({ error: true, message: response.error.message });
        }
  
        const url = supabase.storage.from("products").getPublicUrl(filename).data.publicUrl;
        resolve({ error: false, url });
      })
      .catch((error) => {
        resolve({ error: true, message: "Error uploading file: " + error.message });
      });
    });
  }