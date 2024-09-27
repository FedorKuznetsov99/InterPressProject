import React, { useState, useEffect } from 'react';
import './ModalSchedule.css';

const ModalSchedule = ({ onClose }) => {
  const [courseType, setCourseType] = useState('academic');
  const [totalHours, setTotalHours] = useState(3);
  const [hoursPerDay, setHoursPerDay] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [breakTime, setBreakTime] = useState('noBreak');
  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('07:45');

  const days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

  const predefinedDays = {
    pn_sr_pt: ['ПН', 'СР', 'ПТ'],
    vt_cht: ['ВТ', 'ЧТ']
  };

  const handlePredefinedDays = (group) => {
    setSelectedDays(predefinedDays[group]);
  };

  const handleDaySelection = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter(d => d !== day) // Remove day if already selected
        : [...prev, day] // Add day if not selected
    );
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

  useEffect(() => {
    setEndTime(calculateEndTime(startTime, courseType, hoursPerDay, breakTime));
  }, [startTime, courseType, hoursPerDay, breakTime]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const scheduleData = {
      courseType,
      totalHours,
      startDate,
      endDate,
      selectedDays,
      hoursPerDay,
      breakTime,
      startTime,
      endTime,
    };
    console.log(scheduleData);
    onClose();
  };

  return (
    <div className="modal">
      <form className="modal-content" onSubmit={handleSubmit}>
        <h2>Редактирование расписания</h2>

        <label>Тип часов:</label>
        <select value={courseType} onChange={(e) => setCourseType(e.target.value)}>
          <option value="academic">Академические (45 минут)</option>
          <option value="astronomic">Астрономические (60 минут)</option>
        </select>

        {/* Flexbox layout for day selection */}
        <div className="day-selection-row">
          <div className="day-group-select">
          <button type="button" onClick={() => handlePredefinedDays('pn_sr_pt')}>
              ПН/СР/ПТ
            </button>
            <button type="button" onClick={() => handlePredefinedDays('vt_cht')}>
              ВТ/ЧТ
            </button>
          </div>

          {/* Manual day selection */}
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

        {/* Other fields (Total Hours, Start/End Date, etc.) */}
        <label>Часов в курсе:</label>
        <div className="hours-control">
          <button type="button" onClick={() => setTotalHours(prev => Math.max(0, prev - 1))}>-</button>
          <input
            type="number"
            value={totalHours}
            onChange={(e) => setTotalHours(Math.max(0, parseInt(e.target.value)))}
            min="0"
          />
          <button type="button" onClick={() => setTotalHours(prev => prev + 1)}>+</button>
        </div>

        <label>Дата начала курса:</label>
        <input
          type="date"
          value={startDate.toISOString().substr(0, 10)}
          onChange={(e) => setStartDate(new Date(e.target.value))}
        />
        
        <label>Дата окончания курса:</label>
        <input
          type="date"
          value={endDate ? endDate.toISOString().substr(0, 10) : ''}
          onChange={(e) => setEndDate(new Date(e.target.value))}
        />

        <label>Часов в день:</label>
        <div className="hours-control">
          <button type="button" onClick={() => setHoursPerDay(prev => Math.max(1, prev - 1))}>-</button>
          <input
            type="number"
            value={hoursPerDay}
            onChange={(e) => setHoursPerDay(Math.max(1, parseInt(e.target.value)))}
            min="1"
          />
          <button type="button" onClick={() => setHoursPerDay(prev => prev + 1)}>+</button>
        </div>

        <label>Перерыв:</label>
        <select value={breakTime} onChange={(e) => setBreakTime(e.target.value)}>
          <option value="noBreak">Без перерыва</option>
          <option value="withBreak">С перерывом</option>
        </select>
        
        <label>Время начала:</label>
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        
        <label>Время окончания (автоматически рассчитано):</label>
        <input type="time" value={endTime} disabled />
        
        <button type="submit">Добавить расписание</button>
        <button type="button" onClick={onClose}>Отмена</button>
      </form>
    </div>
  );
};

export default ModalSchedule;

