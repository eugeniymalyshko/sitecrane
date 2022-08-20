'use strict'
/*------------------------------ IBG --------------------------------------*/
function ibg(){
let ibg = document.querySelectorAll(".ibg");
	for (var i = 0; i < ibg.length; i++) {
		if(ibg[i].querySelector('img')){
			ibg[i].style.backgroundImage = 'url('+ibg[i].querySelector('img').getAttribute('src')+')';
		}
	}
}
ibg();
/*-------------------------- Menu Burger ------------------------------------*/
const menuBurger = document.querySelector('.icon-menu');
const menuBody = document.querySelector('.menu__body');

if (menuBurger) {
	menuBurger.addEventListener('click', function () {
		document.body.classList.toggle('_lock');
		menuBurger.classList.toggle('_active');
		menuBody.classList.toggle('_active');

	});
}
/*--------------------------- Scroll to -------------------------------------*/
const menuLinks = document.querySelectorAll('._scroll[data-goto]');
if (menuLinks.length > 0) {
	menuLinks.forEach(menuLink => {
		menuLink.addEventListener('click', onMenuLinkClick);
	});
	
	function	onMenuLinkClick(e) {
		const menuLink = e.target;
		if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto));
		const goToBlock = document.querySelector(menuLink.dataset.goto);
		const goToBlockValue = goToBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;

		if (menuBurger.classList.contains('_active')) {
			document.body.classList.remove('_lock');
			menuBurger.classList.remove('_active');
			menuBody.classList.remove('_active');
		}

		window.scrollTo ({
			top: goToBlockValue,
			behavior: 'smooth'
		});
		e.preventDefault();
	}
} 
/*------------------------------- Form ----------------------------------------*/
const form = document.getElementById('form');
const reqFields = document.querySelectorAll('._req');
const formAnsver = document.querySelector('.contact__success span');
let progressLine = document.querySelector('.form__progress');
let progressPagination = document.querySelector('.form__pagination');

document.addEventListener('DOMContentLoaded', function () {
	let quantity = 0;
	
	for (let index = 0; index < reqFields.length; index++) {
		const field = reqFields[index];
		field.addEventListener('change', function (e) {
			if (field.value != '') {
				quantity++;
				progressLine.setAttribute('value', quantity);
			}else if (field.value === '') {
				quantity--;
				progressLine.setAttribute('value', quantity);
			}
			if (progressLine.getAttribute('value') == 1) {
				progressPagination.innerHTML = '2/3 questions remaining';
			} else if (progressLine.getAttribute('value') == 2) {
				progressPagination.innerHTML = '1/3 questions remaining';
			} else if (progressLine.getAttribute('value') == 3) {
				progressPagination.innerHTML = '0/3 questions remaining';
			}else {
				progressPagination.innerHTML = '3/3 questions remaining';
			}
		});
	}
	form.addEventListener('submit', formSend);

	async function formSend(e) {
		e.preventDefault();
		let error = formValidate(form);
		let formData = new FormData(form);

		if (error === 0) {
			form.classList.add('_sending');
			let response = await fetch('sendmail.php', {
				method: 'POST',
				body: formData
			});
			if (response.ok) {
				let result = await response.json();
				formAnsver.innerHTML = result.message;
				setTimeout(function () {
					formAnsver.innerHTML = '';
					progressPagination.innerHTML = '3/3 questions remaining';
					progressLine.setAttribute('value', 0);
				}, 10000);
				form.reset();
				form.classList.remove('_sending');
			} else {
				formAnsver.innerHTML = '<span style=" color: red;">Something went wrong, please try again later</span>';
				form.classList.remove('_sending');
				setTimeout(function () {
					formAnsver.innerHTML = '';
				}, 10000);
			}
		}
	}

	function formValidate(form) {
		let error = 0
		for (let index = 0; index < reqFields.length; index++) {
			const input	= reqFields[index]
			formRemoveError(input);

			if (input.classList.contains('_email')) {
				if (emailTest(input)) {
					formAddError(input);
					error++;
				}
			}else {
				if (input.value === '') {
					formAddError(input);
					error++;
				}
			}
		}
		return error;
	}
	
	function formAddError(input) {
		input.parentElement.classList.add('_error');
		input.classList.add('_error');
		input.parentElement.children[2].classList.add('_error');
	}
	
	function formRemoveError(input) {
		input.parentElement.classList.remove('_error');
		input.classList.remove('_error');
		input.parentElement.children[2].classList.remove('_error');
	}

	function emailTest(input) {
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
	}
});
//=======================================================================================