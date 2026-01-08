import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './store/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from './store/store';
import { ContentDetails, Explore, ExploreDetails, Login, Movies, Popular, Profile, Recommendations, Register, Series } from '@/pages';
import { MainLayout } from '@/layouts';
import { ExploreStore, RecommendationStore, UserStore } from '@/store';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(UserStore.fetchUserProfile());
      dispatch(RecommendationStore.fetchUserRecommendations());
      dispatch(ExploreStore.fetchExploreResults());
    }
  }, [isAuthenticated, dispatch]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate to="/explore" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/explore"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Explore />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/popular"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Popular />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/movies"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Movies />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/series"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Series />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/recommendations"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Recommendations />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/movies/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ContentDetails />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/series/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ContentDetails />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Profile />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/explore/details/:type/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ExploreDetails />
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
