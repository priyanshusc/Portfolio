import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-6xl font-display font-bold mb-4">404</h1>
        <p className="text-lg text-zinc-400 mb-6">Page not found</p>
        <a
          href="/"
          className="inline-flex items-center rounded-full bg-gradient-to-r from-neon-purple via-neon-blue to-neon-pink px-5 py-2 text-sm font-medium text-white"
        >
          Go Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
