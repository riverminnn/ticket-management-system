import {useState} from 'react';
import RequestListTable from './components/TicketTable';
import RequestDetailForm from './components/TicketForm';
import DropdownDemo from './components/DropdownDemo';

function App() {
    const [currentView, setCurrentView] = useState('demo');

    return (
        <div>
            {/* View Toggle */}
            <div className="fixed top-4 right-4 z-50 flex gap-2">
                <button
                    onClick={() => setCurrentView('demo')}
                    className={`px-4 py-2 rounded shadow-lg ${
                        currentView === 'demo' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border'
                    }`}
                >
                    Demo
                </button>
                <button
                    onClick={() => setCurrentView('table')}
                    className={`px-4 py-2 rounded shadow-lg ${
                        currentView === 'table' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'
                    }`}
                >
                    Table View
                </button>
                <button
                    onClick={() => setCurrentView('detail')}
                    className={`px-4 py-2 rounded shadow-lg ${
                        currentView === 'detail' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'
                    }`}
                >
                    Detail View
                </button>
            </div>

            {/* Render View */}
            {currentView === 'demo' && <DropdownDemo/>}
            {currentView === 'table' && <RequestListTable/>}
            {currentView === 'detail' && <RequestDetailForm/>}
        </div>
    );
}

export default App;