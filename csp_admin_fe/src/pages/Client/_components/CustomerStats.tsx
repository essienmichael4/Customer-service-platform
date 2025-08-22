
const CustomerStats = () => {
    return (
        <div className="flex justify-between border rounded-lg">
            <div className="p-4">
                <h4 className="text-xs text-gray-600">Tickets</h4>
                <p className="text-2xl">16</p>
            </div>
            <div className="p-4">
                <h4 className="text-xs text-gray-600">Overdue Tickets</h4>
                <p className="text-2xl">16</p>
            </div>
            <div className="p-4">
                <h4 className="text-xs text-gray-600">AVG. Response Time</h4>
                <p className="text-2xl">16</p>
            </div>
            <div className="p-4">
                <h4 className="text-xs text-gray-600">Total Response Time</h4>
                <p className="text-2xl">16</p>
            </div>
        </div>
    )
}

export default CustomerStats
