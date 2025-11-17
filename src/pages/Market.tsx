// src/pages/Market.tsx

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator"; // Added Separator for cleaner UI
import { Skeleton } from "@/components/ui/skeleton"; // Added Skeleton for loading state mock
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  Info,
  ExternalLink,
  Wallet, // Added Wallet icon
} from "lucide-react";

// Mock chart data
const chartData = [
  { date: "Jan 1", yes: 0.45, no: 0.55 },
  { date: "Jan 15", yes: 0.52, no: 0.48 },
  { date: "Feb 1", yes: 0.61, no: 0.39 },
  { date: "Feb 15", yes: 0.58, no: 0.42 },
  { date: "Mar 1", yes: 0.67, no: 0.33 },
];

// Mock order book data
const orderBook = {
  yes: [
    { price: 0.67, shares: 1500 },
    { price: 0.66, shares: 2300 },
    { price: 0.65, shares: 1800 },
  ],
  no: [
    { price: 0.33, shares: 1200 },
    { price: 0.34, shares: 2100 },
    { price: 0.35, shares: 1600 },
  ],
};

const Market = () => {
  const { id } = useParams();
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [outcome, setOutcome] = useState<"yes" | "no">("yes");
  const [amount, setAmount] = useState("");

  // --- MOCK WEB3 DATA AND STATE ---
  const [isLoading, setIsLoading] = useState(true);
  const [isWalletConnected, setIsWalletConnected] = useState(true); // Mock connection state

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Mock Market Data
  const market = {
    question: "Will Bitcoin price exceed $100,000 by end of 2025?",
    yesPrice: 0.67,
    noPrice: 0.33,
    volume: 2450000,
    endDate: "2025-12-31",
    category: "Crypto Price",
    description:
      "This market will resolve to YES if Bitcoin (BTC) trades at or above $100,000 on any major exchange (Binance, Coinbase, Kraken) before midnight UTC on December 31, 2025.",
    oracle: "CoinGecko API",
    creator: "0x742d...35Ba",
  };

  // MOCK: User Trading Data (UX Enhancement Data)
  const user = {
    walletBalance: 1234.56, // USDC
    position: {
      yesShares: 500,
      noShares: 0,
      avgYesPrice: 0.62,
      avgNoPrice: 0.0,
      pnl: 25.0,
    },
  };
  // ------------------------------------

  const currentPrice = outcome === "yes" ? market.yesPrice : market.noPrice;
  const estimatedShares = tradeType === 'buy' ? (amount ? (parseFloat(amount) / currentPrice).toFixed(2) : "0.00") : amount;
  const estimatedPayout = tradeType === 'sell' ? (amount ? (parseFloat(amount) * currentPrice).toFixed(2) : "0.00") : amount;
  const sharesOwned = outcome === "yes" ? user.position.yesShares : user.position.noShares;
  const avgPrice = outcome === "yes" ? user.position.avgYesPrice : user.position.noShares > 0 ? user.position.avgNoPrice : 0;
  const canSell = tradeType === "sell" && sharesOwned > 0;
  const feeAmount = amount ? (parseFloat(amount) * 0.02).toFixed(2) : '0.00';

  // Simplified P&L calculation for trading card based on current price
  const potentialProfit = amount
    ? (parseFloat(estimatedShares) - parseFloat(amount)).toFixed(2)
    : "0.00";

  const handleTrade = () => {
    // --- Transaction Logic Placeholder ---
    console.log(`${tradeType} ${amount} for market ${id}`);
    // useWriteContract() for buyShares or sellShares
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />

      <div className="container px-4 pt-20 lg:pt-8 py-8"> {/* Adjusted pt-20 for mobile header clearance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Market Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Market Header */}
            <Card className="p-6 bg-gradient-card border-border/50">
              {isLoading ? (
                <>
                  <Skeleton className="h-6 w-1/4 mb-4" />
                  <Skeleton className="h-8 w-3/4 mb-4" />
                  <div className="flex gap-6">
                    <Skeleton className="h-4 w-1/6" />
                    <Skeleton className="h-4 w-1/6" />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      {market.category}
                    </Badge>
                    <Badge variant="outline" className="border-success/50 text-success">
                      <div className="h-2 w-2 rounded-full bg-success mr-2 animate-pulse" />
                      Open
                    </Badge>
                  </div>
                  <h1 className="text-3xl font-bold mb-4">{market.question}</h1>
                  <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium text-foreground">
                        ${(market.volume / 1000000).toFixed(2)}M
                      </span>
                      <span>volume</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Closes {new Date(market.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </>
              )}
            </Card>

            {/* Price Chart */}
            <Card className="p-6 bg-gradient-card border-border/50">
              <h2 className="text-xl font-bold mb-4">Price History</h2>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      domain={[0, 1]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="yes"
                      stroke="hsl(var(--success))"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="no"
                      stroke="hsl(var(--destructive))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Card>

            {/* Market Details */}
            <Card className="p-6 bg-gradient-card border-border/50">
              <Tabs defaultValue="details">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="orderbook">Order Book</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-4">
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" />
                      Resolution Criteria
                    </h3>
                    {isLoading ? <Skeleton className="h-10 w-full" /> : <p className="text-muted-foreground">{market.description}</p>}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Oracle</h3>
                    {isLoading ? <Skeleton className="h-4 w-1/3" /> : (
                      <p className="text-muted-foreground flex items-center gap-2">
                        {market.oracle}
                        <ExternalLink className="h-3 w-3" />
                      </p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Created By</h3>
                    {isLoading ? <Skeleton className="h-4 w-1/2" /> : (
                      <p className="text-muted-foreground font-mono text-sm">
                        {market.creator}
                      </p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="orderbook" className="mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-3 text-success">YES Orders</h3>
                      {isLoading ? <Skeleton className="h-32 w-full" /> : (
                        <div className="space-y-2">
                          {orderBook.yes.map((order, i) => (
                            <div
                              key={i}
                              className="flex justify-between p-2 rounded bg-success/10"
                            >
                              <span className="font-mono text-sm">${order.price}</span>
                              <span className="text-muted-foreground text-sm">
                                {order.shares} shares
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3 text-destructive">NO Orders</h3>
                      {isLoading ? <Skeleton className="h-32 w-full" /> : (
                        <div className="space-y-2">
                          {orderBook.no.map((order, i) => (
                            <div
                              key={i}
                              className="flex justify-between p-2 rounded bg-destructive/10"
                            >
                              <span className="font-mono text-sm">${order.price}</span>
                              <span className="text-muted-foreground text-sm">
                                {order.shares} shares
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="mt-4">
                  <p className="text-muted-foreground text-center py-8">
                    Recent trades will appear here
                  </p>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Right Column - Trading */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-gradient-card border-border/50 sticky top-20">
              <h2 className="text-xl font-bold mb-6">Trade</h2>

              {/* --- UX Enhancement: Wallet and Position Overview --- */}
              {isLoading ? (
                <div className="space-y-3 mb-6 p-4 rounded-lg bg-secondary/50 border border-border/50">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : isWalletConnected ? (
                <div className="space-y-3 mb-6 p-4 rounded-lg bg-secondary/50 border border-border/50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Wallet className="h-4 w-4" /> Available Balance
                    </span>
                    <span className="font-semibold">
                      {user.walletBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} USDC
                    </span>
                  </div>
                  <Separator className="bg-border/50" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Your {outcome.toUpperCase()} Position
                    </span>
                    <span className="font-semibold text-primary">
                      {sharesOwned} shares @ ${avgPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 text-center rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive font-medium mb-2">Wallet Not Connected</p>
                  <appkit-button className="w-full text-xs">Connect Wallet to Trade</appkit-button>
                </div>
              )}
              {/* ---------------------------------------------------- */}

              {/* Buy/Sell Toggle */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                <Button
                  variant={tradeType === "buy" ? "default" : "outline"}
                  className={tradeType === "buy" ? "bg-gradient-primary" : ""}
                  onClick={() => setTradeType("buy")}
                >
                  Buy
                </Button>
                <Button
                  variant={tradeType === "sell" ? "default" : "outline"}
                  className={tradeType === "sell" ? "bg-gradient-primary" : ""}
                  onClick={() => setTradeType("sell")}
                  disabled={sharesOwned === 0 && isWalletConnected} // Disable sell if no shares
                >
                  Sell
                </Button>
              </div>

              {/* Outcome Selection */}
              <div className="space-y-3 mb-6">
                <div
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    outcome === "yes"
                      ? "border-success bg-success/10"
                      : "border-border/50 hover:border-success/50"
                  }`}
                  onClick={() => setOutcome("yes")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-success" />
                      <span className="font-semibold text-success">YES</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-success">
                        ${market.yesPrice}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round(market.yesPrice * 100)}%
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    outcome === "no"
                      ? "border-destructive bg-destructive/10"
                      : "border-border/50 hover:border-destructive/50"
                  }`}
                  onClick={() => setOutcome("no")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-5 w-5 text-destructive" />
                      <span className="font-semibold text-destructive">NO</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-destructive">
                        ${market.noPrice}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round(market.noPrice * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Amount ({tradeType === 'buy' ? 'USDC' : 'SHARES'})</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-lg font-semibold"
                    disabled={isLoading}
                  />
                </div>

                {/* Summary */}
                <div className="space-y-2 p-4 rounded-lg bg-secondary/50">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Est. {tradeType === 'buy' ? 'shares' : 'payout'}</span>
                    <span className="font-medium">{tradeType === 'buy' ? estimatedShares + ' shares' : estimatedPayout + ' USDC'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg. price</span>
                    <span className="font-medium">${currentPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fee (2%)</span>
                    <span className="font-medium">{feeAmount} USDC</span>
                  </div>
                </div>
              </div>

              {/* Trade Button */}
              <Button
                className="w-full bg-gradient-primary hover:opacity-90 text-lg py-6"
                disabled={!amount || parseFloat(amount) <= 0 || !isWalletConnected || (tradeType === 'sell' && !canSell) || isLoading}
                onClick={handleTrade}
              >
                {tradeType === "buy" ? "Buy" : "Sell"} {outcome.toUpperCase()} {tradeType === 'buy' ? 'Shares' : 'Tokens'}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Fee: 2% · Gas: ~$0.50
              </p>
            </Card>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Market;
