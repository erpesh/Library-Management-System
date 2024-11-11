'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { toast } from "@/hooks/use-toast"
import { CalendarIcon } from 'lucide-react'
import axios from "axios"

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  genre: z.string().min(1, 'Genre is required'),
  releaseDate: z.date({
    required_error: "Please select a release date.",
  }),
  imageUrl: z.string().url('Please enter a valid URL for the cover image'),
  stock: z.coerce.number().min(0, 'Stock must be a non-negative number'),
})

type FormValues = z.infer<typeof formSchema>

async function updateMedia(id: string, data: FormValues) {
  try {
    const response = await axios.put(`/api/media/${id}`, data)
    return response.data
  } catch (e) {
    console.error('Error updating media:', e)
    throw e
  }
}

async function fetchMedia(id: string) {
  try {
    const response = await axios.get(`/api/media/${id}`)
    return response.data
  } catch (e) {
    console.error('Error fetching media:', e)
    throw e
  }
}

export default function EditMediaForm({ mediaId = '1' }: { mediaId?: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      genre: '',
      releaseDate: new Date(),
      imageUrl: '',
      stock: 0,
    },
  })

  useEffect(() => {
    const loadMedia = async () => {
      try {
        const media = await fetchMedia(mediaId)
        form.reset({
          ...media,
          releaseDate: new Date(media.releaseDate),
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load media data.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadMedia()
  }, [mediaId, form])

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      await updateMedia(mediaId, data)
      toast({
        title: "Media Updated",
        description: "Your media has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating your media.",
      })
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Card className="mt-4 w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Media</CardTitle>
        <CardDescription>Update the details of your media item.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="action">Action</SelectItem>
                        <SelectItem value="comedy">Comedy</SelectItem>
                        <SelectItem value="drama">Drama</SelectItem>
                        <SelectItem value="scifi">Science Fiction</SelectItem>
                        <SelectItem value="horror">Horror</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select one genre for your media.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="releaseDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Release Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      The release date of your media.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Number of copies available in stock.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a brief description of your media.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide a URL for the cover image of your media.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Updating...' : 'Update Media'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}