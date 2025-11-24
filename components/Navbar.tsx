"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TicketPercent, Search, ShoppingBag } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2 font-bold text-xl">
            <ShoppingBag className="w-6 h-6 text-primary" />
            <span className="hidden md:inline-block">Meu Comparador</span>
          </Link>
          
          <div className="flex gap-2">
             <Link href="/">
                <Button variant={pathname === "/" ? "secondary" : "ghost"} size="sm">
                    <Search className="w-4 h-4 mr-2"/>
                    Preços
                </Button>
             </Link>
             <Link href="/cupons">
                <Button variant={pathname === "/cupons" ? "secondary" : "ghost"} size="sm" className="relative">
                    <TicketPercent className="w-4 h-4 mr-2"/>
                    Cupons
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                </Button>
             </Link>
          </div>
        </div>
        
        <div className="flex items-center">
            <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}