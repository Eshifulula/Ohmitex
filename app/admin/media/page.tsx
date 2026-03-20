export const dynamic = 'force-dynamic'

import { MediaLibrary } from "@/components/media/media-library";

export default function AdminMediaPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Media Library</h1>
                <p className="text-muted-foreground">Manage your images and files</p>
            </div>

            <MediaLibrary />
        </div>
    );
}
