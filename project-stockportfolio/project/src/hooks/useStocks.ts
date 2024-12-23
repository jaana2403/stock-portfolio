import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Stock {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  buy_price: number;
  current_price?: number;
  created_at: string;
}

export function useStocks(userId: string) {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [totalGainLoss, setTotalGainLoss] = useState(0);

  useEffect(() => {
    loadStocks();
  }, [userId]);

  async function loadStocks() {
    try {
      const { data, error } = await supabase
        .from('stocks')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      setStocks(data || []);
      calculateTotals(data || []);
    } catch (error) {
      console.error('Error loading stocks:', error);
      toast.error('Failed to load stocks');
    }
  }

  function calculateTotals(stockList: Stock[]) {
    const value = stockList.reduce((sum, stock) => 
      sum + (stock.current_price || stock.buy_price) * stock.quantity, 0);
    
    const gainLoss = stockList.reduce((sum, stock) => {
      if (!stock.current_price) return sum;
      const stockGainLoss = ((stock.current_price - stock.buy_price) / stock.buy_price) * 100;
      return sum + stockGainLoss;
    }, 0) / (stockList.length || 1);

    setTotalValue(value);
    setTotalGainLoss(gainLoss);
  }

  const handleSubmit = async (data: Omit<Stock, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('stocks')
        .insert([{ ...data, user_id: userId }]);

      if (error) throw error;

      toast.success('Stock added successfully');
      loadStocks();
    } catch (error) {
      console.error('Error adding stock:', error);
      toast.error('Failed to add stock');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('stocks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Stock deleted successfully');
      loadStocks();
    } catch (error) {
      console.error('Error deleting stock:', error);
      toast.error('Failed to delete stock');
    }
  };

  return {
    stocks,
    totalValue,
    totalGainLoss,
    handleSubmit,
    handleDelete,
  };
}