"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, CreditCard, Calculator } from "lucide-react";

interface ModuleConfig {
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

export function FinancialDashboard({ moduleConfig }: { moduleConfig: ModuleConfig }) {
  return (
    <div className={`min-h-screen ${moduleConfig.bgColor} py-8`}>
      <div className="container mx-auto px-4">
        <div className="w-full max-w-6xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-emerald-600" />
                <CardTitle className="text-2xl">Financial Management</CardTitle>
              </div>
              <CardDescription>
                Budget tracking, financial aid, and payment plans
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold">Financial Aid</h4>
                  </div>
                  <p className="text-2xl font-bold text-green-600">$12,500</p>
                  <p className="text-sm text-gray-600">Awarded this year</p>
                  <Badge variant="outline" className="mt-2 text-green-600">Active</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold">Outstanding Balance</h4>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">$2,340</p>
                  <p className="text-sm text-gray-600">Due by Dec 15</p>
                  <Badge variant="outline" className="mt-2 text-red-600">Payment Due</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="h-5 w-5 text-purple-600" />
                    <h4 className="font-semibold">Monthly Budget</h4>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">$800</p>
                  <p className="text-sm text-gray-600">Remaining this month</p>
                  <Badge variant="outline" className="mt-2 text-green-600">On Track</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <h4 className="font-semibold">Make Payment</h4>
                  <p className="text-sm text-gray-600">Pay your outstanding balance</p>
                  <Badge variant="outline" className="mt-2">Pay Now</Badge>
                </div>
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <h4 className="font-semibold">View Financial Aid</h4>
                  <p className="text-sm text-gray-600">Check your aid status</p>
                  <Badge variant="outline" className="mt-2">View Details</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 