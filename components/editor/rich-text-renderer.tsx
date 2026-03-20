interface RichTextRendererProps {
    content: string;
    className?: string;
}

export function RichTextRenderer({ content, className = "" }: RichTextRendererProps) {
    return (
        <div
            className={`prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none ${className}`}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}
