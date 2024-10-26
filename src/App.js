import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const dailyGoal = 1500; // 1,5 Liter in Millilitern
  const reminderTimes = [8, 10, 12, 14, 16, 18, 20]; // Stunden für Erinnerungen
  const [waterConsumed, setWaterConsumed] = useState(
    parseInt(localStorage.getItem('waterConsumed')) || 0
  );
  const [totalPenalties, setTotalPenalties] = useState(
    parseInt(localStorage.getItem('totalPenalties')) || 0
  );
  const [isReminderOn, setIsReminderOn] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(
    localStorage.getItem('isSoundOn') === 'true' || true
  );
  const [showReminderPopup, setShowReminderPopup] = useState(false); 

  // Tägliche Prüfung, ob das Ziel um 20:00 Uhr erreicht wurde
  useEffect(() => {
    const checkDailyGoalAt20 = () => {
      const now = new Date();
      const is20OClock = now.getHours() === 20 && now.getMinutes() === 0;

      if (is20OClock && waterConsumed < dailyGoal) {
        setTotalPenalties((prevPenalties) => {
          const updatedPenalties = prevPenalties + 2;
          localStorage.setItem('totalPenalties', updatedPenalties);
          return updatedPenalties;
        });
      }
    };

    const interval = setInterval(checkDailyGoalAt20, 60 * 1000); // Jede Minute prüfen
    return () => clearInterval(interval);
  }, [waterConsumed]);

  // Erinnere zu bestimmten Zeiten
  const showReminder = useCallback(() => {
    if (isSoundOn) {
      const audio = new Audio('src/Alarm-Clock.mp3'); 
      audio.play();
    }
    setShowReminderPopup(true); 
  }, [isSoundOn]);

  useEffect(() => {
    const checkReminderTimes = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      if (reminderTimes.includes(currentHour) && currentMinute === 0) {
        showReminder();
      }
    };

    if (isReminderOn) {
      const interval = setInterval(checkReminderTimes, 60 * 1000); // Jede Minute prüfen
      return () => clearInterval(interval);
    }
  }, [isReminderOn, reminderTimes, showReminder]);

  const addWater = (amount) => {
    setWaterConsumed((prev) => Math.min(prev + amount, dailyGoal));
  };

  const resetWater = () => {
    setWaterConsumed(0);
    localStorage.setItem('waterConsumed', 0);
    setIsReminderOn(false);
    setTimeout(() => setIsReminderOn(true), 1000); // Setze Erinnerungen nach 1 Sekunde zurück
  };

  const toggleSound = () => {
    setIsSoundOn((prev) => {
      const newSoundState = !prev;
      localStorage.setItem('isSoundOn', newSoundState);
      return newSoundState;
    });
  };

  const closePopup = () => {
    setShowReminderPopup(false); 
  };

  const clearPenalties = () => {
    setTotalPenalties(0);
    localStorage.setItem('totalPenalties', 0);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100">
      <h1 className="text-4xl font-bold mb-6">Trink-Erinnerung</h1>
      <div className="text-2xl mb-4">
        {`Du hast heute ${waterConsumed}ml von ${dailyGoal}ml getrunken.`}
      </div>
      <div className="flex space-x-4 mb-6">
      <button
          onClick={() => addWater(150)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          +150ml
        </button>

        <button
          onClick={() => addWater(250)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          +250ml
        </button>
        <button
          onClick={() => addWater(500)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          +500ml
        </button>
      </div>
      <button
        onClick={resetWater}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Zurücksetzen
      </button>
      <div className="mt-6">
        {waterConsumed >= dailyGoal ? (
          <div className="text-green-600 text-2xl">Tagesziel erreicht!</div>
        ) : (
          <div className="text-red-600 text-2xl">
            Noch {dailyGoal - waterConsumed}ml bis zum Ziel.
          </div>
        )}
      </div>

      {/* Umschalten des Alarmtons */}
      <div className="mt-6">
        <button
          onClick={toggleSound}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          {isSoundOn ? 'Ton ausschalten' : 'Ton einschalten'}
        </button>
      </div>

      {/* Menüpunkt für Schläge */}
      <div className="mt-6 text-xl">
        {`Gesamtanzahl der Schläge: ${totalPenalties}`}
      </div>
      <button
        onClick={clearPenalties}
        className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Abgearbeitet
      </button>

      {/* Erinnerungspopup */}
      {showReminderPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">Erinnerung!</h2>
            <p className="text-lg mb-4">Es ist Zeit, Wasser zu trinken!</p>
            <img
              src="src/image/unnamed.png"
              alt="Erinnerungsbild"
              className="w-32 h-32 mb-4"
            />
            <button
              onClick={closePopup}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Schließen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
