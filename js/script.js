"use strict";

window.addEventListener("DOMContentLoaded", () => {
	// Slider

	const swiper = new Swiper('.swiper', {
	// Optional parameters
	direction: 'horizontal',
	loop: true,
	simulateTouch: false,

	// Navigation arrows
	navigation: {
		nextEl: '.swiper-button-forward',
		prevEl: '.swiper-button-back',
	},

	// Pagination 
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
		enabled: true,
	},

	// Autoplay
	autoplay: {
		delay: 2000,
		stopOnLastSlide: false,
		disableOnInteraction: false
	},
	speed: 500,

	// Breakpoints
	breakpoints: {
		769: {
		pagination: {
			enabled: false
		}
		},
		768: {
		navigation: {
			enabled: false
		}
		}
	}
	});

	// Tabs

  	const details = document.querySelectorAll(".item-catalog__details");
	const back = document.querySelectorAll(".item-catalog__back");
	const detailsLists = document.querySelectorAll(".item-catalog__list");
	const itemCatalogs = document.querySelectorAll(".item-catalog__body");

	const tabs = document.querySelectorAll(".catalog__tab");
	const catalogs = document.querySelectorAll(".catalog__content");

	function toggleSlide(index) {
		detailsLists[index].classList.toggle("item-catalog__list_active");
		itemCatalogs[index].classList.toggle("item-catalog__body_active");
	}

	details.forEach((item, index) => {
		item.addEventListener("click", (e) => {
			toggleSlide(index);
		});
	});

	back.forEach((item, index) => {
		item.addEventListener("click", (e) => {
			toggleSlide(index);
		});
	});

	function hideTabs() {
		tabs.forEach((item, index) => {
			if (item.classList.contains("catalog__tab_active")) {
				item.classList.remove("catalog__tab_active");
				catalogs[index].classList.remove("catalog__content_active");
			}
		});
	}

	function showActiveTab(index) {
		tabs[index].classList.add("catalog__tab_active");
		catalogs[index].classList.add("catalog__content_active");
	}

	tabs.forEach((item, index) => {
		item.addEventListener("click", (e) => {
			if (!item.classList.contains("catalog__tab_active")) {
				hideTabs();
				showActiveTab(index);
			}		
		});
	});

	// Modal

	const consultationsBtn = document.querySelectorAll("[data-modal=consultation]");
	const ordersBtn = document.querySelectorAll("[data-modal=order]");

	const overlay = document.querySelector(".overlay");
	const consultationModal = document.querySelector("#consultation");
	const orderModal = document.querySelector("#order");

	const modalClose = document.querySelectorAll(".modal__close");
	
	function showConsultationsModal() {
		overlay.style.display = "block";
		consultationModal.style.display = "block";
	}

	function showOrderModal(name) {
		orderModal.children[1].innerHTML = name;
		overlay.style.display = "block";
		orderModal.style.display = "block";
	}

	function closeAllModal() {
		overlay.style.display = "none";
		consultationModal.style.display = "none";
		orderModal.style.display = "none";

		let formReq = document.querySelectorAll("._req");
		
		for (let i = 0; i < formReq.length; i++) {
			const input = formReq[i];
			formRemoveError(input);
		}
	}

	consultationsBtn.forEach(item => {
		item.addEventListener("click", (e) => {
			showConsultationsModal();
		});
	});

	ordersBtn.forEach(item => {
		item.addEventListener("click", (e) => {
			const itemName = item.parentElement.parentElement.children[0].children[0].children[1].innerHTML;
			showOrderModal(itemName);
		});
	});

	modalClose.forEach(item => {
		item.addEventListener("click", (e) => {
			closeAllModal();
		});
	});

	// Form validation

	const forms = document.querySelectorAll(".form-feed");
	forms.forEach((form) => {
		form.addEventListener("submit", formSend);
	});

	async function formSend(event) {
		event.preventDefault();

		const form = event.target;
	
		let error = formValidate(form);

		let formData = new FormData(form);

		if (error === 0) {
			// тут відправка листів
		} else {
			// тут не пройдена валідація
		}
	}

	function formValidate(form) {
		let error = 0;
		let formReq = form.querySelectorAll("._req");
		
		for (let i = 0; i < formReq.length; i++) {
			const input = formReq[i];
			formRemoveError(input);

			if (input.classList.contains("form-feed__mail")) {
				if (!emailTest(input)) {
					formAddError(input);
					error++;
				}
			} else if (input.classList.contains("form-feed__phone")) {
				if (!phoneTest(input)) {
					formAddError(input);
					error++;
				}
			} else {
				if (input.value === "") {
					formAddError(input);
					error++;
				}
			}
		}

		return error;
	}

	function emailTest(input) {
		return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
	}

	function phoneTest(input) {
		return /^\+380\d{9}$/.test(input.value);
	}

	function formAddError(input) {
		input.parentElement.classList.add("_error");
		input.classList.add("_error");
	}

	function formRemoveError(input) {
		input.parentElement.classList.remove("_error");
		input.classList.remove("_error");
	}

	// Scroll Up

	const scrollUp = document.querySelector(".scroll-up");

	window.addEventListener("scroll", (e) => {
		if (window.scrollY > document.querySelector(".promo").offsetHeight + document.querySelector(".advantages").offsetHeight) {
			scrollUp.style.display = "block";
		} else {
			scrollUp.style.display = "none";
		}
	});

	// Smooth scroll

	const links = document.querySelectorAll('a[href^="#"]');

	links.forEach(link => {
		link.addEventListener("click", smoothScroll);
	});

	function smoothScroll(event) {
		event.preventDefault();

		const targetId = this.getAttribute('href');
		const targetElement = document.querySelector(targetId);

		if (targetElement) {
			const targetPosition = targetElement.offsetTop;

			window.scrollTo({
				top: targetPosition,
				behavior: 'smooth'
			});
		}
	}

	// Animation

	new WOW().init();
});

