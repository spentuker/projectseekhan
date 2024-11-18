function NavBar() {
  return (
    <>
      <nav className="w-full h-[80px] px-[50px] flex justify-between items-center text-white bg-orange-400 ">
        <div>
          <img
            src="./assets/example.png "
            className="w-fit h-fit font-bold outline-none"
          />
        </div>
        <ul className="flex justify-center text-center space-x-6 ">
          <li className="mx-[3] font-bold cursor-pointer">
            <a href="home">home</a>
          </li>
          <li className="mx-[3] font-bold cursor-pointer">
            <a href="about">about</a>
          </li>
          <li className="mx-[3] font-bold cursor-pointer">
            <a href="quiz">quiz</a>
          </li>
          <li className="mx-[3] font-bold cursor-pointer">
            <a href="xxx">xxx</a>
          </li>
        </ul>
        <div className="space-x-2">
          <button className="outline-none bg-red-500 hover:bg-orange-400 w-fit h-fit px-2 font-bold py-2">
            login
          </button>
          <button className="outline-none bg-red-500 hover:bg-orange-400 w-fit h-fit px-2 font-bold py-2">
            signup
          </button>
        </div>
      </nav>
    </>
  );
}
export default NavBar;
