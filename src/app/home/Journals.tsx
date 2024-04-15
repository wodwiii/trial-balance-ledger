"use client"
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import CreateJournals from '@/services/CreateJournal';

const Journals = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

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
    await CreateJournals(title);
    closeModal();
  };

  return (
    <>
      <h3 className="text-2xl font-bold tracking-tight">
        You have not yet created a journal.
      </h3>
      <Button onClick={openModal} className="mt-4">Add Journal</Button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-background p-6 rounded-lg w-96 mx-4">
            <h3 className="text-xl font-bold text-foreground mb-4">Create New Journal</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-left text-sm font-medium text-foreground">Title</label>
                <input ref={titleRef} type="text" id="title" name="title" required className="mt-1 p-2 w-full border rounded-md" />
              </div>
              <div className="flex justify-end">
                <Button type="submit" variant={'outline'}>Save</Button>
                <Button onClick={closeModal} className="ml-2" variant={'destructive'}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Journals;
