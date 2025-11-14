import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Bitcoin,
  Wallet,
  Globe,
  Trophy,
  Filter,
  TrendingUp,
  Clock,
} from "lucide-react";

interface MarketFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedSort: string;
  onSortChange: (sort: string) => void;
}

const categories = [
  { id: "all", label: "All Markets", icon: Globe },
  { id: "crypto-price", label: "Crypto Price", icon: Bitcoin },
  { id: "defi", label: "DeFi & Protocols", icon: Wallet },
  { id: "politics", label: "Politics", icon: Globe },
  { id: "sports", label: "Sports", icon: Trophy },
];

const statuses = [
  { id: "all", label: "All" },
  { id: "open", label: "Open" },
  { id: "resolved", label: "Resolved" },
  { id: "upcoming", label: "Upcoming" },
];

const sortOptions = [
  { id: "volume", label: "Volume", icon: TrendingUp },
  { id: "ending-soon", label: "Ending Soon", icon: Clock },
  { id: "recent", label: "Recent", icon: Clock },
];

export const MarketFilters = ({
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  selectedSort,
  onSortChange,
}: MarketFiltersProps) => {
  return (
    <div className="w-full lg:w-64 space-y-6">
      {/* Categories */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm uppercase tracking-wider">Categories</h3>
        </div>
        <ScrollArea className="h-auto">
          <div className="space-y-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  className={`w-full justify-start gap-2 ${
                    selectedCategory === category.id
                      ? "bg-gradient-primary"
                      : "hover:bg-secondary"
                  }`}
                  onClick={() => onCategoryChange(category.id)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.label}</span>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      <Separator />

      {/* Status */}
      <div>
        <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
          Status
        </h3>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <Badge
              key={status.id}
              variant={selectedStatus === status.id ? "default" : "outline"}
              className={`cursor-pointer ${
                selectedStatus === status.id
                  ? "bg-gradient-primary border-primary"
                  : "hover:bg-secondary"
              }`}
              onClick={() => onStatusChange(status.id)}
            >
              {status.label}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      {/* Sort */}
      <div>
        <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
          Sort By
        </h3>
        <div className="space-y-2">
          {sortOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.id}
                variant={selectedSort === option.id ? "default" : "ghost"}
                className={`w-full justify-start gap-2 ${
                  selectedSort === option.id
                    ? "bg-gradient-primary"
                    : "hover:bg-secondary"
                }`}
                onClick={() => onSortChange(option.id)}
              >
                <Icon className="h-4 w-4" />
                <span>{option.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
