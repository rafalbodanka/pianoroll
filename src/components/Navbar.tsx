export default function Navbar() {
  return (
    <nav className='flex items-center justify-between bg-[#154151] shadow-md'>
      <div>
        <a href='/pianoroll'>
          <img className='h-[44px] pb-1 fill-white' src="img/white.svg" alt="Logo" />
        </a>
      </div>
    </nav>
  )
}