import { FacebookIcon, InstagramIcon, TwitterIcon } from 'lucide-react';
export default function Footer() {
  return (
    <footer className="text-secondary-foreground mt-12 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p>&copy; {(new Date()).getFullYear()} Cantor Library. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}