"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ScheduleProductionForm } from "./schedule-production-form";

interface ProductionCalendarProps {
    schedule: any[];
    onDateChange: (date: Date) => void;
    onDataChange: () => void;
}

export function ProductionCalendar({ schedule, onDateChange, onDataChange }: ProductionCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleMonthChange = (amount: number) => {
    setCurrentDate(prev => {
        const newDate = new Date(prev);
        newDate.setMonth(newDate.getMonth() + amount);
        return newDate;
    });
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() === 0) ? 6 : firstDay.getDay() - 1; // Lunes = 0

    const days = Array(startingDayOfWeek).fill(null);
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    return days
  }
  
  const getProductionForDay = (day: number) => {
    return null; 
  };

  const handleDateClick = (day: number) => {
      const newDate = new Date(currentDate);
      newDate.setDate(day);
      onDateChange(newDate);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Calendario</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleMonthChange(-1)}><ChevronLeft className="h-4 w-4" /></Button>
            <span className="text-sm font-medium capitalize w-32 text-center">{currentDate.toLocaleString("es", { month: "long", year: "numeric" })}</span>
            <Button variant="outline" size="sm" onClick={() => handleMonthChange(1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-muted-foreground">
            <div>Lun</div><div>Mar</div><div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div><div>Dom</div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth().map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="h-20"></div>
              }
              const production = getProductionForDay(day);
              const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();

              return (
                <div key={day} onClick={() => handleDateClick(day)} className={`cursor-pointer h-20 p-1 border rounded-md transition-colors hover:bg-accent ${isToday ? "bg-primary/10 border-primary" : "border-border"}`}>
                  <div className="text-sm font-medium">{day}</div>
                  {production && (
                    <div className="space-y-1 mt-1">
                      {/* Lógica para mostrar items */}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          
          <ScheduleProductionForm onProductionScheduled={onDataChange} />
          
        </div>
      </CardContent>
    </Card>
  )
}