const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="flex gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce1" />
        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce2" />
        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce3" />
      </div>
      <p className="text-sm text-slate-400 font-medium">Yükleniyor...</p>
    </div>
  )
}

export default Loading
