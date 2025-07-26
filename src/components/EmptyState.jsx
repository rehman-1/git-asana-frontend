import React from 'react'
import { Database, RefreshCw } from 'lucide-react'

const EmptyState = ({
    title = 'No data available',
    description = 'There is no data to display at the moment.',
    icon: Icon = Database,
    action = null,
    className = ''
}) => {
    return (
        <div className={`flex flex-col items-center justify-center p-12 text-center ${className}`}>
            <div className="bg-gray-100 rounded-full p-6 mb-4">
                <Icon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">
                {description}
            </p>
            {action && (
                <div>
                    {action}
                </div>
            )}
        </div>
    )
}

// Predefined empty states for common scenarios
export const NoDataState = ({ onReload }) => (
    <EmptyState
        title="No data available"
        description="We couldn't find any data to display. Try reloading or check your API connection."
        action={onReload && (
            <button
                onClick={onReload}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                <RefreshCw className="w-4 h-4" />
                Reload Data
            </button>
        )}
    />
)

export const NoCommitsState = () => (
    <EmptyState
        title="No commits found"
        description="No Git commits were found for the selected date range and developer filter."
        icon={() => (
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        )}
    />
)

export const NoTasksState = () => (
    <EmptyState
        title="No tasks found"
        description="No Asana tasks were found. Make sure your Asana integration is properly configured."
        icon={() => (
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
        )}
    />
)

export default EmptyState