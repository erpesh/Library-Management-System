'use client'

import { Button } from '@/components/ui/button';
import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export default function SearchInput() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const title = searchParams.get('title');
        if (title) {
            setSearchTerm(title);
        }
    }, [searchParams]);

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams);
        params.set('title', searchTerm);
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <header className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Media Library Search</h1>

            <form 
            className="flex gap-2"
            onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
            }}
            >
            <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow"
            />
            <Button type="submit"><SearchIcon className="w-4 h-4 mr-2" /> Search</Button>
            </form>
        </header>
    );
}