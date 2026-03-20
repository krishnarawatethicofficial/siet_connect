const Spinner = ({ size = "md" }) => {
  const sizeClass = size === "sm" ? "loading-sm" : size === "lg" ? "loading-lg" : "loading-md";
  return (
    <div className="flex items-center justify-center p-8" role="status" aria-label="Loading">
      <span className={`loading loading-spinner ${sizeClass} text-accent`} />
    </div>
  );
};

export default Spinner;
