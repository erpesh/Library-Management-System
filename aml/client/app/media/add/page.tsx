'use client'

import { useState } from 'react'
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
  CardFooter,
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
import axios from "axios";

export const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  mediaType: z.enum(['book', 'cd', 'game'], { required_error: 'Media type is required' }),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  genre: z.string().min(1, 'Genre is required'),
  releaseDate: z.date({
    required_error: "Please select a release date.",
  }),
  imageUrl: z.string().url('Please enter a valid URL for the cover image'),
  stock: z.coerce.number().min(0, 'Stock must be a non-negative number').default(0),
  borrowed: z.coerce.number().min(0).default(0),
  author: z.string().optional(),
  publisher: z.string().optional(),
  platform: z.string().optional(),
  artist: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

async function addMedia(data: FormValues) {
  try {
    const response = await axios.post('/api/media', data);
    return response.data;
  }
  catch (e) {
    console.log('error', e)
  }
}

export default function AddMediaForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedMediaType, setSelectedMediaType] = useState<'book' | 'cd' | 'game' | ''>('')

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      mediaType: 'book',
      description: '',
      genre: '',
      releaseDate: new Date(),
      imageUrl: '',
      stock: 0,
      borrowed: 0,
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await addMedia(data);  // Send form data to addMedia
      toast({
        title: "Media Added",
        description: "Your new media has been successfully added.",
      });
      form.reset();
      setSelectedMediaType('');  // Reset the media type selection
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error adding your media.",
      });
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="mt-4 w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Media</CardTitle>
        <CardDescription>Enter the details of your new media item.</CardDescription>
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
                      <Input placeholder="Enter media title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mediaType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Media Type</FormLabel>
                    <FormControl>
                      <Select onValueChange={(value) => {
                        field.onChange(value)
                        setSelectedMediaType(value as 'book' | 'cd' | 'game')
                      }} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select media type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="book">Book</SelectItem>
                          <SelectItem value="cd">CD</SelectItem>
                          <SelectItem value="game">Game</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter genre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Conditional Fields Based on Media Type */}
            {selectedMediaType === 'book' && (
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter author" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {selectedMediaType === 'cd' && (
              <FormField
                control={form.control}
                name="artist"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Artist</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter artist" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {selectedMediaType === 'game' && (
              <>
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter platform" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="publisher"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publisher</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter publisher" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter media description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
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
                    <Input placeholder="Enter cover image URL" {...field} />
                  </FormControl>
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
                    <Input type="number" placeholder="Enter stock quantity" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Adding...' : 'Add Media'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
