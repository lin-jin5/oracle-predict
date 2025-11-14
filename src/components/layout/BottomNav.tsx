import { NavLink } from "@/components/NavLink";
import { Home, Wallet, PlusCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export const BottomNav = () => {
  const navItems = [
    {
      to: "/",
      icon: Home,
      label: "Markets",
      end: true,
    },
    {
      to: "/portfolio",
      icon: Wallet,
      label: "Portfolio",
    },
    {
      to: "/create",
      icon: PlusCircle,
      label: "Create",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 lg:hidden">
      <div className="container px-2 py-2">
        <div className="grid grid-cols-3 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:bg-secondary/50 active:scale-95"
                )}
                activeClassName="text-primary bg-primary/10"
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
                    <span className={cn("text-xs font-medium", isActive && "text-primary")}>
                      {item.label}
                    </span>
                    {isActive && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-12 rounded-full bg-gradient-primary" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
