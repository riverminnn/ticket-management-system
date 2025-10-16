import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCircle } from '@fortawesome/free-solid-svg-icons';

interface TimelineItem {
    id?: string;
    status: string;
    date: string;
    executor: string;
    completed: boolean;
    current?: boolean;
}

interface TimelineProps {
    readonly items: readonly TimelineItem[];
}

export default function Timeline({ items }: TimelineProps) {
    const getCircleClasses = (isCompleted: boolean, isCurrent: boolean | undefined) => {
        if (isCompleted) return 'bg-blue-600 shadow-md';
        if (isCurrent) return 'bg-blue-600 shadow-md ring-4 ring-blue-100';
        return 'bg-white border-2 border-gray-300';
    };

    const getCircleIcon = (isCompleted: boolean, isCurrent: boolean | undefined) => {
        if (isCompleted) {
            return <FontAwesomeIcon icon={faCheck} className="text-white text-sm" />;
        }
        if (isCurrent) {
            return <div className="w-3.5 h-3.5 rounded-full bg-white"></div>;
        }
        return <FontAwesomeIcon icon={faCircle} className="text-gray-400 text-xs" />;
    };

    return (
        <div className="relative">
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                const isCompleted = item.completed;
                const isCurrent = item.current;
                const isInactive = !isCompleted && !isCurrent;
                const itemKey = item.id || `timeline-${index}`;

                return (
                    <div key={itemKey} className="flex gap-3.5 last:pb-0">
                        {/* Timeline track */}
                        <div className="relative flex flex-col items-center">
                            {/* Status circle */}
                            <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                                getCircleClasses(isCompleted, isCurrent)
                            }`}>
                                {getCircleIcon(isCompleted, isCurrent)}
                            </div>

                            {/* Connecting line */}
                            {!isLast && (
                                <div
                                    className={`w-0.5 flex-grow transition-all ${
                                        isCompleted ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}
                                    style={{ minHeight: '48px' }}
                                />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 -mt-0.5 pb-6">
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
