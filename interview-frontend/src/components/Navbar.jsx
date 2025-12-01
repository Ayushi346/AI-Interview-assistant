import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="bg-white shadow">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/" className="font-bold text-lg">Interview Assistant</Link>
                <div className="space-x-4">
                    <Link to="/" className="text-sm text-blue-600">Home</Link>
                    <Link to="/interview" className="text-sm text-gray-600">Interview</Link>
                    <Link to="/summary" className="text-sm text-gray-600">Summary</Link>
                </div>
            </div>
        </nav>
    );
}
