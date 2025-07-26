import React from 'react'
import DataTable from 'react-data-table-component'
import { CheckCircle, XCircle, AlertTriangle, ExternalLink, User, GitCommit } from 'lucide-react'

const TaskVsCommitsTable = ({ gitData, asanaData, effortsData }) => {
    const processedData = React.useMemo(() => {
        if (!asanaData || !asanaData.developers) return []

        const comparisonData = []

        // Process Asana tasks and match with Git commits
        Object.entries(asanaData.developers).forEach(([developerName, developerData]) => {
            const allTasks = [
                ...(developerData.in_progress || []).map(task => ({ ...task, status: 'In Progress' })),
                ...(developerData.done || []).map(task => ({ ...task, status: 'Done' }))
            ]

            allTasks.forEach(task => {
                // Find related commits by developer
                const relatedCommits = gitData?.filter(commit =>
                    commit.developer === developerName
                ) || []

                // Find effort data for this specific task
                const effortInfo = effortsData?.find(effort =>
                    effort.task_id === task.id || effort.assignee === developerName
                )

                // Calculate metrics from commits
                const totalCommits = relatedCommits.length
                const totalLinesAdded = relatedCommits.reduce((sum, commit) => sum + (commit.added || 0), 0)
                const totalLinesDeleted = relatedCommits.reduce((sum, commit) => sum + (commit.deleted || 0), 0)
                const filesChanged = relatedCommits.reduce((sum, commit) => sum + (commit.files || 0), 0)

                // Determine completion status
                const isTaskCompleted = task.completed || task.status?.toLowerCase() === 'done'
                const hasCommits = totalCommits > 0

                let completionStatus = 'unknown'
                let statusScore = 0

                if (isTaskCompleted && hasCommits) {
                    completionStatus = 'completed_with_commits'
                    statusScore = 4
                } else if (isTaskCompleted && !hasCommits) {
                    completionStatus = 'completed_no_commits'
                    statusScore = 3
                } else if (!isTaskCompleted && hasCommits) {
                    completionStatus = 'in_progress_with_commits'
                    statusScore = 2
                } else {
                    completionStatus = 'no_activity'
                    statusScore = 1
                }

                comparisonData.push({
                    task_id: task.id,
                    task_name: task.name,
                    task_url: task.url,
                    assignee: task.assignee || developerName,
                    task_status: task.status,
                    section: task.section,
                    estimated_hours: effortInfo?.time_spent_minutes ? Math.round(effortInfo.time_spent_minutes / 60) : 0,
                    actual_hours: effortInfo?.time_spent_minutes ? Math.round(effortInfo.time_spent_minutes / 60) : 0,
                    commits: totalCommits,
                    lines_added: totalLinesAdded,
                    lines_deleted: totalLinesDeleted,
                    files_changed: filesChanged,
                    completion_status: completionStatus,
                    status_score: statusScore,
                    first_commit: relatedCommits.length > 0 ? relatedCommits[0].timestamp : null,
                    last_commit: relatedCommits.length > 0 ? relatedCommits[relatedCommits.length - 1].timestamp : null
                })
            })
        })

        return comparisonData.sort((a, b) => b.status_score - a.status_score)
    }, [gitData, asanaData, effortsData])

    const getCompletionIcon = (status) => {
        switch (status) {
            case 'completed_with_commits':
                return <CheckCircle className="w-4 h-4 text-green-500" />
            case 'completed_no_commits':
                return <AlertTriangle className="w-4 h-4 text-yellow-500" />
            case 'in_progress_with_commits':
                return <GitCommit className="w-4 h-4 text-blue-500" />
            default:
                return <XCircle className="w-4 h-4 text-red-500" />
        }
    }

    const getCompletionBadge = (status) => {
        const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"
        switch (status) {
            case 'completed_with_commits':
                return `${baseClasses} bg-green-100 text-green-800`
            case 'completed_no_commits':
                return `${baseClasses} bg-yellow-100 text-yellow-800`
            case 'in_progress_with_commits':
                return `${baseClasses} bg-blue-100 text-blue-800`
            default:
                return `${baseClasses} bg-red-100 text-red-800`
        }
    }

    const getCompletionText = (status) => {
        switch (status) {
            case 'completed_with_commits':
                return 'Completed ✓'
            case 'completed_no_commits':
                return 'Done (No Code)'
            case 'in_progress_with_commits':
                return 'Active Development'
            default:
                return 'No Activity'
        }
    }

    const columns = [
        {
            name: 'Task',
            selector: row => row.task_name,
            sortable: true,
            width: '280px',
            wrap: true,
            cell: row => (
                <div>
                    <div className="font-medium text-gray-900">{row.task_name}</div>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-xs text-gray-500">{row.task_id}</span>
                        {row.task_url && (
                            <a
                                href={row.task_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700"
                            >
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        )}
                    </div>
                </div>
            )
        },
        {
            name: 'Developer',
            selector: row => row.assignee,
            sortable: true,
            width: '140px',
            cell: row => (
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{row.assignee}</span>
                </div>
            )
        },
        {
            name: 'Alignment Status',
            selector: row => row.completion_status,
            sortable: true,
            cell: row => (
                <div className="flex items-center gap-2">
                    {getCompletionIcon(row.completion_status)}
                    <span className={getCompletionBadge(row.completion_status)}>
                        {getCompletionText(row.completion_status)}
                    </span>
                </div>
            ),
            width: '180px'
        },
        {
            name: 'Section',
            selector: row => row.section,
            sortable: true,
            width: '120px',
            cell: row => (
                <span className="text-xs text-gray-600 truncate" title={row.section}>
                    {row.section}
                </span>
            )
        },
        {
            name: 'Time (hrs)',
            selector: row => row.actual_hours,
            sortable: true,
            width: '100px',
            cell: row => (
                <span className="font-medium">
                    {row.actual_hours > 0 ? `${row.actual_hours}h` : 'N/A'}
                </span>
            )
        },
        {
            name: 'Commits',
            selector: row => row.commits,
            sortable: true,
            width: '80px',
            cell: row => (
                <span className={`font-semibold ${row.commits > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                    {row.commits}
                </span>
            )
        },
        {
            name: 'Lines +/-',
            selector: row => row.lines_added + row.lines_deleted,
            sortable: true,
            width: '100px',
            cell: row => (
                <div className="text-xs">
                    <span className="text-green-600">+{row.lines_added}</span>
                    <br />
                    <span className="text-red-600">-{row.lines_deleted}</span>
                </div>
            )
        },
        {
            name: 'Files',
            selector: row => row.files_changed,
            sortable: true,
            width: '70px',
            cell: row => (
                <span className={row.files_changed > 0 ? 'text-gray-900' : 'text-gray-400'}>
                    {row.files_changed}
                </span>
            )
        }
    ]

    // Calculate summary stats
    const totalTasks = processedData.length
    const completedWithCommits = processedData.filter(t => t.completion_status === 'completed_with_commits').length
    const completedNoCommits = processedData.filter(t => t.completion_status === 'completed_no_commits').length
    const inProgressWithCommits = processedData.filter(t => t.completion_status === 'in_progress_with_commits').length
    const noActivity = processedData.filter(t => t.completion_status === 'no_activity').length

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                            <p className="text-sm font-medium text-green-800">Completed & Coded</p>
                            <p className="text-2xl font-bold text-green-600">{completedWithCommits}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <div>
                            <p className="text-sm font-medium text-yellow-800">Done (No Code)</p>
                            <p className="text-2xl font-bold text-yellow-600">{completedNoCommits}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <GitCommit className="w-5 h-5 text-blue-600" />
                        <div>
                            <p className="text-sm font-medium text-blue-800">Active Development</p>
                            <p className="text-2xl font-bold text-blue-600">{inProgressWithCommits}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <div>
                            <p className="text-sm font-medium text-red-800">No Activity</p>
                            <p className="text-2xl font-bold text-red-600">{noActivity}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Task vs Commit Analysis
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Compare Asana tasks with actual Git commits to track development alignment
                    </p>
                </div>
                <DataTable
                    columns={columns}
                    data={processedData}
                    pagination
                    paginationPerPage={15}
                    paginationRowsPerPageOptions={[15, 30, 50]}
                    highlightOnHover
                    striped
                    responsive
                    defaultSortFieldId={3} // Sort by alignment status
                    defaultSortAsc={false}
                    noDataComponent={
                        <div className="p-8 text-center text-gray-500">
                            <p className="text-lg font-medium">No comparison data available</p>
                            <p className="text-sm">Ensure both Git and Asana data are loaded to see task alignment</p>
                        </div>
                    }
                />
            </div>
        </div>
    )
}

export default TaskVsCommitsTable