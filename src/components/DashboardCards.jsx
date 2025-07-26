import React from 'react'
import { GitCommit, CheckCircle, Users, Code, Clock, TrendingUp } from 'lucide-react'

const DashboardCards = ({ data }) => {
    // Extract metrics from the API data structure
    const totalCommits = data.gitReport?.count || data.gitReport?.commits?.length || 0
    const completedTasks = data.asanaSummary?.total_done || 0
    const inProgressTasks = data.asanaSummary?.total_in_progress || 0
    const totalTasks = completedTasks + inProgressTasks

    // Count unique developers from both Git and Asana data
    const gitDevelopers = new Set(data.gitReport?.commits?.map(commit => commit.developer) || [])
    const asanaDevelopers = new Set(Object.keys(data.asanaSummary?.developers || {}))
    const allDevelopers = new Set([...gitDevelopers, ...asanaDevelopers])
    const activeDevelopers = allDevelopers.size

    // Calculate total lines added from git commits
    const totalLinesAdded = data.gitReport?.commits?.reduce((sum, commit) =>
        sum + (commit.added || commit.lines_added || 0), 0) || 0

    // Calculate completion rate
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    const cards = [
        {
            title: 'Total Commits',
            value: totalCommits.toLocaleString(),
            icon: GitCommit,
            color: 'bg-blue-500',
            textColor: 'text-blue-600',
            subtitle: 'Git commits'
        },
        {
            title: 'Completed Tasks',
            value: completedTasks.toLocaleString(),
            icon: CheckCircle,
            color: 'bg-green-500',
            textColor: 'text-green-600',
            subtitle: `${completionRate}% completion rate`
        },
        {
            title: 'Active Developers',
            value: activeDevelopers,
            icon: Users,
            color: 'bg-purple-500',
            textColor: 'text-purple-600',
            subtitle: 'Contributing developers'
        },
        {
            title: 'Lines Added',
            value: totalLinesAdded.toLocaleString(),
            icon: Code,
            color: 'bg-orange-500',
            textColor: 'text-orange-600',
            subtitle: 'Code additions'
        },
        {
            title: 'In Progress',
            value: inProgressTasks.toLocaleString(),
            icon: Clock,
            color: 'bg-yellow-500',
            textColor: 'text-yellow-600',
            subtitle: 'Active tasks'
        },
        {
            title: 'Total Tasks',
            value: totalTasks.toLocaleString(),
            icon: TrendingUp,
            color: 'bg-indigo-500',
            textColor: 'text-indigo-600',
            subtitle: 'All Asana tasks'
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {cards.map((card, index) => {
                const Icon = card.icon
                return (
                    <div key={index} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                                <p className={`text-2xl font-bold ${card.textColor} mt-1`}>
                                    {card.value}
                                </p>
                                {card.subtitle && (
                                    <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                                )}
                            </div>
                            <div className={`${card.color} p-3 rounded-lg flex-shrink-0`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default DashboardCards