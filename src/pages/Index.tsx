import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { MarketCard } from "@/components/market/MarketCard";
import { MarketFilters } from "@/components/market/MarketFilters";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, DollarSign, BarChart3 } from "lucide-react";

// Mock data
const mockMarkets = [
  {
    id: "1",
    question: "Will Bitcoin price exceed $100,000 by end of 2025?",
    yesPrice: 0.67,
    noPrice: 0.33,
    volume: 2450000,
    endDate: "2025-12-31",
    category: "Crypto Price",
  },
  {
    id: "2",
    question: "Will Ethereum successfully complete the next major upgrade?",
    yesPrice: 0.82,
    noPrice: 0.18,
    volume: 1800000,
    endDate: "2025-06-30",
    category: "DeFi & Protocols",
  },
  {
    id: "3",
    question: "Will Solana TVL exceed $15 Billion by Q3 2025?",
    yesPrice: 0.55,
    noPrice: 0.45,
    volume: 920000,
    endDate: "2025-09-30",
    category: "DeFi & Protocols",
  },
  {
    id: "4",
    question: "Will any new Layer 2 solution surpass Arbitrum in TVL?",
    yesPrice: 0.41,
    noPrice: 0.59,
    volume: 750000,
    endDate: "2025-12-31",
    category: "DeFi & Protocols",
  },
  {
    id: "5",
    question: "Will a major exchange launch a prediction market feature?",
    yesPrice: 0.73,
    noPrice: 0.27,
    volume: 1200000,
    endDate: "2025-08-31",
    category: "Crypto Price",
  },
  {
    id: "6",
    question: "Will crypto regulation pass in the US by end of 2025?",
    yesPrice: 0.61,
    noPrice: 0.39,
    volume: 3100000,
    endDate: "2025-12-31",
    category: "Politics",
  },
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("open");
  const [selectedSort, setSelectedSort] = useState("volume");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative border-b border-border/40 bg-gradient-to-b from-background to-secondary/20">
        <div className="container px-4 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Trade the Future of Crypto
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Decentralized prediction markets powered by blockchain. Trade on real-world events with crypto.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                <TrendingUp className="mr-2 h-5 w-5" />
                Start Trading
              </Button>
              <Button size="lg" variant="outline" className="border-primary/50 hover:bg-primary/10">
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
              <Card className="p-4 bg-gradient-card border-border/50">
                <div className="flex flex-col items-center gap-2">
                  <DollarSign className="h-6 w-6 text-primary" />
                  <div className="text-2xl font-bold">$12.5M</div>
                  <div className="text-xs text-muted-foreground">Total Volume</div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-card border-border/50">
                <div className="flex flex-col items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  <div className="text-2xl font-bold">24</div>
                  <div className="text-xs text-muted-foreground">Active Markets</div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-card border-border/50">
                <div className="flex flex-col items-center gap-2">
                  <Users className="h-6 w-6 text-primary" />
                  <div className="text-2xl font-bold">15.2K</div>
                  <div className="text-xs text-muted-foreground">Traders</div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-card border-border/50">
                <div className="flex flex-col items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-success" />
                  <div className="text-2xl font-bold">147</div>
                  <div className="text-xs text-muted-foreground">Markets Resolved</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Markets Section */}
      <section className="container px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:sticky lg:top-20 self-start">
            <MarketFilters
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              selectedSort={selectedSort}
              onSortChange={setSelectedSort}
            />
          </aside>

          {/* Market Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Active Markets</h2>
              <p className="text-muted-foreground">
                {mockMarkets.length} markets available
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockMarkets.map((market) => (
                <MarketCard key={market.id} {...market} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
