import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const DeveloperStatsChart = ({ data }) => {
    const processedData = React.useMemo(() => {
        if (!data || typeof data !== 'object') return []

        return Object.entries(data).map(([developerName, stats]) => ({
            name: developerName.length > 12 ? developerName.substring(0, 12) + '...' : developerName,
            fullName: developerName,
            inProgress: stats.in_progress_tasks?.length || 0,
            done: stats.done_tasks?.length || 0,
            commits: stats.commit_count || 0,
            linesAdded: stats.lines_added || 0,
            linesDeleted: stats.lines_deleted || 0,
            filesChanged: stats.files_changed || 0
        })).filter(dev => dev.inProgress > 0 || dev.done > 0 || dev.commits > 0)
    }, [data])

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-900 mb-2">{data.fullName}</p>
                    <div className="space-y-1 text-sm">
                        <p className="text-green-600">Done Tasks: <span className="font-medium">{data.done}</span></p>
                        <p className="text-blue-600">In Progress: <span className="font-medium">{data.inProgress}</span></p>
                        <p className="text-purple-600">Commits: <span className="font-medium">{data.commits}</span></p>
                        <p className="text-orange-600">Lines Added: <span className="font-medium">{data.linesAdded.toLocaleString()}</span></p>
                    </div>
                </div>
            )
        }
        return null
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Developer Performance Overview
            </h3>

            {processedData.length > 0 ? (
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={processedData} margin={{ bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="name"
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                fontSize={12}
                            />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="done" fill="#10b981" name="Done Tasks" />
                            <Bar dataKey="inProgress" fill="#3b82f6" name="In Progress" />
                            <Bar dataKey="commits" fill="#8b5cf6" name="Commits" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                        <p className="text-lg font-medium">No developer data available</p>
                        <p className="text-sm">Load analytics data to see developer performance</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DeveloperStatsChart