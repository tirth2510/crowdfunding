import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';


// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

const Home = Loadable(lazy(() => import('views/home')));

const CreateCampaign = Loadable(lazy(() => import('views/create-campaigns')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: '/sample-page',
      element: <SamplePage />
    }, 
    {
      path: '/home',
      element: <Home />
    }, 
    {
      path: '/create-campaign',
      element: <CreateCampaign />
      
    }

  ]
};

export default MainRoutes;
