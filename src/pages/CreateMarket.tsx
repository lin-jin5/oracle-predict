import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Info, Lightbulb } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const CreateMarket = () => {
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [endDate, setEndDate] = useState<Date>();
  const [resolutionSource, setResolutionSource] = useState("");
  const [initialLiquidity, setInitialLiquidity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle market creation
    console.log({
      question,
      description,
      category,
      endDate,
      resolutionSource,
      initialLiquidity,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />

      <div className="container px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Create Prediction Market
            </h1>
            <p className="text-lg text-muted-foreground">
              Launch your own market and let the community predict the outcome
            </p>
          </div>

          {/* Tips Card */}
          <Card className="p-6 mb-8 bg-primary/5 border-primary/20">
            <div className="flex gap-4">
              <Lightbulb className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Tips for Creating Great Markets</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Make your question clear, specific, and unambiguous</li>
                  <li>• Provide a reliable, public source for resolution</li>
                  <li>• Set a reasonable end date that allows for participation</li>
                  <li>• Add enough initial liquidity to enable early trading</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {/* Step 1: Define Event */}
              <Card className="p-6 bg-gradient-card border-border/50">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center font-bold">
                    1
                  </div>
                  <h2 className="text-2xl font-bold">Define Your Event</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="question" className="text-base mb-2">
                      Market Question *
                    </Label>
                    <Input
                      id="question"
                      placeholder="Will Bitcoin price exceed $100,000 by end of 2025?"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="text-lg"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Keep it simple, clear, and answerable with YES or NO
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-base mb-2">
                      Detailed Description *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Provide context and any important details about your market..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-32"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="category" className="text-base mb-2">
                        Category *
                      </Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="crypto-price">Crypto Price</SelectItem>
                          <SelectItem value="defi">DeFi & Protocols</SelectItem>
                          <SelectItem value="politics">Politics</SelectItem>
                          <SelectItem value="sports">Sports</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-base mb-2">End Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Step 2: Resolution Criteria */}
              <Card className="p-6 bg-gradient-card border-border/50">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center font-bold">
                    2
                  </div>
                  <h2 className="text-2xl font-bold">Set Resolution Criteria</h2>
                </div>

                <div className="space-y-6">
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex gap-2 mb-2">
                      <Info className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Important</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Specify a clear, public, and verifiable source that will be used to
                          determine the outcome. This is crucial for market integrity.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="resolution" className="text-base mb-2">
                      Resolution Source/Oracle *
                    </Label>
                    <Input
                      id="resolution"
                      placeholder="e.g., CoinGecko API, Official Election Results, ESPN Stats"
                      value={resolutionSource}
                      onChange={(e) => setResolutionSource(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Provide the specific source or method for determining the outcome
                    </p>
                  </div>
                </div>
              </Card>

              {/* Step 3: Initial Liquidity */}
              <Card className="p-6 bg-gradient-card border-border/50">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center font-bold">
                    3
                  </div>
                  <h2 className="text-2xl font-bold">Add Initial Liquidity</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="liquidity" className="text-base mb-2">
                      Initial Liquidity (USDC) *
                    </Label>
                    <Input
                      id="liquidity"
                      type="number"
                      placeholder="100"
                      value={initialLiquidity}
                      onChange={(e) => setInitialLiquidity(e.target.value)}
                      min="10"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Minimum: 10 USDC · Recommended: 100-500 USDC
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-secondary/50 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Initial Liquidity</span>
                      <span className="font-medium">{initialLiquidity || "0"} USDC</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Creation Fee</span>
                      <span className="font-medium">10 USDC</span>
                    </div>
                    <div className="border-t border-border/50 pt-2 flex justify-between font-semibold">
                      <span>Total Required</span>
                      <span>{(parseFloat(initialLiquidity || "0") + 10).toFixed(2)} USDC</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Submit */}
              <Card className="p-6 bg-gradient-card border-border/50">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center font-bold">
                    4
                  </div>
                  <h2 className="text-2xl font-bold">Review & Create</h2>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <h3 className="font-semibold mb-2">Market Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Question: </span>
                        <span className="font-medium">{question || "Not set"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Category: </span>
                        <span className="font-medium">{category || "Not set"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">End Date: </span>
                        <span className="font-medium">
                          {endDate ? format(endDate, "PPP") : "Not set"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Resolution Source: </span>
                        <span className="font-medium">{resolutionSource || "Not set"}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary hover:opacity-90 text-lg py-6"
                    disabled={
                      !question ||
                      !description ||
                      !category ||
                      !endDate ||
                      !resolutionSource ||
                      !initialLiquidity
                    }
                  >
                    Create Market
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By creating this market, you agree to our Terms of Service and Community
                    Guidelines
                  </p>
                </div>
              </Card>
            </div>
          </form>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default CreateMarket;
