"use client"
import React, { useEffect } from 'react'
import {Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { parse } from 'date-fns';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Link from 'next/link';
import useFetch from '@/hooks/use-fetch';
import { updateDefaultAccount } from '@/actions/accounts';
import { toast } from 'sonner';

function AccountCard({account}) {

    const {name, type, balance, isDefault , id} = account;
    const {
        loading:updateDefaultLoading,
        fn:updateDefaultFn,
        data:updatedAccount,
        error
    } = useFetch(updateDefaultAccount);

    const handleDefaultChange = async (event) => {
        event.preventDefault();
        if(isDefault){
            toast.warning("You cannot unset the default account");
            return;
        }
        await updateDefaultFn(id);
    }

    useEffect(() => {
        if(updatedAccount?.success){
            toast.success("Default account updated successfully");
        }
    } , [updatedAccount, updateDefaultLoading]);

    useEffect(() => {
        if(updatedAccount?.success){
            toast.warning(error.message || "failed to update default account");
        }
    } , [error]);

    return (
        <Card className="hover:shadow-md transition-shadow group relative">
        <Link href={`/account/${id}`}>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sx font-medium capitalize">{name}</CardTitle>
    <Switch  checked={isDefault} onClick={handleDefaultChange} disabled={updateDefaultLoading}/>
  </CardHeader>
  <CardContent>
    <div className='text-2xl font-bold'>
        ${parseFloat(balance).toFixed(2)}
    </div>
    <p className='text-xs text-muted-foreground capitalize'>{type.charAt(0) + type.slice(1).toLowerCase()} Account</p>
  </CardContent>
  <CardFooter className="flex justify-between text-sm text-muted-foreground">
    <div className='flex items-center'>
        <ArrowUpRight className="mr-1 h-4 w-4 text-green-500"/>
        Income
    </div>
    <div className='flex items-center'>
        <ArrowDownRight className="mr-1 h-4 w-4 text-red-500"/>
        Expenses
    </div>
  </CardFooter>
  </Link>
</Card>
    )
}

export default AccountCard