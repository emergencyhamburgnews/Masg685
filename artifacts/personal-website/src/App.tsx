import { Switch, Route, Router as WouterRouter } from "wouter";
import Navbar from "@/components/Navbar";
import DecorativeBg from "@/components/DecorativeBg";
import Home from "@/pages/Home";
import About from "@/pages/About";
import MyRoblox from "@/pages/MyRoblox";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <>
      <DecorativeBg />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar />
        <main>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/myroblox" component={MyRoblox} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}

export default App;
