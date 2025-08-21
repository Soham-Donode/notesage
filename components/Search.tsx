 import Script from "next/script";
export default function SearchPage() {
  return (
    <div>
      <h1>My Search Page</h1>

      {/* Google Custom Search Engine div */}
      <div className="gcse-search"></div>

      {/* The script that powers the search engine */}
      <Script
        src="https://cse.google.com/cse.js?cx=24999b7a6d56f4f65"
        strategy="lazyOnload"
      />
    </div>
  );
}