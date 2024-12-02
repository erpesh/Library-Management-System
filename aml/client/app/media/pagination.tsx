'use client'

import {
    Pagination as PaginationRoot,
    PaginationContent, 
    PaginationEllipsis, 
    PaginationItem, 
    PaginationLink, 
    PaginationNext, 
    PaginationPrevious
} from '@/components/ui/pagination';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface PaginationProps {
  totalPages: number;
}

export default function Pagination({ totalPages }: PaginationProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    const renderPageLinks = () => {
        const pageLinks = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageLinks.push(
                <PaginationItem key={i}>
                    <PaginationLink href={createPageURL(i)} isActive={i === currentPage}>
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return pageLinks;
    };

    return (
        <PaginationRoot className="mt-8">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious 
                        href={currentPage > 1 ? createPageURL(currentPage - 1) : '#'}
                        aria-disabled={currentPage === 1}
                    />
                </PaginationItem>
                {currentPage > 2 && (
                    <>
                        <PaginationItem>
                            <PaginationLink href={createPageURL(1)}>1</PaginationLink>
                        </PaginationItem>
                        {currentPage > 3 && <PaginationEllipsis />}
                    </>
                )}
                {renderPageLinks()}
                {currentPage < totalPages - 1 && (
                    <>
                        {currentPage < totalPages - 2 && <PaginationEllipsis />}
                        <PaginationItem>
                            <PaginationLink href={createPageURL(totalPages)}>{totalPages}</PaginationLink>
                        </PaginationItem>
                    </>
                )}
                <PaginationItem>
                    <PaginationNext 
                        href={currentPage < totalPages ? createPageURL(currentPage + 1) : '#'}
                        aria-disabled={currentPage === totalPages}
                    />
                </PaginationItem>
            </PaginationContent>
        </PaginationRoot>
    )
}

