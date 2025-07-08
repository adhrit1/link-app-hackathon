"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, DollarSign, TrendingUp, TrendingDown, Wallet2, QrCode, Smartphone, Receipt } from "lucide-react";

interface WalletData {
  bearBucks: number;
  budget: {
    total: number;
    spent: number;
    remaining: number;
  };
  recentTransactions: Array<{
    id: string;
    description: string;
    amount: number;
    type: 'credit' | 'debit';
    date: string;
    category: string;
  }>;
  paymentPlans: Array<{
    id: string;
    name: string;
    amount: number;
    paid: number;
    dueDate: string;
    status: 'active' | 'completed' | 'overdue';
  }>;
}

export default function WalletPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="ml-24 mt-8 relative">
      <div className="flex items-center justify-between mb-8 pr-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Wallet</h1>
          <p className="text-gray-600 mt-2">Manage your Bear Bucks, payments, and budget</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled>
            <QrCode className="h-4 w-4 mr-2" />
            Digital ID
          </Button>
          <Button disabled>
            <DollarSign className="h-4 w-4 mr-2" />
            Add Bear Bucks
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto pr-8">
        {/* Bear Bucks Balance */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet2 className="h-5 w-5" />
              Bear Bucks Balance
            </CardTitle>
            <CardDescription>Your campus currency balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Wallet2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">No Bear Bucks data available</p>
              <p className="text-gray-400 text-xs mt-1">Connect your student account to view balance</p>
            </div>
          </CardContent>
        </Card>

        {/* Budget Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Budget Overview
            </CardTitle>
            <CardDescription>Track your spending and budget</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">No budget data available</p>
              <p className="text-gray-400 text-xs mt-1">Set up your budget preferences to get started</p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
            <CardDescription>Your latest Bear Bucks activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">No transaction history available</p>
              <p className="text-gray-400 text-xs mt-1">Transactions will appear here once you start using Bear Bucks</p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Plans */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Plans
            </CardTitle>
            <CardDescription>Manage your tuition and housing payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">No payment plans available</p>
              <p className="text-gray-400 text-xs mt-1">Payment plans will be displayed here when active</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 