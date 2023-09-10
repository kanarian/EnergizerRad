import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { WheelData } from "react-custom-roulette/dist/components/Wheel/types";
import ReactConfetti from "react-confetti";

const data: WheelData[] = [
  { option: "Ninja" },
  { option: "Steen-papier-schaar toernooi", style: { fontSize: 10 } },
  { option: "Gekke loopjes" },
  { option: "Stoelendans" },
];

const Wheel = dynamic(
  () => import("react-custom-roulette").then((mod) => mod.Wheel),
  {
    ssr: false,
  }
);

export default () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [energizers, setEnergizers] = useState<WheelData[]>(data);

  const handleSpinClick = () => {
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * energizers.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  const handleFinishSpinning = () => {
    setMustSpin(false);
    setIsOpen(true);
    setShowConfetti(true);
  };

  const handleCloseModal = () => {
    setShowConfetti(false);
    setIsOpen(false);
  };

  const removeEnergizerByName = (energizerName: string) => {
    const newEnergizers = energizers.filter((e) => e.option !== energizerName);
    setEnergizers(newEnergizers);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-200 justify-between p-4 text-slate-600">
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-bold text-slate-900">Energizer Rad 🔋</h1>
        <h3 className="md:max-w-lg max-w-sm">
          Als je energizers toe wilt voegen of andere ideeën hebt, stuur me een
          appje 🫶🏽.
        </h3>
        <Wheel
          pointerProps={{ src: "/my-pointer.png" }}
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={energizers}
          backgroundColors={["#0f172a", "#f1f5f9"]}
          textColors={["#f1f5f9", "#0f172a"]}
          onStopSpinning={handleFinishSpinning}
        />
        <button
          onClick={handleSpinClick}
          className="bg-slate-900 p-4 text-slate-50 flex justify-center rounded-md max-w-md hover:bg-slate-800 transition-colors duration-200 ease-in-out"
        >
          Kies een energizer
        </button>
      </div>
      {showConfetti && <ConfettiComponent />}
      <div className="text-slate-700 ml-auto">
        Made with ❤️ by Arian Joyandeh
      </div>
      <Modal
        text={energizers[prizeNumber].option as string}
        isOpen={isOpen}
        handleCloseModal={handleCloseModal}
        removeEnergizerByName={removeEnergizerByName}
      />
    </div>
  );
};

const ConfettiComponent = () => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }, []);
  return (
    <ReactConfetti style={{ zIndex: "100" }} width={width} height={height} />
  );
};

const Modal = ({
  text,
  isOpen,
  handleCloseModal,
  removeEnergizerByName,
}: {
  text: string;
  isOpen: boolean;
  handleCloseModal: () => void;
  removeEnergizerByName: (energizerName: string) => void;
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={handleCloseModal}
      className="absolute inset-0 bg-black/50 backdrop-blur-sm w-screen h-screen z-10 flex items-center justify-center"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="bg-slate-100 w-96 h-48 rounded-md p-4 flex flex-col justify-between"
      >
        <h1 className="text-2xl font-bold text-slate-900">Random Energizer</h1>
        <p className="text-slate-600">
          Je gevonden energizer is: <span className="font-bold">{text}</span>
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleCloseModal}
            className="bg-slate-900 px-4 py-2 text-slate-50 rounded-md hover:bg-slate-800 transition-colors duration-200 ease-in-out"
          >
            Sluit
          </button>
          <button
            onClick={() => {
              removeEnergizerByName(text);
              handleCloseModal();
            }}
            className="bg-slate-900 px-4 py-2 text-slate-50 rounded-md hover:bg-slate-800 transition-colors duration-200 ease-in-out ml-2"
          >
            Ik wil een andere!
          </button>
        </div>
      </div>
    </div>
  );
};
