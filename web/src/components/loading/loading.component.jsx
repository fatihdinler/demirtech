const Loading = () => {
  return (
    <div className='loading'>
      <div className='bounce-container'>
        <div className='bounce'></div>
        <div className='bounce'></div>
        <div className='bounce'></div>
      </div>
      <p className='loading-text'>Yükleniyor...</p>
    </div>
  )
}

export default Loading