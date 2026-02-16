import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background dark">
      <div className="text-center animate-in">
        <h1 className="mb-4 text-6xl font-bold text-foreground">404</h1>
        <p className="mb-6 text-lg text-muted-foreground">Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/80 transition-smooth">Return to Home</a>
      </div>
    </div>
  );
};

export default NotFound;
