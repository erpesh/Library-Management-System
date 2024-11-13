'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Book, Disc, Gamepad, RefreshCw, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast, Toaster } from 'sonner'

const borrowedItems = [
  {
    id: 1,
    title: "The Great Gatsby",
    type: "book",
    borrowDate: "2023-05-15",
    returnDate: "2023-07-15",
    image: "/placeholder.svg?height=100&width=70",
    status: "current"
  },
  {
    id: 2,
    title: "Thriller",
    type: "cd",
    borrowDate: "2023-06-01",
    returnDate: "2023-08-01",
    image: "/placeholder.svg?height=100&width=100",
    status: "current"
  },
  {
    id: 3,
    title: "The Legend of Zelda: Breath of the Wild",
    type: "game",
    borrowDate: "2023-04-20",
    returnDate: "2023-05-20",
    image: "/placeholder.svg?height=100&width=70",
    status: "returned"
  },
  {
    id: 4,
    title: "To Kill a Mockingbird",
    type: "book",
    borrowDate: "2023-03-10",
    returnDate: "2023-04-10",
    image: "/placeholder.svg?height=100&width=70",
    status: "returned"
  },
  {
    id: 5,
    title: "Back in Black",
    type: "cd",
    borrowDate: "2023-05-05",
    returnDate: "2023-06-05",
    image: "/placeholder.svg?height=100&width=100",
    status: "returned"
  }
]

export default function BorrowingHistory() {
  const [searchQuery, setSearchQuery] = useState('')
  const [renewDialogOpen, setRenewDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const filteredItems = borrowedItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleRenew = (item) => {
    setSelectedItem(item)
    setRenewDialogOpen(true)
  }

  const handleRenewSubmit = (e) => {
    e.preventDefault()
    setRenewDialogOpen(false)
    toast.success(`${selectedItem.title} has been renewed`)
  }

  const handleReturn = (item) => {
    toast.success(`${item.title} has been returned`)
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Borrowing History</h1>

      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search borrowed items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow"
        />
        <Button><Search className="w-4 h-4 mr-2" /> Search</Button>
      </div>

      <BorrowedItemsList 
        items={filteredItems} 
        onRenew={handleRenew} 
        onReturn={handleReturn} 
      />

      <RenewDialog 
        open={renewDialogOpen} 
        onOpenChange={setRenewDialogOpen}
        onSubmit={handleRenewSubmit}
        item={selectedItem}
      />

      <Toaster />
    </div>
  )
}

function BorrowedItemsList({ items, onRenew, onReturn }) {
  return (
    <motion.div layout className="space-y-4">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardContent className="flex items-center p-4">
                <div className="mr-4 relative w-[70px] h-[100px]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    {item.type === 'book' && <Book className="w-4 h-4 mr-1" />}
                    {item.type === 'cd' && <Disc className="w-4 h-4 mr-1" />}
                    {item.type === 'game' && <Gamepad className="w-4 h-4 mr-1" />}
                    <span className="capitalize">{item.type}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Borrowed on: {new Date(item.borrowDate).toDateString().split(' ').slice(1).join(' ')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.status === 'current' ? 'Due on: ' : 'Returned on: '}
                    {new Date(item.returnDate).toDateString().split(' ').slice(1).join(' ')}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge variant={item.status === 'current' ? 'default' : 'secondary'}>
                    {item.status === 'current' ? 'Borrowed' : 'Returned'}
                  </Badge>
                  {item.status === 'current' && (
                    <>
                      <Button size="sm" onClick={() => onRenew(item)}>
                        <RefreshCw className="w-4 h-4 mr-2" /> Renew
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Return
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action will mark "{item.title}" as returned. You won't be able to undo this action.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onReturn(item)}>Confirm Return</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

function RenewDialog({ open, onOpenChange, onSubmit, item }) {
  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renew "{item.title}"</DialogTitle>
          <DialogDescription>
            Please select a new return date for this item.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="return-date" className="text-right">
                New Return Date
              </Label>
              <Input
                id="return-date"
                type="date"
                className="col-span-3"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Confirm Renewal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}