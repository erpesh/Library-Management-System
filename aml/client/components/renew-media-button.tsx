import { Button } from "@/components/ui/button"
import { RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

export function RenewButton({ item, onRenew }) {
  const handleRenew = () => {
    onRenew(item)
    toast.success(`${item.title} has been renewed`)
  }

  return (
    <Button size="sm" onClick={handleRenew}>
      <RefreshCw className="w-4 h-4 mr-2" /> Renew
    </Button>
  )
}
