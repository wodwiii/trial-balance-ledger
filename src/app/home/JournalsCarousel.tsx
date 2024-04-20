"use client"
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import LoadJournals from "@/services/LoadJournals";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";

const JournalsCarousel = ({ openModal }: { openModal: () => void }) => {
  const [journals, setJournals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const email = localStorage.getItem("email");
        const loadedJournals = await LoadJournals(email);
        console.log("Loaded Journals:", loadedJournals);
        setJournals(loadedJournals);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading journals:", error);
        setIsLoading(false);
      }
    };
      fetchJournals();
  });

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : journals.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <h3 className="text-2xl font-bold tracking-tight">
            You have not yet created a journal.
          </h3>
          <Button onClick={openModal} className="mt-4">
            Add Journal
          </Button>
        </div>
      ) : (
        <div>
        <Label className="my-16 text-3xl font-bold">
            List of Journals
        </Label>    
        <Carousel
          opts={{
            align: "start",
          }}
          orientation="horizontal"
          className="w-full max-w-xs"
        >
          <CarouselContent>
            {journals.map((journal: any) => (
              <CarouselItem key={journal._id} className="pt-1">
                <div className="p-1">
                  <Card>
                    <CardContent className="items-center justify-center p-6">
                      <p className="text-2xl font-semibold">
                        {journal.title}
                      </p>
                      <p className="text-lg font-regular">
                      Created at {format(new Date(journal.date_created), 'MM/dd/yyyy')}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        </div>
      )}
    </>
  );
};

export default JournalsCarousel;
