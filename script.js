const PAIR_DURATION = 4800000 // В миллисекундах

const PAIRS_HOURSTART = [8, 10, 12, 13];
const PAIRS_MINSTART = [45, 25, 5, 35];
const BREAKS_HOURSTART = [8 ,10, 11, 13];
const BREAKS_MINSTART = [25 ,5, 45, 25];

const SATURDAY_PAIRS_HOURSTART = [8, 10, 11, 13];
const SATURDAY_PAIRS_MINSTART = [45, 10, 35, 0];
const SATURDAY_BREAKS_HOURSTART = [8 ,10, 11, 12];
const SATURDAY_BREAKS_MINSTART = [35 ,0, 25, 50];

const line = document.getElementById('progress_line');
let timeLeft = document.getElementById('timerLeft');
let timePassed = document.getElementById('timerPassed');
let title = document.getElementById('title');
let test = document.getElementById('test');
let sticker = document.getElementById('img');

function padTo2(num) {
    if (num === 0) return '00'
    if (num>=10) return `${num}`
    return `0${num}`
}

function getTimeFormatted(date, beforeS){       // beforeS = 'Passed' || 'Left'
    date = new Date(Math.abs(date.getTime()));
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    let seconds = date.getUTCSeconds();
    let s = '';
    if (beforeS == 'Left' && seconds != 0 && minutes !=0) {
        minutes += 1;
    }
    if (minutes == 0 && hours == 0)
        s += `${seconds} сек.`;
    if (hours != 0) {
        s += `${hours} час`;
        if (minutes != 0) s += ' ';
    }
    if (minutes != 0) {
        if (minutes % 10 == 1 && (minutes/100).toFixed(1) != 0.1)
            s += `${minutes} минута`;
        else if ((minutes % 10 > 1 && minutes % 10 < 5) && (minutes/100).toFixed(1) != 0.1)
            s += `${minutes} минуты`;
        else 
            s += `${minutes} минут`;
    }
    if (beforeS == 'Passed') {
        if (s.includes('час'))
            timePassed.innerHTML = 'Прошел '+s;
        else if (s.includes('минута'))
            timePassed.innerHTML = 'Прошла '+s;
        else if (s.includes('минут'))
            timePassed.innerHTML = 'Прошло '+s;
        else if (s.includes('сек.'))
            timePassed.innerHTML = 'Прошло '+s;
    }
    else if (beforeS == 'Left') {
        if (s.includes('час'))
            timeLeft.innerHTML = 'Остался '+s;
        else if (s.includes('минута'))
            timeLeft.innerHTML = 'Осталась '+s;
        else if (s.includes('минут'))
            timeLeft.innerHTML = 'Осталось '+s;
        else if (s.includes('сек.'))
            timeLeft.innerHTML = 'Осталось '+s;
    }
    // return `${padTo2(hours)}:${padTo2(minutes)}:${padTo2(seconds)}`;
}

function updatePairProgress(hourStart, minStart) {
    let now = new Date();
    let start = new Date();
    start.setHours(hourStart, minStart, 0);
    let end = new Date();
    end.setHours(start.getHours() + 1, start.getMinutes() + 20, 0);
    // timePassed.innerHTML = 'Прошло ' + getTimeFormatted(new Date(start - now));
    // timeLeft.innerHTML = 'Осталось ' + getTimeFormatted(new Date(end - now));
    getTimeFormatted(new Date(start - now), 'Passed');
    getTimeFormatted(new Date(end - now), 'Left');
    let progress = (Math.abs(start - now))/PAIR_DURATION * 100;
    line.style.width = `${progress}%`
}

function updateBreakProgress(hourBreakStart, minBreakStart, breakDuration) {        // breakDuration в минутах
    let now = new Date();
    let start = new Date();
    start.setHours(hourBreakStart, minBreakStart, 0);
    let end = new Date();
    end.setHours(start.getHours(), start.getMinutes() + breakDuration, 0);
    title
    // timePassed.innerHTML = 'Прошло ' + getTimeFormatted(new Date(start - now))
    // timeLeft.innerHTML = 'Осталось ' + getTimeFormatted(new Date(end - now));
    getTimeFormatted(new Date(start - now), 'Passed');
    getTimeFormatted(new Date(end - now), 'Left');
    let progress = (Math.abs(start-now))/(breakDuration*60000)*100
    line.style.width = `${progress}%`;
}

function getTime(PairHourArray, PairMinArray, breakHourArray, breakMinArray) {
    let now = new Date();
    let nowTime = (now.getHours()*60+now.getMinutes())*60000+now.getSeconds();
    if (nowTime < (8*60+25)*60000) {
        timePassed.innerHTML = 'Хорошего';
        timeLeft.innerHTML = 'дня!';
        line.style.width = '0%';
    }
    for (let i = 0; i<4; i++) {
        let start = (PairHourArray[i]*60 + PairMinArray[i])*60000;
        let end = start + PAIR_DURATION;
        let startBreak = (breakHourArray[i]*60 + breakMinArray[i])*60000;

        if (i < 3  &&  PairHourArray != SATURDAY_PAIRS_HOURSTART) {
            var duration = 20;
            var endBreak = startBreak + duration*60000;
        } else {
            var duration = 10;
            var endBreak = startBreak + duration*60000;
        }

        if ( nowTime >= start && nowTime < end ) {
            let endHour = Math.floor(end/3600000);
            let endMin = (end/60000)-endHour*60
            title.innerHTML = `${i+1} пара – ${PairHourArray[i]}:${padTo2(PairMinArray[i])} - ${endHour}:${padTo2(endMin)}`
            updatePairProgress(PairHourArray[i], PairMinArray[i]);
            return;

        } else if ( nowTime >= startBreak && nowTime < endBreak )  {
            title.innerHTML = `Перемена – ${duration} минут`
            updateBreakProgress(breakHourArray[i], breakMinArray[i], duration);
            return;

        } else {
            timePassed.innerHTML = 'Пары';
            timeLeft.innerHTML = 'кончились!';
            line.style.width = '100%';
        }
    }
}

let today = new Date().getDay();
if (today != 6 && today !=0) {       // добавь != воскресенье
    setInterval(getTime, 1000, PAIRS_HOURSTART, PAIRS_MINSTART, BREAKS_HOURSTART, BREAKS_MINSTART);
} else if (today == 6) {
    setInterval(getTime, 1000, SATURDAY_PAIRS_HOURSTART, SATURDAY_PAIRS_MINSTART, SATURDAY_BREAKS_HOURSTART, SATURDAY_BREAKS_MINSTART);
}
else if (today == 0) {
    timePassed.innerHTML = 'Выходной!';
    timeLeft.innerHTML = '';
    line.style.width = '100%';
}
