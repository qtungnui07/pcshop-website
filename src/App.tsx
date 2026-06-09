import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import type { ComponentType } from 'react';

// Automatically import all .tsx files inside the pages directory
const modules = import.meta.glob('./pages/**/*.tsx', { eager: true });

const routes = Object.keys(modules).map((path) => {
  const match = path.match(/\.\/pages\/(.*)\.tsx$/);
  if (!match) return null;
  
  let routePath = match[1].toLowerCase();
  
  // Transform 'index' or 'folder/index' to correct URLs
  routePath = routePath.replace(/\/index$/, '').replace(/^index$/, '/');
  if (routePath !== '/') {
    routePath = `/${routePath}`;
  }

  // @ts-ignore
  const Component = modules[path].default as ComponentType;
  
  return {
    path: routePath,
    Component
  };
}).filter(Boolean) as { path: string, Component: ComponentType }[];

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {routes.map((route) => {
            if (route.path === '/') {
              return <Route key={route.path} index element={<route.Component />} />;
            }
            return <Route key={route.path} path={route.path} element={<route.Component />} />;
          })}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;