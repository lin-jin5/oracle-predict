import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Trophy,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
} from "lucide-react";

// Mock data
const portfolioStats = {
  totalValue: 15420.5,
  availableBalance: 5234.2,
  totalProfit: 2340.8,
  winRate: 67.5,
  rank: 342,
};

const openPositions = [
  {
    id: "1",
    question: "Will Bitcoin exceed $100K by EOY 2025?",
    outcome: "YES",
    shares: 500,
    avgPrice: 0.62,
    currentPrice: 0.67,
    value: 335,
    pnl: 25,
    endDate: "2025-12-31",
  },
  {
    id: "2",
    question: "Will Ethereum complete next upgrade?",
    outcome: "YES",
    shares: 300,
    avgPrice: 0.78,
    currentPrice: 0.82,
    value: 246,
    pnl: 12,
    endDate: "2025-06-30",
  },
];

const resolvedPositions = [
  {
    id: "3",
    question: "Will SOL reach $200 in Q1 2025?",
    outcome: "NO",
    shares: 400,
    avgPrice: 0.35,
    finalPrice: 0.0,
    result: "WON",
    pnl: 140,
    resolvedDate: "2025-03-31",
  },
  {
    id: "4",
    question: "Will a new L2 launch with >$1B TVL?",
    outcome: "YES",
    shares: 250,
    avgPrice: 0.55,
    finalPrice: 1.0,
    result: "WON",
    pnl: 112.5,
    resolvedDate: "2025-02-15",
  },
];

const transactions = [
  {
    id: "1",
    type: "BUY",
    market: "Will BTC exceed $100K...",
    outcome: "YES",
    shares: 200,
    price: 0.65,
    total: 130,
    date: "2025-03-15",
  },
  {
    id: "2",
    type: "SELL",
    market: "Will ETH complete upgrade...",
    outcome: "YES",
    shares: 150,
    price: 0.81,
    total: 121.5,
    date: "2025-03-14",
  },
];

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Value</span>
              <Wallet className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold">${portfolioStats.totalValue.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs text-success mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>+12.4%</span>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Available</span>
              <Wallet className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold">${portfolioStats.availableBalance.toLocaleString()}</div>
            <Button variant="link" className="h-auto p-0 text-xs text-primary mt-1">
              Deposit
            </Button>
          </Card>

          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total P&L</span>
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <div className="text-2xl font-bold text-success">
              +${portfolioStats.totalProfit.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs text-success mt-1">
              <span>All time</span>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Win Rate</span>
              <Trophy className="h-4 w-4 text-accent" />
            </div>
            <div className="text-2xl font-bold">{portfolioStats.winRate}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              24 wins / 36 total
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Rank</span>
              <Trophy className="h-4 w-4 text-accent" />
            </div>
            <div className="text-2xl font-bold">#{portfolioStats.rank}</div>
            <div className="flex items-center gap-1 text-xs text-success mt-1">
              <ArrowUpRight className="h-3 w-3" />
              <span>Top 5%</span>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="positions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="positions">Open Positions</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          {/* Open Positions */}
          <TabsContent value="positions" className="space-y-4">
            {openPositions.map((position) => (
              <Card key={position.id} className="p-6 bg-gradient-card border-border/50 hover:border-primary/50 transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge
                        className={
                          position.outcome === "YES"
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        }
                      >
                        {position.outcome}
                      </Badge>
                      <h3 className="font-semibold text-lg">{position.question}</h3>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>{position.shares} shares @ ${position.avgPrice}</span>
                      <span>·</span>
                      <span>Closes {new Date(position.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground mb-1">Current Value</div>
                      <div className="text-xl font-bold">${position.value}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground mb-1">P&L</div>
                      <div
                        className={`text-xl font-bold flex items-center gap-1 ${
                          position.pnl >= 0 ? "text-success" : "text-destructive"
                        }`}
                      >
                        {position.pnl >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        ${Math.abs(position.pnl)}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="border-primary/50 hover:bg-primary/10"
                    >
                      Trade
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Resolved Positions */}
          <TabsContent value="resolved" className="space-y-4">
            {resolvedPositions.map((position) => (
              <Card key={position.id} className="p-6 bg-gradient-card border-border/50">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge
                        className={
                          position.result === "WON"
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        }
                      >
                        {position.result}
                      </Badge>
                      <Badge variant="outline">{position.outcome}</Badge>
                      <h3 className="font-semibold text-lg">{position.question}</h3>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>{position.shares} shares @ ${position.avgPrice}</span>
                      <span>·</span>
                      <span>Resolved {new Date(position.resolvedDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground mb-1">Final P&L</div>
                      <div
                        className={`text-xl font-bold flex items-center gap-1 ${
                          position.pnl >= 0 ? "text-success" : "text-destructive"
                        }`}
                      >
                        {position.pnl >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        ${Math.abs(position.pnl)}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Transactions */}
          <TabsContent value="transactions">
            <Card className="bg-gradient-card border-border/50">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left p-4 font-semibold">Type</th>
                      <th className="text-left p-4 font-semibold">Market</th>
                      <th className="text-left p-4 font-semibold">Outcome</th>
                      <th className="text-right p-4 font-semibold">Shares</th>
                      <th className="text-right p-4 font-semibold">Price</th>
                      <th className="text-right p-4 font-semibold">Total</th>
                      <th className="text-right p-4 font-semibold">Date</th>
                      <th className="text-right p-4 font-semibold"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-border/50 hover:bg-secondary/50">
                        <td className="p-4">
                          <Badge
                            className={
                              tx.type === "BUY"
                                ? "bg-success/10 text-success border-success/20"
                                : "bg-destructive/10 text-destructive border-destructive/20"
                            }
                          >
                            {tx.type}
                          </Badge>
                        </td>
                        <td className="p-4 font-medium">{tx.market}</td>
                        <td className="p-4">
                          <Badge variant="outline">{tx.outcome}</Badge>
                        </td>
                        <td className="p-4 text-right">{tx.shares}</td>
                        <td className="p-4 text-right">${tx.price}</td>
                        <td className="p-4 text-right font-semibold">${tx.total}</td>
                        <td className="p-4 text-right text-sm text-muted-foreground">
                          {new Date(tx.date).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="icon">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Portfolio;
