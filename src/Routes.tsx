import React, { lazy, Suspense } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { ROUTES } from './configs/routes';
import ProtectedRoute from './modules/common/components/ProtectedRoute';

const HomePage = lazy(() => import('./modules/home/pages/HomePage'));
const LoginPage = lazy(() => import('./modules/auth/pages/LoginPage'));
const SignUpPage = lazy(() => import('./modules/auth/pages/SignUpPage'));
const PhotosPage = lazy(() => import('./modules/photos/pages/PhotosPage'));
const TransactionPage = lazy(() => import('./modules/transaction/pages/TransactionPage'));

interface Props {}

export const Routes = (props: Props) => {
  const location = useLocation();

  return (
    <Suspense fallback={<div>Loading.....</div>}>
      <Switch location={location}>
        <Route path={ROUTES.signUp} component={SignUpPage} />
        <Route path={ROUTES.login} component={LoginPage} />
        <ProtectedRoute path={ROUTES.home} component={HomePage} />
        <Route path={ROUTES.photos} component={PhotosPage} />
        <Route path={ROUTES.transaction} component={TransactionPage} />
        <Route path="/" component={TransactionPage} />
      </Switch>
    </Suspense>
  );
};
