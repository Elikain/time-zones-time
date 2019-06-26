const runClocks = (function() {
	const localClockUp = document.getElementById('time_string_left_top');
	const localClockDown = document.getElementById('time_string_left_bottom');
	const foreinUtcString = document.getElementById('utc_string_right');
	const foreinClockUp = document.getElementById('time_string_right_top');
	const foreinClockDown = document.getElementById('time_string_right_bottom');
	const utcScale = document.getElementById('utc_scale');
	const minusButton = document.getElementById('minus_button');
	const plusButton = document.getElementById('plus_button');
	const resetButton = document.getElementById('reset_button');
	const dayName = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
	const monthName = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
	let mouseDownInterval, isMouseDown = false, isOnClickEnable, timerInterval;

	window.onload = runClocks();

	/* События при нажатии кнопки "+" */
	plusButton.onmousedown = onMouseDown.bind(null, '+');

	plusButton.onmouseup = onMouseUp;

	plusButton.onmouseout = onMouseOut;

	plusButton.onmouseover = onMouseOver;

	plusButton.onclick = onClick.bind(plusButton, '+');

	plusButton.addEventListener('touchstart', onMouseDown.bind(null, '+'));

	plusButton.addEventListener('touchend', onTouchEnd);

	/* События при нажатии кнопки "-" */
	minusButton.onmousedown = onMouseDown.bind(null, '-');

	minusButton.onmouseup = onMouseUp;

	minusButton.onmouseout = onMouseOut;

	minusButton.onmouseover = onMouseOver;

	minusButton.onclick = onClick.bind(minusButton, '-');

	minusButton.addEventListener('touchstart', onMouseDown.bind(null, '-'));

	minusButton.addEventListener('touchend', onTouchEnd);

	/* Событие при нажатии кнопки "reset" */
	resetButton.addEventListener('click', function() {
		utcScale.value = 0;
	});

	/* Функции событий */
	function onMouseDown(sign) {
		clearInterval(mouseDownInterval);

		isMouseDown = true;
		
		mouseDownInterval = setInterval(() => {	//отвечает за плавное переключение значения UTC при зажатии кнопок "+/-"
			isOnClickEnable = false;
			
			switch (sign) {
				case '+': 
					if (utcScale.value > 13) {
						clearInterval(mouseDownInterval);
						return;
					}

					utcScale.value++;
					break;

				case '-':
					if (utcScale.value < -11) {
						clearInterval(mouseDownInterval);
						return;
					}

					utcScale.value--;
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

	function onTouchEnd() {
		clearInterval(mouseDownInterval);

		isOnClickEnable = true;
	}
	
	/*
	Главная функция, устанавливает и отображает время
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

			case 'pdt':
				utcScale.value = -7;
				difference = offset - 7 * ms;
				break;

			case 'mdt':
				utcScale.value = -6;
				difference = offset - 6 * ms;
				break;

			case 'edt':
				utcScale.value = -4;
				difference = offset - 4 * ms;
				break;

			case 'cest':
				utcScale.value = 2;
				difference = offset + 2 * ms;
				break;
			
			case 'custom':
				difference = offset + utcScale.value * ms;
				break;
		}
		
		if (utcScale.value >= 0) {
			foreinUtcString.innerHTML = `UTC+${utcScale.value}`;
		} else {
			foreinUtcString.innerHTML = `UTC${utcScale.value}`;
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
			let clockUp, clockDown;
			
			if(location === 'local') {
				clockUp = localClockUp;
				clockDown = localClockDown;
				timeNow = new Date();
			} else if(location === 'forein') {
				clockUp = foreinClockUp;
				clockDown = foreinClockDown;
				timeNow = new Date(new Date().getTime() + difference);
			} else {
				throw new Error('Wrong location');
			}

			clockUp.innerHTML = timeNow.toLocaleTimeString();
			clockDown.innerHTML = `${dayName[timeNow.getDay()]}, ${timeNow.getDate()} ${monthName[timeNow.getMonth()]} ${timeNow.getFullYear()} г.`;
		}
	}

	return runClocks;
})();