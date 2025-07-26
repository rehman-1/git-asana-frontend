import React from 'react'
import DataTable from 'react-data-table-component'
import { CheckCircle, Clock, AlertCircle, ExternalLink, User } from 'lucide-react'

const TaskTable = ({ data, isEffortsView = false }) => {
    const processedData = React.useMemo(() => {
        if (isEffortsView) {
            // Handle developer efforts data structure
            return data || []
        } else {
            // Handle Asana summary data structure
            if (!data || !data.developers) return []

            const tasks = []
            Object.entries(data.developers).forEach(([developerName, developerData]) => {
                // Add in-progress tasks
                if (developerData.in_progress) {
                    developerData.in_progress.forEach(task => {
                        tasks.push({
                            ...task,
                            status: 'In Progress',
                            developer: developerName
                        })
                    })
                }

                // Add done tasks
                if (developerData.done) {
                    developerData.done.forEach(task => {
                        tasks.push({
                            ...task,
                            status: 'Done',
                            developer: developerName
                        })
                    })
                }
            })

            return tasks
        }
    }, [data, isEffortsView])

    const getStatusIcon = (status, completed) => {
        if (completed || status?.toLowerCase() === 'done') {
            return <CheckCircle className="w-4 h-4 text-green-500" />
        } else if (status?.toLowerCase().includes('progress')) {
            return <Clock className="w-4 h-4 text-blue-500" />
        } else {
            return <AlertCircle className="w-4 h-4 text-yellow-500" />
        }
    }

    const getStatusBadge = (status, completed) => {
        const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"
        if (completed || status?.toLowerCase() === 'done') {
            return `${baseClasses} bg-green-100 text-green-800`
        } else if (status?.toLowerCase().includes('progress')) {
            return `${baseClasses} bg-blue-100 text-blue-800`
        } else {
            return `${baseClasses} bg-yellow-100 text-yellow-800`
        }
    }

    const columns = isEffortsView ? [
        {
            name: 'Task',
            selector: row => row.task_name,
            sortable: true,
            width: '300px',
            wrap: true,
            cell: row => (
                <div>
                    <div className="font-medium text-gray-900">{row.task_name}</div>
                    {row.url && (
                        <a
                            href={row.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 text-xs flex items-center gap-1 mt-1"
                        >
                            View in Asana <ExternalLink className="w-3 h-3" />
                        </a>
                    )}
                </div>
            )
        },
        {
            name: 'Developer',
            selector: row => row.assignee,
            sortable: true,
            width: '150px',
            cell: row => (
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{row.assignee}</span>
                </div>
            )
        },
        {
            name: 'Section',
            selector: row => row.section,
            sortable: true,
            width: '120px'
        },
        {
            name: 'Time Spent',
            selector: row => row.time_spent_minutes,
            sortable: true,
            width: '120px',
            cell: row => (
                <span className="font-medium">
                    {Math.round(row.time_spent_minutes / 60)}h {row.time_spent_minutes % 60}m
                </span>
            )
        },
        {
            name: 'Commits',
            selector: row => row.commit_count,
            sortable: true,
            width: '100px',
            cell: row => (
                <span className="font-semibold text-blue-600">
                    {row.commit_count}
                </span>
            )
        },
        {
            name: 'Lines Changed',
            selector: row => row.lines_added + row.lines_deleted,
            sortable: true,
            width: '130px',
            cell: row => (
                <div className="text-sm">
                    <span className="text-green-600">+{row.lines_added}</span>
                    <span className="text-red-600 ml-1">-{row.lines_deleted}</span>
                </div>
            )
        },
        {
            name: 'Analysis',
            selector: row => row.analysis,
            width: '250px',
            cell: row => (
                <div className="text-sm text-gray-600 truncate" title={row.analysis}>
                    {row.analysis}
                </div>
            )
        }
    ] : [
        {
            name: 'Task Name',
            selector: row => row.name,
            sortable: true,
            width: '300px',
            wrap: true,
            cell: row => (
                <div>
                    <div className="font-medium text-gray-900">{row.name}</div>
                    {row.url && (
                        <a
                            href={row.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 text-xs flex items-center gap-1 mt-1"
                        >
                            View in Asana <ExternalLink className="w-3 h-3" />
                        </a>
                    )}
                </div>
            )
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            cell: row => (
                <div className="flex items-center gap-2">
                    {getStatusIcon(row.status, row.completed)}
                    <span className={getStatusBadge(row.status, row.completed)}>
                        {row.status || (row.completed ? 'Done' : 'Unknown')}
                    </span>
                </div>
            ),
            width: '150px'
        },
        {
            name: 'Assignee',
            selector: row => row.assignee || row.developer,
            sortable: true,
            width: '150px',
            cell: row => (
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{row.assignee || row.developer}</span>
                </div>
            )
        },
        {
            name: 'Section',
            selector: row => row.section,
            sortable: true,
            width: '120px',
            cell: row => (
                <span className="text-sm text-gray-600">
                    {row.section}
                </span>
            )
        },
        {
            name: 'Task ID',
            selector: row => row.id,
            sortable: true,
            width: '120px',
            cell: row => (
                <span className="font-mono text-xs text-gray-500">
                    {row.id}
                </span>
            )
        }
    ]

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                    {isEffortsView ? 'Developer Efforts & Time Tracking' : 'Asana Tasks Overview'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                    {isEffortsView
                        ? 'Detailed breakdown of time spent and commits per task'
                        : 'Track task completion and progress across all developers'
                    }
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
                defaultSortFieldId={isEffortsView ? 4 : 1} // Sort by commits for efforts, task name for regular
                defaultSortAsc={false}
                noDataComponent={
                    <div className="p-8 text-center text-gray-500">
                        <p className="text-lg font-medium">
                            {isEffortsView ? 'No effort data available' : 'No tasks found'}
                        </p>
                        <p className="text-sm">
                            {isEffortsView
                                ? 'Load developer efforts data to see time tracking information'
                                : 'Make sure your Asana integration is working'
                            }
                        </p>
                    </div>
                }
            />
        </div>
    )
}

export default TaskTable