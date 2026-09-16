import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import walletsServices from '../services/walletsServices';
import transactionsServices from '../services/transactionsServices';

const Dashboard = () => {
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isWalletsLoading, setIsWalletsLoading] = useState(false);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(false);

  const fetchWallets = async () => {
    setIsWalletsLoading(true);
    try {
      const data = await walletsServices.getMyWallets();

      if (data?.success) {
        setWallets(data.data);
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsWalletsLoading(false)
    };
  };

  const fetchTransactions = async () => {
    setIsTransactionsLoading(true);
    try {
      const data = await transactionsServices.getMyTransactions(5);

      if (data?.success) {
        setTransactions(data.data);
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsTransactionsLoading(false)
    };
  };

  useEffect(() => {
    fetchWallets();
    fetchTransactions();
  }, []);

  const totalBalances = wallets.reduce((totals, wallet) => {
      const currency = wallet.currency;
      const balance = Number(wallet.balance);

      totals[currency] = (totals[currency] || 0) + balance;

      return totals;
  }, {});

  return (
    <div className='w-full h-screen'>
      <h1 className='text-3xl mb-8 font-semibold font-mono'>Overview</h1>
      <div className='bg-white border border-slate-200 pt-4 rounded-lg'>
        <div className='border-b pb-5 px-4'>
          <div className='flex items-center justify-between'>
            <h1 className='text-sm text-slate-600 font-mono'>TOTAL BALANCE</h1>
            <div className='flex items-center justify-center gap-4'>
              <button className='bg-slate-100 hover:bg-slate-200 cursor-pointer duration-300 px-4 py-2 rounded-lg border border-slate-300'>Deposit</button>
              <button className='bg-slate-100 hover:bg-slate-200 cursor-pointer duration-300 px-4 py-2 rounded-lg border border-slate-300'>Withdraw</button>
              <button className='bg-blue-800 hover:bg-blue-900 cursor-pointer duration-300 px-4 py-2 text-white rounded-lg border border-slate-300'>Transfer</button>
            </div>
          </div>
          <div className="flex gap-8">
              {Object.entries(totalBalances).map(([currency, balance]) => (
                  <div key={currency}>
                      <p className="text-sm text-slate-500">
                          {currency}
                      </p>

                      <h1 className="text-4xl font-mono text-blue-600">
                          {balance.toFixed(2)}
                      </h1>
                  </div>
              ))}
          </div>  
        </div>
        <div className='flex items-center justify-center'>
          {wallets.map((w, index) => (
            <div className={`w-full ${index === wallets.length -1 ? "border-none" : "border-r"} p-4 hover:bg-slate-50 duration-500 cursor-pointer`} key={w.id}>
              <div className='flex items-center justify-between mb-2'>
                <h1 className='text-lg font-semibold'>{w.name}</h1>
                <h1 className={`text-lg ${w.status === "ACTIVE" ? "text-green-500 bg-green-200" : "text-red-500 bg-red-200"} px-1 py-px rounded`}>{w.status}</h1>
              </div>
              <h1 className='text-xl font-mono'>${w.balance}</h1>
              <h1 className='text-sm mt-1 text-slate-600 font-mono'>{w.currency} &middot; {w.bank_name}</h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard