import React, { useState, useEffect } from 'react';
import './ModalSchedule.css';

  const ModalSchedule = ({ isOpen, onClose }) => {
  const [hoursType, setHoursType] = useState('astronomical');
  const [totalHours, setTotalHours] = useState(3);
  const [hoursPerDay, setHoursPerDay] = useState(1);
  const [breakTime, setBreakTime] = useState('noBreak');
  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('07:45');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(null);
  const [courseType, setCourseType] = useState('break');
  const [selectedDays, setSelectedDays] = useState(['ПН', 'СР', 'ПТ']); // Default days

  const days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];


  
  const handleSubmit = (e) => {
    e.preventDefault();
    const scheduleData = {
      courseType,
      hoursType,
      totalHours,
      startDate,
      endDate,
      selectedDays,
      breakTime,
      startTime,
      endTime,
    };
    console.log('Отправка данных:', scheduleData);
    onClose();
  };

  const handleDaySelection = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  const handlePredefinedDays = (preset) => {
    if (preset === 'pn_sr_pt') {
      setSelectedDays(['ПН', 'СР', 'ПТ']);
    } else if (preset === 'vt_cht') {
      setSelectedDays(['ВТ', 'ЧТ']);
    }
  };

  const calculateEndTime = (startTime, courseType, hoursPerDay, breakTime) => {
    let [hours, minutes] = startTime.split(':').map(Number);
    const minutesPerHour = courseType === 'academic' ? 45 : 60;
    let totalMinutes = hoursPerDay * minutesPerHour;

    if (breakTime === 'withBreak') {
      totalMinutes += 15; // Adding a 15-minute break for simplicity
    }

    minutes += totalMinutes;
    hours += Math.floor(minutes / 60);
    minutes = minutes % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <h2 className="redaction">Редактирование расписания</h2>
      <div className="modal-content">
        <form onSubmit={handleSubmit} className="form-row">
          <select
            className="hoursType"
            value={courseType}
            onChange={(e) => setCourseType(e.target.value)}
          >
            <option value="academic">Академические (45 минут)</option>
            <option value="astronomic">Астрономические (60 минут)</option>
          </select>

          <div className="hours-counter">
            <button className="minus" type="button" onClick={() => setTotalHours(prev => Math.max(0, prev - 1))}>-</button>
            <input
            type="number"
            value={totalHours}
            onChange={(e) => setTotalHours(Math.max(0, parseInt(e.target.value)))}
              className="input-hours"
            />
            <span className="clock">Всего <br />часов</span>
            <button className="plus" type="button" onClick={() => setTotalHours((prev) => prev + 1)}>
              +
            </button>
          </div>
        
          <div className="date-range">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="do">до</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </form>
      
      </div> {/* Здесь исправлен незакрытый div */}
      
      {/* Вторая часть модального окна с выбором дней недели */}
      <div className="modal-content days-modal">
        <form className="form-row2" onSubmit={(e) => e.preventDefault()}>
          <div className="day-selection-container">
            <button
              type="button"
              className={selectedDays.join(',') === 'ПН,СР,ПТ' ? 'selected' : ''}
              onClick={() => handlePredefinedDays('pn_sr_pt')}
            >
              ПН/СР/ПТ
            </button>
            <button
              type="button"
              className={selectedDays.join(',') === 'ВТ,ЧТ' ? 'selected' : ''}
              onClick={() => handlePredefinedDays('vt_cht')}
            >
              ВТ/ЧТ
            </button>

            <div className="day-select">
              {days.map((day, index) => (
                <button
                  type="button"
                  key={index}
                  className={selectedDays.includes(day) ? 'selected' : ''}
                  onClick={() => handleDaySelection(day)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
      <div className="modal-content clock-modal">
      <form onSubmit={handleSubmit} className="form-row">
        <select className="courseType" value={breakTime} onChange={(e) => setBreakTime(e.target.value)}>
          <option value="without_breake">Без перерыва</option>
          <option value="breake">0 мин</option>
          <option value="5min">5 мин</option>
          <option value="10min">10 мин</option>
          <option value="15min">15 мин</option>
          <option value="20min">20 мин</option>
          <option value="30min">30 мин</option>
        </select>

        <div className="hours-counter3">
          <button className="minus3" type="button" onClick={() => setHoursPerDay(prev => Math.max(1, prev - 1))}>-</button>
          <input
            type="number"
            value={hoursPerDay}
            onChange={(e) => setHoursPerDay(Math.max(1, parseInt(e.target.value)))}
            min="1"
            className="input-hours"
          />
          <span className="clock3">Часов <br />в день</span>
          <button className="plus3" type="button" onClick={() => setHoursPerDay(prev => prev + 1)}>+</button>
        </div>

        <div className="date-range">
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          <span className="do3">до</span>
          <input type="time" value={endTime} disabled />
        </div>
        
      </form>
      </div>
      {/* <footer><input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        <button type="button" onClick={onClose}>Отмена</button>
        <button type="submit">Добавить расписание</button>
      </footer> */}
    </div>
  );
};

export default ModalSchedule;