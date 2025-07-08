"use client"

import { AppHeader } from "@/components/app-header"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Sun, Battery, Wallet, Calendar } from "lucide-react"
import { useState } from "react"

// Sample metrics for comparison
const METRICS = [
  { id: "lcoe", name: "LCOE", fullName: "Levelized Cost of Energy", format: (v: number) => "$" + v.toFixed(2) + "/MWh" },
  { id: "capex", name: "CAPEX", fullName: "Capital Expenditure", format: (v: number) => "$" + v.toFixed(1) + "M" },
  { id: "irr", name: "IRR", fullName: "Internal Rate of Return", format: (v: number) => v.toFixed(1) + "%" },
  { id: "ppa", name: "PPA", fullName: "Power Purchase Agreement", format: (v: number) => "$" + v.toFixed(2) + "/MWh" },
  { id: "debt", name: "DSCR", fullName: "Debt Service Coverage Ratio", format: (v: number) => v.toFixed(2) + "x" },
  { id: "yield", name: "YIELD", fullName: "Energy Yield", format: (v: number) => v.toFixed(1) + " GWh/y" },
];

// Sample solar farm sites data
const SOLAR_SITES = [
  {
    id: 1,
    name: "Desert Sun Alpha",
    capacity: "150 MW",
    location: "Mojave, CA",
    lender: "GreenBank Capital",
    ppa: "$45.50/MWh",
    status: "Operational",
    completion: "2024-Q2",
    efficiency: "21.5%",
  },
  {
    id: 2,
    name: "Sunbelt Beta",
    capacity: "200 MW",
    location: "Phoenix, AZ",
    lender: "Solar Finance Co.",
    ppa: "$42.75/MWh",
    status: "Construction",
    completion: "2024-Q3",
    efficiency: "22.1%",
  },
  {
    id: 3,
    name: "Valley Solar Gamma",
    capacity: "175 MW",
    location: "Las Vegas, NV",
    lender: "Renewable Fund LLC",
    ppa: "$43.25/MWh",
    status: "Operational",
    completion: "2024-Q1",
    efficiency: "21.8%",
  },
  {
    id: 4,
    name: "Sunshine Delta",
    capacity: "225 MW",
    location: "El Paso, TX",
    lender: "Clean Energy Bank",
    ppa: "$41.50/MWh",
    status: "Development",
    completion: "2024-Q4",
    efficiency: "22.3%",
  },
  {
    id: 5,
    name: "Mesa Power Epsilon",
    capacity: "180 MW",
    location: "Tucson, AZ",
    lender: "Sun Capital Group",
    ppa: "$44.00/MWh",
    status: "Operational",
    completion: "2024-Q2",
    efficiency: "21.9%",
  },
  {
    id: 6,
    name: "Desert View Zeta",
    capacity: "160 MW",
    location: "Palm Springs, CA",
    lender: "Solar Trust Bank",
    ppa: "$46.25/MWh",
    status: "Construction",
    completion: "2024-Q3",
    efficiency: "21.7%",
  },
  {
    id: 7,
    name: "Horizon Eta",
    capacity: "190 MW",
    location: "Albuquerque, NM",
    lender: "Renewable Credit",
    ppa: "$43.75/MWh",
    status: "Development",
    completion: "2025-Q1",
    efficiency: "22.0%",
  },
  {
    id: 8,
    name: "Solar Plains Theta",
    capacity: "210 MW",
    location: "Denver, CO",
    lender: "Green Infrastructure",
    ppa: "$45.00/MWh",
    status: "Operational",
    completion: "2024-Q2",
    efficiency: "21.6%",
  },
];

// Generate comparison data
const generateComparisonData = (metricId: string) => {
  const data = [];
  for (let i = 0; i < SOLAR_SITES.length; i++) {
    const row = [];
    for (let j = 0; j < SOLAR_SITES.length; j++) {
      const site1 = SOLAR_SITES[i];
      const site2 = SOLAR_SITES[j];
      
      let similarity = 100;
      
      // Calculate similarity based on selected metric
      switch (metricId) {
        case "lcoe":
          // LCOE heavily weighted towards efficiency differences
          const eff1 = parseFloat(site1.efficiency.replace('%', ''));
          const eff2 = parseFloat(site2.efficiency.replace('%', ''));
          const effDiff = Math.abs(eff1 - eff2);
          similarity = Math.max(0, Math.min(100, 100 - (effDiff * 15))); // More dramatic efficiency impact
          break;
          
        case "capex":
          // CAPEX based on capacity with location penalty
          const cap1 = parseInt(site1.capacity.replace(' MW', ''));
          const cap2 = parseInt(site2.capacity.replace(' MW', ''));
          const capDiff = Math.abs(cap1 - cap2);
          const locationPenalty = site1.location.split(', ')[1] === site2.location.split(', ')[1] ? 0 : 30;
          similarity = Math.max(0, Math.min(100, 100 - (capDiff / 1.5) - locationPenalty));
          break;
          
        case "irr":
          // IRR based on multiple factors with high variation
          const ppaIrr1 = parseFloat(site1.ppa.replace('$', '').replace('/MWh', ''));
          const ppaIrr2 = parseFloat(site2.ppa.replace('$', '').replace('/MWh', ''));
          const statusMatch = site1.status === site2.status ? 20 : 0;
          const ppaDiff = Math.abs(ppaIrr1 - ppaIrr2) * 5;
          similarity = Math.max(0, Math.min(100, 80 - ppaDiff + statusMatch));
          break;
          
        case "ppa":
          // PPA with regional market adjustments
          const ppa1 = parseFloat(site1.ppa.replace('$', '').replace('/MWh', ''));
          const ppa2 = parseFloat(site2.ppa.replace('$', '').replace('/MWh', ''));
          const state1 = site1.location.split(', ')[1];
          const state2 = site2.location.split(', ')[1];
          const regionalFactor = state1 === state2 ? 1 : 1.5;
          similarity = Math.max(0, Math.min(100, 100 - Math.abs(ppa1 - ppa2) * 8 * regionalFactor));
          break;
          
        case "debt":
          // DSCR with lender matching and completion timing
          const sameLender = site1.lender === site2.lender ? 30 : 0;
          const completion1 = site1.completion.split('-')[0];
          const completion2 = site2.completion.split('-')[0];
          const timingMatch = completion1 === completion2 ? 20 : 0;
          // Use deterministic hash instead of Math.random() to avoid hydration errors
          const hash = (site1.name + site2.name).split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
          }, 0);
          const baseScore = (Math.abs(hash) % 30) + 20; // Deterministic but varied scoring
          similarity = Math.max(0, Math.min(100, baseScore + sameLender + timingMatch));
          break;
          
        case "yield":
          // Yield based on capacity, efficiency, and location
          const capYield1 = parseInt(site1.capacity.replace(' MW', ''));
          const capYield2 = parseInt(site2.capacity.replace(' MW', ''));
          const effYield1 = parseFloat(site1.efficiency.replace('%', ''));
          const effYield2 = parseFloat(site2.efficiency.replace('%', ''));
          const sameRegion = site1.location.split(', ')[1] === site2.location.split(', ')[1] ? 40 : 0;
          const yieldDiff = (Math.abs(capYield1 - capYield2) / 5) + (Math.abs(effYield1 - effYield2) * 10);
          similarity = Math.max(0, Math.min(100, 100 - yieldDiff + sameRegion));
          break;
      }
      
      row.push({
        score: Math.round(similarity),
        site1: site1.name,
        site2: site2.name,
        details: {
          ppa1: site1.ppa,
          ppa2: site2.ppa,
          efficiency1: site1.efficiency,
          efficiency2: site2.efficiency,
          location1: site1.location,
          location2: site2.location,
        }
      });
    }
    data.push(row);
  }
  return data;
};

export default function CreateProjectPage() {
  const [selectedMetric, setSelectedMetric] = useState(METRICS[0].id);
  const matrixData = generateComparisonData(selectedMetric);
  const maxValue = Math.max(...matrixData.flat().map(cell => cell.score));

  // Calculate total portfolio stats
  const totalCapacity = SOLAR_SITES.reduce((sum, site) => 
    sum + parseInt(site.capacity.replace(' MW', '')), 0);
  const avgPPA = (SOLAR_SITES.reduce((sum, site) => 
    sum + parseFloat(site.ppa.replace('$', '').replace('/MWh', '')), 0) / SOLAR_SITES.length).toFixed(2);
  const avgEfficiency = (SOLAR_SITES.reduce((sum, site) => 
    sum + parseFloat(site.efficiency.replace('%', '')), 0) / SOLAR_SITES.length).toFixed(1);

  return (
    <div className="flex h-full flex-col">
      <AppHeader 
        breadcrumbs={[
          { title: "Projects", href: "/projects" },
          { title: "Solar Portfolio Analysis" }
        ]}
      />
      <div className="flex-1 p-8 pt-6">
        <div className="w-full max-w-3xl mx-auto mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-3 w-3 bg-white rounded-full animate-pulse"></div>
              <p className="text-white font-semibold">Coming Soon</p>
            </div>
            <p className="text-blue-100 text-sm">Enhanced portfolio analysis features are being developed</p>
          </div>
        </div>
        <Card className="w-fit mx-auto">
          <div className="border-b">
            <div className="p-4">
              <h2 className="text-2xl font-semibold mb-2">Southwest Solar Portfolio</h2>
              <div className="flex gap-8 mb-4">
                <div className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-yellow-500" />
                  <div>
                    <div className="text-sm text-gray-500">Total Capacity</div>
                    <div className="font-medium">{totalCapacity} MW</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Battery className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="text-sm text-gray-500">Avg. Efficiency</div>
                    <div className="font-medium">{avgEfficiency}%</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="text-sm text-gray-500">Avg. PPA Rate</div>
                    <div className="font-medium">${avgPPA}/MWh</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  <div>
                    <div className="text-sm text-gray-500">Sites</div>
                    <div className="font-medium">{SOLAR_SITES.length} Locations</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 p-4 pt-0">
              {METRICS.map(metric => (
                <button
                  key={metric.id}
                  onClick={() => setSelectedMetric(metric.id)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                    selectedMetric === metric.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {metric.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-6 p-6">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-3">Site Comparison Matrix</div>
              <div className="grid grid-cols-8 gap-0">
                {matrixData.map((row, i) => (
                  row.map((cell, j) => (
                    <TooltipProvider key={`${i}-${j}`}>
                      <Tooltip>
                        <TooltipTrigger>
                          <div
                            className={cn(
                              "w-12 h-12 flex items-center justify-center text-sm font-medium transition-colors duration-200",
                              cell.score === maxValue ? "text-white" : "text-gray-700",
                              // Add rounded corners based on position
                              i === 0 && j === 0 && "rounded-tl-md",
                              i === 0 && j === SOLAR_SITES.length - 1 && "rounded-tr-md",
                              i === SOLAR_SITES.length - 1 && j === 0 && "rounded-bl-md",
                              i === SOLAR_SITES.length - 1 && j === SOLAR_SITES.length - 1 && "rounded-br-md"
                            )}
                            style={{
                              backgroundColor: `rgba(37, 99, 235, ${(cell.score / maxValue) * 0.9 + 0.1})`
                            }}
                          >
                            {cell.score}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="p-3 max-w-[300px]">
                          <p className="font-semibold mb-2">
                            {cell.site1} vs {cell.site2}
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Location</p>
                              <p>{cell.details.location1}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Location</p>
                              <p>{cell.details.location2}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">PPA Rate</p>
                              <p>{cell.details.ppa1}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">PPA Rate</p>
                              <p>{cell.details.ppa2}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Efficiency</p>
                              <p>{cell.details.efficiency1}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Efficiency</p>
                              <p>{cell.details.efficiency2}</p>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))
                ))}
              </div>
            </div>

            <div className="flex-1">
              <div className="text-sm font-medium text-gray-500 mb-3">Site Details</div>
              <div className="overflow-auto max-h-[384px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Site</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Lender</TableHead>
                      <TableHead>PPA Rate</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Completion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {SOLAR_SITES.map((site) => (
                      <TableRow key={site.id}>
                        <TableCell className="font-medium whitespace-nowrap">{site.name}</TableCell>
                        <TableCell className="whitespace-nowrap">{site.capacity}</TableCell>
                        <TableCell className="whitespace-nowrap">{site.location}</TableCell>
                        <TableCell className="whitespace-nowrap">{site.lender}</TableCell>
                        <TableCell className="whitespace-nowrap">{site.ppa}</TableCell>
                        <TableCell>
                          <span className={cn(
                            "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                            site.status === "Operational" 
                              ? "bg-green-50 text-green-700"
                              : site.status === "Construction"
                              ? "bg-yellow-50 text-yellow-700"
                              : "bg-blue-50 text-blue-700"
                          )}>
                            {site.status}
                          </span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-gray-500">{site.completion}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 