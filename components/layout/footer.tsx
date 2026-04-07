import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Shield } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t bg-muted/50">
            <div className="container py-12 md:py-16">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Company Info */}
                    <div className="lg:col-span-1">
                        <div className="mb-4">
                            <Image
                                src="/images/logo.png"
                                alt="Ohmitex Smart Controls"
                                width={150}
                                height={40}
                                className="h-10 w-auto"
                            />
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Engineering company specializing in automation, control systems and instrumentation products.
                        </p>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="mb-4 text-base font-semibold">Services</h3>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link href="/services/control-panels" className="text-muted-foreground hover:text-accent transition-colors">
                                    Control Panels
                                </Link>
                            </li>
                            <li>
                                <Link href="/services/bms" className="text-muted-foreground hover:text-accent transition-colors">
                                    Building Management
                                </Link>
                            </li>
                            <li>
                                <Link href="/services/home-automation" className="text-muted-foreground hover:text-accent transition-colors">
                                    Home Automation
                                </Link>
                            </li>
                            <li>
                                <Link href="/services/industrial-automation" className="text-muted-foreground hover:text-accent transition-colors">
                                    Industrial Automation
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-4 text-base font-semibold">Quick Links</h3>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link href="/about" className="text-muted-foreground hover:text-accent transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/projects" className="text-muted-foreground hover:text-accent transition-colors">
                                    Projects
                                </Link>
                            </li>
                            <li>
                                <Link href="/clients" className="text-muted-foreground hover:text-accent transition-colors">
                                    Clients
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-muted-foreground hover:text-accent transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="mb-4 text-base font-semibold">Contact</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0 text-accent" />
                                <a href="mailto:info@ohmitexscontrols.co.ke" className="hover:text-accent transition-colors">
                                    info@ohmitexscontrols.co.ke
                                </a>
                            </li>
                            <li className="flex items-start gap-2">
                                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0 text-accent" />
                                <div className="space-y-1">
                                    <a href="tel:+254725753008" className="block hover:text-accent transition-colors">
                                        +254 725 753 008
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-accent" />
                                <span className="leading-relaxed">Nairobi, Kenya</span>
                            </li>
                        </ul>

                        {/* Social Links */}
                        <div className="mt-4 flex gap-3">
                            <a href="https://facebook.com/ohmitexcontrols" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-accent hover:text-white transition-all">
                                <Facebook className="h-4 w-4" />
                            </a>
                            <a href="https://twitter.com/ohmitexscontrols" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-accent hover:text-white transition-all">
                                <Twitter className="h-4 w-4" />
                            </a>
                            <a href="https://linkedin.com/company/ohmitex" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-accent hover:text-white transition-all">
                                <Linkedin className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-8 border-t pt-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-muted-foreground text-center sm:text-left">
                            &copy; {new Date().getFullYear()} Ohmitex Smart Controls Ltd. All rights reserved.
                        </p>

                        {/* Legal links */}
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Shield className="h-3.5 w-3.5 text-accent mr-1" />
                            <Link
                                href="/privacy-policy"
                                className="hover:text-accent transition-colors underline-offset-2 hover:underline"
                            >
                                Privacy Policy
                            </Link>
                            <span className="mx-2 text-border">·</span>
                            <Link
                                href="/terms-of-use"
                                className="hover:text-accent transition-colors underline-offset-2 hover:underline"
                            >
                                Terms of Use
                            </Link>
                            <span className="mx-2 text-border">·</span>
                            <Link
                                href="/licenses"
                                className="hover:text-accent transition-colors underline-offset-2 hover:underline"
                            >
                                Open Source Licences
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
