export default function Button({ children, onClick, className = "" }) {
  return (
    <button
      className={
        "btn-3d min-h-0 px-4 py-1 shrink-0 active:scale-90 " + className
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
}
