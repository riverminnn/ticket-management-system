import {useState} from 'react';
import {StatusDropdown, ResourceDropdown, ImplementationDropdown} from './Dropdowns';
import {NotificationModal, AssignmentModal, RejectModal} from './Modals';

export default function DropdownDemo() {
    const [status, setStatus] = useState('da-tiep-nhan');
    const [resource, setResource] = useState('Network');
    const [implementation, setImplementation] = useState('Cập nhật dữ liệu');

    const [showNotification, setShowNotification] = useState(false);
    const [showAssignment, setShowAssignment] = useState(false);
    const [showReject, setShowReject] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Component Demo</h1>

                {/* Dropdowns Section */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-6">Dropdowns</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatusDropdown value={status} onChange={setStatus}/>
                        <ResourceDropdown value={resource} onChange={setResource}/>
                        <ImplementationDropdown value={implementation} onChange={setImplementation}/>
                    </div>
                </div>

                {/* Modals Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-6">Modals</h2>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => setShowNotification(true)}
                            className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 font-medium"
                        >
                            Show Notification
                        </button>
                        <button
                            onClick={() => setShowAssignment(true)}
                            className="bg-blue-900 text-white px-6 py-3 rounded hover:bg-blue-800 font-medium"
                        >
                            Show Assignment Modal
                        </button>
                        <button
                            onClick={() => setShowReject(true)}
                            className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 font-medium"
                        >
                            Show Reject Modal
                        </button>
                    </div>
                </div>

                {/* Current Values Display */}
                <div className="bg-white rounded-lg shadow p-6 mt-8">
                    <h2 className="text-xl font-semibold mb-4">Current Values</h2>
                    <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Status:</span> {status}</p>
                        <p><span className="font-medium">Resource:</span> {resource}</p>
                        <p><span className="font-medium">Implementation:</span> {implementation}</p>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <NotificationModal
                isOpen={showNotification}
                onClose={() => setShowNotification(false)} message={undefined}/>
            <AssignmentModal
                isOpen={showAssignment}
                onClose={() => setShowAssignment(false)}
            />
            <RejectModal
                isOpen={showReject}
                onClose={() => setShowReject(false)}
            />
        </div>
    );
}