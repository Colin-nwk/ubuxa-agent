
import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { getSyncQueueCount, clearSyncQueue } from '../utils/db';

const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSynced, setLastSynced] = useState<Date>(new Date());
  const [pendingSyncs, setPendingSyncs] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
        setIsOnline(true);
        syncData();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check for pending items
    getSyncQueueCount().then(setPendingSyncs);

    const interval = setInterval(() => {
        if(navigator.onLine) {
            getSyncQueueCount().then(count => {
                if(count > 0 && !isSyncing) syncData();
            });
        }
    }, 10000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const syncData = async () => {
      const count = await getSyncQueueCount();
      if (count === 0) return;

      setIsSyncing(true);
      setPendingSyncs(count);

      // Simulate network sync delay
      setTimeout(async () => {
          await clearSyncQueue();
          setLastSynced(new Date());
          setPendingSyncs(0);
          setIsSyncing(false);
      }, 2000);
  };

  if (isOnline && pendingSyncs === 0 && !isSyncing) return null;

  return (
    <div className={`fixed bottom-4 left-4 z-[200] flex items-center space-x-3 px-4 py-3 rounded-xl shadow-lg transition-all duration-300 ${
        !isOnline ? 'bg-slate-900 text-white' : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
    }`}>
      <div className={`p-2 rounded-full ${!isOnline ? 'bg-red-500/20 text-red-400' : 'bg-blue-50 dark:bg-blue-900/20 text-ubuxa-blue'}`}>
         {!isOnline ? <WifiOff size={18} /> : isSyncing ? <RefreshCw size={18} className="animate-spin" /> : <Wifi size={18} />}
      </div>
      <div>
         <p className="text-xs font-bold uppercase tracking-wider">
             {!isOnline ? 'Offline Mode' : isSyncing ? 'Syncing Data...' : 'Connection Restored'}
         </p>
         <p className="text-[10px] opacity-80 font-medium">
             {!isOnline ? `${pendingSyncs} actions queued` : isSyncing ? 'Uploading local changes' : `Last synced: ${lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
         </p>
      </div>
    </div>
  );
};

export default OfflineIndicator;
