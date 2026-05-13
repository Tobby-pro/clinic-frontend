// useAppointmentActions.ts
import { useState } from 'react';
import { updateAppointmentStatus } from '@/services/api';
import { toast } from 'react-hot-toast';

export const useAppointmentActions = (refreshData: () => void) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (id: number, status: 'CANCELLED' | 'COMPLETED') => {
    if (status === 'CANCELLED' && !confirm("Are you sure?")) return;
    
    setIsProcessing(true);
    try {
      await updateAppointmentStatus(id, status);
      toast.success(`Success: Appointment ${status}`);
      refreshData();
    } catch (err) {
      toast.error("Action failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return { 
    handleCancel: (id: number) => handleAction(id, 'CANCELLED'),
    handleComplete: (id: number) => handleAction(id, 'COMPLETED'),
    isProcessing 
  };
};