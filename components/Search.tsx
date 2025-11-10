import Script from "next/script";
import { Search as SearchIcon } from "lucide-react";

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full mb-4 md:mb-6">
            <SearchIcon className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-3 md:mb-4">
            Search Notes & Posts
          </h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Discover insights, tutorials, and community-shared notes across all
            topics
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl shadow-xl p-4 md:p-8 border border-border">
            {/* Google Custom Search Engine div */}
            <div className="gcse-search"></div>
          </div>
        </div>
      </div>

      {/* The script that powers the search engine */}
      <Script
        src="https://cse.google.com/cse.js?cx=24999b7a6d56f4f65"
        strategy="lazyOnload"
      />
    </div>
  );
}