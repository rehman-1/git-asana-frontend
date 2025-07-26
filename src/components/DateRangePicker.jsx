import React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Calendar } from 'lucide-react'

const DateRangePicker = ({ startDate, endDate, onChange }) => {
    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Date Range:</span>
            </div>

            <div className="flex items-center gap-2">
                <DatePicker
                    selected={startDate}
                    onChange={(date) => onChange({ startDate: date, endDate })}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholderText="Start Date"
                />

                <span className="text-gray-500">to</span>

                <DatePicker
                    selected={endDate}
                    onChange={(date) => onChange({ startDate, endDate: date })}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholderText="End Date"
                />
            </div>
        </div>
    )
}

export default DateRangePicker