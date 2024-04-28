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
import React from "react";
import { Button } from "@/components/ui/button";
import * as XLSX from 'xlsx';
interface Entry {
  Account_Title: string;
  _id: string;
  Debit_amount: number;
  Credit_Amount: number;
}

interface TrialBalance {
  name: string;
  _id: string;
  entries: Entry[];
  Total_debit: number;
  Total_credit: number;
}

export function JournalTable({ trialbalance }: { trialbalance: TrialBalance }) {
  const tb = trialbalance.entries;
  const [excelData, setExcelData] = useState(null);
  useEffect(() => {
    try {
        // Convert the trial balance data to an array of objects
        const dataArray = trialbalance.entries.map(entry => ({
          'Account_Title': entry.Account_Title,
          'Debit_amount': entry.Debit_amount,
          'Credit_Amount': entry.Credit_Amount,
        }));
        dataArray.push({ 'Account_Title': '', 'Debit_amount': trialbalance.Total_debit, 'Credit_Amount': trialbalance.Total_credit });
        const worksheet = XLSX.utils.json_to_sheet(dataArray);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Trial Balance');
        const excelFile = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        setExcelData(excelFile);
      } catch (error) {
        console.error('Error converting data to Excel:', error);
      }
  }, [trialbalance]);

  const downloadCsv = () => {
    if (excelData) {
        const blob = new Blob([excelData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'trial_balance.xlsx';
        link.click();
      }
  };

  
  return (
    <>
      <div className="font-bold text-2xl my-8">
        <p>{trialbalance?.name}</p>
      </div>
      <Table>
        <TableCaption>Auto generated trial balance.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[25vw]">Account Title</TableHead>
            <TableHead className="w-[15vw] text-right">Debit</TableHead>
            <TableHead className="w-[15vw] text-right">Credit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tb.map((entries) => (
            <TableRow key={entries._id}>
              <TableCell className="font-medium text-left">
                {entries.Account_Title}
              </TableCell>
              <TableCell className="text-right">
                {entries.Debit_amount}
              </TableCell>
              <TableCell className="text-right">
                {entries.Credit_Amount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="text-right" colSpan={2}>
              {" "}
              {trialbalance.Total_debit}
            </TableCell>
            <TableCell className="text-right">
              {trialbalance.Total_credit}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <Button className="my-4" onClick={downloadCsv}>
          Download CSV
      </Button>
    </>
  );
}
