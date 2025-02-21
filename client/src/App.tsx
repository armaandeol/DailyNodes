import React from "react";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import DayView from "@/pages/day-view";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/day/:date" component={DayView} />
      <Route component={NotFound} />
    </Switch>
  );
}

const App = () => {
  const { theme } = useTheme();

  return (
    <div style={{ backgroundColor: theme.background, color: theme.text }}>
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
      </QueryClientProvider>
    </div>
  );
};

const RootApp = () => (
  <ThemeProvider>
    <App />
  </ThemeProvider>
);

export default RootApp;
