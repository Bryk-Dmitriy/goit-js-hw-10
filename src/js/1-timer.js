// Описаний в документації
import flatpickr from "flatpickr";
// Додатковий імпорт стилів
import "flatpickr/dist/flatpickr.min.css";
// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";

let userSelectedDate = null;
const dateInput = document.querySelector('#datetime-picker')
const startButton = document.querySelector('[data-start]');
const daysElement = document.querySelector('[data-days]');
const hoursElement = document.querySelector('[data-hours]');
const minutesElement = document.querySelector('[data-minutes]');
const secondsElement = document.querySelector('[data-seconds]');

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
     const selectedDate = selectedDates[0];
        if (selectedDate <= new Date()) {
            iziToast.error({
                title: 'Error',
                message: 'Illegal operation',
                position: 'topRight',
            });
            startButton.disabled = true;
        } else {
            userSelectedDate = selectedDate;
            startButton.disabled = false;
        }
    },
};
flatpickr("#datetime-picker", options);

startButton.addEventListener('click', () => {
    startButton.disabled = true;
    dateInput.disabled = true;

    const timerInterval = setInterval(() => {
        const now = new Date();
        const timeDifference = userSelectedDate - now;

        if (timeDifference < 0) {
            clearInterval(timerInterval);
            iziToast.show({
                color: 'green',
                title: 'Complete',
                message: 'Countdown finished!',
                position: 'topRight'
            });
            dateInput.disabled = false;
            return;
        }

        const { days, hours, minutes, seconds } = convertMs(timeDifference);

        daysElement.textContent = addLeadingZero(days);
        hoursElement.textContent = addLeadingZero(hours);
        minutesElement.textContent = addLeadingZero(minutes);
        secondsElement.textContent = addLeadingZero(seconds);
    }, 1000);
});

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
};

function addLeadingZero(value) {
    return String(value).padStart(2, '0');
};