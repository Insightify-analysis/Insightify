"use client"

import { Button } from "@/components/ui/button"
import { Bot, Menu } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function Navbar() {
    return (
        <motion.nav
            className="flex items-center justify-between px-6 py-4 backdrop-blur-sm border-b border-white/10 sticky top-0 bg-black z-[99]"
        >
            <Link href="/" className="text-cyan-500 flex items-center space-x-2">
                <Bot className="w-8 h-8" />
                <span className="font-medium text-xl">Insightfy</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8 font-bold">
                <NavLink href="/industry">Market Overview</NavLink>
                <NavLink href="/competition">Competitor Analysis</NavLink>
                <NavLink href="/pitch">Pitch Deck</NavLink>
                <NavLink href="/community">Community</NavLink>
                <NavLink href="/speech">Speech</NavLink>
            </div>

            <div className="hidden md:flex items-center space-x-4">
                <Button variant="ghost" className="text-white hover:text-black">
                    <Link href="/login">
                        Sign In
                    </Link>
                </Button>
                <Button className="bg-cyan-600 hover:bg-cyan-500 text-white">
                    <Link href="/signup">
                        Sign Up
                    </Link>
                </Button>
            </div>

            <Button variant="ghost" size="icon" className="md:hidden text-white">
                <Menu className="w-6 h-6" />
            </Button>
        </motion.nav>
    )
}

function NavLink({ href, children }) {
    return (
        <Link href={href} className="text-gray-300 hover:text-white transition-colors relative group">
            {children}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-500 transition-all group-hover:w-full" />
        </Link>
    )
}