const runClocks = (function() {
	const local_clock_up = document.getElementById('time_string_left_top');
	const local_clock_down = document.getElementById('time_string_left_bottom');
	const forein_utc_string = document.getElementById('utc_string_right');
	const forein_clock_up = document.getElementById('time_string_right_top');
	const forein_clock_down = document.getElementById('time_string_right_bottom');
	const utc_scale = document.getElementById('utc_scale');
	const minus_button = document.getElementById('minus_button');
	const plus_button = document.getElementById('plus_button');
	const dayName = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
	const monthName = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
	let mouseDownInterval, isMouseDown = false, isOnClickEnable, timerInterval;

	window.onload = runClocks();

	/* События при нажатии кнопки "+" */
	plus_button.onmousedown = onMouseDown.bind(null, '+');

	plus_button.onmouseup = onMouseUp;

	plus_button.onmouseout = onMouseOut;

	plus_button.onmouseover = onMouseOver;

	plus_button.onclick = onClick.bind(plus_button, '+');

	/* События при нажатии кнопки "-" */
	minus_button.onmousedown = onMouseDown.bind(null, '-');

	minus_button.onmouseup = onMouseUp;

	minus_button.onmouseout = onMouseOut;

	minus_button.onmouseover = onMouseOver;

	minus_button.onclick = onClick.bind(minus_button, '-');

	/* Функции событий */
	function onMouseDown(sign) {
		clearInterval(mouseDownInterval);

		isMouseDown = true;
		
		mouseDownInterval = setInterval(() => {	//отвечает за плавное переключение значения UTC при зажатии кнопок "+/-"
			isOnClickEnable = false;
			
			switch (sign) {
				case '+': 
					if (utc_scale.value > 13) {
						clearInterval(mouseDownInterval);
						return;
					}

					utc_scale.value++;
					break;

				case '-':
					if (utc_scale.value < -11) {
						clearInterval(mouseDownInterval);
						return;
					}

					utc_scale.value--;
					break;
			}
		}, 250);
	}

	function onMouseUp() {
		clearInterval(mouseDownInterval);
		
		isMouseDown = false;
	}

	function onMouseOut() {
		clearInterval(mouseDownInterval);
		
		if (isMouseDown) isMouseDown = false;
	}

	function onMouseOver() {
		if (isMouseDown) {
			isOnClickEnable = false;
		} else {
			isOnClickEnable = true;
		}
	}

	function onClick(sign) {
		isMouseDown = false;
		
		if (isOnClickEnable && (sign === '+')) {
			this.nextElementSibling.stepUp();
		}

		if (isOnClickEnable && (sign ==='-')) {
			this.previousElementSibling.stepDown();
		}
		
		isOnClickEnable = true;
	}
	
	/*
	Главная функция
	*/
	function runClocks(timezone) {
		clearInterval(timerInterval); //сброс предыдущих таймеров для предотовращения дублирования

		let timeNow, offset, difference;
		const ms = 3600000; //константа для перевода часов в миллисекунды

		showTime('local');

		offset = timeNow.getTimezoneOffset() * 60000; //разница между местным временем и UTC-0 переведенная в миллисекунды
		switch(timezone) {
			case undefined:
				timerInterval = setInterval(() => { //отображение локального времени при первичной загрузке страницы
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
		
		if (utc_scale.value >= 0) {
			forein_utc_string.innerHTML = `UTC+${utc_scale.value}`;
		} else {
			forein_utc_string.innerHTML = `UTC${utc_scale.value}`;
		}

		showTime('forein');

		timerInterval = setInterval(() => { //синхронное отображение локального и заграничного времени
			showTime('local');
			showTime('forein');
		}, 1000);
		
		/* 
		Вспомогательная функция, 
		отвечающая за отображение местного или заграничного времени в соответствующих блоках 
		*/
		function showTime(location) {
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