'use client'

import * as React from "react"
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { getAllGenres } from "@/lib/utils"
import { useRouter, useSearchParams, usePathname } from "next/navigation"


export default function GenreCombobox() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    const [genres, setGenres] = React.useState<string[]>([])

    React.useEffect(() => {
        try {
            const fetchedGenres = getAllGenres()
            setGenres(fetchedGenres && Array.isArray(fetchedGenres) ? fetchedGenres : [])
        } catch (error) {
            console.error("Error fetching genres:", error)
            setGenres([])
        }
    }, [])

    React.useEffect(() => {
        const genre = searchParams.get('genre')
        if (genre) {
            setValue(genre)
        }
    }, [searchParams])

    const handleGenreChange = (currentValue: string) => {
        setValue(currentValue)
        setOpen(false)

        const params = new URLSearchParams(searchParams)
        if (currentValue) {
            params.set('genre', currentValue)
        } else {
            params.delete('genre')
        }
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-2">Genres</h2>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {value
                            ? genres.find((genre) => genre.toLowerCase() === value.toLowerCase())
                            : "Select genre..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full max-w-sm p-0">
                    <Command>
                        <CommandInput placeholder="Search genre..." />
                        <CommandList>
                            <CommandEmpty>No genre found.</CommandEmpty>
                            <CommandGroup>
                                {genres.map((genre) => (
                                    <CommandItem
                                        key={genre}
                                        value={genre}
                                        onSelect={(currentValue) => handleGenreChange(currentValue)}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value.toLowerCase() === genre.toLowerCase() ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {genre}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}