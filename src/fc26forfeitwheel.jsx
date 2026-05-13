import React, { useEffect, useRef, useState } from "react";

export default function FC26ForfeitWheel() {
  const defaultForfeits = [
    "Sell your best player (highest overall)",
    "Sell your top scorer",
    "Release your oldest player",
    "Only sign players under 21 for 1 season",
    "No transfers for 1 season",
    "Accept the first transfer offer you receive",
    "Sell a random starter",
    "Release a reserve player",
    "Promote 2 youth academy players",
    "Transfer list your captain",
    "Only sign free agents",
    "Only sign players from one nation",
    "Sell your highest value player",
    "Loan out your best young player",
    "No contract renewals for 6 months",
    "Reduce your wage budget by selling 2 players",
    "Buy a player under 65 overall",
    "Sign a player over 34 years old",
    "Use only academy scouts from one country",
    "Spin again x2"
  ];

  const [forfeits, setForfeits] = useState(defaultForfeits);
  const [newForfeit, setNewForfeit] = useState("");
  const [selected, setSelected] = useState("");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  const timeoutRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("fc26-forfeits");

    if (saved) {
      try {
        setForfeits(JSON.parse(saved));
      } catch (error) {
        console.error(error);
      }
    }

    const handler = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("fc26-forfeits", JSON.stringify(forfeits));
  }, [forfeits]);

  const colors = [
    "#22c55e",
    "#3b82f6",
    "#f97316",
    "#ef4444",
    "#a855f7",
    "#eab308",
    "#06b6d4",
    "#ec4899"
  ];

  const spinWheel = () => {
    if (spinning || forfeits.length === 0) {
      return;
    }

    setSpinning(true);
    setSelected("");

    const randomIndex = Math.floor(Math.random() * forfeits.length);
    const segmentAngle = 360 / forfeits.length;

    const targetAngle =
      360 - randomIndex * segmentAngle - segmentAngle / 2;

    const extraSpins = 360 * (5 + Math.floor(Math.random() * 3));

    const finalRotation = rotation + extraSpins + targetAngle;

    setRotation(finalRotation);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setSelected(forfeits[randomIndex]);
      setSpinning(false);

      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    }, 5000);
  };

  const addForfeit = () => {
    const trimmed = newForfeit.trim();

    if (!trimmed) {
      return;
    }

    setForfeits((prev) => [...prev, trimmed]);
    setNewForfeit("");
  };

  const removeForfeit = (indexToRemove) => {
    if (forfeits.length <= 2) {
      return;
    }

    setForfeits((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const downloadOfflineApp = () => {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>FC 26 Forfeit Wheel</title>
<style>
body {
  background: #000;
  color: white;
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  text-align: center;
  padding: 20px;
}
.container {
  max-width: 700px;
}
h1 {
  color: #22c55e;
  font-size: 48px;
}
</style>
</head>
<body>
<div class="container">
<h1>FC 26 Career Mode Wheel</h1>
<p>Offline version downloaded successfully.</p>
<p>Open the main app version for the full spinning wheel experience.</p>
</div>
</body>
</html>`;

    const blob = new Blob([htmlContent], {
      type: "text/html"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "FC26_Forfeit_Wheel.html";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const installApp = async () => {
    if (!installPrompt) {
      alert("Install prompt not available on this browser yet.");
      return;
    }

    installPrompt.prompt();

    const result = await installPrompt.userChoice;

    if (result.outcome === "accepted") {
      setInstalled(true);
    }
  };

  const wheelStyle = {
    transform: `rotate(${rotation}deg)`,
    transition: spinning
      ? "transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
      : "none"
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-green-950 text-white p-6 flex flex-col items-center">
      <div className="w-full flex flex-col items-center mb-6 gap-4">
        <div className="bg-green-500 text-black font-black px-6 py-2 rounded-full shadow-xl text-sm uppercase tracking-widest">
          Ultimate FC 26 Career Challenge App
        </div>

        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={installApp}
            className="bg-white text-black font-black px-6 py-3 rounded-2xl shadow-xl hover:scale-105 transition"
          >
            {installed ? "APP INSTALLED" : "INSTALL APP"}
          </button>

          <button
            onClick={downloadOfflineApp}
            className="bg-green-500 text-black font-black px-6 py-3 rounded-2xl shadow-xl hover:scale-105 transition"
          >
            DOWNLOAD APP FILE
          </button>
        </div>

        <div className="text-zinc-400 text-sm text-center max-w-xl">
          The download button saves a launchable HTML app file directly into your Downloads folder.
          You can move it anywhere on your PC and open it like an app.
        </div>
      </div>

      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-start">
        <div className="bg-zinc-900 rounded-3xl shadow-2xl p-6 border border-zinc-800">
          <h1 className="text-5xl font-black mb-2 text-center text-green-400 drop-shadow-lg">
            FC 26 Career Mode Forfeit Wheel
          </h1>

          <p className="text-zinc-400 text-center mb-6">
            Spin the wheel for brutal front-office punishments in your FC 26 manager career.
          </p>

          <div className="relative flex justify-center items-center mb-8">
            <div className="absolute -top-5 z-20 text-5xl">⬇️</div>

            <div
              className="relative w-[360px] h-[360px] rounded-full border-[10px] border-white overflow-hidden shadow-2xl"
              style={wheelStyle}
            >
              {forfeits.map((forfeit, index) => {
                const angle = 360 / forfeits.length;
                const rotate = index * angle;

                return (
                  <div
                    key={`${forfeit}-${index}`}
                    className="absolute w-1/2 h-1/2 origin-bottom-right flex items-center justify-center"
                    style={{
                      transform: `rotate(${rotate}deg) skewY(${90 - angle}deg)`,
                      background: colors[index % colors.length],
                      right: "50%",
                      bottom: "50%"
                    }}
                  >
                    <div
                      className="absolute text-[10px] font-bold text-center px-2 leading-tight"
                      style={{
                        transform: `skewY(-${90 - angle}deg) rotate(${angle / 2}deg) translateY(-115px)`,
                        width: "110px"
                      }}
                    >
                      {forfeit}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={spinWheel}
              disabled={spinning}
              className="bg-green-500 hover:bg-green-400 transition px-8 py-4 rounded-2xl text-xl font-black shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {spinning ? "SPINNING..." : "SPIN THE WHEEL"}
            </button>
          </div>

          {selected && (
            <div className="mt-8 bg-zinc-800 rounded-2xl p-5 text-center border border-green-500 animate-pulse">
              <p className="text-zinc-400 mb-2">Your Forfeit:</p>

              <h2 className="text-2xl font-black text-green-400">
                {selected}
              </h2>
            </div>
          )}
        </div>

        <div className="bg-zinc-900 rounded-3xl shadow-2xl p-6 border border-zinc-800">
          <h2 className="text-3xl font-black mb-4">
            Customize Forfeits
          </h2>

          <div className="flex gap-3 mb-6">
            <input
              value={newForfeit}
              onChange={(e) => setNewForfeit(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addForfeit();
                }
              }}
              placeholder="Add a new forfeit..."
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-green-500"
            />

            <button
              onClick={addForfeit}
              className="bg-blue-500 hover:bg-blue-400 transition px-5 rounded-xl font-bold"
            >
              Add
            </button>
          </div>

          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-2">
            {forfeits.map((forfeit, index) => (
              <div
                key={`${forfeit}-list-${index}`}
                className="flex items-center justify-between bg-zinc-800 rounded-xl px-4 py-3 gap-3"
              >
                <span className="font-medium text-sm break-words">
                  {forfeit}
                </span>

                <button
                  onClick={() => removeForfeit(index)}
                  className="bg-red-500 hover:bg-red-400 transition px-3 py-1 rounded-lg text-sm font-bold shrink-0"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-zinc-800 rounded-2xl p-4 border border-zinc-700">
            <h3 className="font-black text-lg mb-2">Ideas</h3>

            <ul className="text-sm text-zinc-300 space-y-1 list-disc ml-5">
              <li>Only use youth academy players</li>
              <li>Sell your captain</li>
              <li>Only sign free agents</li>
              <li>Release your oldest player</li>
              <li>Sell your highest value player</li>
              <li>Only sign players from one country</li>
              <li>Transfer list a starter</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-10 text-zinc-500 text-sm text-center">
        Made for FC 26 Career Mode Challenges ⚽
      </div>

      <audio
        ref={audioRef}
        src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8d603f24d.mp3?filename=success-fanfare-trumpets-6185.mp3"
      />
    </div>
  );
}
