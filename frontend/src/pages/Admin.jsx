import { useState } from "react";
import { Plus, Edit, Trash2, Home, RefreshCw, Zap } from "lucide-react";
import { NavLink } from "react-router";


function Admin() {
    const [selectedOption, setSelectedOption] = useState(null);

    const adminOptions = [
        {
            id: 'create',
            title: 'Create Problem',
            description: 'Add a new problem to the platform.',
            icon: Plus,
            color: 'btn-success',
            bgColor: 'bg-success/10',
            route: '/admin/create'
        },
        {
            id: 'update',
            title: 'Update Problem',
            description: 'Edit an existing problem on the platform.',
            icon: Edit,
            color: 'btn-warning',
            bgColor: 'bg-warning/10',
            route: '/admin/update'
        },
        {
            id: 'delete',
            title: 'Delete Problem',
            description: 'Remove a problem from the platform.',
            icon: Trash2,
            color: 'btn-error',
            bgColor: 'bg-error/10',
            route: '/admin/delete'
        }
    ]

    return (
        <div className="min-h-screen bg-base-200">
            <div className="container mx-auto px-4 py-8">
                {/* Header  */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-base-content mb-4">Admin Panel</h1>
                    <p className="text-base-content/70 text-lg">Manage coding problems on your platform</p>
                </div>

                {/* Admin Options Grid  */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {adminOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                            <div
                                key={option.id}
                                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transition-ease-in-out"
                            >
                                <div className="card-body items-center text-center p-8">
                                    {/* Icons */}
                                    <div className={`${option.bgColor} p-4 rounded-full mb-4`}>
                                        <IconComponent size={32} className='text-base-content'/>
                                    </div>
                                    {/* Title  */}
                                    <h2 className="card-title text-xl mb-2">{option.title}</h2>

                                    {/* Description */}
                                    <p className="text-base-content/70 mb-6">{option.description}</p>

                                    {/* Active Button  */}
                                    <div className="card-actions">
                                        <div className="card-actions">
                                            <NavLink to={option.route} className={`btn ${option.color} btn-wide`}>
                                                {option.title}
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {/* Selected Option Display
                {selectedOption && (
                    <div className="mt-8 max-w-2xl mx-auto">
                        <div className="alert alert-info">
                            <div className="flex items-center gap-2">
                                <selectedOption.icon size={20} />
                                <span>
                                    You Selected: {selectedOption.title}
                                    <br />
                                    <small>In your app, this would navigate to: {selectedOption.route}</small>
                                </span>
                            </div>
                        </div>
                    </div>
                )} */}

            </div>
        </div>
    )
}

export default Admin