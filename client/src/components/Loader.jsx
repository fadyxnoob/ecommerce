const Loader = ({
    size= 'size-16',
    borderColor = 'border-pink-500',
    borderTop = 'border-t-4',
}) => {
  return (
    <div className={`animate-spin rounded-full ${size} ${borderColor} ${borderTop}  border-opacity-50`}></div>
  );
};

export default Loader;
