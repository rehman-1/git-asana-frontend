import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const TaskStatusChart = ({ data }) => {
    const chartData = React.useMemo(() => {
        if (!data || !data.total_in_progress && !data.total_done) {
            return []
        }

        return [
            {
                name: 'In Progress',
                value: data.total_in_progress || 0,
                color: '#3b82f6'
            },
            {
                name: 'Done',
                value: data.total_done || 0,
                color: '#10b981'
            }
        ]
    }, [data])

    const COLORS = {
        'In Progress': '#3b82f6',
        'Done': '#10b981'
    }

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        if (percent < 0.05) return null // Don't show label if less than 5%

        const RADIAN = Math.PI / 180
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5
        const x = cx + radius * Math.cos(-midAngle * RADIAN)
        const y = cy + radius * Math.sin(-midAngle * RADIAN)

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize="12"
                fontWeight="bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        )
    }

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0]
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-900">{data.name}</p>
                    <p className="text-sm text-gray-600">
                        Tasks: <span className="font-medium">{data.value}</span>
                    </p>
                </div>
            )
        }
        return null
    }

    const total = (data?.total_in_progress || 0) + (data?.total_done || 0)

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Task Status Distribution
                </h3>
                <div className="text-sm text-gray-600">
                    Total: {total} tasks
                </div>
            </div>

            {total > 0 ? (
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                formatter={(value, entry) => (
                                    <span style={{ color: entry.color }}>
                                        {value} ({entry.payload.value})
                                    </span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                        <p className="text-lg font-medium">No task data available</p>
                        <p className="text-sm">Load Asana data to see task distribution</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TaskStatusChart