"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export function WhatsAppWidget() {
    const [isOpen, setIsOpen] = useState(false);

    const phoneNumber = "+254725753008"; // Ohmitex phone number
    const message = "Hello! I'm interested in learning more about your automation solutions.";
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;

    return (
        <>
            {/* Floating Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl"
                    aria-label="Chat with us on WhatsApp"
                >
                    {isOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <MessageCircle className="h-6 w-6" />
                    )}
                </button>

                {/* Tooltip */}
                {!isOpen && (
                    <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
                        <div className="whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-lg">
                            Chat with us on WhatsApp
                        </div>
                    </div>
                )}
            </div>

            {/* Chat Card */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-80 max-w-[calc(100vw-3rem)] animate-in slide-in-from-bottom-4">
                    <div className="rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
                        {/* Header */}
                        <div className="bg-[#25D366] p-4 text-white">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                                    <MessageCircle className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Ohmitex Smart Controls</h3>
                                    <p className="text-sm text-white/90">Typically replies instantly</p>
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-4 bg-gray-50">
                            <div className="rounded-lg bg-white p-3 shadow-sm">
                                <p className="text-sm text-gray-700 mb-3">
                                    👋 Hi there! Need help with automation solutions?
                                </p>
                                <p className="text-sm text-gray-700">
                                    Click the button below to chat with our team on WhatsApp Business.
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#20BA5A]"
                            >
                                <MessageCircle className="h-4 w-4" />
                                Start WhatsApp Chat
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
