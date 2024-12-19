'use client'

import * as React from 'react'
import { useRouter } from "next/navigation"
import { useSession } from 'next-auth/react'
import axios from "axios"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import DatePicker from "./ui/date-picker"
import { Media } from "@/lib/types"

interface Props {
    item: Media
}

const formSchema = z.object({
    returnDate: z.date({
        required_error: "A return date is required.",
    }),
})

export function BorrowButton({ item }: Props) {
    const { data: session } = useSession()
    
    const router = useRouter()
    const [isBorrowing, setIsBorrowing] = React.useState(false)
    const [isOpen, setIsOpen] = React.useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!session) {
            toast.error('You need to sign in to borrow the item')
            router.push('/signin')
            return
        }

        setIsBorrowing(true)
        try {
            await axios.post(`/api/media/${item._id}/borrow`, {
                returnAt: Math.floor(values.returnDate.getTime() / 1000)
            })
            toast.success('Successfully borrowed the item')
            router.refresh()
            setIsOpen(false)
        } catch (error) {
            toast.error('Failed to borrow the item')
        } finally {
            setIsBorrowing(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    disabled={isBorrowing || item.stock === item.borrowed}
                    name='borrow'
                >
                    {isBorrowing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Borrowing...
                        </>
                    ) : (
                        'Borrow Now'
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Select Return Date</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="returnDate"
                            render={({ field }) => (
                                <FormItem className='flex flex-col'>
                                    <FormLabel>Return Date</FormLabel>
                                    <FormControl>
                                        <DatePicker
                                            date={field.value}
                                            setDate={field.onChange}
                                            minDate={new Date()}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isBorrowing}>
                                Confirm Borrowing
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}