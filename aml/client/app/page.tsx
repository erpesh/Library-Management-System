import Link from "next/link";

export default function Page() {
  return (
    <div className="h-screen flex items-center justify-center flex-col">
      <div>This is main page</div>
      <Link href={'/inventory'} className="underline text-blue">Go to inventory page</Link>
    </div>
  )
}