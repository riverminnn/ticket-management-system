import React from 'react';

export default function Timeline({ items }) {
    return (
        <div className="relative">
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                const isCompleted = item.completed;
                const isCurrent = item.current;
                const isInactive = !isCompleted && !isCurrent;

                return (
                    <div key={index} className="flex gap-3.5 last:pb-0">
                        {/* Timeline track */}
                        <div className="relative flex flex-col items-center">
                            {/* Status circle */}
                            <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center ${
                                isCompleted
                                    ? 'bg-blue-600 shadow-sm'
                                    : isCurrent
                                        ? 'bg-blue-600 shadow-sm'
                                        : 'bg-white border-2 border-gray-300'
                            }`}>
                                {isCompleted ? (
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : isCurrent ? (
                                    <div className="w-3.5 h-3.5 rounded-full bg-white"></div>
                                ) : (
                                    <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-300"></div>
                                )}
                            </div>

                            {/* Connecting line */}
                            {!isLast && (
                                <div
                                    className={`w-0.5 flex-grow ${
                                        isCompleted ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}
                                    style={{ minHeight: '48px' }}
                                />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 -mt-0.5">
                            <h4 className={`font-semibold text-sm mb-1.5 ${
                                isInactive ? 'text-gray-400' : 'text-gray-900'
                            }`}>
                                {item.status}
                            </h4>
                            <div className={`text-xs leading-5 ${
                                isInactive ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                                <p>Ngày: {item.date}</p>
                                <p>Thực hiện: {item.executor}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}