
import { NavBar } from "@/components/NavBar";
import App from "@/components/PreviewPage";
import PromptBox from "@/components/PromptBox";
import { Button } from "@/components/ui/button";
export default function Home() {
  return (
      <div className="  h-screen w-screen">
        <header>
          <NavBar/>
          <PromptBox/>
          
          {/* <App/> */}
        </header>
      </div>
  );
}
