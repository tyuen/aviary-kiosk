export default function Button({ children, onClick, className = "" }) {
  return (
    <button
      className={
        "min-h-0 px-4 py-1 text-white border rounded-full border-stone-400 bg-stone-600 shrink-0 active:scale-90 " +
        className
      }
      style={{
        boxShadow:
          "1px 1px 20px rgba(0 0 0/.5), inset 1px 1px 53x rgba(0 0 0/.5)",
        backgroundImage: "linear-gradient(45deg,#444,#333,#222,#444,#222)",
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
