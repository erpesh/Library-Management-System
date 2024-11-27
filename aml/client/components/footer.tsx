import { FacebookIcon, InstagramIcon, TwitterIcon } from 'lucide-react';
export default function Footer() {
    return (
        <footer className="bg-secondary text-secondary-foreground mt-12">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p>&copy; 2024 Cantor Library. All rights reserved.</p>
                    </div>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-primary transition-colors"><FacebookIcon className="w-5 h-5" /></a>
                        <a href="#" className="hover:text-primary transition-colors"><TwitterIcon className="w-5 h-5" /></a>
                        <a href="#" className="hover:text-primary transition-colors"><InstagramIcon className="w-5 h-5" /></a>
                    </div>
                </div>
            </div>
        </footer>
    )
}