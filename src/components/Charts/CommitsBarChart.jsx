import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const CommitsBarChart = ({ data, selectedDeveloper }) => {
    console.log({ data })
    // Process data for chart
    const processedData = React.useMemo(() => {
        if (!data || data.length === 0) return []

        const filteredData = selectedDeveloper === 'all'
            ? data
            : data.filter(commit => commit.developer === selectedDeveloper)

        // Group by developer
        const groupedByDev = filteredData.reduce((acc, commit) => {
            const developer = commit.developer || 'Unknown'
            if (!acc[developer]) {
                acc[developer] = {
                    name: developer.length > 15 ? developer.substring(0, 15) + '...' : developer,
                    fullName: developer,
                    commits: 0,
                    added: 0,
                    deleted: 0,
                    files: 0
                }
            }
            acc[developer].commits += 1
            acc[developer].added += commit.added || 0
            acc[developer].deleted += commit.deleted || 0
            acc[developer].files += commit.files || 0
            return acc
        }, {})

        return Object.values(groupedByDev).sort((a, b) => b.commits - a.commits)
    }, [data, selectedDeveloper])

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-900 mb-2">{data.fullName}</p>
                    <div className="space-y-1 text-sm">
                        <p className="text-blue-600">Commits: <span className="font-medium">{data.commits}</span></p>
                        <p className="text-green-600">Lines Added: <span className="font-medium">{data.added.toLocaleString()}</span></p>
                        <p className="text-red-600">Lines Deleted: <span className="font-medium">{data.deleted.toLocaleString()}</span></p>
                        <p className="text-purple-600">Files Changed: <span className="font-medium">{data.files}</span></p>
                    </div>
                </div>
            )
        }
        return null
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Git Commits by Developer
                </h3>
                <div className="text-sm text-gray-600">
                    {selectedDeveloper === 'all' ? 'All Developers' : selectedDeveloper}
                </div>
            </div>

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
                            <Bar dataKey="commits" fill="#3b82f6" name="Commits" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                        <p className="text-lg font-medium">No commit data available</p>
                        <p className="text-sm">Load Git data to see commit statistics</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CommitsBarChart