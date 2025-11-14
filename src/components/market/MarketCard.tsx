import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Clock, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MarketCardProps {
  id: string;
  question: string;
  yesPrice: number;
  noPrice: number;
  volume: number;
  endDate: string;
  category: string;
}

export const MarketCard = ({
  id,
  question,
  yesPrice,
  noPrice,
  volume,
  endDate,
  category,
}: MarketCardProps) => {
  const navigate = useNavigate();

  const formatVolume = (vol: number) => {
    if (vol >= 1000000) return `$${(vol / 1000000).toFixed(2)}M`;
    if (vol >= 1000) return `$${(vol / 1000).toFixed(1)}K`;
    return `$${vol}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card
      className="group relative overflow-hidden bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer card-shadow hover:glow"
      onClick={() => navigate(`/market/${id}`)}
    >
      <div className="p-6">
        {/* Category Badge */}
        <div className="mb-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            {category}
          </span>
        </div>

        {/* Question */}
        <h3 className="text-lg font-semibold mb-4 line-clamp-2 group-hover:text-primary transition-colors">
          {question}
        </h3>

        {/* Outcome Prices */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex flex-col gap-1 p-3 rounded-lg bg-success/10 border border-success/20">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>YES</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-success">
                ${yesPrice.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">
                ({Math.round(yesPrice * 100)}%)
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3" />
              <span>NO</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-destructive">
                ${noPrice.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">
                ({Math.round(noPrice * 100)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Market Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-border/50 pt-4">
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-4 w-4" />
            <span className="font-medium">{formatVolume(volume)}</span>
            <span>volume</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{formatDate(endDate)}</span>
          </div>
        </div>

        {/* Trade Button */}
        <Button
          className="w-full mt-4 bg-gradient-primary hover:opacity-90 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/market/${id}`);
          }}
        >
          Trade Now
        </Button>
      </div>

      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none" />
    </Card>
  );
};
