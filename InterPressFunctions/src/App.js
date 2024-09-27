import React, { useState } from 'react';
import './App.css';
import ModalSchedule from './ModalSchedule';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Управление расписанием курса</h1>
        <button onClick={openModal}>Редактировать расписание</button>
        {/* Условный рендеринг модального окна */}
        {isModalOpen && <ModalSchedule isOpen={isModalOpen} onClose={closeModal} />}
      </header>
    </div>
  );
}

export default App;