import React from 'react'
import DataTable from 'react-data-table-component'
import { ExternalLink } from 'lucide-react'

const DeveloperTable = ({ data, selectedDeveloper }) => {
    const processedData = React.useMemo(() => {
        if (!data || data.length === 0) return []

        const filteredCommits = selectedDeveloper === 'all'
            ? data
            : data.filter(commit => commit.developer === selectedDeveloper)

        // Group by developer
        const groupedByDev = filteredCommits.reduce((acc, commit) => {
            const developer = commit.developer || 'Unknown'
            if (!acc[developer]) {
                acc[developer] = {
                    developer: developer,
                    commits: 0,
                    added: 0,
                    deleted: 0,
                    files: 0,
                    repos: new Set(),
                    last_commit: null,
                    last_commit_message: '',
                    last_commit_link: ''
                }
            }
            acc[developer].commits += 1
            acc[developer].added += commit.added || 0
            acc[developer].deleted += commit.deleted || 0
            acc[developer].files += commit.files || 0
            acc[developer].repos.add(commit.repo)

            // Track the most recent commit
            const commitTimestamp = commit.timestamp * 1000 // Convert to milliseconds
            if (!acc[developer].last_commit || commitTimestamp > acc[developer].last_commit) {
                acc[developer].last_commit = commitTimestamp
                acc[developer].last_commit_message = commit.message
                acc[developer].last_commit_link = commit.link
            }

            return acc
        }, {})

        // Convert Set to array length and format data
        return Object.values(groupedByDev).map(dev => ({
            ...dev,
            repos: dev.repos.size,
            last_commit_date: dev.last_commit ? new Date(dev.last_commit) : null
        })).sort((a, b) => b.commits - a.commits)
    }, [data, selectedDeveloper])

    const columns = [
        {
            name: 'Developer',
            selector: row => row.developer,
            sortable: true,
            width: '180px',
            cell: row => (
                <div className="font-medium text-gray-900">
                    {row.developer}
                </div>
            )
        },
        {
            name: 'Commits',
            selector: row => row.commits,
            sortable: true,
            width: '100px',
            cell: row => (
                <span className="font-semibold text-blue-600">
                    {row.commits}
                </span>
            )
        },
        {
            name: 'Lines Added',
            selector: row => row.added,
            sortable: true,
            format: row => row.added.toLocaleString(),
            width: '120px',
            cell: row => (
                <span className="text-green-600 font-medium">
                    +{row.added.toLocaleString()}
                </span>
            )
        },
        {
            name: 'Lines Deleted',
            selector: row => row.deleted,
            sortable: true,
            format: row => row.deleted.toLocaleString(),
            width: '120px',
            cell: row => (
                <span className="text-red-600 font-medium">
                    -{row.deleted.toLocaleString()}
                </span>
            )
        },
        {
            name: 'Files',
            selector: row => row.files,
            sortable: true,
            width: '80px'
        },
        {
            name: 'Repos',
            selector: row => row.repos,
            sortable: true,
            width: '80px'
        },
        {
            name: 'Last Commit',
            selector: row => row.last_commit_date,
            sortable: true,
            width: '120px',
            cell: row => (
                <div className="text-sm">
                    {row.last_commit_date ? row.last_commit_date.toLocaleDateString() : 'N/A'}
                </div>
            )
        },
        {
            name: 'Last Message',
            selector: row => row.last_commit_message,
            width: '250px',
            cell: row => (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 truncate" title={row.last_commit_message}>
                        {row.last_commit_message || 'N/A'}
                    </span>
                    {row.last_commit_link && (
                        <a
                            href={row.last_commit_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                </div>
            )
        }
    ]

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                    Developer Commit Summary
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                    Detailed breakdown of Git commits by developer
                </p>
            </div>
            <DataTable
                columns={columns}
                data={processedData}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 20, 50]}
                highlightOnHover
                striped
                responsive
                noDataComponent={
                    <div className="p-8 text-center text-gray-500">
                        <p className="text-lg font-medium">No commit data available</p>
                        <p className="text-sm">Load Git data to see developer statistics</p>
                    </div>
                }
            />
        </div>
    )
}

export default DeveloperTable