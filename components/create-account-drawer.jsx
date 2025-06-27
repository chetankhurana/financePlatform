"use client"
import React, { useEffect } from 'react'
import { createAccount } from '@/actions/dashboard'
import { useState } from 'react'
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { accountSchema } from '@/app/lib/schema'
import { Input } from './ui/input'
import useFetch from '@/hooks/use-fetch'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'


function CreateAccountDrawer({children}) {
    const [open , setOpen] = useState(false)
    const {register ,handleSubmit,formState:{errors},setValue,watch,reset} = useForm({
        resolver:zodResolver(accountSchema),
        defaultValues:{
            name: "",
            type: 'CURRENT',
            balance: 0,
            isDefault: false
        }
    })
    const {data:newAccount,error,fn:createAccountFn,loading:createAccountLoding} = useFetch(createAccount)

    useEffect(() => {
        if(newAccount && !createAccountLoding){
            toast.success("Account created successfully");
            reset();
            setOpen(false);
        }     
    }, [createAccountLoding,newAccount]);

    useEffect(() => {
        if(error){
            toast.error(error.message || "An error occurred while creating account");
        }
    },[error])

    const onSubmit=async (data)=>{
        console.log("📦 submitted data:", data);
        console.log("🔢 typeof balance:", typeof data.balance, data.balance);
        await createAccountFn(data);
    }

    return (
    <Drawer open={open} onOpenChange={setOpen} >
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent className="bg-white">
            <DrawerHeader>
            <DrawerTitle>Create New Account</DrawerTitle>
            </DrawerHeader>
            <div className='px-4 pb-4 '>
                <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
                    <div className='space-y-2'>
                        <label htmlFor='name' className='text-small font-medium'>Account Name</label>
                        <Input
                        id="name" 
                        placeholder=""
                        {...register("name")}
                        />
                        {errors.name && <p className='text-red-500 text-sm'>{errors.name.message}</p>}
                    </div>

                    <div className='space-y-2'>
                        <label htmlFor='type' className='text-small font-medium'>Account Type</label>
                        <Select onValueChange ={(value) => setValue("type",value)}
                        defaultValue = {watch("type")}
                        >
                            <SelectTrigger id="type">
                                <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                <SelectItem value="CURRENT">Current</SelectItem>
                                <SelectItem value="SAVINGS">Savings</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.type && <p className='text-red-500 text-sm'>{errors.type.message}</p>}
                    </div>

                    <div className='space-y-2'>
                      <label htmlFor='balance' className='text-small font-medium'>Initial balance</label>
                        <Input
                        id="balance" 
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...register("balance")}
                        />
                        {errors.balance && <p className='text-red-500 text-sm'>{errors.balance.message}</p>}
                    </div> 

                    <div className='flex items-center justify-between rounded-lg border p-3'>
                     <div className='space-y-0.5'>
                      <label htmlFor='isDefault' className='text-small font-medium cursor-pointer'>Set As default</label>
                      <p className='text-sm text-muted-foreground'>This account will be selected by default for transactions</p>
                      </div>
                      <Switch 
                      id="isDefault" 
                      onCheckedChange ={(checked) => setValue("isDefault",checked)}
                      checked = {watch("isDefault")}
                      />
                    </div>   
                    <div className='flex gap-4 pt-4'>
                        <DrawerClose asChild>
                            <Button type="button" variant="outline" className="flex-1">Cancel</Button>
                        </DrawerClose>
                        <Button type="Submit" className="flex-1" disabled={createAccountLoding}>{createAccountLoding ? <><Loader2 className='mr-2 h-4 w-4 animate-spin ' />Creating ...</>:("Create Account")}</Button>
                    </div>
                </form>
            </div>
        </DrawerContent>
    </Drawer>
    )
}

export default CreateAccountDrawer
