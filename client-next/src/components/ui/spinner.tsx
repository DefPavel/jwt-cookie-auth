import { FC } from 'react';

const Spinner: FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full border-t-4 border-b-4 border-gray-200 border-t-blue-500 h-16 w-16"></div>
    </div>
  );
};

export default Spinner;
