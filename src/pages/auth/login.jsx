import React, { useState, useEffect } from 'react';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedTab, setSelectedTab] = useState('student');
  const [shapes, setShapes] = useState([]);

  useEffect(() => {
    const newShapes = Array(10)
      .fill(0)
      .map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 20 + Math.random() * 80,
        opacity: 0.1 + Math.random() * 0.2,
        rotation: Math.random() * 360,
        speed: 0.5 + Math.random() * 1.5,
      }));
    setShapes(newShapes);

    const interval = setInterval(() => {
      setShapes((prev) =>
        prev.map((shape) => ({
          ...shape,
          y: (shape.y - shape.speed * 0.05) % 100,
          rotation: (shape.rotation + 0.05) % 360,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);


  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className="absolute bg-blue-200 rounded-full"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            opacity: shape.opacity,
            transform: `rotate(${shape.rotation}deg)`,
            transition: 'top 0.5s ease-out, transform 0.5s ease-out',
          }}
        />
      ))}

      <div className="container relative z-10 flex flex-col items-center justify-center max-w-screen-xl gap-8 px-4 mx-auto lg:flex-row lg:gap-16">
        <div className="w-full max-w-md text-center lg:w-1/2 lg:text-left">
          <div className="flex items-center justify-center gap-3 mb-6 lg:justify-start">
            <img src="/yuktaLogo.png" className="w-10 h-10" alt="YUKTA's Connect" />
            <h1 className="text-3xl font-bold text-blue-900">
              YUKTA's<span className="text-blue-600">Connect</span>
            </h1>
          </div>

          <h2 className="mb-4 text-4xl font-bold text-blue-900 lg:text-5xl">
            Welcome to HDC College Portal
          </h2>

          <p className="mb-6 text-lg text-gray-600">
            Access all your academic resources, connect with peers and faculty,
            and manage your college life effortlessly.
          </p>
        </div>

        <div className="w-full max-w-md lg:w-1/2">
          <div className="p-6 bg-white shadow-lg lg:p-8 rounded-xl">
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedTab('student')}
                  className={`p-2 rounded ${
                    selectedTab === 'student'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  Student
                </button>
                <button
                  onClick={() => setSelectedTab('faculty')}
                  className={`p-2 rounded ${
                    selectedTab === 'faculty'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  Faculty
                </button>
              </div>
            </div>

            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {selectedTab === 'student'
                      ? 'Student Email'
                      : 'Faculty Email'}
                  </label>
                  <div className="relative">
                    <span className="absolute transform -translate-y-1/2 left-3 top-1/2">
                      📧
                    </span>
                    <input
                      type="email"
                      placeholder={`${selectedTab}@college.edu`}
                      className="w-full p-2 pl-10 border rounded"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute transform -translate-y-1/2 left-3 top-1/2">
                      🔒
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full p-2 pl-10 border rounded"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute transform -translate-y-1/2 right-3 top-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '👁️' : '👁️🗨️'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 border-gray-300 rounded"
                    />
                    <label className="text-sm">Remember me</label>
                  </div>
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Sign In'}
                </button>

                <div className="mt-4 text-sm text-center text-gray-500">
                  <p>
                    Don't have an account?{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-700">
                      Contact Support
                    </a>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
