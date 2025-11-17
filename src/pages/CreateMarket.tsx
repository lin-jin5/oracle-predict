// src/pages/CreateMarket.tsx

import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

// --- Form Validation Imports ---
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// -----------------------------

// --- Zod Schema Definition ---
const MIN_LIQUIDITY = 10;
const CREATION_FEE = 10;

const marketSchema = z.object({
  question: z.string().min(10, {
    message: "Question must be at least 10 characters.",
  }).max(150, {
    message: "Question must not exceed 150 characters.",
  }),
  description: z.string().min(30, {
    message: "Description must be at least 30 characters.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  endDate: z.date({
    required_error: "An end date is required.",
  }).min(new Date(Date.now() + 24 * 60 * 60 * 1000), { // End date must be at least 1 day in the future
    message: "End date must be in the future.",
  }),
  resolutionSource: z.string().url({
    message: "Must be a valid public URL for resolution.",
  }),
  initialLiquidity: z.coerce.number().min(MIN_LIQUIDITY, {
    message: `Minimum liquidity is ${MIN_LIQUIDITY} USDC.`,
  }).max(100000, {
    message: "Maximum liquidity is 100,000 USDC.",
  }),
});

type MarketFormValues = z.infer<typeof marketSchema>;
// -----------------------------


const CreateMarket = () => {
  // --- Form Hook Initialization ---
  const form = useForm<MarketFormValues>({
    resolver: zodResolver(marketSchema),
    defaultValues: {
      question: "",
      description: "",
      category: "",
      resolutionSource: "",
      initialLiquidity: MIN_LIQUIDITY,
    },
    mode: "onChange",
  });
  // --------------------------------

  const watchedValues = form.watch(["initialLiquidity", "question", "category", "endDate", "resolutionSource"]);

  const initialLiquidityValue = watchedValues.initialLiquidity || 0;
  const totalRequired = (initialLiquidityValue + CREATION_FEE).toFixed(2);
  const isValid = form.formState.isValid;

  const handleSubmit = (values: MarketFormValues) => {
    // --- Blockchain Transaction Logic Placeholder ---
    console.log("Submitting Market Creation:", values);
    // In a real dApp, this is where the 3-step transaction flow would begin.
    // useToast().toast({ title: "Market Submitted", description: "Your market is being deployed to the blockchain." });
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />

      <div className="container px-4 pt-8 pb-12"> {/* Increased top padding for mobile header clearance */}
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
                  <li>• Provide a reliable, public source for resolution (ideally a URL)</li>
                  <li>• Set a reasonable end date that allows for participation</li>
                  <li>• Add enough initial liquidity to enable early trading</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
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
                    <FormField
                      control={form.control}
                      name="question"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Market Question *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Will Bitcoin price exceed $100,000 by end of 2025?"
                              className="text-lg"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-muted-foreground mt-2">
                            Keep it simple, clear, and answerable with YES or NO
                          </p>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Detailed Description *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Provide context and any important details about your market..."
                              className="min-h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Category *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="crypto-price">Crypto Price</SelectItem>
                                <SelectItem value="defi">DeFi & Protocols</SelectItem>
                                <SelectItem value="politics">Politics</SelectItem>
                                <SelectItem value="sports">Sports</SelectItem>
                                <SelectItem value="technology">Technology</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="text-base">End Date *</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? format(field.value, "PPP") : "Pick a date"}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                  // Disable dates before tomorrow
                                  disabled={(date) => date < new Date(Date.now() + 24 * 60 * 60 * 1000)}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                            Specify a clear, public, and verifiable **URL** for the resolution source. This is crucial for market integrity.
                          </p>
                        </div>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="resolutionSource"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="resolution" className="text-base">
                            Resolution Source/Oracle URL *
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="resolution"
                              placeholder="e.g., https://coingecko.com/btc/price-history"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-muted-foreground mt-2">
                            Provide the specific URL or verifiable method for determining the outcome
                          </p>
                        </FormItem>
                      )}
                    />
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
                    <FormField
                      control={form.control}
                      name="initialLiquidity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="liquidity" className="text-base">
                            Initial Liquidity (USDC) *
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="liquidity"
                              type="number"
                              placeholder="100"
                              min={MIN_LIQUIDITY}
                              // Coerce value to number on change
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              value={field.value}
                              onBlur={field.onBlur}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-muted-foreground mt-2">
                            Minimum: {MIN_LIQUIDITY} USDC · Recommended: 100-500 USDC
                          </p>
                        </FormItem>
                      )}
                    />

                    <div className="p-4 rounded-lg bg-secondary/50 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Initial Liquidity</span>
                        <span className="font-medium">{initialLiquidityValue} USDC</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Creation Fee</span>
                        <span className="font-medium">{CREATION_FEE} USDC</span>
                      </div>
                      <div className="border-t border-border/50 pt-2 flex justify-between font-semibold">
                        <span>Total Required</span>
                        <span>{totalRequired} USDC</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Step 4: Review & Create */}
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
                          <span className="font-medium line-clamp-1">{watchedValues.question || "Not set"}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Category: </span>
                          <span className="font-medium">{watchedValues.category || "Not set"}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">End Date: </span>
                          <span className="font-medium">
                            {watchedValues.endDate ? format(watchedValues.endDate, "PPP") : "Not set"}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Resolution Source: </span>
                          <span className="font-medium line-clamp-1">{watchedValues.resolutionSource || "Not set"}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-primary hover:opacity-90 text-lg py-6"
                      disabled={!isValid || form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? "Creating..." : "Create Market"}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      By creating this market, you agree to our Terms of Service and Community
                      Guidelines
                    </p>
                  </div>
                </Card>
              </div>
            </form>
          </Form>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default CreateMarket;
