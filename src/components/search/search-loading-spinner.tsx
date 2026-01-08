
import { Loader2 } from 'lucide-react';

export function SearchLoadingSpinner() {
    return (
        <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
        </div>
    );
}

