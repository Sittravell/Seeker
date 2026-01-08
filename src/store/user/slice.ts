
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { UserApi } from '@/api';
import { fetchUserProfile, updateUserProfile, uploadUserAvatar } from './thunks';

interface UserState {
    data: UserApi.UserProfile | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    data: null,
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUserData: (state) => {
            state.data = null;
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        // Fetch
        builder.addCase(fetchUserProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<UserApi.UserProfile>) => {
            state.loading = false;
            state.data = fixProfilePictureUrl(action.payload);
        });
        builder.addCase(fetchUserProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Update
        builder.addCase(updateUserProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<UserApi.UserProfile>) => {
            state.loading = false;
            state.data = fixProfilePictureUrl(action.payload);
        });
        builder.addCase(updateUserProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Upload Avatar
        builder.addCase(uploadUserAvatar.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(uploadUserAvatar.fulfilled, (state, action: PayloadAction<UserApi.UserProfile>) => {
            state.loading = false;
            state.data = fixProfilePictureUrl(action.payload);
        });
        builder.addCase(uploadUserAvatar.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

const fixProfilePictureUrl = (user: UserApi.UserProfile) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (user.profilePicture && user.profilePicture.startsWith('/')) {
        return {
            ...user,
            profilePicture: `${apiUrl}${user.profilePicture}`
        };
    }
    return user;
};

export const { clearUserData } = userSlice.actions;
export default userSlice.reducer;
