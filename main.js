window.addEventListener("DOMContentLoaded",() => {
	const clock = new ProgressClock("#clock");
});

class ProgressClock {
	constructor(qs) {
		this.el = document.querySelector(qs);
		this.time = 0;
		this.updateTimeout = null;
		this.ringTimeouts = [];
		this.update();
	}
	getDayOfWeek(day) {
		switch (day) {
			case 1:
				return "Lunes";
			case 2:
				return "Martes";
			case 3:
				return "Miercoles";
			case 4:
				return "Jueves";
			case 5:
				return "Viernes";
			case 6:
				return "Sabado";
			default:
				return "Domingo";
		}
	}
	getMonthInfo(mo,yr) {
		switch (mo) {
			case 1:
				return { name: "Febrero", days: yr % 4 === 0 ? 29 : 28 };
			case 2:
				return { name: "Marzo", days: 31 };
			case 3:
				return { name: "Abril", days: 30 };
			case 4:
				return { name: "Mayo", days: 31 };
			case 5:
				return { name: "Junio", days: 30 };
			case 6:
				return { name: "Julio", days: 31 };
			case 7:
				return { name: "Agosto", days: 31 };
			case 8:
				return { name: "Setiembre", days: 30 };
			case 9:
				return { name: "Octubre", days: 31 };
			case 10:
				return { name: "Noviembre", days: 30 };
			case 11:
				return { name: "Diciembre", days: 31 };
			default:
				return { name: "Enero", days: 31 };
		}
	}
	update() {
		this.time = new Date();

		if (this.el) {
			// date and time
			const dayOfWeek = this.time.getDay();
			const year = this.time.getFullYear();
			const month = this.time.getMonth();
			const day = this.time.getDate();
			const hr = this.time.getHours();
			const min = this.time.getMinutes();
			const sec = this.time.getSeconds();
			const dayOfWeekName = this.getDayOfWeek(dayOfWeek);
			const monthInfo = this.getMonthInfo(month,year);
			const m_progress = sec / 60;
			const h_progress = (min + m_progress) / 60;
			const d_progress = (hr + h_progress) / 24;
			const mo_progress = ((day - 1) + d_progress) / monthInfo.days;
			const units = [
				{
					label: "w",
					value: dayOfWeekName
				},
				{
					label: "mo",
					value: monthInfo.name,
					progress: mo_progress
				},
				{
					label: "d", 
					value: day,
					progress: d_progress
				},
				{
					label: "h", 
					value: hr > 12 ? hr - 12 : hr,
					progress: h_progress
				},
				{
					label: "m", 
					value: min < 10 ? "0" + min : min,
					progress: m_progress
				},
				{
					label: "s", 
					value: sec < 10 ? "0" + sec : sec
				},
				{
					label: "ap",
					value: hr > 12 ? "PM" : "AM"
				}
			];

			// flush out the timeouts
			this.ringTimeouts.forEach(t => {
				clearTimeout(t);
			});
			this.ringTimeouts = [];

			// update the display
			units.forEach(u => {
				// rings
				const ring = this.el.querySelector(`[data-ring="${u.label}"]`);

				if (ring) {
					const strokeDashArray = ring.getAttribute("stroke-dasharray");
					const fill360 = "progress-clock__ring-fill--360";

					if (strokeDashArray) {
						// calculate the stroke
						const circumference = +strokeDashArray.split(" ")[0];
						const strokeDashOffsetPct = 1 - u.progress;

						ring.setAttribute(
							"stroke-dashoffset",
							strokeDashOffsetPct * circumference
						);

						// add the fade-out transition, then remove it
						if (strokeDashOffsetPct === 1) {
							ring.classList.add(fill360);

							this.ringTimeouts.push(
								setTimeout(() => {
									ring.classList.remove(fill360);
								}, 600)
							);
						}
					}
				}

				// digits
				const unit = this.el.querySelector(`[data-unit="${u.label}"]`);

				if (unit)
					unit.innerText = u.value;
			});
		}

		clearTimeout(this.updateTimeout);
		this.updateTimeout = setTimeout(this.update.bind(this),1e3);
	}
}