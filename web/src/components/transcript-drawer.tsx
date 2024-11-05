import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Transcript } from "@/components/transcript";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";

interface TranscriptDrawerProps {
  children: React.ReactNode;
}

export function TranscriptDrawer({ children }: TranscriptDrawerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollButtonRef = useRef<HTMLButtonElement>(null);
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="h-[70vh] fixed bottom-0 left-0 right-0">
        <div className="h-full flex flex-col">
          <div 
            className="flex-1 overflow-y-auto relative" 
            ref={scrollContainerRef}
          >
            <Transcript
              scrollContainerRef={scrollContainerRef}
              scrollButtonRef={scrollButtonRef}
            />
          </div>
          <div className="sticky bottom-0 left-0 right-0 p-4 bg-white">
            <button
              ref={scrollButtonRef}
              className="p-2 bg-white text-gray-500 rounded-full hover:bg-gray-100 transition-colors absolute right-4 bottom-4 shadow-md flex items-center"
            >
              <ChevronDown className="mr-1 h-4 w-4" />
              <span className="text-xs pr-1">View latest</span>
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
