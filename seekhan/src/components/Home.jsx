import NavBar from "./NavBar";
import Footer from "./Footer";
function Home() {
  return (
    <>
      <header className="w-full h-auto font-bold text-blue-500 bg-black">
        <div className="flex flex-wrap flex-col items-center justify-center">
          <h1>WELCOME TO SEEKHAN!!</h1>
          <img
            src="https://images.pexels.com/photos/14240593/pexels-photo-14240593.jpeg?cs=srgb&dl=pexels-harrisonhaines-14240593.jpg&fm=jpg&_gl=1*yey7al*_ga*NTMzNjM2Nzc5LjE3MzA5NjU1MzE.*_ga_8JE65Q40S6*MTczMDk2NTUzMC4xLjAuMTczMDk2NTUzMC4wLjAuMA.."
            alt=""
          />
        </div>
      </header>
    </>
  );
}
export default Home;
