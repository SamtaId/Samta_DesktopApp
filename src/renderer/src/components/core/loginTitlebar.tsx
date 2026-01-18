import React from 'react'

interface LoginTitlebarProps {
  title?: string
}

export const LoginTitlebar: React.FC<LoginTitlebarProps> = ({ title }) => {
  return (
    <div className="flex items-center justify-center px-4 py-2 bg-slate-200 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 select-none">
      <span className="font-bold text-lg">{title || 'Samta Desktop Login'}</span>
    </div>
  )
}
