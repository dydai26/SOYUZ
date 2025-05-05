
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; 
import App from './App.tsx'
import './index.css'
import { ProductService } from './services/productService.ts';

// Initialize Supabase buckets and permissions
ProductService.initialize()
  .then((success) => {
    console.log("Product service initialization:", success ? "successful" : "failed");
  })
  .catch((error) => {
    console.error("Error initializing product service:", error);
  });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 2, // Retry failed queries up to 2 times
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff for retries
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <Router>
      <App />
    </Router>
  </QueryClientProvider>
);
