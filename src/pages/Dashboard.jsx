import React, { useState, useEffect } from 'react'
import { RefreshCw, AlertCircle } from 'lucide-react'
import DashboardCards from '../components/DashboardCards'
import DateRangePicker from '../components/DateRangePicker'
import Tabs from '../components/Tabs'
import CommitsBarChart from '../components/Charts/CommitsBarChart'
import DeveloperStatsChart from '../components/Charts/DeveloperStatsChart'
import TaskStatusChart from '../components/Charts/TaskStatusChart'
import DeveloperTable from '../components/DeveloperTable'
import TaskTable from '../components/TaskTable'
import TaskVsCommitsTable from '../components/TaskVsCommitsTable'
import {
    getGitReport,
    getAsanaSummary,
    getDeveloperEfforts,
    getDeveloperSummary,
    getAnalytics,
    reloadAll
} from '../api/apiClient'

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('overview')
    const [dateRange, setDateRange] = useState({
        startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 days ago
        endDate: new Date()
    })
    const [selectedDeveloper, setSelectedDeveloper] = useState('all')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [data, setData] = useState({
        gitReport: { commits: [], count: 0 },
        asanaSummary: { developers: {}, total_in_progress: 0, total_done: 0 },
        developerEfforts: [],
        developerSummary: {},
        analytics: null
    })

    const fetchData = async () => {
        setLoading(true)
        setError(null)
        try {
            const startDate = dateRange.startDate.toISOString().split('T')[0]
            const endDate = dateRange.endDate.toISOString().split('T')[0]

            const [gitRes, asanaRes, effortsRes, summaryRes, analyticsRes] = await Promise.allSettled([
                getGitReport(startDate, endDate),
                getAsanaSummary(),
                getDeveloperEfforts(startDate, endDate),
                getDeveloperSummary(startDate, endDate),
                getAnalytics(startDate, endDate)
            ])

            setData({
                gitReport: gitRes.status === 'fulfilled' ? gitRes.value.data : { commits: [], count: 0 },
                asanaSummary: asanaRes.status === 'fulfilled' ? asanaRes.value.data : { developers: {}, total_in_progress: 0, total_done: 0 },
                developerEfforts: effortsRes.status === 'fulfilled' ? effortsRes.value.data : [],
                developerSummary: summaryRes.status === 'fulfilled' ? summaryRes.value.data : {},
                analytics: analyticsRes.status === 'fulfilled' ? analyticsRes.value.data : null
            })

            // Check for any failed requests
            const failedRequests = [gitRes, asanaRes, effortsRes, summaryRes, analyticsRes]
                .filter(res => res.status === 'rejected')

            if (failedRequests.length > 0) {
                console.warn('Some API requests failed:', failedRequests.map(r => r.reason))
                setError(`${failedRequests.length} API request(s) failed. Some data may be incomplete.`)
            }

        } catch (error) {
            console.error('Error fetching data:', error)
            setError('Failed to fetch data. Please check your API connection.')
            setData({
                gitReport: { commits: [], count: 0 },
                asanaSummary: { developers: {}, total_in_progress: 0, total_done: 0 },
                developerEfforts: [],
                developerSummary: {},
                analytics: null
            })
        } finally {
            setLoading(false)
        }
    }

    const handleReloadAll = async () => {
        setLoading(true)
        setError(null)
        try {
            const reloadRes = await reloadAll()
            console.log('Reload result:', reloadRes.data)
            await fetchData()
        } catch (error) {
            console.error('Error reloading data:', error)
            setError('Failed to reload data. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [dateRange])

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'commits', label: 'Git Analysis' },
        { id: 'tasks', label: 'Asana Tasks' },
        { id: 'efforts', label: 'Developer Efforts' },
        { id: 'comparison', label: 'Task vs Commits' }
    ]

    // Extract developers from git data and asana data
    const gitDevelopers = data.gitReport.commits?.map(commit => commit.developer) || []
    const asanaDevelopers = Object.keys(data.asanaSummary.developers || {})
    const allDevelopers = [...new Set([...gitDevelopers, ...asanaDevelopers])]
    const developers = ['all', ...allDevelopers]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Git-Asana Developer Analytics
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Track developer productivity and task completion across Git and Asana
                            </p>
                        </div>
                        <button
                            onClick={handleReloadAll}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Reload Data
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                        <p className="text-yellow-800">{error}</p>
                        <button
                            onClick={() => setError(null)}
                            className="ml-auto text-yellow-600 hover:text-yellow-800"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
                    <DateRangePicker
                        startDate={dateRange.startDate}
                        endDate={dateRange.endDate}
                        onChange={setDateRange}
                    />

                    <select
                        value={selectedDeveloper}
                        onChange={(e) => setSelectedDeveloper(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        {developers.map(dev => (
                            <option key={dev} value={dev}>
                                {dev === 'all' ? 'All Developers' : dev}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tabs */}
                <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

                {/* Loading Overlay */}
                {loading && (
                    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 flex items-center gap-3">
                            <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                            <span className="text-gray-900">Loading data...</span>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="mt-6">
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <DashboardCards data={data} />
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <CommitsBarChart data={data.gitReport.commits} selectedDeveloper={selectedDeveloper} />
                                <TaskStatusChart data={data.asanaSummary} />
                            </div>
                            <DeveloperStatsChart data={data.analytics?.developer_summary || {}} />
                        </div>
                    )}

                    {activeTab === 'commits' && (
                        <div className="space-y-6">
                            <CommitsBarChart data={data.gitReport.commits} selectedDeveloper={selectedDeveloper} />
                            <DeveloperTable data={data.gitReport.commits} selectedDeveloper={selectedDeveloper} />
                        </div>
                    )}

                    {activeTab === 'tasks' && (
                        <div className="space-y-6">
                            <TaskStatusChart data={data.asanaSummary} />
                            <TaskTable data={data.asanaSummary} />
                        </div>
                    )}

                    {activeTab === 'efforts' && (
                        <div className="space-y-6">
                            <TaskTable data={data.developerEfforts} isEffortsView={true} />
                        </div>
                    )}

                    {activeTab === 'comparison' && (
                        <TaskVsCommitsTable
                            gitData={data.gitReport.commits}
                            asanaData={data.asanaSummary}
                            effortsData={data.developerEfforts}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard