import heroImg from "./assets/hero.png";
import eyesImg from "./assets/eyes.png";
import duckImg from "./assets/duck.png";
import numberImg from "./assets/seventeen.png";
// import akram from "./assets/akram.png";
import note from "./assets/note.png";
// import gizy from "./assets/projects/web/gizy.png";
// import cbt from "./assets/projects/web/cbt.png";
// import sanubari from "./assets/projects/web/sanubari.png";
// import tapas from "./assets/projects/web/tapas.png";
// import urbankicks from "./assets/projects/web/urbankicks.png";
// import poster1 from "./assets/projects/posters/1.png";
// import poster2 from "./assets/projects/posters/2.png";
// import poster3 from "./assets/projects/posters/3.png";
// import poster4 from "./assets/projects/posters/4.png";
// import poster5 from "./assets/projects/posters/5.png";
// import poster6 from "./assets/projects/posters/6.png";
// import poster7 from "./assets/projects/posters/7.png";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { Draggable } from "gsap/Draggable";
import { Observer } from "gsap/Observer";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(
  useGSAP,
  Draggable,
  Observer,
  Physics2DPlugin,
  ScrollTrigger,
);

import DraggableImage from "./DraggableImage";

function App() {
  return (
    <div className="overflow-hidden">
      <section className="relative w-full h-svh min-h-120 px-8">
        <div
          className="absolute left-1/2 top-[40%] md:top-[45%]"
          style={{ "--w": "min(520px, 85vw, 58vh)" }}
        >
          <DraggableImage
            src={heroImg}
            alt="Akram"
            size={1}
            x={1}
            y={0}
          />
          <DraggableImage
            src={duckImg}
            alt=""
            size={0.29}
            x={1.44}
            y={0}
          />
          <DraggableImage
            src={eyesImg}
            alt=""
            size={0.115}
            x={0.56}
            y={0.2}
          />
          <DraggableImage
            src={numberImg}
            alt=""
            size={0.23}
            x={0.8}
            y={-0.3}
          />
        </div>
        <div className="mb-5 flex md:relative flex-wrap items-end justify-center gap-x-2 gap-y-3 md:mb-8 md:gap-x-4">
          <div className="rounded-2xl w-fit md:absolute top-120 left-12 bg-[#DE7272] px-4 py-1.5 text-sm text-white -rotate-[8deg] sm:text-base md:px-6 md:py-2 md:text-xl">
            High School Student
          </div>
          <div className="rounded-2xl w-fit md:absolute top-80 bg-[#B4E4D6] px-4 py-1.5 text-sm text-white rotate-3 translate-y-2 sm:text-base md:px-6 md:py-2 md:text-xl md:translate-y-6">
            Front-end Developer
          </div>
          <div className="rounded-2xl w-fit md:absolute top-40 left-80 bg-[#FFCA88] px-4 py-1.5 text-sm text-white rotate-12 sm:text-base md:px-6 md:py-2 md:text-xl">
            Graphic Designer
          </div>
        </div>

        <h1 className="text-left font-Jacquard tracking-tight text-[360px] leading-70 mt-8">
          Muhammad
          <br /> Akram
        </h1>
        <button
          class="mt-3 flex flex-row gap-0 group items-center cursor-pointer"
          // onclick="window.location.href='./about.html'"
        >
          <div class="lg:py-4 h-fit lg:px-4 py-2 px-2 border-black border text-[18px] rounded-full font-extralight transition-all group-hover:scale-0 delay-100 overflow-hidden ease-in-out duration-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="black"
              stroke-width="1"
              class="w-5 h-5 transform group-hover:translate-x-8 group-hover:-translate-y-8 group-hover:scale-150 transition-transform duration-300"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M7 17l10-10M7 7h10v10"
              />
            </svg>
          </div>
          <div class="lg:py-4 h-fit py-2 lg:px-8 px-4 border-black border lg:text-[18px] md:text-[14px] rounded-full font-extralight group-hover:-translate-x-12 transition-all delay-100">
            Get in contact!
          </div>
          <div class="lg:py-4 h-fit lg:px-4 py-2 px-2 border-black border text-[18px] rounded-full font-extralight transition-all scale-0 group-hover:scale-100 delay-100 overflow-hidden ease-in-out duration-400 -translate-x-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="black"
              stroke-width="1"
              class="w-5 h-5 transform -translate-x-8 translate-y-8 group-hover:translate-x-0 group-hover:translate-y-0 scale-150 group-hover:scale-100 transition-all duration-300 delay-200"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M7 17l10-10M7 7h10v10"
              />
            </svg>
          </div>
        </button>
      </section>

      <section className="flex flex-col gap-24 w-full h-fit md:h-svh overflow-hidden py-12 px-8">
        <div className="w-[75%] text-7xl tracking-loose leading-tighter text-center md:text-left mt-5 md:mt-0 relative">
          Actively participating in developing new skills and competiting in
          various competitions related to my graphic design skills.
          <img
            src={note}
            className="w-48 absolute top-10 right-48"
            alt=""
          />
        </div>

        <div className="flex flex-col gap-12 md:flex-row">
          <div className="flex-2 flex flex-col"></div>
          <div className="flex-3 flex flex-col gap-12 md:pl-18 lg:pl-32 justify-center">
            <div className="text-2xl tracking-tight leading-tight">
              Skills i acquired
            </div>
            <div className="flex flex-row flex-wrap gap-4">
              <div className=" text-center w-fit border-2 border-black px-4 py-1.5 text-sm text-black sm:text-base md:text-xl">
                HTML(5)
              </div>
              <div className=" text-center w-fit border-2 border-black px-4 py-1.5 text-sm text-black sm:text-base md:text-xl">
                CSS(3)
              </div>
              <div className=" text-center w-fit border-2 border-black px-4 py-1.5 text-sm text-black sm:text-base md:text-xl">
                Javascript
              </div>
              <div className=" text-center w-fit border-2 border-black px-4 py-1.5 text-sm text-black sm:text-base md:text-xl">
                UI/UX DEVELOPMENT
              </div>
              <div className=" text-center w-fit border-2 border-black px-4 py-1.5 text-sm text-black sm:text-base md:text-xl">
                GRAPHICS DESIGN
              </div>
              <div className=" text-center w-fit border-2 border-black px-4 py-1.5 text-sm text-black sm:text-base md:text-xl">
                RESPONSIVE WEB
              </div>
              <div className=" text-center w-fit border-2 border-black px-4 py-1.5 text-sm text-black sm:text-base md:text-xl">
                WORDPRESS DEV
              </div>
              <div className=" text-center w-fit border-2 border-black px-4 py-1.5 text-sm text-black sm:text-base md:text-xl">
                REACT JS
              </div>
              <div className=" text-center w-fit border-2 border-black px-4 py-1.5 text-sm text-black sm:text-base md:text-xl">
                FLUTTER
              </div>
              <div className=" text-center w-fit border-2 border-black px-4 py-1.5 text-sm text-black sm:text-base md:text-xl">
                VARIOUS CSS FRAMEWORKS
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-24 w-full h-svh overflow-hidden px-4 py-4">
        <div className=" gap-4 bg-[url(./assets/projects/web/gizy.png)] bg-cover bg-center w-full h-full rounded-4xl">
          
        </div>
       
      </section>
    </div>
  );
}

export default App;
