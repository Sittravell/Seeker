
import { useState, useEffect, useRef } from 'react';
import { User, Mail, Camera, Save, AlertCircle, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { Button, Input, ProfileAvatar } from '@/components';
import { UseUserHandler } from './use-user-handler';
import { UseClearDialog } from './use-clear-dialog';

export function Profile() {
    const { data: profile, loading: userLoading, error: userError } = useSelector((state: RootState) => state.user);
    const [username, setUsername] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        showClearDialog,
        onOpenDialog,
        onCloseDialog,
    } = UseClearDialog();

    const {
        message,
        localError,
        handleClearData,
        handleUpdateProfile,
        handleFileChange
    } = UseUserHandler({
        username,
        onCloseClearDialog: onCloseDialog
    });


    useEffect(() => {
        if (profile) {
            setUsername(profile.username);
        }
    }, [profile]);

    if (userLoading && !profile) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
        );
    }

    if (!profile) return null;

    const displayError = localError || userError;

    return (
        <div className="max-w-2xl mx-auto px-4 pb-4 pt-0 md:p-6 lg:p-6 space-y-8">
            <h1 className="text-3xl font-bold text-white">Profile Settings</h1>

            {displayError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-2 text-red-400">
                    <AlertCircle size={20} />
                    {displayError}
                </div>
            )}

            {message && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-2 text-green-400">
                    <Save size={20} />
                    {message}
                </div>
            )}

            <div className="bg-gray-800 rounded-2xl py-8 px-4 md:p-6 lg:p-6 border border-white/5 space-y-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
                        <ProfileAvatar
                            username={profile.username}
                            profilePicture={profile.profilePicture}
                            size="xl"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                            disabled={userLoading}
                        >
                            <Camera size={24} />
                        </button>
                    </div>
                    <div className="text-center">
                        <p className="text-gray-400 text-sm">Click image to change</p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        {userLoading && <p className="text-purple-400 text-sm mt-1">Processing...</p>}
                    </div>
                </div>

                {/* Form Section */}
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <Input
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        icon={<User className="w-5 h-5" />}
                        placeholder="Your username"
                    />

                    <div className="opacity-60 cursor-not-allowed">
                        <Input
                            label="Email Address"
                            value={profile.email}
                            disabled
                            icon={<Mail className="w-5 h-5" />}
                            onChange={() => { }}
                        />
                        <p className="text-xs text-gray-500 mt-1 ml-1">Email cannot be changed</p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex flex-col gap-4 items-center">
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={userLoading}
                            disabled={username === profile.username || userLoading}
                        >
                            Save Changes
                        </Button>

                        <Button
                            type="button"
                            variant="danger"
                            onClick={onOpenDialog}
                        >
                            Clear Data
                        </Button>
                    </div>
                </form>
            </div>

            {/* Clear Data Confirmation Dialog */}
            {showClearDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-gray-800 rounded-xl p-6 border border-white/10 max-w-sm w-full shadow-2xl space-y-4">
                        <h3 className="text-xl font-bold text-white">Clear All Data?</h3>
                        <p className="text-gray-400">
                            This will permanently delete all your interactions, ratings, and recommendation history. This action cannot be undone.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <Button
                                variant="secondary"
                                onClick={onCloseDialog}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger" // Style override for danger
                                onClick={handleClearData}
                                className="flex-1 !bg-red-600 hover:!bg-red-700"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
