"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, CreditCard, QrCode, DollarSign } from "lucide-react";

interface ModuleConfig {
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

export function WalletDashboard({ moduleConfig }: { moduleConfig: ModuleConfig }) {
  return (
    <div className={`min-h-screen ${moduleConfig.bgColor} py-8`}>
      <div className="container mx-auto px-4">
        <div className="w-full max-w-6xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Wallet className="h-6 w-6 text-lime-600" />
                <CardTitle className="text-2xl">Student Wallet</CardTitle>
              </div>
              <CardDescription>
                Digital ID, Bear Bucks, and payment management
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Digital ID</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <QrCode className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold">Student ID</h4>
                  </div>
                  <p className="text-sm text-gray-600">John Doe</p>
                  <p className="text-sm text-gray-600">ID: 123456789</p>
                  <Badge variant="outline" className="mt-2 text-green-600">Active</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold">Bear Bucks</h4>
                  </div>
                  <p className="text-2xl font-bold text-green-600">$156.78</p>
                  <p className="text-sm text-gray-600">Available balance</p>
                  <Badge variant="outline" className="mt-2">Add Funds</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <h4 className="font-semibold">Add Bear Bucks</h4>
                  <p className="text-sm text-gray-600">Add funds to your account</p>
                  <Badge variant="outline" className="mt-2">Add Funds</Badge>
                </div>
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <h4 className="font-semibold">Show ID</h4>
                  <p className="text-sm text-gray-600">Display your digital ID</p>
                  <Badge variant="outline" className="mt-2">Show QR Code</Badge>
                </div>
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <h4 className="font-semibold">Transaction History</h4>
                  <p className="text-sm text-gray-600">View your recent transactions</p>
                  <Badge variant="outline" className="mt-2">View History</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 