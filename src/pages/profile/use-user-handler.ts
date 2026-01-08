
import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { UserStore, Store } from '@/store';
import { UserApi } from '@/api';

interface Props {
    username: string;
    onCloseClearDialog: () => void;
}

export function UseUserHandler({ username, onCloseClearDialog }: Props) {
    const dispatch = useDispatch<Store.AppDispatch>();

    const [message, setMessage] = useState<string | null>(null);
    const [localError, setLocalError] = useState<string | null>(null);

    const handleClearData = useCallback(async () => {
        try {
            await UserApi.clearUserData();
            onCloseClearDialog();
            setMessage('All data cleared successfully');
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            setLocalError('Failed to clear data');
            onCloseClearDialog();
        }
    }, [UserApi.clearUserData, onCloseClearDialog, setMessage, setLocalError]);

    const handleUpdateProfile = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);
        setMessage(null);

        if (!username.trim()) {
            setLocalError("Username cannot be empty");
            return;
        }

        try {
            await dispatch(UserStore.updateUserProfile({ username })).unwrap();
            setMessage('Profile updated successfully');
        } catch (err: any) {
            setLocalError(err || 'Failed to update profile');
        }
    }, [dispatch, username, setMessage, setLocalError, UserStore.updateUserProfile]);

    const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLocalError(null);
        setMessage(null);

        try {
            await dispatch(UserStore.uploadUserAvatar(file)).unwrap();
            setMessage('Profile picture updated');
        } catch (err: any) {
            setLocalError(typeof err === 'string' ? err : 'Failed to upload image. Max 5MB, JPG/PNG only.');
        }
    }, [dispatch, setMessage, setLocalError, UserStore.uploadUserAvatar]);

    return {
        message,
        localError,
        handleClearData,
        handleUpdateProfile,
        handleFileChange,
    };
};
