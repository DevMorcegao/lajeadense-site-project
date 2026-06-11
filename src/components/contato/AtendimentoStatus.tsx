"use client";

import { useEffect, useState } from 'react';

export default function AtendimentoStatus() {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const checkStatus = () => {
      try {
        const now = new Date();
        const parts = new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/Sao_Paulo',
          hour12: false,
          hour: 'numeric',
          minute: 'numeric',
          weekday: 'short'
        }).formatToParts(now);

        const getVal = (type: string) => parts.find(p => p.type === type)?.value || '';

        const weekday = getVal('weekday'); // 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
        const hour = parseInt(getVal('hour'), 10);
        const minute = parseInt(getVal('minute'), 10);

        const isWeekend = weekday === 'Sat' || weekday === 'Sun';
        const totalMinutes = hour * 60 + minute;

        const morningStart = 7 * 60 + 30; // 07:30
        const morningEnd = 12 * 60;       // 12:00
        const afternoonStart = 13 * 60 + 30; // 13:30
        const afternoonEnd = 17 * 60 + 40;   // 17:40

        const isOpenMorning = totalMinutes >= morningStart && totalMinutes < morningEnd;
        const isOpenAfternoon = totalMinutes >= afternoonStart && totalMinutes < afternoonEnd;

        setIsOpen(!isWeekend && (isOpenMorning || isOpenAfternoon));
      } catch (e) {
        // Fallback para o horário local do cliente caso falhe
        const now = new Date();
        const day = now.getDay();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const isWeekend = day === 0 || day === 6;
        const totalMinutes = hour * 60 + minute;
        
        const morningStart = 7 * 60 + 30;
        const morningEnd = 12 * 60;
        const afternoonStart = 13 * 60 + 30;
        const afternoonEnd = 17 * 60 + 40;

        const isOpenMorning = totalMinutes >= morningStart && totalMinutes < morningEnd;
        const isOpenAfternoon = totalMinutes >= afternoonStart && totalMinutes < afternoonEnd;

        setIsOpen(!isWeekend && (isOpenMorning || isOpenAfternoon));
      }
    };

    checkStatus();
    // Atualiza a cada 30 segundos
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isOpen === null) {
    return (
      <div className="flex items-center gap-2 text-xs font-body text-neutral-400">
        <span className="w-2.5 h-2.5 rounded-full bg-neutral-700 animate-pulse" />
        <span>Verificando horário de atendimento...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-[#161616]/60 border border-[#262626] rounded-full px-4 py-2 w-fit backdrop-blur-md">
      <div className="relative flex h-2.5 w-2.5">
        {isOpen && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOpen ? 'bg-emerald-500' : 'bg-rose-500'}`} />
      </div>
      <span className="text-xs font-medium font-body text-neutral-300">
        {isOpen ? (
          <>
            <span className="text-emerald-400 font-semibold">Aberto</span> para atendimento
          </>
        ) : (
          <>
            <span className="text-rose-500 font-semibold">Fechado</span> no momento
          </>
        )}
      </span>
    </div>
  );
}
