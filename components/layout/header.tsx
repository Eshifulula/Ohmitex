"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const navigation = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Services", href: "/services" },
        { name: "Projects", href: "/projects" },
        { name: "Clients", href: "/clients" },
        { name: "Blog", href: "/blog" },
        { name: "Contact", href: "/contact" },
    ];

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-none bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" style={{ borderBottom: 'none', boxShadow: 'none' }}>
            <nav className="container flex h-16 items-center justify-between border-none">
                <Link href="/" className="flex items-center space-x-2 group">
                    {/* Logo with invert filter for light mode visibility */}
                    <Image
                        src="/images/logo.png"
                        alt="Ohmitex Smart Controls"
                        width={150}
                        height={40}
                        className="h-10 w-auto"
                        priority
                    />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex md:items-center md:gap-1">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-md ${isActive(item.href)
                                ? "text-primary bg-primary/5"
                                : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                                }`}
                        >
                            {item.name}
                            {isActive(item.href) && (
                                <span className="absolute bottom-0 left-1/2 h-0.5 w-1/2 -translate-x-1/2 bg-accent rounded-full" />
                            )}
                        </Link>
                    ))}
                    <Button asChild size="sm" className="ml-4 bg-accent hover:bg-accent/90">
                        <Link href="/contact">Get a Quote</Link>
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 rounded-md hover:bg-accent/10 transition-colors"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </nav>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="border-t md:hidden animate-in slide-in-from-top-2 duration-200">
                    <div className="container space-y-1 py-4">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`block rounded-md px-3 py-2 text-base font-medium transition-colors ${isActive(item.href)
                                    ? "text-primary bg-primary/10"
                                    : "hover:bg-accent/10 hover:text-primary"
                                    }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Button asChild size="sm" className="w-full bg-accent hover:bg-accent/90 mt-2">
                            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                                Get a Quote
                            </Link>
                        </Button>
                    </div>
                </div>
            )}
        </header>
    );
}
