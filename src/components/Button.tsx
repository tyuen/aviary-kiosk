export default function Button({ children, onClick, className = "" }) {
  return (
    <button className="min-h-0 p-2 shrink-0 active:scale-95" onClick={onClick}>
      <div className={"btn-3d px-4 py-1 " + className}>{children}</div>
    </button>
  );
}
