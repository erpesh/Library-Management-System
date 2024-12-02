'use client'

import * as React from 'react'
import { useRouter } from "next/navigation"
import { useSession } from 'next-auth/react'
import axios from "axios"
import { toast } from "sonner"
import { CalendarIcon, Loader2 } from "lucide-react"
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
    newReturnDate: z.date({
        required_error: "A new return date is required.",
    }),
})

export function RenewButton({ item }: Props) {
    const { data: session } = useSession()
    const router = useRouter()
    const [isRenewing, setIsRenewing] = React.useState(false)
    const [isOpen, setIsOpen] = React.useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!session) {
            toast.error('You need to sign in to renew the item')
            router.push('/signin')
            return
        }

        if (!item.borrowingRecord) {
            toast.error('The item is not borrowed')
            return
        }

        setIsRenewing(true);
        try {
            await axios.post(`/api/media/${item.borrowingRecord!.ID}/renew`, {
                newReturnDate: Math.floor(values.newReturnDate.getTime() / 1000)
            })
            toast.success('Successfully renewed the item')
            router.refresh()
            setIsOpen(false)
        } catch (error) {
            toast.error('Failed to renew the item')
        } finally {
          setIsRenewing(false)
        }
    }

    if (!item.borrowingRecord)
        return null

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
            <Button size="sm" variant="outline" disabled={isRenewing}>
              <CalendarIcon className="w-4 h-4 mr-2" /> Renew
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
                            name="newReturnDate"
                            render={({ field }) => (
                                <FormItem className='flex flex-col'>
                                    <FormLabel>New Return Date</FormLabel>
                                    <FormControl>
                                        <DatePicker
                                            date={field.value}
                                            setDate={field.onChange}
                                            minDate={new Date(item.borrowingRecord!.ReturnAt * 1000)}
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
                            <Button type="submit" disabled={isRenewing}>
                                Confirm Renewal
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}