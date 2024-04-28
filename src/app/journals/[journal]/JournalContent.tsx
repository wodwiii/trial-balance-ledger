import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, FilePenLine } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
interface Entry {
  _id: string;
  Date: string;
  Description: string;
  Account_title: string;
  Debit_Amount: number;
  Credit_Amount: number;
}

interface Journal {
  name: string;
  _id: string;
  entries: Entry[];
}

export function JournalTable({ journal }: { journal: Journal }) {
  const router = useRouter();
  const [uniqueTransactions, setUniqueTransactions] = useState<Entry[]>([]);
  const [date, setDate] = React.useState<Date>();
  const [entries, setEntries] = useState<any>([
    { Account_title: "", Entry_type: "", Amount: "0" },
  ]);
  const handleAddEntry = () => {
    setEntries([...entries, { Account_title: "", Entry_type: "", Amount: 0 }]);
  };
  useEffect(() => {
    const groupedEntries: Record<string, Entry[]> = {};
    journal.entries.forEach((entry) => {
      const key = entry.Date;
      if (!groupedEntries[key]) {
        groupedEntries[key] = [];
      }
      groupedEntries[key].push(entry);
    });

    const flattenedEntries = Object.values(groupedEntries).flatMap(
      (entries) => entries
    );
    flattenedEntries.sort(
      (a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime()
    );
    setUniqueTransactions(flattenedEntries);
  }, [journal]);
  const generateTrialBalance = async () => {
    try {
      const response = await fetch("https://tbl-nodeserver.vercel.app/api/create-tbl", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ journalId: journal._id }),
      });
      if (!response.ok) {
        throw new Error(`Failed to generate trial balance: ${response.status} ${response.statusText}`);
      }
      const trialBalanceData = await response.json();
      console.log('Generated Trial Balance:', trialBalanceData);
      router.push('/ledgers/'+trialBalanceData.tbl._id)
      return trialBalanceData;
    } catch (error:any) {
      console.error('Error generating trial balance:', error.message);
      return null;
    }
  };
  const handleFormSubmit = () => {
    const formData = {
      date,
      description:
        (document.getElementById("description") as HTMLInputElement)?.value ||
        "",
    };

    const transactionEntries = entries.map((entry: any, index: number) => ({
      Date: format(date || new Date(), "yyyy-MM-dd"),
      Description:
        (document.getElementById("description") as HTMLInputElement)?.value ||
        "",
      Account_title: (
        document.getElementById(`title-${index}`) as HTMLSelectElement
      )?.value,
      Debit_Amount:
        (document.getElementById(`entryType-${index}`) as HTMLSelectElement)
          ?.value === "debit"
          ? (document.getElementById(`amount-${index}`) as HTMLSelectElement)
              ?.value
          : 0,
      Credit_Amount:
        (document.getElementById(`entryType-${index}`) as HTMLSelectElement)
          ?.value === "credit"
          ? (document.getElementById(`amount-${index}`) as HTMLSelectElement)
              ?.value
          : 0,
    }));
    console.log("Transaction Entries:", { entries: transactionEntries });
    const requestBody = JSON.stringify({ entries: transactionEntries });

    fetch(
      "https://tbl-nodeserver.vercel.app/api/journals/entry/" + journal._id,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setEntries([{ Account_title: "", Entry_type: "", Amount: 0 }])
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleEditRow = (transactionId: string) => {
    const editedAccountTitle = (
      document.getElementById("title") as HTMLInputElement
    ).value;
    const editedDebitAmount = parseFloat(
      (document.getElementById("dAmount") as HTMLInputElement).value
    );
    const editedCreditAmount = parseFloat(
      (document.getElementById("cAmount") as HTMLInputElement).value
    );
    const updatedTransaction = uniqueTransactions.find(
      (transaction) => transaction._id === transactionId
    );

    if (updatedTransaction) {
      const updatedEntry = {
        Date: updatedTransaction.Date,
        Description: updatedTransaction.Description,
        Account_title: editedAccountTitle,
        Debit_Amount: editedDebitAmount,
        Credit_Amount: editedCreditAmount,
      };

      fetch(
        `https://tbl-nodeserver.vercel.app/api/journals/entries/${transactionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ updatedEntry }),
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const transactionIndex = uniqueTransactions.findIndex(
            (transaction) => transaction._id === transactionId
          );

          if (transactionIndex !== -1) {
            const updatedTransactions = [...uniqueTransactions];
            updatedTransactions[transactionIndex] = {
              ...updatedTransactions[transactionIndex],
              Account_title: editedAccountTitle,
              Debit_Amount: editedDebitAmount,
              Credit_Amount: editedCreditAmount,
            };
            setUniqueTransactions(updatedTransactions);
          }

          return response.json();
        })
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <div className="relative mb-24">
      <Dialog>
        <div className="font-bold text-2xl my-8">
          <p>{journal?.name}</p>
        </div>
        <Table>
          <TableCaption>A list of your journal entries.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-64">Date</TableHead>
              <TableHead className="text-center w-64">Account Title</TableHead>
              <TableHead className="text-center w-32">Dr</TableHead>
              <TableHead className="text-center w-32">Cr</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uniqueTransactions.map((transaction: Entry, index: number) => (
              <React.Fragment
                key={`${transaction.Date}-${transaction.Description}-${index}`}
              >
                {/* Render an empty row before each new transaction */}
                {index === 0 ||
                (index > 0 &&
                  transaction.Date !== uniqueTransactions[index - 1].Date) ||
                transaction.Description !==
                  uniqueTransactions[index - 1].Description ? (
                  <TableRow>
                    <TableCell
                      className="text-left"
                      rowSpan={
                        uniqueTransactions.filter(
                          (entry) =>
                            entry.Date === transaction.Date &&
                            entry.Description === transaction.Description
                        ).length + 1
                      }
                    >
                      <div className="">
                        <Label>
                          {format(new Date(transaction.Date), "MM/dd/yyyy")}
                        </Label>
                      </div>
                      <div className="">
                        <Label>{transaction.Description}</Label>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : null}
                <TableRow key={transaction._id}>
                  <TableCell
                    className={
                      transaction.Debit_Amount !== 0
                        ? "text-left"
                        : "text-right"
                    }
                  >
                    {transaction.Account_title}
                  </TableCell>
                  <TableCell className="text-right">
                    {transaction.Debit_Amount !== 0
                      ? transaction.Debit_Amount
                      : ""}
                  </TableCell>
                  <TableCell className="text-right">
                    {transaction.Credit_Amount !== 0
                      ? transaction.Credit_Amount
                      : ""}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-4 w-4 hover:h-10 hover:w-10"
                        >
                          <FilePenLine className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit Entry</DialogTitle>
                          <DialogDescription>
                            Make changes to selected entry. Click save when
                            you&apos;re done.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                              Account Title
                            </Label>
                            <Input
                              id="title"
                              defaultValue={transaction.Account_title}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="dAmount" className="text-right">
                              Debit Amount
                            </Label>
                            <Input
                              id="dAmount"
                              defaultValue={transaction.Debit_Amount}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="cAmount" className="text-right">
                              Credit Amount
                            </Label>
                            <Input
                              id="cAmount"
                              defaultValue={transaction.Credit_Amount}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose>
                            <Button
                              onClick={() => handleEditRow(transaction._id)}
                            >
                              Save changes
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5} className="text-right m-4">
                <DialogTrigger asChild>
                  <Button>Add Transaction</Button>
                </DialogTrigger>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <div className="absolute right-4 mt-8">
          <div>
            <Button onClick={generateTrialBalance}>Generate Trial Balance</Button>
          </div>
        </div>
        <DialogContent className="lg:max-w-[480px] overflow-y-scroll max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogDescription>
              Add new transactions to this journal. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input id="description" defaultValue="" className="col-span-3" />
            </div>
          </div>
          <div className="">
            <div className="text-center">
              <Label>Transaction Entries</Label>
            </div>
            {/* Render input fields for each entry */}
            {entries.map((entry: any, index: any) => (
              <div key={index} className="my-4">
                {/* Input field for entry type */}
                <div className="grid grid-cols-4 items-center gap-4 mt-4">
                  <Label htmlFor={`entryType-${index}`} className="text-right">
                    Entry Type
                  </Label>
                  <select id={`entryType-${index}`} className="col-span-3">
                    <option value="debit">Debit</option>
                    <option value="credit">Credit</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4 mt-4">
                  <Label className="text-right" htmlFor={`title-${index}`}>
                    Account Title
                  </Label>
                  <Input
                    id={`title-${index}`}
                    defaultValue=""
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4 mt-4">
                  <Label htmlFor={`amount-${index}`} className="text-right">
                    Amount
                  </Label>
                  <Input
                    id={`amount-${index}`}
                    defaultValue=""
                    className="col-span-3"
                    type="number"
                  />
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant={"outline"} onClick={handleAddEntry}>
              New Entry
            </Button>
            <DialogClose asChild>
              <Button type="submit" onClick={handleFormSubmit}>
                Save
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
