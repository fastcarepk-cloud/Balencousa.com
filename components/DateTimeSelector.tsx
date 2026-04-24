"use client"
import { Calendar, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface DateTimeSelectorProps {
  selectedDate: string
  selectedTime: string
  onDateChange: (date: string) => void
  onTimeChange: (time: string) => void
}

export default function DateTimeSelector({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
}: DateTimeSelectorProps) {
  // Generate next 7 days
  const generateDates = () => {
    const dates = []
    const today = new Date()

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
      const dayName = dayNames[date.getDay()]
      const dayNumber = date.getDate()
      const fullDate = date.toISOString().split("T")[0] // YYYY-MM-DD format

      dates.push({
        dayName,
        dayNumber,
        fullDate,
        isToday: i === 0,
      })
    }

    return dates
  }

  const availableTimes = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
  ]

  const dates = generateDates()

  return (
    <div className="space-y-4 md:space-y-6 pb-6">
      <div className="text-center mb-4 md:mb-6">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Select Date & Time</h3>
        <p className="text-gray-600 text-sm md:text-base">Choose your preferred appointment slot</p>
      </div>

      {/* Date Selection */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 mb-3 md:mb-4">
          <Calendar className="w-4 h-4 md:w-5 md:h-5 text-pink-500" />
          <h4 className="font-semibold text-gray-900 text-sm md:text-base">Available Dates</h4>
        </div>

        {/* Responsive date grid - 3 columns on mobile, all dates on desktop */}
        <div className="grid grid-cols-3 gap-2 md:flex md:space-x-2 md:gap-0">
          {dates.map((date) => (
            <button
              key={date.fullDate}
              onClick={() => onDateChange(date.fullDate)}
              className={`flex flex-col items-center p-2 md:p-3 rounded-lg border-2 transition-all duration-200 min-h-[60px] md:min-w-[70px] ${
                selectedDate === date.fullDate
                  ? "border-pink-500 bg-pink-500 text-white shadow-lg"
                  : "border-gray-200 bg-white text-gray-700 hover:border-pink-300 hover:bg-pink-50"
              }`}
            >
              <span className="text-xs font-medium mb-1">{date.dayName}</span>
              <span className="text-sm md:text-lg font-bold">{date.dayNumber}</span>
              {date.isToday && <span className="text-xs mt-1 opacity-75">Today</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 mb-3 md:mb-4">
            <Clock className="w-4 h-4 md:w-5 md:h-5 text-pink-500" />
            <h4 className="font-semibold text-gray-900 text-sm md:text-base">Available Times</h4>
          </div>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
            {availableTimes.map((time) => (
              <Button
                key={time}
                type="button"
                variant={selectedTime === time ? "default" : "outline"}
                onClick={() => onTimeChange(time)}
                className={`h-10 md:h-12 text-xs md:text-sm font-medium transition-all duration-200 ${
                  selectedTime === time
                    ? "bg-pink-500 hover:bg-pink-600 text-white shadow-lg"
                    : "border-2 border-gray-200 hover:border-pink-300 hover:bg-pink-50 bg-white text-gray-700"
                }`}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Summary */}
      {selectedDate && selectedTime && (
        <Card className="bg-pink-50 border-pink-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">Selected Appointment</h5>
                <p className="text-xs md:text-sm text-gray-600">
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  at {selectedTime}
                </p>
              </div>
              <div className="text-pink-600">
                <Calendar className="w-5 h-5 md:w-6 md:h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
