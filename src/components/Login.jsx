import React, { useState } from 'react';
import { User, Lock, Mail, Image, Briefcase, KeyRound } from 'lucide-react'; 

const Login = ({ onLoginSuccess, onRegisterSuccess, roles = [] }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Por favor, ingresa tu email y contraseña.');
      return;
    }
    onLoginSuccess({ email, password }); 
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreviewUrl('');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password || !selectedRole) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor, ingresa un email válido.');
      return;
    }
    const newUserData = {
      name,
      email,
      password, 
      role: selectedRole,
      imageUrl: imagePreviewUrl, 
      imageFile: imageFile 
    };
    onRegisterSuccess(newUserData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-5">
          {isRegistering && (
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                <div className="flex items-center">
                  <User size={16} className="mr-2" /> Nombre
                </div>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tu nombre completo"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              <div className="flex items-center">
                <Mail size={16} className="mr-2" /> Email
              </div>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="tu@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              <div className="flex items-center">
                <Lock size={16} className="mr-2" /> Contraseña
              </div>
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          {isRegistering && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageFile">
                  <div className="flex items-center">
                    <Image size={16} className="mr-2" /> Imagen de Perfil
                  </div>
                </label>
                <input
                  type="file"
                  id="imageFile"
                  accept="image/png, image/jpeg, image/gif" // Permite PNG, JPG/JPEG y GIF
                  onChange={handleImageChange}
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {imagePreviewUrl && (
                  <div className="mt-4">
                    <p className="text-gray-700 text-sm font-bold mb-2">Previsualización:</p>
                    <img src={imagePreviewUrl} alt="Previsualización de perfil" className="w-24 h-24 object-cover rounded-full mx-auto border-2 border-blue-300" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                  <div className="flex items-center">
                    <Briefcase size={16} className="mr-2" /> Selecciona tu Rol
                  </div>
                </label>
                <select
                  id="role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Selecciona un rol --</option>
                  {roles && roles.length > 0 ? (
                    roles.map((role) => (
                      <option key={role.id} value={role.name}>
                        {role.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No hay roles disponibles</option>
                  )}
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200"
          >
            {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="font-bold text-blue-600 hover:text-blue-800 text-sm"
          >
            {isRegistering ? '¿Ya tienes una cuenta? Inicia Sesión' : '¿No tienes una cuenta? Regístrate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;