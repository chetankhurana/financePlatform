"use client"

import React, { useMemo } from 'react'
import { Table , TableCaption , TableHeader , TableRow,TableHead,TableBody,TableCell, } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { format, set } from 'date-fns';
import { categoryColors } from '@/data/categories';
import {ChevronDown, ChevronUp, Clock, MoreHorizontal, RefreshCw , Search, Trash } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { bulkDeleteTransactions } from '@/actions/accounts';
import { toast } from 'sonner';
import { BarLoader } from 'react-spinners';
import useFetch from '@/hooks/use-fetch';
import { useEffect } from 'react';

const RECURRING_INTERVALS = {
    DAILY: "Daily",
    WEEKLY: "Weekly",
    MONTHLY: "Monthly",
    YEARLY: "Yearly",
}

function TransactionTable({transactions}) {

    const router = useRouter();
    const [selectedIds , setSelectedIds] = useState([]);
    const [sortConfig , setSortConfig] = useState({
        field:"date",
        direction: "desc"
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [recurringFilter, setRecurringFilter] = useState("");
    const {
        loading:deleteLoading,
        fn:deletefn,
        data:deleted,
    } = useFetch(bulkDeleteTransactions)



    const filteredAndSortedTransactions = useMemo(()=>{
        let result = [...transactions];

        if( searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter((transaction)=>transaction.description.toLowerCase().includes(searchLower))
        }

        if(recurringFilter) {
            result = result.filter((transaction)=>{
                if(recurringFilter === "recurring") return transaction.isRecurring;
                return !transaction.isRecurring;
            })
        }

        if(typeFilter){
            result = result.filter((transaction)=>transaction.type === typeFilter);
        }

        result.sort((a , b) => {
            let comparison = 0;
            switch (sortConfig.field) {
                case "date":
                    comparison = new Date(a.date) - new Date(b.date);
                    break;
                case "amount":
                    comparison = a.amount - b.amount;
                    break;
                case "category":
                    comparison = a.category.localeCompare(b.category);
                    break;
            
                default:
                    comparison = 0;
            }
            return sortConfig.direction === "asc" ? comparison : -comparison;
        })


        return result;
    } , [
        transactions,
        searchTerm,
        typeFilter,
        recurringFilter,
        sortConfig,
    ]);
    const handleSort = (field)=>{
        setSortConfig((current) => ({
            field,
            direction: current.field == field && current.direction === "asc" ? "desc" : "asc"
        }))
    }

    const handleSelect = (id) => {
        setSelectedIds(current=>current.includes(id)?current.filter(item=>item!=id) : [...current,id]);
    }

    const handleSelectAll = () => {
        setSelectedIds(current=>
            current.length === filteredAndSortedTransactions.length? [] : filteredAndSortedTransactions.map(item => item.id));
    }

    const handleBulkDelete = async ()=>{
        if(!window.confirm(`are you sure you want to delete ${selectedIds.length} transactions?`)){
            return;
        }
        deletefn(selectedIds);

    }

    useEffect(()=>{
        if(deleted && !deleteLoading) {
            toast.error("Transactions deleted successfully");
        }
    } , [
        deleted , deleteLoading
    ])

    const handleClearFilters = ()=>{
        setSearchTerm("");
        setRecurringFilter("");
        setTypeFilter("");
        setSelectedIds([]);
    }



    return (
        <div className='space-y-4'>
            {deleteLoading && (
                <BarLoader className='mt-4' width={"100%"} color='#9333ea'/>
            )}
            {/*Filters*/}
            <div className='flex flex-col sm:flex-row gap-4'>
                <div className='relative flex-1'>
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 " />
                </div>

                <div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger >
                    <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                    <SelectItem value="INCOME">Income</SelectItem>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                </SelectContent>
                </Select>
                </div>

                <div>
                <Select value={recurringFilter} onValueChange={(value) => setRecurringFilter(value)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All transactions" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                    <SelectItem value="recurring">Recurring Only</SelectItem>
                    <SelectItem value="non-recurring">Non-recurring only</SelectItem>
                </SelectContent>
                </Select>
                </div>
                {selectedIds.length>0 && (
                    <div>
                        <Button className="bg-red-500" size="sm" onClick={handleBulkDelete}>
                            <Trash className='h-4 w-4 mr-2' />
                            Delete Selected({selectedIds.length})</Button>
                    </div>
                )}
                {(searchTerm || typeFilter || recurringFilter) && (
                    <Button variant="outline" size="icon" onClick={handleClearFilters} title="clear filters">
                        <X className="h-4 w-5"/>
                    </Button>
                ) }
            </div>

            {/*Transactions*/}
            <div className='rounded-md border'>
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[50px]">
                        <Checkbox onCheckedChange={handleSelectAll}
                        checked={selectedIds.length === filteredAndSortedTransactions.length && filteredAndSortedTransactions.length > 0}
                        />
                    </TableHead>

                    <TableHead className="cursor-pointer" onClick={()=>handleSort("date")}>
                        <div className='flex items-center'>Date{" "}
                        {sortConfig.field === "date" && (
                            sortConfig.direction === "asc" ? (
                                <ChevronUp className='h-4 w-4 ml-1' />
                            ):
                            (<ChevronDown className='h-4 w-4 ml-1' />)
                        )}
                        </div>
                    </TableHead>

                    <TableHead>Description</TableHead>

                    <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                    <div className='flex items-center'>Category
                    {sortConfig.field === "category" && (
                            sortConfig.direction === "asc" ? (
                                <ChevronUp className='h-4 w-4 ml-1' />
                            ):
                            (<ChevronDown className='h-4 w-4 ml-1' />)
                        )}
                    </div>
                    </TableHead>

                    <TableHead className="cursor-pointer" onClick={() => handleSort("amount")}>
                    <div className='flex items-center justify-end'>Amount
                    {sortConfig.field === "amount" && (
                            sortConfig.direction === "asc" ? (
                                <ChevronUp className='h-4 w-4 ml-1' />
                            ):
                            (<ChevronDown className='h-4 w-4 ml-1' />)
                        )}
                    </div>
                    </TableHead>
                    <TableHead>Recurring</TableHead>
                    <TableHead className="w-[50px]" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredAndSortedTransactions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground">
                                No transactions found.
                            </TableCell>
                        </TableRow>
                    ):
                    filteredAndSortedTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                        <TableCell >
                            <Checkbox onCheckedChange={()=>handleSelect(transaction.id)}
                            checked={selectedIds.includes(transaction.id)}
                            />
                        </TableCell>
                        <TableCell>{format(new Date(transaction.date),"PP")}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell className="capitalize ">
                            <span style={{background:categoryColors[transaction.category]}}
                            className='px-2 py-1 rounded text-white text-sm'
                            >
                            {transaction.category}
                            </span>
                            </TableCell>
                        <TableCell className="text-right font-medium"
                        style={{color: transaction.type === "EXPENSE" ? "red" : "green"}}
                        >
                            {transaction.type === "EXPENSE" ? "-" : "+"}
                            ${transaction.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                            {transaction.isRecurring ? (
                            <Tooltip>
                                <TooltipTrigger><Badge variant="outline" className='gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200'>
                                <RefreshCw className='h-3 w-3' />
                                {RECURRING_INTERVALS[transaction.recurringInterval]}
                                </Badge></TooltipTrigger>
                                <TooltipContent>
                                <div className='text-sm'>
                                    <div className='font-medium'>
                                        Next Date:
                                    </div>
                                    <div>
                                    {format(new Date(transaction.nextRecurringDate),"PP")}
                                    </div>
                                </div>
                                </TooltipContent>
                            </Tooltip>
                            ) : (<Badge variant="outline" className='gap-1 '>
                                <Clock className='h-3 w-3' />
                                One-time
                                </Badge>
                            )}
                        </TableCell>
                        <TableCell>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className='h-4 w-4' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white">
                            <DropdownMenuItem
                            onClick={()=>
                                router.push(`/transaction/create?edit=${transaction.id}`)}
                            >Edit</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                            className="text-red-500" 
                            onClick={()=>deletefn([transaction.id])}
                            >    
                                Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))
                    }
                </TableBody>
            </Table>
            </div>

        </div>
    )
}

export default TransactionTable