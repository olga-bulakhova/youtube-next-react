export default function Loading() {
  return (
    <div className="animate-in fade-in flex h-[70vh] w-full items-center justify-center bg-zinc-950/40 backdrop-blur-md duration-300 select-none">
      <div className="relative flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-800 border-t-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)] duration-700" />
      </div>
    </div>
  );
}
