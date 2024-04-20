"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import CreateJournals from "@/services/CreateJournal";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import JournalsCarousel from "./JournalsCarousel";

const Journals = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const email = localStorage.getItem("email");
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const title = titleRef.current?.value;
    console.log(`Title: ${title}`);
    await CreateJournals(title,email);
    closeModal();
  };

  return (
    <>
      {!isModalOpen && (
        <div>
         <JournalsCarousel openModal={openModal} />
       </div>
      )}

      {isModalOpen && (
        <Card className="w-[350px] inset-0">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Create Journal</CardTitle>
              <CardDescription>
                Add a new journal on your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="title">Journal Title</Label>
                  <Input
                    ref={titleRef}
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Title of your Journal"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={closeModal} variant="outline">
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </>
  );
};

export default Journals;
