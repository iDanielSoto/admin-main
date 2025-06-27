// ProfilePage.jsx
import React from 'react';
import { User, Mail, Briefcase, Calendar, Phone } from 'lucide-react';

const ProfilePage = ({ loggedInUser, handleLogin }) => {
  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
          <User className="inline-block mr-3 text-blue-600" size={30} />
          Mi Perfil
        </h2>

        {loggedInUser ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img
                  className="h-24 w-24 rounded-full object-cover shadow-md"
                  src={loggedInUser.profilePicture || 'https://via.placeholder.com/150'} // Placeholder image
                  alt="Profile"
                />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">{loggedInUser.name}</p>
                <p className="text-md text-gray-600">{loggedInUser.role}</p>
              </div>
            </div>

            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center text-gray-700">
                <Mail className="mr-3 text-blue-500" size={20} />
                <span>{loggedInUser.email}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Briefcase className="mr-3 text-blue-500" size={20} />
                <span>Departamento: {loggedInUser.department}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Phone className="mr-3 text-blue-500" size={20} />
                <span>Teléfono: {loggedInUser.phone}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Calendar className="mr-3 text-blue-500" size={20} />
                <span>Fecha de Contratación: {loggedInUser.hireDate}</span>
              </div>
              <div className="text-gray-700">
                <h3 className="font-semibold text-lg mb-2 text-blue-600">Permisos:</h3>
                <ul className="list-disc list-inside ml-4">
                  {loggedInUser.permissions.map((permission, index) => (
                    <li key={index} className="text-gray-700">{permission}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg mb-6">Por favor, inicia sesión para ver la información de tu perfil.</p>
            <button
              onClick={handleLogin}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
            >
              Iniciar Sesión (Simulado)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;