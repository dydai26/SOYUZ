
import React from "react";
import { Store } from "@/types";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

interface StoreCarouselProps {
  stores: Store[];
}

const StoreCarousel: React.FC<StoreCarouselProps> = ({ stores }) => {
  return (
    <Carousel className="w-full max-w-5xl mx-auto">
      <CarouselContent>
        {stores.map((store) => (
          <CarouselItem key={store.id} className="basis-1/2 md:basis-1/4 lg:basis-1/6 xl:basis-1/7">
            <div className="p-2">
              <div className="flex flex-col items-center p-2">
                {store.url ? (
                  <a 
                    href={store.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center"
                  >
                    <div className="h-16 flex items-center justify-center">
                      <img 
                        src={store.logo} 
                        alt={store.name} 
                        className="max-h-full object-contain filter brightness-0 invert"
                      />
                    </div>
                  </a>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="h-16 flex items-center justify-center">
                      <img 
                        src={store.logo} 
                        alt={store.name} 
                        className="max-h-full object-contain filter brightness-0 invert"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0 md:-left-12 bg-transparent border-white text-white hover:bg-white/20" />
      <CarouselNext className="right-0 md:-right-12 bg-transparent border-white text-white hover:bg-white/20" />
    </Carousel>
  );
};

export default StoreCarousel;
