
import { useState, useCallback } from 'react';

export function UseClearDialog() {
    const [showClearDialog, setShowClearDialog] = useState(false);

    const onOpenDialog = useCallback(() => {
        setShowClearDialog(true);
    }, []);

    const onCloseDialog = useCallback(() => {
        setShowClearDialog(false);
    }, []);

    return {
        showClearDialog,
        onOpenDialog,
        onCloseDialog,
    };
};
