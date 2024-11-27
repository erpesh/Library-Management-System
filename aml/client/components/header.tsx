import { LibraryIcon, Heart, HomeIcon, PlusCircleIcon, FilmIcon, PhoneIcon, NotebookTabs } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import Link from 'next/link';

export default function Header() {
    return (
        <header className="border-b">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <LibraryIcon className="w-6 h-6 text-primary" />
                        <span className="text-xl font-semibold">MediaLib</span>
                    </div>
                    <nav>
                        <ul className="flex space-x-6">
                            <li><Link href="/" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"><HomeIcon className="h-4 w-4" /> Home</Link></li>
                            <li><Link href="/media/add" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"><PlusCircleIcon className="h-4 w-4" /> Add Media</Link></li>
                            <li><Link href="/media" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"><FilmIcon className="h-4 w-4" /> Media</Link></li>
                            <li><Link href="/wishlist" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"><Heart className="h-4 w-4" /> Wishlist</Link></li>
                            <li><Link href="/borrowing" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"><NotebookTabs className="h-4 w-4" /> Borrowing</Link></li>
                            <li><Link href="/contact" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"><PhoneIcon className="h-4 w-4" /> Contact</Link></li>
                        </ul>
                    </nav>
                    <ModeToggle />
                </div>
            </div>
        </header>
    )
}