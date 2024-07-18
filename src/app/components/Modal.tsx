import React, { useState, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onNameSubmit: (name: string) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onNameSubmit }) => {
  const [userName, setUserName] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const storedName = localStorage.getItem('xapiUserName');
    if (storedName) {
      onNameSubmit(storedName);
    }
  }, [onNameSubmit]);

  const handleSubmitName = () => {
    if (userName.trim()) {
      localStorage.setItem('xapiUserName', userName);
      onNameSubmit(userName);
      setError('');
    } else {
      setError('Please enter a name');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Enter a Name</h2>
          <p className="text-sm text-gray-600 mb-4">You can use any name for this test environment.</p>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-3 border rounded-md text-lg text-gray-800"
            placeholder="Enter any name"
          />
          {error && <p className="mt-2 text-red-600">{error}</p>}
          <button 
            onClick={handleSubmitName} 
            className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-lg w-full"
          >
            Submit
          </button>
          <p className="mt-4 text-sm text-gray-500">
            Note: This is a test environment. You don&apos;t need to use your real name.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Modal;