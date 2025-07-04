'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SheetData {
  [key: string]: string | number | null;
}

interface ExcelGridProps {
  className?: string;
  sheets?: {
    cash_flow: SheetData;
    assumptions: SheetData;
    balance_sheet: SheetData;
  };
}

export function ExcelGrid({ className, sheets }: ExcelGridProps) {
  const [activeTab, setActiveTab] = useState<'cash_flow' | 'assumptions' | 'balance_sheet'>('cash_flow');
  
  // Debug logging
  useEffect(() => {
    console.log('ExcelGrid received sheets:', sheets);
    console.log('Active sheet data:', sheets?.[activeTab]);
  }, [sheets, activeTab]);

  // Get the sheet names from the sheets prop or use defaults
  const sheetNames = sheets ? Object.keys(sheets) : ['cash_flow', 'assumptions', 'balance_sheet'];
  
  // Function to convert Excel column notation to index (e.g., 'A' -> 0, 'B' -> 1, 'AA' -> 26)
  const columnToIndex = (col: string): number => {
    let result = 0;
    for (let i = 0; i < col.length; i++) {
      result *= 26;
      result += col.charCodeAt(i) - 'A'.charCodeAt(0) + 1;
    }
    return result - 1;
  };

  // Function to convert index to Excel column notation
  const indexToColumn = (index: number): string => {
    let result = '';
    index++;
    while (index > 0) {
      const remainder = (index - 1) % 26;
      result = String.fromCharCode(65 + remainder) + result;
      index = Math.floor((index - 1) / 26);
    }
    return result;
  };

  // Calculate grid dimensions based on the active sheet's data
  const gridDimensions = useMemo(() => {
    if (!sheets || !sheets[activeTab]) {
      return { rows: 20, cols: 10 };
    }

    const activeSheetData = sheets[activeTab];
    let maxRow = 0;
    let maxCol = 0;

    Object.keys(activeSheetData).forEach(cell => {
      const match = cell.match(/([A-Z]+)(\d+)/);
      if (match) {
        const col = columnToIndex(match[1]);
        const row = parseInt(match[2]);
        maxCol = Math.max(maxCol, col);
        maxRow = Math.max(maxRow, row);
      }
    });

    // Debug logging
    console.log('Grid dimensions calculated:', { maxRow, maxCol });

    return {
      rows: Math.max(maxRow + 5, 20), // Add some extra rows
      cols: Math.max(maxCol + 3, 10)  // Add some extra columns
    };
  }, [sheets, activeTab]);

  // Generate column headers
  const colHeaders = Array.from({ length: gridDimensions.cols }, (_, i) => indexToColumn(i));

  // Function to format cell value for display
  const formatCellValue = (value: string | number | null): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'number') {
      // Format numbers with 2 decimal places if they have decimals
      return Number.isInteger(value) ? value.toString() : value.toFixed(2);
    }
    return value.toString();
  };

  return (
    <div className={cn("flex flex-col w-full h-full overflow-hidden", className)}>
      <div className="flex border-b border-gray-200">
        {sheetNames.map((sheet) => (
          <button
            key={sheet}
            onClick={() => setActiveTab(sheet as typeof activeTab)}
            className={cn(
              "h-8 px-3 text-xs font-medium border-r border-gray-200 flex items-center justify-center shrink-0",
              activeTab === sheet
                ? "bg-white text-blue-600 border-b-2 border-b-blue-600 -mb-[2px]"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            )}
          >
            {sheet.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </button>
        ))}
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0 overflow-auto">
          <table className="border-collapse w-full">
            {/* Column headers */}
            <thead>
              <tr>
                <th className="w-12 bg-gray-50 border border-gray-200 sticky left-0 top-0 z-20"></th>
                {colHeaders.map((header) => (
                  <th
                    key={header}
                    className="w-24 shrink-0 bg-gray-50 border border-gray-200 px-1.5 py-0.5 text-xs font-medium text-gray-600 sticky top-0 z-10"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            {/* Grid cells */}
            <tbody>
              {Array.from({ length: gridDimensions.rows }, (_, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="w-12 shrink-0 bg-gray-50 border border-gray-200 px-1.5 py-0.5 text-xs font-medium text-gray-600 sticky left-0 z-10">
                    {rowIndex + 1}
                  </td>
                  {Array.from({ length: gridDimensions.cols }, (_, colIndex) => {
                    const cellRef = `${indexToColumn(colIndex)}${rowIndex + 1}`;
                    const cellValue = sheets?.[activeTab]?.[cellRef];
                    
                    return (
                      <td
                        key={colIndex}
                        className="w-24 shrink-0 border border-gray-200 px-1.5 py-0.5 text-xs"
                      >
                        <div
                          contentEditable
                          suppressContentEditableWarning
                          className="outline-none min-h-[1.25rem] whitespace-nowrap overflow-hidden text-ellipsis"
                        >
                          {formatCellValue(cellValue)}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 