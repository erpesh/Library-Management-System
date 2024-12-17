'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const mediaTypes = {
    all: 'All',
    book: 'Books',
    cd: 'CDs',
    game: 'Games'
};

export default function MediaSelect() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [selectedType, setSelectedType] = useState<string>(searchParams.get('mediaType') || 'all');

    const handleTypeChange = (value: string) => {
        setSelectedType(value);
        const params = new URLSearchParams(searchParams);
        if (value === 'all') {
            params.delete('mediaType');
        } else {
            params.set('mediaType', value);
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div>
            <h2 className="text-lg font-semibold mb-2">Media Type</h2>
            <Select onValueChange={handleTypeChange} value={selectedType}>
                <SelectTrigger name='Select media type...'>
                    <SelectValue>{mediaTypes[selectedType]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {Object.entries(mediaTypes).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};