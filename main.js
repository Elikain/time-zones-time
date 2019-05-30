const runClocks = (function() {
	const local_clock_up = document.getElementById('time_string_left_top');
	const local_clock_down = document.getElementById('time_string_left_bottom');
	const forein_clock_up = document.getElementById('time_string_right_top');
	const forein_clock_down = document.getElementById('time_string_right_bottom');
	const utc_scale = document.getElementById('utc_scale');
	const dayName = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
	const monthName = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
	let timer;

	window.onload = runClocks();

	function runClocks(timezone) {
		clearInterval(timer); //сброс предыдущих таймеров для предотовращения дублирования

		let timeNow, offset, difference;
		const ms = 3600000; //константа для перевода часов в миллисекунды

		showTime('local');

		offset = timeNow.getTimezoneOffset() * 60000; //разница между местным временем и UTC-0 переведенная в миллисекунды
		switch(timezone) {
			case undefined:
				timer = setInterval(() => { //отображение локального времени при первичной загрузке страницы
					showTime('local');
				}, 1000);
				return;

			case 'cest':
				difference = offset + 2 * ms;
				break;

			case 'pdt':
				difference = offset - 7 * ms;
				break;

			case 'mdt':
				difference = offset - 6 * ms;
				break;

			case 'edt':
				difference = offset - 4 * ms;
				break;
			
			case 'custom':
				difference = offset + utc_scale.value * ms;
				break;
		}

		showTime('forein');

		timer = setInterval(() => { //синхронное отображение локального и заграничного времени
			showTime('local');
			showTime('forein');
		}, 1000);
		

		function showTime(location) { //отвечает за отображение местного или заграничного времени в соответствующих блоках
			let clock_up, clock_down;
			
			if(location === 'local') {
				clock_up = local_clock_up;
				clock_down = local_clock_down;
				timeNow = new Date();
			} else if(location === 'forein') {
				clock_up = forein_clock_up;
				clock_down = forein_clock_down;
				timeNow = new Date(new Date().getTime() + difference);
			} else {
				throw new Error('Wrong location');
			}

			clock_up.innerHTML = timeNow.toLocaleTimeString();
			clock_down.innerHTML = `${dayName[timeNow.getDay()]}, ${timeNow.getDate()} ${monthName[timeNow.getMonth()]} ${timeNow.getFullYear()} г.`;
		}
	}

	return runClocks;
})();