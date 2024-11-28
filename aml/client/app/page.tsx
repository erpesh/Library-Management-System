import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Book, Search, Clock, Users, ArrowRight, Calendar, Star } from 'lucide-react'

// Curent landing page!!!!!!!!

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to Cantor Library
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Discover a world of knowledge at your fingertips. Browse our vast collection, manage your loans, and explore new horizons.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Featured Books</h2>
            <Tabs defaultValue="new" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="new">New Arrivals</TabsTrigger>
                <TabsTrigger value="popular">Most Popular</TabsTrigger>
                <TabsTrigger value="recommended">Recommended</TabsTrigger>
              </TabsList>
              <TabsContent value="new" className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {['The Midnight Library', 'Atomic Habits', 'The Invisible Life of Addie LaRue', 'Project Hail Mary'].map((book, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{book}</CardTitle>
                      <CardDescription>by Author Name</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-[3/4] relative bg-gray-100 rounded-md overflow-hidden">
                        <img
                          src={`/placeholder.svg?height=400&width=300&text=${encodeURIComponent(book)}`}
                          alt={book}
                          className="object-cover"
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">View Details</Button>
                    </CardFooter>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="popular" className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* Similar structure as "new" tab, with different books */}
              </TabsContent>
              <TabsContent value="recommended" className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* Similar structure as "new" tab, with different books */}
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Our Features</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Search className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>Easy Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Find any book, journal, or media in our vast collection with our powerful search tool.</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Clock className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>24/7 Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Access our digital resources anytime, anywhere. Your library is always open.</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>Community Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Join book clubs, workshops, and educational events to connect with fellow readers.</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Upcoming Events</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Author Talk: Jane Doe", date: "May 15, 2024", time: "6:00 PM" },
                { title: "Children's Story Time", date: "Every Saturday", time: "10:00 AM" },
                { title: "Book Club: Sci-Fi Lovers", date: "May 20, 2024", time: "7:00 PM" },
              ].map((event, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {event.date} at {event.time}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Join us for an exciting event at the library. Don't miss out!
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Learn More</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">What Our Members Say</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "Alice Johnson", comment: "The library's digital resources have been a game-changer for my research!" },
                { name: "Bob Smith", comment: "I love the community events. I've met so many fellow book lovers!" },
                { name: "Carol Davis", comment: "The staff is always helpful and the book selection is fantastic." },
              ].map((testimonial, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={`https://i.pravatar.cc/150?img=${index + 1}`} />
                        <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      {testimonial.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 dark:text-gray-400">"{testimonial.comment}"</p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current text-yellow-500" />
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Start Your Journey Today</h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Join our community of book lovers and lifelong learners. Sign up for a library card and unlock a world of possibilities.
                </p>
              </div>
              <Button asChild>
  <Link href="/media" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
    Get Started <ArrowRight className="ml-2 h-4 w-4" />
  </Link>
</Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}