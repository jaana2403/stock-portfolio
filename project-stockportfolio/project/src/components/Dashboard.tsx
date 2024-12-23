import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Plus, LineChart } from 'lucide-react';
import { StockList } from './StockList';
import { StockForm } from './StockForm';
import { ThemeToggle } from './ThemeToggle';
import { useStocks } from '../hooks/useStocks';

interface DashboardProps {
  user: User;
  onSignOut: () => void;
}

export function Dashboard({ user, onSignOut }: DashboardProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingStock, setEditingStock] = useState<any>(null);
  const { stocks, totalValue, totalGainLoss, handleSubmit, handleDelete } = useStocks(user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stock Portfolio</h1>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <button
            onClick={onSignOut}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <LineChart className="h-8 w-8 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Portfolio Value</p>
                <p className="text-2xl font-bold dark:text-white">${totalValue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Gain/Loss</p>
            <p className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalGainLoss.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Number of Stocks</p>
            <p className="text-2xl font-bold dark:text-white">{stocks.length}</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowForm(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add Stock
      </button>

      <div className="mt-8">
        <StockList
          stocks={stocks}
          onEdit={(stock) => {
            setEditingStock(stock);
            setShowForm(true);
          }}
          onDelete={handleDelete}
        />
      </div>

      {showForm && (
        <StockForm
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingStock(null);
          }}
          initialData={editingStock || undefined}
        />
      )}
    </div>
  );
}