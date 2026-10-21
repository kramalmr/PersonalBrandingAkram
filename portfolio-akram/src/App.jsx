import heroImg from "./assets/hero.png";
import eyesImg from "./assets/eyes.png";
import duckImg from "./assets/duck.png";
import numberImg from "./assets/seventeen.png";
import DraggableImage from "./DraggableImage";

function App() {
  return (
    <div className="overflow-hidden">
      <div className="relative w-screen h-screen overflow-hidden ">
        <DraggableImage
          src={heroImg}
          w="520px"
          position="top-[45vh] left-1/2"
        />
        <DraggableImage
          src={duckImg}
          w="150px"
          position="top-[45vh] left-[60vw]"
        />
        <DraggableImage
          src={eyesImg}
          w="60px"
          position="top-[55vh] left-[37vw]"
        />
        <DraggableImage
          src={numberImg}
          w="120px"
          position="top-[29vh] left-[47vw]"
        />

        <div className="flex flex-col py-12 h-full justify-end">
          <div className="flex flex-col">
            <div className="rounded-2xl absolute left-[32%] bottom-[30%] text-white bg-[#DE7272] px-6 py-2 text-xl text-center rotate-[-8deg] -mr-4">
              High School Student
            </div>
            <div className="rounded-2xl absolute left-[45%] bottom-[22%] text-white bg-[#B4E4D6] px-6 py-2 text-xl text-center rotate-3">
              Front-end Developer
            </div>
            <div className="rounded-2xl absolute left-[58%] bottom-[30%] text-white bg-[#FFCA88] px-6 py-2 text-xl text-center rotate-12 ">
              Graphic Designer
            </div>
            <div className="mx-auto text-center font-Jacquard text-4xl tracking-tight">
              Muhammad Akram Almair
            </div>
          <div className="mx-auto text-center">welcome to my personal web!</div>
          </div>
        </div>
      </div>
      <div className="relative w-screen h-screen overflow-hidden "></div>
    </div>
  );
}

export default App;
