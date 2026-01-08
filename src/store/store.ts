import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/slice';
import recommendationReducer from './recommendation/slice';
import userReducer from './user/slice';
import exploreReducer from './explore/slice';

export const instance = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        recommendations: recommendationReducer,
        explore: exploreReducer,
    },
});

export type RootState = ReturnType<typeof instance.getState>;
export type AppDispatch = typeof instance.dispatch;
