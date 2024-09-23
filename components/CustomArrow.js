const CustomArrow = ({ className, style, onClick, direction }) => {
  return (
    <div
      className={`absolute top-1/2 z-10 transform -translate-y-1/2 bg-netflixRed text-white p-2 sm:p-3 rounded cursor-pointer shadow-lg hover:bg-gray-800 
      ${direction === 'right' ? 'right-2 sm:right-0' : 'left-2 sm:left-0'} 
      text-lg sm:text-xl`}
      onClick={onClick}
      style={{ ...style }}
    >
      {direction === 'right' ? '>' : '<'}
    </div>
  );
};

export default CustomArrow;
