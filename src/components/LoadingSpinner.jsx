import React from 'react'
import { RefreshCw } from 'lucide-react'

const LoadingSpinner = ({ size = 'md', text = 'Loading...', className = '' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12'
    }

    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl'
    }

    return (
        <div className={`flex items-center justify-center gap-3 ${className}`}>
            <RefreshCw className={`${sizeClasses[size]} animate-spin text-blue-600`} />
            <span className={`${textSizeClasses[size]} text-gray-600 font-medium`}>
                {text}
            </span>
        </div>
    )
}

export default LoadingSpinner